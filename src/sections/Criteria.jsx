/** Die fuenf Kriterien-Tabs — Port von tab_panel(), details_block() und dem Tab-JS. */
import React, { useRef, useState } from 'react';
import Blocks from '../components/Blocks.jsx';
import Table, { AssessTable, Legend } from '../components/Table.jsx';
import Inline from '../components/Inline.jsx';

const TABS = [
  ['cost', 'Cost / TCO'], ['ai', 'AI Readiness'], ['svc', 'Analyseservices'],
  ['mp', 'Multi-Plattform'], ['ent', 'Enterprise-Readiness'],
];

function Chips({ items }) {
  return (
    <ul className="chips">
      {items.map((x, i) => <li className="chip" key={i}><Inline md={x} /></li>)}
    </ul>
  );
}

function Detail({ title, note, show, children }) {
  return (
    <div className="detail" data-detail hidden={!show}>
      <p className="detail-title"><Inline md={title} /></p>
      {note ? <p className="detail-note"><Inline md={note} /></p> : null}
      {children}
    </div>
  );
}

function Panel({ pid, subdims, active, children }) {
  return (
    <div
      className="tabpanel" id={`panel-${pid}`} role="tabpanel"
      aria-labelledby={`tab-${pid}`} tabIndex={0} hidden={!active}
    >
      <h3 className="panel-h">Unterdimensionen</h3>
      <Chips items={subdims} />
      {children}
    </div>
  );
}

export default function Criteria({ content }) {
  const [tab, setTab] = useState('cost');
  const [details, setDetails] = useState(false);
  const tabRefs = useRef({});
  const { criteria, levelMeaning } = content;
  const p = criteria.panels;

  function selectTab(id, focus) {
    setTab(id);
    if (focus) {
      window.requestAnimationFrame(() => {
        if (tabRefs.current[id]) tabRefs.current[id].focus();
      });
    }
  }

  function onKeyDown(e, i) {
    const k = e.key;
    let n = null;
    if (k === 'ArrowRight' || k === 'ArrowDown') n = (i + 1) % TABS.length;
    else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (i - 1 + TABS.length) % TABS.length;
    else if (k === 'Home') n = 0;
    else if (k === 'End') n = TABS.length - 1;
    if (n !== null) {
      e.preventDefault();
      selectTab(TABS[n][0], true);
    }
  }

  return (
    <section id="kriterien" className="sec" aria-labelledby="h-krit">
      <div className="wrap">
        <p className="eyebrow">Kapitel 2 bis 7</p>
        <h2 id="h-krit">Die fünf Kriterien</h2>
        <Blocks blocks={criteria.note} paraCls="lead" />
        <div className="tabs-bar">
          <div className="tablist" role="tablist" aria-label="Die fünf Prüfkriterien">
            {TABS.map(([id, label], i) => (
              <button
                type="button" className="tab" role="tab" id={`tab-${id}`} key={id}
                aria-controls={`panel-${id}`} aria-selected={tab === id ? 'true' : 'false'}
                tabIndex={tab === id ? 0 : -1}
                ref={(el) => { tabRefs.current[id] = el; }}
                onClick={() => selectTab(id, false)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <Inline md={label} />
              </button>
            ))}
          </div>
          <button
            type="button" className="btn btn-ghost" id="detailToggle"
            aria-pressed={details ? 'true' : 'false'}
            onClick={() => setDetails((d) => !d)}
          >
            {details ? 'Details ausblenden' : 'Details einblenden'}
          </button>
        </div>
        <Legend levelMeaning={levelMeaning} />

        <Panel pid="cost" subdims={criteria.subdims[p.cost.subkey]} active={tab === 'cost'}>
          <h3>Abrechnungsmodelle im direkten Vergleich</h3>
          <Table rows={p.cost.t31} minW={1220} wrapCls="scrollable" />
          <Blocks blocks={p.cost.p31} />
          <h3>Einordnung Cost / TCO</h3>
          <AssessTable rows={p.cost.t34} levelMeaning={levelMeaning} />
          <Detail
            title="Typische Kostenfallen je Plattform"
            note="Die drei häufigsten Überraschungen je Plattform (Kapitel 3.3)."
            show={details}
          >
            <Table rows={p.cost.t33} minW={760} wrapCls="scrollable" />
          </Detail>
        </Panel>

        <Panel pid="ai" subdims={criteria.subdims[p.ai.subkey]} active={tab === 'ai'}>
          <Blocks blocks={p.ai.b41} paraCls="lead" />
          <h3>GenAI-Funktionen im Vergleich</h3>
          <Table rows={p.ai.t42} minW={1340} wrapCls="scrollable" />
          <h3>Einordnung AI Readiness</h3>
          <AssessTable rows={p.ai.t43} levelMeaning={levelMeaning} />
          <Detail
            title="Kapitel 4.4 — Der zentrale Befund: Daten bleiben in der Schweiz, die Inferenz nicht"
            show={details}
          >
            <Blocks blocks={p.ai.b44} />
          </Detail>
        </Panel>

        <Panel pid="svc" subdims={criteria.subdims[p.svc.subkey]} active={tab === 'svc'}>
          <h3>Funktionsabdeckung im Vergleich</h3>
          <Table rows={p.svc.t51} minW={1340} wrapCls="scrollable" />
          <h3>Einordnung Analyseservices</h3>
          <AssessTable rows={p.svc.t52} levelMeaning={levelMeaning} />
          <Detail
            title="Kapitel 5.3 — Strategische Bewegungen, die man kennen muss"
            show={details}
          >
            <Blocks blocks={p.svc.b53} />
          </Detail>
        </Panel>

        <Panel pid="mp" subdims={criteria.subdims[p.mp.subkey]} active={tab === 'mp'}>
          <h3>Portabilität im Vergleich</h3>
          <Table rows={p.mp.t61} minW={1340} wrapCls="scrollable" />
          <h3>Einordnung Multi-Plattform</h3>
          <AssessTable rows={p.mp.t62} levelMeaning={levelMeaning} />
          <Detail title="Kapitel 6.3 — Wo Lock-in 2026 wirklich sitzt" show={details}>
            <Blocks blocks={p.mp.b63} />
          </Detail>
        </Panel>

        <Panel pid="ent" subdims={criteria.subdims[p.ent.subkey]} active={tab === 'ent'}>
          <h3>Zertifizierungen und Compliance-Nachweise</h3>
          <Table rows={p.ent.t71} minW={1080} wrapCls="scrollable" />
          <h3>Schweizer Datenresidenz und Souveränität</h3>
          <Table rows={p.ent.t72} minW={1180} wrapCls="scrollable" />
          <h3>Betriebsseitige Reife</h3>
          <Table rows={p.ent.t73} minW={1340} wrapCls="scrollable" />
          <Blocks blocks={p.ent.p73} paraCls="callout" />
          <p className="srcnote">
            Für dieses Kriterium enthält die Quelle keine Vierstufen-Einordnung; die drei
            Tabellen oben sind die vollständige Bewertung.
          </p>
          <Detail title="Kapitel 7.4 — Bekannte Lücken für grosse Organisationen" show={details}>
            <Table rows={p.ent.t74} minW={760} wrapCls="scrollable" />
          </Detail>
        </Panel>
      </div>
    </section>
  );
}
