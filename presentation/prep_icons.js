/* Монолинейные иконки Lucide -> PNG.
   Один набор, один вес обводки, один цвет на слайд-тип. Эмодзи в деке нет. */
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const lu = require('react-icons/lu');
const sharp = require('sharp');
const fs = require('fs');

const SIZE = 256;
const BRAND = '2F6B4F';
const PAPER = 'F4F1EA';

const JOBS = [
  ['Scale', BRAND], ['Ruler', BRAND], ['AlarmClock', BRAND], ['Package', BRAND],
  ['NotebookPen', BRAND], ['Activity', BRAND], ['Cookie', BRAND], ['Salad', BRAND],
  ['Sunrise', BRAND], ['BatteryCharging', BRAND], ['Utensils', BRAND],
  ['Moon', BRAND], ['Candy', BRAND], ['Target', BRAND],
  ['MessageCircle', PAPER], ['CalendarCheck', PAPER], ['NotebookPen', PAPER],
];

fs.mkdirSync('icons', { recursive: true });

(async () => {
  for (const [name, hex] of JOBS) {
    const Icon = lu['Lu' + name];
    if (!Icon) throw new Error('нет иконки Lu' + name);
    let svg = ReactDOMServer.renderToStaticMarkup(
      React.createElement(Icon, { size: SIZE })
    );
    // currentColor не всегда доживает до растеризатора — подставляем цвет явно
    svg = svg.split('currentColor').join('#' + hex);
    const out = `icons/${name}_${hex}.png`;
    await sharp(Buffer.from(svg)).resize(SIZE, SIZE).png().toFile(out);
    console.log(out);
  }
})();
