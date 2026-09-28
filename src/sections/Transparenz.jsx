import React from 'react';
import Blocks from '../components/Blocks.jsx';
import Table from '../components/Table.jsx';

export default function Transparenz({ content }) {
  const { transparenz } = content;
  return (
    <section id="transparenz" className="sec sec-dark" aria-labelledby="h-tr">
      <div className="wrap">
        <p className="eyebrow eyebrow-light">Kapitel 13</p>
        <h2 id="h-tr">Transparenz: was nicht verifizierbar war</h2>
        <Blocks blocks={transparenz.blocks} paraCls="lead" />
        <Table rows={transparenz.rows} cls="tbl-dark" minW={760} wrapCls="scrollable" />
      </div>
    </section>
  );
}
