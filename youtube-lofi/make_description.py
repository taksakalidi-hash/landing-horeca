#!/usr/bin/env python3
"""Собирает описание YouTube-ролика: таймкоды, теги, дисклеймер об ИИ.

Таймкоды — не косметика. Это единственный элемент описания, который YouTube
показывает как главы на шкале прогресса: зритель прыгает по трекам вместо
того, чтобы закрыть вкладку, и watch time растёт. Плюс они же — доказательство
редакторской работы, если ролик попадёт на ручную проверку по «inauthentic
content».
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

AUDIO_EXT = {".mp3", ".wav", ".flac", ".m4a", ".ogg"}


def probe_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "json", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(json.loads(out.stdout)["format"]["duration"])


def pretty_title(path: Path) -> str:
    """'03-rainy-window_final.mp3' -> 'Rainy Window'."""
    stem = path.stem
    stem = re.sub(r"^\d+\s*[-_.]\s*", "", stem)          # ведущий номер
    stem = re.sub(r"[-_]+(final|v\d+|master|mix)$", "", stem, flags=re.I)
    stem = re.sub(r"[-_]+", " ", stem).strip()
    return stem.title() if stem else path.stem


def hhmmss(seconds: float) -> str:
    s = max(0, int(round(seconds)))
    h, rem = divmod(s, 3600)
    m, sec = divmod(rem, 60)
    # YouTube распознаёт главы и в M:SS, и в H:MM:SS.
    return f"{h}:{m:02d}:{sec:02d}" if h else f"{m}:{sec:02d}"


def build(tracks_dir: Path, crossfade: float, loops: int) -> tuple[str, float]:
    tracks = sorted(p for p in tracks_dir.iterdir()
                    if p.is_file() and p.suffix.lower() in AUDIO_EXT)
    if not tracks:
        sys.exit(f"Нет аудиофайлов в {tracks_dir}")

    durations = [probe_duration(p) for p in tracks]

    lines: list[str] = []
    cursor = 0.0
    for i, (path, dur) in enumerate(zip(tracks, durations)):
        # YouTube требует, чтобы первая глава начиналась ровно с 0:00.
        lines.append(f"{hhmmss(cursor)} — {pretty_title(path)}")
        cursor += dur
        if i < len(tracks) - 1:
            cursor -= crossfade   # кроссфейд съедает стык

    one_pass = cursor
    total = one_pass * loops

    if loops > 1:
        lines.append("")
        lines.append(f"(плейлист повторяется {loops}× — всего {total/3600:.1f} ч)")

    return "\n".join(lines), total


TEMPLATE = """{title}

{hook}

⏱ ТАЙМКОДЫ
{chapters}

━━━━━━━━━━━━━━━━━━━━━━━━

{about}

🎧 Лучше всего слушать в наушниках на средней громкости.

━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ О ПРОИЗВОДСТВЕ
Музыка в этом видео создана с использованием генеративного ИИ, сведена,
нормализована по громкости и собрана в плейлист вручную. Обложка —
авторская иллюстрация, созданная с помощью ИИ-инструментов.
При загрузке в YouTube Studio для этого ролика включён флаг
«Изменённый или синтетический контент».

#lofi #lofihiphop #studymusic #rainsounds #chillbeats #relaxingmusic
"""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tracks-dir", required=True, type=Path)
    ap.add_argument("--crossfade", type=float, default=3.0)
    ap.add_argument("--loops", type=int, default=1)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--title", default="Rainy Night Lofi ☕ Тёплая комната, дождь за окном")
    args = ap.parse_args()

    chapters, total = build(args.tracks_dir, args.crossfade, args.loops)
    hours = total / 3600

    text = TEMPLATE.format(
        title=f"{args.title} | {hours:.0f} часа для учёбы и работы"
              if hours >= 1 else args.title,
        hook=("Дождь стучит по стеклу, лампа горит тёплым, кот спит на книгах.\n"
              "Ничего не происходит — и в этом весь смысл. Просто фон,\n"
              "под который получается думать."),
        chapters=chapters,
        about=("Этот микс собран как одна непрерывная сессия: треки сведены\n"
               "кроссфейдом и выровнены по громкости, чтобы ни один переход\n"
               "не выдернул тебя из потока."),
    )

    args.out.write_text(text, encoding="utf-8")
    print(f"Описание записано: {args.out}")
    print(f"Глав: {len(chapters.splitlines())}, длительность: {hours:.2f} ч")


if __name__ == "__main__":
    main()
