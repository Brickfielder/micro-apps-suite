import {createServer} from 'node:http';
import {readFile, realpath, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, sep, extname} from 'node:path';
import {handleSession} from '../api/emergency-session.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
try {process.loadEnvFile(resolve(root, '.env.local'));} catch (e) {if (e.code !== 'ENOENT') throw e;}
process.env.LOCAL_DEVELOPMENT = 'true';
const types = {'.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.md': 'text/plain', '.png': 'image/png', '.ico': 'image/x-icon'};
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost:8080');
    if (!['localhost:8080', '127.0.0.1:8080'].includes(req.headers.host)) {res.writeHead(403).end(); return;}
    if (url.pathname === '/api/emergency-session') {
      const request = new Request(url, {method: req.method, headers: req.headers,
        ...(req.method === 'POST' ? {body: req, duplex: 'half'} : {})});
      const reply = await handleSession(request);
      res.writeHead(reply.status, Object.fromEntries(reply.headers));
      res.end(Buffer.from(await reply.arrayBuffer())); return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {res.writeHead(405).end(); return;}
    const decoded = decodeURIComponent(url.pathname);
    if (decoded.split('/').some(part => part.startsWith('.')) || /^\/(api|tests|scripts)(\/|$)/.test(decoded)) {res.writeHead(404).end(); return;}
    let path = resolve(root, '.' + decoded);
    if (!path.startsWith(root + sep) && path !== root) {res.writeHead(404).end(); return;}
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    path = await realpath(path);
    if (!path.startsWith(root + sep)) {res.writeHead(404).end(); return;}
    const bytes = await readFile(path);
    res.writeHead(200, {'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch {res.writeHead(404).end('Not found');}
}).listen(8080, '127.0.0.1', () => console.log('Practice app: http://localhost:8080/apps/emergency-call-simulator/'));
