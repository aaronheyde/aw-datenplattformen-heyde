/** Tabellen-Renderer — Port von render_table() aus work/build.py. */
import React from 'react';
import Inline, { stripMd } from './Inline.jsx';

export default function Table({
  rows, cls = '', firstColHead = true, cellFn = null, minW = null,
  caption = null, wrapCls = '',
}) {
  if (!rows || !rows.length) return null;
  const head = rows[0];
  const body = rows.slice(1);
  const style = minW ? { minWidth: `${minW}px` } : undefined;
  return (
    <div className={`tbl-wrap ${wrapCls}`}>
      <table className={`tbl ${cls}`} style={style}>
        {caption ? <caption><Inline md={caption} /></caption> : null}
        <thead>
          <tr>
            {head.map((c, k) => (
              <th key={k} scope="col" className={k === 0 ? 'rowhead' : undefined}>
                <Inline md={c} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, k) => (
                k === 0 && firstColHead
                  ? <th key={k} scope="row" className="rowhead"><Inline md={c} /></th>
                  : <td key={k}>{cellFn ? cellFn(c) : <Inline md={c} />}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------------------------- Bewertungsstufen */
export const LEVELS = {
  'Ausgeprägt': ['aus', 4],
  Solide: ['sol', 3],
  Bedingt: ['bed', 2],
  'Lücke': ['lue', 0],
};

const LEVEL_RE = /^(Ausgeprägt|Solide|Bedingt|Lücke)\b([\s\S]*)$/;

function Meter({ filled }) {
  return (
    <span className="meter" aria-hidden="true">
      {[0, 1, 2, 3].map((k) => <i key={k} className={k < filled ? 'seg on' : 'seg'} />)}
    </span>
  );
}

/** Port von level_cell(): erkennt die vier Skalenstufen, sonst Freitext. */
export function levelCell(raw, levelMeaning) {
  const plain = stripMd(raw);
  const m = plain.match(LEVEL_RE);
  if (!m) return <span className="lv-free"><Inline md={raw} /></span>;
  const name = m[1];
  let note = m[2].trim();
  if (note.startsWith('(') && note.endsWith(')')) note = note.slice(1, -1).trim();
  const [cls, filled] = LEVELS[name];
  return (
    <>
      <span className={`lv lv-${cls}`} title={(levelMeaning && levelMeaning[name]) || name}>
        <Meter filled={filled} />
        <span className="lv-name">{name}</span>
      </span>
      {note ? <span className="lv-note"><Inline md={note} /></span> : null}
    </>
  );
}

export function AssessTable({ rows, levelMeaning, caption = null }) {
  return (
    <Table
      rows={rows}
      cls="tbl-assess"
      cellFn={(c) => levelCell(c, levelMeaning)}
      minW={1180}
      caption={caption}
      wrapCls="scrollable"
    />
  );
}

/** Port von legend_html(). */
export function Legend({ levelMeaning }) {
  return (
    <div className="legend" role="group" aria-label="Bewertungsskala">
      <p className="legend-title">
        Vierstufige, beschreibende Skala — keine Punkte, keine Summe
      </p>
      <ul className="legend-list">
        {['Ausgeprägt', 'Solide', 'Bedingt', 'Lücke'].map((name) => {
          const [cls, filled] = LEVELS[name];
          return (
            <li className="lg-item" key={name}>
              <span className={`lv lv-${cls}`}>
                <Meter filled={filled} />
                <span className="lv-name">{name}</span>
              </span>
              <span className="lg-def"><Inline md={levelMeaning[name]} /></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
