import './app-3d.js';

// Scavenger hunt list (10 items total)
const scavengerItems = [
  { id: 'picnic-basket', label: 'Picnic Basket', zone: 'South Grass', desc: 'A classic checkered picnic basket left near a tree.', side: 'left' },
  { id: 'binoculars', label: 'Binoculars', zone: 'West Path', desc: 'Black bird-watching binoculars sitting on a bench.', side: 'left' },
  { id: 'red-flower', label: 'Red Rose Bush', zone: 'West Flowerbed', desc: 'A patch of vibrant red flowers blooming near the gravel path.', side: 'left' },
  { id: 'lost-key', label: 'Lost House Key', zone: 'North Aisle', desc: 'A shiny brass key dropped on the grass.', side: 'left' },
  { id: 'thermos', label: 'Warm Thermos', zone: 'East Path', desc: 'A metal hot-drink flask resting under a bench.', side: 'right' },
  { id: 'camera', label: 'Vintage Camera', zone: 'Fountain Edge', desc: 'A tourist camera sitting on the stone wall of the fountain.', side: 'left' },
  { id: 'wallet', label: 'Lost Wallet', zone: 'Northwest Bench', desc: 'A brown leather pocket wallet dropped on a bench.', side: 'left' },
  { id: 'sketchbook', label: 'Artist Sketchbook', zone: 'Southwest Flowerbed', desc: 'A hardbound sketchbook resting among the flowers.', side: 'left' },
  { id: 'water-flask', label: 'Water Flask', zone: 'Southeast Bench', desc: 'A reusable water bottle resting under a bench.', side: 'right' },
  { id: 'sun-hat', label: 'Straw Sun Hat', zone: 'Northeast Grass', desc: 'A straw sun hat left near the flowerbed.', side: 'right' }
];

const state = {
  cart: [], // items collected so far
  gameStarted: false,
  startTime: 0,
  leftTime: 0,
  rightTime: 0,
  leftTurns: 0,
  rightTurns: 0,
  findTimes: {}, // id -> time in seconds from start
  lastTurnAngle: 0,
  accumulatedTurnAngle: 0, // Track continuous rotation angle for discrete turns
  leftAnchorActive: false,
  selectedItemId: null,
  toastTimer: null
};

const els = {
  progressCount: document.getElementById('progress-count'),
  turnsRatio: document.getElementById('turns-ratio'),
  attentionRating: document.getElementById('attention-rating'),
  scavengerList: document.getElementById('scavenger-list'),
  toggleAnchorBtn: document.getElementById('toggle-anchor-btn'),
  introScreen: document.getElementById('intro-screen'),
  startBtn: document.getElementById('start-btn'),
  toast: document.getElementById('toast'),
  itemPanel: document.getElementById('item-panel'),
  itemZone: document.getElementById('item-zone'),
  itemName: document.getElementById('item-name'),
  itemDetail: document.getElementById('item-detail'),
  addItemBtn: document.getElementById('add-item-btn'),
  closeItemBtn: document.getElementById('close-item-btn'),
  leftTimePercent: document.getElementById('left-time-percent'),
  leftTurnCount: document.getElementById('left-turn-count'),
  rightTurnCount: document.getElementById('right-turn-count'),
  finishBtn: document.getElementById('finish-btn'),
  practiceFinishBtn: document.getElementById('practice-finish-btn'),
  reportScreen: document.getElementById('report-screen'),
  feedbackSummary: document.getElementById('feedback-summary'),
  starScore: document.getElementById('star-score'),
  resNeglect: document.getElementById('res-neglect'),
  resItems: document.getElementById('res-items'),
  resTurns: document.getElementById('res-turns'),
  resLeftTime: document.getElementById('res-left-time'),
  resBody: document.getElementById('res-body'),
  clinicianComment: document.getElementById('clinician-comment'),
  downloadCsvBtn: document.getElementById('download-csv-btn')
};

// Start game triggers
els.startBtn.addEventListener('click', startExploration);
els.toggleAnchorBtn.addEventListener('click', toggleLeftAnchor);
els.closeItemBtn.addEventListener('click', closeItemPanel);
els.addItemBtn.addEventListener('click', collectSelectedItem);
els.finishBtn.addEventListener('click', finishSession);
els.practiceFinishBtn.addEventListener('click', finishSession);
els.downloadCsvBtn.addEventListener('click', exportCSV);

function showToast(msg) {
  window.clearTimeout(state.toastTimer);
  els.toast.textContent = msg;
  els.toast.classList.remove('hidden');
  state.toastTimer = window.setTimeout(() => {
    els.toast.classList.add('hidden');
  }, 3200);
}

function startExploration() {
  els.introScreen.classList.add('hidden');
  state.gameStarted = true;
  state.startTime = performance.now();
  
  // Call scene starting triggers in 3D module
  if (window.PARK_3D && typeof window.PARK_3D.startScene === 'function') {
    window.PARK_3D.startScene();
  }
  
  showToast('Park exploration started! Search carefully, and make sure to turn and look to the LEFT.');
  updateUI();
  
  // Start metrics reporting interval (every 1 second)
  setInterval(tickMetrics, 1000);
}

// Visual Left Sky Arrow Toggle (neglect guide)
function toggleLeftAnchor() {
  state.leftAnchorActive = !state.leftAnchorActive;
  els.toggleAnchorBtn.classList.toggle('active', state.leftAnchorActive);
  if (window.PARK_3D && typeof window.PARK_3D.toggleSkyArrow === 'function') {
    window.PARK_3D.toggleSkyArrow(state.leftAnchorActive);
  }
  showToast(state.leftAnchorActive ? 'Left sky arrow enabled.' : 'Left sky arrow disabled.');
}

// Update active checklists
function renderChecklist() {
  els.scavengerList.innerHTML = '';
  scavengerItems.forEach(item => {
    const isCollected = state.cart.some(c => c.id === item.id);
    const row = document.createElement('div');
    row.className = `list-item${isCollected ? ' found' : ''}`;
    row.innerHTML = `
      <span class="list-item__check" aria-hidden="true">${isCollected ? '✓' : ''}</span>
      <div>
        <span style="display: block;"><strong>${item.label}</strong></span>
        <span style="font-size: 0.72rem; color: #757575;">Zone: ${item.zone} (${item.side === 'left' ? '⬅️ Left Side' : '➡️ Right Side'})</span>
      </div>
    `;
    els.scavengerList.appendChild(row);
  });
  
  els.progressCount.textContent = `${state.cart.length} of ${scavengerItems.length}`;
}

// Collect a 3D item
export function triggerInspectItem(id) {
  const item = scavengerItems.find(x => x.id === id);
  if (!item) return;
  
  state.selectedItemId = item.id;
  els.itemPanel.classList.remove('hidden');
  els.itemZone.textContent = `${item.zone} area`;
  els.itemName.textContent = item.label;
  els.itemDetail.textContent = item.desc;
  
  const isAlreadyFound = state.cart.some(c => c.id === item.id);
  els.addItemBtn.disabled = isAlreadyFound;
  els.addItemBtn.textContent = isAlreadyFound ? 'Already Collected' : 'Collect Item';
}

function closeItemPanel() {
  state.selectedItemId = null;
  els.itemPanel.classList.add('hidden');
  if (window.PARK_3D && typeof window.PARK_3D.clearInspectionFocus === 'function') {
    window.PARK_3D.clearInspectionFocus();
  }
}

function collectSelectedItem() {
  if (!state.selectedItemId) return;
  
  const item = scavengerItems.find(x => x.id === state.selectedItemId);
  if (!item) return;
  
  if (state.cart.some(c => c.id === item.id)) {
    showToast(`${item.label} is already collected!`);
    closeItemPanel();
    return;
  }
  
  state.findTimes[item.id] = (performance.now() - state.startTime) / 1000;
  state.cart.push(item);
  showToast(`Collected: ${item.label}!`);
  
  // Update 3D visual target state (make it disappear)
  if (window.PARK_3D && typeof window.PARK_3D.removeItemFromScene === 'function') {
    window.PARK_3D.removeItemFromScene(item.id);
  }
  
  updateUI();
  closeItemPanel();
}

// Track camera turns and orientations
export function logCameraDirection(angle) {
  if (!state.gameStarted) return;
  
  const threshold = 0.005; // filter noise
  const delta = angle - state.lastTurnAngle;
  
  // Track time spent looking in left vs right hemifields
  // Facing North: turning left (West) increases angle, so dirX = -sin(angle) is negative (< 0)
  const dirX = -Math.sin(angle);
  if (dirX < 0) {
    state.leftTime += 1/60; // based on 60fps tick
  } else {
    state.rightTime += 1/60;
  }
  
  if (Math.abs(delta) > threshold) {
    // If the direction changed, reset the accumulator to speed up registration of the new turn
    const currentSign = Math.sign(delta);
    const prevSign = Math.sign(state.accumulatedTurnAngle);
    if (state.accumulatedTurnAngle !== 0 && currentSign !== prevSign) {
      state.accumulatedTurnAngle = 0;
    }
    
    state.accumulatedTurnAngle += delta;
    
    const turnThreshold = 0.15; // ~8.6 degrees is a clear intentional movement
    if (state.accumulatedTurnAngle >= turnThreshold) {
      state.leftTurns += 1;
      state.accumulatedTurnAngle = 0;
    } else if (state.accumulatedTurnAngle <= -turnThreshold) {
      state.rightTurns += 1;
      state.accumulatedTurnAngle = 0;
    }
    
    state.lastTurnAngle = angle;
  }
}

// Interval tick to display real-time clinician dashboard stats
function tickMetrics() {
  if (!state.gameStarted) return;
  
  const total = state.leftTime + state.rightTime || 1;
  const leftPercent = Math.round((state.leftTime / total) * 100);
  
  els.leftTimePercent.textContent = `${leftPercent}%`;
  els.leftTurnCount.textContent = state.leftTurns;
  els.rightTurnCount.textContent = state.rightTurns;
  
  els.turnsRatio.textContent = `${state.leftTurns} / ${state.rightTurns}`;
  
  // Dynamically analyze attention level
  let attentionRating = "Scanning...";
  if (leftPercent < 20) {
    attentionRating = "Severe Neglect ⚠️";
    els.statusBox.className = "budget-negative";
  } else if (leftPercent < 38) {
    attentionRating = "Mild Neglect 🔍";
    els.statusBox.removeAttribute("class");
  } else {
    attentionRating = "Normal Sweep ✅";
    els.statusBox.removeAttribute("class");
  }
  els.attentionRating.textContent = attentionRating;
  
  // Enable complete button if all items are found
  const completedAll = state.cart.length === scavengerItems.length;
  els.finishBtn.disabled = !completedAll;
}

function updateUI() {
  renderChecklist();
}

// Scoring and analysis
function scoreSession() {
  const totalTime = (performance.now() - state.startTime) / 1000;
  const collectedLeft = state.cart.filter(item => item.side === 'left').length;
  const collectedRight = state.cart.filter(item => item.side === 'right').length;
  
  const totalLeft = scavengerItems.filter(x => x.side === 'left').length;
  const totalRight = scavengerItems.filter(x => x.side === 'right').length;
  
  // Average find times
  let avgLeftTime = 0;
  let avgRightTime = 0;
  
  const leftFinds = state.cart.filter(x => x.side === 'left');
  const rightFinds = state.cart.filter(x => x.side === 'right');
  
  if (leftFinds.length) {
    avgLeftTime = leftFinds.reduce((sum, item) => sum + state.findTimes[item.id], 0) / leftFinds.length;
  }
  if (rightFinds.length) {
    avgRightTime = rightFinds.reduce((sum, item) => sum + state.findTimes[item.id], 0) / rightFinds.length;
  }
  
  // Neglect Index calculation
  const lookRatio = state.leftTime / (state.leftTime + state.rightTime || 1);
  let neglectRating = "Normal Exploration";
  let interpretation = "Patient effectively scanned both hemifields.";
  let starRating = 3;
  let neglectClass = "pass";
  
  if (lookRatio < 0.22) {
    neglectRating = "Severe Left Neglect";
    interpretation = "Patient showed a strong rightward bias and rarely scanned the left hemifield.";
    starRating = 1;
    neglectClass = "fail";
  } else if (lookRatio < 0.38) {
    neglectRating = "Mild Left Neglect";
    interpretation = "Patient scanned left side occasionally but required deliberate cues or effort.";
    starRating = 2;
    neglectClass = "warn";
  }
  
  return {
    totalTime,
    collectedLeft,
    collectedRight,
    totalLeft,
    totalRight,
    avgLeftTime,
    avgRightTime,
    neglectRating,
    neglectClass,
    interpretation,
    starRating,
    lookRatio
  };
}

function finishSession() {
  state.gameStarted = false;
  
  const report = scoreSession();
  els.reportScreen.classList.remove('hidden');
  
  els.resNeglect.textContent = report.neglectRating;
  els.resNeglect.className = report.neglectClass;
  els.resItems.textContent = `${state.cart.length}/${scavengerItems.length}`;
  els.resTurns.textContent = `${state.leftTurns} / ${state.rightTurns}`;
  els.resLeftTime.textContent = `${Math.round(report.lookRatio * 100)}%`;
  
  els.starScore.textContent = `${report.starRating} / 3`;
  els.feedbackSummary.textContent = `Completed exploration in ${Math.round(report.totalTime)}s. ${report.interpretation}`;
  
  // Build details table
  const body = els.resBody;
  body.innerHTML = '';
  
  addReportRow(body, 'Left Hemifield Targets found', `${report.collectedLeft} / ${report.totalLeft}`, `Found ${Math.round(report.collectedLeft / report.totalLeft * 100)}% of items placed on the left.`, report.collectedLeft === report.totalLeft ? 'pass' : 'warn');
  addReportRow(body, 'Right Hemifield Targets found', `${report.collectedRight} / ${report.totalRight}`, `Found ${Math.round(report.collectedRight / report.totalRight * 100)}% of items placed on the right.`, 'pass');
  
  if (report.avgLeftTime > 0) {
    const ratio = report.avgLeftTime / (report.avgRightTime || 1);
    const slowInterpretation = ratio > 1.4 ? `Left-side search was ${ratio.toFixed(1)}x slower than right.` : 'Left-side and right-side search times are balanced.';
    addReportRow(body, 'Average Left-Side Find Time', `${Math.round(report.avgLeftTime)}s`, slowInterpretation, ratio > 1.4 ? 'warn' : 'pass');
  } else {
    addReportRow(body, 'Left-Side Search', 'Incomplete', 'Failed to find left-side items.', 'fail');
  }
  
  addReportRow(body, 'Left Sky Arrow Usage', state.leftAnchorActive ? 'Enabled' : 'None used', state.leftAnchorActive ? 'Used Left Sky Arrow in the sky to orient attention leftward.' : 'Completed scanning without active visual anchor guides.', 'pass');
}

function addReportRow(body, metric, value, interpretation, className) {
  body.insertAdjacentHTML('beforeend', `
    <tr>
      <td><strong>${metric}</strong></td>
      <td class="${className}">${value}</td>
      <td>${interpretation}</td>
    </tr>
  `);
}

// CSV Export logic
function exportCSV() {
  const ts = new Date().toISOString();
  const report = scoreSession();
  const notes = (els.clinicianComment.value || '').replace(/\r?\n/g, ' ');
  
  const headers = [
    'timestamp', 'session_duration_sec', 'items_collected_ratio',
    'left_items_found', 'right_items_found', 'left_side_time_percent',
    'left_turns', 'right_turns', 'avg_left_find_time_sec', 'avg_right_find_time_sec',
    'visual_anchor_used', 'neglect_assessment', 'clinician_comments'
  ];
  
  const row = [
    ts,
    Math.round(report.totalTime),
    `${state.cart.length}/${scavengerItems.length}`,
    `${report.collectedLeft}/${report.totalLeft}`,
    `${report.collectedRight}/${report.totalRight}`,
    Math.round(report.lookRatio * 100),
    state.leftTurns,
    state.rightTurns,
    report.avgLeftTime ? Math.round(report.avgLeftTime) : 'N/A',
    report.avgRightTime ? Math.round(report.avgRightTime) : 'N/A',
    state.leftAnchorActive ? 'TRUE' : 'FALSE',
    report.neglectRating,
    notes
  ];
  
  // Basic CSV escaping
  const esc = v => `"${String(v).replace(/"/g, '""')}"`;
  const csv = headers.map(esc).join(',') + '\n' + row.map(esc).join(',');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neglect-scanning-report_${ts.slice(0, 10)}_${ts.slice(11, 19).replace(/:/g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 0);
}

// Mount global hooks for the 3D module to interact with
window.PARK_APP = {
  triggerInspectItem,
  logCameraDirection
};
