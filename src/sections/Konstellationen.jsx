import React from 'react';
import Blocks from '../components/Blocks.jsx';
import Inline from '../components/Inline.jsx';

export default function Konstellationen({ content }) {
  const { konst } = content;
  return (
    <section id="konstellationen" className="sec sec-alt" aria-labelledby="h-konst">
      <div className="wrap">
        <p className="eyebrow">Kapitel 9</p>
        <h2 id="h-konst">Typische Konstellationen statt Gewinner</h2>
        <Blocks blocks={konst.intro} paraCls="lead" />
        <div className="konst-list">
          {konst.rows.slice(1).map((r, i) => (
            <article className="konst" key={i}>
              <div className="k-col k-start">
                <p className="k-lbl">Ausgangslage</p>
                <p><Inline md={r[0]} /></p>
              </div>
              <div className="k-col k-mid">
                <p className="k-lbl">Naheliegende Konstellation</p>
                <p><Inline md={r[1]} /></p>
              </div>
              <div className="k-col k-hook">
                <p className="k-lbl">Der Haken</p>
                <p><Inline md={r[2]} /></p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
