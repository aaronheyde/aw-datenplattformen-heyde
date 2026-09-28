/**
 * Minimaler ZIP-Schreiber (Speichermethode, ohne Kompression) — Port aus work/quiz.py.
 * Bewusst ohne Bibliothek: ein .docx ist ein ZIP mit gespeicherten Einträgen, und
 * Word liest unkomprimierte Einträge ohne Einschränkung.
 */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i += 1) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

export function utf8(str) {
  const out = [];
  for (let i = 0; i < str.length; i += 1) {
    const c = str.charCodeAt(i);
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xC0 | (c >> 6), 0x80 | (c & 63));
    else if (c >= 0xD800 && c <= 0xDBFF) {
      i += 1;
      const c2 = str.charCodeAt(i);
      const cp = 0x10000 + ((c - 0xD800) << 10) + (c2 - 0xDC00);
      out.push(0xF0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63),
        0x80 | (cp & 63));
    } else out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return new Uint8Array(out);
}

export function b64ToBytes(b64raw) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const b64 = b64raw.replace(/[^A-Za-z0-9+/=]/g, '');
  const pad = (b64.match(/=+$/) || [''])[0].length;
  const len = (b64.length / 4) * 3 - pad;
  const out = new Uint8Array(len);
  let p = 0;
  for (let i = 0; i < b64.length; i += 4) {
    const a = chars.indexOf(b64.charAt(i));
    const b = chars.indexOf(b64.charAt(i + 1));
    const c = chars.indexOf(b64.charAt(i + 2));
    const d = chars.indexOf(b64.charAt(i + 3));
    const n = (a << 18) | (b << 12) | ((c < 0 ? 0 : c) << 6) | (d < 0 ? 0 : d);
    if (p < len) { out[p] = (n >> 16) & 255; p += 1; }
    if (p < len) { out[p] = (n >> 8) & 255; p += 1; }
    if (p < len) { out[p] = n & 255; p += 1; }
  }
  return out;
}

export class Zip {
  constructor() {
    this.files = [];
  }

  add(name, data) {
    this.files.push({ name, data: (data instanceof Uint8Array) ? data : utf8(data) });
  }

  build(now = new Date()) {
    const parts = [];
    const central = [];
    let offset = 0;
    const dosTime = ((now.getHours() & 31) << 11) | ((now.getMinutes() & 63) << 5)
      | ((now.getSeconds() >> 1) & 31);
    const dosDate = (((now.getFullYear() - 1980) & 127) << 9)
      | (((now.getMonth() + 1) & 15) << 5) | (now.getDate() & 31);
    const u16 = (v) => [v & 255, (v >> 8) & 255];
    const u32 = (v) => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];

    this.files.forEach((f) => {
      const nameB = utf8(f.name);
      const crc = crc32(f.data);
      const size = f.data.length;
      const lh = [].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(dosTime),
        u16(dosDate), u32(crc), u32(size), u32(size), u16(nameB.length), u16(0));
      parts.push(new Uint8Array(lh), nameB, f.data);
      central.push({ name: nameB, crc, size, off: offset });
      offset += lh.length + nameB.length + size;
    });

    const cdStart = offset;
    const cdParts = [];
    central.forEach((c) => {
      const ch = [].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(dosTime),
        u16(dosDate), u32(c.crc), u32(c.size), u32(c.size), u16(c.name.length), u16(0), u16(0),
        u16(0), u16(0), u32(0), u32(c.off));
      cdParts.push(new Uint8Array(ch), c.name);
      offset += ch.length + c.name.length;
    });
    const cdSize = offset - cdStart;
    const eocd = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0),
      u16(central.length), u16(central.length), u32(cdSize), u32(cdStart), u16(0)));

    const all = parts.concat(cdParts, [eocd]);
    let total = 0;
    all.forEach((p) => { total += p.length; });
    const buf = new Uint8Array(total);
    let pos = 0;
    all.forEach((p) => { buf.set(p, pos); pos += p.length; });
    return buf;
  }
}
