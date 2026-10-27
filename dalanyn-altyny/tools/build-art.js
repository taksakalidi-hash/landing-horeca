#!/usr/bin/env node
/*
  Pre-renders the site's drawn artwork into static files, so pictures show
  immediately — without waiting for JavaScript or web fonts.

    • assets/img/art/pack-jerky.svg, pack-tushenka.svg, pack-kolbasa.svg
    • assets/img/art/jerky-01…12.svg, compare-jerky.svg
    • the sausage slicer markup and the Instagram grid, injected into index.html
      between <!--@slicer-->…<!--/@slicer--> and <!--@insta-->…<!--/@insta-->

  Pack labels are converted to outlines, so the SVGs need no fonts.

  Usage:  npm i opentype.js@1.3.4
          node tools/build-art.js /path/to/fonts   (Montserrat-600/800 .ttf named mont-600.ttf, mont-800.ttf)
*/
'use strict';
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const ROOT = path.join(__dirname, '..');
const ART = path.join(ROOT, 'assets/img/art');
const FONTS = process.argv[2] || path.join(__dirname, 'fonts');
const font = {
  600: opentype.loadSync(path.join(FONTS, 'mont-600.ttf')),
  800: opentype.loadSync(path.join(FONTS, 'mont-800.ttf')),
};
const LOGO = JSON.parse(fs.readFileSync(path.join(__dirname, 'logo-paths.json'), 'utf8'));
const EMBLEM = LOGO.emblem, WORD = LOGO.word;

/* ---------- helpers ---------- */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f1 = (n) => n.toFixed(1);
function smooth(pts) {
  const n = pts.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m = mid(pts[n - 1], pts[0]);
  let d = `M${f1(m[0])} ${f1(m[1])}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = mid(p, pts[(i + 1) % n]);
    d += `Q${f1(p[0])} ${f1(p[1])} ${f1(q[0])} ${f1(q[1])}`;
  }
  return d + 'Z';
}
// Text → outline path, centred on x, with tracking in px.
function textPath(str, { weight = 800, size, x, y, tracking = 0 }) {
  const f = font[weight], scale = size / f.unitsPerEm;
  const glyphs = f.stringToGlyphs(str);
  let width = 0;
  glyphs.forEach((g, i) => {
    width += g.advanceWidth * scale + (i < glyphs.length - 1 ? tracking + f.getKerningValue(g, glyphs[i + 1]) * scale : 0);
  });
  let cx = x - width / 2, d = '';
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, y, size).toPathData(1);
    cx += g.advanceWidth * scale + tracking + (i < glyphs.length - 1 ? f.getKerningValue(g, glyphs[i + 1]) * scale : 0);
  });
  return d;
}
const GOLD = '<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7e1a6"/><stop offset=".35" stop-color="#e0b25c"/><stop offset=".7" stop-color="#b07c30"/><stop offset="1" stop-color="#f0cf86"/></linearGradient>';
const logoSymbols = `<symbol id="emblem" viewBox="0 0 ${EMBLEM.vb.join(' ')}"><path fill-rule="evenodd" d="${EMBLEM.paths.join('')}"/></symbol>` +
  `<symbol id="wordmark" viewBox="0 0 ${WORD.vb.join(' ')}"><path fill-rule="evenodd" d="${WORD.paths.join('')}"/></symbol>`;
let uid = 0;
// Real product photos for the pack windows (tools/windows/*.jpg), embedded so the SVG stays self-contained.
function photo(name, x, y, w, h) {
  const f = path.join(__dirname, 'windows', `${name}.jpg`);
  if (!fs.existsSync(f)) return '';
  return `<image href="data:image/jpeg;base64,${fs.readFileSync(f).toString('base64')}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`;
}

/* ---------- artwork ---------- */
// Torn sheet of dried meat; returns inner markup for a 200×100 box.
// `lite` drops detail nobody sees at pack-window size.
function jerkyInner(seed, lite = false) {
  const r = rng(seed * 7919 + 13), id = 'j' + (++uid);
  const cx = 100, cy = 50;
  const len = 66 + r() * 22, wid = 18 + r() * 15, skew = (r() - 0.5) * 0.6, bend = (r() - 0.5) * 12;
  const k = 6 + Math.floor(r() * 3), anchors = [];
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2 + (r() - 0.5) * 0.55;
    anchors.push([Math.cos(a) * len * (0.78 + r() * 0.34), Math.sin(a) * wid * (0.75 + r() * 0.5)]);
  }
  const pts = [];
  for (let i = 0; i < k; i++) {
    const p = anchors[i], q = anchors[(i + 1) % k], steps = 5 + Math.floor(r() * 4);
    const nx = -(q[1] - p[1]), ny = q[0] - p[0], nl = Math.hypot(nx, ny) || 1;
    for (let j = 0; j < steps; j++) {
      const t = j / steps, tear = j ? (r() - 0.5) * 2 * (1.5 + r() * 4.5) : 0;
      let x = p[0] + (q[0] - p[0]) * t + (nx / nl) * tear;
      let y = p[1] + (q[1] - p[1]) * t + (ny / nl) * tear;
      y += x * skew * 0.3 + bend * (1 - Math.min(1, (x / len) ** 2));
      pts.push([cx + x, cy + y]);
    }
  }
  const d = smooth(pts);
  const base = [['#5a190e', '#2a0804'], ['#4c140b', '#220603'], ['#62200f', '#300a05']][Math.floor(r() * 3)];
  let glow = '';
  for (let g = 0; g < (lite ? 2 : 3); g++) {
    glow += `<ellipse cx="${f1(cx + (r() - 0.5) * len * 1.2)}" cy="${f1(cy + (r() - 0.5) * wid * 0.9)}" rx="${f1(18 + r() * 30)}" ry="${f1(7 + r() * 10)}" transform="rotate(${Math.round((r() - 0.5) * 30)} 100 50)" fill="url(#${id}h)" opacity="${(0.45 + r() * 0.45).toFixed(2)}"/>`;
  }
  let fibers = '';
  const nf = lite ? 6 : 13;
  for (let f = 0; f < nf; f++) {
    const yy = cy - wid * 1.1 + ((f + 0.5) / nf) * wid * 2.2 + (r() - 0.5) * 3;
    fibers += `<path d="M${f1(cx - len * 1.2)} ${f1(yy - len * skew * 0.36)}Q${cx} ${f1(yy + bend + (r() - 0.5) * 6)} ${f1(cx + len * 1.2)} ${f1(yy + len * skew * 0.36 + (r() - 0.5) * 6)}" stroke="${r() < 0.55 ? '#1a0402' : '#a9533a'}" stroke-opacity="${(0.08 + r() * 0.18).toFixed(2)}" stroke-width="${(0.5 + r() * 1.3).toFixed(1)}" fill="none"/>`;
  }
  let specks = '';
  for (let s = 0; s < (lite ? 8 : 22); s++) {
    specks += `<circle cx="${f1(cx + (r() * 2 - 1) * len * 0.85)}" cy="${f1(cy + (r() * 2 - 1) * wid * 0.75)}" r="${(0.45 + r() * 1.2).toFixed(1)}" fill="${r() < 0.7 ? '#100201' : '#d08a4a'}" fill-opacity="${(0.45 + r() * 0.45).toFixed(2)}"/>`;
  }
  return `<defs><linearGradient id="${id}g" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="${base[0]}"/><stop offset="1" stop-color="${base[1]}"/></linearGradient>` +
    `<radialGradient id="${id}h"><stop offset="0" stop-color="#b8492c" stop-opacity=".8"/><stop offset="1" stop-color="#b8492c" stop-opacity="0"/></radialGradient>` +
    `<clipPath id="${id}c"><path d="${d}"/></clipPath></defs>` +
    `<path d="${d}" fill="url(#${id}g)"/><g clip-path="url(#${id}c)">${glow}${fibers}${specks}` +
    `<path d="${d}" fill="none" stroke="#c0603e" stroke-opacity=".24" stroke-width="5"/>` +
    `<path d="${d}" fill="none" stroke="#fff3e0" stroke-opacity=".07" stroke-width="3" transform="translate(1 -2.5)"/></g>` +
    `<path d="${d}" fill="none" stroke="#1a0402" stroke-opacity=".5" stroke-width=".8"/>`;
}
const jerkyAt = (seed, x, y, w, h, rot = 0, lite = false) =>
  `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 200 100" overflow="visible">${jerkyInner(seed, lite)}</svg></g>`;

function chunkAt(seed, x, y, s) {
  const r = rng(seed * 104729 + 3), id = 'c' + (++uid);
  const rx = 30 + r() * 12, ry = 24 + r() * 10, pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, k = 1 + (r() - 0.5) * 0.3;
    pts.push([50 + Math.cos(a) * rx * k, 50 + Math.sin(a) * ry * k]);
  }
  const d = smooth(pts);
  let fib = '';
  for (let k = 0; k < 4; k++) fib += `<path d="M${f1(20 + r() * 10)} ${30 + k * 12}q30 ${f1((r() - 0.5) * 10)} 60 ${f1((r() - 0.5) * 8)}" stroke="#2c0f05" stroke-opacity=".35" fill="none"/>`;
  return `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 100 100"><defs><radialGradient id="${id}" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#b8693f"/><stop offset=".5" stop-color="#7a391d"/><stop offset="1" stop-color="#3a170a"/></radialGradient><clipPath id="${id}c"><path d="${d}"/></clipPath></defs>` +
    `<path d="${d}" fill="url(#${id})"/><g clip-path="url(#${id}c)">${fib}</g><path d="${d}" fill="none" stroke="#2a0f05" stroke-opacity=".5"/>` +
    `<ellipse cx="${f1(38 + r() * 8)}" cy="${f1(36 + r() * 6)}" rx="${f1(7 + r() * 6)}" ry="${f1(3 + r() * 3)}" fill="#ffe2c0" opacity=".3"/></svg>`;
}

function pack(kind) {
  const isJ = kind === 'jerky';
  const body = 'M20 8H280Q290 8 290 18V392Q290 422 260 422H40Q10 422 10 392V18Q10 8 20 8Z';
  const win = 'M64 212C64 192 80 182 102 182H234Q248 182 248 196V318Q248 334 232 334H82Q64 334 64 316Z';
  let inside = '';
  if (isJ) {
    [[30, 168, -18], [118, 160, 14], [168, 204, -8], [40, 226, 24], [122, 238, -16], [176, 270, 10], [52, 280, -6], [136, 296, 18]]
      .forEach(([x, y, a], k) => { inside += jerkyAt(k * 3 + 5, x, y, 140, 70, a, true); });
  } else {
    [[54, 172], [112, 166], [172, 176], [44, 222], [100, 218], [158, 226], [204, 210], [64, 272], [124, 278], [186, 270]]
      .forEach(([x, y], k) => { inside += chunkAt(k * 5 + 2, x - 8, y - 8, 72); });
  }
  const real = photo(isJ ? 'jerky' : 'tushenka', 62, 180, 188, 156);
  if (real) inside = real;
  const label = isJ
    ? ['ЖЫЛҚЫ ЕТІНЕН', 'ЖАСАЛҒАН ДЖЕРКИ', 'ДЖЕРКИ ИЗ КОНИНЫ']
    : ['ЖЫЛҚЫ ЕТІНЕН', 'ЖАСАЛҒАН БҰҚТЫРМА', 'ТУШЁНКА ИЗ КОНИНЫ'];
  const text = textPath(label[0], { size: 15, x: 150, y: 362, tracking: 1.5 }) + textPath(label[1], { size: 15, x: 150, y: 381, tracking: 1.5 });
  const small = textPath(label[2], { weight: 600, size: 10.5, x: 150, y: 403, tracking: 2.4 });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 430" width="300" height="430"><defs>${GOLD}${logoSymbols}` +
    '<linearGradient id="b" x1="0" x2="1"><stop offset="0" stop-color="#090807"/><stop offset=".14" stop-color="#221d19"/><stop offset=".5" stop-color="#131110"/><stop offset=".86" stop-color="#1d1915"/><stop offset="1" stop-color="#080706"/></linearGradient>' +
    '<linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".05"/><stop offset=".15" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>' +
    '<linearGradient id="r" x1="0" y1="0" x2="1" y2="1"><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".13"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#fff" stop-opacity=".06"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    '<pattern id="k" width="4" height="30" patternUnits="userSpaceOnUse"><rect width="1.4" height="30" fill="#fff" fill-opacity=".07"/></pattern>' +
    `<clipPath id="w"><path d="${win}"/></clipPath></defs>` +
    `<path d="${body}" fill="url(#b)"/><path d="${body}" fill="url(#v)"/>` +
    '<rect x="10" y="8" width="280" height="30" fill="url(#k)"/>' +
    '<path d="M10 38H290" stroke="#000" stroke-opacity=".6"/><path d="M10 39.5H290" stroke="#fff" stroke-opacity=".05"/>' +
    '<rect x="126" y="16" width="48" height="11" rx="5.5" fill="#030202" stroke="#fff" stroke-opacity=".08"/>' +
    '<use href="#emblem" x="113" y="48" width="74" height="74" fill="url(#gold)"/>' +
    '<use href="#wordmark" x="106" y="128" width="88" height="41" fill="url(#gold)"/>' +
    `<g clip-path="url(#w)"><rect x="60" y="180" width="200" height="160" fill="${isJ ? '#1c0805' : '#2a1309'}"/>${inside}` +
    `<path d="${win}" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="14"/>` +
    '<path d="M92 182L64 262V182zM156 182h40L104 334H64z" fill="#fff" fill-opacity=".06"/></g>' +
    `<path d="${win}" fill="none" stroke="url(#gold)" stroke-width="2.4"/>` +
    `<path d="${text}" fill="url(#gold)"/><path d="${small}" fill="url(#gold)" fill-opacity=".85"/>` +
    `<path d="${body}" fill="url(#r)"/></svg>`;
}

function box() {
  const r = rng(4242);
  let specks = '';
  for (let k = 0; k < 46; k++) {
    const x = 38 + r() * 60, y = 146 + r() * 182;
    specks += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(1.4 + r() * 4)}" ry="${f1(1 + r() * 2.4)}" transform="rotate(${Math.round(r() * 180)} ${f1(x)} ${f1(y)})" fill="${r() < 0.72 ? '#f3dccb' : '#4a0f0a'}" fill-opacity="${(0.55 + r() * 0.4).toFixed(2)}"/>`;
  }
  const t = textPath('Қазақстанда жасалған', { weight: 600, size: 7, x: 69, y: 352, tracking: 0.6 }) +
    textPath('ЖЫЛҚЫ', { size: 12.5, x: 69, y: 372, tracking: 0.6 }) +
    textPath('ШҰЖЫҒЫ', { size: 12.5, x: 69, y: 387, tracking: 0.6 }) +
    textPath('КОНСКАЯ КОЛБАСА', { size: 8.4, x: 69, y: 403, tracking: 0.8 });
  const small = textPath('Сделано в Казахстане', { weight: 600, size: 6.4, x: 69, y: 415, tracking: 0.6 });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 430" width="150" height="430"><defs>${GOLD}${logoSymbols}` +
    '<linearGradient id="f" x1="0" x2="1"><stop offset="0" stop-color="#0b0a09"/><stop offset=".2" stop-color="#211b18"/><stop offset=".6" stop-color="#141211"/><stop offset="1" stop-color="#0c0b0a"/></linearGradient>' +
    '<linearGradient id="s" x1="0" x2="1"><stop offset="0" stop-color="#4f130e"/><stop offset=".35" stop-color="#9c3a30"/><stop offset=".55" stop-color="#7d261d"/><stop offset="1" stop-color="#360b07"/></linearGradient>' +
    '<clipPath id="w"><rect x="38" y="144" width="60" height="186" rx="30"/></clipPath></defs>' +
    '<path d="M8 12L22 4H144L130 12Z" fill="#2b2622"/><path d="M130 12L144 4V422L130 430Z" fill="#060505"/>' +
    '<rect x="8" y="12" width="122" height="418" fill="url(#f)"/>' +
    '<rect x="51" y="22" width="36" height="9" rx="4.5" fill="#020202" stroke="#fff" stroke-opacity=".08"/>' +
    '<use href="#emblem" x="41" y="42" width="56" height="56" fill="url(#gold)"/>' +
    '<use href="#wordmark" x="37" y="102" width="64" height="30" fill="url(#gold)"/>' +
    `<g clip-path="url(#w)">${photo('kolbasa', 38, 144, 60, 186) || `<rect x="38" y="144" width="60" height="186" fill="url(#s)"/>${specks}`}` +
    '<rect x="38" y="144" width="60" height="186" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="10"/><path d="M56 144h7v186h-7z" fill="#fff" fill-opacity=".1"/></g>' +
    '<rect x="38" y="144" width="60" height="186" rx="30" fill="none" stroke="url(#gold)" stroke-width="2"/>' +
    `<path d="${t}" fill="url(#gold)"/><path d="${small}" fill="url(#gold)" fill-opacity=".8"/></svg>`;
}

function blob(x, y, s, r) {
  const pts = [];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2, k = s * (0.7 + r() * 0.6);
    pts.push([x + Math.cos(a) * k, y + Math.sin(a) * k * 0.8]);
  }
  return smooth(pts);
}

// Horizontal horse sausage in segments; each segment carries its cut face on the right (animated by main.js).
function slicer() {
  const N = 8, X0 = 150, X1 = 1050, CY = 150, R = 72, s = (X1 - X0) / N, ar = 30, r = rng(77);
  let segs = '';
  for (let i = 0; i < N; i++) {
    const xa = X0 + i * s, xb = xa + s;
    const leftArc = `A${i === 0 ? 26 : ar} ${R} 0 0 1 ${xa} ${CY - R}`;
    const d = i === N - 1
      ? `M${xa} ${CY - R}H${xb}A26 ${R} 0 0 1 ${xb} ${CY + R}H${xa}${leftArc}Z`
      : `M${xa} ${CY - R}H${xb + 1}V${CY + R}H${xa}${leftArc}Z`;
    let marb = '';
    for (let k = 0; k < 18; k++) {
      marb += `<ellipse cx="${f1(xa + 6 + r() * (s - 12))}" cy="${f1(CY - R * 0.78 + r() * R * 1.56)}" rx="${f1(1.5 + r() * 4)}" ry="${f1(1 + r() * 2.2)}" fill="#f0d0c0" fill-opacity="${(0.12 + r() * 0.26).toFixed(2)}"/>`;
    }
    if (i === 0) marb += `<path d="M${X0 - 22} ${CY}c-14-6-26-2-34 10M${X0 - 22} ${CY}c-12 8-14 20-6 30" stroke="#c9a46a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (i === N - 1) marb += `<path d="M${X1 + 22} ${CY}c14-6 26-2 34 10M${X1 + 22} ${CY}c12 8 14 20 6 30" stroke="#c9a46a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    let face = '';
    if (i < N - 1) {
      let fat = '';
      for (let k = 0; k < 24; k++) {
        const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * (R - 14);
        fat += `<path d="${blob(Math.cos(a) * rr, Math.sin(a) * rr, 2 + r() * 6.5, r)}" fill="#f4e0d2" fill-opacity="${(0.75 + r() * 0.25).toFixed(2)}"/>`;
      }
      for (let k = 0; k < 12; k++) {
        const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * (R - 14);
        fat += `<circle cx="${f1(Math.cos(a) * rr)}" cy="${f1(Math.sin(a) * rr)}" r="${f1(1.5 + r() * 3)}" fill="#5a1410" fill-opacity=".55"/>`;
      }
      face = `<g transform="translate(${xb} ${CY})"><g class="sl-face"><circle r="${R}" fill="url(#slF)"/>${fat}<circle r="${R - 3}" fill="none" stroke="#2a0806" stroke-width="6"/></g></g>`;
    }
    segs += `<g class="sl-seg" data-cx="${xa + s / 2}"><path d="${d}" fill="url(#slC)"/>${marb}` +
      `<path d="M${xa + 4} ${CY - R * 0.48}H${xb - (i === N - 1 ? 20 : 0)}" stroke="#fff" stroke-opacity=".13" stroke-width="5" stroke-linecap="round"/>${face}</g>`;
  }
  const cuts = Array.from({ length: N - 1 }, (_, i) => `<line class="sl-cut" x1="${X0 + (i + 1) * s}" y1="${CY - R - 4}" x2="${X0 + (i + 1) * s}" y2="${CY + R + 4}" stroke="#ffe6b0" stroke-width="1.5" opacity="0"/>`).join('');
  return `<svg viewBox="0 0 1200 320" role="img" aria-label="Конская колбаса, нарезанная на кусочки"><defs>` +
    '<linearGradient id="slC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22070a"/><stop offset=".22" stop-color="#5e1a14"/><stop offset=".4" stop-color="#9b3b31"/><stop offset=".55" stop-color="#7a241b"/><stop offset=".85" stop-color="#3a0c08"/><stop offset="1" stop-color="#1a0504"/></linearGradient>' +
    '<radialGradient id="slF" cx=".45" cy=".42" r=".62"><stop offset="0" stop-color="#c4564a"/><stop offset=".7" stop-color="#93302a"/><stop offset="1" stop-color="#6a1a15"/></radialGradient>' +
    '<radialGradient id="slS"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>' +
    `<ellipse cx="600" cy="${CY + R + 46}" rx="480" ry="18" fill="url(#slS)"/>` +
    `<g class="sl-all">${segs}${cuts}</g>` +
    `<g class="sl-knife" opacity="0"><rect x="-5" y="${CY - R - 40}" width="10" height="${2 * R + 80}" rx="5" fill="#ffe6b0" opacity=".25"/><rect x="-.8" y="${CY - R - 40}" width="1.6" height="${2 * R + 80}" fill="#fff8e6"/></g></svg>`;
}

const FEED = [
  ['01-pinned-jerky', 'Джерки из конины', 'pin'],
  ['02-kolbasa-post', 'Конская колбаса — традиционный вкус в современном формате', 'set'],
  ['03-znaete', 'Знаете ли вы? История, традиции и вкус конины', 'set'],
  ['04-collage', 'Удобный перекус и натуральный состав', ''],
  ['05-jerky-carousel', 'Джерки из конины. Медленная сушка', 'set'],
  ['06-ryadom', 'Мы теперь в приложении «Рядом»', ''],
  ['07-upakovka', 'Всё начинается с упаковки', 'reel'],
  ['08-family', 'Всё началось с семьи', 'reel'],
  ['09-udobno', 'Конина, которую удобно взять с собой', 'reel'],
  ['10-novinka', 'Следующая новинка — выбираете вы', 'reel'],
  ['11-plate', 'Джерки для любого момента', 'reel'],
  ['12-natural-vkus', 'Натуральный вкус. Настоящая конина', 'reel'],
  ['13-priznanie', 'Признание профессионалов', 'reel'],
  ['14-rojo', 'Dalanyn Altyny в барах Алматы', 'reel'],
  ['15-nastoyashiy', 'Настоящий вкус конины', 'reel'],
  ['16-kolbasa-reel', 'Колбаса из конины', 'reel'],
  ['17-odin-kusochek', 'Один кусочек — и всё понятно', 'reel'],
  ['18-tushenka', 'Тушёнка из конины', 'reel'],
  ['19-jerky-tekstura', 'Плотная текстура и настоящий мясной вкус', 'reel'],
  ['20-bars', 'Мы в лучших барах', 'reel'],
  ['21-glass', 'Джерки из конины', ''],
  ['22-jerky-dzherki', 'Натуральная конина, медленная сушка', 'reel'],
  ['23-nauryz', 'Выбирайте лучшее к Наурызу', 'reel'],
  ['24-gifts', 'Подарочные наборы', 'set'],
  ['25-detstva', 'Знакомая с детства', 'reel'],
  ['26-vmesto', 'Настоящее мясо вместо пустых перекусов', 'reel'],
  ['27-meat100', '100% мясо', ''],
  ['28-chto-takoe', 'Что такое джерки?', 'reel'],
];
function instaGrid() {
  const icon = { reel: 'i-play', set: 'i-grid', pin: 'i-star' };
  return '\n' + FEED.map(([file, cap, type], i) =>
    `      <a class="tile${i >= 8 ? ' is-extra' : ''}" href="https://www.instagram.com/dalanyn_altyny_/" target="_blank" rel="noopener">` +
    `<img src="assets/img/feed/${file}.webp" alt="" loading="lazy" decoding="async" width="550" height="732">` +
    (type ? `<span class="tile__badge" aria-hidden="true"><svg><use href="#${icon[type]}"/></svg></span>` : '') +
    `<span class="tile__cap">${cap}</span></a>`).join('\n') + '\n    ';
}

/* ---------- write ---------- */
fs.mkdirSync(ART, { recursive: true });
const out = (name, svg) => fs.writeFileSync(path.join(ART, name), svg);
out('pack-jerky.svg', pack('jerky'));
out('pack-tushenka.svg', pack('tushenka'));
out('pack-kolbasa.svg', box());
for (let i = 1; i <= 12; i++) {
  out(`jerky-${String(i).padStart(2, '0')}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" width="200" height="100">${jerkyInner(100 + i * 7)}</svg>`);
}
out('compare-jerky.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" width="300" height="220">' +
  jerkyAt(41, 20, 20, 220, 110, -16) + jerkyAt(52, 60, 90, 220, 110, 12) + jerkyAt(63, 0, 120, 190, 95, -4) + '</svg>');

const htmlFile = path.join(ROOT, 'index.html');
let html = fs.readFileSync(htmlFile, 'utf8');
const inject = (name, content) => {
  const re = new RegExp(`(<!--@${name}-->)[\\s\\S]*?(<!--/@${name}-->)`);
  if (!re.test(html)) throw new Error(`marker ${name} not found`);
  html = html.replace(re, `$1${content}$2`);
};
inject('slicer', slicer());
inject('insta', instaGrid());
fs.writeFileSync(htmlFile, html);
console.log('art written to', ART);
