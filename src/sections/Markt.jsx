import React from 'react';
import Blocks from '../components/Blocks.jsx';
import Table from '../components/Table.jsx';

export default function Markt({ content }) {
  const { markt } = content;
  return (
    <section id="markt" className="sec sec-alt" aria-labelledby="h-markt">
      <div className="wrap">
        <p className="eyebrow">Kapitel 11</p>
        <h2 id="h-markt">Marktkontext (datiert)</h2>
        <Table rows={markt.rows} minW={760} wrapCls="scrollable" />
        <Blocks blocks={markt.blocks} />
      </div>
    </section>
  );
}
