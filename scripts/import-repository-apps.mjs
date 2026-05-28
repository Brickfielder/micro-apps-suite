#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sourceRoot = path.resolve(root, '..', 'source-micro-apps-repository');

const imports = [
  {
    source: 'docs/apps/emotion-chat/index.html',
    target: 'apps/emotion-chats',
    title: 'Emotion Chats',
    stylesheet: '../../shared/theme.css',
    i18nFiles: ['docs/apps/emotion-chat/i18n/en.json'],
  },
  {
    source: 'docs/apps/memory-in-action/index.html',
    target: 'apps/memory-in-action',
    title: 'Memory in Action',
    stylesheet: '../../shared/theme.css',
    i18nFiles: [],
  },
  {
    source: 'docs/apps/mobile-banking-simulator/index.html',
    target: 'apps/brightwave-mobile-banking',
    title: 'Brightwave Mobile Banking Simulator',
    stylesheet: '../../shared/theme.css',
    i18nFiles: [
      'docs/apps/mobile-banking-simulator/i18n/en.json',
      'docs/domains/banking/i18n/en.json',
    ],
  },
];

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

function readJSON(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(sourceRoot, relativePath), 'utf8'));
}

function buildI18nShim(relativeFiles) {
  if (!relativeFiles.length) return '';
  const dictionary = relativeFiles.reduce((dict, file) => deepMerge(dict, readJSON(file)), {});
  return `const EN_STRINGS = ${JSON.stringify(dictionary, null, 2)};

function lookupI18n(path) {
  return String(path || '').split('.').reduce((value, key) => {
    if (value && Object.prototype.hasOwnProperty.call(value, key)) return value[key];
    return undefined;
  }, EN_STRINGS);
}

function interpolateI18n(template, vars = {}) {
  return String(template ?? '').replace(/\\{([\\w-]+)\\}/g, (_, key) => vars[key] ?? '');
}

function translateI18n(key, vars = {}) {
  const value = lookupI18n(key);
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return value;
  return interpolateI18n(value ?? key, vars);
}

function applyI18n(root = document) {
  const scope = root || document;
  const nodes = scope.matches?.('[data-i18n]') ? [scope] : [];
  nodes.push(...scope.querySelectorAll?.('[data-i18n]') ?? []);
  nodes.forEach((node) => {
    const key = node.getAttribute('data-i18n');
    const vars = {};
    for (const attr of Array.from(node.attributes)) {
      if (attr.name.startsWith('data-i18n-') && attr.name !== 'data-i18n' && attr.name !== 'data-i18n-attr') {
        vars[attr.name.slice('data-i18n-'.length)] = attr.value;
      }
    }
    const value = translateI18n(key, vars);
    const attrName = node.getAttribute('data-i18n-attr');
    if (attrName) {
      node.setAttribute(attrName, value);
    } else {
      node.textContent = value;
    }
  });
}

window.I18N = {
  lang: 'en',
  dict: EN_STRINGS,
  t: translateI18n,
  apply: applyI18n,
  ready: new Promise((resolve) => {
    const finish = () => {
      applyI18n(document);
      resolve();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', finish, { once: true });
    } else {
      finish();
    }
  }),
};
`;
}

function extractTag(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match?.[1]?.trim() ?? '';
}

function removeTags(html, tagName) {
  return html.replace(new RegExp(`<${tagName}[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'gi'), '');
}

function convertApp(config) {
  const sourcePath = path.join(sourceRoot, config.source);
  const targetPath = path.join(root, config.target);
  const html = fs.readFileSync(sourcePath, 'utf8');
  const styles = extractTag(html, 'style');
  const scripts = Array.from(html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi))
    .map((match) => match[1].trim())
    .filter(Boolean)
    .join('\n\n');

  const body = extractTag(html, 'body');
  const bodyWithoutScripts = removeTags(body, 'script').trim();
  const bodyContent = bodyWithoutScripts
    .replace(/<main id="app-root">([\s\S]*?)<\/main>\s*$/i, '$1')
    .replace(/<div id="app-root">([\s\S]*?)<\/div>\s*$/i, '$1')
    .trim();

  fs.mkdirSync(targetPath, { recursive: true });
  fs.rmSync(path.join(targetPath, 'i18n'), { recursive: true, force: true });
  fs.writeFileSync(path.join(targetPath, 'app.css'), `${styles}\n`, 'utf8');
  fs.writeFileSync(path.join(targetPath, 'app.js'), `${buildI18nShim(config.i18nFiles)}\n${scripts}\n`, 'utf8');
  fs.writeFileSync(
    path.join(targetPath, 'index.html'),
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${config.title} | Micro Apps Suite</title>
  <link rel="stylesheet" href="${config.stylesheet}" />
  <link rel="stylesheet" href="./app.css" />
  <script defer src="./app.js"></script>
</head>
<body>
  <main id="app-root" class="suite-app">
${bodyContent.split('\n').map((line) => `    ${line}`).join('\n')}
  </main>
</body>
</html>
`,
    'utf8',
  );
}

imports.forEach(convertApp);
