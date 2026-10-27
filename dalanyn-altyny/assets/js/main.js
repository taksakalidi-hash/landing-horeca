/* ==========================================================================
   Dalanyn Altyny — сцены прокрутки и корзина WhatsApp.
   Всё содержимое и картинки уже есть в HTML (их рисует tools/build-art.js),
   скрипт только добавляет движение. Если он не загрузится, страница всё равно
   полностью видна и работает.
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

  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
  // the single-file preview build swaps asset paths for inline data
  const asset = (path) => (window.DA_ASSETS && window.DA_ASSETS[path]) || path;
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } },
  };
  function openLink(url) {
    const w = window.open(url, '_blank');
    if (w) w.opener = null;
    else { // popups blocked (in-app viewers, sandboxed frames)
      try { window.top.location.href = url; } catch (e) { location.href = url; }
    }
  }
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // A window that never scrolls (auto-height iframes) or an absurdly tall one
  // can't drive scroll scenes — show the static page there.
  const cannotScroll = () => innerHeight > 1800 || innerHeight < 480 || document.documentElement.scrollHeight - innerHeight < 300;
  let staticMode = !hasGSAP || root.classList.contains('reduced') || cannotScroll();

  $$('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa); });
  if (window.self !== window.top) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[target="_blank"]');
      if (!a || e.defaultPrevented) return;
      e.preventDefault();
      openLink(a.href);
    });
  }
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------------
     Cart → WhatsApp
     ------------------------------------------------------------------------ */
  const saved = store.get('da-cart', {}) || {};
  const cart = {};
  ['jerky', 'kolbasa', 'tushenka'].forEach((k) => { cart[k] = Math.max(0, Math.min(99, parseInt(saved[k], 10) || 0)); });
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
    $('#clearCart').hidden = total === 0;
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
      fab.classList.add('is-on', 'is-pulse');
      setTimeout(() => fab.classList.remove('is-pulse'), 600);
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
    toast('Открываем WhatsApp — отправьте сообщение там');
  });
  $('#clearCart').addEventListener('click', () => {
    Object.keys(cart).forEach((k) => { cart[k] = 0; });
    store.set('da-cart', cart);
    renderCart();
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
      openLink(waLink(`Здравствуйте! Голосую за новинку Dalanyn Altyny: ${value}`));
    });
  }

  /* ------------------------------------------------------------------------
     Header, menu, compare, facts, insta, pack tilt
     ------------------------------------------------------------------------ */
  const header = $('#header');
  let lastY = 0, anchoring = 0;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    if (Math.abs(y - lastY) > 6) {
      header.classList.toggle('is-hidden', y > lastY && y > 500 && !root.classList.contains('menu-open') && Date.now() > anchoring);
      lastY = y;
    }
    fab.classList.toggle('is-on', y > innerHeight * 0.9 || chosen().length > 0);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
  const cRange = cbox && $('.compare__range', cbox);
  const setPos = (v) => { cbox.style.setProperty('--pos', `${v}%`); cRange.value = v; };
  if (cbox) {
    cRange.addEventListener('input', () => setPos(cRange.value));
    const fromPointer = (e) => {
      const r = cbox.getBoundingClientRect();
      setPos(Math.round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100))));
    };
    let dragging = false, start = null;
    cbox.addEventListener('pointerdown', (e) => { start = { x: e.clientX, y: e.clientY }; dragging = e.pointerType === 'mouse'; if (dragging) fromPointer(e); });
    addEventListener('pointermove', (e) => {
      if (!start) return;
      if (!dragging) {
        const dx = Math.abs(e.clientX - start.x), dy = Math.abs(e.clientY - start.y);
        if (dx > 8 && dx > dy) dragging = true; else if (dy > 8) { start = null; return; } else return;
      }
      fromPointer(e);
    });
    addEventListener('pointerup', () => { start = null; });
    addEventListener('pointerup', () => { dragging = false; });
    addEventListener('pointercancel', () => { dragging = false; });
  }

  const factsRow = $('.facts');
  $$('[data-facts]').forEach((b) => b.addEventListener('click', () => {
    const card = $('.fact', factsRow);
    factsRow.scrollBy({ left: Number(b.dataset.facts) * (card.offsetWidth + 18), behavior: 'smooth' });
  }));

  $('#instaMore').addEventListener('click', () => {
    $('#insta').classList.add('is-all');
    if (hasGSAP && !staticMode) ScrollTrigger.refresh();
  });

  if (!touch) {
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

  /* ---------- Anchors (lenis-aware, knows where each product panel lives) ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id.length > 1 && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    anchoring = Date.now() + 1800;
    header.classList.remove('is-hidden');
    let y = null;
    if (productsST && target.classList.contains('panel')) {
      const dist = $('.products__track').scrollWidth - innerWidth;
      y = productsST.start + (target.offsetLeft / dist) * (productsST.end - productsST.start);
    }
    if (lenis) lenis.scrollTo(y ?? target, { offset: y == null ? -70 : 0, duration: 1.4 });
    else if (y != null) scrollTo({ top: y, behavior: 'smooth' });
    else scrollTo({ top: target.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------------
     Static page: everything visible, no pinning
     ------------------------------------------------------------------------ */
  // run fn without moving what the reader is looking at
  function keepPlace(fn) {
    const el = scrollY > 50 && document.elementFromPoint(innerWidth / 2, Math.min(140, innerHeight / 3));
    const sec = el && el.closest('section, footer, .marquees');
    const top = sec ? sec.getBoundingClientRect().top : 0;
    fn();
    if (sec) scrollTo(0, sec.getBoundingClientRect().top + scrollY - top);
  }
  function showStatic() {
    $$('[data-pose]').forEach((g) => g.setAttribute('transform', g.dataset.pose));
    root.classList.remove('anim');
    root.classList.add('reduced', 'ready');
  }
  if (staticMode) { showStatic(); return; }

  /* ------------------------------------------------------------------------
     Motion — set up after load, when the main thread is free, so the first
     screen paints without waiting for it
     ------------------------------------------------------------------------ */
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1));
  const whenLoaded = (f) => (document.readyState === 'complete' ? idle(f, { timeout: 600 }) : addEventListener('load', () => idle(f, { timeout: 600 }), { once: true }));
  whenLoaded(motion);
  function motion() {
  if (cannotScroll()) { staticMode = true; showStatic(); return; }
  const placeEl = scrollY > 50 && document.elementFromPoint(innerWidth / 2, Math.min(140, innerHeight / 3));
  const placeSec = placeEl && placeEl.closest('section, footer, .marquees');
  const placeTop = placeSec ? placeSec.getBoundingClientRect().top : 0;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  root.classList.add('anim');
  let lenisTick = null;
  if (!touch && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    lenisTick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(lenisTick);
    gsap.ticker.lagSmoothing(0);
  }

  // jerky strips that burst out of the hero pack
  const strips = [];
  const stripsBox = $('.hero__strips');
  {
    const mob = innerWidth <= 700, count = mob ? 8 : 14, rr = rng(9);
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'strip';
      el.style.setProperty('--w', `${Math.round((mob ? 84 : 130) + rr() * (mob ? 56 : 110))}px`);
      el.innerHTML = `<img src="${asset(`assets/img/art/jerky-${String((i % 8) + 1).padStart(2, '0')}.svg`)}" alt="" width="200" height="100">`;
      stripsBox.appendChild(el);
      strips.push(el);
    }
  }

  const mm = gsap.matchMedia();
  let marqueeTick = null;

  let ctx = null;
  try {
  ctx = gsap.context(() => {
    /* ---------- HERO: pack bursts, strips scatter; scroll back to reassemble ---------- */
    const hero = $('.hero'), stage = $('.hero__stage'), packwrap = $('.hero__packwrap');
    mm.add({ mob: '(max-width: 700px)', desk: '(min-width: 701px)' }, (c) => {
      const mob = c.conditions.mob;
      gsap.set(packwrap, { xPercent: -50, yPercent: mob ? 0 : -50, x: 0, y: 0 });
      gsap.set('.hero__copy', { yPercent: mob ? 0 : -46, y: 0 });
      const deco = $$('.hero__glow, .hero__ring');
      gsap.set(deco, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
      const W = () => stage.offsetWidth, H = () => stage.offsetHeight;
      const pcx = () => packwrap.offsetLeft;
      const pcy = () => packwrap.offsetTop + (mob ? packwrap.offsetHeight / 2 : 0);
      const tr = rng(2024), n = strips.length;
      const tg = strips.map((_, i) => ({
        a: (i / n) * Math.PI * 2 + (tr() - 0.5) * 0.45 - Math.PI / 2,
        k: 0.8 + tr() * 0.32, rot: (tr() - 0.5) * 140, s: 0.8 + tr() * 0.5,
      }));
      const rx = mob ? 0.42 : 0.41, ry = mob ? 0.4 : 0.37;
      const tx = (i, el) => W() / 2 + Math.cos(tg[i].a) * W() * rx * tg[i].k - el.offsetWidth / 2;
      const ty = (i, el) => H() * 0.5 + Math.sin(tg[i].a) * H() * ry * tg[i].k - el.offsetHeight / 2;

      gsap.timeline({
        scrollTrigger: {
          trigger: hero, start: 'top top', end: () => `+=${H() * (mob ? 1 : 1.5)}`,
          scrub: mob ? 0.4 : 0.8, pin: true, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 3,
        },
      })
        .to('.hero__copy', { y: -110, opacity: 0, duration: 0.3, ease: 'power1.in' }, 0)
        .to('.hero__badges, .hero__scroll', { opacity: 0, duration: 0.1 }, 0)
        .to('.hero__photo', { y: 80, rotation: -16, opacity: 0, duration: 0.22, ease: 'power1.in' }, 0)
        .to(packwrap, { x: () => W() / 2 - pcx(), y: () => H() * 0.5 - pcy(), scale: mob ? 1.3 : 1.12, rotation: -7, duration: 0.34, ease: 'power2.inOut' }, 0)
        .to(deco, { x: (i, el) => W() / 2 - el.offsetLeft, y: (i, el) => H() / 2 - el.offsetTop, duration: 0.34, ease: 'power2.inOut' }, 0)
        .fromTo(strips,
          { x: (i, el) => W() / 2 - el.offsetWidth / 2, y: (i, el) => H() * 0.5 - el.offsetHeight / 2, scale: 0.12, rotation: 0, opacity: 0 },
          { x: tx, y: ty, scale: (i) => tg[i].s, rotation: (i) => tg[i].rot, opacity: 1, duration: 0.42, ease: 'power3.out', stagger: 0.012 }, 0.3)
        .to(packwrap, { y: () => H() - pcy() + 40, scale: 0.7, rotation: 8, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.6)
        .fromTo('.hero__after', { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 0.66)
        .to(strips, {
          x: (i) => `+=${Math.cos(tg[i].a) * 46}`, y: (i) => `+=${Math.sin(tg[i].a) * 46}`,
          rotation: (i) => `+=${tg[i].rot > 0 ? 18 : -18}`, duration: 0.36, ease: 'none',
        }, 0.64);
    });

    /* ---------- PRODUCTS: horizontal track on desktop ---------- */
    const track = $('.products__track'), bar = $('.products__progress i');
    const panels = $$('.panel:not(.panel--intro)');
    mm.add('(min-width: 900px)', () => {
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '.products__pin', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, refreshPriority: 2,
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
          y: 50, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 85%' },
        });
      });
    });

    /* ---------- SLICER: knife runs along, then the sausage falls into slices ---------- */
    const segs = $$('.sl-seg'), faces = $$('.sl-face'), cuts = $$('.sl-cut'), knife = $('.sl-knife');
    if (segs.length) {
      const X0 = 150, X1 = 1050, N = segs.length;
      // the HTML ships the "already sliced" pose for the static page; start joined instead
      segs.concat(faces).forEach((g) => g.removeAttribute('transform'));
      gsap.set(faces, { scaleX: 0, transformOrigin: '50% 50%' });
      gsap.set(knife, { x: X0 - 50, opacity: 1 });
      const mob = innerWidth <= 700;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.slicer__pin', start: 'top top', end: mob ? '+=90%' : '+=140%', pin: true, scrub: 0.6, anticipatePin: 1, refreshPriority: 1 },
      });
      tl.to(knife, { x: X1 + 50, duration: 1, ease: 'none' }, 0);
      cuts.forEach((c, i) => tl.to(c, { opacity: 1, duration: 0.04 }, (X0 + ((i + 1) * (X1 - X0)) / N - (X0 - 50)) / (X1 - X0 + 100)));
      tl.to(knife, { opacity: 0, duration: 0.12 }, 0.98).to(cuts, { opacity: 0, duration: 0.15 }, 1.05);
      segs.forEach((g, i) => {
        const off = i - (N - 1) / 2;
        tl.to(g, { x: off * 36, y: (i % 2 ? 1 : -1) * 10, rotation: off * 1.6, svgOrigin: `${g.dataset.cx} 150`, duration: 1.2, ease: 'power2.inOut' }, 1.05);
      });
      tl.to(faces, { scaleX: 0.42, duration: 1, ease: 'power2.out', stagger: 0.03 }, 1.15);
    }

    /* ---------- marquees: constant drift, faster and reversed with scroll ---------- */
    const loops = $$('.marquee').map((m) => {
      const trk = $('.marquee__track', m), item = $('.marquee__item', trk);
      const w = item.offsetWidth;
      if (!w) return null;
      for (let i = 0, need = Math.ceil((innerWidth * 2) / w) + 1; i < need; i++) trk.appendChild(item.cloneNode(true));
      const dir = Number(m.dataset.marquee);
      const t = gsap.fromTo(trk, { x: dir > 0 ? 0 : -w }, { x: dir > 0 ? -w : 0, duration: w / 70, ease: 'none', repeat: -1 });
      t.totalTime(t.duration() * 1000); // room to play backwards when scrolling up
      return t;
    }).filter(Boolean);
    let boost = 0, sign = 1;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => { boost = Math.min(5, Math.abs(self.getVelocity()) / 260); sign = self.direction; },
    });
    marqueeTick = () => {
      boost *= 0.93;
      loops.forEach((t) => t.timeScale(sign * (1 + boost)));
    };
    gsap.ticker.add(marqueeTick);

    /* ---------- manifesto: words light up as you read ---------- */
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
      gsap.fromTo($$('.w', el), { opacity: 0.14 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: true },
      });
    });

    /* ---------- process line + steps ---------- */
    gsap.fromTo('.steps__line i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 62%', end: 'bottom 62%', scrub: true } });
    $$('.step').forEach((st) => {
      ScrollTrigger.create({ trigger: st, start: 'top 62%', onEnter: () => st.classList.add('is-on'), onLeaveBack: () => st.classList.remove('is-on') });
    });

    /* ---------- compare slider hint ---------- */
    if (cbox) {
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

    /* ---------- steppe layers and story collage at different depths ---------- */
    $$('.steppe [data-depth]').forEach((g) => {
      const d = Number(g.dataset.depth);
      gsap.fromTo(g, { y: -d * 90 }, { y: d * 90, ease: 'none', scrollTrigger: { trigger: '.steppe', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.story [data-speed]').forEach((el) => {
      const s = Number(el.dataset.speed) * (touch ? 0.5 : 1);
      gsap.fromTo(el, { y: -s }, { y: s, ease: 'none', scrollTrigger: { trigger: '.story__collage', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* ---------- floating packs and pieces ---------- */
    gsap.to('.product__visual > .pack', { y: -14, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4 });
    $$('.product__piece').forEach((p, i) => {
      gsap.to(p, { y: i % 2 ? 16 : -16, rotation: i % 2 ? 8 : -10, duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });

    /* ---------- reveals (.anim hides them in CSS until they scroll in) ---------- */
    // once in, the element is marked .is-in (CSS stops hiding it) and its inline styles
    // are dropped, so hover lifts and transitions work again
    const show = (b) => gsap.to(b, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out', overwrite: true,
      stagger: { each: 0.07, onComplete() { const el = this.targets()[0]; el.classList.add('is-in'); gsap.set(el, { clearProps: 'transform,opacity' }); } },
    });
    ScrollTrigger.batch('.reveal, .tile, .fact', { start: 'top 90%', once: true, onEnter: show, onLeave: show });

    /* ---------- hero pack floats ---------- */
    gsap.to('.hero__packwrap .pack', { y: -12, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  });
  } catch (err) {
    // a broken scene must never leave the page hidden
    console.error(err);
    mm.revert();
    if (ctx) ctx.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill(true));
    if (marqueeTick) gsap.ticker.remove(marqueeTick);
    staticMode = true;
    showStatic();
    return;
  }
  root.classList.add('ready');

  // fonts change text widths; images change heights — re-measure once they land
  if (document.fonts) {
    if (document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', () => ScrollTrigger.refresh());
  }
  ScrollTrigger.refresh();
  let target = null;
  try { target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { /* bad hash */ }
  if (target) scrollTo(0, target.getBoundingClientRect().top + scrollY - 70);
  else if (placeSec) scrollTo(0, placeSec.getBoundingClientRect().top + scrollY - placeTop);

  // if the host turns out not to scroll this window, fall back to the static page
  function goStatic() {
    if (staticMode) return;
    staticMode = true;
    if (marqueeTick) gsap.ticker.remove(marqueeTick);
    if (lenisTick) gsap.ticker.remove(lenisTick);
    keepPlace(() => { mm.revert(); ctx.revert(); });
    strips.forEach((s) => s.remove());
    if (lenis) { lenis.destroy(); lenis = null; }
    productsST = null;
    keepPlace(showStatic);
  }
  let rt, lastW = innerWidth;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const typing = /^(INPUT|TEXTAREA)$/.test((document.activeElement || {}).tagName);
      const widthChanged = innerWidth !== lastW;
      lastW = innerWidth;
      if (!typing && (widthChanged || innerHeight > 1800) && cannotScroll()) goStatic();
    }, 250);
  });
  }
})();
