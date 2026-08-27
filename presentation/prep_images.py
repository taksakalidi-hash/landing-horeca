"""Единая обработка всех фотографий деки.
Тёплый грейд, -10% насыщенности, кроп в заданный бокс, скругление 0,22".
Вход — кадры, извлечённые из исходного PDF. Кадры с водяными знаками
и с чужим брендом в этот список намеренно не попали.
"""
import os
from PIL import Image, ImageEnhance, ImageDraw

SRC = 'img'
OUT = 'assets'
os.makedirs(OUT, exist_ok=True)

RADIUS_IN = 0.22
DPI_MAX = 200
UPSCALE_MAX = 1.35          # выше — картинка начинает мылить

DEEP = (0x1E, 0x2A, 0x24)   # --bg-deep
BASE = (0xFB, 0xF9, 0xF5)   # --bg-base
CARD = (0xED, 0xE8, 0xDD)   # --bg-card

# name -> (исходник, ширина", высота", фокус x, фокус y, цвет подложки слайда)
# Скругление сводится на цвет фона того слайда, где кадр стоит: так кадр
# остаётся JPEG, а дек не раздувается до десятков мегабайт на альфа-канале.
MANIFEST = {
    'cover':     ('pg8_21_650x1121.jpg', 4.30, 5.95, 0.50, 0.50, DEEP),
    'fruitbody': ('pg1_02_626x626.jpg',  3.20, 4.40, 0.50, 0.48, BASE),
    'donut':     ('pg3_06_1200x800.jpg', 4.30, 3.40, 0.54, 0.42, DEEP),
    'nuts':      ('pg6_14_493x411.jpg',  2.10, 2.10, 0.50, 0.50, CARD),
    'omelet':    ('pg6_17_498x502.jpg',  2.10, 2.10, 0.50, 0.50, CARD),
    'cake':      ('pg7_19_682x972.jpg',  5.30, 6.00, 0.50, 0.52, DEEP),
}

def grade(im):
    """Тёплый грейд: -10% насыщенности, лёгкий сдвиг в тепло, +3% контраста."""
    im = ImageEnhance.Color(im).enhance(0.90)
    im = ImageEnhance.Contrast(im).enhance(1.03)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.030)))
    b = b.point(lambda v: int(v * 0.972))
    return Image.merge('RGB', (r, g, b))

def crop_to(im, ratio, fx, fy):
    """Кроп в нужные пропорции с учётом точки фокуса."""
    w, h = im.size
    if w / h > ratio:
        nw, nh = int(round(h * ratio)), h
    else:
        nw, nh = w, int(round(w / ratio))
    x = int(round((w - nw) * fx))
    y = int(round((h - nh) * fy))
    return im.crop((x, y, x + nw, y + nh))

def round_corners(im, radius, bg):
    mask = Image.new('L', im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1],
                                           radius=radius, fill=255)
    plate = Image.new('RGB', im.size, bg)
    plate.paste(im, (0, 0), mask)
    return plate

for name, (src, win, hin, fx, fy, bg) in MANIFEST.items():
    im = Image.open(os.path.join(SRC, src)).convert('RGB')
    im = grade(im)
    im = crop_to(im, win / hin, fx, fy)

    dpi = DPI_MAX
    if win * dpi > im.size[0] * UPSCALE_MAX:
        dpi = int(im.size[0] * UPSCALE_MAX / win)
    tw, th = int(round(win * dpi)), int(round(hin * dpi))
    im = im.resize((tw, th), Image.LANCZOS)
    im = round_corners(im, int(round(RADIUS_IN * dpi)), bg)

    path = os.path.join(OUT, name + '.jpg')
    im.save(path, quality=82, optimize=True, progressive=True)
    eff = tw / win
    print(f'{name:10s} {tw:4d}x{th:4d}px  {eff:5.0f} dpi  {os.path.getsize(path)/1024:6.1f} KB')
