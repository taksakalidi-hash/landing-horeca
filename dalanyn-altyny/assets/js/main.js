/* ==========================================================================
   Dalanyn Altyny — сцены прокрутки, процедурные упаковки и корзина WhatsApp
   ========================================================================== */
(() => {
  'use strict';

  const WA_NUMBER = '77717788033';
  // Впишите цены (в тенге), чтобы они появились в корзине и в сообщении: price: 2500
  const PRODUCTS = {
    jerky:    { name: 'Джерки из конины',  price: null },
    kolbasa:  { name: 'Конская колбаса',   price: null },
    tushenka: { name: 'Тушёнка из конины', price: null },
  };
  const INSTAGRAM = 'https://www.instagram.com/dalanyn_altyny_/';
  // Публикации из Instagram (новые сверху) — картинки в assets/img/feed
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

  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  if (!hasGSAP) root.classList.add('reduced');
  const reduced = root.classList.contains('reduced');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  // the single-file preview build swaps asset paths for inline data
  const asset = (path) => (window.DA_ASSETS && window.DA_ASSETS[path]) || path;
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };

  /* ------------------------------------------------------------------------
     Procedural art: jerky strips, stew chunks, packs, sausage
     ------------------------------------------------------------------------ */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let uid = 0;
  const f1 = (n) => n.toFixed(1);

  function smooth(pts) {
    const n = pts.length;
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const m = mid(pts[n - 1], pts[0]);
    let d = `M${f1(m[0])} ${f1(m[1])}`;
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = mid(p, pts[(i + 1) % n]);
      d += `Q${f1(p[0])} ${f1(p[1])} ${f1(q[0])} ${f1(q[1])}`;
    }
    return d + 'Z';
  }

  // A torn, flat sheet of dried meat: uneven outline with ragged edges,
  // dark mahogany body, translucent red where it is thin, fibres along the grain. viewBox 200×100.
  function jerky(seed, attrs = '') {
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
    for (let g = 0; g < 3; g++) {
      glow += `<ellipse cx="${f1(cx + (r() - 0.5) * len * 1.2)}" cy="${f1(cy + (r() - 0.5) * wid * 0.9)}" rx="${f1(18 + r() * 30)}" ry="${f1(7 + r() * 10)}" transform="rotate(${Math.round((r() - 0.5) * 30)} 100 50)" fill="url(#${id}h)" opacity="${(0.45 + r() * 0.45).toFixed(2)}"/>`;
    }
    let fibers = '';
    for (let f = 0; f < 13; f++) {
      const yy = cy - wid * 1.1 + ((f + 0.5) / 13) * wid * 2.2 + (r() - 0.5) * 3;
      fibers += `<path d="M${f1(cx - len * 1.2)} ${f1(yy - len * skew * 0.36)}Q${cx} ${f1(yy + bend + (r() - 0.5) * 6)} ${f1(cx + len * 1.2)} ${f1(yy + len * skew * 0.36 + (r() - 0.5) * 6)}" stroke="${r() < 0.55 ? '#1a0402' : '#a9533a'}" stroke-opacity="${(0.08 + r() * 0.18).toFixed(2)}" stroke-width="${(0.5 + r() * 1.3).toFixed(1)}" fill="none"/>`;
    }
    let specks = '';
    for (let s = 0; s < 22; s++) {
      specks += `<circle cx="${f1(cx + (r() * 2 - 1) * len * 0.85)}" cy="${f1(cy + (r() * 2 - 1) * wid * 0.75)}" r="${(0.45 + r() * 1.2).toFixed(1)}" fill="${r() < 0.7 ? '#100201' : '#d08a4a'}" fill-opacity="${(0.45 + r() * 0.45).toFixed(2)}"/>`;
    }
    return `<svg viewBox="0 0 200 100" ${attrs} aria-hidden="true"><defs>` +
      `<linearGradient id="${id}g" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="${base[0]}"/><stop offset="1" stop-color="${base[1]}"/></linearGradient>` +
      `<radialGradient id="${id}h"><stop offset="0" stop-color="#b8492c" stop-opacity=".8"/><stop offset="1" stop-color="#b8492c" stop-opacity="0"/></radialGradient>` +
      `<clipPath id="${id}c"><path d="${d}"/></clipPath></defs>` +
      `<path d="${d}" fill="url(#${id}g)"/>` +
      `<g clip-path="url(#${id}c)">${glow}${fibers}${specks}` +
      `<path d="${d}" fill="none" stroke="#c0603e" stroke-opacity=".24" stroke-width="5"/>` +
      `<path d="${d}" fill="none" stroke="#fff3e0" stroke-opacity=".07" stroke-width="3" transform="translate(1 -2.5)"/></g>` +
      `<path d="${d}" fill="none" stroke="#1a0402" stroke-opacity=".5" stroke-width=".8"/></svg>`;
  }

  // A glossy piece of stewed meat. viewBox 100×100.
  function chunk(seed, attrs = '') {
    const r = rng(seed * 104729 + 3), id = 'c' + (++uid);
    const rx = 30 + r() * 12, ry = 24 + r() * 10, pts = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, k = 1 + (r() - 0.5) * 0.3;
      pts.push([50 + Math.cos(a) * rx * k, 50 + Math.sin(a) * ry * k]);
    }
    const d = smooth(pts);
    let fib = '';
    for (let k = 0; k < 4; k++) fib += `<path d="M${20 + r() * 10} ${30 + k * 12}q30 ${(r() - 0.5) * 10} 60 ${(r() - 0.5) * 8}" stroke="#2c0f05" stroke-opacity=".35" fill="none"/>`;
    return `<svg viewBox="0 0 100 100" ${attrs} aria-hidden="true"><defs><radialGradient id="${id}" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#b8693f"/><stop offset=".5" stop-color="#7a391d"/><stop offset="1" stop-color="#3a170a"/></radialGradient><clipPath id="${id}c"><path d="${d}"/></clipPath></defs>` +
      `<path d="${d}" fill="url(#${id})"/><g clip-path="url(#${id}c)">${fib}</g><path d="${d}" fill="none" stroke="#2a0f05" stroke-opacity=".5"/>` +
      `<ellipse cx="${f1(38 + r() * 8)}" cy="${f1(36 + r() * 6)}" rx="${f1(7 + r() * 6)}" ry="${f1(3 + r() * 3)}" fill="#ffe2c0" opacity=".3"/></svg>`;
  }

  // Matte black stand-up pouch with gold foil and a window — as on the real pack.
  function packSVG(kind) {
    const id = 'p' + (++uid), isJ = kind === 'jerky';
    const body = 'M20 8H280Q290 8 290 18V392Q290 422 260 422H40Q10 422 10 392V18Q10 8 20 8Z';
    const win = 'M64 212C64 192 80 182 102 182H234Q248 182 248 196V318Q248 334 232 334H82Q64 334 64 316Z';
    let inside = '';
    if (isJ) {
      [[30, 168, -18], [118, 160, 14], [168, 204, -8], [40, 226, 24], [122, 238, -16], [176, 270, 10], [52, 280, -6], [136, 296, 18]]
        .forEach(([x, y, a], k) => {
          inside += `<g transform="rotate(${a} ${x + 70} ${y + 35})">${jerky(k * 3 + 5, `x="${x}" y="${y}" width="140" height="70"`)}</g>`;
        });
    } else {
      [[54, 172], [112, 166], [172, 176], [44, 222], [100, 218], [158, 226], [204, 210], [64, 272], [124, 278], [186, 270]]
        .forEach(([x, y], k) => { inside += chunk(k * 5 + 2, `x="${x - 8}" y="${y - 8}" width="72" height="72"`); });
    }
    const label = isJ
      ? ['ЖЫЛҚЫ ЕТІНЕН', 'ЖАСАЛҒАН ДЖЕРКИ', 'ДЖЕРКИ ИЗ КОНИНЫ']
      : ['ЖЫЛҚЫ ЕТІНЕН', 'ЖАСАЛҒАН БҰҚТЫРМА', 'ТУШЁНКА ИЗ КОНИНЫ'];
    return `<svg viewBox="0 0 300 430" aria-hidden="true"><defs>` +
      `<linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="#090807"/><stop offset=".14" stop-color="#221d19"/><stop offset=".5" stop-color="#131110"/><stop offset=".86" stop-color="#1d1915"/><stop offset="1" stop-color="#080706"/></linearGradient>` +
      `<linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".05"/><stop offset=".15" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>` +
      `<linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1"><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".13"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".62" stop-color="#fff" stop-opacity=".06"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
      `<pattern id="${id}k" width="4" height="30" patternUnits="userSpaceOnUse"><rect width="1.4" height="30" fill="#fff" fill-opacity=".07"/></pattern>` +
      `<clipPath id="${id}w"><path d="${win}"/></clipPath></defs>` +
      `<path d="${body}" fill="url(#${id}b)"/><path d="${body}" fill="url(#${id}v)"/>` +
      `<rect x="10" y="8" width="280" height="30" fill="url(#${id}k)"/>` +
      `<path d="M10 38H290" stroke="#000" stroke-opacity=".6"/><path d="M10 39.5H290" stroke="#fff" stroke-opacity=".05"/>` +
      `<rect x="126" y="16" width="48" height="11" rx="5.5" fill="#030202" stroke="#fff" stroke-opacity=".08"/>` +
      `<use href="#emblem" x="113" y="48" width="74" height="74" fill="url(#gold)"/>` +
      `<use href="#wordmark" x="106" y="128" width="88" height="41" fill="url(#gold)"/>` +
      `<g clip-path="url(#${id}w)"><rect x="60" y="180" width="200" height="160" fill="${isJ ? '#1c0805' : '#2a1309'}"/>${inside}` +
      `<path d="${win}" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="14"/>` +
      `<path d="M92 182L64 262V182zM156 182h40L104 334H64z" fill="#fff" fill-opacity=".06"/></g>` +
      `<path d="${win}" fill="none" stroke="url(#gold)" stroke-width="2.4"/>` +
      `<g font-family="Montserrat, sans-serif" font-weight="800" text-anchor="middle" fill="url(#gold)">` +
      `<text x="150" y="362" font-size="15" letter-spacing="1.5">${label[0]}</text>` +
      `<text x="150" y="381" font-size="15" letter-spacing="1.5">${label[1]}</text>` +
      `<text x="150" y="403" font-size="10.5" font-weight="600" letter-spacing="2.4" fill-opacity=".85">${label[2]}</text></g>` +
      `<path d="${body}" fill="url(#${id}r)"/></svg>`;
  }

  // Tall sausage box with a capsule window.
  function boxSVG() {
    const id = 'b' + (++uid), r = rng(uid * 31 + 7);
    let specks = '';
    for (let k = 0; k < 46; k++) {
      const x = 38 + r() * 60, y = 146 + r() * 182;
      specks += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(1.4 + r() * 4)}" ry="${f1(1 + r() * 2.4)}" transform="rotate(${Math.round(r() * 180)} ${f1(x)} ${f1(y)})" fill="${r() < 0.72 ? '#f3dccb' : '#4a0f0a'}" fill-opacity="${(0.55 + r() * 0.4).toFixed(2)}"/>`;
    }
    return `<svg viewBox="0 0 150 430" aria-hidden="true"><defs>` +
      `<linearGradient id="${id}f" x1="0" x2="1"><stop offset="0" stop-color="#0b0a09"/><stop offset=".2" stop-color="#211b18"/><stop offset=".6" stop-color="#141211"/><stop offset="1" stop-color="#0c0b0a"/></linearGradient>` +
      `<linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="#4f130e"/><stop offset=".35" stop-color="#9c3a30"/><stop offset=".55" stop-color="#7d261d"/><stop offset="1" stop-color="#360b07"/></linearGradient>` +
      `<clipPath id="${id}w"><rect x="38" y="144" width="60" height="186" rx="30"/></clipPath></defs>` +
      `<path d="M8 12L22 4H144L130 12Z" fill="#2b2622"/><path d="M130 12L144 4V422L130 430Z" fill="#060505"/>` +
      `<rect x="8" y="12" width="122" height="418" fill="url(#${id}f)"/>` +
      `<rect x="51" y="22" width="36" height="9" rx="4.5" fill="#020202" stroke="#fff" stroke-opacity=".08"/>` +
      `<use href="#emblem" x="41" y="42" width="56" height="56" fill="url(#gold)"/>` +
      `<use href="#wordmark" x="37" y="102" width="64" height="30" fill="url(#gold)"/>` +
      `<g clip-path="url(#${id}w)"><rect x="38" y="144" width="60" height="186" fill="url(#${id}s)"/>${specks}` +
      `<rect x="38" y="144" width="60" height="186" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="10"/><path d="M56 144h7v186h-7z" fill="#fff" fill-opacity=".1"/></g>` +
      `<rect x="38" y="144" width="60" height="186" rx="30" fill="none" stroke="url(#gold)" stroke-width="2"/>` +
      `<g font-family="Montserrat, sans-serif" text-anchor="middle" fill="url(#gold)">` +
      `<text x="69" y="352" font-size="7" font-weight="600" letter-spacing=".6">Қазақстанда жасалған</text>` +
      `<text x="69" y="372" font-size="12.5" font-weight="800" letter-spacing=".6">ЖЫЛҚЫ</text>` +
      `<text x="69" y="387" font-size="12.5" font-weight="800" letter-spacing=".6">ШҰЖЫҒЫ</text>` +
      `<text x="69" y="403" font-size="8.4" font-weight="700" letter-spacing=".8">КОНСКАЯ КОЛБАСА</text>` +
      `<text x="69" y="415" font-size="6.4" font-weight="600" letter-spacing=".6" fill-opacity=".8">Сделано в Казахстане</text></g></svg>`;
  }

  function blob(x, y, s, r) {
    const pts = [];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2, k = s * (0.7 + r() * 0.6);
      pts.push([x + Math.cos(a) * k, y + Math.sin(a) * k * 0.8]);
    }
    return smooth(pts);
  }

  // Horizontal horse sausage cut into segments; each segment carries the cut face on its right.
  const SL = { N: 8, X0: 150, X1: 1050, CY: 150, R: 72 };
  function buildSlicer(stage) {
    const { N, X0, X1, CY, R } = SL, s = (X1 - X0) / N, ar = 30, r = rng(77);
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
      // butcher's twine travels with the end pieces
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
    stage.innerHTML = `<svg viewBox="0 0 1200 320" role="img" aria-label="Конская колбаса, нарезанная на кусочки"><defs>` +
      `<linearGradient id="slC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22070a"/><stop offset=".22" stop-color="#5e1a14"/><stop offset=".4" stop-color="#9b3b31"/><stop offset=".55" stop-color="#7a241b"/><stop offset=".85" stop-color="#3a0c08"/><stop offset="1" stop-color="#1a0504"/></linearGradient>` +
      `<radialGradient id="slF" cx=".45" cy=".42" r=".62"><stop offset="0" stop-color="#c4564a"/><stop offset=".7" stop-color="#93302a"/><stop offset="1" stop-color="#6a1a15"/></radialGradient>` +
      `<filter id="slBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>` +
      `<ellipse cx="600" cy="${CY + R + 46}" rx="470" ry="12" fill="#000" opacity=".6" filter="url(#slBlur)"/>` +
      `<g class="sl-all">${segs}${cuts}</g>` +
      `<g class="sl-knife"><rect x="-3" y="${CY - R - 40}" width="6" height="${2 * R + 80}" rx="3" fill="#ffe6b0" opacity=".55" filter="url(#slBlur)"/><rect x="-.8" y="${CY - R - 40}" width="1.6" height="${2 * R + 80}" fill="#fff8e6"/></g></svg>`;
  }

  // Kazakh ram-horn ornament (қошқар мүйіз) for dividers.
  const ORNAMENT = '<svg viewBox="0 0 260 60" aria-hidden="true"><path d="M130 52C130 30 141 18 157 18C172 18 181 29 179 40C177 49 167 53 161 48C155 43 158 35 165 35"/><path d="M130 52C130 30 119 18 103 18C88 18 79 29 81 40C83 49 93 53 99 48C105 43 102 35 95 35"/><path d="M183 40H214M222 40H252M78 40H46M38 40H8"/><path d="M218 36l4 4-4 4-4-4zM42 36l4 4-4 4-4-4zM130 4l6 7-6 7-6-7z"/></svg>';

  /* ------------------------------------------------------------------------
     Build DOM
     ------------------------------------------------------------------------ */
  $$('[data-pack]').forEach((el) => {
    const kind = el.dataset.pack;
    el.innerHTML = `<div class="pack__inner">${kind === 'box' ? boxSVG() : packSVG(kind)}${el.hasAttribute('data-mini') ? '' : '<div class="pack__glare"></div>'}</div>`;
  });
  $$('[data-jerky]').forEach((el) => { el.innerHTML = jerky(+el.dataset.jerky); });

  const compareArt = $('[data-compare-jerky]');
  if (compareArt) {
    compareArt.innerHTML = '<svg viewBox="0 0 300 220" aria-hidden="true">' +
      `<g transform="rotate(-16 150 80)">${jerky(41, 'x="20" y="20" width="220" height="110"')}</g>` +
      `<g transform="rotate(12 160 140)">${jerky(52, 'x="60" y="90" width="220" height="110"')}</g>` +
      `<g transform="rotate(-4 120 170)">${jerky(63, 'x="0" y="120" width="190" height="95"')}</g></svg>`;
  }

  const strips = [];
  const stripsBox = $('.hero__strips');
  if (stripsBox && !reduced) {
    const mob = innerWidth <= 700;
    const count = mob ? 11 : 16, rr = rng(9);
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'strip';
      el.style.setProperty('--w', `${Math.round((mob ? 80 : 130) + rr() * (mob ? 60 : 110))}px`);
      el.innerHTML = jerky(100 + i * 7);
      stripsBox.appendChild(el);
      strips.push(el);
    }
  }

  const slicerStage = $('.slicer__stage');
  if (slicerStage) buildSlicer(slicerStage);
  $$('[data-orn]').forEach((el) => { el.outerHTML = ORNAMENT.replace('<svg', '<svg class="ornament"'); });

  // Instagram grid
  const instaGrid = $('#instaGrid');
  if (instaGrid) {
    const icon = { reel: 'i-play', set: 'i-grid', pin: 'i-star' };
    instaGrid.innerHTML = FEED.map(([file, cap, type], i) => (
      `<a class="tile${i >= 8 ? ' is-extra' : ''}" href="${INSTAGRAM}" target="_blank" rel="noopener">` +
      `<img src="${asset(`assets/img/feed/${file}.webp`)}" alt="${cap}" loading="lazy" decoding="async" width="550" height="732">` +
      (type ? `<span class="tile__badge" aria-hidden="true"><svg><use href="#${icon[type]}"/></svg></span>` : '') +
      `<span class="tile__cap">${cap}</span></a>`
    )).join('');
    $('#instaMore').addEventListener('click', () => {
      $('#insta').classList.add('is-all');
      if (hasGSAP) ScrollTrigger.refresh();
    });
  }

  // WhatsApp links with a prefilled message
  $$('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa); });
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------------
     Cart → WhatsApp
     ------------------------------------------------------------------------ */
  const cart = Object.assign({ jerky: 0, kolbasa: 0, tushenka: 0 }, store.get('da-cart', {}));
  const form = $('#orderForm'), lines = $('#summaryLines'), sendBtn = $('#sendOrder');
  const fab = $('#fab'), fabCount = $('#fabCount'), toastEl = $('#toast');
  const money = (n) => `${n.toLocaleString('ru-RU')} ₸`;
  let toastTimer;

  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2400);
  }
  const chosen = () => Object.keys(PRODUCTS).filter((k) => cart[k] > 0);

  function orderMessage() {
    const items = chosen();
    if (!items.length) return 'Здравствуйте! Хочу узнать о продукции Dalanyn Altyny.';
    let msg = 'Здравствуйте! Хочу заказать:\n' + items.map((k) => {
      const p = PRODUCTS[k];
      return `• ${p.name} — ${cart[k]} шт.${p.price ? ` (${money(p.price * cart[k])})` : ''}`;
    }).join('\n');
    const data = new FormData(form);
    const name = (data.get('name') || '').trim(), address = (data.get('address') || '').trim(), note = (data.get('note') || '').trim();
    if (name) msg += `\nИмя: ${name}`;
    if (address) msg += `\nАдрес: ${address}`;
    if (note) msg += `\nКомментарий: ${note}`;
    return msg + '\n\n(заказ с сайта)';
  }

  function renderCart() {
    $$('[data-stepper]').forEach((s) => { $('output', s).textContent = cart[s.dataset.stepper]; });
    $$('.oitem').forEach((o) => o.classList.toggle('is-active', cart[o.dataset.item] > 0));
    const items = chosen();
    const total = items.reduce((a, k) => a + cart[k], 0);
    if (items.length) {
      const priced = items.every((k) => PRODUCTS[k].price);
      lines.innerHTML = items.map((k) => `<div class="row"><span>${PRODUCTS[k].name}</span><b>× ${cart[k]}</b></div>`).join('') +
        (priced ? `<div class="row"><span>Итого</span><b>${money(items.reduce((a, k) => a + PRODUCTS[k].price * cart[k], 0))}</b></div>` : '');
    } else {
      lines.innerHTML = '<p class="summary__empty">Пока пусто — добавьте продукты слева.</p>';
    }
    fabCount.textContent = total;
    fabCount.classList.toggle('is-on', total > 0);
    sendBtn.href = waLink(orderMessage());
  }
  function setQty(k, v) {
    cart[k] = Math.max(0, Math.min(99, v));
    store.set('da-cart', cart);
    renderCart();
  }

  document.addEventListener('click', (e) => {
    const step = e.target.closest('[data-stepper] [data-d]');
    if (step) {
      const k = step.closest('[data-stepper]').dataset.stepper;
      setQty(k, cart[k] + Number(step.dataset.d));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const k = add.dataset.add;
      setQty(k, cart[k] + 1);
      toast(`${PRODUCTS[k].name} — в заказе: ${cart[k]}`);
      if (hasGSAP) gsap.fromTo(fab, { scale: 1.18 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, .4)' });
    }
  });
  form.addEventListener('input', renderCart);
  form.addEventListener('submit', (e) => e.preventDefault());
  sendBtn.addEventListener('click', (e) => {
    if (!chosen().length) {
      e.preventDefault();
      toast('Добавьте хотя бы один продукт');
      return;
    }
    sendBtn.href = waLink(orderMessage());
  });
  renderCart();

  /* ------------------------------------------------------------------------
     Poll
     ------------------------------------------------------------------------ */
  const poll = $('#pollForm');
  if (poll) {
    const own = $('#pollOwn'), thanks = $('#pollThanks');
    const prev = store.get('da-vote', null);
    if (prev) thanks.textContent = `Ваш голос: «${prev}». Спасибо!`;
    poll.addEventListener('change', () => {
      own.classList.toggle('is-on', (poll.querySelector('input[name="novinka"]:checked') || {}).value === 'own');
    });
    poll.addEventListener('submit', (e) => {
      e.preventDefault();
      const picked = poll.querySelector('input[name="novinka"]:checked');
      if (!picked) { toast('Выберите вариант'); return; }
      const value = picked.value === 'own' ? $('#p-own').value.trim() : picked.value;
      if (!value) { toast('Напишите вашу идею'); return; }
      store.set('da-vote', value);
      thanks.textContent = `Ваш голос: «${value}». Спасибо!`;
      window.open(waLink(`Здравствуйте! Голосую за новинку Dalanyn Altyny: ${value}`), '_blank', 'noopener');
    });
  }

  /* ------------------------------------------------------------------------
     Header, menu, compare, facts
     ------------------------------------------------------------------------ */
  const header = $('#header');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    if (Math.abs(y - lastY) > 6) {
      header.classList.toggle('is-hidden', y > lastY && y > 500 && !root.classList.contains('menu-open'));
      lastY = y;
    }
    fab.classList.toggle('is-on', y > innerHeight * 0.9);
  }
  addEventListener('scroll', onScroll, { passive: true });

  let lenis = null;
  let productsST = null;
  const burger = $('.burger'), menu = $('#mobile-menu');
  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  const cbox = $('.compare__box');
  if (cbox) {
    const range = $('.compare__range', cbox);
    const setPos = (v) => { cbox.style.setProperty('--pos', `${v}%`); range.value = v; };
    range.addEventListener('input', () => setPos(range.value));
    if (hasGSAP && !reduced) {
      ScrollTrigger.create({
        trigger: cbox, start: 'top 70%', once: true,
        onEnter: () => {
          const o = { v: 50 }, upd = () => setPos(Math.round(o.v));
          gsap.timeline()
            .to(o, { v: 18, duration: 0.8, ease: 'power2.inOut', onUpdate: upd })
            .to(o, { v: 82, duration: 1.1, ease: 'power2.inOut', onUpdate: upd })
            .to(o, { v: 50, duration: 0.8, ease: 'power2.inOut', onUpdate: upd });
        },
      });
    }
  }

  const factsRow = $('.facts');
  $$('[data-facts]').forEach((b) => b.addEventListener('click', () => {
    const card = $('.fact', factsRow);
    factsRow.scrollBy({ left: Number(b.dataset.facts) * (card.offsetWidth + 18), behavior: 'smooth' });
  }));

  // Pack tilt + glare follow the pointer
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach((p) => {
      const inner = $('.pack__inner', p);
      const area = p.closest('.product__visual, .hero__packwrap') || p;
      area.addEventListener('pointermove', (e) => {
        const r = area.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform = `rotateY(${px * 24}deg) rotateX(${-py * 16}deg)`;
        p.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
        p.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
        p.style.setProperty('--go', '1');
      });
      area.addEventListener('pointerleave', () => { inner.style.transform = ''; p.style.setProperty('--go', '.6'); });
    });
  }

  /* ------------------------------------------------------------------------
     Without GSAP (or with reduced motion): static, fully readable page
     ------------------------------------------------------------------------ */
  if (!hasGSAP || reduced) {
    const pl = $('.preloader');
    if (pl) pl.remove();
    if (hasGSAP) {
      // show the slicer in its "cut" state
      gsap.set('.sl-seg', { x: (i) => (i - (SL.N - 1) / 2) * 36 });
      gsap.set('.sl-knife', { opacity: 0 });
    } else {
      $$('.sl-knife').forEach((k) => k.setAttribute('opacity', '0'));
    }
    bindAnchors();
    return;
  }

  /* ------------------------------------------------------------------------
     Motion
     ------------------------------------------------------------------------ */
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ('scrollRestoration' in history && !location.hash) {
    history.scrollRestoration = 'manual';
    scrollTo(0, 0);
  }

  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  const mm = gsap.matchMedia();

  /* ---------- HERO: the pack bursts, strips scatter, scroll back to reassemble ---------- */
  function heroScene() {
    const hero = $('.hero'), stage = $('.hero__stage'), packwrap = $('.hero__packwrap');
    const copy = $('.hero__copy'), after = $('.hero__after');

    mm.add({ mob: '(max-width: 700px)', desk: '(min-width: 701px)' }, (ctx) => {
      const mob = ctx.conditions.mob;
      gsap.set(packwrap, { xPercent: -50, yPercent: mob ? 0 : -50, x: 0, y: 0 });
      const W = () => stage.offsetWidth, H = () => stage.offsetHeight;
      const pcx = () => packwrap.offsetLeft;
      const pcy = () => packwrap.offsetTop + (mob ? packwrap.offsetHeight / 2 : 0);
      const tr = rng(2024), n = strips.length;
      const tg = strips.map((_, i) => ({
        a: (i / n) * Math.PI * 2 + (tr() - 0.5) * 0.45 - Math.PI / 2,
        k: 0.8 + tr() * 0.32,
        rot: (tr() - 0.5) * 140,
        s: 0.8 + tr() * 0.5,
      }));
      const rx = mob ? 0.42 : 0.41, ry = mob ? 0.4 : 0.37;
      const tx = (i, el) => W() / 2 + Math.cos(tg[i].a) * W() * rx * tg[i].k - el.offsetWidth / 2;
      const ty = (i, el) => H() * 0.5 + Math.sin(tg[i].a) * H() * ry * tg[i].k - el.offsetHeight / 2;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero, start: 'top top', end: () => `+=${H() * (mob ? 1.3 : 1.6)}`,
          scrub: 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      tl.to(copy, { y: -110, opacity: 0, duration: 0.3, ease: 'power1.in' }, 0)
        .to('.hero__badges, .hero__scroll', { opacity: 0, duration: 0.1 }, 0)
        .to(packwrap, { x: () => W() / 2 - pcx(), y: () => H() * 0.5 - pcy(), scale: mob ? 1.3 : 1.12, rotation: -7, duration: 0.34, ease: 'power2.inOut' }, 0)
        .to('.hero__glow, .hero__ring', { left: '50%', top: '50%', duration: 0.34, ease: 'power2.inOut' }, 0)
        .fromTo(strips,
          { x: (i, el) => W() / 2 - el.offsetWidth / 2, y: (i, el) => H() * 0.5 - el.offsetHeight / 2, scale: 0.12, rotation: 0, opacity: 0 },
          { x: tx, y: ty, scale: (i) => tg[i].s, rotation: (i) => tg[i].rot, opacity: 1, duration: 0.42, ease: 'power3.out', stagger: 0.012 }, 0.3)
        .to(packwrap, { y: () => H() - pcy() + 40, scale: 0.7, rotation: 8, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.6)
        .fromTo(after, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 0.66)
        .to(strips, {
          x: (i) => `+=${Math.cos(tg[i].a) * 46}`, y: (i) => `+=${Math.sin(tg[i].a) * 46}`,
          rotation: (i) => `+=${tg[i].rot > 0 ? 18 : -18}`, duration: 0.36, ease: 'none',
        }, 0.64);
    });
  }

  /* ---------- PRODUCTS: horizontal track on desktop ---------- */
  function productsScene() {
    const track = $('.products__track'), pin = $('.products__pin'), bar = $('.products__progress i');
    const panels = $$('.panel:not(.panel--intro)');

    mm.add('(min-width: 900px)', () => {
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: pin, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6,
          invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress})`; },
        },
      });
      productsST = tween.scrollTrigger;
      panels.forEach((panel) => {
        gsap.from($('.product__visual', panel), {
          rotation: 10, xPercent: 30, opacity: 0.2, ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 95%', end: 'left 35%', scrub: true },
        });
        gsap.from($$('.product__info > *', panel), {
          x: 90, opacity: 0, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 70%', end: 'left 15%', scrub: true },
        });
        gsap.fromTo($('.panel__num', panel), { xPercent: 40 }, {
          xPercent: -80, ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        });
      });
      return () => { productsST = null; };
    });

    mm.add('(max-width: 899px)', () => {
      panels.forEach((panel) => {
        gsap.from([$('.product__visual', panel), ...$$('.product__info > *', panel)], {
          y: 50, opacity: 0, duration: 1, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 80%' },
        });
      });
    });
  }

  /* ---------- SLICER: knife runs along, then the sausage falls into slices ---------- */
  function slicerScene() {
    const { N, X0, X1 } = SL;
    const segs = $$('.sl-seg'), faces = $$('.sl-face'), cuts = $$('.sl-cut'), knife = $('.sl-knife');
    if (!segs.length) return;
    gsap.set(faces, { scaleX: 0, transformOrigin: '50% 50%' });
    gsap.set(knife, { x: X0 - 50 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.slicer__pin', start: 'top top', end: '+=140%', pin: true, scrub: 0.7, anticipatePin: 1 },
    });
    tl.to(knife, { x: X1 + 50, duration: 1, ease: 'none' }, 0);
    cuts.forEach((c, i) => {
      const at = (X0 + ((i + 1) * (X1 - X0)) / N - (X0 - 50)) / (X1 - X0 + 100);
      tl.to(c, { opacity: 1, duration: 0.04 }, at);
    });
    tl.to(knife, { opacity: 0, duration: 0.12 }, 0.98)
      .to(cuts, { opacity: 0, duration: 0.15 }, 1.05);
    segs.forEach((g, i) => {
      const off = i - (N - 1) / 2;
      tl.to(g, {
        x: off * 36, y: (i % 2 ? 1 : -1) * 10, rotation: off * 1.6,
        svgOrigin: `${g.dataset.cx} 150`, duration: 1.2, ease: 'power2.inOut',
      }, 1.05);
    });
    tl.to(faces, { scaleX: 0.42, duration: 1, ease: 'power2.out', stagger: 0.03 }, 1.15)
      .from('.slicer__caption > div', { y: 30, opacity: 0, stagger: 0.1, duration: 0.6 }, 1.6);
  }

  /* ---------- Everything else ---------- */
  function sceneryAndReveals() {
    // marquees: constant drift, faster and reversed with scroll direction
    const loops = $$('.marquee').map((m) => {
      const track = $('.marquee__track', m), item = $('.marquee__item', track);
      const w = item.offsetWidth;
      for (let i = 0, need = Math.ceil((innerWidth * 2) / w) + 1; i < need; i++) track.appendChild(item.cloneNode(true));
      const dir = Number(m.dataset.marquee);
      return { dir, tween: gsap.fromTo(track, { x: dir > 0 ? 0 : -w }, { x: dir > 0 ? -w : 0, duration: w / 70, ease: 'none', repeat: -1 }) };
    });
    let boost = 0, sign = 1;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => { boost = Math.min(5, Math.abs(self.getVelocity()) / 260); sign = self.direction; },
    });
    gsap.ticker.add(() => {
      boost *= 0.93;
      loops.forEach((l) => l.tween.timeScale(sign * (1 + boost)));
    });

    // manifesto: words light up as you read
    $$('[data-words]').forEach((el) => {
      const wrap = (node) => {
        Array.from(node.childNodes).forEach((c) => {
          if (c.nodeType === 3) {
            const frag = document.createDocumentFragment();
            c.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              const s = document.createElement('span');
              s.className = 'w';
              s.textContent = part;
              frag.appendChild(s);
            });
            c.replaceWith(frag);
          } else if (c.nodeType === 1) wrap(c);
        });
      };
      wrap(el);
      gsap.to($$('.w', el), {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      });
    });

    // process line + steps
    gsap.to('.steps__line i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 62%', end: 'bottom 62%', scrub: true } });
    $$('.step').forEach((st) => {
      ScrollTrigger.create({ trigger: st, start: 'top 62%', onEnter: () => st.classList.add('is-on'), onLeaveBack: () => st.classList.remove('is-on') });
      gsap.from($$('h3, p, .kk', st), { y: 30, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: st, start: 'top 82%' } });
    });

    // steppe layers drift at different depths
    $$('.steppe [data-depth]').forEach((g) => {
      const d = Number(g.dataset.depth);
      gsap.fromTo(g, { y: -d * 90 }, { y: d * 90, ease: 'none', scrollTrigger: { trigger: '.steppe', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from('.fact', { y: 60, opacity: 0, stagger: 0.08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.facts', start: 'top 85%' } });

    // story collage parallax
    $$('.story [data-speed]').forEach((el) => {
      const s = Number(el.dataset.speed);
      gsap.fromTo(el, { y: -s }, { y: s, ease: 'none', scrollTrigger: { trigger: '.story__collage', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // floating packs and pieces
    gsap.to('.product__visual > .pack', { y: -14, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4 });
    $$('.product__piece').forEach((p, i) => {
      gsap.to(p, { y: i % 2 ? 16 : -16, rotation: i % 2 ? 8 : -10, duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });

    // insta tiles
    ScrollTrigger.batch('.tile', {
      start: 'top 92%',
      onEnter: (b) => gsap.fromTo(b, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'power3.out', overwrite: true }),
    });

    // generic reveals
    const show = (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out', overwrite: true });
    ScrollTrigger.batch('.reveal', { start: 'top 88%', once: true, onEnter: show, onLeave: show });

    gsap.from('.final__emblem', { rotation: -90, scale: 0.6, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.final', start: 'top 75%' } });
  }

  /* ---------- Anchors (lenis-aware, knows where each product panel lives) ---------- */
  function bindAnchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      let y = null;
      if (productsST && target.classList.contains('panel')) {
        const track = $('.products__track');
        const dist = track.scrollWidth - innerWidth;
        y = productsST.start + (target.offsetLeft / dist) * (productsST.end - productsST.start);
      }
      if (lenis) lenis.scrollTo(y ?? target, { offset: y == null ? -70 : 0, duration: 1.6 });
      else if (y != null) scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Preloader → hero intro ---------- */
  function intro() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__title .line > span', { yPercent: 115, duration: 1.3, stagger: 0.12 })
      .from('.hero__copy .eyebrow, .hero__lead, .hero__cta', { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, 0.25)
      .from('.hero__packwrap .pack', { y: 140, rotation: 14, opacity: 0, duration: 1.5 }, 0.1)
      .from('.hero__ring, .hero__glow', { opacity: 0, duration: 1.8, ease: 'power2.out' }, 0)
      .from('.hero__badges .chip, .hero__scroll', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, 0.7)
      .add(() => gsap.to('.hero__packwrap .pack', { y: -12, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  }

  function preloader(done) {
    const pl = $('.preloader');
    if (!pl) { done(); return; }
    let fast = false;
    try { fast = sessionStorage.getItem('da-seen') === '1'; sessionStorage.setItem('da-seen', '1'); } catch (e) { /* ignore */ }
    const paths = $$('.pl-strokes path', pl);
    paths.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    gsap.timeline({ onComplete: () => pl.remove() })
      .to(paths, { strokeDashoffset: 0, duration: fast ? 0.5 : 1.25, ease: 'power2.inOut', stagger: 0.03 })
      .to('.preloader__bar i', { scaleX: 1, duration: fast ? 0.6 : 1.4, ease: 'power1.inOut' }, 0)
      .to('.pl-fill', { opacity: 1, duration: 0.45 }, '-=.35')
      .to(paths, { opacity: 0, duration: 0.3 }, '<')
      .add(done, '+=.05')
      .to(pl, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '<');
  }

  function start() {
    heroScene();
    productsScene();
    slicerScene();
    sceneryAndReveals();
    bindAnchors();
    onScroll();
    preloader(() => {
      if (lenis) lenis.start();
      intro();
      ScrollTrigger.refresh();
    });
    addEventListener('load', () => ScrollTrigger.refresh());
  }

  // wait for the fonts so measured widths (marquee, pins) are right
  let started = false;
  const go = () => { if (!started) { started = true; start(); } };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go);
  setTimeout(go, 2500);
})();
