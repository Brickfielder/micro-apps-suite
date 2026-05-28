#!/usr/bin/env node
const baseUrl = process.argv[2] || 'http://127.0.0.1:8000';
const cdpBase = process.argv[3] || 'http://127.0.0.1:9223';

const checks = [
  {
    route: 'inbox-simulator',
    path: '/apps/inbox-simulator/index.html',
    expression: `(() => {
      document.querySelector('#startBtn').click();
      return !document.querySelector('#viewWorkspace').classList.contains('hidden');
    })()`,
  },
  {
    route: 'metro-nav',
    path: '/apps/metro-nav/index.html',
    expression: `(() => {
      window.startGame();
      return document.querySelector('#modal-start').classList.contains('hidden');
    })()`,
  },
  {
    route: 'cafe-rush',
    path: '/apps/cafe-rush/index.html',
    expression: `(() => {
      document.querySelector('#start-btn').click();
      return document.querySelector('#modal-start').classList.contains('hidden') &&
        document.querySelector('#order-text').textContent.trim().length > 0;
    })()`,
  },
  {
    route: 'fresh-market',
    path: '/apps/fresh-market/index.html',
    expression: `(() => {
      window.startGame();
      window.addToCart(1);
      window.finishShop();
      return document.querySelector('#intro-screen').classList.contains('hidden') &&
        !document.querySelector('#report-screen').classList.contains('hidden');
    })()`,
  },
  {
    route: 'left-anchor-reader',
    path: '/apps/left-anchor-reader/index.html',
    expression: `(() => {
      document.querySelector('#startBtn').click();
      document.querySelector('#mode-firstwords').checked = true;
      document.querySelector('#modeControl').dispatchEvent(new Event('change', { bubbles: true }));
      document.querySelector('#nextBtn').click();
      return document.querySelector('#stage-task').classList.contains('active') &&
        document.querySelector('#pageStatus').textContent.includes('Page 2');
    })()`,
  },
  {
    route: 'emotion-chats',
    path: '/apps/emotion-chats/index.html',
    expression: `(async () => {
      document.querySelector('#play').click();
      await new Promise((resolve) => setTimeout(resolve, 150));
      document.querySelector('#skip').click();
      document.querySelector('#freeA').value = 'happy';
      document.querySelector('#freeB').value = 'concerned';
      document.querySelector('#freeA').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#freeB').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#proceed').click();
      document.querySelector('#pillsA .pill-btn')?.click();
      document.querySelector('#pillsB .pill-btn')?.click();
      document.querySelector('#submit').click();
      return !document.querySelector('#step3').hidden;
    })()`,
  },
  {
    route: 'memory-in-action',
    path: '/apps/memory-in-action/index.html',
    expression: `(() => {
      document.querySelector('#btnDemo').click();
      document.querySelector('#btnStart').click();
      return document.querySelector('#strategyCard').classList.contains('hidden') &&
        !document.querySelector('#scenarioCard').classList.contains('hidden');
    })()`,
  },
  {
    route: 'brightwave-mobile-banking',
    path: '/apps/brightwave-mobile-banking/index.html',
    expression: `(() => {
      document.querySelector('[data-tab="payments"]').click();
      document.querySelector('#transferAmount').value = '5';
      document.querySelector('#transferForm').requestSubmit();
      return document.querySelector('#tab-payments').classList.contains('active') &&
        document.querySelector('#sessionTimeline').innerText.trim().length > 0;
    })()`,
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createTarget() {
  const response = await fetch(`${cdpBase}/json/new?about:blank`, { method: 'PUT' });
  if (!response.ok) throw new Error(`Could not create CDP target: ${response.status}`);
  return response.json();
}

async function closeTarget(id) {
  await fetch(`${cdpBase}/json/close/${id}`).catch(() => {});
}

function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();
  const events = [];

  socket.addEventListener('message', (message) => {
    const payload = JSON.parse(message.data);
    if (payload.id && pending.has(payload.id)) {
      const { resolve, reject } = pending.get(payload.id);
      pending.delete(payload.id);
      if (payload.error) reject(new Error(payload.error.message));
      else resolve(payload.result || {});
    } else if (payload.method) {
      events.push(payload);
    }
  });

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  function send(method, params = {}) {
    const id = nextId++;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  }

  return { ready, send, events, close: () => socket.close() };
}

async function waitForLoad(client) {
  for (let i = 0; i < 80; i += 1) {
    if (client.events.some((event) => event.method === 'Page.loadEventFired')) return;
    await sleep(100);
  }
  throw new Error('Timed out waiting for page load');
}

async function runCheck(check) {
  const target = await createTarget();
  const client = connect(target.webSocketDebuggerUrl);
  await client.ready;
  await client.send('Runtime.enable');
  await client.send('Page.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Page.navigate', { url: `${baseUrl}${check.path}` });
  await waitForLoad(client);
  await sleep(250);
  const result = await client.send('Runtime.evaluate', {
    expression: check.expression,
    awaitPromise: true,
    returnByValue: true,
  });
  const errors = client.events
    .filter((event) => event.method === 'Runtime.exceptionThrown')
    .map((event) => event.params?.exceptionDetails?.text || event.method);
  client.close();
  await closeTarget(target.id);
  return {
    route: check.route,
    ok: Boolean(result.result?.value) && errors.length === 0,
    value: result.result?.value,
    errors,
  };
}

const results = [];
for (const check of checks) {
  results.push(await runCheck(check));
}
const failures = results.filter((result) => !result.ok);
console.log(JSON.stringify({ checked: results.length, failures, results }, null, 2));
if (failures.length) process.exit(1);
