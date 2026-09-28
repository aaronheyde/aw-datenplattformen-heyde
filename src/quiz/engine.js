/**
 * Quiz-Engine — reine Funktionen, kein DOM, kein Storage.
 * Port der Funktionen condMet() und evaluate() aus work/quiz.py.
 *
 * Zwei Stufen gemaess Spezifikation Abschnitt 1:
 *   1. harte Ausschluesse (E1 bis E10) entfernen Konstellationen,
 *   2. Punkte-Regeln (P01 bis P37) bewerten die verbleibenden.
 * Bei Gleichstand entscheidet die niedrigere Konstellations-Nummer.
 */
import {
  CONSTELLATIONS, QUESTIONS, EXCLUSIONS, WARNINGS, POINTS, PRUEF_RELEVANCE,
} from './spec.js';

export const TOTAL_QUESTIONS = QUESTIONS.length;
export const MIN_ANSWERS = 15;

/** Eine Regelbedingung ist erfuellt, wenn alle Paare [Frage, Option] zutreffen. */
export function condMet(answers, cond) {
  for (const [q, k] of cond) {
    if (answers[q] !== k) return false;
  }
  return true;
}

export function answeredCount(answers) {
  return Object.keys(answers).filter((k) => answers[k]).length;
}

export function canEvaluate(answers) {
  return answeredCount(answers) >= MIN_ANSWERS;
}

export function questionById(id) {
  return QUESTIONS.find((q) => q.id === id) || null;
}

export function optionText(qid, key) {
  const q = questionById(qid);
  if (!q) return '';
  const o = q.opts.find((x) => x.k === key);
  return o ? o.t : '';
}

/**
 * @param {Object} answers  z. B. { F1: 'a', F2: 'a', ... }
 * @param {Array}  pruefItems  die neun Prüfaufträge aus Kapitel 12: {lead, rest}
 */
export function evaluate(answers, pruefItems = []) {
  /* ---------------- Stufe 1: harte Ausschluesse ---------------- */
  const killed = {};
  for (const r of EXCLUSIONS) {
    if (!condMet(answers, r.cond)) continue;
    for (const k of r.kill) {
      if (!killed[k]) killed[k] = [];
      if (!killed[k].some((x) => x.reason === r.reason)) {
        killed[k].push({ id: r.id, reason: r.reason });
      }
    }
  }
  const alive = CONSTELLATIONS.filter((c) => !killed[c.id]);

  /* ---------------- Stufe 2: Punkte ---------------- */
  const scores = {};
  const hits = [];
  alive.forEach((c) => { scores[c.id] = 0; });
  for (const r of POINTS) {
    if (!condMet(answers, r.cond)) continue;
    hits.push(r);
    for (const k of Object.keys(r.pts)) {
      if (Object.prototype.hasOwnProperty.call(scores, k)) scores[k] += r.pts[k];
    }
  }

  const ranked = alive.slice().sort((a, b) => {
    if (scores[b.id] !== scores[a.id]) return scores[b.id] - scores[a.id];
    return parseInt(a.id.slice(1), 10) - parseInt(b.id.slice(1), 10);
  });
  const win = ranked.length ? ranked[0] : null;

  const tie = [];
  if (win) {
    ranked.forEach((c) => {
      if (c.id !== win.id && scores[c.id] === scores[win.id]) tie.push(c);
    });
  }

  const reasons = [];
  if (win) {
    hits.forEach((r) => {
      if (r.reason && r.pts[win.id] && r.pts[win.id] > 0) reasons.push(r);
    });
  }

  const warns = WARNINGS.filter((w) => condMet(answers, w.cond));

  const pruef = pruefItems.map((p, i) => {
    const rule = PRUEF_RELEVANCE[String(i + 1)];
    let rel = false;
    if (rule === 'always') rel = true;
    else if (rule) rel = rule.some(([q, keys]) => keys.indexOf(answers[q]) >= 0);
    return { n: i + 1, lead: p.lead, rest: p.rest, rel };
  });

  const n = answeredCount(answers);
  return {
    win, tie, scores, ranked, killed, reasons, warns, pruef,
    partial: n < TOTAL_QUESTIONS,
    answered: n,
  };
}
