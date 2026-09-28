/**
 * Vitest fuer die Quiz-Engine: die zehn Ausschlussregeln und mehrere vollstaendige
 * Anforderungsprofile. Reine Funktionen, kein DOM.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  condMet, evaluate, answeredCount, canEvaluate, optionText, MIN_ANSWERS, TOTAL_QUESTIONS,
} from '../src/quiz/engine.js';
import { CONSTELLATIONS, EXCLUSIONS, POINTS, QUESTIONS, WARNINGS } from '../src/quiz/spec.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const content = JSON.parse(
  readFileSync(resolve(HERE, '../src/content/content.json'), 'utf8'),
);
const PRUEF = content.pruef.items.map((p) => ({ lead: p.leadPlain, rest: p.restPlain }));

/** Basisprofil: alle 20 Fragen beantwortet, damit kein Teilauswertungs-Rauschen entsteht. */
const BASE = {
  F1: 'a', F2: 'b', F3: 'c', F4: 'c', F5: 'd', F6: 'a',
  F7: 'a', F8: 'c', F9: 'c', F10: 'a', F11: 'd', F12: 'a', F13: 'b', F14: 'c',
  F15: 'b', F16: 'a', F17: 'b', F18: 'b',
  F19: 'a', F20: 'b',
};
const profile = (over) => ({ ...BASE, ...over });
const ids = (list) => list.map((c) => c.id);

describe('Struktur der Spezifikation', () => {
  it('enthält 20 Fragen, 8 Konstellationen, 10 Ausschlüsse, 5 Warnungen, 37 Punkte-Regeln', () => {
    expect(QUESTIONS).toHaveLength(20);
    expect(TOTAL_QUESTIONS).toBe(20);
    expect(CONSTELLATIONS).toHaveLength(8);
    expect(EXCLUSIONS).toHaveLength(10);
    expect(WARNINGS).toHaveLength(5);
    expect(POINTS).toHaveLength(37);
    expect(EXCLUSIONS.map((e) => e.id)).toEqual(
      ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'],
    );
  });

  it('kennt neun Prüfaufträge aus Kapitel 12', () => {
    expect(PRUEF).toHaveLength(9);
  });

  it('enthält kein scharfes s', () => {
    const all = JSON.stringify([CONSTELLATIONS, QUESTIONS, EXCLUSIONS, WARNINGS, POINTS]);
    expect(all).not.toContain('ß');
  });
});

describe('condMet und Zählung', () => {
  it('erfüllt eine Bedingung nur bei vollständiger Übereinstimmung', () => {
    expect(condMet({ F1: 'a', F2: 'a' }, [['F1', 'a'], ['F2', 'a']])).toBe(true);
    expect(condMet({ F1: 'a' }, [['F1', 'a'], ['F2', 'a']])).toBe(false);
    expect(condMet({ F1: 'b' }, [['F1', 'a']])).toBe(false);
  });

  it('gibt die Auswertung erst ab 15 Antworten frei', () => {
    const partial = {};
    QUESTIONS.slice(0, 14).forEach((q) => { partial[q.id] = 'a'; });
    expect(answeredCount(partial)).toBe(14);
    expect(canEvaluate(partial)).toBe(false);
    partial.F15 = 'a';
    expect(canEvaluate(partial)).toBe(true);
    expect(MIN_ANSWERS).toBe(15);
  });

  it('liest Optionstexte aus der Spezifikation', () => {
    expect(optionText('F1', 'a')).toBe('Microsoft Azure');
    expect(optionText('F2', 'a')).toBe('Ja, zwingend');
  });
});

describe('Harte Ausschlussregeln E1 bis E10', () => {
  it('E1: AWS-Substrat schliesst Fabric aus (K1, K3)', () => {
    const r = evaluate(profile({ F1: 'b' }), PRUEF);
    expect(r.killed.K1.some((x) => x.id === 'E1')).toBe(true);
    expect(r.killed.K3.some((x) => x.id === 'E1')).toBe(true);
  });

  it('E2: Google Cloud schliesst Fabric aus (K1, K3)', () => {
    const r = evaluate(profile({ F1: 'c' }), PRUEF);
    expect(r.killed.K1.some((x) => x.id === 'E2')).toBe(true);
    expect(r.killed.K3.some((x) => x.id === 'E2')).toBe(true);
  });

  it('E3: Google Cloud schliesst Snowflake-Konstellationen aus (K4, K5)', () => {
    const r = evaluate(profile({ F1: 'c' }), PRUEF);
    expect(r.killed.K4.some((x) => x.id === 'E3')).toBe(true);
    expect(r.killed.K5.some((x) => x.id === 'E3')).toBe(true);
  });

  it('E4: Multi-Cloud im Betrieb schliesst Fabric aus (K1, K3)', () => {
    const r = evaluate(profile({ F1: 'd', F4: 'a' }), PRUEF);
    expect(r.killed.K1.some((x) => x.id === 'E4')).toBe(true);
    expect(r.killed.K3.some((x) => x.id === 'E4')).toBe(true);
  });

  it('E5: AWS plus zwingende CH-Residenz schliesst Databricks aus (K2, K3, K8)', () => {
    const r = evaluate(profile({ F1: 'b', F2: 'a' }), PRUEF);
    ['K2', 'K3', 'K8'].forEach((k) => {
      expect(r.killed[k].some((x) => x.id === 'E5')).toBe(true);
    });
  });

  it('E6: Google Cloud plus zwingende CH-Residenz schliesst Databricks aus (K2, K3, K8)', () => {
    const r = evaluate(profile({ F1: 'c', F2: 'a' }), PRUEF);
    ['K2', 'K3', 'K8'].forEach((k) => {
      expect(r.killed[k].some((x) => x.id === 'E6')).toBe(true);
    });
  });

  it('E7: gesetztes Azure schliesst AWS- und GCP-Konstellationen aus', () => {
    const r = evaluate(profile({ F1: 'a' }), PRUEF);
    ['K5', 'K6', 'K7', 'K8'].forEach((k) => {
      expect(r.killed[k].some((x) => x.id === 'E7')).toBe(true);
    });
  });

  it('E8: gesetztes AWS schliesst Azure- und GCP-Konstellationen aus', () => {
    const r = evaluate(profile({ F1: 'b' }), PRUEF);
    ['K1', 'K2', 'K3', 'K4', 'K7'].forEach((k) => {
      expect(r.killed[k].some((x) => x.id === 'E8')).toBe(true);
    });
  });

  it('E9: gesetztes Google Cloud schliesst Azure- und AWS-Konstellationen aus', () => {
    const r = evaluate(profile({ F1: 'c' }), PRUEF);
    ['K1', 'K2', 'K3', 'K4', 'K5', 'K6'].forEach((k) => {
      expect(r.killed[k].some((x) => x.id === 'E9')).toBe(true);
    });
  });

  it('E10: zwingende CH-Residenz schliesst die EU-Region-Konstellation K8 aus', () => {
    const r = evaluate(profile({ F1: 'd', F2: 'a' }), PRUEF);
    expect(r.killed.K8.some((x) => x.id === 'E10')).toBe(true);
  });

  it('keine ausgeschlossene Konstellation erscheint in der Rangliste', () => {
    [{ F1: 'a' }, { F1: 'b' }, { F1: 'c' }, { F1: 'b', F2: 'a' }, { F4: 'a' }].forEach((o) => {
      const r = evaluate(profile(o), PRUEF);
      const killedIds = Object.keys(r.killed);
      ids(r.ranked).forEach((k) => expect(killedIds).not.toContain(k));
      if (r.win) expect(killedIds).not.toContain(r.win.id);
    });
  });
});

describe('Anforderungsprofile aus der Spezifikation', () => {
  it('Profil 1 — Azure, CH zwingend, KI streng: K1 mit W1', () => {
    const r = evaluate(profile({ F1: 'a', F2: 'a', F3: 'a' }), PRUEF);
    expect(r.win.id).toBe('K1');
    expect(r.warns.map((w) => w.id)).toContain('W1');
    expect(r.warns.find((w) => w.id === 'W1').strong).toBe(true);
    expect(r.partial).toBe(false);
  });

  it('Profil 2 — AWS, CH zwingend: Databricks über E5 ausgeschlossen, nur K5 und K6 bleiben', () => {
    const r = evaluate(profile({ F1: 'b', F2: 'a', F3: 'c' }), PRUEF);
    ['K2', 'K3', 'K8'].forEach((k) => {
      expect(r.killed[k].some((x) => x.id === 'E5')).toBe(true);
    });
    expect(ids(r.ranked)).toEqual(['K5', 'K6']);
    expect(r.win.id).toBe('K5');
    expect(r.scores).toEqual({ K5: 3, K6: 2 });
  });

  it('Profil 3 — Google Cloud, CH zwingend: nur K7 bleibt', () => {
    const r = evaluate(profile({ F1: 'c', F2: 'a', F3: 'c' }), PRUEF);
    expect(ids(r.ranked)).toEqual(['K7']);
    expect(r.win.id).toBe('K7');
  });

  it('Profil 4 — Engineering-Schwerpunkt auf Azure mit hohem Exit-Anspruch: K2', () => {
    const r = evaluate(profile({
      F1: 'a', F2: 'a', F3: 'c', F7: 'b', F10: 'b', F14: 'a', F15: 'c', F16: 'b',
      F17: 'a', F19: 'b', F20: 'a',
    }), PRUEF);
    expect(r.win.id).toBe('K2');
    expect(ids(r.ranked)).not.toContain('K7');
  });

  it('Profil 5 — FINMA, Substrat offen, Multi-Cloud im Betrieb: Fabric ausgeschlossen', () => {
    const r = evaluate(profile({ F1: 'd', F2: 'b', F3: 'b', F4: 'a', F5: 'a' }), PRUEF);
    expect(r.killed.K1.some((x) => x.id === 'E4')).toBe(true);
    expect(r.killed.K3.some((x) => x.id === 'E4')).toBe(true);
    expect(r.warns.map((w) => w.id)).toEqual(expect.arrayContaining(['W2', 'W5']));
    expect(['K2', 'K4', 'K5', 'K6', 'K7', 'K8']).toContain(r.win.id);
  });

  it('Profil 6 — Datenaustausch mit Dritten zentral auf Azure: K4', () => {
    const r = evaluate(profile({
      F1: 'a', F2: 'a', F3: 'c', F7: 'd', F9: 'a', F10: 'b', F19: 'b', F20: 'b',
    }), PRUEF);
    expect(r.win.id).toBe('K4');
  });

  it('Teilauswertung wird als solche gekennzeichnet', () => {
    const partial = { ...BASE };
    delete partial.F19;
    delete partial.F20;
    const r = evaluate(partial, PRUEF);
    expect(r.partial).toBe(true);
    expect(r.answered).toBe(18);
  });
});

describe('Warnhinweise und Prüfauftrags-Relevanz', () => {
  it('W1 greift nur bei F2 = a und F3 = a', () => {
    expect(evaluate(profile({ F2: 'a', F3: 'a' }), PRUEF).warns.map((w) => w.id)).toContain('W1');
    expect(evaluate(profile({ F2: 'a', F3: 'b' }), PRUEF).warns.map((w) => w.id))
      .not.toContain('W1');
  });

  it('W3 bei Gesundheitswesen, W4 bei öffentlicher Verwaltung, W5 bei offenem Substrat', () => {
    expect(evaluate(profile({ F5: 'b' }), PRUEF).warns.map((w) => w.id)).toContain('W3');
    expect(evaluate(profile({ F5: 'c' }), PRUEF).warns.map((w) => w.id)).toContain('W4');
    expect(evaluate(profile({ F1: 'd' }), PRUEF).warns.map((w) => w.id)).toContain('W5');
  });

  it('Prüfauftrag 5 ist immer relevant, Prüfauftrag 4 nur bei F2 = a', () => {
    const a = evaluate(profile({ F2: 'a' }), PRUEF);
    expect(a.pruef.find((p) => p.n === 5).rel).toBe(true);
    expect(a.pruef.find((p) => p.n === 4).rel).toBe(true);
    const b = evaluate(profile({ F2: 'c' }), PRUEF);
    expect(b.pruef.find((p) => p.n === 4).rel).toBe(false);
    expect(b.pruef).toHaveLength(9);
  });
});

describe('Begründungen und Gleichstand', () => {
  it('nennt nur Begründungssätze der empfohlenen Konstellation mit positiven Punkten', () => {
    const r = evaluate(profile({ F1: 'a', F2: 'a', F3: 'c' }), PRUEF);
    r.reasons.forEach((x) => {
      expect(x.pts[r.win.id]).toBeGreaterThan(0);
      expect(typeof x.reason).toBe('string');
      expect(x.reason.length).toBeGreaterThan(0);
    });
  });

  it('weist einen Gleichstand offen aus und wählt die niedrigere Nummer', () => {
    const r = evaluate(profile({ F1: 'c', F2: 'a', F3: 'c' }), PRUEF);
    // K7 ist alleine übrig, also kein Gleichstand
    expect(r.tie).toHaveLength(0);
    const t = evaluate(profile({ F1: 'b', F2: 'a', F3: 'c' }), PRUEF);
    if (t.tie.length) {
      const nums = [t.win, ...t.tie].map((c) => parseInt(c.id.slice(1), 10));
      expect(parseInt(t.win.id.slice(1), 10)).toBe(Math.min(...nums));
    }
  });
});
