import React from 'react';
import Blocks from '../components/Blocks.jsx';
import Table from '../components/Table.jsx';
import Inline, { stripMd } from '../components/Inline.jsx';

const AVAIL_RE = /^(Ja|Nein|Nicht anwendbar)\b([\s\S]*)$/;
const KEY = { Ja: 'yes', Nein: 'no', 'Nicht anwendbar': 'na' };
const GLYPH = { yes: '●', no: '○', na: '–' };
const SR = { yes: 'verfügbar', no: 'nicht verfügbar', na: 'nicht anwendbar' };

/** Port von matrix_cell() aus work/build.py. */
function matrixCell(raw) {
  const plain = stripMd(raw);
  const m = plain.match(AVAIL_RE);
  if (!m) return <Inline md={raw} />;
  const state = m[1];
  const rest = m[2].trim().replace(/^[—\-–:,]\s*/, '');
  const key = KEY[state];
  return (
    <>
      <span className={`av av-${key}`}>
        <span className="av-dot" aria-hidden="true">{GLYPH[key]}</span>
        <span className="av-lbl">{state}</span>
        <span className="sr-only">{` — ${SR[key]}`}</span>
      </span>
      {rest ? <span className="av-note"><Inline md={rest} /></span> : null}
    </>
  );
}

function AvLegendItem({ k, label, def }) {
  return (
    <>
      <span className={`av av-${k}`}>
        <span className="av-dot" aria-hidden="true">{GLYPH[k]}</span>
        <span className="av-lbl">{label}</span>
      </span>
      <span className="av-legend-def">{def}</span>
    </>
  );
}

export default function Matrix({ content }) {
  const { matrix } = content;
  return (
    <section id="matrix" className="sec sec-alt" aria-labelledby="h-matrix">
      <div className="wrap">
        <p className="eyebrow">Kapitel 1.2 · die entscheidungsrelevanteste Sicht</p>
        <h2 id="h-matrix">Kombinationsmatrix Schweiz</h2>
        <p className="lead">Welche Konstellation ist im Land betreibbar?</p>
        <div className="av-legend">
          <AvLegendItem k="yes" label="Ja" def="im Land betreibbar" />
          <AvLegendItem k="no" label="Nein" def="nicht im Land betreibbar" />
          <AvLegendItem k="na" label="Nicht anwendbar" def="Kombination existiert nicht" />
        </div>
        <Table
          rows={matrix.rows} cls="tbl-matrix" cellFn={matrixCell} minW={980}
          wrapCls="scrollable"
        />
        <Blocks blocks={matrix.after} paraCls="matrix-note" />
      </div>
    </section>
  );
}
