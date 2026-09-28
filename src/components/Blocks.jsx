/** Block-Renderer — Port von render_blocks() aus work/build.py. */
import React from 'react';
import Inline, { stripMd } from './Inline.jsx';
import Table from './Table.jsx';

function paraClass(text, base) {
  const plain = stripMd(text);
  if (plain.startsWith('Nicht öffentlich verifizierbar')) {
    return `${base} callout callout-warn`.trim();
  }
  if (text.startsWith('*Quelle') || text.startsWith('*Quellen') || text.startsWith('*Monatsbeträge')) {
    return `${base} srcnote`.trim();
  }
  return base;
}

export default function Blocks({ blocks, paraCls = '' }) {
  if (!blocks) return null;
  return (
    <>
      {blocks.map((b, i) => {
        if (b.kind === 'p') {
          const cls = paraClass(b.text, paraCls);
          return <p key={i} className={cls || undefined}><Inline md={b.text} /></p>;
        }
        if (b.kind === 'ul') {
          return (
            <ul key={i}>
              {b.items.map((it, k) => <li key={k}><Inline md={it} /></li>)}
            </ul>
          );
        }
        if (b.kind === 'ol') {
          return (
            <ol key={i}>
              {b.items.map((it, k) => <li key={k}><Inline md={it} /></li>)}
            </ol>
          );
        }
        if (b.kind === 'table') {
          return (
            <Table
              key={i}
              rows={b.rows}
              minW={b.rows[0].length <= 3 ? 560 : 980}
              wrapCls="scrollable"
            />
          );
        }
        if (b.kind === 'pre') return <pre key={i}>{b.text}</pre>;
        return null;
      })}
    </>
  );
}
