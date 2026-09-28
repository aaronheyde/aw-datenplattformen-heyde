/**
 * Inline-Markdown als React-Knoten: `code`, **fett**, *kursiv*.
 * Ersetzt die Funktion inline() aus work/parse.py — ohne HTML-Injektion,
 * daher kein dangerouslySetInnerHTML im gesamten Projekt.
 */
import React from 'react';

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|(?<!\w)\*[^*]+\*(?!\w))/g;

/**
 * Wie inline() aus parse.py wendet der Parser Code, Fett und Kursiv verschachtelt an:
 * dort geschah das durch drei aufeinanderfolgende Ersetzungen, hier durch Rekursion in
 * den Inhalt von Fett und Kursiv. Code bleibt woertlich.
 */
export function inlineNodes(md, depth = 0) {
  const src = md === undefined || md === null ? '' : String(md);
  const parts = src.split(TOKEN);
  const out = [];
  parts.forEach((part, i) => {
    if (!part) return;
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      out.push(<code key={i}>{part.slice(1, -1)}</code>);
    } else if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      out.push(<strong key={i}>{depth < 3 ? inlineNodes(inner, depth + 1) : inner}</strong>);
    } else if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      const inner = part.slice(1, -1);
      out.push(<em key={i}>{depth < 3 ? inlineNodes(inner, depth + 1) : inner}</em>);
    } else {
      out.push(part);
    }
  });
  return out;
}

export default function Inline({ md }) {
  return <>{inlineNodes(md)}</>;
}

/** Markdown-Auszeichnung entfernen — Port von strip_md() aus work/build.py. */
export function stripMd(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '$1')
    .trim();
}
