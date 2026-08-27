/* ============================================================================
   «Путь к лёгкости и энергии» — персональная консультация нутрициолога.
   Генератор деки. Вся дизайн-система живёт в константах ниже: правь их,
   а не отдельные слайды.
   Сборка:  node build_deck.js
   ========================================================================= */
const pptxgen = require('pptxgenjs');

/* ------------------------------- ХОЛСТ ---------------------------------- */
const W = 13.333, H = 7.5;
const M = 0.75;                       // поля слева/справа
const CW = W - 2 * M;                 // рабочая ширина 11,833"
const RIGHT = W - M;                  // правый край контента 12,583"

const KICK_Y  = 0.60;                 // верх кикера = верхнее поле
const TITLE_Y = 0.90;                 // единая базовая линия заголовка
const BODY_Y  = 1.95;                 // верх контентной зоны
const FOOT_Y  = 6.95;                 // номер слайда
const BOTTOM  = 6.65;                 // нижняя граница контента

/* ------------------------------ ПАЛИТРА --------------------------------- */
const BG_BASE   = 'FBF9F5';   // тёплый белый — фон по умолчанию
const BG_CARD   = 'EDE8DD';   // песочный — карточки
const BG_DEEP   = '1E2A24';   // тёмно-зелёный графит — акцентные слайды
const BG_DEEP_2 = '2A3A32';   // карточка на тёмном слайде
const INK       = '1E2A24';   // основной текст
const INK_SOFT  = '5A655F';   // подписи
const PAPER     = 'F4F1EA';   // текст на тёмном
const PAPER_SOFT= 'A8B3AC';   // подписи на тёмном
const BRAND     = '2F6B4F';   // акцент №1
const BRASS     = 'C89A4B';   // акцент №2 — только заливки и текст на тёмном
const BRASS_INK = '85611F';   // тот же акцент, затемнён до 4,6:1 даже на песочной карточке
const WARN      = 'AE453A';   // «так не работает» — затемнён до 4,6:1 на песочной карточке
const OK        = '4E8F6D';   // «так работает»
const SAGE      = '8FA89B';   // третий сектор диаграммы
const RULE      = 'E0DACB';   // разделители

/* ---------------------------- ТИПОГРАФИКА -------------------------------
   Дек свёрстан в Arial. Причина техническая: в окружении сборки нет ни
   Montserrat, ни Inter, и PDF для клиента рендерится здесь же — вписать
   их имена значило бы отдать клиенту файл в случайной подстановке.
   Arial есть в любом Office и имеет полную кириллицу.
   Если у автора установлены Montserrat и Inter — поменять две строки ниже. */
const F_HEAD = 'Arial';
const F_BODY = 'Arial';

const T = {
  cover:   { fontSize: 54, bold: true,  fontFace: F_HEAD, lineSpacingMultiple: 1.10 },
  title:   { fontSize: 36, bold: true,  fontFace: F_HEAD, lineSpacingMultiple: 1.15 },
  stmt:    { fontSize: 38, bold: true,  fontFace: F_HEAD, lineSpacingMultiple: 1.15 },
  lead:    { fontSize: 22, fontFace: F_BODY, lineSpacingMultiple: 1.40 },
  leadB:   { fontSize: 22, bold: true, fontFace: F_BODY, lineSpacingMultiple: 1.25 },
  head:    { fontSize: 20, bold: true,  fontFace: F_HEAD, lineSpacingMultiple: 1.20 },
  body:    { fontSize: 18, fontFace: F_BODY, lineSpacingMultiple: 1.50 },
  small:   { fontSize: 15, fontFace: F_BODY, lineSpacingMultiple: 1.40 },
  cap:     { fontSize: 13, fontFace: F_BODY, lineSpacingMultiple: 1.40 },
  num:     { fontSize: 72, bold: true,  fontFace: F_HEAD, lineSpacingMultiple: 1.00 },
};
const KICKER = { fontSize: 13, bold: true, fontFace: F_BODY, charSpacing: 1.4 };

const RAD = 0.16;             // радиус карточек
const IMG = 'assets/', ICO = 'icons/';

/* ----------------------------- ПОМОЩНИКИ -------------------------------- */
const pres = new pptxgen();
pres.defineLayout({ name: 'DECK', width: W, height: H });
pres.layout = 'DECK';
pres.author = 'Нутрициолог Ольга Алёхина';
pres.title  = 'Путь к лёгкости и энергии';

const txt = (slide, text, opts) =>
  slide.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: 'top' }, opts));

const card = (slide, x, y, w, h, fill) =>
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: RAD, fill: { color: fill }, line: { color: fill } });

function newSlide(dark) {
  const s = pres.addSlide();
  s.background = { color: dark ? BG_DEEP : BG_BASE };
  return s;
}

function kicker(slide, text, dark) {
  txt(slide, text.toUpperCase(), Object.assign({}, KICKER,
    { x: M, y: KICK_Y, w: CW, h: 0.22, color: dark ? BRASS : BRASS_INK }));
}

function title(slide, text, dark, h) {
  txt(slide, text, Object.assign({}, T.title,
    { x: M, y: TITLE_Y, w: CW, h: h || 0.72, color: dark ? PAPER : INK }));
}

function pageNo(slide, n, dark) {
  txt(slide, String(n), Object.assign({}, T.cap,
    { x: RIGHT - 1.0, y: FOOT_Y, w: 1.0, h: 0.25, align: 'right',
      color: dark ? PAPER_SOFT : INK_SOFT }));
}

/** круглый бейдж с номером шага */
function badge(slide, n, x, y, d, fill, color) {
  slide.addShape(pres.ShapeType.ellipse,
    { x, y, w: d, h: d, fill: { color: fill || BRAND }, line: { color: fill || BRAND } });
  txt(slide, String(n), { x, y, w: d, h: d, align: 'center', valign: 'middle',
    fontSize: Math.round(d * 32), bold: true, fontFace: F_HEAD, color: color || 'FFFFFF' });
}

const icon = (slide, name, hex, x, y, d) =>
  slide.addImage({ path: `${ICO}${name}_${hex}.png`, x, y, w: d, h: d });

/* ======================= 1 — ОБЛОЖКА (тёмный) =========================== */
{
  const s = newSlide(true);
  s.addImage({ path: IMG + 'cover.jpg', x: M, y: 0.78, w: 4.30, h: 5.95 });
  const cx = 5.55, cw = RIGHT - 5.55;
  txt(s, 'ПЕРСОНАЛЬНАЯ КОНСУЛЬТАЦИЯ НУТРИЦИОЛОГА',
      Object.assign({}, KICKER, { x: cx, y: 1.35, w: cw, h: 0.22, color: BRASS }));
  txt(s, 'Путь к лёгкости\nи энергии', Object.assign({}, T.cover,
      { x: cx, y: 1.75, w: cw, h: 1.75, color: PAPER }));
  txt(s, 'Разбор твоего дневника питания и план на первую неделю.',
      Object.assign({}, T.lead, { x: cx, y: 3.78, w: cw, h: 0.95, color: PAPER_SOFT }));
  txt(s, 'Нутрициолог Ольга Алёхина',
      Object.assign({}, T.leadB, { x: cx, y: 5.35, w: cw, h: 0.42, color: PAPER }));
  txt(s, 'Telegram: @olga_nutri_health',
      Object.assign({}, T.body, { x: cx, y: 5.82, w: cw, h: 0.38, color: BRASS }));
  txt(s, '[дата консультации]',
      Object.assign({}, T.cap, { x: cx, y: 6.28, w: cw, h: 0.3, color: PAPER_SOFT }));
  s.addNotes('Это персональный разбор, а не общая лекция о питании. Всё, что дальше, ' +
    'построено на её дневнике. Проговорить вслух: цель — не похудеть любой ценой, ' +
    'а убрать скачки энергии; вес уйдёт следом.');
}

/* ========================= 2 — ЧТО ВНУТРИ =============================== */
{
  const s = newSlide(false);
  kicker(s, 'Маршрут', false);
  title(s, 'Что внутри');
  txt(s, 'Пять шагов — от того, где ты сейчас, до плана на первую неделю.',
      Object.assign({}, T.lead, { x: M, y: 1.88, w: CW, h: 0.45, color: INK_SOFT }));
  card(s, M, 2.60, CW, 3.95, BG_CARD);
  const rows = [
    ['Точка А и точка Б', 'где ты сейчас и куда идём'],
    ['Твой дневник',      'три наблюдения, которые я в нём увидела'],
    ['Механика',          'почему тянет на сладкое — это физиология'],
    ['Инструменты',       'тарелка, гибкий завтрак, правило 90/10'],
    ['План',              'два действия на неделю и что замеряем'],
  ];
  rows.forEach((r, i) => {
    const y = 2.90 + i * 0.70;
    badge(s, i + 1, 1.15, y + 0.05, 0.50);
    txt(s, r[0], Object.assign({}, T.head, { x: 1.90, y: y + 0.06, w: 3.60, h: 0.45, color: INK }));
    txt(s, r[1], Object.assign({}, T.body, { x: 5.70, y: y + 0.08, w: 6.40, h: 0.45, color: INK_SOFT }));
  });
  pageNo(s, 2);
  s.addNotes('Держать 20–30 секунд. Смысл слайда — снять тревогу: она видит, ' +
    'что разговор конечен и заканчивается конкретным планом, а не списком запретов.');
}

/* ========================== 3 — ТОЧКА А ================================= */
{
  const s = newSlide(false);
  kicker(s, 'Точка А', false);
  title(s, 'Где ты сейчас');
  const facts = [
    ['Scale',       'ВЕС НА СТАРТЕ',   '[указать] кг'],
    ['Ruler',       'РОСТ',            '[указать] см'],
    ['AlarmClock',  'ПОДЪЁМ',          '4:00–5:00 или 7:00–8:00, по сменам'],
    ['Package',     'АКТИВНОСТЬ',      'Высокая бытовая, весь день на ногах'],
    ['NotebookPen', 'ДНЕВНИК ПИТАНИЯ', 'Ведёшь честно и подробно'],
  ];
  facts.forEach((f, i) => {
    const y = BODY_Y + 0.10 + i * 0.82;
    icon(s, f[0], BRAND, M, y + 0.08, 0.44);
    txt(s, f[1], Object.assign({}, T.cap, { x: 1.42, y: y, w: 4.90, h: 0.24,
        color: INK_SOFT, charSpacing: 0.8, bold: true }));
    txt(s, f[2], Object.assign({}, T.body, { x: 1.42, y: y + 0.26, w: 4.90, h: 0.40, color: INK }));
  });
  card(s, 7.55, BODY_Y + 0.10, 5.03, 4.40, BG_CARD);
  txt(s, 'Что уже работает на тебя', Object.assign({}, T.head,
      { x: 8.00, y: 2.45, w: 4.13, h: 0.40, color: BRAND }));
  txt(s, 'Высокая бытовая активность. Ты весь день на ногах с посылками — это база, которую не нужно создавать с нуля.',
      Object.assign({}, T.body, { x: 8.00, y: 3.05, w: 4.13, h: 1.72, color: INK }));
  txt(s, 'Честный дневник. Без него разбор был бы догадками, а не работой с фактами.',
      Object.assign({}, T.body, { x: 8.00, y: 4.95, w: 4.13, h: 1.30, color: INK }));
  pageNo(s, 3);
  s.addNotes('Стартовые цифры в квадратных скобках заполнить перед отправкой. ' +
    'Правую карточку проговорить обязательно: разговор начинается с того, что у неё ' +
    'уже есть, а не с того, что не так.');
}

/* ========================== 4 — ТОЧКА Б ================================= */
{
  const s = newSlide(false);
  kicker(s, 'Точка Б', false);
  title(s, 'Куда идём');
  s.addImage({ path: IMG + 'fruitbody.jpg', x: M, y: BODY_Y + 0.10, w: 3.20, h: 4.40 });
  const cx = 4.35, cw = RIGHT - 4.35;
  txt(s, '75 кг', Object.assign({}, T.num, { x: cx, y: 1.95, w: cw, h: 1.15, color: BRASS_INK }));
  txt(s, 'цель, которую держим в голове', Object.assign({}, T.lead,
      { x: cx, y: 3.10, w: cw, h: 0.42, color: INK_SOFT }));
  const rows = [
    ['ТЕМП', '0,4–0,7 кг в неделю — здоровый коридор без потери мышц', null],
    ['СРОК', 'При темпе 0,5 кг в неделю — [X] недель', 'Посчитаем точно, когда будет стартовый вес.'],
    ['КАК ПОЙМЁМ, ЧТО ДОШЛИ', 'Вес держится две недели без усилий, энергия ровная', null],
  ];
  rows.forEach((r, i) => {
    const y = [3.70, 4.62, 5.72][i];
    txt(s, r[0], Object.assign({}, T.cap, { x: cx, y: y, w: cw, h: 0.24,
        color: INK_SOFT, charSpacing: 0.8, bold: true }));
    txt(s, r[1], Object.assign({}, T.body, { x: cx, y: y + 0.26, w: cw, h: 0.40, color: INK }));
    if (r[2]) txt(s, r[2], Object.assign({}, T.cap, { x: cx, y: y + 0.66, w: cw, h: 0.28, color: INK_SOFT }));
  });
  pageNo(s, 4);
  s.addNotes('Главное, что нужно донести: 75 кг — не дедлайн, а направление. ' +
    'Темп 0,4–0,7 кг в неделю назван вслух, чтобы снять ожидание минус пять за месяц. ' +
    'Срок считаем вместе, когда будет стартовый вес.');
}

/* ================== 5 — ЧТО Я УВИДЕЛА В ДНЕВНИКЕ ======================== */
{
  const s = newSlide(false);
  kicker(s, 'Наблюдения', false);
  title(s, 'Что я увидела в твоём дневнике');
  const items = [
    ['Activity', 'Скачки энергии',       'Сытость уходит через два часа, дальше резкий голод.'],
    ['Cookie',   'Тяга к сладкому',      'Чаще во второй половине дня и вечером.'],
    ['Salad',    'Мало белка и клетчатки','Сложных углеводов тоже мало — отсюда пустые калории.'],
  ];
  const cwid = (CW - 2 * 0.35) / 3;
  items.forEach((it, i) => {
    const x = M + i * (cwid + 0.35);
    card(s, x, 2.10, cwid, 3.70, BG_CARD);
    icon(s, it[0], BRAND, x + 0.45, 2.55, 0.58);
    txt(s, it[1], Object.assign({}, T.head, { x: x + 0.45, y: 3.40, w: cwid - 0.90, h: 0.78, color: INK }));
    txt(s, it[2], Object.assign({}, T.body, { x: x + 0.45, y: 4.28, w: cwid - 0.90, h: 1.32, color: INK_SOFT }));
  });
  card(s, M, 6.00, CW, 0.62, BG_CARD);
  txt(s, 'Это не список ошибок. Это три точки, на которые можно повлиять едой.',
      Object.assign({}, T.body, { x: M + 0.45, y: 6.14, w: CW - 0.90, h: 0.36, color: BRAND, bold: true }));
  pageNo(s, 5);
  s.addNotes('Тон здесь решает всё. Наблюдения читаются как данные из дневника, ' +
    'а не как претензии. Нижнюю плашку проговорить дословно.');
}

/* =================== 6 — ГЛАВНЫЙ ВЫВОД (тёмный) ========================= */
{
  const s = newSlide(true);
  kicker(s, 'Главный вывод', true);
  const cw = 7.00;
  txt(s, [
    { text: 'Тяга к сладкому — не слабая воля.', options: { color: PAPER, breakLine: true } },
    { text: 'Это физиологический голод.',        options: { color: BRASS } },
  ], Object.assign({}, T.stmt, { x: M, y: 1.40, w: cw, h: 3.65 }));
  txt(s, 'Быстрые углеводы поднимают сахар в крови и роняют его так же быстро. ' +
         'Организм снова требует топлива — и именно быстрого.',
      Object.assign({}, T.body, { x: M, y: 5.15, w: cw, h: 1.35, color: PAPER_SOFT }));
  s.addImage({ path: IMG + 'donut.jpg', x: RIGHT - 4.30, y: 2.05, w: 4.30, h: 3.40 });
  pageNo(s, 6, true);
  s.addNotes('Опорный слайд всей консультации. Если она уйдёт с одной мыслью — пусть ' +
    'уйдёт с этой. Снимает вину и переводит разговор с силы воли на состав тарелки.');
}

/* ================ 7 — МЕХАНИКА КАЧЕЛЕЙ (график) ========================= */
{
  const s = newSlide(false);
  kicker(s, 'Механика', false);
  title(s, 'Солома горит минуту, дрова — пять часов');
  s.addChart(pres.ChartType.line, [
    { name: 'Солома', labels: ['0', '30 мин', '1 ч', '1,5 ч', '2 ч', '3 ч', '4 ч', '5 ч'],
      values: [20, 95, 62, 26, 16, 13, 11, 10] },
    { name: 'Дрова',  labels: ['0', '30 мин', '1 ч', '1,5 ч', '2 ч', '3 ч', '4 ч', '5 ч'],
      values: [20, 52, 66, 70, 68, 63, 55, 42] },
  ], {
    x: M, y: 2.05, w: 7.50, h: 4.30,
    chartColors: [WARN, OK], lineSize: 3, lineSmooth: true,
    showLegend: false, showValue: false, showTitle: false,
    catAxisLabelColor: INK_SOFT, catAxisLabelFontSize: 13, catAxisLabelFontFace: F_BODY,
    valAxisHidden: true, valAxisMaxVal: 105, valAxisMinVal: 0,
    catGridLine: { style: 'none' },
    valGridLine: { color: RULE, size: 1 },
    chartArea: { fill: { color: BG_BASE } },
    plotArea:  { fill: { color: BG_BASE } },
    border: { pt: 0, color: BG_BASE },
  });
  txt(s, 'энергия', Object.assign({}, T.cap, { x: M, y: 2.05, w: 1.4, h: 0.25, color: INK_SOFT }));
  txt(s, '«Солома»', Object.assign({}, T.small,
      { x: 2.55, y: 2.12, w: 1.5, h: 0.3, color: WARN, bold: true }));
  txt(s, '«Дрова»', Object.assign({}, T.small,
      { x: 4.95, y: 3.80, w: 1.4, h: 0.3, color: OK, bold: true }));

  const cx = 8.55, cw = RIGHT - 8.55;
  card(s, cx, 2.05, cw, 2.10, BG_CARD);
  txt(s, '«Солома»', Object.assign({}, T.head, { x: cx + 0.40, y: 2.35, w: cw - 0.80, h: 0.38, color: WARN }));
  txt(s, 'Булочка, конфета. Вспыхивает за минуты — через час резкий голод.',
      Object.assign({}, T.body, { x: cx + 0.40, y: 2.80, w: cw - 0.80, h: 1.15, color: INK }));
  card(s, cx, 4.30, cw, 2.35, BG_CARD);
  txt(s, '«Дрова»', Object.assign({}, T.head, { x: cx + 0.40, y: 4.60, w: cw - 0.80, h: 0.38, color: BRAND }));
  txt(s, 'Белок и сложные углеводы. Горят долго: сытость 4–5 часов, энергия ровная.',
      Object.assign({}, T.body, { x: cx + 0.40, y: 5.05, w: cw - 0.80, h: 1.40, color: INK }));
  pageNo(s, 7);
  s.addNotes('Метафора её собственная, из консультации, — держаться за неё. ' +
    'По графику вести пальцем: показать не пик, а провал после него — именно ' +
    'провал она чувствует как «опять хочу сладкого».');
}

/* ==================== 8 — ТАРЕЛКА БАЛАНСА (пирог) ======================= */
{
  const s = newSlide(false);
  kicker(s, 'Инструмент', false);
  title(s, 'Твой главный инструмент — тарелка');
  s.addChart(pres.ChartType.pie, [{
    name: 'Тарелка',
    labels: ['Клетчатка', 'Белок', 'Сложные углеводы'],
    values: [50, 25, 25],
  }], {
    x: 0.55, y: 2.00, w: 5.40, h: 3.90,
    chartColors: [BRAND, BRASS, SAGE],
    showLegend: false, showTitle: false,
    showValue: true, dataLabelPosition: 'outEnd',
    dataLabelColor: INK, dataLabelFontSize: 15, dataLabelFontFace: F_BODY,
    dataLabelFormatCode: '0"%"',
    chartArea: { fill: { color: BG_BASE } },
    plotArea:  { fill: { color: BG_BASE } },
    border: { pt: 0, color: BG_BASE },
  });
  const rows = [
    [BRAND, '50% Клетчатка — твой щит',       'Овощи, зелень, ягоды. Замедляет сахар.'],
    [BRASS, '25% Белок — твой тонус',          'Курица, рыба, яйца, творог. Сытость.'],
    [SAGE,  '25% Сложные углеводы — энергия',  'Крупы, макароны, хлеб. Энергия надолго.'],
  ];
  const cx = 6.35, cw = RIGHT - 6.35;
  rows.forEach((r, i) => {
    const y = 2.30 + i * 1.20;
    s.addShape(pres.ShapeType.roundRect, { x: cx, y: y + 0.07, w: 0.26, h: 0.26,
      rectRadius: 0.06, fill: { color: r[0] }, line: { color: r[0] } });
    txt(s, r[1], Object.assign({}, T.head, { x: cx + 0.48, y: y, w: cw - 0.48, h: 0.40, color: INK }));
    txt(s, r[2], Object.assign({}, T.body, { x: cx + 0.48, y: y + 0.48, w: cw - 0.48, h: 0.44, fontSize: 17, color: INK_SOFT }));
  });
  card(s, M, 5.98, CW, 0.66, BG_CARD);
  txt(s, 'Тарелка — это всегда 100%. Про любимую вкусняшку — на следующем слайде.',
      Object.assign({}, T.body, { x: M + 0.45, y: 6.13, w: CW - 0.90, h: 0.40, color: BRAND, bold: true }));
  pageNo(s, 8);
  s.addNotes('Проговорить, что это пропорции одной тарелки, а не суточные калории. ' +
    'Нижняя плашка — мостик к правилу 90/10: она снимает вопрос «а куда девать сладкое».');
}

/* ========================= 9 — ПРАВИЛО 90/10 ============================ */
{
  const s = newSlide(false);
  kicker(s, 'Правило', false);
  title(s, 'У вкусняшки есть своё место');
  const cwid = 5.70, gap = CW - 2 * cwid;
  const blocks = [
    [M, '90%', BRAND, 'рациона за день — сбалансированная еда: тарелка, белок, клетчатка, сложные углеводы.'],
    [M + cwid + gap, '10%', BRASS_INK, 'то, что ты любишь. Без пересчёта тарелки и без чувства вины.'],
  ];
  blocks.forEach(b => {
    card(s, b[0], 2.05, cwid, 3.40, BG_CARD);
    txt(s, b[1], Object.assign({}, T.num, { x: b[0] + 0.45, y: 2.40, w: cwid - 0.90, h: 1.15, color: b[2] }));
    txt(s, b[3], Object.assign({}, T.body, { x: b[0] + 0.45, y: 3.70, w: cwid - 0.90, h: 1.45, color: INK }));
  });
  card(s, M, 5.75, CW, 0.90, BG_DEEP);
  txt(s, 'Тарелка — про один приём пищи, 90/10 — про весь день. Разные шкалы.',
      Object.assign({}, T.body, { x: M + 0.45, y: 5.97, w: CW - 0.90, h: 0.46, color: PAPER, bold: true }));
  pageNo(s, 9);
  s.addNotes('Слайд закрывает арифметику: в прошлой версии проценты тарелки и «10% радости» ' +
    'складывались в 110. Здесь явно сказано, что это разные шкалы — тарелка про приём пищи, ' +
    '90/10 про день.');
}

/* ======================= 10 — ГИБКИЙ ЗАВТРАК ============================ */
{
  const s = newSlide(false);
  kicker(s, 'Инструмент', false);
  title(s, 'Завтрак подстраивается под твой подъём');
  const cwid = 5.70, gap = CW - 2 * cwid;
  const cols = [
    [M,                'nuts',   'AlarmClock', 'Подъём\n4:00–5:00', 'микро-завтрак',
     'Варёное яйцо и авокадо. Или натуральный йогурт с горстью орехов.'],
    [M + cwid + gap,   'omelet', 'Sunrise',    'Подъём\n7:00–8:00', 'сытный завтрак',
     'Омлет с сыром и овощами. Или овсянка с творогом.'],
  ];
  cols.forEach(c => {
    card(s, c[0], 2.05, cwid, 4.00, BG_CARD);
    s.addImage({ path: IMG + c[1] + '.jpg', x: c[0] + 0.45, y: 2.50, w: 2.10, h: 2.10 });
    icon(s, c[2], BRAND, c[0] + 2.90, 2.55, 0.50);
    txt(s, c[3], Object.assign({}, T.head, { x: c[0] + 2.90, y: 3.20, w: 2.35, h: 0.70, color: INK }));
    txt(s, c[4], Object.assign({}, T.small, { x: c[0] + 2.90, y: 3.95, w: 2.35, h: 0.30, color: BRASS_INK, bold: true }));
    txt(s, c[5], Object.assign({}, T.body, { x: c[0] + 0.45, y: 4.90, w: cwid - 0.90, h: 0.85, color: INK }));
  });
  pageNo(s, 10);
  s.addNotes('Ключ — слово «подстраивается». У неё смены, и жёсткий завтрак по часам ' +
    'она не выдержит. Оба сценария равноправны, выбирать по факту подъёма.');
}

/* ============== 11 — СЛАДКОЕ БЕЗ ЗАПРЕТОВ (тёмный) ====================== */
{
  const s = newSlide(true);
  s.addImage({ path: IMG + 'cake.jpg', x: RIGHT - 5.30, y: 0.62, w: 5.30, h: 6.00 });
  const cw = 6.15;
  kicker(s, 'Правило', true);
  txt(s, 'Сладкое остаётся в рационе', Object.assign({}, T.title,
      { x: M, y: TITLE_Y, w: cw, h: 1.30, color: PAPER }));
  card(s, M, 2.45, cw, 1.80, BG_DEEP_2);
  txt(s, 'ГЛАВНОЕ ПРАВИЛО', Object.assign({}, KICKER,
      { x: M + 0.40, y: 2.70, w: cw - 0.80, h: 0.24, color: BRASS }));
  txt(s, 'Конфета — только сразу после полноценной тарелки.',
      Object.assign({}, T.leadB, { x: M + 0.40, y: 3.05, w: cw - 0.80, h: 1.00, color: PAPER }));
  txt(s, 'Белок, жир и клетчатка из тарелки замедляют всасывание сахара. Тот же десерт ' +
         'не даёт резкого скачка — и не тянет за собой голод через час.',
      Object.assign({}, T.body, { x: M, y: 4.50, w: cw, h: 1.55, color: PAPER_SOFT }));
  txt(s, 'Ничего не запрещаем. Меняем только момент.',
      Object.assign({}, T.body, { x: M, y: 6.12, w: cw, h: 0.40, color: BRASS, bold: true }));
  pageNo(s, 11, true);
  s.addNotes('Самый важный слайд для удержания: если она услышит «сладкое можно», ' +
    'план не развалится на третий день. Подчеркнуть слово «сразу» — отложенная ' +
    'конфета через два часа работает уже как «солома».');
}

/* ========================= 12 — ПЕРВАЯ НЕДЕЛЯ =========================== */
{
  const s = newSlide(false);
  kicker(s, 'План', false);
  title(s, 'Первая неделя: два действия');
  const cwid = 5.70, gap = CW - 2 * cwid;
  const acts = [
    [M, 'Гибкий завтрак', 'Завтракаешь в течение часа после подъёма.'],
    [M + cwid + gap, 'Сладкое — после еды', 'Не отменяем. Сдвигаем на момент сразу после тарелки.'],
  ];
  acts.forEach((a, i) => {
    card(s, a[0], 2.00, cwid, 2.50, BG_CARD);
    badge(s, i + 1, a[0] + 0.45, 2.35, 0.62);
    txt(s, a[1], Object.assign({}, T.head, { x: a[0] + 1.25, y: 2.44, w: 4.00, h: 0.45, color: INK }));
    txt(s, a[2], Object.assign({}, T.body, { x: a[0] + 0.45, y: 3.25, w: cwid - 0.90, h: 1.15, color: INK_SOFT }));
  });
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const gx = 2.75, gw = 1.35, gp = 0.05;
  days.forEach((d, i) => {
    txt(s, d, Object.assign({}, T.cap, { x: gx + i * (gw + gp), y: 5.00, w: gw, h: 0.28,
        align: 'center', color: INK_SOFT, bold: true, charSpacing: 0.8 }));
  });
  [['Завтрак', 5.38], ['Сладкое', 6.03]].forEach(r => {
    txt(s, r[0], Object.assign({}, T.small, { x: M, y: r[1] + 0.13, w: 1.90, h: 0.32, color: INK }));
    for (let i = 0; i < 7; i++) {
      s.addShape(pres.ShapeType.roundRect, { x: gx + i * (gw + gp), y: r[1], w: gw, h: 0.55,
        rectRadius: 0.08, fill: { color: BG_CARD }, line: { color: RULE, width: 1 } });
    }
  });
  pageNo(s, 12);
  s.addNotes('Ровно два действия, не пять. Сетку внизу распечатать или перерисовать ' +
    'в заметки телефона и отмечать галочкой каждый вечер — это и будет отчёт к следующей встрече.');
}

/* ========================= 13 — ЧТО ЗАМЕРЯЕМ ============================ */
{
  const s = newSlide(false);
  kicker(s, 'Замеры', false);
  title(s, 'Смотрим не только на весы');
  card(s, M, 2.00, CW, 3.85, BG_CARD);
  const metrics = [
    ['BatteryCharging', 'Энергия днём',         true,  '1 — валит с ног, 5 — ровно'],
    ['Utensils',        'Голод между приёмами', true,  '5 — сытость держит долго'],
    ['Moon',            'Качество сна',         true,  '1 — разбитая, 5 — выспалась'],
    ['Candy',           'Тяга к сладкому',      true,  '5 — думаешь только о ней'],
    ['Scale',           'Вес',                  false, 'раз в неделю, утром, натощак'],
  ];
  metrics.forEach((m, i) => {
    const y = 2.35 + i * 0.68;
    icon(s, m[0], BRAND, 1.15, y + 0.06, 0.40);
    txt(s, m[1], Object.assign({}, T.body, { x: 1.75, y: y + 0.08, w: 4.40, h: 0.38, color: INK }));
    if (m[2]) {
      for (let j = 0; j < 5; j++) {
        s.addShape(pres.ShapeType.ellipse, { x: 6.55 + j * 0.42, y: y + 0.13, w: 0.26, h: 0.26,
          fill: { color: BG_BASE }, line: { color: BRAND, width: 1.25 } });
      }
    }
    txt(s, m[3], Object.assign({}, T.cap, { x: 8.90, y: y + 0.13, w: 3.35, h: 0.30, color: INK_SOFT }));
  });
  txt(s, 'Вес может стоять неделю, пока меняются объёмы и состав тела. Это нормально.',
      Object.assign({}, T.body, { x: M, y: 6.05, w: CW, h: 0.42, color: BRAND, bold: true }));
  pageNo(s, 13);
  s.addNotes('Смысл — снять зависимость от весов. Четыре шкалы 1–5 отмечать вечером, ' +
    'занимает полминуты. Именно они покажут результат раньше, чем весы.');
}

/* ======================= 14 — ЕСЛИ СОРВАЛАСЬ ============================ */
{
  const s = newSlide(false);
  kicker(s, 'Страховка', false);
  title(s, 'Если день пошёл не по плану');
  const items = [
    ['Не отыгрываемся',      'Следующий приём пищи — обычный, по тарелке.'],
    ['Не ждём понедельника', 'Возвращаемся с ближайшего приёма пищи.'],
    ['Записываем как есть',  'В дневник идёт всё. Это данные, а не приговор.'],
  ];
  const cwid = (CW - 2 * 0.35) / 3;
  items.forEach((it, i) => {
    const x = M + i * (cwid + 0.35);
    card(s, x, 2.05, cwid, 3.55, BG_CARD);
    badge(s, i + 1, x + 0.45, 2.40, 0.62);
    txt(s, it[0], Object.assign({}, T.head, { x: x + 0.45, y: 3.15, w: cwid - 0.90, h: 0.94, color: INK }));
    txt(s, it[1], Object.assign({}, T.body, { x: x + 0.45, y: 4.20, w: cwid - 0.90, h: 1.24, fontSize: 17, color: INK_SOFT }));
  });
  card(s, M, 5.85, CW, 0.80, BG_DEEP);
  txt(s, 'Один день ничего не решает. Решает то, что ты делаешь завтра.',
      Object.assign({}, T.head, { x: M + 0.45, y: 6.08, w: CW - 0.90, h: 0.45, color: PAPER }));
  pageNo(s, 14);
  s.addNotes('Этот слайд снимает главный страх перед стартом. Проговорить заранее, ' +
    'до того как срыв случится, — тогда он не станет поводом всё бросить.');
}

/* =================== 15 — ЧТО ДАЛЬШЕ (тёмный) =========================== */
{
  const s = newSlide(true);
  kicker(s, 'Следующий шаг', true);
  title(s, 'Что дальше', true);
  const steps = [
    ['CalendarCheck', 'Неделя 1',              'Гибкий завтрак, сладкое — после еды.'],
    ['NotebookPen',   'Дневник и шкалы',       'Записи плюс четыре оценки 1–5 вечером.'],
    ['MessageCircle', 'Через 7 дней — разбор', 'Смотрим, что сработало и что меняем.'],
  ];
  steps.forEach((st, i) => {
    const y = 2.25 + i * 1.05;
    icon(s, st[0], PAPER, M, y + 0.04, 0.44);
    txt(s, st[1], Object.assign({}, T.head, { x: 1.35, y: y, w: 5.90, h: 0.40, color: PAPER }));
    txt(s, st[2], Object.assign({}, T.body, { x: 1.35, y: y + 0.44, w: 5.90, h: 0.45, color: PAPER_SOFT }));
  });
  card(s, 7.30, 2.20, RIGHT - 7.30, 2.65, BG_DEEP_2);
  txt(s, 'СВЯЗЬ', Object.assign({}, KICKER, { x: 7.75, y: 2.50, w: 4.38, h: 0.24, color: BRASS }));
  txt(s, '@olga_nutri_health', Object.assign({}, T.leadB, { x: 7.75, y: 2.85, w: 4.38, h: 0.45, color: PAPER }));
  txt(s, 'Telegram', Object.assign({}, T.small, { x: 7.75, y: 3.32, w: 4.38, h: 0.30, color: PAPER_SOFT }));
  txt(s, 'Пиши, если что-то не сходится. Не жди конца недели.',
      Object.assign({}, T.body, { x: 7.75, y: 3.80, w: 4.38, h: 0.85, color: PAPER_SOFT }));
  txt(s, 'Материал носит рекомендательный характер и не заменяет консультацию врача. ' +
         'При хронических заболеваниях, беременности, приёме лекарств или отклонениях в анализах ' +
         'согласуй изменения питания с лечащим врачом.',
      Object.assign({}, T.cap, { x: M, y: 5.95, w: CW, h: 0.80, color: PAPER_SOFT }));
  pageNo(s, 15, true);
  s.addNotes('Закрыть конкретикой: что она делает завтра утром и когда мы встречаемся снова. ' +
    'Дисклеймер не зачитывать вслух, но он обязан быть в файле.');
}

pres.writeFile({ fileName: 'put-k-legkosti.pptx' })
  .then(f => console.log('готово:', f));
