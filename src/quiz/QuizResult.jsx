/**
 * Ergebnisdarstellung — Port von render() aus work/quiz.py.
 * Reihenfolge der Abschnitte nach quiz-spec.md Abschnitt 6.
 * Der Sandbox-Hinweis der Artifact-Version entfaellt; es bleiben der regulaere
 * Download und «Ergebnis als Text kopieren».
 */
import React, { useState } from 'react';
import { CONSTELLATIONS, FRAMING } from './spec.js';
import { TOTAL_QUESTIONS } from './engine.js';
import { resultText } from './resultText.js';
import { downloadDocx } from '../docx/docx.js';
import { logoLight } from '../components/Layout.jsx';

function KilledTable({ killed }) {
  const rows = CONSTELLATIONS.filter((c) => killed[c.id]);
  if (!rows.length) return <p>Keine Konstellation wurde hart ausgeschlossen.</p>;
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th scope="col" className="rowhead">Konstellation</th>
            <th scope="col">Grund</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <th scope="row" className="rowhead">{`${c.id} — ${c.name}`}</th>
              <td>
                {killed[c.id].map((x, i) => (
                  <React.Fragment key={x.id + i}>
                    {i > 0 ? <br /> : null}
                    {`${x.id}: ${x.reason}`}
                  </React.Fragment>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function QuizResult({ result, answers, onReset, outRef }) {
  const [meta, setMeta] = useState({ kunde: '', bearbeiter: '' });
  const [copyMsg, setCopyMsg] = useState(null);

  if (!result) {
    return (
      <div className="qz-result" id="qzResult" hidden aria-labelledby="h-qzres" tabIndex={-1} />
    );
  }

  const r = result;

  if (!r.win) {
    return (
      <div
        className="qz-result" id="qzResult" aria-labelledby="h-qzres" tabIndex={-1} ref={outRef}
      >
        <h3 id="h-qzres" className="qz-res-name">Keine Konstellation bleibt übrig</h3>
        <p>
          Alle acht Konstellationen sind durch die harten Ausschlussregeln entfallen. Das ist ein
          Ergebnis, kein Fehler: die Anforderungskombination ist mit den sechs betrachteten
          Angeboten nicht abbildbar und muss im Workshop überarbeitet werden.
        </p>
      </div>
    );
  }

  function copyResult() {
    const txt = resultText(r, meta, answers);
    const done = (msg) => setCopyMsg(msg);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(
        () => done('Ergebnis in die Zwischenablage kopiert.'),
        () => fallbackCopy(txt, done),
      );
    } else fallbackCopy(txt, done);
  }

  function fallbackCopy(txt, done) {
    const ta = document.createElement('textarea');
    ta.value = txt;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    done(ok ? 'Ergebnis in die Zwischenablage kopiert.'
      : 'Kopieren wurde vom Browser abgelehnt. Bitte den Text manuell markieren.');
  }

  return (
    <div className="qz-result" id="qzResult" aria-labelledby="h-qzres" tabIndex={-1} ref={outRef}>
      <div className="qz-res-head">
        <span className="qz-res-id">{r.win.id}</span>
        <span className="qz-res-name" id="h-qzres">{r.win.name}</span>
      </div>
      <p>{r.win.desc}</p>
      {r.partial ? (
        <p className="qz-part">
          {`Teilauswertung: ${r.answered} von ${TOTAL_QUESTIONS} Fragen beantwortet. `
            + 'Unbeantwortete Fragen liefern keine Punkte und lösen keine Ausschlüsse aus.'}
        </p>
      ) : null}
      <p className="qz-framing">{FRAMING}</p>

      <h4 className="qz-h">Warum diese Konstellation</h4>
      {r.reasons.length ? (
        <ul className="qz-why">
          {r.reasons.map((x) => <li key={x.id}>{x.reason}</li>)}
        </ul>
      ) : (
        <p>
          Keine der Punkte-Regeln hat für diese Konstellation einen Begründungssatz ausgelöst.
          Sie bleibt allein deshalb übrig, weil die harten Ausschlüsse alle anderen
          Konstellationen entfernt haben.
        </p>
      )}

      <h4 className="qz-h">Warnhinweise</h4>
      {r.warns.length ? r.warns.map((w) => (
        <div className={w.strong ? 'qz-warn qz-warn-crit' : 'qz-warn'} key={w.id}>
          <span className="qz-warn-id">{w.id}</span>
          {w.head ? <strong>{`${w.head} `}</strong> : null}
          {w.body}
        </div>
      )) : <p>Keine der Warnbedingungen greift für dieses Profil.</p>}

      <h4 className="qz-h">Ausgeschlossene Optionen</h4>
      <KilledTable killed={r.killed} />

      <h4 className="qz-h">Risiken der empfohlenen Konstellation</h4>
      <p>{r.win.risk}</p>

      <h4 className="qz-h">Relevante Prüfaufträge</h4>
      <ul className="qz-pl">
        {r.pruef.map((p) => (
          <li className={p.rel ? 'is-rel' : ''} key={p.n}>
            <span className="qz-pn">{p.n}</span>
            <span>
              <strong>{p.lead}</strong>
              {` ${p.rest}`}
              {p.rel ? (
                <span className="qz-relmark">für dieses Profil besonders relevant</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>

      <details className="qz-score">
        <summary>Punktestand der nicht ausgeschlossenen Konstellationen einblenden</summary>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th scope="col" className="rowhead">Konstellation</th>
                <th scope="col">Punkte</th>
              </tr>
            </thead>
            <tbody>
              {r.ranked.map((c) => (
                <tr key={c.id}>
                  <th scope="row" className="rowhead">{`${c.id} — ${c.name}`}</th>
                  <td>{r.scores[c.id]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {r.tie.length ? (
          <p className="qz-tie">
            {`Gleichstand mit ${r.tie.map((c) => `${c.id} — ${c.name}`).join(', ')} bei `
              + `${r.scores[r.win.id]} Punkten. Die Empfehlung fällt nach Regel auf die `
              + 'niedrigere Konstellations-Nummer.'}
          </p>
        ) : null}
      </details>

      <div className="qz-act">
        <h4 className="qz-h" style={{ marginTop: 0 }}>Aktionen</h4>
        <div className="qz-fields">
          <div>
            <label htmlFor="qzKunde">Kunde</label>
            <input
              type="text" id="qzKunde" autoComplete="off" value={meta.kunde}
              onChange={(e) => setMeta((m) => ({ ...m, kunde: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="qzBearb">Bearbeiter</label>
            <input
              type="text" id="qzBearb" autoComplete="off" value={meta.bearbeiter}
              onChange={(e) => setMeta((m) => ({ ...m, bearbeiter: e.target.value }))}
            />
          </div>
        </div>
        <div className="qz-actrow">
          <button
            type="button" className="btn btn-primary" id="qzDocx"
            onClick={() => downloadDocx(r, meta, answers, logoLight)}
          >
            Word-Dokument erzeugen
          </button>
          <button type="button" className="btn btn-ghost" id="qzCopy" onClick={copyResult}>
            Ergebnis als Text kopieren
          </button>
          <button type="button" className="btn btn-ghost" id="qzReset2" onClick={onReset}>
            Antworten zurücksetzen
          </button>
        </div>
        {copyMsg ? <p className="qz-copyok" id="qzCopyOk">{copyMsg}</p> : null}
      </div>
    </div>
  );
}
