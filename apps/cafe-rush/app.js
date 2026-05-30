const RECIPES = [
  { id: "espresso", name: "Espresso", category: "Hot Classics", difficulty: 1, stars: 1, steps: ["hot-cup", "espresso"], volume: "30-60ml" },
  { id: "americano", name: "Americano", category: "Hot Classics", difficulty: 1, stars: 1, steps: ["hot-cup", "espresso", "water"], volume: "120-150ml" },
  { id: "latte", name: "Latte", category: "Hot Classics", difficulty: 2, stars: 2, steps: ["hot-cup", "espresso", "milk"], volume: "150-180ml" },
  { id: "oat-latte", name: "Oat Latte", category: "Milk Bar", difficulty: 2, stars: 2, steps: ["hot-cup", "espresso", "oat"], volume: "150-200ml" },
  { id: "mocha", name: "Mocha", category: "Syrups", difficulty: 4, stars: 2, steps: ["hot-cup", "espresso", "milk", "cocoa"], volume: "150-180ml" },
  { id: "vanilla-latte", name: "Vanilla Latte", category: "Syrups", difficulty: 4, stars: 3, steps: ["hot-cup", "espresso", "milk", "vanilla"], volume: "150-200ml" },
  { id: "iced-latte", name: "Iced Latte", category: "Iced Bar", difficulty: 3, stars: 2, steps: ["iced-cup", "ice", "espresso", "milk"], volume: "180-220ml" },
  { id: "iced-americano", name: "Iced Americano", category: "Iced Bar", difficulty: 3, stars: 2, steps: ["iced-cup", "ice", "espresso", "water"], volume: "180-220ml" },
  { id: "iced-oat-latte", name: "Iced Oat Latte", category: "Iced Bar", difficulty: 3, stars: 3, steps: ["iced-cup", "ice", "espresso", "oat"], volume: "180-220ml" },
  { id: "iced-vanilla", name: "Iced Vanilla Latte", category: "Iced Bar", difficulty: 4, stars: 3, steps: ["iced-cup", "ice", "espresso", "milk", "vanilla"], volume: "180-240ml" },
  { id: "iced-mocha", name: "Iced Mocha", category: "Iced Bar", difficulty: 5, stars: 3, steps: ["iced-cup", "ice", "espresso", "milk", "cocoa"], volume: "180-240ml" },
];

const INGREDIENTS = {
  "hot-cup": { label: "Hot Cup", short: "Cup", icon: "☕", layerClass: "ing-cup" },
  "iced-cup": { label: "Iced Cup", short: "Iced", icon: "🥤", layerClass: "ing-iced-cup" },
  espresso: { label: "Espresso", short: "Esp", icon: "🟤", layerClass: "ing-esp" },
  ice: { label: "Ice", short: "Ice", icon: "🧊", layerClass: "ing-ice" },
  milk: { label: "Milk", short: "Milk", icon: "🥛", layerClass: "ing-milk" },
  oat: { label: "Oat", short: "Oat", icon: "🌾", layerClass: "ing-oat" },
  water: { label: "Water", short: "Water", icon: "💧", layerClass: "ing-water" },
  vanilla: { label: "Vanilla", short: "Van", icon: "✳", layerClass: "ing-van" },
  cocoa: { label: "Chocolate", short: "Choc", icon: "▰", layerClass: "ing-choc" },
};

const SHIFT_DURATION = 60;
const SHIFT_GOAL = 8;
const QUEUE_SIZE = 3;
const STARTING_ORDER = 100;
const LEVEL_UP_BONUS = 150;

const SCORE_RULES = {
  base: 90,
  difficulty: 35,
  step: 12,
  streak: 25,
  maxStreak: 5,
  accuracyFloor: 0.5,
  accuracyRange: 0.75,
  speedFloor: 0.55,
  speedRange: 0.7,
  penalties: {
    noCup: 25,
    sequence: 50,
    serve: 75,
    expired: 60,
  },
};

const BADGE_DEFS = [
  { id: "steady", title: "Steady Hands", subtitle: "Good pacing", icon: "✋", earned: (s) => s.correctAttempts >= 4 },
  { id: "perfect", title: "Perfect Order", subtitle: "4 in a row", icon: "◆", earned: (s) => s.bestStreak >= 4 },
  { id: "waste", title: "No Waste", subtitle: "Zero errors", icon: "☕", earned: (s) => s.correctAttempts > 0 && s.mistakes === 0 && s.waste === 0 },
  { id: "focus", title: "Focused Shift", subtitle: "90% accuracy", icon: "◎", earned: (s) => getAccuracy(s) >= 90 && s.correctAttempts >= 4 },
  { id: "rush", title: "Clean Rush", subtitle: "Fast and accurate", icon: "⚡", earned: (s) => s.correctAttempts >= 4 && getAccuracy(s) >= 85 && getAverageServeSeconds(s) <= 8 },
];

const COACH_MESSAGES = [
  "Take a breath. Check the order number and build one step at a time.",
  "Accuracy first. A clean sequence protects your streak.",
  "Cup first, then follow the recipe from left to right.",
  "If the queue feels busy, focus only on the active ticket.",
];

const state = {
  shift: 1,
  level: 1,
  score: 0,
  streak: 0,
  bestStreak: 0,
  timeLeft: SHIFT_DURATION,
  served: 0,
  goal: SHIFT_GOAL,
  totalAttempts: 0,
  correctAttempts: 0,
  mistakes: 0,
  waste: 0,
  orderNumber: STARTING_ORDER,
  queue: [],
  currentOrder: null,
  build: [],
  gameActive: false,
  paused: false,
  timerId: null,
  startTime: 0,
  totalServeSeconds: 0,
  recipeStepsVisible: false,
  lastFeedback: null,
};

const ui = {};

window.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  wireControls();
  renderRecipeList();
  resetShift();
  renderAll();
});

function cacheElements() {
  ui.shift = document.querySelector("#shift-num");
  ui.level = document.querySelector("#level");
  ui.score = document.querySelector("#score");
  ui.timer = document.querySelector("#timer");
  ui.accuracy = document.querySelector("#accuracy");
  ui.streak = document.querySelector("#streak");
  ui.recipeList = document.querySelector("#recipe-list");
  ui.recipeToggle = document.querySelector("#recipe-toggle");
  ui.queue = document.querySelector("#order-queue");
  ui.queueCount = document.querySelector("#queue-count");
  ui.orderText = document.querySelector("#order-text");
  ui.orderNum = document.querySelector("#order-num");
  ui.contents = document.querySelector("#cup-contents");
  ui.cup = document.querySelector("#cup-visual");
  ui.gameArea = document.querySelector("#game-bg");
  ui.sequenceHint = document.querySelector("#sequence-hint");
  ui.coachMessage = document.querySelector("#coach-message");
  ui.goalCount = document.querySelector("#goal-count");
  ui.goalProgress = document.querySelector("#goal-progress");
  ui.goalPercent = document.querySelector("#goal-percent");
  ui.goalFill = document.querySelector("#goal-fill");
  ui.feedbackCard = document.querySelector("#feedback-card");
  ui.feedbackMark = document.querySelector("#feedback-mark");
  ui.feedbackTitle = document.querySelector("#feedback-title");
  ui.feedbackDetail = document.querySelector("#feedback-detail");
  ui.feedbackPoints = document.querySelector("#feedback-points");
  ui.comboMeter = document.querySelector("#combo-meter");
  ui.comboLabel = document.querySelector("#combo-label");
  ui.badgePreview = document.querySelector("#badge-preview");
  ui.startOverlay = document.querySelector("#modal-start");
  ui.endOverlay = document.querySelector("#modal-end");
  ui.finalScore = document.querySelector("#final-score");
  ui.statServed = document.querySelector("#stat-served");
  ui.statSpeed = document.querySelector("#stat-speed");
  ui.statAcc = document.querySelector("#stat-acc");
  ui.statStreak = document.querySelector("#stat-streak");
  ui.statMistakes = document.querySelector("#stat-mistakes");
  ui.statLevel = document.querySelector("#stat-level");
  ui.finalBadges = document.querySelector("#final-badges");
  ui.pauseBtn = document.querySelector("#pause-btn");
  ui.resetBtn = document.querySelector("#reset-btn");
}

function wireControls() {
  document.querySelectorAll("[data-ingredient]").forEach((btn) => {
    btn.addEventListener("click", () => addIngredient(btn.dataset.ingredient));
  });

  document.querySelector("#serve-btn").addEventListener("click", serveOrder);
  document.querySelector("#start-btn").addEventListener("click", startShift);
  document.querySelector("#restart-btn").addEventListener("click", startShift);
  document.querySelector("#download-btn").addEventListener("click", downloadReport);
  ui.recipeToggle.addEventListener("click", toggleRecipeSteps);
  ui.pauseBtn.addEventListener("click", handlePrimaryControl);
  ui.resetBtn.addEventListener("click", resetToReady);
}

function resetShift() {
  clearInterval(state.timerId);
  state.level = 1;
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.timeLeft = SHIFT_DURATION;
  state.served = 0;
  state.totalAttempts = 0;
  state.correctAttempts = 0;
  state.mistakes = 0;
  state.waste = 0;
  state.orderNumber = STARTING_ORDER;
  state.queue = [];
  state.currentOrder = null;
  state.build = [];
  state.gameActive = false;
  state.paused = false;
  state.startTime = 0;
  state.totalServeSeconds = 0;
  state.lastFeedback = null;
  resetCup();
  setFeedback("Ready for the first ticket", "Start the shift, then follow each recipe in sequence.", 0, "neutral");
}

function startShift() {
  resetShift();
  state.gameActive = true;
  state.startTime = Date.now();
  ui.startOverlay.classList.add("hidden");
  ui.endOverlay.classList.add("hidden");
  fillQueue();
  activateNextOrder();
  startTimer();
  renderAll();
}

function resetToReady() {
  resetShift();
  ui.startOverlay.classList.remove("hidden");
  ui.endOverlay.classList.add("hidden");
  renderAll();
}

function startTimer() {
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    if (!state.gameActive || state.paused) return;
    state.timeLeft -= 1;
    if (state.currentOrder) {
      const decay = 4 + state.currentOrder.recipe.difficulty;
      state.currentOrder.patience = Math.max(0, state.currentOrder.patience - decay);
      if (state.currentOrder.patience <= 0) {
        expireOrder();
      }
    }
    if (state.timeLeft <= 0 || state.served >= state.goal) {
      endGame();
      return;
    }
    renderAll();
  }, 1000);
}

function fillQueue() {
  while (state.queue.length < QUEUE_SIZE) {
    state.queue.push(createOrder());
  }
}

function createOrder() {
  const pool = recipesForLevel(state.level);
  const recipe = pool[Math.floor(Math.random() * pool.length)];
  const patience = Math.max(46, 96 - recipe.difficulty * 8);
  state.orderNumber += 1;
  return {
    id: state.orderNumber,
    recipe,
    patience,
    maxPatience: patience,
    startedAt: 0,
    hidden: state.level >= 3 && recipe.difficulty >= 3,
  };
}

function activateNextOrder(options = {}) {
  fillQueue();
  state.currentOrder = state.queue.shift();
  state.currentOrder.startedAt = Date.now();
  fillQueue();
  state.build = [];
  resetCup();
  if (!options.keepFeedback) {
    setFeedback("Ticket ready", "Build the active order in the exact sequence shown by the recipe reference.", 0, "neutral");
  }
}

function recipesForLevel(level) {
  return RECIPES.filter((recipe) => recipe.difficulty <= level);
}

function updateLevel() {
  const nextLevel = Math.min(5, 1 + Math.floor(state.served / 2));
  if (nextLevel > state.level) {
    state.level = nextLevel;
    return LEVEL_UP_BONUS;
  }
  return 0;
}

function addIngredient(ingredientId) {
  if (!state.gameActive || state.paused || !state.currentOrder || !INGREDIENTS[ingredientId]) return;

  const isCup = ingredientId === "hot-cup" || ingredientId === "iced-cup";
  if (isCup) {
    state.build = [ingredientId];
    resetCup();
    applyCupVisual(ingredientId);
    renderLayer(ingredientId);
  } else {
    if (!state.build.length) {
      state.totalAttempts += 1;
      state.mistakes += 1;
      state.streak = 0;
      state.waste += 1;
      const penalty = applyScoreDelta(-SCORE_RULES.penalties.noCup);
      setFeedback("Choose a cup first", "Every drink starts with the correct cup.", penalty, "error");
      renderAll();
      return;
    }
    state.build.push(ingredientId);
    renderLayer(ingredientId);
  }

  if (!isBuildPrefixValid()) {
    state.totalAttempts += 1;
    state.mistakes += 1;
    state.waste += 1;
    state.streak = 0;
    state.build = [];
    resetCup();
    const penalty = applyScoreDelta(-SCORE_RULES.penalties.sequence);
    setFeedback("Sequence reset", "That ingredient does not match the active recipe order.", penalty, "error");
  } else {
    const next = nextExpectedIngredient();
    const detail = next ? `Next: ${INGREDIENTS[next].label}.` : "Ready to serve.";
    setFeedback("Sequence on track", detail, 0, "neutral");
  }

  renderAll();
}

function isBuildPrefixValid() {
  const steps = state.currentOrder.recipe.steps;
  return state.build.every((ingredient, index) => ingredient === steps[index]);
}

function nextExpectedIngredient() {
  return state.currentOrder.recipe.steps[state.build.length] || null;
}

function serveOrder() {
  if (!state.gameActive || state.paused || !state.currentOrder) return;

  state.totalAttempts += 1;
  const steps = state.currentOrder.recipe.steps;
  const correct = steps.length === state.build.length && steps.every((step, index) => state.build[index] === step);

  if (correct) {
    const scoring = calculateOrderScore(state.currentOrder, state.correctAttempts + 1);
    state.score += scoring.points;
    state.totalServeSeconds += getOrderSeconds(state.currentOrder);
    state.correctAttempts += 1;
    state.served += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const levelBonus = updateLevel();
    if (levelBonus) {
      state.score += levelBonus;
    }
    const totalPoints = scoring.points + levelBonus;
    const levelText = levelBonus ? ` Level ${state.level} unlocked.` : "";
    setFeedback(
      "Correct sequence",
      `${state.currentOrder.recipe.name}: ${scoring.accuracyPct}% accuracy x ${scoring.speedPct}% speed.${levelText}`,
      totalPoints,
      "success",
    );
    if (state.served >= state.goal) {
      renderAll();
      endGame();
      return;
    }
    activateNextOrder({ keepFeedback: true });
  } else {
    state.mistakes += 1;
    state.waste += 1;
    state.streak = 0;
    state.build = [];
    resetCup();
    const penalty = applyScoreDelta(-SCORE_RULES.penalties.serve);
    setFeedback("Check the ticket", "The served drink did not match the active order.", penalty, "error");
  }

  renderAll();
}

function expireOrder() {
  if (!state.currentOrder) return;
  state.totalAttempts += 1;
  state.mistakes += 1;
  state.streak = 0;
  const penalty = applyScoreDelta(-SCORE_RULES.penalties.expired);
  setFeedback("Customer patience expired", `${state.currentOrder.recipe.name} moved out of the queue.`, penalty, "warning");
  activateNextOrder({ keepFeedback: true });
}

function calculateOrderScore(order, projectedCorrectAttempts) {
  const recipeValue = SCORE_RULES.base + (order.recipe.difficulty * SCORE_RULES.difficulty) + (order.recipe.steps.length * SCORE_RULES.step);
  const accuracyRatio = state.totalAttempts > 0 ? projectedCorrectAttempts / state.totalAttempts : 1;
  const speedRatio = order.maxPatience > 0 ? order.patience / order.maxPatience : 0;
  const accuracyMultiplier = SCORE_RULES.accuracyFloor + clamp(accuracyRatio, 0, 1) * SCORE_RULES.accuracyRange;
  const speedMultiplier = SCORE_RULES.speedFloor + clamp(speedRatio, 0, 1) * SCORE_RULES.speedRange;
  const streakBonus = Math.min(SCORE_RULES.maxStreak, state.streak + 1) * SCORE_RULES.streak;
  const points = Math.round(recipeValue * accuracyMultiplier * speedMultiplier + streakBonus);

  return {
    points,
    accuracyPct: Math.round(clamp(accuracyRatio, 0, 1) * 100),
    speedPct: Math.round(clamp(speedRatio, 0, 1) * 100),
    streakBonus,
  };
}

function applyScoreDelta(delta) {
  const previousScore = state.score;
  state.score = Math.max(0, state.score + delta);
  return state.score - previousScore;
}

function setFeedback(title, detail, points, tone) {
  state.lastFeedback = { title, detail, points, tone };
}

function toggleRecipeSteps() {
  state.recipeStepsVisible = !state.recipeStepsVisible;
  ui.recipeToggle.setAttribute("aria-pressed", String(state.recipeStepsVisible));
  ui.recipeToggle.querySelector("span:nth-child(2)").textContent = state.recipeStepsVisible ? "Hide recipe steps" : "Show recipe steps";
  renderRecipeList();
  renderAll();
}

function togglePause() {
  if (!state.gameActive) return;
  state.paused = !state.paused;
  setFeedback(state.paused ? "Shift paused" : "Shift resumed", state.paused ? "Take a breath, then continue when ready." : "Return to the active ticket.", 0, "neutral");
  renderAll();
}

function handlePrimaryControl() {
  if (!state.gameActive) {
    startShift();
    return;
  }
  togglePause();
}

function resetCup() {
  ui.cup.className = "cup";
  ui.contents.innerHTML = "";
}

function applyCupVisual(type) {
  ui.cup.className = "cup";
  ui.cup.classList.add(type === "iced-cup" ? "iced" : "hot");
}

function renderLayer(ingredientId) {
  const cfg = INGREDIENTS[ingredientId];
  const layer = document.createElement("div");
  layer.className = `layer ${cfg.layerClass}`.trim();
  layer.textContent = cfg.short;
  ui.contents.appendChild(layer);
}

function renderAll() {
  renderHud();
  renderControls();
  renderQueue();
  renderGoal();
  renderFeedback();
  renderBadges();
  renderRecipeList();
  renderCoach();
}

function renderHud() {
  ui.shift.textContent = state.shift;
  ui.level.textContent = state.level;
  ui.score.textContent = state.score;
  ui.timer.textContent = formatTime(state.timeLeft);
  ui.timer.classList.toggle("danger", state.timeLeft <= 10);
  ui.accuracy.textContent = `${getAccuracy(state)}%`;
  ui.streak.textContent = `x${state.streak}`;
}

function renderControls() {
  if (!state.gameActive) {
    ui.pauseBtn.textContent = "▶";
    ui.pauseBtn.setAttribute("aria-label", "Start shift");
  } else if (state.paused) {
    ui.pauseBtn.textContent = "▶";
    ui.pauseBtn.setAttribute("aria-label", "Resume shift");
  } else {
    ui.pauseBtn.textContent = "Ⅱ";
    ui.pauseBtn.setAttribute("aria-label", "Pause shift");
  }
  ui.resetBtn.setAttribute("aria-label", state.gameActive ? "Reset shift" : "Reset ready shift");
}

function renderQueue() {
  const orders = [state.currentOrder, ...state.queue].filter(Boolean);
  ui.queueCount.textContent = orders.length;
  ui.queue.innerHTML = "";
  orders.forEach((order, index) => {
    const card = document.createElement("article");
    card.className = `order-card ${index === 0 ? "active" : ""}`;
    const hidden = order.hidden && !state.recipeStepsVisible;
    card.innerHTML = `
      <div class="order-rank">${index + 1}</div>
      <div class="order-main">
        <div class="order-title">
          <strong>${order.recipe.name}</strong>
          <span>${"★".repeat(order.recipe.stars)}</span>
        </div>
        <p>${hidden ? "Hidden recipe" : formatSteps(order.recipe.steps)}</p>
        <div class="patience-row">
          <span>Patience</span>
          <strong>${Math.round(order.patience)}%</strong>
        </div>
        <div class="patience-track"><span style="width:${order.patience}%"></span></div>
      </div>
    `;
    ui.queue.appendChild(card);
  });

  if (state.currentOrder) {
    ui.orderText.textContent = state.currentOrder.recipe.name;
    ui.orderNum.textContent = state.currentOrder.id;
    ui.sequenceHint.textContent = state.currentOrder.hidden && !state.recipeStepsVisible
      ? "Hidden recipe: use the menu or reveal steps if needed"
      : `Build: ${formatSteps(state.currentOrder.recipe.steps)}`;
  } else {
    ui.orderText.textContent = "Waiting...";
    ui.orderNum.textContent = STARTING_ORDER;
    ui.sequenceHint.textContent = "Build the drink in the correct order";
  }
}

function renderGoal() {
  const percent = Math.min(100, Math.round((state.served / state.goal) * 100));
  ui.goalCount.textContent = state.goal;
  ui.goalProgress.textContent = `${state.served} / ${state.goal}`;
  ui.goalPercent.textContent = `${percent}%`;
  ui.goalFill.style.width = `${percent}%`;
}

function renderFeedback() {
  const feedback = state.lastFeedback || { title: "Ready", detail: "Start the shift.", points: 0, tone: "neutral" };
  ui.feedbackCard.className = `feedback-card ${feedback.tone}`;
  ui.feedbackMark.textContent = feedback.tone === "error" ? "×" : feedback.tone === "warning" ? "!" : feedback.tone === "success" ? "✓" : "•";
  ui.feedbackTitle.textContent = feedback.title;
  ui.feedbackDetail.textContent = feedback.detail;
  ui.feedbackPoints.textContent = feedback.points > 0 ? `+${feedback.points}` : `${feedback.points}`;
  ui.comboLabel.textContent = `x${state.streak}`;
  ui.comboMeter.innerHTML = "";
  for (let i = 0; i < 5; i += 1) {
    const segment = document.createElement("span");
    segment.className = i < Math.min(5, state.streak) ? "filled" : "";
    ui.comboMeter.appendChild(segment);
  }
}

function renderBadges() {
  ui.badgePreview.innerHTML = "";
  BADGE_DEFS.slice(0, 3).forEach((badge) => {
    ui.badgePreview.appendChild(renderBadge(badge, badge.earned(state)));
  });
}

function renderCoach() {
  if (!state.gameActive) {
    ui.coachMessage.textContent = COACH_MESSAGES[0];
    return;
  }
  if (state.lastFeedback?.tone === "error") {
    ui.coachMessage.textContent = "Pause and reset the build. The next tap should match the first missing step.";
    return;
  }
  if (state.timeLeft <= 10) {
    ui.coachMessage.textContent = "Final seconds. Serve only when the sequence is complete.";
    return;
  }
  ui.coachMessage.textContent = COACH_MESSAGES[state.level % COACH_MESSAGES.length];
}

function renderRecipeList() {
  const visible = RECIPES.filter((recipe) => recipe.difficulty <= Math.max(3, state.level));
  ui.recipeList.innerHTML = "";
  visible.forEach((recipe) => {
    const item = document.createElement("article");
    const active = state.currentOrder?.recipe.id === recipe.id;
    item.className = `recipe-card ${active ? "active" : ""}`;
    item.innerHTML = `
      <div class="drink-art ${recipe.steps[0] === "iced-cup" ? "iced" : "hot"}" aria-hidden="true">
        <span>${recipe.steps[0] === "iced-cup" ? "🥤" : "☕"}</span>
      </div>
      <div>
        <strong>${recipe.name}</strong>
        <div class="step-icons">${recipe.steps.map((step) => `<span title="${INGREDIENTS[step].label}">${INGREDIENTS[step].icon}</span>`).join("")}</div>
        <small>${state.recipeStepsVisible ? formatSteps(recipe.steps) : recipe.volume}</small>
      </div>
    `;
    ui.recipeList.appendChild(item);
  });
}

function renderBadge(badge, earned) {
  const item = document.createElement("div");
  item.className = `badge ${earned ? "earned" : ""}`;
  item.innerHTML = `
    <span aria-hidden="true">${badge.icon}</span>
    <strong>${badge.title}</strong>
    <small>${earned ? "Earned" : badge.subtitle}</small>
  `;
  return item;
}

function endGame() {
  if (!state.gameActive) return;
  state.gameActive = false;
  clearInterval(state.timerId);
  renderAll();
  renderResults();
  ui.endOverlay.classList.remove("hidden");
}

function renderResults() {
  const avgSpeed = getAverageServeSeconds(state);
  ui.finalScore.textContent = state.score;
  ui.statServed.textContent = state.served;
  ui.statSpeed.textContent = `${avgSpeed}s`;
  ui.statAcc.textContent = `${getAccuracy(state)}%`;
  ui.statStreak.textContent = `x${state.bestStreak}`;
  ui.statMistakes.textContent = state.mistakes;
  ui.statLevel.textContent = state.level;
  ui.finalBadges.innerHTML = "";
  BADGE_DEFS.forEach((badge) => {
    ui.finalBadges.appendChild(renderBadge(badge, badge.earned(state)));
  });
}

function downloadReport() {
  const avgSpeed = getAverageServeSeconds(state);
  const earnedBadges = BADGE_DEFS.filter((badge) => badge.earned(state)).map((badge) => badge.title).join(", ") || "None";
  const content = [
    "CAFE RUSH: BAR MODE",
    "-------------------",
    `Date: ${new Date().toLocaleDateString()}`,
    `Level reached: ${state.level}`,
    `Orders served: ${state.served}`,
    `Score: ${state.score}`,
    `Accuracy: ${getAccuracy(state)}%`,
    `Best streak: x${state.bestStreak}`,
    `Average time/order: ${avgSpeed}s`,
    `Mistakes: ${state.mistakes}`,
    `Waste/errors: ${state.waste}`,
    `Badges: ${earnedBadges}`,
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "cafe-rush-bar-mode-report.txt";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getAccuracy(source = state) {
  return source.totalAttempts > 0 ? Math.round((source.correctAttempts / source.totalAttempts) * 100) : 100;
}

function getAverageServeSeconds(source = state) {
  return source.correctAttempts > 0 ? Math.round(source.totalServeSeconds / source.correctAttempts) : 0;
}

function getOrderSeconds(order) {
  return order.startedAt ? Math.max(1, Math.round((Date.now() - order.startedAt) / 1000)) : 0;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatTime(seconds) {
  return `00:${String(Math.max(0, seconds)).padStart(2, "0")}`;
}

function formatSteps(steps) {
  return steps.map((step) => INGREDIENTS[step].label).join(" → ");
}
