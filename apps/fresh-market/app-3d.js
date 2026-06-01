import * as THREE from './vendor/three.module.js';

const scenario = {
  id: 'family-meal',
  title: 'Family Meal',
  budget: 25,
  required: [
    { id: 'mince', label: 'Minced beef 500g', hint: 'Turkey mince or lentils can work if needed.' },
    { id: 'pasta', label: 'Spaghetti', hint: 'Penne is an acceptable pasta substitute.' },
    { id: 'tomato-sauce', label: 'Jar of tomato sauce', hint: 'The jar is unavailable; find a tomato-based substitute.' },
    { id: 'cheese', label: 'Cheddar cheese', hint: 'Standard cheddar is best for the budget.' },
    { id: 'milk', label: 'Milk 2 litres', hint: 'Check the volume, not just the item name.', requiredVolume: 2 },
    { id: 'fruit', label: 'Fresh fruit', hint: 'Apples, bananas, or oranges are suitable.' },
  ],
};

const zones = [
  { id: 'produce', label: 'Produce', x: -5.6, z: 3.9, color: 0x74a84a },
  { id: 'dairy', label: 'Dairy', x: 0, z: 2.35, color: 0x5c8cc9 },
  { id: 'protein', label: 'Meat', x: 5.1, z: 3.7, color: 0xb76a5b },
  { id: 'dry-goods', label: 'Dry Goods', x: -4.6, z: -0.9, color: 0xc69b53 },
  { id: 'sauces', label: 'Sauces', x: 1.2, z: -0.8, color: 0xb84c3d },
  { id: 'snacks', label: 'Snacks', x: -5.2, z: -4.8, color: 0xa576b2 },
  { id: 'checkout', label: 'Checkout', x: 5.2, z: -5.1, color: 0x4c6b73 },
];

const products = [
  { id: 'chocolate-cake', legacyId: 1, name: 'Chocolate Cake', category: 'Treats', price: 2.5, detail: 'Sale bakery item. Not needed for the family meal.', zone: 'snacks', position: [-5.9, -5.08], color: 0x7a4a38, distractorType: 'impulse treat' },
  { id: 'premium-steak-mince', legacyId: 2, name: 'Premium Steak Mince', category: 'Meat', price: 8.5, detail: '500g organic beef mince. Correct category, but expensive.', zone: 'protein', position: [4.3, 3.1], color: 0x8f2f24, targetId: 'mince', highCost: true },
  { id: 'standard-beef-mince', legacyId: 3, name: 'Standard Beef Mince', category: 'Meat', price: 4, detail: '500g beef mince. Good match for the list.', zone: 'protein', position: [5.3, 3.1], color: 0xa84434, targetId: 'mince' },
  { id: 'turkey-mince', name: 'Turkey Mince', category: 'Meat', price: 3.75, detail: '500g lean mince. Logical substitute for beef mince.', zone: 'protein', position: [6.2, 3.1], color: 0xd7a08f, acceptableSubstituteFor: ['mince'] },
  { id: 'green-lentils', name: 'Green Lentils', category: 'Dry Goods', price: 1.2, detail: 'Plant protein for a lower-cost mince substitute.', zone: 'dry-goods', position: [-3.8, -1.15], color: 0x6a8f4d, acceptableSubstituteFor: ['mince'] },
  { id: 'fresh-egg-pasta', legacyId: 4, name: 'Fresh Egg Pasta', category: 'Dry Goods', price: 3.5, detail: 'Premium pasta. Correct category, but more expensive than needed.', zone: 'dry-goods', position: [-5.65, -0.8], color: 0xf2d58c, targetId: 'pasta', highCost: true },
  { id: 'dry-spaghetti', legacyId: 5, name: 'Dry Spaghetti', category: 'Dry Goods', price: 0.9, detail: 'Value pack spaghetti. Best exact match.', zone: 'dry-goods', position: [-4.35, -0.72], color: 0xf0c45c, targetId: 'pasta' },
  { id: 'penne', name: 'Penne Pasta', category: 'Dry Goods', price: 0.95, detail: 'Pasta shape substitute if spaghetti is unavailable.', zone: 'dry-goods', position: [-2.95, -0.8], color: 0xd9a84a, acceptableSubstituteFor: ['pasta'] },
  { id: 'jar-tomato-sauce', legacyId: 6, name: 'Jar of Tomato Sauce', category: 'Sauces', price: 2.5, detail: 'Original jar sauce. This shelf space is out of stock.', zone: 'sauces', position: [0.5, -0.8], color: 0xb63b2f, targetId: 'tomato-sauce', inStock: false },
  { id: 'chopped-tomatoes', legacyId: 7, name: 'Chopped Tomatoes', category: 'Sauces', price: 0.8, detail: 'Tinned tomatoes. Correct tomato sauce substitute.', zone: 'sauces', position: [1.5, -0.8], color: 0xcc4b37, acceptableSubstituteFor: ['tomato-sauce'] },
  { id: 'passata', name: 'Passata', category: 'Sauces', price: 1.1, detail: 'Smooth tomato passata. Correct sauce substitute.', zone: 'sauces', position: [2.5, -0.8], color: 0xd94430, acceptableSubstituteFor: ['tomato-sauce'] },
  { id: 'vintage-cheddar', legacyId: 8, name: 'Vintage Cheddar', category: 'Dairy', price: 4.5, detail: 'Aged cheddar. Correct item, but a high-cost choice.', zone: 'dairy', position: [-0.8, 1.95], color: 0xf2b441, targetId: 'cheese', highCost: true },
  { id: 'mild-cheddar', legacyId: 9, name: 'Mild Cheddar', category: 'Dairy', price: 2.5, detail: 'Everyday cheddar block. Good match for the list.', zone: 'dairy', position: [0.1, 1.95], color: 0xf0c44f, targetId: 'cheese' },
  { id: 'single-cream', name: 'Single Cream', category: 'Dairy', price: 1.5, detail: 'Dairy item, but not a useful substitute for milk or cheddar.', zone: 'dairy', position: [1.0, 1.95], color: 0xf7efe2, attemptedSubstituteFor: 'milk' },
  { id: 'fresh-milk-1l', legacyId: 10, name: 'Fresh Milk 1L', category: 'Dairy', price: 1.1, detail: 'Semi-skimmed milk. You need 2 litres total.', zone: 'dairy', position: [-0.8, 2.9], color: 0xeaf3f8, targetId: 'milk', volumeLitres: 1, repeatable: true },
  { id: 'milk-2l', name: 'Milk 2L', category: 'Dairy', price: 1.95, detail: 'Two-litre bottle. Exact volume match.', zone: 'dairy', position: [0.1, 2.9], color: 0xdfeef6, targetId: 'milk', volumeLitres: 2 },
  { id: 'small-milk', legacyId: 11, name: 'Small Milk 500ml', category: 'Dairy', price: 0.7, detail: 'Only half a litre; check whether the quantity is enough.', zone: 'dairy', position: [1.0, 2.9], color: 0xf2f7fb, targetId: 'milk', volumeLitres: 0.5, repeatable: true },
  { id: 'banana-bunch', legacyId: 12, name: 'Banana Bunch', category: 'Produce', price: 1.5, detail: 'Fresh fruit. Suitable list item.', zone: 'produce', position: [-6.2, 3.05], color: 0xf1d04d, targetId: 'fruit' },
  { id: 'green-apples', legacyId: 13, name: 'Green Apples', category: 'Produce', price: 2.2, detail: 'Pack of six apples. Suitable fresh fruit.', zone: 'produce', position: [-5.3, 3.05], color: 0x7dbf4d, targetId: 'fruit' },
  { id: 'oranges', name: 'Oranges', category: 'Produce', price: 2.0, detail: 'Fresh oranges. Suitable fruit choice.', zone: 'produce', position: [-4.4, 3.05], color: 0xe89028, targetId: 'fruit' },
  { id: 'fizzy-drinks', legacyId: 14, name: 'Fizzy Drinks', category: 'Treats', price: 3, detail: 'Multipack drink. Not on the list.', zone: 'snacks', position: [-4.2, -5.08], color: 0x365d9b, distractorType: 'unnecessary drink' },
  { id: 'red-wine', legacyId: 15, name: 'Red Wine', category: 'Treats', price: 8, detail: 'Alcohol. Not needed for the meal task.', zone: 'snacks', position: [-5.0, -5.55], color: 0x5c1f31, distractorType: 'expensive impulse' },
  { id: 'crisps', name: 'Crisps', category: 'Treats', price: 1.8, detail: 'Snack item. Not on the list.', zone: 'snacks', position: [-6.0, -5.55], color: 0xd7a837, distractorType: 'snack' },
  { id: 'ready-meal', name: 'Premium Ready Meal', category: 'Treats', price: 6.5, detail: 'Convenient but not a substitute for buying the required ingredients.', zone: 'snacks', position: [-4.0, -5.55], color: 0x7d5965, distractorType: 'meal shortcut' },
  { id: 'flowers', name: 'Flowers', category: 'Impulse', price: 5, detail: 'Pleasant, but unrelated to the shopping list.', zone: 'checkout', position: [4.25, -4.75], color: 0xd96fa7, distractorType: 'checkout impulse' },
  { id: 'magazine', name: 'Magazine', category: 'Impulse', price: 3.25, detail: 'Checkout impulse item. Not needed for the meal.', zone: 'checkout', position: [4.9, -4.75], color: 0x4f75a6, distractorType: 'checkout impulse' },
];

const appState = {
  cart: [],
  gameStarted: false,
  selectedProductId: null,
  sceneReady: false,
  keys: new Set(),
  lastTime: 0,
  toastTimer: 0,
  nearCheckout: false,
};

const player = {
  x: 0,
  z: 6.4,
  rotation: Math.PI,
  radius: 0.38,
};

let renderer;
let scene;
let camera;
let raycaster;
let pointer;
let playerMarker;
let focusLabel;
let focusLabelProductId = '';
let canvas;
let itemMeshes = [];
let colliders = [];

const els = {
  budgetLimit: document.getElementById('budget-limit'),
  totalVal: document.getElementById('total-val'),
  budgetVal: document.getElementById('budget-val'),
  budgetBox: document.getElementById('budget-box'),
  progressCount: document.getElementById('progress-count'),
  shoppingList: document.getElementById('shopping-list'),
  cartList: document.getElementById('cart-list'),
  cartCount: document.getElementById('cart-count'),
  checkoutBtn: document.getElementById('checkout-btn'),
  practiceCheckoutBtn: document.getElementById('practice-checkout-btn'),
  checkoutHelp: document.getElementById('checkout-help'),
  introScreen: document.getElementById('intro-screen'),
  reportScreen: document.getElementById('report-screen'),
  startBtn: document.getElementById('start-btn'),
  canvas: document.getElementById('market-canvas'),
  itemPanel: document.getElementById('item-panel'),
  itemZone: document.getElementById('item-zone'),
  itemName: document.getElementById('item-name'),
  itemDetail: document.getElementById('item-detail'),
  itemPrice: document.getElementById('item-price'),
  addItemBtn: document.getElementById('add-item-btn'),
  closeItemBtn: document.getElementById('close-item-btn'),
  interactionHint: document.getElementById('interaction-hint'),
  toast: document.getElementById('toast'),
};

function money(value) {
  return `£${value.toFixed(2)}`;
}

function productById(id) {
  return products.find((product) => product.id === id || product.legacyId === id);
}

function zoneById(id) {
  return zones.find((zone) => zone.id === id);
}

function cartTotal() {
  return appState.cart.reduce((sum, item) => sum + item.price, 0);
}

function startGame() {
  els.introScreen.classList.add('hidden');
  appState.gameStarted = true;
  if (!appState.sceneReady) {
    initScene();
  }
  els.interactionHint.textContent = 'Use WASD or arrow keys to move. Click or press E near an item to inspect.';
  showToast('Start at the entrance. Move slowly through the aisles and inspect nearby products.');
  updateUI();
}

function addToCart(id) {
  const product = productById(id);
  if (!product) return false;

  if (product.inStock === false) {
    inspectProduct(product.id);
    showToast(`${product.name} is out of stock. Look nearby for a logical substitute.`);
    return false;
  }

  if (!product.repeatable && appState.cart.some((item) => item.id === product.id)) {
    closeItemPanel();
    showToast(`${product.name} is already in your trolley.`);
    return false;
  }

  appState.cart.push(product);
  showProductFeedback(product);
  updateUI();
  closeItemPanel();
  return true;
}

function removeFromCart(index) {
  appState.cart.splice(index, 1);
  updateUI();
}

function finishShop() {
  const report = scoreCart();
  els.reportScreen.classList.remove('hidden');

  const budgetRes = document.getElementById('res-budget');
  budgetRes.textContent = report.budgetOk ? 'PASS' : 'FAIL';
  budgetRes.className = report.budgetOk ? 'pass' : 'fail';
  document.getElementById('res-total').textContent = money(report.totalSpent);
  document.getElementById('res-items').textContent = `${report.foundCount}/${scenario.required.length}`;
  document.getElementById('res-remaining').textContent = report.remaining >= 0 ? money(report.remaining) : `${money(Math.abs(report.remaining))} over`;
  document.getElementById('star-score').textContent = `${report.stars} / 3`;
  document.getElementById('feedback-summary').textContent = report.feedback;

  const body = document.getElementById('res-body');
  body.innerHTML = '';

  report.requirements.forEach((result) => {
    addReportRow(body, result.label, result.fulfilled ? 'Pass' : 'Missing', result.note, result.fulfilled ? 'pass' : 'fail');
  });

  addReportRow(
    body,
    'Correct substitutions',
    report.correctSubstitutions.length ? 'Pass' : 'None',
    report.correctSubstitutions.length ? report.correctSubstitutions.map((item) => `${item.name} for ${requirementLabel(item.acceptableSubstituteFor[0])}`).join('; ') : 'No substitute was needed or selected.',
    report.correctSubstitutions.length ? 'pass' : 'warn'
  );

  addReportRow(
    body,
    'Incorrect substitutions',
    report.incorrectSubstitutions.length ? 'Review' : 'Pass',
    report.incorrectSubstitutions.length ? report.incorrectSubstitutions.map((item) => `${item.name} is not a good substitute for ${requirementLabel(item.attemptedSubstituteFor)}.`).join('; ') : 'No poor substitutes were selected.',
    report.incorrectSubstitutions.length ? 'warn' : 'pass'
  );

  addReportRow(
    body,
    'Distractor / impulse items',
    report.distractors.length ? 'Review' : 'Pass',
    report.distractors.length ? report.distractors.map((item) => item.name).join(', ') : 'No unnecessary items selected.',
    report.distractors.length ? 'warn' : 'pass'
  );

  addReportRow(
    body,
    'Budget management',
    report.budgetOk ? 'Pass' : 'Over budget',
    `Spent ${money(report.totalSpent)} against a ${money(scenario.budget)} budget.`,
    report.budgetOk ? 'pass' : 'fail'
  );
}

function toggleCheck() {
  updateUI();
}

function addReportRow(body, task, result, note, className) {
  body.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${task}</td>
      <td class="${className}">${result}</td>
      <td>${note}</td>
    </tr>
  `);
}

function requirementLabel(id) {
  return scenario.required.find((requirement) => requirement.id === id)?.label || id;
}

function showProductFeedback(product) {
  if (product.distractorType) {
    showToast(`Gentle warning: ${product.name} is not on the list. You can continue, but it may affect the result.`);
    return;
  }

  if (product.attemptedSubstituteFor) {
    showToast(`${product.name} looks related, but it is not a strong substitute for ${requirementLabel(product.attemptedSubstituteFor)}.`);
    return;
  }

  if (product.acceptableSubstituteFor?.length) {
    showToast(`Good reasoning: ${product.name} is an acceptable substitute.`);
    return;
  }

  if (product.targetId) {
    showToast(product.highCost ? `${product.name} matches the list, but check the budget.` : `Good choice: ${product.name} matches the list.`);
  }
}

function scoreCart() {
  const totalSpent = cartTotal();
  const remaining = scenario.budget - totalSpent;
  const requirementResults = scenario.required.map((requirement) => scoreRequirement(requirement));
  const foundCount = requirementResults.filter((result) => result.fulfilled).length;
  const correctSubstitutions = appState.cart.filter((item) => item.acceptableSubstituteFor?.length);
  const incorrectSubstitutions = appState.cart.filter((item) => item.attemptedSubstituteFor);
  const distractors = appState.cart.filter((item) => item.distractorType);
  const budgetOk = totalSpent <= scenario.budget;
  const allFound = foundCount === scenario.required.length;

  let stars = 1;
  if (allFound && budgetOk && !distractors.length && !incorrectSubstitutions.length) {
    stars = 3;
  } else if ((foundCount >= scenario.required.length - 1 && budgetOk) || (allFound && distractors.length <= 1 && incorrectSubstitutions.length === 0)) {
    stars = 2;
  }

  let feedback = 'Keep practising the route, list checking, and budget monitoring together.';
  if (stars === 3) {
    feedback = 'Excellent shop: all required items or sensible substitutes were found within budget.';
  } else if (stars === 2) {
    feedback = 'Good attempt: most of the plan was completed, with a small budget or impulse-control issue to review.';
  } else if (!budgetOk) {
    feedback = 'You completed parts of the shop, but the trolley went over budget. Review premium and impulse choices.';
  } else if (!allFound) {
    feedback = 'Some required items are missing. Revisit the aisle signs and compare products with the list.';
  }

  return {
    totalSpent,
    remaining,
    budgetOk,
    requirements: requirementResults,
    foundCount,
    correctSubstitutions,
    incorrectSubstitutions,
    distractors,
    stars,
    feedback,
  };
}

function scoreRequirement(requirement) {
  const exact = appState.cart.filter((item) => item.targetId === requirement.id);
  const substitutes = appState.cart.filter((item) => item.acceptableSubstituteFor?.includes(requirement.id));

  if (requirement.requiredVolume) {
    const volume = exact.reduce((sum, item) => sum + (item.volumeLitres || 0), 0);
    return {
      ...requirement,
      fulfilled: volume >= requirement.requiredVolume,
      note: volume >= requirement.requiredVolume
        ? `Selected ${formatVolume(volume)} of milk.`
        : `Selected ${formatVolume(volume)}; target is ${formatVolume(requirement.requiredVolume)}.`,
    };
  }

  if (exact.length) {
    const premium = exact.find((item) => item.highCost);
    return {
      ...requirement,
      fulfilled: true,
      note: premium ? `${premium.name} is correct but costly.` : `${exact[0].name} matches the list.`,
    };
  }

  if (substitutes.length) {
    return {
      ...requirement,
      fulfilled: true,
      note: `${substitutes[0].name} is a logical substitute.`,
    };
  }

  return {
    ...requirement,
    fulfilled: false,
    note: 'Not found in the trolley.',
  };
}

function formatVolume(value) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}L`;
}

function renderShoppingList(report = scoreCart()) {
  els.shoppingList.innerHTML = '';
  report.requirements.forEach((requirement) => {
    const item = document.createElement('div');
    item.className = `list-item${requirement.fulfilled ? ' found' : ''}`;
    item.innerHTML = `
      <span class="list-item__check" aria-hidden="true">✓</span>
      <span>
        <span class="list-item__label">${requirement.label}</span>
        <span class="list-item__hint">${requirement.hint}</span>
      </span>
    `;
    els.shoppingList.appendChild(item);
  });
  els.progressCount.textContent = `${report.foundCount} of ${scenario.required.length}`;
}

function updateCartUI(report = scoreCart()) {
  els.cartList.innerHTML = '';
  els.cartCount.textContent = `${appState.cart.length} ${appState.cart.length === 1 ? 'item' : 'items'}`;

  if (!appState.cart.length) {
    els.cartList.innerHTML = '<div class="empty-state">Trolley is empty</div>';
  } else {
    appState.cart.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <span>${item.category}</span>
        </div>
        <div class="cart-item__actions">
          <span class="cart-item__price">${money(item.price)}</span>
          <button class="btn-remove" type="button" aria-label="Remove ${item.name}" data-remove-index="${index}">×</button>
        </div>
      `;
      els.cartList.appendChild(row);
    });
  }

  els.totalVal.textContent = money(report.totalSpent);
  els.budgetVal.textContent = report.remaining >= 0 ? money(report.remaining) : `${money(Math.abs(report.remaining))} over`;
  els.budgetBox.classList.toggle('budget-negative', report.remaining < 0);
}

function updateCheckoutState() {
  const checkout = zoneById('checkout');
  appState.nearCheckout = distance(player.x, player.z, checkout.x, checkout.z) < 2.15;
  els.checkoutBtn.disabled = !appState.gameStarted || !appState.nearCheckout;
  els.checkoutBtn.textContent = appState.nearCheckout ? 'Checkout' : 'Checkout nearby';
  els.checkoutHelp.textContent = appState.nearCheckout
    ? 'You are at the checkout counter.'
    : 'Move to the checkout area, or use practice checkout after you have started.';
}

function updateUI() {
  const report = scoreCart();
  renderShoppingList(report);
  updateCartUI(report);
  updateCheckoutState();
}

function inspectProduct(id) {
  const product = productById(id);
  if (!product) return;

  appState.selectedProductId = product.id;
  const zone = zoneById(product.zone);
  els.itemPanel.classList.remove('hidden');
  els.itemZone.textContent = `${zone?.label || product.category} aisle`;
  els.itemName.textContent = product.name;
  els.itemDetail.textContent = product.inStock === false ? `${product.detail} Choose a substitute instead.` : product.detail;
  els.itemPrice.textContent = money(product.price);
  els.addItemBtn.disabled = product.inStock === false;
  els.addItemBtn.textContent = product.inStock === false ? 'Out of stock' : 'Add to trolley';
  els.interactionHint.textContent = product.inStock === false
    ? `${product.name} is unavailable. Look nearby for a substitute.`
    : `Inspecting ${product.name}. Press Enter or use the button to add.`;
  setFocusLabel(product);
}

function closeItemPanel() {
  appState.selectedProductId = null;
  els.itemPanel.classList.add('hidden');
  hideFocusLabel();
  updateNearestPrompt();
}

function showToast(message) {
  window.clearTimeout(appState.toastTimer);
  els.toast.textContent = message;
  els.toast.classList.remove('hidden');
  appState.toastTimer = window.setTimeout(() => {
    els.toast.classList.add('hidden');
  }, 3200);
}

function initScene() {
  canvas = els.canvas;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdfe8ea);
  scene.fog = new THREE.Fog(0xdfe8ea, 10, 24);
  camera = new THREE.PerspectiveCamera(58, 1, 0.1, 80);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  addLighting();
  addMarketGeometry();
  addProducts();
  addPlayerMarker();
  bindSceneEvents();
  resizeRenderer();
  appState.sceneReady = true;
  appState.lastTime = performance.now();
  requestAnimationFrame(tick);
}

function addLighting() {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9fb0b5, 2.3));
  const light = new THREE.DirectionalLight(0xffffff, 2.1);
  light.position.set(3, 7, 4);
  light.castShadow = true;
  scene.add(light);
}

function addMarketGeometry() {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 16),
    new THREE.MeshStandardMaterial({ color: 0xf4f6f5, roughness: 0.92 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  addFloorTiles();

  addWall(0, -8.05, 18, 0.18);
  addWall(-9.05, 0, 0.18, 16);
  addWall(9.05, 0, 0.18, 16);
  addEntrance();
  addOverheadLights();

  addShelf(-5.2, 3.1, 3.3, 0.7, 0x7c944f, 'Produce');
  addShelf(0.1, 2.0, 3.7, 0.75, 0x6088b8, 'Dairy');
  addShelf(5.2, 3.0, 3.1, 0.7, 0xb46b5e, 'Meat');
  addShelf(-4.3, -1.0, 3.6, 0.75, 0xb98f4b, 'Dry Goods');
  addShelf(1.5, -1.0, 3.5, 0.75, 0xb64b3d, 'Sauces');
  addShelf(-5.1, -5.4, 3.6, 0.8, 0x9c75a9, 'Snacks');
  addDisplaySurface(0.1, 2.85, 2.6, 0.55, 0xdcecf3);
  addDisplaySurface(4.6, -4.72, 1.55, 0.48, 0xe9eef0);
  addCheckout();
  addAisleLines();
}

function addFloorTiles() {
  const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xd7e1e4 });
  for (let x = -8; x <= 8; x += 2) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.012, 16), lineMaterial);
    line.position.set(x, 0.018, 0);
    scene.add(line);
  }
  for (let z = -7; z <= 7; z += 2) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(18, 0.012, 0.025), lineMaterial);
    line.position.set(0, 0.019, z);
    scene.add(line);
  }
}

function addOverheadLights() {
  [-4.5, 0, 4.5].forEach((x) => {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 0.035, 0.18),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    strip.position.set(x, 3.35, 0.2);
    scene.add(strip);
  });
}

function addWall(x, z, width, depth) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width, 1.1, depth),
    new THREE.MeshStandardMaterial({ color: 0xc8d4d7, roughness: 0.75 })
  );
  wall.position.set(x, 0.55, z);
  wall.receiveShadow = true;
  wall.castShadow = true;
  scene.add(wall);
  colliders.push({ x, z, width, depth });
}

function addEntrance() {
  [-1.1, 1.1].forEach((x) => {
    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.55, 16),
      new THREE.MeshStandardMaterial({ color: 0x167c8c, roughness: 0.5 })
    );
    marker.position.set(x, 0.28, 7.25);
    marker.castShadow = true;
    scene.add(marker);
  });
}

function addShelf(x, z, width, depth, color, label) {
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.85, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.66 })
  );
  base.position.set(x, 0.42, z);
  base.castShadow = true;
  base.receiveShadow = true;
  scene.add(base);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.08, depth + 0.08),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
  );
  top.position.set(x, 0.94, z);
  scene.add(top);

  const backRail = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.1, 0.42, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xe8eef0, roughness: 0.58 })
  );
  backRail.position.set(x, 1.14, z + depth / 2 + 0.14);
  backRail.castShadow = true;
  backRail.receiveShadow = true;
  scene.add(backRail);

  const priceRail = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.08, 0.08, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xf7fafb, roughness: 0.5 })
  );
  priceRail.position.set(x, 1.02, z - depth / 2 - 0.02);
  priceRail.castShadow = true;
  scene.add(priceRail);

  const sign = createLabel(label, '#ffffff', '#172026');
  sign.position.set(x, 2.92, z + depth / 2 + 0.46);
  sign.scale.set(1.28, 0.34, 1);
  scene.add(sign);
  colliders.push({ x, z, width, depth });
}

function addDisplaySurface(x, z, width, depth, color) {
  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.2, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.62 })
  );
  stand.position.set(x, 0.78, z);
  stand.castShadow = true;
  stand.receiveShadow = true;
  scene.add(stand);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.08, 0.06, depth + 0.08),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.52 })
  );
  top.position.set(x, 0.94, z);
  top.receiveShadow = true;
  scene.add(top);
}

function addCheckout() {
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 0.85, 1.05),
    new THREE.MeshStandardMaterial({ color: 0x526d74, roughness: 0.7 })
  );
  counter.position.set(5.1, 0.42, -5.25);
  counter.castShadow = true;
  counter.receiveShadow = true;
  scene.add(counter);
  colliders.push({ x: 5.1, z: -5.25, width: 3.1, depth: 1.05 });

  const belt = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.06, 0.72),
    new THREE.MeshStandardMaterial({ color: 0x202c31, roughness: 0.42 })
  );
  belt.position.set(5.28, 0.9, -5.25);
  belt.castShadow = true;
  scene.add(belt);

  const baggingArea = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.05, 0.66),
    new THREE.MeshStandardMaterial({ color: 0xdce5e8, roughness: 0.5 })
  );
  baggingArea.position.set(6.12, 0.91, -5.25);
  scene.add(baggingArea);

  const till = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.32, 0.42),
    new THREE.MeshStandardMaterial({ color: 0x202c31, roughness: 0.4 })
  );
  till.position.set(4.45, 1.05, -5.25);
  scene.add(till);

  const scanner = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.07, 0.28),
    new THREE.MeshStandardMaterial({ color: 0x167c8c, roughness: 0.45 })
  );
  scanner.position.set(4.82, 0.98, -5.02);
  scanner.castShadow = true;
  scene.add(scanner);
  addTillPerson();

  const sign = createLabel('Checkout', '#ffffff', '#172026');
  sign.position.set(5.1, 2.1, -5.25);
  sign.scale.set(2.4, 0.58, 1);
  scene.add(sign);
}

function addTillPerson() {
  const person = new THREE.Group();
  person.position.set(4.25, 0, -6.05);

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.28, 0.58, 18),
    new THREE.MeshStandardMaterial({ color: 0x167c8c, roughness: 0.62 })
  );
  torso.position.set(0, 1.05, 0);
  torso.castShadow = true;
  person.add(torso);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 20, 14),
    new THREE.MeshStandardMaterial({ color: 0xc98f6f, roughness: 0.6 })
  );
  head.position.set(0, 1.48, 0);
  head.castShadow = true;
  person.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 18, 10),
    new THREE.MeshStandardMaterial({ color: 0x3b2a22, roughness: 0.74 })
  );
  hair.position.set(0, 1.57, -0.02);
  hair.scale.set(1, 0.52, 0.9);
  person.add(hair);

  [-0.24, 0.24].forEach((x) => {
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.42, 12),
      new THREE.MeshStandardMaterial({ color: 0xc98f6f, roughness: 0.6 })
    );
    arm.position.set(x, 1.08, 0.05);
    arm.rotation.z = x < 0 ? -0.65 : 0.65;
    arm.castShadow = true;
    person.add(arm);
  });

  scene.add(person);
}

function addAisleLines() {
  const material = new THREE.MeshBasicMaterial({ color: 0xc8d4d7 });
  [-2.2, 3.1].forEach((x) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 13), material);
    line.position.set(x, 0.012, -0.2);
    scene.add(line);
  });
}

function addProducts() {
  products.forEach((product) => {
    const group = new THREE.Group();
    const [x, z] = product.position;
    group.position.set(x, 0, z);

    createProductModel(product).forEach((part) => {
      part.traverse((child) => {
        if (child.isMesh || child.isSprite) {
          child.userData.productId = product.id;
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            itemMeshes.push(child);
          }
        }
      });
      group.add(part);
    });

    if (product.inStock === false) {
      const oos = createLabel('Sold out', '#ffffff', '#6b7280');
      oos.position.set(0, 1.72, 0);
      oos.scale.set(1.1, 0.34, 1);
      group.add(oos);
    }

    scene.add(group);
  });
}

function createProductModel(product) {
  const color = product.inStock === false ? 0x9aa7ad : product.color;
  const id = product.id;
  if (['banana-bunch', 'green-apples', 'oranges'].includes(id)) return createFruitModel(id, color);
  if (id.includes('milk') || id === 'single-cream') return createDairyModel(id, color);
  if (id.includes('cheddar')) return createCheeseModel(color);
  if (id.includes('sauce') || id.includes('tomatoes') || id === 'passata') return createSauceModel(id, color);
  if (id.includes('mince')) return createMeatTrayModel(color);
  if (id === 'green-lentils') return createLentilsModel(color);
  if (id.includes('pasta') || id === 'penne') return createPastaModel(id, color);
  if (id === 'chocolate-cake') return createCakeModel(color);
  if (id === 'fizzy-drinks') return createDrinkPackModel(color);
  if (id === 'red-wine') return [createBottleModel(color, 0x2f151d)];
  if (id === 'crisps') return createCrispsModel(color);
  if (id === 'ready-meal') return createReadyMealModel(color);
  if (id === 'flowers') return createFlowersModel(color);
  if (id === 'magazine') return createMagazineModel(color);
  return [createPacket(color, 0.42, 0.56, 0.16, 1.18)];
}

function material(color, roughness = 0.64, metalness = 0.02, opacity = 1) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    transparent: opacity < 1,
    opacity,
  });
}

function createMesh(geometry, color, position, scale = [1, 1, 1], rotation = [0, 0, 0], roughness = 0.64, opacity = 1) {
  const mesh = new THREE.Mesh(geometry, material(color, roughness, 0.02, opacity));
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  return mesh;
}

function createPacket(color, width, height, depth, y, label = '') {
  const group = new THREE.Group();
  group.add(createMesh(new THREE.BoxGeometry(width, height, depth), color, [0, y, 0], [1, 1, 1], [0.04, 0, 0]));
  group.add(createMesh(new THREE.BoxGeometry(width * 0.72, height * 0.24, depth + 0.012), 0xffffff, [0, y + height * 0.05, -depth / 2 - 0.008], [1, 1, 1], [0.04, 0, 0], 0.5));
  if (label) {
    const labelSprite = createLabel(label, '#172026', '#ffffff');
    labelSprite.position.set(0, y + height * 0.05, -depth / 2 - 0.03);
    labelSprite.scale.set(0.64, 0.22, 1);
    group.add(labelSprite);
  }
  return group;
}

function createFruitModel(id, color) {
  const group = new THREE.Group();
  if (id === 'banana-bunch') {
    [-0.16, 0, 0.16].forEach((offset, index) => {
      const banana = createMesh(new THREE.TorusGeometry(0.18, 0.045, 10, 28, Math.PI * 1.22), color, [offset, 1.19, 0], [1, 0.62, 1], [0.55, 0, index * 0.35]);
      group.add(banana);
    });
    group.add(createMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 8), 0x5a3a20, [0.04, 1.33, 0], [1, 1, 1], [0.8, 0, 0.2]));
    return [group];
  }

  const fruitColor = id === 'green-apples' ? 0x7dbf4d : 0xe89028;
  [-0.18, 0.15, 0.02].forEach((offset, index) => {
    const fruit = createMesh(new THREE.SphereGeometry(0.17, 24, 16), fruitColor, [offset, 1.17 + index * 0.06, index === 1 ? 0.08 : -0.05]);
    group.add(fruit);
    if (id === 'green-apples') {
      group.add(createMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.11, 8), 0x5a3a20, [offset + 0.02, 1.35 + index * 0.06, index === 1 ? 0.08 : -0.05], [1, 1, 1], [0.2, 0, 0.2]));
    }
  });
  return [group];
}

function createDairyModel(id, color) {
  const group = new THREE.Group();
  if (id === 'milk-2l' || id === 'fresh-milk-1l' || id === 'small-milk') {
    const height = id === 'small-milk' ? 0.48 : id === 'milk-2l' ? 0.82 : 0.66;
    const radius = id === 'small-milk' ? 0.13 : 0.16;
    const baseY = 0.98;
    group.add(createMesh(new THREE.CylinderGeometry(radius, radius * 1.08, height, 28), color, [0, baseY + height / 2, 0]));
    group.add(createMesh(new THREE.CylinderGeometry(radius * 0.55, radius * 0.6, 0.18, 24), color, [0, baseY + height + 0.04, 0]));
    group.add(createMesh(new THREE.CylinderGeometry(radius * 0.5, radius * 0.5, 0.08, 24), 0x2f75b5, [0, baseY + height + 0.17, 0]));
    group.add(createMesh(new THREE.BoxGeometry(radius * 1.55, 0.16, 0.018), 0xffffff, [0, baseY + height * 0.55 + 0.05, -radius - 0.012]));
    return [group];
  }

  group.add(createPacket(color, 0.34, 0.58, 0.24, 1.18, 'Cream'));
  group.add(createMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 16), 0x2f75b5, [0.08, 1.53, -0.04]));
  return [group];
}

function createCheeseModel(color) {
  const wedge = new THREE.Shape();
  wedge.moveTo(-0.26, -0.18);
  wedge.lineTo(0.28, -0.18);
  wedge.lineTo(-0.05, 0.26);
  wedge.lineTo(-0.26, -0.18);
  const geometry = new THREE.ExtrudeGeometry(wedge, { depth: 0.34, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.02, bevelSegments: 2 });
  const mesh = createMesh(geometry, color, [-0.04, 1.18, 0.17], [1, 1, 1], [0, 0.2, 0]);
  const rind = createMesh(new THREE.BoxGeometry(0.08, 0.34, 0.36), 0xd88925, [-0.26, 1.2, 0], [1, 1, 1], [0.1, 0.25, 0]);
  return [mesh, rind];
}

function createSauceModel(id, color) {
  const group = new THREE.Group();
  if (id === 'passata') {
    group.add(createBottleModel(color, 0xd94430));
    return [group];
  }

  const radius = id === 'jar-tomato-sauce' ? 0.16 : 0.17;
  group.add(createMesh(new THREE.CylinderGeometry(radius, radius, 0.5, 28), color, [0, 1.26, 0]));
  group.add(createMesh(new THREE.CylinderGeometry(radius * 0.95, radius * 0.95, 0.08, 28), 0x3f4548, [0, 1.55, 0]));
  group.add(createMesh(new THREE.BoxGeometry(radius * 1.45, 0.14, 0.018), 0xffffff, [0, 1.27, -radius - 0.012]));
  return [group];
}

function createBottleModel(color, glassColor = 0x365d9b) {
  const group = new THREE.Group();
  group.add(createMesh(new THREE.CylinderGeometry(0.15, 0.17, 0.56, 28), color, [0, 1.25, 0]));
  group.add(createMesh(new THREE.CylinderGeometry(0.075, 0.095, 0.32, 24), glassColor, [0, 1.68, 0]));
  group.add(createMesh(new THREE.CylinderGeometry(0.08, 0.08, 0.07, 24), 0x1f2933, [0, 1.88, 0]));
  group.add(createMesh(new THREE.BoxGeometry(0.22, 0.15, 0.018), 0xffffff, [0, 1.28, -0.17]));
  return group;
}

function createMeatTrayModel(color) {
  const group = new THREE.Group();
  group.add(createMesh(new THREE.BoxGeometry(0.52, 0.08, 0.38), 0x111827, [0, 1.06, 0], [1, 1, 1], [0, 0.08, 0]));
  group.add(createMesh(new THREE.SphereGeometry(0.18, 24, 14), color, [-0.08, 1.14, 0], [1.35, 0.32, 0.75], [0, 0, 0], 0.72));
  group.add(createMesh(new THREE.BoxGeometry(0.5, 0.035, 0.36), 0xffffff, [0, 1.2, 0], [1, 1, 1], [0, 0.08, 0], 0.2, 0.45));
  return [group];
}

function createLentilsModel(color) {
  const group = createPacket(color, 0.34, 0.48, 0.18, 1.17, 'Lentils');
  [-0.09, 0, 0.09].forEach((offset) => {
    group.add(createMesh(new THREE.SphereGeometry(0.035, 10, 8), 0x4f6f32, [offset, 1.42, -0.1]));
  });
  return [group];
}

function createPastaModel(id, color) {
  const group = new THREE.Group();
  if (id === 'dry-spaghetti' || id === 'fresh-egg-pasta') {
    const isSpaghetti = id === 'dry-spaghetti';
    const packetWidth = isSpaghetti ? 0.74 : 0.58;
    const strandLength = isSpaghetti ? 0.82 : 0.62;
    group.add(createPacket(0xf0d37a, packetWidth, 0.16, 0.18, 1.16, isSpaghetti ? 'Spaghetti' : 'Fresh pasta'));
    [-0.24, -0.12, 0, 0.12, 0.24].forEach((offset) => {
      group.add(createMesh(new THREE.CylinderGeometry(0.012, 0.012, strandLength, 8), color, [offset, 1.25, -0.02], [1, 1, 1], [0, 0, Math.PI / 2]));
    });
    if (isSpaghetti) group.rotation.y = -0.16;
    return [group];
  }

  group.add(createPacket(color, 0.38, 0.48, 0.16, 1.18, 'Penne'));
  [-0.1, 0.02, 0.12].forEach((offset) => {
    group.add(createMesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 12), 0xe5b65a, [offset, 1.42, -0.09], [1, 1, 1], [0.6, 0.3, 0.2]));
  });
  return [group];
}

function createCakeModel(color) {
  const group = new THREE.Group();
  group.add(createMesh(new THREE.CylinderGeometry(0.23, 0.25, 0.22, 32), color, [0, 1.12, 0]));
  group.add(createMesh(new THREE.CylinderGeometry(0.22, 0.22, 0.045, 32), 0xf2e8df, [0, 1.26, 0]));
  group.add(createMesh(new THREE.SphereGeometry(0.035, 12, 8), 0xd33f49, [0.08, 1.3, -0.05]));
  return [group];
}

function createDrinkPackModel(color) {
  const group = new THREE.Group();
  [-0.14, 0.02, 0.18].forEach((offset) => {
    group.add(createMesh(new THREE.CylinderGeometry(0.075, 0.075, 0.42, 24), color, [offset, 1.22, 0]));
    group.add(createMesh(new THREE.CylinderGeometry(0.077, 0.077, 0.02, 24), 0xd9e2e6, [offset, 1.44, 0]));
  });
  group.add(createMesh(new THREE.BoxGeometry(0.46, 0.22, 0.08), 0xffffff, [0.02, 1.22, -0.08], [1, 1, 1], [0, 0, 0], 0.5, 0.6));
  return [group];
}

function createCrispsModel(color) {
  const group = createPacket(color, 0.42, 0.55, 0.08, 1.2, 'Crisps');
  group.rotation.z = -0.12;
  return [group];
}

function createReadyMealModel(color) {
  const group = new THREE.Group();
  group.add(createMesh(new THREE.BoxGeometry(0.54, 0.12, 0.36), 0x222a30, [0, 1.09, 0]));
  group.add(createMesh(new THREE.BoxGeometry(0.46, 0.08, 0.28), color, [0, 1.18, 0]));
  group.add(createMesh(new THREE.BoxGeometry(0.5, 0.028, 0.32), 0xffffff, [0, 1.25, 0], [1, 1, 1], [0, 0, 0], 0.4, 0.5));
  return [group];
}

function createFlowersModel(color) {
  const group = new THREE.Group();
  [-0.11, 0, 0.11].forEach((offset, index) => {
    group.add(createMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 8), 0x2f7d44, [offset * 0.5, 1.25, 0], [1, 1, 1], [0.18 * (index - 1), 0, offset]));
    group.add(createMesh(new THREE.SphereGeometry(0.075, 14, 10), index === 1 ? color : 0xf5b2d1, [offset, 1.56 + index * 0.04, 0]));
  });
  group.add(createMesh(new THREE.CylinderGeometry(0.12, 0.09, 0.28, 18), 0xd7c2a2, [0, 1.05, 0]));
  return [group];
}

function createMagazineModel(color) {
  const group = createPacket(color, 0.42, 0.56, 0.035, 1.2, 'Magazine');
  group.rotation.y = -0.2;
  return [group];
}

function addPlayerMarker() {
  playerMarker = new THREE.Group();
  const metal = material(0x6f7d84, 0.46, 0.12);
  const accent = material(0x167c8c, 0.55, 0.02);
  const dark = material(0x172026, 0.6, 0.02);
  const basket = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.24, 0.64), material(0xd9e2e6, 0.38, 0.04, 0.72));
  basket.position.set(0, 0.34, -0.04);
  basket.castShadow = true;
  basket.receiveShadow = true;

  const rim = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.05, 0.72), metal);
  rim.position.set(0, 0.49, -0.04);
  rim.castShadow = true;

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.018, 8, 30, Math.PI), metal);
  handle.position.set(0, 0.56, 0.32);
  handle.rotation.set(Math.PI / 2, 0, Math.PI);
  handle.castShadow = true;

  const front = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.1), accent);
  front.position.set(0, 0.32, -0.42);
  front.castShadow = true;

  [-0.22, 0.22].forEach((x) => {
    [-0.27, 0.25].forEach((z) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.055, 18), dark);
      wheel.position.set(x, 0.08, z);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      playerMarker.add(wheel);
    });
  });

  const directionBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.2), material(0xffffff, 0.5, 0.02));
  directionBar.position.set(0, 0.55, -0.43);
  directionBar.castShadow = true;

  playerMarker.add(basket, rim, handle, front, directionBar);
  scene.add(playerMarker);
}

function createLabel(text, foreground, background) {
  const canvasEl = document.createElement('canvas');
  canvasEl.width = 512;
  canvasEl.height = 192;
  const context = canvasEl.getContext('2d');
  context.clearRect(0, 0, canvasEl.width, canvasEl.height);
  drawRoundRect(context, 18, 28, canvasEl.width - 36, canvasEl.height - 56, 20, background);
  context.fillStyle = foreground;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '700 42px Inter, Arial, sans-serif';
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    context.fillText(line, canvasEl.width / 2, canvasEl.height / 2 + (index - (lines.length - 1) / 2) * 50);
  });
  const texture = new THREE.CanvasTexture(canvasEl);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  return new THREE.Sprite(material);
}

function drawRoundRect(context, x, y, width, height, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fill();
}

function bindSceneEvents() {
  window.addEventListener('resize', resizeRenderer);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', (event) => appState.keys.delete(event.key.toLowerCase()));
  canvas.addEventListener('pointerdown', handleCanvasPointer);

  document.querySelectorAll('[data-control]').forEach((button) => {
    const action = button.dataset.control;
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      appState.keys.add(action);
    });
    button.addEventListener('pointerup', () => appState.keys.delete(action));
    button.addEventListener('pointerleave', () => appState.keys.delete(action));
    button.addEventListener('pointercancel', () => appState.keys.delete(action));
  });
}

function bindUIEvents() {
  els.startBtn.addEventListener('click', startGame);
  els.addItemBtn.addEventListener('click', () => {
    if (appState.selectedProductId) addToCart(appState.selectedProductId);
  });
  els.closeItemBtn.addEventListener('click', closeItemPanel);
  els.cartList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-index]');
    if (button) removeFromCart(Number(button.dataset.removeIndex));
  });
  els.checkoutBtn.addEventListener('click', finishShop);
  els.practiceCheckoutBtn.addEventListener('click', finishShop);
}

function handleKeyDown(event) {
  const key = event.key.toLowerCase();
  if (key === 'escape' && !els.itemPanel.classList.contains('hidden')) {
    event.preventDefault();
    closeItemPanel();
    return;
  }

  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
    event.preventDefault();
    appState.keys.add(key);
  }

  if (key === 'e') {
    const nearest = nearestProduct();
    if (nearest) {
      inspectProduct(nearest.id);
    }
  }

  if (key === 'enter' && appState.selectedProductId) {
    addToCart(appState.selectedProductId);
  }
}

function handleCanvasPointer(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(itemMeshes, false);
  if (hits.length) {
    inspectProduct(hits[0].object.userData.productId);
  }
}

function resizeRenderer() {
  if (!renderer) return;
  const rect = canvas.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / Math.max(rect.height, 1);
  camera.updateProjectionMatrix();
}

function tick(now) {
  const dt = Math.min((now - appState.lastTime) / 1000, 0.04);
  appState.lastTime = now;
  updateMovement(dt);
  updateCamera();
  updateCheckoutState();
  updateNearestPrompt();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

function updateMovement(dt) {
  if (!appState.gameStarted) return;

  const rotationSpeed = 1.65;
  const moveSpeed = 2.15;
  const turnLeft = appState.keys.has('a') || appState.keys.has('arrowleft') || appState.keys.has('turn-left');
  const turnRight = appState.keys.has('d') || appState.keys.has('arrowright') || appState.keys.has('turn-right');
  const forward = appState.keys.has('w') || appState.keys.has('arrowup') || appState.keys.has('forward');
  const backward = appState.keys.has('s') || appState.keys.has('arrowdown') || appState.keys.has('backward');

  if (turnLeft) player.rotation += rotationSpeed * dt;
  if (turnRight) player.rotation -= rotationSpeed * dt;

  const dirX = Math.sin(player.rotation);
  const dirZ = Math.cos(player.rotation);
  const signedSpeed = (forward ? 1 : 0) - (backward ? 1 : 0);
  if (signedSpeed) {
    const nextX = player.x + dirX * signedSpeed * moveSpeed * dt;
    const nextZ = player.z + dirZ * signedSpeed * moveSpeed * dt;
    if (!collides(nextX, player.z)) player.x = nextX;
    if (!collides(player.x, nextZ)) player.z = nextZ;
  }

  player.x = THREE.MathUtils.clamp(player.x, -8.35, 8.35);
  player.z = THREE.MathUtils.clamp(player.z, -7.35, 7.35);
  playerMarker.position.set(player.x, 0.04, player.z);
  playerMarker.rotation.y = player.rotation;
}

function collides(x, z) {
  return colliders.some((collider) => {
    const halfWidth = collider.width / 2 + player.radius;
    const halfDepth = collider.depth / 2 + player.radius;
    return Math.abs(x - collider.x) < halfWidth && Math.abs(z - collider.z) < halfDepth;
  });
}

function updateCamera() {
  const dir = new THREE.Vector3(Math.sin(player.rotation), 0, Math.cos(player.rotation));
  const playerPos = new THREE.Vector3(player.x, 0.75, player.z);
  const cameraPos = playerPos.clone().addScaledVector(dir, -3.7);
  cameraPos.y = 3.7;
  camera.position.lerp(cameraPos, 0.16);
  camera.lookAt(playerPos.clone().addScaledVector(dir, 2.1));
}

function nearestProduct() {
  let nearest = null;
  let nearestDistance = Infinity;
  products.forEach((product) => {
    const [x, z] = product.position;
    const d = distance(player.x, player.z, x, z);
    if (d < nearestDistance) {
      nearestDistance = d;
      nearest = product;
    }
  });
  return nearestDistance < 1.5 ? nearest : null;
}

function updateNearestPrompt() {
  if (!appState.gameStarted) return;
  if (!els.itemPanel.classList.contains('hidden')) return;
  const nearest = nearestProduct();
  if (nearest) {
    els.interactionHint.textContent = `Near ${nearest.name}. Press E to inspect, or click/tap the product.`;
    setFocusLabel(nearest);
  } else if (appState.nearCheckout) {
    els.interactionHint.textContent = 'You are at checkout. Review the trolley, then check out.';
    hideFocusLabel();
  } else {
    els.interactionHint.textContent = 'Use WASD or arrow keys to move. Click or press E near an item to inspect.';
    hideFocusLabel();
  }
}

function setFocusLabel(product) {
  if (!scene || !product) return;
  if (focusLabelProductId === product.id) {
    if (focusLabel) focusLabel.visible = true;
    return;
  }
  hideFocusLabel();
  focusLabelProductId = product.id;
  focusLabel = createLabel(`${product.name}\n${product.inStock === false ? 'Out of stock' : money(product.price)}`, '#172026', '#ffffff');
  const [x, z] = product.position;
  focusLabel.position.set(x, 2.55, z);
  focusLabel.scale.set(1.45, 0.54, 1);
  scene.add(focusLabel);
}

function hideFocusLabel() {
  focusLabelProductId = '';
  if (focusLabel) {
    scene.remove(focusLabel);
    focusLabel = null;
  }
}

function distance(x1, z1, x2, z2) {
  return Math.hypot(x1 - x2, z1 - z2);
}

function init() {
  els.budgetLimit.textContent = money(scenario.budget);
  bindUIEvents();
  renderShoppingList();
  updateCartUI();
}

window.startGame = startGame;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.finishShop = finishShop;
window.toggleCheck = toggleCheck;

init();
