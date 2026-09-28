/**
 * Entscheidungs-Quiz — Port von quiz_section() und der Quiz-Engine-Anbindung aus work/quiz.py.
 * Der Auswerten-Button liegt wie im abgenommenen Stand unter den Fragen.
 * Zustand ausschliesslich im React-State; keine Storage-API.
 */
import React, { useMemo, useRef, useState } from 'react';
import { BLOCKS, QUESTIONS } from '../quiz/spec.js';
import { evaluate, MIN_ANSWERS, TOTAL_QUESTIONS } from '../quiz/engine.js';
import QuizResult from '../quiz/QuizResult.jsx';

const QMAP = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

function progressText(n) {
  let tail;
  if (n < MIN_ANSWERS) tail = ` — ab ${MIN_ANSWERS} ist eine Teilauswertung möglich.`;
  else if (n < TOTAL_QUESTIONS) tail = ' — Teilauswertung möglich.';
  else tail = ' — vollständig.';
  return `${n} von ${TOTAL_QUESTIONS} Fragen beantwortet${tail}`;
}

export default function Quiz({ content }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const n = Object.keys(answers).length;
  const pct = Math.round((n / TOTAL_QUESTIONS) * 100);
  const txt = progressText(n);
  const pruefItems = useMemo(
    () => content.pruef.items.map((p) => ({ lead: p.leadPlain, rest: p.restPlain })),
    [content],
  );

  function pick(qid, key) {
    setAnswers((a) => ({ ...a, [qid]: key }));
  }

  function doEval() {
    const r = evaluate(answers, pruefItems);
    setResult(r);
    window.requestAnimationFrame(() => {
      if (resultRef.current) resultRef.current.focus();
    });
  }

  function doReset() {
    setAnswers({});
    setResult(null);
  }

  return (
    <section id="quiz" className="sec sec-alt" aria-labelledby="h-quiz">
      <div className="wrap">
        <p className="eyebrow">Interaktives Werkzeug</p>
        <h2 id="h-quiz">Entscheidungs-Quiz: welche Konstellation passt?</h2>
        <p className="lead">
          Zwanzig Fragen zum Anforderungsprofil. Die Auswertung arbeitet in zwei Stufen:
          zuerst die harten Ausschlüsse, danach eine Punktebewertung über die verbleibenden
          Konstellationen. Das Ergebnis gilt für das erfasste Profil und ist keine generelle
          Rangfolge — der Vergleich selbst vergibt bewusst keinen Sieger.
        </p>

        <div className="qz-bar" role="status" aria-live="polite">
          <div className="qz-prog">
            <span className="qz-prog-fill" id="qzFill" style={{ width: `${pct}%` }} />
          </div>
          <p className="qz-prog-t" id="qzCount">{txt}</p>
        </div>

        <form className="qz-form" id="qzForm" noValidate>
          {BLOCKS.map((b) => (
            <div className="qz-block" key={b.letter}>
              <h3 className="qz-blockhead">
                <span className="qz-blockletter">{b.letter}</span>
                {b.title}
              </h3>
              {b.qs.map((qid) => {
                const q = QMAP[qid];
                const num = parseInt(qid.slice(1), 10);
                const open = !!answers[qid];
                return (
                  <fieldset
                    className={open ? 'qz-q is-open' : 'qz-q'} id={`q-${qid}`} key={qid}
                  >
                    <legend>
                      <span className="qz-qnum">{num}</span>
                      <span className="qz-qtext">{q.text}</span>
                    </legend>
                    <div className="qz-opts">
                      {q.opts.map((o) => (
                        <label className="qz-opt" key={o.k}>
                          <input
                            type="radio" name={qid} value={o.k} data-q={qid}
                            checked={answers[qid] === o.k}
                            onChange={() => pick(qid, o.k)}
                          />
                          <span className="qz-mark" aria-hidden="true" />
                          <span className="qz-opt-t">{o.t}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                );
              })}
            </div>
          ))}
        </form>

        <div className="qz-actbar">
          <p className="qz-prog-t" id="qzCount2">{txt}</p>
          <div className="qz-bar-act">
            <button
              type="button" className="btn btn-primary" id="qzEval"
              disabled={n < MIN_ANSWERS} onClick={doEval}
            >
              Auswerten
            </button>
            <button type="button" className="btn btn-ghost" id="qzReset" onClick={doReset}>
              Antworten zurücksetzen
            </button>
          </div>
        </div>

        <QuizResult
          result={result} answers={answers} onReset={doReset} outRef={resultRef}
        />
      </div>
    </section>
  );
}
