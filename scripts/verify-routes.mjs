#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = process.argv[2] || 'http://127.0.0.1:8000';
const cdpBase = process.argv[3] || 'http://127.0.0.1:9223';
const root = path.resolve(import.meta.dirname, '..');
const apps = JSON.parse(fs.readFileSync(path.join(root, 'apps', 'apps.json'), 'utf8'));
const routes = [{ slug: 'home', entryPath: './index.html' }, ...apps];
const viewports = [
  { name: 'desktop', width: 1366, height: 900, scale: 1, mobile: false },
  { name: 'mobile', width: 390, height: 844, scale: 2, mobile: true },
];

function routeUrl(entryPath) {
  const normalized = entryPath.replace(/^\.\//, '');
  return `${baseUrl}/${normalized}`;
}

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

  function close() {
    socket.close();
  }

  return { ready, send, close, events };
}

async function waitForLoad(client, timeoutMs = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (client.events.some((event) => event.method === 'Page.loadEventFired')) return;
    await sleep(100);
  }
  throw new Error('Timed out waiting for Page.loadEventFired');
}

async function checkRoute(route, viewport) {
  const target = await createTarget();
  const client = connect(target.webSocketDebuggerUrl);
  await client.ready;
  await client.send('Runtime.enable');
  await client.send('Page.enable');
  await client.send('Log.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.scale,
    mobile: viewport.mobile,
  });
  const url = routeUrl(route.entryPath);
  await client.send('Page.navigate', { url });
  await waitForLoad(client);
  await sleep(250);

  const title = await client.send('Runtime.evaluate', {
    expression: 'document.title',
    returnByValue: true,
  });
  const metrics = await client.send('Runtime.evaluate', {
    expression:
      '({scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, bodyText: document.body.innerText.slice(0, 500)})',
    returnByValue: true,
  });

  const errors = client.events
    .filter((event) => {
      if (event.method === 'Runtime.exceptionThrown') return true;
      if (event.method === 'Log.entryAdded') return ['error', 'warning'].includes(event.params?.entry?.level);
      return false;
    })
    .map((event) => event.params?.exceptionDetails?.text || event.params?.entry?.text || event.method);

  client.close();
  await closeTarget(target.id);

  return {
    route: route.slug,
    viewport: viewport.name,
    url,
    title: title.result?.value || '',
    hasBodyText: Boolean(metrics.result?.value?.bodyText?.trim()),
    horizontalOverflow: metrics.result?.value?.scrollWidth > metrics.result?.value?.innerWidth + 2,
    errors,
  };
}

const results = [];
for (const route of routes) {
  const httpResponse = await fetch(routeUrl(route.entryPath));
  if (!httpResponse.ok) {
    results.push({
      route: route.slug,
      viewport: 'http',
      url: routeUrl(route.entryPath),
      title: '',
      hasBodyText: false,
      horizontalOverflow: false,
      errors: [`HTTP ${httpResponse.status}`],
    });
    continue;
  }
  for (const viewport of viewports) {
    results.push(await checkRoute(route, viewport));
  }
}

const failures = results.filter((result) => result.errors.length || result.horizontalOverflow || !result.hasBodyText);
console.log(JSON.stringify({ checked: results.length, failures, results }, null, 2));
if (failures.length) process.exit(1);
