import React from 'react';
import Blocks from '../components/Blocks.jsx';

export default function Quellen({ content }) {
  return (
    <section id="quellen" className="sec" aria-labelledby="h-q">
      <div className="wrap">
        <p className="eyebrow">Kapitel 14</p>
        <h2 id="h-q">Quellen</h2>
        <details className="src-details">
          <summary>
            Quellenverzeichnis einblenden — alle Quellen abgerufen am 20. August 2026
          </summary>
          <div className="src-body"><Blocks blocks={content.quellen} /></div>
        </details>
      </div>
    </section>
  );
}
