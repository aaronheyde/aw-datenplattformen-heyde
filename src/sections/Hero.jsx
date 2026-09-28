import React from 'react';
import Blocks from '../components/Blocks.jsx';
import { Legend } from '../components/Table.jsx';

export default function Hero({ content }) {
  const { meta, intro, levelMeaning } = content;
  return (
    <section id="intro" className="sec sec-hero" aria-labelledby="h-intro">
      <div className="hero-band">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">
              Herstellerneutrale Entscheidungsgrundlage · Reusable Asset
            </p>
            <h1 id="h-intro">Vergleich von Datenplattformen</h1>
            <p className="hero-sub">
              Hyperscaler und Datenplattformen im Schweizer Kontext — herstellerneutrale
              Entscheidungsgrundlage
            </p>
            <ul className="hero-meta">
              <li><span>{meta.stand}</span></li>
              <li><span>Aaron Weise, Heyde (Schweiz) AG</span></li>
              <li><span>Typ: Reusable Asset</span></li>
            </ul>
          </div>
          <div className="hero-callout">
            <p className="hc-kicker">Kein Gewinner</p>
            <p className="hc-lead">
              Dieser Vergleich vergibt bewusst <strong>keine Gesamtnote und keinen Sieger</strong>.
              Der Grund ist nicht Diplomatie, sondern Methodik: Die sechs betrachteten Angebote
              spielen nicht in derselben Liga.
            </p>
          </div>
        </div>
      </div>

      <div className="wrap">
        <h2>Wie dieser Vergleich zu lesen ist</h2>
        <div className="cols-2">
          <div className="panel">
            <h3>Zwei Ebenen, eine Kombinationssicht</h3>
            <Blocks blocks={intro.b01} />
          </div>
          <div className="panel panel-muted">
            <h3>Was dieser Vergleich nicht ist</h3>
            <Blocks blocks={intro.b04} />
            <p className="srcnote">
              Alle Preisangaben sind Listenpreise in USD, ohne MWST, ohne Rabatt,
              Stand 20.08.2026.
            </p>
          </div>
        </div>
        <Legend levelMeaning={levelMeaning} />
      </div>
    </section>
  );
}
