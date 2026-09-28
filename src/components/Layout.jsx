/** Kopfzeile, Fusszeile und Sprungmarke — Port des HTML-Rahmens aus work/build.py. */
import React from 'react';
import Nav from './Nav.jsx';
import logoLight from '../assets/heyde-horizontal.png?inline';
import logoDark from '../assets/heyde-horizontal-light.png?inline';

export { logoLight, logoDark };

export function TopBar({ stand }) {
  return (
    <header className="topbar">
      <div className="topbar-in">
        <a className="brand" href="#intro" aria-label="Heyde — Startabschnitt">
          <img src={logoLight} alt="Heyde" />
        </a>
        <span className="brand-sep" aria-hidden="true" />
        <span className="brand-doc">Vergleich von Datenplattformen</span>
        <Nav />
        <span className="stand-chip">{stand}</span>
      </div>
    </header>
  );
}

export function SiteFooter({ stand }) {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <img src={logoDark} alt="Heyde" />
            <p className="foot-note">
              <strong>Vergleich von Datenplattformen</strong> — Hyperscaler und Datenplattformen
              im Schweizer Kontext. Herstellerneutrale Entscheidungsgrundlage, ohne Gesamtnote
              und ohne Sieger.
            </p>
          </div>
          <ul className="foot-meta">
            <li><strong>{stand}</strong></li>
            <li>Autor: Aaron Weise, Heyde (Schweiz) AG</li>
            <li>Typ: Reusable Asset · herstellerneutral</li>
            <li>Preisangaben: Listenpreise in USD, ohne MWST, ohne Rabatt</li>
          </ul>
        </div>
        <hr className="foot-rule" />
        <p className="foot-note">
          Keine Rechtsberatung, keine Performance-Benchmark. Preise, Regionsverfügbarkeit
          und KI-Features ändern sich monatlich — das Stand-Datum gehört auf jede Folie, die
          weiterverwendet wird.
        </p>
      </div>
    </footer>
  );
}

export function SkipLink() {
  return <a className="sr-only skiplink" href="#intro">Zum Inhalt springen</a>;
}
