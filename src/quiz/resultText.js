/** Ergebnis als Text — Port von resultText() aus work/quiz.py. */
import {
  CONSTELLATIONS, QUESTIONS, COSTS, STAND_TAG, FRAMING, PRICE_CLOSING, SCALE, METHOD_NOTES,
} from './spec.js';
import { optionText, TOTAL_QUESTIONS } from './engine.js';

export function dateCH(d = new Date()) {
  const p = (n) => (n < 10 ? '0' : '') + n;
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function dateISO(d = new Date()) {
  const p = (n) => (n < 10 ? '0' : '') + n;
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function resultText(r, meta, answers) {
  const L = [];
  L.push('Entscheidungsvorlage Datenplattform');
  L.push('Ergebnis des Anforderungsprofils');
  L.push('Kunde: ' + (meta.kunde || 'nicht angegeben'));
  L.push('Bearbeiter: ' + (meta.bearbeiter || 'nicht angegeben'));
  L.push('Erstellt: ' + dateCH());
  L.push('Grundlage: Vergleich von Datenplattformen, Stand 20. August 2026');
  L.push('');
  L.push('1 EMPFEHLUNG');
  L.push(r.win.id + ' — ' + r.win.name);
  L.push(r.win.desc);
  L.push(FRAMING);
  if (r.partial) {
    L.push(`Teilauswertung: ${r.answered} von ${TOTAL_QUESTIONS} Fragen beantwortet.`);
  }
  L.push('');
  L.push('Warum diese Konstellation:');
  if (r.reasons.length) r.reasons.forEach((x) => L.push('- ' + x.reason));
  else L.push('- Keine Punkte-Regel hat einen Begründungssatz ausgelöst.');
  L.push('');
  L.push('2 WARNHINWEISE UND REGULATORISCHE AUFLAGEN');
  if (r.warns.length) {
    r.warns.forEach((w) => L.push(w.id + ': ' + (w.head ? w.head + ' ' : '') + w.body));
  } else L.push('Keine.');
  L.push('');
  L.push('3 AUSGESCHLOSSENE OPTIONEN');
  let any = false;
  CONSTELLATIONS.forEach((c) => {
    if (!r.killed[c.id]) return;
    any = true;
    L.push(c.id + ' — ' + c.name + ': '
      + r.killed[c.id].map((x) => x.id + ': ' + x.reason).join(' | '));
  });
  if (!any) L.push('Keine.');
  L.push('');
  L.push('4 RISIKEN DER EMPFOHLENEN KONSTELLATION');
  L.push(r.win.risk);
  L.push('');
  L.push('5 KOSTENHINWEISE (Listenpreise, Stand 20.08.2026)');
  (COSTS[r.win.id] || []).forEach((g) => {
    L.push('-- ' + g.title);
    g.rows.forEach((row) => {
      L.push('   ' + row[0] + ' | ' + row[1] + ' | ' + row[2] + ' · ' + STAND_TAG);
    });
    g.notes.forEach((n) => L.push('   Hinweis: ' + n));
  });
  L.push(PRICE_CLOSING);
  L.push('');
  L.push('6 ANTWORTPROTOKOLL');
  QUESTIONS.forEach((q, i) => {
    const a = answers[q.id];
    L.push(`${i + 1}. ${q.text} -> ${a ? optionText(q.id, a) : 'nicht beantwortet'}`);
  });
  L.push('');
  L.push('7 PRUEFAUFTRAEGE');
  r.pruef.forEach((p) => {
    L.push(`${p.n}. ${p.lead} ${p.rest}`
      + (p.rel ? ' [für dieses Profil besonders relevant]' : ''));
  });
  L.push('');
  L.push('8 METHODIK UND TRANSPARENZ');
  SCALE.forEach((s) => L.push(s.n + ': ' + s.m));
  METHOD_NOTES.forEach((t) => L.push('- ' + t));
  L.push('');
  L.push('Punktestand:');
  r.ranked.forEach((c) => L.push(c.id + ' — ' + c.name + ': ' + r.scores[c.id]));
  if (r.tie.length) {
    L.push('Gleichstand mit ' + r.tie.map((c) => c.id + ' — ' + c.name).join(', '));
  }
  L.push('');
  L.push('Heyde (Schweiz) AG · Entscheidungsvorlage Datenplattform · ' + dateCH());
  return L.join('\n');
}
