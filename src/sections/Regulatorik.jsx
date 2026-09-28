import React from 'react';
import Blocks from '../components/Blocks.jsx';
import Inline from '../components/Inline.jsx';

export default function Regulatorik({ content }) {
  return (
    <section id="regulatorik" className="sec" aria-labelledby="h-reg">
      <div className="wrap">
        <p className="eyebrow">Kapitel 10</p>
        <h2 id="h-reg">Regulatorischer Rahmen Schweiz — was tatsächlich gilt</h2>
        <p className="callout callout-legal">
          <strong>Keine Rechtsberatung.</strong> Zusammenfassung öffentlich zugänglicher Quellen,
          Stand 20.08.2026. Die regulatorischen Abschnitte ersetzen keine anwaltliche Prüfung.
        </p>
        <div className="reg-grid">
          {content.reg.map((r, i) => (
            <article className="reg" key={i}>
              <h3><Inline md={r.title} /></h3>
              <Blocks blocks={r.blocks} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
