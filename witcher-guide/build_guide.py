"""Builds the Witcher 3 checklist guide in English, Russian and Czech (HTML -> PDF)."""
import re
import subprocess
from pathlib import Path

HERE = Path(__file__).parent
STYLE = re.search(r"<style>(.*?)</style>", (HERE / "guide.html").read_text(), re.S).group(1)
STYLE += """
  .en{font-weight:400;font-style:normal;color:var(--soft);font-size:.86em}
  .cover h1{font-size:36pt}
"""
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

# Official localized quest names (verified). None = not verified -> English original is shown.
QUESTS = {
    "The Isle of Mists": ("Остров Туманов", "Ostrov mlh"),
    "Faithful Friend": (None, None),
    "Missing in Action": ("Пропавший без вести", None),
    "On Death's Bed": ("На смертном одре", "Na smrtelné posteli"),
    "Precious Cargo": ("Ценный груз", "Vzácný náklad"),
    "A Frying Pan, Spick and Span": ("Сковорода как новая", None),
    "Twisted Firestarter": ("Игра с огнём", None),
    "Contract: Devil by the Well": ("Заказ: Лихо у колодца", "Ďábel u studny"),
    "Magic Lamp": ("Магический светильник", "Magická lampa"),
    "A Towerful of Mice": ("Мышиная башня", "Myší věž"),
    "A Favor for a Friend": ("Дружеская услуга", "Laskavost pro přítele"),
    "For the Advancement of Learning": ("На благо науки", None),
    "A Matter of Life and Death": ("Вопрос жизни и смерти", "Otázka života a smrti"),
    "Now or Never": ("Сейчас или никогда", "Teď, nebo nikdy"),
    "Pyres of Novigrad": ("Костры Новиграда", None),
    "Carnal Sins": ("Смертные грехи", None),
    "An Eye for an Eye": ("Око за око", "Oko za oko"),
    "Reason of State": ("Дела государственной важности", "Zájmy státu"),
    "Possession": (None, "Posedlost"),
    "The Lord of Undvik": ("Владыка Ундвика", "Vládce Undviku"),
    "King's Gambit": ("Королевский гамбит", "Královský gambit"),
    "Brothers in Arms: Velen": ("Братья по оружию: Велен", "Bratři ve zbrani: Velen"),
    "Brothers in Arms: Novigrad": ("Братья по оружию: Новиград", "Bratři ve zbrani: Novigrad"),
    "Brothers in Arms: Skellige": ("Братья по оружию: Скеллиге", "Bratři ve zbrani: Skellige"),
    "The Fall of House Reardon": ("Падение дома Реардон", None),
    "Ghosts of the Past": ("Призраки прошлого", "Duchové minulosti"),
    "Blood on the Battlefield": ("Пейзаж после битвы", "Krev na bojišti"),
    "Final Preparations": ("Последние приготовления", "Poslední přípravy"),
    "Child of the Elder Blood": ("Дитя Старшей Крови", "Dítě Starší krve"),
    "Collect 'Em All": (None, None),
    "Open Sesame!": (None, None),
}
IDX = {"ru": 0, "cs": 1}


def build(lang):
    def t(en, ru, cs):
        return {"en": en, "ru": ru, "cs": cs}[lang]

    def q(name, it=True):
        """Quest name: localized + (English) where verified, else English original."""
        loc = QUESTS[name][IDX[lang]] if lang != "en" else None
        text = f"{loc} <span class='en'>({name})</span>" if loc else name
        return f"<span class='q'>{text}</span>" if it else text

    def li(name, note=None):
        return f"<li>{q(name, it=False)}" + (f"<small>{note}</small>" if note else "") + "</li>"

    FOLIO = t("Don't Miss a Thing", "Ничего не пропусти", "Nic nevynech")
    GW = t("Gwent", "Гвинт", "Gwint")
    ISLE = q("The Isle of Mists")

    def folio(n):
        return f'<div class="folio">{FOLIO} · {n}</div>'

    def cb():
        return '<td class="cb"><span></span></td>'

    pages = []

    # ---------------- COVER
    pages.append(f"""
<section class="page cover">
  <svg class="medal" viewBox="0 0 200 200" aria-hidden="true">
    <circle cx="100" cy="100" r="92" fill="none" stroke="#a88532" stroke-width="2"/>
    <circle cx="100" cy="100" r="82" fill="none" stroke="#a88532" stroke-width=".8" stroke-dasharray="2 4"/>
    <g fill="none" stroke="#c9a54a" stroke-width="3" stroke-linejoin="round">
      <path d="M100 30 L100 170"/><path d="M86 48 L100 30 L114 48"/><path d="M72 128 L128 128"/>
    </g>
    <g fill="none" stroke="#8e1b1b" stroke-width="2.5">
      <path d="M52 70 Q100 110 148 70"/><path d="M58 92 Q100 124 142 92"/>
    </g>
    <circle cx="100" cy="100" r="6" fill="#8e1b1b"/>
  </svg>
  <div class="pre">{t("Unofficial Player's Companion", "Неофициальный гайд для игроков", "Neoficiální průvodce pro hráče")}</div>
  <h1>{t("Don't Miss<br>a Thing", "Ничего<br>не пропусти", "Nic<br>nevynech")}</h1>
  <div class="sub">{t("Missables · Endings · Gwent", "Квесты · Концовки · Гвинт", "Úkoly · Konce · Gwint")}</div>
  <div class="bar"></div>
  <div class="inc">{t(
    "The printable checklist for The Witcher 3 Remastered — every point of no return, Ciri's five choices, every kingdom's fate and the Gwent cards you can lose forever.",
    "Чек-лист для «Ведьмак 3 Remastered»: все точки невозврата, пять выборов, которые решают судьбу Цири, судьбы королевств и карты гвинта, которые можно потерять навсегда.",
    "Tisknutelný checklist pro Zaklínač 3 Remastered — všechny body, odkud není návratu, pět rozhodnutí o osudu Ciri, osudy království a karty gwintu, o které můžeš přijít navždy.")}</div>
  <div class="foot">{t("Fan-made guide · Not affiliated with or endorsed by CD PROJEKT RED",
                        "Фанатский гайд · Не связан с CD PROJEKT RED и не одобрен ею",
                        "Fanouškovský průvodce · Není spojen s CD PROJEKT RED ani jím schválen")}</div>
</section>""")

    # ---------------- HOW TO USE
    toc = [
        ("I", t("The Three Points of No Return", "Три точки невозврата", "Tři body, odkud není návratu"), 3),
        ("II", t("White Orchard Checklist", "Чек-лист: Белый Сад", "Checklist: Bělosad"), 4),
        ("III", t("The Big One — Before the Isle of Mists", "Главное — до Острова Туманов", "To hlavní — před Ostrovem mlh"), 5),
        ("IV", t("Allies for the Battle of Kaer Morhen", "Союзники для битвы за Каэр Морхен", "Spojenci pro bitvu na Kaer Morhen"), 6),
        ("V", t("Ciri's Fate — The Five Moments", "Судьба Цири — пять моментов", "Osud Ciri — pět okamžiků"), 7),
        ("VI", t("The Fate of Kingdoms", "Судьбы королевств", "Osudy království"), 8),
        ("VII", t("Gwent — Cards You Can Lose Forever", "Гвинт — карты, которые можно потерять", "Gwint — karty, o které můžeš přijít"), 9),
        ("VIII", t("Hearts of Stone &amp; Blood and Wine", "«Каменные сердца» и «Кровь и вино»", "Srdce z kamene a O víně a krvi"), 10),
        ("IX", t("New in Remastered + Recommended Order", "Что нового в Remastered + порядок прохождения", "Novinky v Remastered + doporučené pořadí"), 11),
    ]
    toc_html = "".join(f"<li><span><b>{r}</b>{n}</span><span>{t('p.', 'с.', 's.')} {p}</span></li>" for r, n, p in toc)
    names_note = t("",
        '<div class="box steel"><div class="t">Названия квестов</div>Даны как в русской версии игры, в скобках — английский оригинал. Если русского названия нет, квест указан по-английски.</div>',
        '<div class="box steel"><div class="t">Názvy úkolů</div>Uvádíme je podle české verze hry, v závorce anglický originál. Kde český název chybí, je úkol uveden anglicky.</div>')
    pages.append(f"""
<section class="page">
  <div class="kicker">{t("Before you ride out", "Перед дорогой", "Než vyrazíš")}</div>
  <h2>{t("How to use this guide", "Как пользоваться гайдом", "Jak používat tohoto průvodce")}</h2>
  <div class="rule"></div>
  <p class="lede">{t(
    "The Witcher 3 is generous — until it isn't. A handful of story moments quietly close whole questlines, lock endings and remove Gwent cards for good. This guide shows you exactly where those moments are, so you can explore freely and never lose 100 hours of choices to one boat ride.",
    "«Ведьмак 3» щедр — до поры до времени. Несколько сюжетных моментов тихо закрывают целые цепочки квестов, блокируют концовки и навсегда забирают карты гвинта. Этот гайд показывает, где именно они находятся, чтобы вы спокойно исследовали мир и не потеряли 100 часов выборов из-за одной поездки на лодке.",
    "Zaklínač 3 je štědrý — dokud není. Pár příběhových okamžiků potichu uzavře celé linie úkolů, zamkne konce a navždy vezme karty gwintu. Tento průvodce ti přesně ukáže, kde tyto okamžiky jsou, abys mohl svobodně objevovat a nepřišel o 100 hodin rozhodnutí kvůli jedné plavbě lodí.")}</p>
  <h3>{t("What's inside", "Содержание", "Obsah")}</h3>
  <ol class="toc">{toc_html}</ol>
  <div class="cols" style="margin-top:5mm">
    <div class="box"><div class="t">{t("The golden rule", "Золотое правило", "Zlaté pravidlo")}</div>{t(
      "When the game offers you a boat to the <b>Isle of Mists</b>, stop. Make a separate save, open page 5, and tick every box first.",
      "Когда игра предложит лодку на <b>Остров Туманов</b> — остановитесь. Сделайте отдельное сохранение, откройте страницу 5 и сначала отметьте все пункты.",
      "Když ti hra nabídne loď na <b>Ostrov mlh</b>, zastav se. Udělej si samostatnou uloženou pozici, otevři stranu 5 a nejdřív odškrtni všechno.")}</div>
    <div class="box steel"><div class="t">{t("Spoiler level", "Спойлеры", "Spoilery")}</div>{t(
      "Pages 3–6 and 9–11 are light on spoilers. Pages 7–8 talk about endings — read them when you reach Kaer Morhen, or before your first run if you don't mind.",
      "На страницах 3–6 и 9–11 спойлеров почти нет. Страницы 7–8 — про концовки: читайте их, когда доберётесь до Каэр Морхена, или сразу, если не боитесь спойлеров.",
      "Strany 3–6 a 9–11 obsahují minimum spoilerů. Strany 7–8 mluví o koncích — čti je, až dorazíš na Kaer Morhen, nebo hned, pokud ti spoilery nevadí.")}</div>
  </div>
  {names_note}
  <div class="box gold"><div class="t">{t("Interactive checklist", "Интерактивный чек-лист", "Interaktivní checklist")}</div>{t(
    "Tap any box to tick it — works in Adobe Acrobat Reader, Chrome, Edge and most phone PDF apps. Save the file to keep your progress. Prefer paper? Just print it.",
    "Нажмите на любой квадратик — появится галочка. Работает в Adobe Acrobat Reader, Chrome, Edge и большинстве PDF-приложений на телефоне. Сохраните файл, чтобы не потерять прогресс. Любите бумагу? Просто распечатайте.",
    "Klepni na libovolný čtvereček a odškrtneš ho — funguje v Adobe Acrobat Reader, Chrome, Edge i ve většině PDF aplikací v mobilu. Soubor ulož, ať o postup nepřijdeš. Máš radši papír? Prostě si ho vytiskni.")}</div>
  {folio(2)}
</section>""")

    # ---------------- POINTS OF NO RETURN
    pages.append(f"""
<section class="page">
  <div class="kicker">{t("Chapter I", "Глава I", "Kapitola I")}</div>
  <h2>{t("The Three Points of No Return", "Три точки невозврата", "Tři body, odkud není návratu")}</h2>
  <div class="rule"></div>
  <p class="lede">{t("Almost everything in the game waits for you. These moments do not.", "Почти всё в игре вас дождётся. Эти моменты — нет.", "Skoro všechno ve hře na tebe počká. Tyto okamžiky ne.")}</p>
  <table>
    <tr><th style="width:9mm">#</th><th>{t("Moment", "Момент", "Okamžik")}</th><th>{t("What it closes", "Что закрывается", "Co se uzavře")}</th></tr>
    <tr><td class="num">1</td><td><b>{t("Leaving White Orchard", "Отъезд из Белого Сада", "Odjezd z Bělosadu")}</b><br><small>{t("Riding with the Nilfgaardian escort to the Emperor", "Поездка с нильфгаардским эскортом к императору", "Cesta s nilfgaardskou eskortou k císaři")}</small></td>
      <td>{t("Every open White Orchard side quest, contract and Gwent game. Only", "Все незавершённые побочные квесты, заказы и партии в гвинт Белого Сада. Позже можно закончить только", "Všechny nedokončené vedlejší úkoly, zakázky a partie gwintu v Bělosadu. Později lze dokončit jen")} {q("Faithful Friend")}{t(" can still be finished later.", ".", ".")}</td></tr>
    <tr><td class="num">2</td><td><b>{t("Sailing to the Isle of Mists", "Отплытие на Остров Туманов", "Plavba na Ostrov mlh")}</b><br><small>{t("Main quest", "Сюжетный квест", "Hlavní úkol")} {ISLE}</small></td>
      <td>{t("The biggest cutoff in the game. Around <b>19 side quests</b> auto-fail, including Keira Metz's whole arc, the Triss romance, the Radovid assassination chain and your last chance to recruit allies for Kaer Morhen.",
             "Главная точка невозврата. Около <b>19 побочных квестов</b> проваливаются автоматически: вся линия Кейры Мец, роман с Трисс, цепочка покушения на Радовида и последний шанс собрать союзников для Каэр Морхена.",
             "Největší zlom ve hře. Zhruba <b>19 vedlejších úkolů</b> automaticky selže, včetně celé linie Keiry Metz, romance s Triss, linie atentátu na Radovida a poslední šance získat spojence pro Kaer Morhen.")}</td></tr>
    <tr><td class="num">3</td><td><b>{t("DLC one-way doors", "Точки невозврата в DLC", "Jednosměrné dveře v DLC")}</b><br><small>{t("Hearts of Stone heist · Blood and Wine fairy-tale land", "Ограбление в «Каменных сердцах» · сказочная страна в «Крови и вине»", "Loupež v Srdci z kamene · pohádková země v O víně a krvi")}</small></td>
      <td>{t("Finishing the heist closes side content tied to the auction house. The Land of a Thousand Fables is visited only once — explore it fully before you leave.",
             "Завершение ограбления закрывает побочный контент, связанный с аукционным домом. В Страну Тысячи Сказок попадаешь только один раз — исследуйте её полностью.",
             "Dokončení loupeže uzavře vedlejší obsah spojený s aukční síní. Do pohádkové země (Land of a Thousand Fables) se dostaneš jen jednou — prozkoumej ji celou.")}</td></tr>
  </table>
  <div class="box" style="margin-top:6mm"><div class="t">{t("Also watch out for", "Также помните", "Pozor také na")}</div>{t(
    "Characters who die or leave during the story take their <b>Gwent cards</b> and <b>merchant stock</b> with them. Buy out Gwent cards from Velen and Novigrad merchants early — some become unreachable as the story advances.",
    "Персонажи, которые погибают или уходят по сюжету, забирают с собой <b>карты гвинта</b> и <b>товары</b>. Скупайте карты у торговцев Велена и Новиграда заранее — некоторые со временем становятся недоступны.",
    "Postavy, které během příběhu zemřou nebo odejdou, si s sebou vezmou <b>karty gwintu</b> i <b>zboží</b>. Karty od obchodníků ve Velenu a Novigradu kupuj včas — někteří se později stanou nedostupnými.")}</div>
  <h3>{t("Save habits that save runs", "Сохранения, которые спасают прохождение", "Ukládání, které zachrání hru")}</h3>
  <ul class="check">
    <li>{t('Hard save before every main quest marked with a boat, a portal or a "this will take you away" warning.', "Ручное сохранение перед каждым сюжетным квестом с лодкой, порталом или предупреждением о переезде.", "Ruční uložení před každým hlavním úkolem s lodí, portálem nebo varováním, že tě hra odveze pryč.")}</li>
    <li>{t("Keep one save per region: <i>White Orchard · Velen · Novigrad · Skellige · Kaer Morhen</i>.", "Храните по сохранению на регион: <i>Белый Сад · Велен · Новиград · Скеллиге · Каэр Морхен</i>.", "Měj jednu uloženou pozici na region: <i>Bělosad · Velen · Novigrad · Skellige · Kaer Morhen</i>.")}</li>
    <li>{t('Before the Isle of Mists, name a save <b>"BEFORE MISTS"</b> — you\'ll thank yourself.', "Перед Островом Туманов назовите сохранение <b>«ДО ТУМАНОВ»</b> — скажете себе спасибо.", "Před Ostrovem mlh si pojmenuj pozici <b>„PŘED MLHAMI“</b> — poděkuješ si.")}</li>
  </ul>
  {folio(3)}
</section>""")

    # ---------------- WHITE ORCHARD
    pages.append(f"""
<section class="page">
  <div class="kicker">{t("Chapter II · Point of no return #1", "Глава II · Точка невозврата №1", "Kapitola II · Bod bez návratu č. 1")}</div>
  <h2>{t("White Orchard Checklist", "Чек-лист: Белый Сад", "Checklist: Bělosad")}</h2>
  <div class="rule"></div>
  <p class="lede">{t("The tutorial region is small, but everything here closes when you ride out to meet the Emperor.", "Стартовая локация маленькая, но всё здесь закрывается, когда вы уезжаете к императору.", "Úvodní oblast je malá, ale všechno tady se uzavře, jakmile odjedeš za císařem.")}</p>
  <div class="cols">
    <div>
      <h3>{t("Side quests &amp; contracts", "Побочные квесты и заказы", "Vedlejší úkoly a zakázky")}</h3>
      <ul class="check">
        {li("Missing in Action")}{li("On Death's Bed")}{li("Precious Cargo")}
        {li("A Frying Pan, Spick and Span")}{li("Twisted Firestarter")}{li("Contract: Devil by the Well")}
      </ul>
    </div>
    <div>
      <h3>{t("Before you leave", "Перед отъездом", "Než odjedeš")}</h3>
      <ul class="check">
        <li>{t("Play the innkeeper at Gwent and buy the cards on offer.", "Сыграйте в гвинт с трактирщицей и купите её карты.", "Zahraj si gwint s hostinskou a kup karty, které nabízí.")}</li>
        <li>{t("Read every notice board in the village.", "Прочитайте все доски объявлений.", "Přečti všechny vývěsky ve vesnici.")}</li>
        <li>{t('Clear the "?" markers — easy early loot and XP.', "Зачистите значки «?» — лёгкий лут и опыт.", "Vyčisti značky „?“ — snadná kořist a zkušenosti.")}</li>
        <li>{t("Unlock every signpost (fast travel).", "Откройте все указатели (быстрое перемещение).", "Odemkni všechny rozcestníky (rychlé cestování).")}</li>
        <li>{t("Visit the Places of Power you find — free skill points.", "Посетите найденные Места Силы — бесплатные очки умений.", "Navštiv nalezená Místa moci — body dovedností zdarma.")}</li>
        <li>{t("Check your inventory: sell junk, keep crafting diagrams.", "Проверьте инвентарь: продайте хлам, чертежи оставьте.", "Zkontroluj inventář: prodej haraburdí, nákresy si nech.")}</li>
      </ul>
      <div class="box gold" style="margin-top:4mm"><div class="t">{t("Relax", "Не волнуйтесь", "Klid")}</div>{q("Faithful Friend")} {t("is the one White Orchard quest that stays available after you leave.", "— единственный квест Белого Сада, который останется доступен после отъезда.", "je jediný úkol z Bělosadu, který zůstane dostupný i po odjezdu.")}</div>
    </div>
  </div>
  {folio(4)}
</section>""")

    # ---------------- ISLE OF MISTS
    pages.append(f"""
<section class="page">
  <div class="kicker">{t("Chapter III · Point of no return #2", "Глава III · Точка невозврата №2", "Kapitola III · Bod bez návratu č. 2")}</div>
  <h2>{t("The Big One — Before the Isle of Mists", "Главное — до Острова Туманов", "To hlavní — před Ostrovem mlh")}</h2>
  <div class="rule"></div>
  <p class="lede">{t("Finish these before you board the boat in the main quest", "Завершите это до того, как сядете в лодку в сюжетном квесте", "Dokonči tohle, než nastoupíš na loď v hlavním úkolu")} {ISLE}. {t("Anything unfinished here fails automatically.", "Всё незавершённое провалится автоматически.", "Vše nedokončené automaticky selže.")}</p>
  <div class="cols">
    <div>
      <h3>{t("Keira Metz (Velen)", "Кейра Мец (Велен)", "Keira Metz (Velen)")}</h3>
      <ul class="check">
        {li("Magic Lamp")}{li("A Towerful of Mice")}{li("A Favor for a Friend")}
        {li("For the Advancement of Learning", t("Send her to <b>Kaer Morhen</b> at the end to recruit her.", "В конце отправьте её в <b>Каэр Морхен</b> — так она станет союзницей.", "Na konci ji pošli na <b>Kaer Morhen</b> — získáš ji jako spojence."))}
      </ul>
      <h3>{t("Triss &amp; Novigrad", "Трисс и Новиград", "Triss a Novigrad")}</h3>
      <ul class="check">
        {li("A Matter of Life and Death", t("Includes a small Gwent tournament — win every round for its cards.", "Внутри небольшой турнир по гвинту — выиграйте все партии ради карт.", "Obsahuje malý turnaj v gwintu — vyhraj všechna kola kvůli kartám."))}
        {li("Now or Never", t("Your choices here decide the Triss romance and whether Radovid can later be stopped.", "Здесь решается роман с Трисс и то, можно ли будет потом остановить Радовида.", "Tady se rozhoduje o romanci s Triss a o tom, zda půjde později zastavit Radovida."))}
        {li("Pyres of Novigrad", t("Finish the whole chain to spare Novigrad's mages and non-humans.", "Пройдите всю цепочку, чтобы спасти магов и нелюдей Новиграда.", "Dokonči celou linii, abys ušetřil novigradské mágy a nelidi."))}
        {li("Carnal Sins", t("The Novigrad murder mystery.", "Детектив о новиградских убийствах.", "Detektivka o vraždách v Novigradu."))}
      </ul>
    </div>
    <div>
      <h3>{t("Roche, Dijkstra &amp; Radovid", "Роше, Дийкстра и Радовид", "Roche, Dijkstra a Radovid")}</h3>
      <ul class="check">
        {li("An Eye for an Eye", t("Needed for Roche &amp; Ves to join you at Kaer Morhen.", "Нужен, чтобы Роше и Бьянка приехали в Каэр Морхен.", "Potřebný, aby Roche a Ves přijeli na Kaer Morhen."))}
        <li>{t("The Radovid chain", "Цепочка против Радовида", "Linie proti Radovidovi")}<small>{t("It opens through Triss's", "Открывается через квест Трисс", "Otevírá se přes úkol Triss")} {q("Now or Never")}. {t("Skip it and", "Пропустите его — и", "Vynech ho a")} {q("Reason of State")} {t("is locked forever.", "станет недоступен навсегда.", "bude navždy zamčený.")}</small></li>
      </ul>
      <h3>{t("Skellige's throne", "Трон Скеллиге", "Trůn Skellige")}</h3>
      <ul class="check">
        {li("Possession")}{li("The Lord of Undvik")}
        {li("King's Gambit", t("Picks Skellige's ruler and recruits Hjalmar.", "Решает, кто будет править Скеллиге, и приводит Хьялмара в союзники.", "Rozhodne o vládci Skellige a získá Hjalmara jako spojence."))}
      </ul>
      <h3>{t("Allies", "Союзники", "Spojenci")}</h3>
      <ul class="check">
        {li("Brothers in Arms: Velen")}{li("Brothers in Arms: Novigrad")}{li("Brothers in Arms: Skellige")}
      </ul>
    </div>
  </div>
  {folio(5)}
</section>""")

    # ---------------- KAER MORHEN
    allies = [
        (t("Keira Metz", "Кейра Мец", "Keira Metz"), f'{t("Complete all her side quests. In the last one,", "Пройдите все её квесты. В последнем,", "Dokonči všechny její úkoly. V posledním,")} {q("For the Advancement of Learning")}, {t("send her to Kaer Morhen.", "отправьте её в Каэр Морхен.", "ji pošli na Kaer Morhen.")}', ""),
        (t("Triss", "Трисс", "Triss"), t("Joins as part of the story when you gather allies.", "Присоединяется по сюжету, когда вы собираете союзников.", "Přidá se v rámci příběhu, když sháníš spojence."), ""),
        (t("Roche &amp; Ves", "Роше и Бьянка", "Roche a Ves"), f'{t("Complete", "Пройдите", "Dokonči")} {q("An Eye for an Eye")}, {t("then talk to Roche during", "затем поговорите с Роше во время", "pak mluv s Rochem během")} {q("Brothers in Arms: Novigrad")}.', ""),
        (t("Zoltan", "Золтан", "Zoltan"), f'{t("Talk to him during", "Поговорите с ним во время", "Promluv si s ním během")} {q("Brothers in Arms: Novigrad")}.', ""),
        (t("Ermion", "Эрмион", "Ermion"), f'{t("Talk to him during", "Поговорите с ним во время", "Promluv si s ním během")} {q("Brothers in Arms: Skellige")}.', ""),
        (t("Hjalmar", "Хьялмар", "Hjalmar"), f'{t("Complete Skellige's succession:", "Пройдите цепочку наследования Скеллиге:", "Dokonči linii nástupnictví na Skellige:")} {q("Possession")}, {q("The Lord of Undvik")}, {q("King's Gambit")}.', ""),
        (t("Letho", "Лето", "Letho"), f'{t("Only if you told Voorhis at the start of the game that Letho is alive. Complete", "Только если в начале игры вы сказали нильфгаардскому офицеру, что Лето жив. Пройдите", "Jen pokud jsi na začátku hry řekl Voorhisovi, že Letho žije. Dokonči")} {q("The Fall of House Reardon")} {t("and", "и", "a")} {q("Ghosts of the Past")}, {t("then send him to Kaer Morhen. Not needed for Full Crew.", "затем отправьте его в Каэр Морхен. Для достижения не обязателен.", "pak ho pošli na Kaer Morhen. Pro úspěch není nutný.")}', t("bonus", "бонус", "bonus")),
    ]
    rows = "".join(f'<tr>{cb()}<td><b>{n}</b>{f" <span class=\'tag st\'>{tag}</span>" if tag else ""}</td><td>{how}</td></tr>' for n, how, tag in allies)
    pages.append(f"""
<section class="page">
  <div class="kicker">{t("Chapter IV", "Глава IV", "Kapitola IV")}</div>
  <h2>{t("Allies for the Battle of Kaer Morhen", "Союзники для битвы за Каэр Морхен", "Spojenci pro bitvu na Kaer Morhen")}</h2>
  <div class="rule"></div>
  <p class="lede">{t("The more friends you bring, the better the battle goes. Recruiting all of them below (except the bonus) unlocks the <b>Full Crew</b> achievement / trophy.",
                     "Чем больше друзей вы приведёте, тем лучше пройдёт битва. Все союзники ниже (кроме бонусного) открывают достижение <b>«В полном составе»</b> <span class='en'>(Full Crew)</span>.",
                     "Čím víc přátel přivedeš, tím lépe bitva dopadne. Všichni spojenci níže (kromě bonusového) odemknou úspěch <b>Plná posádka</b> <span class='en'>(Full Crew)</span>.")}</p>
  <table>
    <tr><th></th><th style="width:34mm">{t("Ally", "Союзник", "Spojenec")}</th><th>{t("How to recruit", "Как привлечь", "Jak ho získat")}</th></tr>
    {rows}
  </table>
  <div class="box steel" style="margin-top:6mm"><div class="t">{t("Remember", "Помните", "Pamatuj")}</div>{t(
    "Every one of these must be done <b>before the Isle of Mists</b>. After that boat, the invitation list is closed.",
    "Всё это нужно сделать <b>до Острова Туманов</b>. После той лодки список приглашённых закрыт.",
    "Všechno musí být hotové <b>před Ostrovem mlh</b>. Po té plavbě je seznam pozvaných uzavřený.")}</div>
  {folio(6)}
</section>""")

    # ---------------- CIRI
    ciri = [
        (q("Blood on the Battlefield"), t(
            'Cheer her up with the <b>snowball fight</b> (<span class="q">"I know what might lift your spirits"</span>).',
            'Подбодрите её: <span class="q">«Я знаю, что поднимет тебе настроение»</span> — и выберите <b>игру в снежки</b>, а не выпивку.',
            'Rozvesel ji <b>koulovačkou</b> místo pití.')),
        (q("Blood on the Battlefield") + f'<br><small>{t("only if you visit Emhyr", "только если вы идёте к Эмгыру", "jen pokud jdeš za Emhyrem")}</small>', t(
            "<b>Refuse the Emperor's payment.</b> Accepting it counts against you.",
            "<b>Откажитесь от денег императора.</b> Если взять их — минус.",
            "<b>Odmítni císařovu odměnu.</b> Pokud ji přijmeš, počítá se to proti tobě.")),
        (q("Final Preparations"), t(
            "Let Ciri <b>speak to the Lodge of Sorceresses alone</b>.",
            "Отпустите Цири <b>на встречу с Ложей чародеек одну</b>.",
            "Nech Ciri <b>jít za Lóží čarodějek samotnou</b>.")),
        (q("Child of the Elder Blood"), t(
            'When she loses her temper in Avallac\'h\'s laboratory, say <span class="q">"Go for it."</span>',
            "Когда она выходит из себя в лаборатории Аваллак'ха, <b>дайте ей всё разнести</b>.",
            "Když se v Avallac'hově laboratoři rozzuří, <b>nech ji to tam rozbít</b>.")),
        (q("Child of the Elder Blood"), t(
            'Go with her to <b>Skjall\'s grave</b> (<span class="q">"Yeah, I\'ll go with you."</span>).',
            "<b>Сходите с ней на могилу Скьялля</b>, когда она попросит.",
            "<b>Jdi s ní ke Skjallovu hrobu</b>, když tě o to požádá.")),
    ]
    rows = "".join(f"<tr>{cb()}<td><b>{a}</b></td><td>{b}</td></tr>" for a, b in ciri)
    pages.append(f"""
<section class="page">
  <div class="kicker">{t("Chapter V · Spoilers", "Глава V · Спойлеры", "Kapitola V · Spoilery")}</div>
  <h2>{t("Ciri's Fate — The Five Moments", "Судьба Цири — пять моментов", "Osud Ciri — pět okamžiků")}</h2>
  <div class="rule"></div>
  <p class="lede">{t("The game quietly scores how you treat Ciri in five moments across three late quests. The tally, plus one political condition, decides her ending.",
                     "Игра незаметно оценивает, как вы ведёте себя с Цири, в пяти моментах трёх поздних квестов. Итог плюс одно политическое условие определяют её концовку.",
                     "Hra potichu hodnotí, jak se k Ciri chováš, v pěti okamžicích tří pozdních úkolů. Výsledek a jedna politická podmínka rozhodnou o jejím konci.")}</p>
  <table>
    <tr><th></th><th style="width:48mm">{t("Quest", "Квест", "Úkol")}</th><th>{t("Positive choice", "Положительный выбор", "Kladná volba")}</th></tr>
    {rows}
  </table>
  <h3>{t("The three endings", "Три концовки", "Tři konce")}</h3>
  <div class="cols">
    <div class="box" style="border-left-color:#3f6b45"><div class="t" style="color:#3f6b45">{t("Witcher Ciri", "Цири-ведьмачка", "Ciri zaklínačkou")}</div>{t(
      "At least <b>3 positive</b> moments, and <b>don't take Ciri to see Emhyr</b>. The most popular \"best\" ending.",
      "Минимум <b>3 положительных</b> момента и <b>не водите Цири к Эмгыру</b>. Самая популярная «лучшая» концовка.",
      "Alespoň <b>3 kladné</b> okamžiky a <b>neber Ciri za Emhyrem</b>. Nejoblíbenější „nejlepší“ konec.")}</div>
    <div class="box gold"><div class="t">{t("Empress Ciri", "Цири-императрица", "Ciri císařovnou")}</div>{t(
      "At least <b>3 positive</b> moments, <b>take her to Emhyr</b>, and make sure <b>Nilfgaard wins the war</b> (page 8 — Roche's side of",
      "Минимум <b>3 положительных</b> момента, <b>отведите её к Эмгыру</b> и сделайте так, чтобы <b>Нильфгаард выиграл войну</b> (с. 8 — сторона Роше в квесте",
      "Alespoň <b>3 kladné</b> okamžiky, <b>vezmi ji za Emhyrem</b> a zajisti, aby <b>Nilfgaard vyhrál válku</b> (s. 8 — Rocheho strana v úkolu")} {q("Reason of State")}).</div>
  </div>
  <div class="box"><div class="t">{t("The bad ending", "Плохая концовка", "Špatný konec")}</div>{t(
    "Fewer than 3 positive moments leads to the saddest ending. Accepting Emhyr's coin is the most common way players lose a point without noticing.",
    "Меньше 3 положительных моментов — самая грустная концовка. Чаще всего игроки теряют очко незаметно, когда берут деньги Эмгыра.",
    "Méně než 3 kladné okamžiky vedou k nejsmutnějšímu konci. Nejčastěji hráči nevědomky přijdou o bod tím, že přijmou Emhyrovy peníze.")}</div>
  <div class="box steel"><div class="t">{t("Tip", "Совет", "Tip")}</div>{t(
    "If you skip the Emhyr visit, only four moments are scored — so three of four must be positive.",
    "Если не идти к Эмгыру, оцениваются только четыре момента — значит, три из четырёх должны быть положительными.",
    "Pokud za Emhyrem nepůjdeš, hodnotí se jen čtyři okamžiky — tři ze čtyř tedy musí být kladné.")}</div>
  {folio(7)}
</section>""")

    # ---------------- KINGDOMS
    north = [
        (t("Radovid rules, Nilfgaard loses", "Правит Радовид, Нильфгаард проигрывает", "Vládne Radovid, Nilfgaard prohrává"),
         f'{t("Ignore Triss's", "Проигнорируйте квест Трисс", "Ignoruj úkol Triss")} {q("Now or Never")}{t(", so", ", и тогда", ", takže")} {q("Reason of State")} {t("never happens.", "не случится.", "se nikdy nestane.")}'),
        (t("Dijkstra rules Redania", "Дийкстра правит Реданией", "Dijkstra vládne Redanii"),
         f'{t("Help kill Radovid in", "Помогите убить Радовида в квесте", "Pomoz zabít Radovida v úkolu")} {q("Reason of State")}{t(", then <b>don't interfere</b> when Dijkstra turns on Roche, Ves and Thaler.", ", затем <b>не вмешивайтесь</b>, когда Дийкстра нападёт на Роше, Бьянку и Талера.", ", pak <b>nezasahuj</b>, když se Dijkstra obrátí proti Rochovi, Ves a Thalerovi.")}'),
        (t("Nilfgaard wins, Temeria restored", "Нильфгаард побеждает, Темерия восстановлена", "Nilfgaard vítězí, Temerie obnovena"),
         t("Help kill Radovid, then <b>side with Roche and kill Dijkstra</b>. Temeria becomes a vassal state. Required for the Empress ending.",
           "Помогите убить Радовида, затем <b>встаньте на сторону Роше и убейте Дийкстру</b>. Темерия станет вассальным государством. Нужно для концовки с императрицей.",
           "Pomoz zabít Radovida, pak <b>se postav na stranu Roche a zabij Dijkstru</b>. Temerie se stane vazalským státem. Nutné pro konec s císařovnou.")),
    ]
    isles = [
        (t("Cerys an Craite", "Керис ан Крайт", "Cerys an Craite"),
         f'{t("Complete", "Пройдите", "Dokonči")} {q("King\'s Gambit")} {t("and <b>side with Cerys</b>. Peace and prosperity for the Isles.", "и <b>выберите Керис</b>. Мир и процветание островов.", "a <b>podpoř Cerys</b>. Mír a prosperita pro ostrovy.")}'),
        (t("Hjalmar an Craite", "Хьялмар ан Крайт", "Hjalmar an Craite"),
         f'{t("Complete", "Пройдите", "Dokonči")} {q("King\'s Gambit")} {t("and <b>side with Hjalmar</b>. The raids on the mainland continue.", "и <b>выберите Хьялмара</b>. Набеги на материк продолжатся.", "a <b>podpoř Hjalmara</b>. Nájezdy na pevninu pokračují.")}'),
        (t("Svanrige (default)", "Сванриге (по умолчанию)", "Svanrige (výchozí)"),
         t("Ignore the succession quests entirely.", "Полностью пропустите квесты о наследовании.", "Úplně vynech úkoly o nástupnictví.")),
    ]
    r1 = "".join(f"<tr>{cb()}<td><b>{a}</b></td><td>{b}</td></tr>" for a, b in north)
    r2 = "".join(f"<tr>{cb()}<td><b>{a}</b></td><td>{b}</td></tr>" for a, b in isles)
    pages.append(f"""
<section class="page">
  <div class="kicker">{t("Chapter VI · Spoilers", "Глава VI · Спойлеры", "Kapitola VI · Spoilery")}</div>
  <h2>{t("The Fate of Kingdoms", "Судьбы королевств", "Osudy království")}</h2>
  <div class="rule"></div>
  <p class="lede">{t("The epilogue slides show what became of the North and the Isles. Here's what decides them.", "Эпилог показывает, что стало с Севером и островами. Вот от чего это зависит.", "Epilog ukáže, co se stalo se Severem a ostrovy. Tady je, co o tom rozhoduje.")}</p>
  <h3>{t("The North: Redania, Nilfgaard &amp; Temeria", "Север: Редания, Нильфгаард и Темерия", "Sever: Redanie, Nilfgaard a Temerie")}</h3>
  <table><tr><th></th><th style="width:52mm">{t("Outcome", "Итог", "Výsledek")}</th><th>{t("How", "Как", "Jak")}</th></tr>{r1}</table>
  <h3>{t("Skellige", "Скеллиге", "Skellige")}</h3>
  <table><tr><th></th><th style="width:52mm">{t("Ruler", "Правитель", "Vládce")}</th><th>{t("How", "Как", "Jak")}</th></tr>{r2}</table>
  <div class="box gold" style="margin-top:6mm"><div class="t">{t("Plan your whole run in one line", "Весь план в одной строке", "Celý plán na jeden řádek")}</div>{t(
    "Want Empress Ciri? You need", "Хотите Цири-императрицу? Нужно:", "Chceš Ciri císařovnou? Potřebuješ")} <b>{q("Now or Never", it=False)} → {q("Reason of State", it=False)} ({t("kill Radovid", "убить Радовида", "zabít Radovida")}) → {t("side with Roche", "сторона Роше", "strana Roche")}</b> {t(
    "plus the Emhyr visit and 3 good moments with Ciri. Want Witcher Ciri? Skip Emhyr, keep 3 good moments — politics are free.",
    "плюс визит к Эмгыру и 3 хороших момента с Цири. Хотите Цири-ведьмачку? Не ходите к Эмгыру и наберите 3 хороших момента — политика не важна.",
    "plus návštěvu Emhyra a 3 dobré okamžiky s Ciri. Chceš Ciri zaklínačkou? Vynech Emhyra a měj 3 dobré okamžiky — politika je volná.")}</div>
  {folio(8)}
</section>""")

    # ---------------- GWENT
    regions = [t("White Orchard", "Белый Сад", "Bělosad"), "Velen" if lang != "ru" else "Велен",
               t("Novigrad &amp; Oxenfurt", "Новиград и Оксенфурт", "Novigrad a Oxenfurt"),
               "Skellige" if lang != "ru" else "Скеллиге", "Kaer Morhen" if lang != "ru" else "Каэр Морхен"]
    rr = "".join(f"<tr>{cb()}<td>{r}</td><td></td><td></td></tr>" for r in regions)
    pages.append(f"""
<section class="page">
  <div class="kicker">{t("Chapter VII", "Глава VII", "Kapitola VII")}</div>
  <h2>{t("Gwent — Cards You Can Lose Forever", "Гвинт — карты, которые можно потерять навсегда", "Gwint — karty, o které můžeš přijít navždy")}</h2>
  <div class="rule"></div>
  <p class="lede">{t("The quest", "Квест", "Úkol")} {q("Collect 'Em All")} {t(
    "asks for 120 unique cards, and the game never tells you which ones you're missing. Protect these.",
    "требует 120 уникальных карт, а игра не говорит, каких не хватает. Берегите эти.",
    "vyžaduje 120 unikátních karet a hra ti nikdy neřekne, které chybí. Tyhle si ohlídej.")}</p>
  <div class="cols">
    <div>
      <h3>{t("Card rules of thumb", "Простые правила", "Základní pravidla")}</h3>
      <ul class="check">
        <li>{t("Play every named Gwent player the moment you meet them.", "Играйте с каждым именным игроком в гвинт сразу при встрече.", "Zahraj si s každým pojmenovaným hráčem gwintu hned, jak ho potkáš.")}<small>{t("Characters can die or leave during quests — their unique card goes with them.", "Персонажи могут погибнуть или уйти — их уникальная карта уйдёт с ними.", "Postavy mohou zemřít nebo odejít — jejich unikátní karta zmizí s nimi.")}</small></li>
        <li>{t("Buy out merchant decks in Velen and Novigrad early.", "Скупайте карты у торговцев Велена и Новиграда заранее.", "Vykup karty od obchodníků ve Velenu a Novigradu včas.")}<small>{t("Some traders become unreachable as the story moves on.", "Некоторые торговцы со временем становятся недоступны.", "Někteří obchodníci se později stanou nedostupnými.")}</small></li>
        <li>{t("Play the innkeepers in every region.", "Играйте с трактирщиками в каждом регионе.", "Hraj s hostinskými v každém regionu.")}</li>
        <li>{t("Finish all Gwent side quests before the Isle of Mists.", "Завершите все квесты про гвинт до Острова Туманов.", "Dokonči všechny úkoly s gwintem před Ostrovem mlh.")}</li>
      </ul>
    </div>
    <div>
      <h3>{t("Known card traps", "Известные ловушки", "Známé pasti")}</h3>
      <ul class="check">
        {li("A Matter of Life and Death", t("Contains a small Gwent tournament — you must win every round to get all the cards.", "Внутри турнир по гвинту — выиграйте все партии, чтобы получить все карты.", "Obsahuje malý turnaj v gwintu — musíš vyhrát všechna kola, abys získal všechny karty."))}
        {li("Now or Never", t("A choice here can get a card-holder killed.", "Выбор здесь может стоить жизни владельцу карты.", "Volba tady může stát život majitele karty."))}
        <li>{t("Iorveth hero card", "Карта героя Иорвет", "Hrdinská karta Iorveth")}<small>{t("Tied to a Velen side quest line — finish your Velen questlines before leaving the region for good.", "Связана с побочной цепочкой в Велене — заканчивайте квесты Велена, прежде чем уйти оттуда насовсем.", "Je spojená s vedlejší linií ve Velenu — dokonči úkoly ve Velenu, než region nadobro opustíš.")}</small></li>
        <li>{t("Quest-giver cards", "Карты персонажей", "Karty postav")}<small>{t("The Bloody Baron, Lambert and other story characters carry cards — win them while they're around.", "Кровавый Барон, Ламберт и другие сюжетные персонажи носят карты — выигрывайте их, пока есть возможность.", "Krvavý baron, Lambert a další příběhové postavy mají karty — vyhraj je, dokud jsou k dispozici.")}</small></li>
      </ul>
    </div>
  </div>
  <h3>{t("Gwent tracker", "Трекер гвинта", "Tracker gwintu")}</h3>
  <table><tr><th></th><th>{t("Region", "Регион", "Region")}</th><th>{t("Opponents beaten", "Соперники обыграны", "Poražení soupeři")}</th><th>{t("Merchants bought out", "Карты у торговцев куплены", "Karty od obchodníků koupeny")}</th></tr>{rr}</table>
  {folio(9)}
</section>""")

    # ---------------- DLC
    HOS = t("Hearts of Stone", "«Каменные сердца»", "Srdce z kamene")
    BAW = t("Blood and Wine", "«Кровь и вино»", "O víně a krvi")
    pages.append(f"""
<section class="page">
  <div class="kicker">{t("Chapter VIII · Point of no return #3", "Глава VIII · Точка невозврата №3", "Kapitola VIII · Bod bez návratu č. 3")}</div>
  <h2>{HOS} {t("&amp;", "и", "a")} {BAW}</h2>
  <div class="rule"></div>
  <p class="lede">{t("Both expansions have their own one-way doors. They're easy to miss because the game doesn't warn you.", "В обоих дополнениях есть свои точки невозврата. Их легко пропустить — игра не предупреждает.", "Obě rozšíření mají vlastní jednosměrné dveře. Snadno se přehlédnou, protože hra nevaruje.")}</p>
  <div class="cols">
    <div>
      <h3>{HOS}</h3>
      <ul class="check">
        <li>{t("Finish the auction-house side quests <b>before</b> completing the heist in", "Пройдите побочные квесты аукционного дома <b>до</b> завершения ограбления в квесте", "Dokonči vedlejší úkoly aukční síně <b>před</b> dokončením loupeže v úkolu")} {q("Open Sesame!")}<small>{t("Finishing the heist closes side content tied to the auction house and its contacts.", "Завершение ограбления закрывает связанный с аукционом побочный контент.", "Dokončení loupeže uzavře vedlejší obsah spojený s aukční síní.")}</small></li>
        <li>{t("Collect your runewright upgrades as you go.", "Не забывайте про улучшения у рунного мастера.", "Průběžně sbírej vylepšení u runopisce.")}</li>
        <li>{t("Play Gwent with every new opponent around Oxenfurt.", "Играйте в гвинт со всеми новыми соперниками у Оксенфурта.", "Zahraj si gwint se všemi novými soupeři kolem Oxenfurtu.")}</li>
        <li>{t("Make a save before the final choice with Gaunter O'Dimm.", "Сохранитесь перед финальным выбором с Гюнтером о'Димом.", "Ulož si hru před závěrečnou volbou s Gaunterem O'Dimmem.")}</li>
      </ul>
    </div>
    <div>
      <h3>{BAW}</h3>
      <ul class="check">
        <li>{t("Explore the <b>Land of a Thousand Fables</b> completely.", "Полностью исследуйте <b>Страну Тысячи Сказок</b>.", "Celou prozkoumej <b>pohádkovou zemi</b> <span class='en'>(Land of a Thousand Fables)</span>.")}<small>{t("You only visit it once — finish its side errand and pick up everything before the story pulls you back out.", "Попадаешь туда один раз — выполните там всё и соберите всё до того, как сюжет вас оттуда уведёт.", "Navštívíš ji jen jednou — splň tam vše a seber všechno, než tě příběh odvede pryč.")}</small></li>
        <li>{t("Upgrade Corvo Bianco, your vineyard — it pays for itself.", "Улучшайте Корво Бьянко, свою винодельню, — она окупается.", "Vylepšuj Corvo Bianco, svou vinici — vyplatí se.")}</li>
        <li>{t("Collect the Grandmaster witcher gear diagrams.", "Соберите чертежи ведьмачьего снаряжения гроссмейстерского уровня.", "Sbírej nákresy velmistrovské zaklínačské výzbroje.")}</li>
        <li>{t("Save before the final act — your choices decide the ending in Toussaint.", "Сохранитесь перед финалом — ваши выборы решат концовку в Туссенте.", "Ulož si hru před finále — tvá rozhodnutí určí konec v Toussaintu.")}</li>
      </ul>
    </div>
  </div>
  <div class="box steel" style="margin-top:6mm"><div class="t">{t("When to start the DLCs", "Когда начинать дополнения", "Kdy začít DLC")}</div>{t(
    "Hearts of Stone is built for a level 30+ Geralt; Blood and Wine for level 34+. Most players do them after the main story's epilogue — the game lets you keep playing after the credits.",
    "«Каменные сердца» рассчитаны на Геральта 30+ уровня, «Кровь и вино» — на 34+. Большинство проходит их после финала основной истории: игра позволяет продолжать после титров.",
    "Srdce z kamene je pro Geralta na úrovni 30+, O víně a krvi pro úroveň 34+. Většina hráčů je hraje po epilogu hlavního příběhu — hra tě nechá hrát i po titulcích.")}</div>
  {folio(10)}
</section>""")

    # ---------------- REMASTERED + ORDER
    order = [
        (t("White Orchard", "Белый Сад", "Bělosad"), t("Page 4 checklist", "Чек-лист на с. 4", "Checklist na s. 4")),
        (t("Velen", "Велен", "Velen"), t("Keira's quests, the Bloody Baron, Velen Gwent", "Квесты Кейры, Кровавый Барон, гвинт в Велене", "Úkoly Keiry, Krvavý baron, gwint ve Velenu")),
        (t("Novigrad", "Новиград", "Novigrad"), f'{t("Triss, Roche,", "Трисс, Роше,", "Triss, Roche,")} {q("Carnal Sins", it=False)}, {q("Pyres of Novigrad", it=False)}'),
        (t("Skellige", "Скеллиге", "Skellige"), t("The succession quests", "Квесты о наследовании", "Úkoly o nástupnictví")),
        (t("Isle of Mists", "Остров Туманов", "Ostrov mlh"), t("Everything on pages 5–6 ticked", "Всё на с. 5–6 отмечено", "Vše na s. 5–6 odškrtnuto")),
        (t("Kaer Morhen &amp; final acts", "Каэр Морхен и финал", "Kaer Morhen a finále"), t("Page 7 — Ciri's five moments", "С. 7 — пять моментов Цири", "S. 7 — pět okamžiků Ciri")),
        (HOS, t("Page 10", "С. 10", "S. 10")),
        (BAW, t("Page 10", "С. 10", "S. 10")),
    ]
    ro = "".join(f'<tr>{cb()}<td class="num">{i}</td><td><b>{a}</b></td><td>{b}</td></tr>' for i, (a, b) in enumerate(order, 1))
    pages.append(f"""
<section class="page">
  <div class="kicker">{t("Chapter IX", "Глава IX", "Kapitola IX")}</div>
  <h2>{t("New in Remastered", "Что нового в Remastered", "Novinky v Remastered")}</h2>
  <div class="rule"></div>
  <p class="lede">{t(
    "The September 2026 Remastered update is free for existing owners on PC, PS5, Xbox Series X|S and Switch 2. Stories, quests and endings are the same, so every checklist in this guide still applies.",
    "Обновление Remastered (сентябрь 2026) бесплатно для владельцев игры на PC, PS5, Xbox Series X|S и Switch 2. Сюжет, квесты и концовки те же — все чек-листы гайда актуальны.",
    "Aktualizace Remastered (září 2026) je zdarma pro majitele hry na PC, PS5, Xbox Series X|S a Switch 2. Příběh, úkoly i konce zůstaly stejné — všechny checklisty platí.")}</p>
  <div class="cols">
    <div class="box"><div class="t">{t("Skill tree rework", "Новое дерево умений", "Nový strom dovedností")}</div>{t(
      "Skills now sit in a tree with three ranks each, and some need prerequisites before they unlock. <b>Old build guides are out of date</b> — respec and experiment.",
      "Умения теперь выстроены в дерево, у каждого три ранга, а некоторые требуют других умений. <b>Старые гайды по билдам устарели</b> — сбросьте навыки и экспериментируйте.",
      "Dovednosti jsou nově ve stromu, každá má tři úrovně a některé vyžadují jiné dovednosti. <b>Staré návody na buildy jsou zastaralé</b> — přerozděl body a experimentuj.")}</div>
    <div class="box gold"><div class="t">{t("Reforging", "Перековка", "Překování")}</div>{t(
      "Change how your gear <i>looks</i> without changing its stats. Visit the master craftsmen <b>Yoana</b> or <b>Hattori</b>.",
      "Меняйте <i>внешний вид</i> снаряжения без изменения характеристик. Обращайтесь к мастерам <b>Йоане</b> или <b>Хаттори</b>.",
      "Změň <i>vzhled</i> výbavy beze změny statistik. Navštiv mistry <b>Yoanu</b> nebo <b>Hattoriho</b>.")}</div>
  </div>
  <div class="box steel"><div class="t">{t("Also new", "Ещё новое", "Další novinky")}</div>{t(
    "Upgraded textures, lighting and animations, improved combat, an expanded Photo Mode, new accessibility options and cross-platform mod support.",
    "Улучшенные текстуры, освещение и анимации, доработанный бой, расширенный фоторежим, новые настройки доступности и кроссплатформенная поддержка модов.",
    "Vylepšené textury, osvětlení a animace, lepší souboje, rozšířený fotorežim, nové možnosti přístupnosti a multiplatformní podpora modů.")}</div>
  <h2 style="margin-top:4mm">{t("Recommended Order", "Порядок прохождения", "Doporučené pořadí")}</h2>
  <div class="rule"></div>
  <table><tr><th></th><th style="width:9mm">#</th><th>{t("Where", "Где", "Kde")}</th><th>{t("Before moving on", "Перед тем как идти дальше", "Než pokračuješ")}</th></tr>{ro}</table>
  <p style="margin-top:3mm;font-style:italic;color:var(--soft);font-size:8.5pt;text-align:center">{t(
    "Good hunting, Witcher. — Fan-made, unofficial guide. The Witcher is a trademark of CD PROJEKT S.A. This guide is not affiliated with or endorsed by CD PROJEKT RED.",
    "Удачной охоты, ведьмак. — Фанатский неофициальный гайд. The Witcher — товарный знак CD PROJEKT S.A. Гайд не связан с CD PROJEKT RED и не одобрен ею.",
    "Dobrý lov, zaklínači. — Neoficiální fanouškovský průvodce. The Witcher je ochranná známka CD PROJEKT S.A. Průvodce není spojen s CD PROJEKT RED ani jím schválen.")}</p>
  {folio(11)}
</section>""")

    title = t("Don't Miss a Thing — Witcher 3 Remastered", "Ничего не пропусти — Ведьмак 3 Remastered", "Nic nevynech — Zaklínač 3 Remastered")
    html = f"""<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><title>{title}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>{STYLE}</style></head><body>{"".join(pages)}</body></html>"""
    return html


NAMES = {
    "en": "Witcher3_Remastered_Dont_Miss_a_Thing_EN",
    "ru": "Vedmak3_Remastered_Nichego_ne_propusti_RU",
    "cs": "Zaklinac3_Remastered_Nic_nevynech_CZ",
}
for lang, name in NAMES.items():
    src = HERE / f"guide_{lang}.html"
    src.write_text(build(lang))
    subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                    "--virtual-time-budget=10000", f"--print-to-pdf={HERE / (name + '.pdf')}", str(src)],
                   check=True, stderr=subprocess.DEVNULL)
    print("built", name)


# ---------------- make every drawn box a real clickable checkbox
import pymupdf


def add_checkboxes(pdf_path):
    doc = pymupdf.open(pdf_path)
    total = 0
    for pno, page in enumerate(doc):
        if pno == 0:  # cover art, no checkboxes
            continue
        seen = set()
        for dr in page.get_drawings():
            r = dr["rect"]
            if not (8 < r.width < 12 and abs(r.width - r.height) < 1):
                continue
            key = (round(r.x0), round(r.y0))
            if key in seen:
                continue
            seen.add(key)
            w = pymupdf.Widget()
            w.field_type = pymupdf.PDF_WIDGET_TYPE_CHECKBOX
            w.field_name = f"p{pno + 1}_box{len(seen)}"
            w.rect = r + (-1, -1, 1, 1)
            w.field_value = False
            w.border_width = 0
            w.text_color = (0.56, 0.11, 0.11)
            page.add_widget(w)
            total += 1
    tmp = pdf_path.with_suffix(".tmp.pdf")
    doc.save(tmp, garbage=3, deflate=True)
    doc.close()
    tmp.replace(pdf_path)
    return total


for name in NAMES.values():
    print(name, "checkboxes:", add_checkboxes(HERE / (name + ".pdf")))
