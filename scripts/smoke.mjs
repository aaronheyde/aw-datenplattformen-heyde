#!/usr/bin/env node
/**
 * Rauchtest gegen einen laufenden Server: /healthz, Startseite, Bundle-Verweise.
 * Aufruf: npm run smoke  (Ziel ueber BASE_URL, Standard http://127.0.0.1:3001)
 */
const BASE = process.env.BASE_URL || `http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3001}`;

let failed = 0;

function check(name, ok, detail = '') {
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failed += 1;
}

async function main() {
  const h = await fetch(`${BASE}/healthz`);
  const hj = await h.json().catch(() => null);
  check('GET /healthz liefert 200', h.status === 200, `Status ${h.status}`);
  check('healthz status = ok', hj && hj.status === 'ok', JSON.stringify(hj));
  check('healthz nennt version', !!(hj && hj.version), hj && hj.version);
  check('healthz nennt stand', !!(hj && hj.stand), hj && hj.stand);

  const r = await fetch(BASE);
  const html = await r.text();
  check('GET / liefert 200', r.status === 200, `Status ${r.status}`);
  check('Startseite hat den Titel', html.includes('Vergleich von Datenplattformen'));
  check('Startseite bindet ein Modul-Bundle ein', /<script type="module"[^>]+src="([^"]+)"/.test(html));
  check('Startseite bindet ein Stylesheet ein', /<link[^>]+rel="stylesheet"[^>]+assets\//.test(html));

  const m = html.match(/<script type="module"[^>]+src="([^"]+)"/);
  if (m) {
    const b = await fetch(BASE + m[1]);
    const js = await b.text();
    check('Bundle ist abrufbar', b.status === 200, `${(js.length / 1024).toFixed(1)} kB`);
    check('Bundle nutzt keine Storage-API',
      !/localStorage|sessionStorage|indexedDB/.test(js));
  }

  const spa = await fetch(`${BASE}/irgendein/tiefer/pfad`);
  const spaHtml = await spa.text();
  check('SPA-Fallback liefert index.html', spa.status === 200 && spaHtml.includes('<div id="root">'));

  console.log(failed ? `\n${failed} Pruefung(en) fehlgeschlagen.` : '\nAlle Pruefungen bestanden.');
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error('Rauchtest abgebrochen:', e.message);
  process.exit(1);
});
