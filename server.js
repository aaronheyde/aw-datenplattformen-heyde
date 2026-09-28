/**
 * Minimaler Express-Server: liefert dist/ statisch aus, SPA-Fallback auf index.html,
 * plus GET /healthz. Kein Login, keine Datenbank, keine Sitzungen.
 *
 * Trust-Proxy ist bewusst NICHT gesetzt: der Dienst liefert nur statische Dateien aus
 * und wertet keine Client-IP, kein Protokoll und keinen Host aus. Wird der Server
 * spaeter um etwas erweitert, das die echte Client-IP braucht (Rate-Limit, Logging),
 * gehoert app.set('trust proxy', 1) dazu — nginx setzt X-Forwarded-For und
 * X-Forwarded-Proto bereits (siehe deploy/nginx-heyde-datenplattformen.conf).
 */
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const require = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, 'dist');
const INDEX = join(DIST, 'index.html');

const pkg = require('./package.json');

/* Stand-Datum aus dem generierten Inhalt lesen — eine Quelle, keine Kopie. */
function readStand() {
  const p = resolve(HERE, 'src/content/content.json');
  try {
    return JSON.parse(readFileSync(p, 'utf8')).meta.stand;
  } catch {
    return null;
  }
}

const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || '127.0.0.1';
const STAND = readStand();

const app = express();
app.disable('x-powered-by');

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', version: pkg.version, stand: STAND });
});

app.use(express.static(DIST, {
  index: 'index.html',
  maxAge: '1h',
  setHeaders(res, path) {
    // Gehashte Bundles duerfen lange im Cache bleiben, index.html nie.
    if (/\/assets\//.test(path)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    else if (path.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
  },
}));

/* SPA-Fallback: alles andere auf index.html */
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (!existsSync(INDEX)) {
    return res.status(503).type('text/plain').send(
      'dist/ fehlt. Zuerst «npm ci && npm run build» ausfuehren.\n',
    );
  }
  return res.sendFile(INDEX);
});

if (!existsSync(INDEX)) {
  console.warn(`Warnung: ${INDEX} nicht vorhanden — bitte «npm ci && npm run build» ausfuehren.`);
}

const server = app.listen(PORT, HOST, () => {
  console.log(`heyde-datenplattformen ${pkg.version} laeuft auf http://${HOST}:${PORT}`);
});

function shutdown(sig) {
  console.log(`${sig} empfangen — Server wird beendet.`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
