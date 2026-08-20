// Собирает pdf/services-print.html в PDF через Chromium.
// Запуск: node pdf/build.js [путь-к-fonts.css]
// Необязательный fonts.css с data-URI шрифтами нужен только там, где нет доступа
// к Google Fonts (например, в песочнице) — иначе шрифты тянутся по <link>.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'pdf', 'services-print.html');
const OUT = path.join(ROOT, 'nutrition-services.pdf');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + SRC, { waitUntil: 'networkidle' });

  const fontsCss = process.argv[2];
  if (fontsCss && fs.existsSync(fontsCss)) await p.addStyleTag({ content: fs.readFileSync(fontsCss, 'utf8') });

  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);

  const used = await p.evaluate(() => {
    const f = n => getComputedStyle(n).fontFamily.split(',')[0].replace(/["']/g, '');
    return { заголовок: f(document.querySelector('h1')), текст: f(document.querySelector('.intro')),
             фото: !!document.querySelector('.cover-photo img').naturalWidth };
  });

  await p.pdf({ path: OUT, printBackground: true, preferCSSPageSize: true });
  console.log(used, '| ошибок:', errs.join('|') || 'нет');
  console.log('PDF:', OUT, (fs.statSync(OUT).size / 1024 / 1024).toFixed(2) + ' MB');
  await b.close();
})();
