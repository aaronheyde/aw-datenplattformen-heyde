/** Steckbriefe mit Filter und Aufklappen — Port des Steckbrief-Teils aus work/build.py. */
import React, { useState } from 'react';
import Inline from '../components/Inline.jsx';

const FILTERS = [
  ['all', 'Alle sechs'], ['plattform', 'Datenplattformen'], ['substrat', 'Cloud-Substrate'],
];

export default function Profiles({ content }) {
  const [filter, setFilter] = useState('all');
  const [allOpen, setAllOpen] = useState(false);
  const [open, setOpen] = useState({});

  function toggleAll() {
    const next = !allOpen;
    setAllOpen(next);
    const o = {};
    content.profiles.forEach((p) => { o[p.name] = next; });
    setOpen(o);
  }

  return (
    <section id="steckbriefe" className="sec" aria-labelledby="h-pf">
      <div className="wrap">
        <p className="eyebrow">Kapitel 8</p>
        <h2 id="h-pf">Steckbriefe</h2>
        <div className="filter-bar">
          <div className="segmented" role="group" aria-label="Steckbriefe filtern">
            {FILTERS.map(([k, label]) => (
              <button
                type="button" key={k}
                className={filter === k ? 'seg-btn is-on' : 'seg-btn'}
                data-filter={k} aria-pressed={filter === k ? 'true' : 'false'}
                onClick={() => setFilter(k)}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button" className="btn btn-ghost" id="pfAll"
            aria-pressed={allOpen ? 'true' : 'false'} onClick={toggleAll}
          >
            {allOpen ? 'Alle einklappen' : 'Alle ausklappen'}
          </button>
        </div>
        <div className="pf-grid">
          {content.profiles.map((p) => {
            const isOpen = !!open[p.name];
            const hidden = !(filter === 'all' || p.kindSlug === filter);
            return (
              <article className="pf" data-kind={p.kindSlug} key={p.name} hidden={hidden}>
                <header className="pf-head">
                  <div>
                    <span className={`badge badge-${p.kindSlug}`}>
                      <Inline md={p.kindLabel} />
                    </span>
                    <h3><Inline md={p.name} /></h3>
                  </div>
                  <button
                    type="button" className="pf-btn"
                    aria-expanded={isOpen ? 'true' : 'false'}
                    onClick={() => setOpen((o) => ({ ...o, [p.name]: !o[p.name] }))}
                  >
                    <span className="pf-btn-t">{isOpen ? 'Schliessen' : 'Details'}</span>
                    <span className="chev" aria-hidden="true" />
                  </button>
                </header>
                <p className="pf-char"><Inline md={p.char} /></p>
                <div className="pf-body" hidden={!isOpen}>
                  <dl className="pf-dl">
                    {p.rows.map(([k, v], i) => (
                      <div className="pf-row" key={i}>
                        <dt><Inline md={k} /></dt>
                        <dd><Inline md={v} /></dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
