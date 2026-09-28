import React from 'react';
import Blocks from '../components/Blocks.jsx';
import Table from '../components/Table.jsx';
import Inline from '../components/Inline.jsx';

/** Port von LAYERS und layer_visual() aus work/build.py. */
const LAYERS = [
  ['Konsumptionsschicht', null,
    ['Power BI · Tableau · Qlik · Looker · QuickSight · Genie / Cortex Analyst']],
  ['Datenplattform', ['Databricks', 'Microsoft Fabric', 'Snowflake'],
    ['(AWS/Azure/GCP)', '(nur Azure)', '(AWS/Azure/GCP)']],
  ['Hyperscaler-Stack', null,
    ['Redshift/Athena/Glue/EMR/S3', 'Synapse/ADF/ADLS/Azure Databricks',
      'BigQuery/Dataflow/Dataproc/GCS/Looker']],
  ['Substrat', null, ['AWS', 'Microsoft Azure', 'Google Cloud']],
];

function LayerVisual() {
  return (
    <div
      className="layers" role="img"
      aria-label="Layer-Modell: Konsumptionsschicht über Datenplattform über Hyperscaler-Stack über Substrat"
    >
      {LAYERS.map(([name, titles, cellsList]) => (
        <div className={`layer layer-${name.split('-')[0].toLowerCase()}`} key={name}>
          <div className="layer-label"><Inline md={name} /></div>
          <div className={`layer-cells n${cellsList.length}`}>
            {cellsList.map((c, k) => (
              <div className="lcell" key={k}>
                {titles ? <span className="lc-title"><Inline md={titles[k]} /></span> : null}
                <span className="lc-txt"><Inline md={c} /></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LayerModel({ content }) {
  const { layer } = content;
  return (
    <section id="layer" className="sec" aria-labelledby="h-layer">
      <div className="wrap">
        <p className="eyebrow">Kapitel 1</p>
        <h2 id="h-layer">Layer-Modell: was auf was läuft</h2>
        <LayerVisual />
        <Blocks blocks={layer.b11} paraCls="lead" />
        <h3>Was auf welcher Ebene entschieden wird</h3>
        <Table rows={layer.t13} minW={560} wrapCls="scrollable" />
      </div>
    </section>
  );
}
