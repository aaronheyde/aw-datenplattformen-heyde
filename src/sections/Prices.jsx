import React from 'react';
import Blocks from '../components/Blocks.jsx';
import Inline from '../components/Inline.jsx';

export default function Prices({ content }) {
  const { prices } = content;
  return (
    <section id="preise" className="sec sec-alt" aria-labelledby="h-preise">
      <div className="wrap">
        <p className="eyebrow">Kapitel 3.2</p>
        <h2 id="h-preise">Preisübersicht — verifizierte Listenpreise</h2>
        <div className="panel panel-muted">
          <h3>Umgang mit Preisen</h3>
          <Blocks blocks={prices.b03} />
        </div>
        <p className="callout callout-warn">
          <strong>Nicht öffentlich verifizierbar:</strong> die Schweizer Listenpreise von Snowflake
          (Credits und Storage für AWS eu-central-2, Azure Switzerland North, GCP europe-west6)
          und die Analytics-Preise von Microsoft Azure (ADLS-Tiers, Data Factory, Event Hubs,
          Stream Analytics, Purview, Log Analytics, Azure-OpenAI-Tokenpreise, PTU, AI Search) —
          die offiziellen Preisseiten rendern die Beträge ausschliesslich clientseitig
          beziehungsweise erst nach Regionsauswahl. Für eine belastbare Offerte sind diese Werte
          live im Preisrechner oder über das Account-Team zu erheben.
        </p>
        <div className="pcards">
          {prices.cards.map((c, i) => (
            <article className="pcard" key={i}>
              <h3><Inline md={c.title} /></h3>
              <Blocks blocks={c.blocks} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
