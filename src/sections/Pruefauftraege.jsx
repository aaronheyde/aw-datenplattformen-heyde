/** Prüfaufträge mit Haken — Zustand ausschliesslich im React-State, kein Storage. */
import React, { useState } from 'react';
import Blocks from '../components/Blocks.jsx';
import Inline from '../components/Inline.jsx';

export default function Pruefauftraege({ content }) {
  const items = content.pruef.items;
  const [checks, setChecks] = useState({});
  const n = Object.values(checks).filter(Boolean).length;

  return (
    <section id="pruefauftraege" className="sec" aria-labelledby="h-pa">
      <div className="wrap">
        <p className="eyebrow">Kapitel 12</p>
        <h2 id="h-pa">Prüfaufträge vor jeder Kundenentscheidung</h2>
        <Blocks blocks={content.pruef.intro} paraCls="lead" />
        <div className="chk-head">
          <p className="chk-count" id="chkCount" aria-live="polite">
            {`${n} von ${items.length} geprüft`}
          </p>
          <button
            type="button" className="btn btn-ghost" id="chkReset"
            onClick={() => setChecks({})}
          >
            Zurücksetzen
          </button>
        </div>
        <ol className="chk-list">
          {items.map((it, i) => {
            const k = i + 1;
            return (
              <li className="chk" key={k}>
                <input
                  type="checkbox" id={`chk${k}`} className="chk-box"
                  checked={!!checks[k]}
                  onChange={(e) => setChecks((c) => ({ ...c, [k]: e.target.checked }))}
                />
                <label htmlFor={`chk${k}`}>
                  <span className="chk-num">{k}</span>
                  <span className="chk-txt">
                    <strong><Inline md={it.lead} /></strong>
                    <Inline md={` ${it.rest}`} />
                  </span>
                </label>
              </li>
            );
          })}
        </ol>
        <p className="srcnote">
          Der Haken-Status wird nur im Arbeitsspeicher gehalten und beim Neuladen der Seite
          verworfen.
        </p>
      </div>
    </section>
  );
}
