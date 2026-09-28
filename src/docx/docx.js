/**
 * OOXML-Docx-Bauer — Port von makeDocx() aus work/quiz.py.
 * Keine Bibliothek: document.xml, styles.xml, numbering.xml, Kopf- und Fusszeile,
 * Beziehungen und Metadaten werden als Text erzeugt und mit dem eigenen ZIP-Schreiber
 * gepackt. Aufbau nach quiz-spec.md Abschnitt 7.
 */
import { Zip, b64ToBytes } from './zip.js';
import {
  CONSTELLATIONS, QUESTIONS, COSTS, STAND_TAG, FRAMING, PRICE_CLOSING, SCALE, METHOD_NOTES,
} from '../quiz/spec.js';
import { optionText } from '../quiz/engine.js';
import { dateCH, dateISO } from '../quiz/resultText.js';

const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
  + 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
  + 'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" '
  + 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
  + 'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
const XMLDECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

function X(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function run(text, o = {}) {
  const rpr = [];
  if (o.b) rpr.push('<w:b/>');
  if (o.i) rpr.push('<w:i/>');
  if (o.color) rpr.push(`<w:color w:val="${o.color}"/>`);
  if (o.sz) rpr.push(`<w:sz w:val="${o.sz}"/><w:szCs w:val="${o.sz}"/>`);
  if (o.caps) rpr.push('<w:caps/>');
  const pre = rpr.length ? `<w:rPr>${rpr.join('')}</w:rPr>` : '';
  return `<w:r>${pre}<w:t xml:space="preserve">${X(text)}</w:t></w:r>`;
}

function para(text, o = {}) {
  const ppr = [];
  if (o.style) ppr.push(`<w:pStyle w:val="${o.style}"/>`);
  if (o.pageBreak) ppr.push('<w:pageBreakBefore/>');
  if (o.align) ppr.push(`<w:jc w:val="${o.align}"/>`);
  if (o.bullet) ppr.push('<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>');
  if (o.spaceBefore || o.spaceAfter) {
    ppr.push(`<w:spacing w:before="${o.spaceBefore || 0}" w:after="${o.spaceAfter === undefined ? 120 : o.spaceAfter}"/>`);
  }
  if (o.shd) ppr.push(`<w:shd w:val="clear" w:color="auto" w:fill="${o.shd}"/>`);
  if (o.border) {
    ppr.push(`<w:pBdr><w:left w:val="single" w:sz="18" w:space="6" w:color="${o.border}"/></w:pBdr>`);
  }
  if (o.ind) ppr.push(`<w:ind w:left="${o.ind}"/>`);
  const pre = ppr.length ? `<w:pPr>${ppr.join('')}</w:pPr>` : '';
  const body = (o.runs !== undefined) ? o.runs : run(text, o);
  return `<w:p>${pre}${body}</w:p>`;
}

function cell(text, o = {}) {
  const w = o.w || 3000;
  const shd = o.fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${o.fill}"/>` : '';
  const inner = (o.paras !== undefined) ? o.paras
    : para(text, { b: o.b, color: o.color, sz: o.sz || 18, spaceAfter: 20 });
  return `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${shd}<w:vAlign w:val="top"/></w:tcPr>${inner}</w:tc>`;
}

function table(headers, rows, widths) {
  let total = 0;
  widths.forEach((x) => { total += x; });
  const grid = widths.map((x) => `<w:gridCol w:w="${x}"/>`).join('');
  const o = [`<w:tbl><w:tblPr><w:tblStyle w:val="HeydeTable"/><w:tblW w:w="${total}" w:type="dxa"/>`
    + '<w:tblLayout w:type="fixed"/><w:tblBorders>'
    + '<w:top w:val="single" w:sz="4" w:space="0" w:color="D3D4D7"/>'
    + '<w:left w:val="single" w:sz="4" w:space="0" w:color="D3D4D7"/>'
    + '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="D3D4D7"/>'
    + '<w:right w:val="single" w:sz="4" w:space="0" w:color="D3D4D7"/>'
    + '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="D3D4D7"/>'
    + '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="D3D4D7"/>'
    + `</w:tblBorders></w:tblPr><w:tblGrid>${grid}</w:tblGrid>`];
  o.push(`<w:tr><w:trPr><w:tblHeader/></w:trPr>${headers.map((hd, i) => (
    cell(hd, { w: widths[i], fill: '582F89', b: true, color: 'FFFFFF', sz: 18 })
  )).join('')}</w:tr>`);
  rows.forEach((rw, ri) => {
    const f = (ri % 2 === 1) ? 'F4F1F9' : null;
    o.push(`<w:tr>${rw.map((cv, i) => (
      cell(cv, { w: widths[i], fill: f, sz: 18, b: (i === 0) })
    )).join('')}</w:tr>`);
  });
  o.push(`</w:tbl>${para('', { spaceAfter: 120 })}`);
  return o.join('');
}

/**
 * Erzeugt die .docx-Bytes.
 * @param {Object} r        Ergebnis aus evaluate()
 * @param {Object} meta     { kunde, bearbeiter }
 * @param {Object} answers  Antwortprotokoll
 * @param {string} logoUrl  Data-URI des Heyde-Logos (optional)
 * @returns {{bytes: Uint8Array, filename: string}}
 */
export function buildDocx(r, meta, answers, logoUrl) {
  if (!r || !r.win) throw new Error('kein Auswertungsergebnis');
  const b64 = logoUrl && logoUrl.indexOf('base64,') >= 0 ? logoUrl.split('base64,')[1] : '';
  const png = b64 ? b64ToBytes(b64) : null;

  const body = [];

  /* ---------------- Deckblatt ---------------- */
  if (png) {
    body.push('<w:p><w:pPr><w:spacing w:after="360"/></w:pPr><w:r><w:drawing>'
      + '<wp:inline distT="0" distB="0" distL="0" distR="0">'
      + '<wp:extent cx="1828800" cy="569430"/>'
      + '<wp:effectExtent l="0" t="0" r="0" b="0"/>'
      + '<wp:docPr id="1" name="Heyde"/>'
      + '<wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/>'
      + '</wp:cNvGraphicFramePr><a:graphic>'
      + '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
      + '<pic:pic><pic:nvPicPr><pic:cNvPr id="1" name="heyde.png"/><pic:cNvPicPr/>'
      + '</pic:nvPicPr><pic:blipFill><a:blip r:embed="rId7"/><a:stretch><a:fillRect/>'
      + '</a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/>'
      + '<a:ext cx="1828800" cy="569430"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/>'
      + '</a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline>'
      + '</w:drawing></w:r></w:p>');
  }
  body.push(para('Entscheidungsvorlage Datenplattform', { style: 'Title' }));
  body.push(para('Ergebnis des Anforderungsprofils', { style: 'Subtitle' }));
  body.push(table(['Feld', 'Angabe'], [
    ['Kunde', meta.kunde || 'nicht angegeben'],
    ['Bearbeiter', meta.bearbeiter || 'nicht angegeben'],
    ['Erstellungsdatum', dateCH()],
    ['Empfehlung', `${r.win.id} — ${r.win.name}`],
  ], [2400, 6400]));
  body.push(para('Grundlage: Vergleich von Datenplattformen, Stand 20. August 2026',
    { i: true, color: '57595B', sz: 18 }));
  body.push(para('Heyde (Schweiz) AG · Fuchsiastrasse 10 · CH-8048 Zürich',
    { color: '57595B', sz: 18 }));

  /* ---------------- 1 Empfehlung ---------------- */
  body.push(para('1 Empfehlung', { style: 'Heading1', pageBreak: true }));
  body.push(para(`${r.win.id} — ${r.win.name}`, { style: 'Heading2' }));
  body.push(para(r.win.desc));
  body.push(para(FRAMING, { i: true, shd: 'F4F1F9', border: '582F89', ind: 120 }));
  if (r.partial) {
    body.push(para(`Teilauswertung: ${r.answered} von ${QUESTIONS.length} Fragen beantwortet. `
      + 'Unbeantwortete Fragen liefern keine Punkte und lösen keine Ausschlüsse aus.',
    { b: true, color: 'C25612' }));
  }
  body.push(para('Warum diese Konstellation', { style: 'Heading2' }));
  if (r.reasons.length) {
    r.reasons.forEach((x) => body.push(para(x.reason, { bullet: true })));
  } else {
    body.push(para('Keine der Punkte-Regeln hat für diese Konstellation einen '
      + 'Begründungssatz ausgelöst. Sie bleibt allein deshalb übrig, weil die harten '
      + 'Ausschlüsse alle anderen Konstellationen entfernt haben.'));
  }
  body.push(para('Punktestand der nicht ausgeschlossenen Konstellationen', { style: 'Heading2' }));
  body.push(table(['Konstellation', 'Punkte'],
    r.ranked.map((c) => [`${c.id} — ${c.name}`, String(r.scores[c.id])]), [6400, 2400]));
  if (r.tie.length) {
    body.push(para(`Gleichstand mit ${r.tie.map((c) => `${c.id} — ${c.name}`).join(', ')} bei `
      + `${r.scores[r.win.id]} Punkten. Die Empfehlung fällt nach Regel auf die niedrigere `
      + 'Konstellations-Nummer.', { b: true }));
  }

  /* ---------------- 2 Warnhinweise ---------------- */
  body.push(para('2 Warnhinweise und regulatorische Auflagen',
    { style: 'Heading1', pageBreak: true }));
  if (r.warns.length) {
    r.warns.forEach((w) => {
      body.push(para(w.id, { style: 'Heading3' }));
      if (w.head) body.push(para(w.head, { b: true, color: 'C25612' }));
      body.push(para(w.body));
    });
  } else {
    body.push(para('Für dieses Anforderungsprofil greift keiner der Warnhinweise W1 bis W5.'));
  }

  /* ---------------- 3 Ausgeschlossene Optionen ---------------- */
  body.push(para('3 Ausgeschlossene Optionen', { style: 'Heading1' }));
  const exRows = [];
  CONSTELLATIONS.forEach((c) => {
    if (!r.killed[c.id]) return;
    exRows.push([`${c.id} — ${c.name}`,
      r.killed[c.id].map((x) => `${x.id}: ${x.reason}`).join(' ')]);
  });
  if (exRows.length) body.push(table(['Konstellation', 'Grund'], exRows, [2900, 5900]));
  else body.push(para('Keine Konstellation wurde durch eine harte Ausschlussregel entfernt.'));

  /* ---------------- 4 Risiken ---------------- */
  body.push(para('4 Risiken der empfohlenen Konstellation',
    { style: 'Heading1', pageBreak: true }));
  body.push(para(r.win.risk));

  /* ---------------- 5 Kostenhinweise ---------------- */
  body.push(para('5 Kostenhinweise', { style: 'Heading1' }));
  body.push(para('Alle Beträge sind Listenpreise in USD, ohne MWST, ohne Rabatt. Quelle: '
    + 'Vergleich von Datenplattformen, Kapitel 3.2.', { i: true, sz: 18 }));
  (COSTS[r.win.id] || []).forEach((g) => {
    body.push(para(g.title, { style: 'Heading2' }));
    body.push(table(['Position', 'Preis', 'Region / Basis'],
      g.rows.map((row) => [row[0], row[1], `${row[2]} · ${STAND_TAG}`]), [2900, 2700, 3200]));
    g.notes.forEach((n) => body.push(para(n, { sz: 17, color: '57595B' })));
  });
  body.push(para(PRICE_CLOSING, { b: true, shd: 'F4F1F9', border: '582F89', ind: 120 }));

  /* ---------------- 6 Antwortprotokoll ---------------- */
  body.push(para('6 Antwortprotokoll', { style: 'Heading1' }));
  body.push(table(['Nr.', 'Frage', 'Gewählte Antwort'], QUESTIONS.map((q, i) => {
    const a = answers[q.id];
    return [String(i + 1), q.text, a ? optionText(q.id, a) : 'nicht beantwortet'];
  }), [700, 4900, 3200]));

  /* ---------------- 7 Prüfaufträge ---------------- */
  body.push(para('7 Prüfaufträge', { style: 'Heading1', pageBreak: true }));
  r.pruef.forEach((p) => {
    body.push(para('', {
      runs: run(`${p.n}. ${p.lead} `, { b: true })
        + run(p.rest)
        + (p.rel ? run(' — für dieses Profil besonders relevant', { b: true, color: '582F89' }) : ''),
    }));
  });

  /* ---------------- 8 Methodik ---------------- */
  body.push(para('8 Methodik und Transparenz', { style: 'Heading1', pageBreak: true }));
  body.push(para('Vierstufige Bewertungsskala des Vergleichs', { style: 'Heading2' }));
  body.push(table(['Stufe', 'Bedeutung'], SCALE.map((s) => [s.n, s.m]), [2400, 6400]));
  body.push(para('Hinweise', { style: 'Heading2' }));
  METHOD_NOTES.forEach((t) => body.push(para(t, { bullet: true })));

  const sectPr = '<w:sectPr><w:headerReference w:type="default" r:id="rId5"/>'
    + '<w:footerReference w:type="default" r:id="rId6"/>'
    + '<w:pgSz w:w="11906" w:h="16838"/>'
    + '<w:pgMar w:top="1418" w:right="1134" w:bottom="1134" w:left="1418" w:header="709" '
    + 'w:footer="709" w:gutter="0"/><w:cols w:space="708"/><w:docGrid w:linePitch="360"/>'
    + '</w:sectPr>';

  const documentXml = `${XMLDECL}<w:document ${NS}><w:body>${body.join('')}${sectPr}</w:body></w:document>`;

  const headerXml = `${XMLDECL}<w:hdr ${NS}>`
    + para('Entscheidungsvorlage Datenplattform · Heyde (Schweiz) AG',
      { align: 'right', color: '9B88BD', sz: 16 })
    + '</w:hdr>';

  const footerXml = `${XMLDECL}<w:ftr ${NS}><w:p><w:pPr>`
    + '<w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="D3D4D7"/></w:pBdr>'
    + '<w:tabs><w:tab w:val="right" w:pos="9354"/></w:tabs></w:pPr>'
    + run(`Heyde (Schweiz) AG · Entscheidungsvorlage Datenplattform · ${dateCH()}`,
      { color: '57595B', sz: 16 })
    + '<w:r><w:rPr><w:color w:val="57595B"/><w:sz w:val="16"/></w:rPr><w:tab/></w:r>'
    + '<w:r><w:rPr><w:color w:val="57595B"/><w:sz w:val="16"/></w:rPr>'
    + '<w:fldChar w:fldCharType="begin"/></w:r>'
    + '<w:r><w:rPr><w:color w:val="57595B"/><w:sz w:val="16"/></w:rPr>'
    + '<w:instrText xml:space="preserve">PAGE</w:instrText></w:r>'
    + '<w:r><w:rPr><w:color w:val="57595B"/><w:sz w:val="16"/></w:rPr>'
    + '<w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>';

  const stylesXml = `${XMLDECL}<w:styles ${NS}>`
    + '<w:docDefaults><w:rPrDefault><w:rPr>'
    + '<w:rFonts w:ascii="FS Joey" w:hAnsi="FS Joey" w:cs="FS Joey"/>'
    + '<w:color w:val="2B2C2E"/><w:sz w:val="20"/><w:szCs w:val="20"/>'
    + '<w:lang w:val="de-CH"/></w:rPr></w:rPrDefault>'
    + '<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/>'
    + '</w:pPr></w:pPrDefault></w:docDefaults>'
    + '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/>'
    + '<w:qFormat/></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/>'
    + '<w:basedOn w:val="Normal"/><w:qFormat/><w:pPr>'
    + '<w:spacing w:before="240" w:after="120"/></w:pPr><w:rPr><w:b/>'
    + '<w:color w:val="582F89"/><w:sz w:val="56"/><w:szCs w:val="56"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/>'
    + '<w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="360"/></w:pPr>'
    + '<w:rPr><w:color w:val="57595B"/><w:sz w:val="30"/><w:szCs w:val="30"/></w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/>'
    + '<w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>'
    + '<w:pPr><w:outlineLvl w:val="0"/><w:spacing w:before="360" w:after="160"/>'
    + '<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="9B88BD"/></w:pBdr>'
    + '</w:pPr><w:rPr><w:b/><w:color w:val="582F89"/><w:sz w:val="34"/><w:szCs w:val="34"/>'
    + '</w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/>'
    + '<w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>'
    + '<w:pPr><w:outlineLvl w:val="1"/><w:spacing w:before="280" w:after="120"/></w:pPr>'
    + '<w:rPr><w:b/><w:color w:val="41216A"/><w:sz w:val="26"/><w:szCs w:val="26"/>'
    + '</w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/>'
    + '<w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>'
    + '<w:pPr><w:outlineLvl w:val="2"/><w:spacing w:before="220" w:after="100"/></w:pPr>'
    + '<w:rPr><w:b/><w:color w:val="582F89"/><w:sz w:val="22"/><w:szCs w:val="22"/>'
    + '</w:rPr></w:style>'
    + '<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/>'
    + '<w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:ind w:left="360"/></w:pPr></w:style>'
    + '<w:style w:type="table" w:styleId="HeydeTable"><w:name w:val="Heyde Table"/>'
    + '<w:tblPr><w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="90" w:type="dxa"/>'
    + '<w:bottom w:w="60" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar>'
    + '</w:tblPr></w:style>'
    + '</w:styles>';

  const numberingXml = `${XMLDECL}<w:numbering ${NS}>`
    + '<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/>'
    + '<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/>'
    + '<w:lvlText w:val="&#8226;"/><w:lvlJc w:val="left"/>'
    + '<w:pPr><w:ind w:left="360" w:hanging="360"/></w:pPr>'
    + '<w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default"/>'
    + '<w:color w:val="582F89"/></w:rPr></w:lvl></w:abstractNum>'
    + '<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>';

  const contentTypes = `${XMLDECL}`
    + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    + '<Default Extension="rels" '
    + 'ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Default Extension="png" ContentType="image/png"/>'
    + '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-'
    + 'officedocument.wordprocessingml.document.main+xml"/>'
    + '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-'
    + 'officedocument.wordprocessingml.styles+xml"/>'
    + '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-'
    + 'officedocument.wordprocessingml.numbering+xml"/>'
    + '<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-'
    + 'officedocument.wordprocessingml.header+xml"/>'
    + '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-'
    + 'officedocument.wordprocessingml.footer+xml"/>'
    + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-'
    + 'package.core-properties+xml"/>'
    + '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-'
    + 'officedocument.extended-properties+xml"/>'
    + '</Types>';

  const rootRels = `${XMLDECL}`
    + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
    + 'relationships/officeDocument" Target="word/document.xml"/>'
    + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/'
    + 'relationships/metadata/core-properties" Target="docProps/core.xml"/>'
    + '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
    + 'relationships/extended-properties" Target="docProps/app.xml"/>'
    + '</Relationships>';

  const docRels = `${XMLDECL}`
    + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
    + '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
    + 'relationships/styles" Target="styles.xml"/>'
    + '<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
    + 'relationships/numbering" Target="numbering.xml"/>'
    + '<Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
    + 'relationships/header" Target="header1.xml"/>'
    + '<Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/'
    + 'relationships/footer" Target="footer1.xml"/>'
    + (png ? '<Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/'
      + '2006/relationships/image" Target="media/heyde.png"/>' : '')
    + '</Relationships>';

  const d = new Date();
  const p2 = (n) => (n < 10 ? '0' : '') + n;
  const iso = `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`
    + `T${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())}Z`;

  const coreXml = `${XMLDECL}`
    + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/'
    + 'metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" '
    + 'xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
    + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
    + '<dc:title>Entscheidungsvorlage Datenplattform</dc:title>'
    + '<dc:subject>Ergebnis des Anforderungsprofils</dc:subject>'
    + `<dc:creator>${X(meta.bearbeiter || 'Heyde (Schweiz) AG')}</dc:creator>`
    + `<cp:lastModifiedBy>${X(meta.bearbeiter || 'Heyde (Schweiz) AG')}</cp:lastModifiedBy>`
    + `<cp:keywords>${X(meta.kunde || '')}</cp:keywords>`
    + `<dcterms:created xsi:type="dcterms:W3CDTF">${iso}</dcterms:created>`
    + `<dcterms:modified xsi:type="dcterms:W3CDTF">${iso}</dcterms:modified>`
    + '</cp:coreProperties>';

  const appXml = `${XMLDECL}`
    + '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/'
    + 'extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/'
    + 'docPropsVTypes"><Application>Heyde Entscheidungs-Quiz</Application>'
    + '<Company>Heyde (Schweiz) AG</Company><Pages>6</Pages>'
    + '<DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop>'
    + '<LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc>'
    + '<HyperlinksChanged>false</HyperlinksChanged><AppVersion>16.0000</AppVersion>'
    + '</Properties>';

  const z = new Zip();
  z.add('[Content_Types].xml', contentTypes);
  z.add('_rels/.rels', rootRels);
  z.add('docProps/core.xml', coreXml);
  z.add('docProps/app.xml', appXml);
  z.add('word/document.xml', documentXml);
  z.add('word/styles.xml', stylesXml);
  z.add('word/numbering.xml', numberingXml);
  z.add('word/header1.xml', headerXml);
  z.add('word/footer1.xml', footerXml);
  z.add('word/_rels/document.xml.rels', docRels);
  if (png) z.add('word/media/heyde.png', png);

  const slug = (meta.kunde || '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  const filename = `Entscheidungsvorlage-Datenplattform${slug ? `_${slug}` : ''}_${dateISO()}.docx`;
  return { bytes: z.build(), filename };
}

/** Regulaerer Download ueber Blob und a.download — kein Sandbox-Fallback. */
export function downloadDocx(r, meta, answers, logoUrl) {
  const { bytes, filename } = buildDocx(r, meta, answers, logoUrl);
  const blob = new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.style.position = 'fixed';
  a.style.left = '-9999px';
  document.body.appendChild(a);
  a.click();
  window.setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 4000);
  return filename;
}
