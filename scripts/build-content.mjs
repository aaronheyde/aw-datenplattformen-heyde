#!/usr/bin/env node
/**
 * Erzeugt aus content/vergleich-datenplattformen.md das strukturierte JSON unter
 * src/content/content.json. Portiert aus work/parse.py und work/build.py — die
 * Markdown-Datei bleibt damit die einzige Inhaltsquelle.
 *
 * Aufruf: npm run content (laeuft automatisch vor dev und build)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const SRC = resolve(ROOT, 'content/vergleich-datenplattformen.md');
const OUT = resolve(ROOT, 'src/content/content.json');

const STAND = 'Stand: 20. August 2026';
const LINES = readFileSync(SRC, 'utf8').split('\n');

/* ------------------------------------------------------------ heading helpers */
const hlevel = (line) => line.length - line.replace(/^#+/, '').length;

function headingIndex(prefix) {
  const hits = [];
  LINES.forEach((l, i) => {
    if (l.startsWith('#') && l.replace(/^#+/, '').trim().startsWith(prefix)) hits.push(i);
  });
  if (!hits.length) throw new Error(`Ueberschrift nicht gefunden: ${prefix}`);
  if (hits.length > 1) throw new Error(`Ueberschrift mehrdeutig: ${prefix} -> ${hits}`);
  return hits[0];
}

function headingTitle(prefix) {
  return LINES[headingIndex(prefix)].replace(/^#+/, '').trim();
}

function sectionLines(prefix) {
  const i = headingIndex(prefix);
  const lvl = hlevel(LINES[i]);
  let j = i + 1;
  while (j < LINES.length) {
    if (LINES[j].startsWith('#') && hlevel(LINES[j]) <= lvl) break;
    j += 1;
  }
  return LINES.slice(i + 1, j);
}

function subsections(ls, level = 4) {
  const marker = '#'.repeat(level) + ' ';
  const out = [];
  let title = null;
  let buf = [];
  for (const l of ls) {
    if (l.startsWith(marker)) {
      if (title !== null || buf.length) out.push([title, buf]);
      title = l.slice(marker.length).trim();
      buf = [];
    } else buf.push(l);
  }
  if (title !== null || buf.length) out.push([title, buf]);
  return out.filter(([t]) => t !== null);
}

/* ------------------------------------------------------------ block parsing */
const isRow = (s) => s.startsWith('|') && s.endsWith('|');
const cells = (s) => s.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
const isSep = (cs) => cs.every((c) => c.length > 0 && /^[-: ]+$/.test(c));

function blocks(ls) {
  const out = [];
  let i = 0;
  const n = ls.length;
  while (i < n) {
    const s = ls[i].trim();
    if (!s || /^-+$/.test(s)) { i += 1; continue; }
    if (s.startsWith('```')) {
      let j = i + 1;
      const buf = [];
      while (j < n && !ls[j].trim().startsWith('```')) { buf.push(ls[j]); j += 1; }
      out.push({ kind: 'pre', text: buf.join('\n') });
      i = j + 1;
      continue;
    }
    if (isRow(s)) {
      const rows = [];
      while (i < n && isRow(ls[i].trim())) {
        const c = cells(ls[i].trim());
        if (!isSep(c)) rows.push(c);
        i += 1;
      }
      out.push({ kind: 'table', rows });
      continue;
    }
    let m = s.match(/^[-*]\s+(.*)$/);
    if (m) {
      const items = [];
      while (i < n) {
        const mm = ls[i].trim().match(/^[-*]\s+(.*)$/);
        if (!mm) {
          if (ls[i].trim() === '') break;
          if (ls[i].startsWith('  ') && items.length) {
            items[items.length - 1] += ' ' + ls[i].trim();
            i += 1;
            continue;
          }
          break;
        }
        items.push(mm[1]);
        i += 1;
      }
      out.push({ kind: 'ul', items });
      continue;
    }
    m = s.match(/^\d+\.\s+(.*)$/);
    if (m) {
      const items = [];
      while (i < n) {
        const mm = ls[i].trim().match(/^\d+\.\s+(.*)$/);
        if (!mm) {
          if (ls[i].trim() === '') break;
          if (ls[i].startsWith('   ') && items.length) {
            items[items.length - 1] += ' ' + ls[i].trim();
            i += 1;
            continue;
          }
          break;
        }
        items.push(mm[1]);
        i += 1;
      }
      out.push({ kind: 'ol', items });
      continue;
    }
    const buf = [s];
    i += 1;
    while (
      i < n && ls[i].trim() && !isRow(ls[i].trim()) &&
      !/^([-*]|\d+\.)\s/.test(ls[i].trim()) && !ls[i].trim().startsWith('```')
    ) {
      buf.push(ls[i].trim());
      i += 1;
    }
    out.push({ kind: 'p', text: buf.join(' ') });
  }
  return out;
}

const tables = (ls) => blocks(ls).filter((b) => b.kind === 'table').map((b) => b.rows);
const table = (prefix, idx = 0) => tables(sectionLines(prefix))[idx];
const sectionBlocks = (prefix) => blocks(sectionLines(prefix));

function stripMd(s) {
  return s.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '$1').trim();
}

/* ------------------------------------------------------------ 0.2 Skala */
const levelMeaning = {};
for (const r of table('0.2 Bewertungsskala').slice(1)) {
  levelMeaning[stripMd(r[0])] = stripMd(r[1]);
}

/* ------------------------------------------------------------ Kriterien */
const critRows = table('2. Die fünf Prüfkriterien');
const subdims = {};
for (const r of critRows.slice(1)) {
  subdims[stripMd(r[0])] = stripMd(r[1]).split('·').map((x) => x.trim());
}

const b31 = sectionBlocks('3.1 Abrechnungsmodelle');
const b73 = sectionBlocks('7.3 Betriebsseitige Reife');

const criteria = {
  note: sectionBlocks('2. Die fünf Prüfkriterien').filter((b) => b.kind === 'p'),
  subdims,
  panels: {
    cost: {
      subkey: '1. Cost / TCO',
      t31: b31.find((b) => b.kind === 'table').rows,
      p31: b31.filter((b) => b.kind === 'p'),
      t33: table('3.3 Typische Kostenfallen'),
      t34: table('3.4 Einordnung'),
    },
    ai: {
      subkey: '2. AI Readiness',
      b41: sectionBlocks('4.1 Was «AI Readiness» hier bedeutet'),
      t42: table('4.2 GenAI-Funktionen'),
      t43: table('4.3 Einordnung AI Readiness'),
      b44: sectionBlocks('4.4 Der zentrale Befund'),
    },
    svc: {
      subkey: '3. Analyseservices',
      t51: table('5.1 Funktionsabdeckung'),
      t52: table('5.2 Einordnung Analyseservices'),
      b53: sectionBlocks('5.3 Strategische Bewegungen'),
    },
    mp: {
      subkey: '4. Multi-Plattform',
      t61: table('6.1 Vergleich'),
      t62: table('6.2 Einordnung Multi-Plattform'),
      b63: sectionBlocks('6.3 Wo Lock-in 2026'),
    },
    ent: {
      subkey: '5. Enterprise-Readiness',
      t71: table('7.1 Zertifizierungen'),
      t72: table('7.2 Schweizer Datenresidenz'),
      t73: b73.find((b) => b.kind === 'table').rows,
      p73: b73.filter((b) => b.kind === 'p'),
      t74: table('7.4 Bekannte Lücken'),
    },
  },
};

/* ------------------------------------------------------------ Steckbriefe */
const PROFILE_KIND = {
  Snowflake: ['Datenplattform', 'plattform'],
  Databricks: ['Datenplattform', 'plattform'],
  'Microsoft Fabric': ['Datenplattform', 'plattform'],
  'Amazon Web Services': ['Cloud-Substrat', 'substrat'],
  'Microsoft Azure (Hyperscaler-Ebene)': ['Cloud-Substrat', 'substrat'],
  'Google Cloud': ['Cloud-Substrat', 'substrat'],
};

const profiles = [
  ['8.1', 'Snowflake'], ['8.2', 'Databricks'], ['8.3', 'Microsoft Fabric'],
  ['8.4', 'Amazon Web Services'], ['8.5', 'Microsoft Azure (Hyperscaler-Ebene)'],
  ['8.6', 'Google Cloud'],
].map(([num, name]) => {
  const bl = sectionBlocks(`${num} ${name}`);
  let char = '';
  const rows = [];
  for (const b of bl) {
    if (b.kind === 'p' && stripMd(b.text).startsWith('Charakter:')) {
      char = stripMd(b.text).slice('Charakter:'.length).trim();
    } else if (b.kind === 'ul') {
      for (const item of b.items) {
        const m = item.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
        if (m) rows.push([m[1], m[2]]);
        else rows.push(['', item]);
      }
    }
  }
  const [kindLabel, kindSlug] = PROFILE_KIND[name];
  return { name, kindLabel, kindSlug, char, rows };
});

/* ------------------------------------------------------------ Prüfaufträge */
const paBl = sectionBlocks('12. Prüfaufträge');
const paItems = paBl.find((b) => b.kind === 'ol').items.map((item) => {
  const m = item.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  const lead = m ? m[1] : item;
  const rest = m ? m[2] : '';
  return { lead, rest, leadPlain: stripMd(lead), restPlain: stripMd(rest) };
});

/* ------------------------------------------------------------ Regulatorik */
const reg = [['10.1'], ['10.2'], ['10.3'], ['10.4'], ['10.5']].map(([num]) => ({
  title: headingTitle(num + ' '),
  blocks: sectionBlocks(num + ' '),
}));

/* ------------------------------------------------------------ Zusammenbau */
const data = {
  meta: {
    stand: STAND,
    title: 'Vergleich von Datenplattformen',
    author: 'Aaron Weise, Heyde (Schweiz) AG',
  },
  levelMeaning,
  intro: {
    b01: sectionBlocks('0.1 Kein Gewinner').slice(1),
    b04: sectionBlocks('0.4 Was dieser Vergleich nicht ist'),
  },
  layer: {
    b11: sectionBlocks('1.1 Die zwei Ebenen').filter((b) => b.kind !== 'pre'),
    t13: table('1.3 Was auf welcher Ebene'),
  },
  matrix: {
    rows: table('1.2 Kombinationsmatrix'),
    after: sectionBlocks('1.2 Kombinationsmatrix').filter((b) => b.kind !== 'table'),
  },
  criteria,
  prices: {
    b03: sectionBlocks('0.3 Umgang mit Preisen'),
    cards: subsections(sectionLines('3.2 Verifizierte Listenpreise')).map(([title, ls]) => ({
      title,
      blocks: blocks(ls),
    })),
  },
  profiles,
  konst: {
    intro: sectionBlocks('9. Typische Konstellationen').filter((b) => b.kind === 'p'),
    rows: table('9. Typische Konstellationen'),
  },
  reg,
  markt: {
    rows: table('11. Marktkontext'),
    blocks: sectionBlocks('11. Marktkontext').filter((b) => b.kind === 'p'),
  },
  pruef: {
    intro: paBl.filter((b) => b.kind === 'p'),
    items: paItems,
  },
  transparenz: {
    blocks: sectionBlocks('13. Transparenz').filter((b) => b.kind === 'p'),
    rows: table('13. Transparenz'),
  },
  quellen: sectionBlocks('14. Quellen'),
};

/* Sicherungen: kein scharfes s, Pflichtfelder vorhanden */
const json = JSON.stringify(data, null, 1);
if (json.includes('ß')) throw new Error('scharfes s im erzeugten Inhalt gefunden');
if (paItems.length !== 9) throw new Error(`erwartet 9 Prüfaufträge, gefunden ${paItems.length}`);
if (profiles.length !== 6) throw new Error('erwartet 6 Steckbriefe');
if (Object.keys(levelMeaning).length !== 4) throw new Error('erwartet 4 Skalenstufen');

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, json + '\n', 'utf8');
console.log(`content: ${OUT} (${json.length} Zeichen, ${paItems.length} Prüfaufträge, ${profiles.length} Steckbriefe)`);
