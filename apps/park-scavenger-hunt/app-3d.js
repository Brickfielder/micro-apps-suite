import * as THREE from '../fresh-market/vendor/three.module.js';

// Setup state
const appState = {
  gameStarted: false,
  selectedItemId: null,
  sceneReady: false,
  keys: new Set(),
  lastTime: 0,
  nearItem: null,
  toastTimer: null
};

// Start location facing North (rotation = 0)
const player = {
  x: 0,
  z: 7.2,
  rotation: 0,
  radius: 0.42
};

let renderer;
let scene;
let camera;
let canvas;
let targetMeshes = [];
let staticMeshes = [];
let colliders = [];
let fountainParticles = [];
let skyArrow;
let skyArrowMaterial;
let swayingFoliage = [];
let aoTexture;
let clouds = [];
let grassTexture;
let gravelTexture;
let barkTexture;
let woodTexture;
let graniteTexture;
let waterTexture;
let leafTexture;
let strawTexture;

// Scavenger target objects positions (coordinated to left-side bias)
const targetsData = [
  { id: 'picnic-basket', name: 'Picnic Basket', x: -3.6, z: 4.8, color: 0xd32f2f, shape: 'basket', desc: 'A checkerboard picnic basket.' },
  { id: 'binoculars', name: 'Binoculars', x: -4.5, z: 2.0, color: 0x37474f, shape: 'cylinders', desc: 'Black binoculars sitting on a bench.' },
  { id: 'red-flower', name: 'Red Rose Bush', x: -3.5, z: -4.2, color: 0xd50000, shape: 'flowers', desc: 'Blooming red rose bush.' },
  { id: 'lost-key', name: 'Lost House Key', x: -2.2, z: -5.4, color: 0xffd54f, shape: 'key', desc: 'Shiny brass key.' },
  { id: 'thermos', name: 'Warm Thermos', x: 4.6, z: 0.8, color: 0x90a4ae, shape: 'thermos', desc: 'Warm metal beverage container.' }, // Right side target
  { id: 'camera', name: 'Vintage Camera', x: -0.8, z: -1.0, color: 0x212121, shape: 'camera', desc: 'Vintage camera resting on the fountain wall.' },
  { id: 'wallet', name: 'Lost Wallet', x: -10.5, z: 5.6, color: 0x5d4037, shape: 'wallet', desc: 'A brown leather pocket wallet.' }, // NW bench item (Left)
  { id: 'sketchbook', name: 'Artist Sketchbook', x: -8.5, z: -8.8, color: 0xb0bec5, shape: 'sketchbook', desc: 'A hardbound sketchbook.' }, // SW flowerbed item (Left)
  { id: 'water-flask', name: 'Water Flask', x: 9.8, z: -8.4, color: 0x00acc1, shape: 'flask', desc: 'A blue water flask.' }, // SE bench item (Right)
  { id: 'sun-hat', name: 'Straw Sun Hat', x: 8.5, z: 9.2, color: 0xffe082, shape: 'hat', desc: 'A straw sun hat.' } // NE grass item (Right)
];

// Elements reference
const els = {
  canvas: document.getElementById('park-canvas'),
  itemPanel: document.getElementById('item-panel'),
  interactionHint: document.getElementById('interaction-hint')
};

// Initialize scene
function initScene() {
  canvas = els.canvas;
  scene = new THREE.Scene();
  
  // High aesthetic fog and skies
  scene.background = new THREE.Color(0xb3e5fc); // sky blue
  scene.fog = new THREE.FogExp2(0xb3e5fc, 0.015); // soft haze
  
  camera = new THREE.PerspectiveCamera(58, canvas.clientWidth / canvas.clientHeight, 0.1, 80);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // soft shadows
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  
  // Initialize dynamic procedural textures
  grassTexture = createGrassTexture();
  gravelTexture = createGravelTexture();
  barkTexture = createBarkTexture();
  woodTexture = createWoodTexture();
  graniteTexture = createGraniteTexture();
  waterTexture = createWaterTexture();
  leafTexture = createLeafTexture();
  strawTexture = createStrawTexture();
  
  aoTexture = createAOTexture(); // Create soft contact shadow texture
  
  addLighting();
  addScenery();
  addSkyArrow();
  addClouds();
  addScavengerTargets();
  
  bindEvents();
  resizeRenderer();
  
  appState.sceneReady = true;
  appState.lastTime = performance.now();
  requestAnimationFrame(tick);
}

// Lighting setup (sunlight and hemispherical environment glow)
function addLighting() {
  const hemi = new THREE.HemisphereLight(0xffffff, 0x9ccc65, 2.0); // white sky to grass-green ground
  scene.add(hemi);
  
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(12, 22, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 1024;
  sun.shadow.mapSize.height = 1024;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 40;
  
  const d = 16;
  sun.shadow.camera.left = -d;
  sun.shadow.camera.right = d;
  sun.shadow.camera.top = d;
  sun.shadow.camera.bottom = -d;
  
  scene.add(sun);
}

// Generate beautiful procedural park
function addScenery() {
  // Grassy lawn ground (widened to 36x36)
  const grassGeo = new THREE.PlaneGeometry(36, 36);
  const grassMat = new THREE.MeshStandardMaterial({ map: grassTexture, roughness: 0.9, metalness: 0.05 });
  const grass = new THREE.Mesh(grassGeo, grassMat);
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  scene.add(grass);
  
  // Winding Gravel Pathways (extended)
  addPath(0, 0, 1.4, 30, 'vertical'); // central walkway
  addPath(0, 0, 30, 1.3, 'horizontal'); // crosswalk pathway
  
  // Secondary pathways in the expanded corners
  addPath(-10, 6.0, 1.3, 16, 'horizontal');
  addPath(9, -8.0, 1.3, 18, 'horizontal');
  
  // Circular Central Fountain
  addFountain();
  
  // Outer wooden fences (boundary widened to 36x36)
  addFence(0, 17.8, 36, 0.15); // North wall
  addFence(0, -17.8, 36, 0.15); // South wall
  addFence(-17.8, 0, 0.15, 36); // West wall
  addFence(17.8, 0, 0.15, 36); // East wall
  
  // Scenic Hedge Barriers (Structured visual blocks)
  addHedge(-5.0, 9.0, 3.5, 0.9, 0.7);
  addHedge(5.0, -9.0, 3.5, 0.9, 0.7);
  addHedge(-9.0, -5.0, 0.7, 0.9, 3.5);
  addHedge(9.0, 5.0, 0.7, 0.9, 3.5);
  
  // Park Trees (Original 6 + 6 expanded trees)
  addTree(5.5, 5.2, 0.85);
  addTree(-5.2, 5.8, 0.95);
  addTree(6.2, -5.6, 0.8);
  addTree(-6.4, -5.2, 0.9);
  addTree(7.5, 0.5, 0.95);
  addTree(-7.8, -0.4, 0.85);
  
  // Expanded Outer Trees
  addTree(-12.5, 12.2, 1.1); // North-West far tree (Left)
  addTree(-11.2, -12.8, 0.9); // South-West far tree (Left)
  addTree(12.2, 11.5, 1.0); // North-East far tree
  addTree(11.4, -12.4, 0.85); // South-East far tree
  addTree(-14.2, 1.2, 1.05); // Far West tree (Left)
  addTree(13.8, -4.5, 0.95); // Far East tree
  
  // Benches (Original 2 benches + 2 expanded corner benches)
  addBench(4.6, 0.8, Math.PI / 2); // East side bench
  addBench(-4.5, 2.0, -Math.PI / 2); // West side bench
  addBench(-10.5, 6.0, -Math.PI / 4); // NW angled bench (Left)
  addBench(9.8, -8.0, Math.PI / 4); // SE angled bench
  
  // Colorful Flowerbeds (Original 2 + 2 expanded flowerbeds)
  addFlowerbed(3.8, -3.2, 1.8, 1.8);
  addFlowerbed(-3.5, -4.2, 2.0, 1.6);
  addFlowerbed(-8.5, -9.2, 2.0, 2.0); // SW flowerbed (Left)
  addFlowerbed(8.5, 9.2, 2.2, 1.8); // NE flowerbed
}

function addPath(x, z, w, h, direction) {
  const pathGeo = direction === 'vertical' ? new THREE.PlaneGeometry(w, h) : new THREE.PlaneGeometry(h, w);
  const pathMat = new THREE.MeshStandardMaterial({ map: gravelTexture, roughness: 0.8, metalness: 0.1 });
  const path = new THREE.Mesh(pathGeo, pathMat);
  path.rotation.x = -Math.PI / 2;
  path.position.set(x, 0.015, z);
  path.receiveShadow = true;
  scene.add(path);
}

function addFence(x, z, w, d) {
  const fence = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.8, d),
    new THREE.MeshStandardMaterial({ map: barkTexture, roughness: 0.9, metalness: 0.05 })
  );
  fence.position.set(x, 0.4, z);
  fence.castShadow = true;
  fence.receiveShadow = true;
  scene.add(fence);
  colliders.push({ x, z, width: w, depth: d });
}

function addHedge(x, z, w, h, d) {
  const hedgeMat = new THREE.MeshStandardMaterial({
    map: leafTexture,
    color: 0x1b5e20,
    roughness: 0.88
  });
  const hedge = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), hedgeMat);
  hedge.position.set(x, h/2, z);
  hedge.castShadow = true;
  hedge.receiveShadow = true;
  scene.add(hedge);
  colliders.push({ x, z, width: w, depth: d });
}

function addTree(x, z, scale) {
  const tree = new THREE.Group();
  tree.position.set(x, 0, z);
  
  // Soft contact shadow (AO) under tree base
  if (aoTexture) {
    const shadowGeo = new THREE.PlaneGeometry(1.6 * scale, 1.6 * scale);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: aoTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, 0.012, 0); // slightly above ground
    tree.add(shadow);
  }
  
  // Trunk
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.26, 1.8 * scale, 12),
    new THREE.MeshStandardMaterial({ map: barkTexture, roughness: 0.95 })
  );
  trunk.position.set(0, 0.9 * scale, 0);
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);
  
  // Realistic branching
  const branch1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, 0.8 * scale, 8),
    new THREE.MeshStandardMaterial({ map: barkTexture, roughness: 0.95 })
  );
  branch1.position.set(0.3 * scale, 1.4 * scale, 0.1 * scale);
  branch1.rotation.z = -0.55;
  branch1.castShadow = true;
  tree.add(branch1);
  
  const branch2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.11, 0.8 * scale, 8),
    new THREE.MeshStandardMaterial({ map: barkTexture, roughness: 0.95 })
  );
  branch2.position.set(-0.3 * scale, 1.3 * scale, -0.2 * scale);
  branch2.rotation.z = 0.55;
  branch2.castShadow = true;
  tree.add(branch2);
  
  // Foliage canopies: Multi-shaded organic cluster configuration with leaf texture tinting
  const canMatL = new THREE.MeshStandardMaterial({ map: leafTexture, color: 0x66bb6a, roughness: 0.8 }); // light green
  const canMatM = new THREE.MeshStandardMaterial({ map: leafTexture, color: 0x388e3c, roughness: 0.82 }); // medium green
  const canMatD = new THREE.MeshStandardMaterial({ map: leafTexture, color: 0x1b5e20, roughness: 0.85 }); // dark green
  const canMatY = new THREE.MeshStandardMaterial({ map: leafTexture, color: 0x9ccc65, roughness: 0.8 }); // yellow-green
  
  const foliageGroup = new THREE.Group();
  
  const clusters = [
    { geo: new THREE.DodecahedronGeometry(1.05 * scale, 2), mat: canMatM, pos: [0, 2.3 * scale, 0] },
    { geo: new THREE.DodecahedronGeometry(0.85 * scale, 2), mat: canMatL, pos: [0.45 * scale, 2.7 * scale, 0.2 * scale] },
    { geo: new THREE.DodecahedronGeometry(0.85 * scale, 2), mat: canMatD, pos: [-0.45 * scale, 2.6 * scale, -0.2 * scale] },
    { geo: new THREE.DodecahedronGeometry(0.7 * scale, 2), mat: canMatY, pos: [0.1 * scale, 3.1 * scale, 0.3 * scale] },
    { geo: new THREE.DodecahedronGeometry(0.6 * scale, 2), mat: canMatL, pos: [-0.1 * scale, 2.2 * scale, 0.6 * scale] }
  ];
  
  clusters.forEach(c => {
    const leaf = new THREE.Mesh(c.geo, c.mat);
    leaf.position.set(...c.pos);
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    foliageGroup.add(leaf);
  });
  
  tree.add(foliageGroup);
  swayingFoliage.push({ mesh: foliageGroup, scale });
  
  scene.add(tree);
  colliders.push({ x, z, width: 0.65, depth: 0.65 });
}

function addBench(x, z, rotation) {
  const bench = new THREE.Group();
  bench.position.set(x, 0, z);
  bench.rotation.y = rotation;
  
  // Soft contact shadow (AO) under bench legs
  if (aoTexture) {
    const shadowGeo = new THREE.PlaneGeometry(2.3, 0.95);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: aoTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, 0.012, 0); // slightly above ground
    bench.add(shadow);
  }
  
  // Base slab (warm mahogany oak)
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.1, 0.6),
    new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.62 })
  );
  slab.position.set(0, 0.45, 0);
  slab.castShadow = true;
  slab.receiveShadow = true;
  bench.add(slab);
  
  // Backrest
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.4, 0.08),
    new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.65 })
  );
  back.position.set(0, 0.85, 0.26);
  back.castShadow = true;
  bench.add(back);
  
  // Legs (heavy cast iron look)
  [-0.7, 0.7].forEach(legX => {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.45, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.68, metalness: 0.4 })
    );
    leg.position.set(legX, 0.225, 0);
    leg.castShadow = true;
    bench.add(leg);
    
    // Backrest posts
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.5, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.7 })
    );
    post.position.set(legX, 0.7, 0.26);
    post.castShadow = true;
    bench.add(post);
  });
  
  scene.add(bench);
  colliders.push({ x, z, width: 1.9, depth: 0.75 });
}

function addFlowerbed(x, z, w, d) {
  // Heavy clay border wall
  const border = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.15, d),
    new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 })
  );
  border.position.set(x, 0.075, z);
  border.castShadow = true;
  border.receiveShadow = true;
  scene.add(border);
  
  // Flowers group
  const colors = [0xd50000, 0xffab00, 0xc51162, 0xaa00ff, 0x00e5ff];
  for (let i = 0; i < 24; i++) {
    const fx = x + (Math.random() - 0.5) * (w - 0.35);
    const fz = z + (Math.random() - 0.5) * (d - 0.35);
    const col = colors[Math.floor(Math.random() * colors.length)];
    
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 6, 6),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 })
    );
    flower.position.set(fx, 0.22, fz);
    flower.castShadow = true;
    scene.add(flower);
    
    // Detailed stem
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.15, 6),
      new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.9 })
    );
    stem.position.set(fx, 0.15, fz);
    scene.add(stem);
  }
}

function addFountain() {
  // Soft contact shadow (AO) under fountain base
  if (aoTexture) {
    const shadowGeo = new THREE.PlaneGeometry(4.0, 4.0);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: aoTexture,
      transparent: true,
      opacity: 0.88,
      depthWrite: false
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, 0.012, 0);
    scene.add(shadow);
  }

  // Circular stone base
  const outerWall = new THREE.Mesh(
    new THREE.CylinderGeometry(1.68, 1.68, 0.45, 32),
    new THREE.MeshStandardMaterial({ map: graniteTexture, roughness: 0.72, metalness: 0.1 })
  );
  outerWall.position.set(0, 0.225, 0);
  outerWall.castShadow = true;
  outerWall.receiveShadow = true;
  scene.add(outerWall);
  colliders.push({ x: 0, z: 0, width: 3.3, depth: 3.3 });
  
  // Ornamental stone lip
  const lip = new THREE.Mesh(
    new THREE.TorusGeometry(1.68, 0.08, 12, 32),
    new THREE.MeshStandardMaterial({ map: graniteTexture, roughness: 0.75, metalness: 0.1 })
  );
  lip.rotation.x = Math.PI / 2;
  lip.position.set(0, 0.45, 0);
  lip.castShadow = true;
  scene.add(lip);
  
  // Glass water sheet
  const water = new THREE.Mesh(
    new THREE.CylinderGeometry(1.58, 1.58, 0.05, 32),
    new THREE.MeshStandardMaterial({ map: waterTexture, roughness: 0.08, metalness: 0.95, transparent: true, opacity: 0.82 })
  );
  water.position.set(0, 0.38, 0);
  scene.add(water);
  
  // Center stone column tier
  const spoutBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.48, 0.25, 16),
    new THREE.MeshStandardMaterial({ map: graniteTexture, roughness: 0.75 })
  );
  spoutBase.position.set(0, 0.5, 0);
  spoutBase.castShadow = true;
  scene.add(spoutBase);

  const spout = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.28, 0.6, 12),
    new THREE.MeshStandardMaterial({ map: graniteTexture, roughness: 0.78 })
  );
  spout.position.set(0, 0.9, 0);
  spout.castShadow = true;
  scene.add(spout);
  
  // Expanded fountain particles (120 particles for full water cascade)
  const pCount = 120;
  for (let i = 0; i < pCount; i++) {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.024, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xe0f7fa, transparent: true, opacity: 0.85 })
    );
    p.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.6,
      Math.random() * 1.2 + 1.1,
      (Math.random() - 0.5) * 0.6
    );
    p.position.set(0, 1.2, 0);
    scene.add(p);
    fountainParticles.push(p);
  }
}

function addSkyArrow() {
  const group = new THREE.Group();
  group.position.set(0, 2.4, 1.2); // Center-south of the fountain, floating lower above the path
  group.name = 'sky-arrow';
  group.visible = false; // Starts invisible
  
  skyArrowMaterial = new THREE.MeshStandardMaterial({
    color: 0xff3d00,
    emissive: 0xff3d00,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    metalness: 0.1
  });
  
  // Cylinder shaft of the arrow, rotated Z-wise to lie horizontally along the X-axis
  const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 16);
  const shaft = new THREE.Mesh(shaftGeo, skyArrowMaterial);
  shaft.rotation.z = Math.PI / 2; // Lies horizontally along X
  shaft.position.x = 0.45; // Move to the right side (positive X)
  shaft.castShadow = true;
  group.add(shaft);
  
  // Cone head of the arrow, rotated Z-wise so its tip points in the negative X direction (left/West)
  const headGeo = new THREE.ConeGeometry(0.26, 0.45, 16);
  const head = new THREE.Mesh(headGeo, skyArrowMaterial);
  head.rotation.z = Math.PI / 2; // Tip points to -X (left)
  head.position.x = -0.225; // Move to the left side (negative X)
  head.castShadow = true;
  group.add(head);
  
  scene.add(group);
  skyArrow = group;
}

// Procedural Canvas ambient occlusion map generation
function createAOTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.42)');
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Volumetric cloud layer builder
function addClouds() {
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.95,
    metalness: 0.05,
    flatShading: true
  });
  
  // Create 4 distinct cloud clusters
  const cloudConfigs = [
    { x: -8, y: 11, z: -8, scale: 1.25 },
    { x: 8, y: 12, z: -4, scale: 1.4 },
    { x: -5, y: 11.5, z: 6, scale: 1.05 },
    { x: 7, y: 10.5, z: 8, scale: 1.35 }
  ];
  
  cloudConfigs.forEach(config => {
    const cloud = new THREE.Group();
    cloud.position.set(config.x, config.y, config.z);
    
    // Create organic cluster of 3 spheres
    const p1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85 * config.scale, 1), cloudMat);
    cloud.add(p1);
    
    const p2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6 * config.scale, 1), cloudMat);
    p2.position.set(0.65 * config.scale, -0.15 * config.scale, 0.2 * config.scale);
    cloud.add(p2);
    
    const p3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55 * config.scale, 1), cloudMat);
    p3.position.set(-0.65 * config.scale, -0.1 * config.scale, -0.2 * config.scale);
    cloud.add(p3);
    
    scene.add(cloud);
    clouds.push({ mesh: cloud, scale: config.scale });
  });
}

// Procedural high-aesthetic realistic grass noise generator
function createGrassTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Base grass green
  ctx.fillStyle = '#558b2f';
  ctx.fillRect(0, 0, size, size);
  
  // Blend blades
  for (let i = 0; i < 2800; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const h = Math.random() * 3 + 2;
    const w = Math.random() * 1 + 0.5;
    
    const r = Math.random();
    if (r < 0.45) ctx.fillStyle = '#689f38'; // lighter green
    else if (r < 0.8) ctx.fillStyle = '#33691e'; // dark green
    else ctx.fillStyle = '#7cb342'; // bright green
    
    ctx.fillRect(x, y, w, h);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 24);
  return texture;
}

// Procedural pebble gravel walkway texture generator
function createGravelTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Concrete aggregate base
  ctx.fillStyle = '#cfd8dc';
  ctx.fillRect(0, 0, size, size);
  
  // Multi-colored pebble scattering
  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2 + 0.8;
    
    const c = Math.random();
    if (c < 0.35) ctx.fillStyle = '#b0bec5';
    else if (c < 0.65) ctx.fillStyle = '#90a4ae';
    else if (c < 0.9) ctx.fillStyle = '#eceff1'; // limestone white
    else ctx.fillStyle = '#78909c';
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

// Procedural wood tree trunk bark texture generator
function createBarkTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size * 2;
  const ctx = canvas.getContext('2d');
  
  // Base deep trunk brown
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(0, 0, size, size * 2);
  
  // Vertical rough grooves
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#3e2723' : '#5d4037';
    const w = Math.random() * 4 + 2;
    const x = Math.random() * size;
    ctx.fillRect(x, 0, w, size * 2);
  }
  
  // Bark knots and dark noise dots
  for (let i = 0; i < 180; i++) {
    ctx.fillStyle = '#27120f';
    const x = Math.random() * size;
    const y = Math.random() * size * 2;
    ctx.fillRect(x, y, Math.random() * 2.5 + 1, Math.random() * 6 + 2);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  return texture;
}

// Procedural horizontal warm mahogany bench wood grain generator
function createWoodTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Reddish mahogany base
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(0, 0, size * 2, size);
  
  // Horizontal rich organic grain bands
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#705247' : '#a1887f';
    const h = Math.random() * 2 + 1;
    const y = Math.random() * size;
    ctx.fillRect(0, y, size * 2, h);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural dynamic granite stone texture generator
function createGraniteTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Slate stone base
  ctx.fillStyle = '#78909c';
  ctx.fillRect(0, 0, size, size);
  
  // Dark and light granite speckles
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillStyle = Math.random() < 0.52 ? '#37474f' : '#eceff1';
    ctx.fillRect(x, y, 1, 1);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// Procedural shimmering dynamic water surface wave generator
function createWaterTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Cyan water base
  ctx.fillStyle = '#00acc1';
  ctx.fillRect(0, 0, size, size);
  
  // Draw wave highlights
  ctx.strokeStyle = 'rgba(224, 247, 250, 0.7)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rx = Math.random() * 16 + 8;
    const ry = Math.random() * 6 + 3;
    ctx.ellipse(cx, cy, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// Procedural leaf texture with organic green veins
function createLeafTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Base lush leaf green
  ctx.fillStyle = '#2e7d32';
  ctx.fillRect(0, 0, size, size);
  
  // Subtle leaf vein pattern
  ctx.strokeStyle = '#1b5e20';
  ctx.lineWidth = 2;
  
  // Main central veins
  for (let i = 0; i < 4; i++) {
    const x = (i * size) / 3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  
  // Diagonal side veins
  ctx.strokeStyle = '#388e3c';
  ctx.lineWidth = 1;
  for (let i = 0; i < 15; i++) {
    const y = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (Math.random() - 0.5) * 40);
    ctx.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Procedural straw texture with realistic woven straw patterns
function createStrawTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Base straw color (warm tan/sand)
  ctx.fillStyle = '#e5c158';
  ctx.fillRect(0, 0, size, size);
  
  // Draw straw weave grid lines
  ctx.strokeStyle = '#c5a038';
  ctx.lineWidth = 1.5;
  
  // Draw warp lines
  for (let i = 0; i < size; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
  }
  
  // Draw weft lines (staggered dashes to simulate over-under weave)
  ctx.strokeStyle = '#dcc178';
  ctx.lineWidth = 2;
  for (let j = 0; j < size; j += 8) {
    const offset = (j % 16 === 0) ? 0 : 4;
    ctx.beginPath();
    for (let k = offset; k < size; k += 16) {
      ctx.moveTo(k, j);
      ctx.lineTo(k + 8, j);
    }
    ctx.stroke();
  }
  
  // Random highlights and shadows for depth
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    const y = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Generate Scavenger Targets (styled procedurally)
function addScavengerTargets() {
  targetsData.forEach(data => {
    const group = new THREE.Group();
    group.position.set(data.x, 0, data.z);
    group.name = `target-${data.id}`;
    
    // Draw appropriate 3D model
    const parts = createTargetModel(data.shape, data.color);
    parts.forEach(part => {
      part.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.userData.targetId = data.id;
          targetMeshes.push(child);
        }
      });
      group.add(part);
    });
    
    // Add floating clinic visual focus indicator (bouncing ring) above target
    const ringGeo = new THREE.RingGeometry(0.2, 0.25, 12);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffab00, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, 0.85, 0);
    ring.name = 'rehab-ring';
    group.add(ring);
    
    scene.add(group);
  });
}

function createTargetModel(shape, color) {
  const models = [];
  
  if (shape === 'basket') {
    // Red basket
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.28, 0.32),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
    );
    base.position.set(0, 0.14, 0);
    models.push(base);
    // Handle
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.024, 8, 16, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.9 })
    );
    handle.position.set(0, 0.28, 0);
    models.push(handle);
  } else if (shape === 'cylinders') {
    // Binoculars
    [-0.08, 0.08].forEach(offsetX => {
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.055, 0.24, 10),
        new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
      );
      cyl.position.set(offsetX, 0.58, 0); // elevated for bench placing
      cyl.rotation.x = Math.PI / 2;
      models.push(cyl);
    });
    const bridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.03, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x212121 })
    );
    bridge.position.set(0, 0.58, 0);
    models.push(bridge);
  } else if (shape === 'flowers') {
    // A highly realistic procedural red rose bush
    const bushGroup = new THREE.Group();
    
    // 1. Woody Stems Skeleton (bark textured, branching organically)
    const stemMat = new THREE.MeshStandardMaterial({ map: barkTexture, roughness: 0.95 });
    
    // Main Trunk base
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.034, 0.25, 8), stemMat);
    trunk.position.set(0, 0.125, 0);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    bushGroup.add(trunk);
    
    // 4 spreading branches
    const branches = [
      { len: 0.52, radius: 0.015, pos: [0, 0.2, 0], rot: [0.35, 0, 0.55] },     // North-East leaning
      { len: 0.48, radius: 0.014, pos: [0, 0.22, 0], rot: [-0.4, 0, -0.5] },    // South-West leaning
      { len: 0.55, radius: 0.016, pos: [0, 0.2, 0], rot: [-0.3, 0, 0.6] },     // North-West leaning
      { len: 0.5, radius: 0.015, pos: [0, 0.21, 0], rot: [0.45, 0, -0.45] }     // South-East leaning
    ];
    
    const branchMeshes = [];
    branches.forEach((b, idx) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(...b.pos);
      bGroup.rotation.set(...b.rot);
      
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(b.radius * 0.7, b.radius, b.len, 6),
        stemMat
      );
      // Align cylinder along branch group local Y axis, offset so it grows outward
      mesh.position.y = b.len / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      bGroup.add(mesh);
      
      // Add sharp thorns along the branches
      const thornMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 });
      const thornGeo = new THREE.ConeGeometry(0.006, 0.02, 4);
      for (let t = 0; t < 5; t++) {
        const tY = 0.1 + t * (b.len / 6);
        const thorn = new THREE.Mesh(thornGeo, thornMat);
        // Point outwards from the branch
        const tAngle = t * Math.PI * 0.67;
        thorn.position.set(Math.cos(tAngle) * b.radius, tY, Math.sin(tAngle) * b.radius);
        thorn.rotation.x = Math.PI / 2;
        thorn.rotation.y = tAngle;
        bGroup.add(thorn);
      }
      
      bushGroup.add(bGroup);
      branchMeshes.push({ group: bGroup, length: b.len, radius: b.radius });
    });
    
    // Reusable Compound Leaf Group builder (5 leaflets in pinnate configuration)
    const leafMat = new THREE.MeshStandardMaterial({
      map: leafTexture,
      color: 0x1b5e20, // Lush forest green
      roughness: 0.72,
      side: THREE.DoubleSide
    });
    
    function createCompoundLeaf() {
      const leafGroup = new THREE.Group();
      
      // Central petiole (fine leaf stem)
      const petiole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.003, 0.12, 4),
        new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.9 })
      );
      petiole.position.y = 0.06;
      leafGroup.add(petiole);
      
      // Leaflets (stretched and flattened Dodecahedrons with detail 0 for leaf shapes)
      const leafletGeo = new THREE.DodecahedronGeometry(0.026, 0);
      
      // Terminal leaflet
      const term = new THREE.Mesh(leafletGeo, leafMat);
      term.scale.set(1.0, 0.08, 1.45);
      term.position.set(0, 0.12, 0);
      term.rotation.y = 0;
      term.castShadow = true;
      leafGroup.add(term);
      
      // Pairs of lateral leaflets
      const leafletOffsets = [0.05, 0.09];
      leafletOffsets.forEach((yOff, pIdx) => {
        const scaleVal = pIdx === 0 ? 0.82 : 0.95;
        
        // Left leaflet
        const lfL = new THREE.Mesh(leafletGeo, leafMat);
        lfL.scale.set(0.95 * scaleVal, 0.08, 1.35 * scaleVal);
        lfL.position.set(-0.022, yOff, 0.004);
        lfL.rotation.y = -Math.PI / 3.5;
        lfL.rotation.z = 0.22;
        term.castShadow = true;
        leafGroup.add(lfL);
        
        // Right leaflet
        const lfR = new THREE.Mesh(leafletGeo, leafMat);
        lfR.scale.set(0.95 * scaleVal, 0.08, 1.35 * scaleVal);
        lfR.position.set(0.022, yOff, 0.004);
        lfR.rotation.y = Math.PI / 3.5;
        lfR.rotation.z = -0.22;
        term.castShadow = true;
        leafGroup.add(lfR);
      });
      
      return leafGroup;
    }
    
    // Distribute compound leaf groups along branches
    branchMeshes.forEach(bm => {
      const leafCount = 8;
      for (let l = 0; l < leafCount; l++) {
        const t = 0.2 + (l / leafCount) * 0.75; // distribute along upper portion of branch
        const leaf = createCompoundLeaf();
        
        // Position leaf along branch cylinder
        const lY = t * bm.length;
        const angle = l * Math.PI * 0.55; // spiral leaf pattern
        const lRad = bm.radius * 0.85;
        
        leaf.position.set(Math.cos(angle) * lRad, lY, Math.sin(angle) * lRad);
        
        // Orient leaf pointing outwards and upwards
        leaf.rotation.x = 0.5 + Math.sin(angle) * 0.35;
        leaf.rotation.y = angle;
        leaf.rotation.z = (Math.random() - 0.5) * 0.4;
        
        bm.group.add(leaf);
      }
    });
    
    // 3. Realistic Concentric Layered Crimson Roses
    const roseMat = new THREE.MeshStandardMaterial({
      color: 0xd50000, // Rich crimson
      emissive: 0x3d0000,
      roughness: 0.76,
      side: THREE.DoubleSide
    });
    
    function createRealisticRose() {
      const flower = new THREE.Group();
      
      // Green calyx/receptacle at base
      const calMat = new THREE.MeshStandardMaterial({ map: leafTexture, color: 0x1b5e20, roughness: 0.9 });
      const calyx = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.012, 0.045, 6), calMat);
      calyx.position.y = -0.022;
      flower.add(calyx);
      
      // 5 Green Sepals wrapping outer petals
      for (let i = 0; i < 5; i++) {
        const sAngle = (i * Math.PI * 2) / 5;
        const sepal = new THREE.Mesh(new THREE.ConeGeometry(0.007, 0.042, 3), calMat);
        sepal.position.set(Math.cos(sAngle) * 0.018, -0.015, Math.sin(sAngle) * 0.018);
        sepal.rotation.z = -Math.cos(sAngle) * 0.45;
        sepal.rotation.x = Math.sin(sAngle) * 0.45;
        flower.add(sepal);
      }
      
      // Layer 1: Tight Central Bud (3 sphere-segment petals wrapped tight)
      for (let i = 0; i < 3; i++) {
        const rAngle = (i * Math.PI * 2) / 3;
        // Sphere segment makes a perfect curved shell
        const pGeo = new THREE.SphereGeometry(0.032, 8, 8, 0, Math.PI * 1.15, 0, Math.PI * 0.58);
        const petal = new THREE.Mesh(pGeo, roseMat);
        petal.position.set(Math.cos(rAngle) * 0.004, 0.008, Math.sin(rAngle) * 0.004);
        petal.rotation.y = rAngle + Math.PI / 4;
        petal.rotation.x = 0.15; // slightly tilted inward
        flower.add(petal);
      }
      
      // Layer 2: Middle Opening Petals (5 petals, slightly open)
      for (let i = 0; i < 5; i++) {
        const rAngle = (i * Math.PI * 2) / 5;
        const pGeo = new THREE.SphereGeometry(0.046, 8, 8, 0, Math.PI * 0.95, 0, Math.PI * 0.52);
        const petal = new THREE.Mesh(pGeo, roseMat);
        petal.position.set(Math.cos(rAngle) * 0.014, 0.014, Math.sin(rAngle) * 0.014);
        petal.rotation.y = rAngle + Math.PI / 5;
        // Tilt outwards
        petal.rotation.z = -Math.cos(rAngle) * 0.32;
        petal.rotation.x = Math.sin(rAngle) * 0.32;
        flower.add(petal);
      }
      
      // Layer 3: Outer Blooming Petals (6 petals, wide open)
      for (let i = 0; i < 6; i++) {
        const rAngle = (i * Math.PI * 2) / 6;
        const pGeo = new THREE.SphereGeometry(0.058, 8, 8, 0, Math.PI * 0.85, 0, Math.PI * 0.46);
        const petal = new THREE.Mesh(pGeo, roseMat);
        petal.position.set(Math.cos(rAngle) * 0.026, 0.018, Math.sin(rAngle) * 0.026);
        petal.rotation.y = rAngle + Math.PI / 6;
        // Tilt outwards further
        petal.rotation.z = -Math.cos(rAngle) * 0.62;
        petal.rotation.x = Math.sin(rAngle) * 0.62;
        flower.add(petal);
      }
      
      return flower;
    }
    
    // Add 8 roses at the branch tips pointing outwards
    branchMeshes.forEach((bm, idx) => {
      // Primary rose at the tip of the branch
      const rose1 = createRealisticRose();
      rose1.position.set(0, bm.length, 0);
      rose1.rotation.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4);
      bm.group.add(rose1);
      
      // Secondary rose slightly below the tip
      const rose2 = createRealisticRose();
      rose2.scale.set(0.85, 0.85, 0.85); // slightly smaller bud
      const sideAngle = idx * Math.PI * 0.5 + Math.PI / 4;
      rose2.position.set(Math.cos(sideAngle) * bm.radius * 1.5, bm.length * 0.78, Math.sin(sideAngle) * bm.radius * 1.5);
      rose2.rotation.x = 0.5;
      rose2.rotation.y = sideAngle;
      bm.group.add(rose2);
    });
    
    models.push(bushGroup);
  } else if (shape === 'key') {
    // Brass key
    const head = new THREE.Mesh(
      new THREE.TorusGeometry(0.05, 0.015, 6, 12),
      new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.8 })
    );
    head.position.set(0, 0.018, -0.06);
    head.rotation.x = Math.PI / 2;
    models.push(head);
    
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8),
      new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.8 })
    );
    shaft.position.set(0, 0.018, 0.03);
    shaft.rotation.x = Math.PI / 2;
    models.push(shaft);
  } else if (shape === 'thermos') {
    // Beverage flask
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.28, 12),
      new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.9 })
    );
    bottle.position.set(0, 0.58, 0); // elevated for bench placing
    models.push(bottle);
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12),
      new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.4 })
    );
    cap.position.set(0, 0.74, 0);
    models.push(cap);
  } else if (shape === 'camera') {
    // Central tourist camera
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.12, 0.09),
      new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
    );
    body.position.set(0, 0.52, 0); // sitting on fountain wall
    models.push(body);
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12),
      new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.4 })
    );
    lens.position.set(0, 0.52, 0.06);
    lens.rotation.x = Math.PI / 2;
    models.push(lens);
  } else if (shape === 'wallet') {
    // Brown pocket wallet
    const wallet = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.04, 0.12),
      new THREE.MeshStandardMaterial({ color, roughness: 0.85 })
    );
    wallet.position.set(0, 0.58, 0); // sitting on NW Bench
    models.push(wallet);
  } else if (shape === 'sketchbook') {
    // Hardbound sketchbook
    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.05, 0.32),
      new THREE.MeshStandardMaterial({ color, roughness: 0.7 })
    );
    cover.position.set(0, 0.22, 0); // resting on SW flowerbed
    models.push(cover);
    const pages = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.04, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })
    );
    pages.position.set(0, 0.22, 0);
    models.push(pages);
  } else if (shape === 'flask') {
    // Reusable water flask
    const cyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.26, 12),
      new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.5 })
    );
    cyl.position.set(0, 0.13, 0); // standing on grass/ground under SE Bench
    models.push(cyl);
    const lid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.05, 12),
      new THREE.MeshStandardMaterial({ color: 0x212121 })
    );
    lid.position.set(0, 0.285, 0);
    models.push(lid);
  } else if (shape === 'hat') {
    // A highly realistic, perfectly proportioned Straw Sun Hat (Panama Fedora style)
    const hatGroup = new THREE.Group();
    
    // Straw material with woven texture
    const hatMat = new THREE.MeshStandardMaterial({
      map: strawTexture,
      color: 0xffe082, // warm straw yellow
      roughness: 0.92,
      side: THREE.DoubleSide
    });
    
    // 1. Elegant sloped brim (open-ended cylinder with downward slope)
    // Connecting to crown at r=0.09, flaring to r=0.19 at the outer edge
    const brim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.19, 0.02, 24, 1, true),
      hatMat
    );
    brim.position.set(0, 0.05, 0);
    brim.castShadow = true;
    brim.receiveShadow = true;
    hatGroup.add(brim);
    
    // Outer edge piping (Torus around the brim lip for premium rounded rim)
    const pipingMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.85 }); // matching brown accent
    const piping = new THREE.Mesh(
      new THREE.TorusGeometry(0.19, 0.007, 8, 24),
      pipingMat
    );
    piping.rotation.x = Math.PI / 2;
    piping.position.set(0, 0.04, 0);
    piping.castShadow = true;
    hatGroup.add(piping);
    
    // 2. Custom Flat-topped Crown (panama style, taller & tapered for gorgeous definition)
    const crownGroup = new THREE.Group();
    
    // Crown walls (height 0.12, slightly tapered from r=0.09 to r=0.088)
    const crownBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.088, 0.09, 0.12, 24, 1, true),
      hatMat
    );
    crownBase.position.y = 0.11;
    crownBase.castShadow = true;
    crownBase.receiveShadow = true;
    crownGroup.add(crownBase);
    
    // Crown top cap (dome styled to cap the tapered walls perfectly)
    const crownCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.089, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      hatMat
    );
    crownCap.scale.set(1.0, 0.65, 1.0);
    crownCap.position.set(0, 0.17, 0);
    crownCap.castShadow = true;
    crownCap.receiveShadow = true;
    crownGroup.add(crownCap);
    
    hatGroup.add(crownGroup);
    
    // 3. Fabric Accent Ribbon & Bow Knot
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x3e2723, // deep chocolate brown fabric
      roughness: 0.88
    });
    
    // Ribbon band wrapping perfectly at the base of the crown walls
    const ribbon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.091, 0.092, 0.022, 24),
      ribbonMat
    );
    ribbon.position.set(0, 0.061, 0);
    ribbon.castShadow = true;
    hatGroup.add(ribbon);
    
    // bow knot detail on the side (West side, x < 0)
    const bowGroup = new THREE.Group();
    bowGroup.position.set(-0.092, 0.061, 0);
    
    // Center knot
    const knot = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.024, 0.016), ribbonMat);
    bowGroup.add(knot);
    
    // Left bow loop
    const bowL = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.014, 0.028), ribbonMat);
    bowL.position.set(0.002, 0, -0.012);
    bowL.rotation.y = -Math.PI / 6;
    bowL.rotation.x = 0.2;
    bowGroup.add(bowL);
    
    // Right bow loop
    const bowR = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.014, 0.028), ribbonMat);
    bowR.position.set(0.002, 0, 0.012);
    bowR.rotation.y = Math.PI / 6;
    bowR.rotation.x = -0.2;
    bowGroup.add(bowR);
    
    hatGroup.add(bowGroup);
    
    // Elevate slightly for grass placement
    hatGroup.position.set(0, 0.03, 0);
    models.push(hatGroup);
  }
  
  return models;
}

// Bouncing ring animations for target highlights
function animateRehabRings(time) {
  scene.traverse(node => {
    if (node.name === 'rehab-ring') {
      node.position.y = 0.82 + Math.sin(time * 0.005) * 0.05;
      node.rotation.z += 0.015;
    }
  });
}

// Animate Fountain Particle Systems
function updateFountainParticles(dt) {
  fountainParticles.forEach(p => {
    p.position.addScaledVector(p.velocity, dt);
    // Gravity simulation
    p.velocity.y -= 2.2 * dt;
    
    // Bound splash logic
    if (p.position.y <= 0.36) {
      p.position.set(0, 0.55, 0);
      p.velocity.set(
        (Math.random() - 0.5) * 0.45,
        Math.random() * 0.95 + 0.8,
        (Math.random() - 0.5) * 0.45
      );
    }
  });
}

// Input Locomotion Handler
function updateLocomotion(dt) {
  if (!appState.gameStarted) return;
  
  const moveSpeed = 2.4 * dt;
  const turnSpeed = 1.62 * dt;
  let moveX = 0;
  let moveZ = 0;
  let rotate = 0;
  
  // Keyboard detection
  if (appState.keys.has('w') || appState.keys.has('arrowup')) {
    moveX += -Math.sin(player.rotation) * moveSpeed;
    moveZ += -Math.cos(player.rotation) * moveSpeed;
  }
  if (appState.keys.has('s') || appState.keys.has('arrowdown')) {
    moveX -= -Math.sin(player.rotation) * moveSpeed;
    moveZ -= -Math.cos(player.rotation) * moveSpeed;
  }
  if (appState.keys.has('a') || appState.keys.has('arrowleft')) {
    rotate += turnSpeed; // left turn increases rotation angle
  }
  if (appState.keys.has('d') || appState.keys.has('arrowright')) {
    rotate -= turnSpeed; // right turn decreases rotation angle
  }
  
  // On-screen touch movements
  if (appState.touchMove === 'forward') {
    moveX += -Math.sin(player.rotation) * moveSpeed;
    moveZ += -Math.cos(player.rotation) * moveSpeed;
  } else if (appState.touchMove === 'backward') {
    moveX -= -Math.sin(player.rotation) * moveSpeed;
    moveZ -= -Math.cos(player.rotation) * moveSpeed;
  } else if (appState.touchMove === 'turn-left') {
    rotate += turnSpeed;
  } else if (appState.touchMove === 'turn-right') {
    rotate -= turnSpeed;
  }
  
  // Process rotations
  if (rotate !== 0) {
    player.rotation += rotate;
    // Log scanning angles to parent app state manager
    if (window.PARK_APP && typeof window.PARK_APP.logCameraDirection === 'function') {
      window.PARK_APP.logCameraDirection(player.rotation);
    }
  }
  
  // Collision Detection with Sliding Response
  if (moveX !== 0 || moveZ !== 0) {
    // Try moving X axis independently
    const targetX = player.x + moveX;
    let hitX = false;
    for (const box of colliders) {
      if (checkCollisionBox(targetX, player.z, player.radius, box)) {
        hitX = true;
        break;
      }
    }
    if (!hitX) {
      player.x = targetX;
    }
    
    // Try moving Z axis independently
    const targetZ = player.z + moveZ;
    let hitZ = false;
    for (const box of colliders) {
      if (checkCollisionBox(player.x, targetZ, player.radius, box)) {
        hitZ = true;
        break;
      }
    }
    if (!hitZ) {
      player.z = targetZ;
    }
  }
  
  // Update camera layout
  camera.position.set(player.x, 1.25, player.z); // head height = 1.25
  camera.rotation.set(0, player.rotation, 0);
}

function checkCollisionBox(px, pz, pr, box) {
  // Simple AABB vs Circle collision check
  const closestX = Math.max(box.x - box.width / 2, Math.min(px, box.x + box.width / 2));
  const closestZ = Math.max(box.z - box.depth / 2, Math.min(pz, box.z + box.depth / 2));
  
  const dist = distance(px, pz, closestX, closestZ);
  return dist < pr;
}

function distance(x1, z1, x2, z2) {
  return Math.sqrt((x1 - x2) ** 2 + (z1 - z2) ** 2);
}

// Proximity detection for Scavenger Hunt targets
function checkProximityTargets() {
  if (!appState.gameStarted) return;
  
  let nearestItem = null;
  let minDist = 2.4; // inspect distance
  
  targetsData.forEach(item => {
    // Only detect proximity if the target is still in the scene (not yet collected)
    if (!scene.getObjectByName(`target-${item.id}`)) return;
    
    const dist = distance(player.x, player.z, item.x, item.z);
    if (dist < minDist) {
      minDist = dist;
      nearestItem = item;
    }
  });
  
  if (nearestItem) {
    appState.nearItem = nearestItem;
    els.interactionHint.textContent = `Near: ${nearestItem.name}. Press ENTER or click Collect to pick it up!`;
    
    // Auto-alert state manager
    if (window.PARK_APP && typeof window.PARK_APP.triggerInspectItem === 'function') {
      window.PARK_APP.triggerInspectItem(nearestItem.id);
    }
  } else {
    if (appState.nearItem) {
      appState.nearItem = null;
      els.interactionHint.textContent = 'Use W/S/A/D to walk. Keep looking to the LEFT to find hidden objects.';
      // Hide inspect panel if player walked away
      const itemPanel = document.getElementById('item-panel');
      if (itemPanel) itemPanel.classList.add('hidden');
    }
  }
}

// Remove collected 3D assets
function removeItemFromScene(id) {
  const meshGroup = scene.getObjectByName(`target-${id}`);
  if (meshGroup) {
    // Remove group from scene
    scene.remove(meshGroup);
  }
}

function clearInspectionFocus() {
  // placeholder to clear highlight states
}

// Event Bindings
function bindEvents() {
  window.addEventListener('keydown', e => {
    appState.keys.add(e.key.toLowerCase());
    
    if (e.key === 'Enter' && appState.nearItem) {
      // simulate clicking collect
      const collectBtn = document.getElementById('add-item-btn');
      if (collectBtn) collectBtn.click();
    }
  });
  window.addEventListener('keyup', e => appState.keys.delete(e.key.toLowerCase()));
  
  // Resize handler
  window.addEventListener('resize', resizeRenderer);
  
  // Touch nav mapping
  const touchPanel = document.querySelector('.touch-controls');
  if (touchPanel) {
    touchPanel.querySelectorAll('button').forEach(btn => {
      const action = btn.dataset.control;
      btn.addEventListener('touchstart', e => {
        e.preventDefault();
        appState.touchMove = action;
      });
      btn.addEventListener('touchend', e => {
        e.preventDefault();
        appState.touchMove = null;
      });
      btn.addEventListener('mousedown', () => {
        appState.touchMove = action;
      });
      btn.addEventListener('mouseup', () => {
        appState.touchMove = null;
      });
    });
  }
}

function resizeRenderer() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function startScene() {
  appState.gameStarted = true;
  if (!appState.sceneReady) {
    initScene();
  }
}

// Core Loop
function tick(time) {
  requestAnimationFrame(tick);
  
  const dt = Math.min((time - appState.lastTime) / 1000, 0.1);
  appState.lastTime = time;
  
  updateLocomotion(dt);
  updateFountainParticles(dt);
  animateRehabRings(time);
  checkProximityTargets();
  
  // Pulsing and floating 3D neon sky arrow
  if (skyArrow && skyArrow.visible) {
    skyArrow.position.y = 2.4 + Math.sin(time * 0.003) * 0.1;
    if (skyArrowMaterial) {
      skyArrowMaterial.emissiveIntensity = 0.5 + Math.sin(time * 0.006) * 0.3;
    }
  }
  
  // Wind sway animation for tree foliage canopies
  swayingFoliage.forEach(item => {
    const offset = item.scale * 10;
    item.mesh.rotation.z = Math.sin(time * 0.0018 + offset) * 0.024 * item.scale;
    item.mesh.rotation.x = Math.cos(time * 0.0015 + offset) * 0.018 * item.scale;
  });
  
  // Slow drifting clouds in the sky
  clouds.forEach(c => {
    c.mesh.position.x += 0.14 * dt;
    if (c.mesh.position.x > 15) {
      c.mesh.position.x = -15;
    }
    c.mesh.position.y = (10.5 + (c.scale * 0.8)) + Math.sin(time * 0.0006 + c.mesh.position.x) * 0.08;
  });
  
  // Realistic flowing water shimmer ripples
  if (waterTexture) {
    waterTexture.offset.x += 0.038 * dt;
    waterTexture.offset.y += 0.026 * dt;
  }
  
  renderer.render(scene, camera);
}

function toggleSkyArrow(visible) {
  if (skyArrow) {
    skyArrow.visible = visible;
  }
}

// Mount global hooks for application controller to interface with Three.js
window.PARK_3D = {
  startScene,
  removeItemFromScene,
  clearInspectionFocus,
  toggleSkyArrow
};
