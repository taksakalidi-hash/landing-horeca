#!/usr/bin/env python3
"""Генерирует тестовые треки и обложку, чтобы проверить пайплайн без Suno.

Важное требование к тестовому материалу: он должен быть слышен и виден
на телефоне. Первая версия этих ассетов была построена на синусоидах
174-220 Гц — технически корректный сигнал, который динамик телефона просто
не воспроизводит, из-за чего ролик казался беззвучным. Поэтому мелодия
здесь живёт в диапазоне 440-880 Гц, а «дождь» — в 800-6000 Гц: это полоса,
которую телефонный динамик отдаёт уверенно.
"""
from __future__ import annotations

import argparse
import math
import struct
import subprocess
import wave
from pathlib import Path

SR = 48000

# Ля-минорная пентатоника: любые ноты подряд звучат согласованно,
# поэтому мелодию можно генерировать без теории гармонии.
PENTATONIC = [440.00, 523.25, 587.33, 659.25, 783.99, 880.00]


def pluck(buf: list[float], start: int, freq: float, amp: float,
          decay: float = 2.2) -> None:
    """Подмешивает щипковую ноту с экспоненциальным затуханием."""
    length = min(int(decay * SR), len(buf) - start)
    if length <= 0:
        return
    w = 2 * math.pi * freq / SR
    # Две гармоники: основной тон плюс тихая октава для «телесности».
    for harm, hamp in ((1.0, 1.0), (2.0, 0.28)):
        wh = w * harm
        for i in range(length):
            env = math.exp(-3.2 * i / (decay * SR))
            buf[start + i] += amp * hamp * env * math.sin(wh * i)


def render_track(path: Path, seed: int, bpm: float, seconds: float) -> None:
    n = int(seconds * SR)
    buf = [0.0] * n

    # Детерминированный псевдослучайный выбор нот: один и тот же seed
    # всегда даёт один и тот же трек, чтобы тесты были воспроизводимы.
    state = seed
    def nxt(mod: int) -> int:
        nonlocal state
        state = (state * 1103515245 + 12345) & 0x7FFFFFFF
        return state % mod

    step = 60.0 / bpm / 2          # восьмые
    t = 0.0
    while t < seconds - 0.5:
        note = PENTATONIC[nxt(len(PENTATONIC))]
        # Пропускаем часть долей — иначе получается механическая гамма.
        if nxt(10) < 7:
            pluck(buf, int(t * SR), note, amp=0.22)
            # Иногда добавляем квинту сверху: заполняет паузы.
            if nxt(10) < 3:
                pluck(buf, int(t * SR), note * 1.5, amp=0.10)
        t += step

    # Мягкое ограничение пиков вместо жёсткого клиппинга.
    peak = max(abs(v) for v in buf) or 1.0
    scale = 0.85 / peak
    fade = int(1.5 * SR)

    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        frames = bytearray()
        for i, v in enumerate(buf):
            g = 1.0
            if i < fade:
                g = i / fade
            elif i > n - fade:
                g = max(0.0, (n - i) / fade)
            s = max(-1.0, min(1.0, v * scale * g))
            frames += struct.pack("<h", int(s * 32767))
        w.writeframes(bytes(frames))


def add_rain(src: Path, dst: Path) -> None:
    """Подмешивает шум дождя в слышимой на телефоне полосе 800-6000 Гц."""
    subprocess.run([
        "ffmpeg", "-v", "error", "-y",
        "-i", str(src),
        "-f", "lavfi", "-i", f"anoisesrc=duration=600:color=white:sample_rate={SR}:amplitude=0.5",
        "-filter_complex",
        "[1:a]highpass=f=800,lowpass=f=6000,volume=0.13[rain];"
        "[0:a]volume=1.0[mel];"
        "[mel][rain]amix=inputs=2:duration=shortest:normalize=0,"
        "aformat=channel_layouts=stereo",
        "-c:a", "libmp3lame", "-b:a", "192k", str(dst),
    ], check=True)


def make_cover(path: Path) -> None:
    """Обложка-заглушка: достаточно светлая и с читаемым текстом.

    Тёмный абстрактный градиент на экране телефона неотличим от чёрного
    кадра, поэтому здесь есть и подсветка, и крупная надпись.
    """
    font = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
    subprocess.run([
        "ffmpeg", "-v", "error", "-y",
        "-f", "lavfi",
        "-i", "gradients=s=1920x1080:c0=0x1b2b45:c1=0x4a6a92:c2=0xd9a05b:"
              "x0=300:y0=1000:x1=1700:y1=100:nb_colors=3:d=1",
        "-vf",
        # Тёплое пятно света + виньетка + зерно: имитация лампы в кадре.
        "format=rgb24,"
        "drawbox=x=1180:y=180:w=520:h=520:color=0xffd9a0@0.20:t=fill,"
        "gblur=sigma=90,"
        "eq=brightness=0.10:saturation=1.25,"
        "vignette=PI/6,"
        "noise=alls=6:allf=t,"
        f"drawtext=fontfile={font}:text='RAINY NIGHT LOFI':"
        "fontcolor=0xfff2dd:fontsize=96:x=(w-text_w)/2:y=(h-text_h)/2-40:"
        "shadowcolor=0x000000@0.6:shadowx=4:shadowy=4,"
        f"drawtext=fontfile={font}:text='test pattern':"
        "fontcolor=0xffd9a0:fontsize=44:x=(w-text_w)/2:y=(h-text_h)/2+70:"
        "shadowcolor=0x000000@0.6:shadowx=3:shadowy=3",
        "-frames:v", "1", str(path),
    ], check=True)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out-dir", type=Path, default=Path(__file__).parent)
    args = ap.parse_args()

    tracks_dir = args.out_dir / "tracks"
    assets_dir = args.out_dir / "assets"
    tracks_dir.mkdir(exist_ok=True)
    assets_dir.mkdir(exist_ok=True)

    specs = [
        ("01-rainy-window.mp3", 11, 72.0, 24.0),
        ("02-late-study.mp3",   29, 64.0, 20.0),
        ("03-warm-lamp.mp3",    47, 80.0, 22.0),
    ]
    for name, seed, bpm, dur in specs:
        print(f"  синтезирую {name} ...")
        tmp = tracks_dir / (name + ".wav")
        render_track(tmp, seed, bpm, dur)
        add_rain(tmp, tracks_dir / name)
        tmp.unlink()

    print("  рисую обложку ...")
    make_cover(assets_dir / "cover_placeholder.png")
    print("Готово.")


if __name__ == "__main__":
    main()
