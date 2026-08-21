#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Lofi long-form video builder
#
# Собирает YouTube-ролик: обложка + склеенные треки + плавное движение кадра.
#
#   ./build.sh                       # собрать из tracks/ и assets/cover.png
#   ./build.sh --static              # без движения камеры (чистая статика)
#   ./build.sh --target-hours 2      # зациклить плейлист до ~2 часов
#
# Требует: ffmpeg, ffprobe, python3
# ---------------------------------------------------------------------------
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TRACKS_DIR="$HERE/tracks"
COVER="$HERE/assets/cover.png"
OUT_DIR="$HERE/out"
OUT_VIDEO="$OUT_DIR/video.mp4"
OUT_AUDIO="$OUT_DIR/mix.m4a"

MOTION=1           # 1 = медленный дрейф кадра, 0 = статика
TARGET_HOURS=0     # 0 = длительность как есть, иначе зациклить до N часов
CROSSFADE=3        # секунд перекрёстного затухания между треками

while [[ $# -gt 0 ]]; do
  case "$1" in
    --static)        MOTION=0; shift ;;
    --target-hours)  TARGET_HOURS="$2"; shift 2 ;;
    --crossfade)     CROSSFADE="$2"; shift 2 ;;
    --cover)         COVER="$2"; shift 2 ;;
    -h|--help)       sed -n '2,14p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) echo "Неизвестный аргумент: $1" >&2; exit 1 ;;
  esac
done

for bin in ffmpeg ffprobe python3; do
  command -v "$bin" >/dev/null 2>&1 || { echo "Нет $bin в PATH" >&2; exit 1; }
done
[[ -f "$COVER" ]] || { echo "Нет обложки: $COVER" >&2; exit 1; }

mkdir -p "$OUT_DIR"

# --- 1. Собираем список треков в стабильном порядке ------------------------
mapfile -t TRACKS < <(find "$TRACKS_DIR" -maxdepth 1 -type f \
  \( -iname '*.mp3' -o -iname '*.wav' -o -iname '*.flac' -o -iname '*.m4a' -o -iname '*.ogg' \) \
  | sort)

if [[ ${#TRACKS[@]} -eq 0 ]]; then
  echo "В $TRACKS_DIR нет аудиофайлов." >&2
  echo "Положи туда треки из Suno/Udio (нумеруй: 01-....mp3, 02-....mp3) и запусти снова." >&2
  exit 1
fi
echo "Треков найдено: ${#TRACKS[@]}"

# --- 2. Нормализация громкости + склейка с кроссфейдом ---------------------
# Каждый трек приводим к -14 LUFS: разнобой громкости — первое, что выдаёт
# «нарезку из ИИ» и роняет удержание.
NORM_DIR="$OUT_DIR/.norm"
rm -rf "$NORM_DIR"; mkdir -p "$NORM_DIR"

idx=0
NORM_TRACKS=()
for t in "${TRACKS[@]}"; do
  out="$NORM_DIR/$(printf '%03d' "$idx").wav"
  echo "  нормализую: $(basename "$t")"
  ffmpeg -nostdin -v error -y -i "$t" \
    -af "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000" \
    -ac 2 -c:a pcm_s16le "$out"
  NORM_TRACKS+=("$out")
  idx=$((idx+1))
done

echo "Склеиваю дорожку (кроссфейд ${CROSSFADE}s)..."
if [[ ${#NORM_TRACKS[@]} -eq 1 || "$CROSSFADE" -eq 0 ]]; then
  : > "$OUT_DIR/.concat.txt"
  for t in "${NORM_TRACKS[@]}"; do echo "file '$t'" >> "$OUT_DIR/.concat.txt"; done
  ffmpeg -nostdin -v error -y -f concat -safe 0 -i "$OUT_DIR/.concat.txt" \
    -c:a pcm_s16le "$OUT_DIR/.joined.wav"
else
  # Последовательный acrossfade: каждый следующий трек «въезжает» в предыдущий.
  cur="${NORM_TRACKS[0]}"
  step=0
  for ((i=1; i<${#NORM_TRACKS[@]}; i++)); do
    nxt="$OUT_DIR/.xf$step.wav"
    ffmpeg -nostdin -v error -y -i "$cur" -i "${NORM_TRACKS[$i]}" \
      -filter_complex "[0:a][1:a]acrossfade=d=${CROSSFADE}:c1=tri:c2=tri[a]" \
      -map "[a]" -c:a pcm_s16le "$nxt"
    [[ "$cur" == "$OUT_DIR/.xf"* ]] && rm -f "$cur"
    cur="$nxt"; step=$((step+1))
  done
  mv "$cur" "$OUT_DIR/.joined.wav"
fi

# --- 3. Зацикливание до целевой длительности -------------------------------
BASE_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT_DIR/.joined.wav")
echo "Длительность плейлиста: $(python3 -c "print(f'{$BASE_DUR/60:.1f} мин')")"

FINAL_WAV="$OUT_DIR/.joined.wav"
LOOPS=1
if [[ "$TARGET_HOURS" != "0" ]]; then
  LOOPS=$(python3 -c "import math; print(max(1, math.ceil($TARGET_HOURS*3600/$BASE_DUR)))")
  if [[ "$LOOPS" -gt 1 ]]; then
    echo "Зацикливаю x$LOOPS до ~${TARGET_HOURS} ч..."
    ffmpeg -nostdin -v error -y -stream_loop $((LOOPS-1)) -i "$OUT_DIR/.joined.wav" \
      -c:a pcm_s16le "$OUT_DIR/.looped.wav"
    FINAL_WAV="$OUT_DIR/.looped.wav"
  fi
fi

# Финальное аудио в AAC 320k — потолок того, что YouTube всё равно перекодирует.
ffmpeg -nostdin -v error -y -i "$FINAL_WAV" -c:a aac -b:a 320k -ar 48000 "$OUT_AUDIO"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT_AUDIO")
echo "Итоговая дорожка: $(python3 -c "print(f'{$DUR/3600:.2f} ч')")"

# --- 4. Видео --------------------------------------------------------------
# Статичный кадр кодируется почти даром: одинаковые кадры сжимаются в пустые
# P-фреймы. Большой GOP (-g 600) дополнительно режет вес.
if [[ "$MOTION" -eq 1 ]]; then
  # Очень медленный дрейф: за весь ролик кадр уезжает на ~4%.
  # Это не «оживляж» ради галочки — это то, что отличает ролик от JPEG
  # в глазах и алгоритма, и зрителя.
  # 20 fps и промежуточный масштаб 2560 — компромисс: движение остаётся
  # плавным, а вес двухчасового файла падает примерно вдвое против 24 fps
  # с апскейлом до 4096. Для загрузки с телефона это решающая разница.
  FPS=20
  CRF=23
  TOTAL_FRAMES=$(python3 -c "print(int($DUR*$FPS))")
  VF="scale=2560:-2,zoompan=z='1.0+0.04*on/${TOTAL_FRAMES}':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=${FPS},format=yuv420p"
  echo "Кодирую видео с медленным дрейфом кадра (${FPS} fps)..."
else
  # Абсолютно одинаковые кадры сжимаются в почти пустые P-фреймы, поэтому
  # низкий fps здесь ничего не портит, но экономит и вес, и время кодирования.
  FPS=10
  CRF=20
  VF="scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p"
  echo "Кодирую статичное видео (${FPS} fps)..."
fi

ffmpeg -nostdin -stats -v warning -y \
  -loop 1 -framerate "$FPS" -i "$COVER" \
  -i "$OUT_AUDIO" \
  -vf "$VF" \
  -c:v libx264 -preset medium -tune stillimage -crf "$CRF" \
  -r "$FPS" -g 600 -pix_fmt yuv420p \
  -c:a copy -shortest -movflags +faststart \
  "$OUT_VIDEO"

# --- 5. Описание с таймкодами ----------------------------------------------
python3 "$HERE/make_description.py" \
  --tracks-dir "$TRACKS_DIR" \
  --crossfade "$CROSSFADE" \
  --loops "$LOOPS" \
  --out "$OUT_DIR/description.txt"

rm -rf "$NORM_DIR" "$OUT_DIR"/.joined.wav "$OUT_DIR"/.looped.wav "$OUT_DIR"/.concat.txt "$OUT_DIR"/.xf*.wav 2>/dev/null || true

echo
echo "Готово:"
echo "  Видео:    $OUT_VIDEO ($(du -h "$OUT_VIDEO" | cut -f1))"
echo "  Описание: $OUT_DIR/description.txt"
echo
echo "Перед загрузкой прочитай CHECKLIST.md — там пункты, без которых"
echo "ролик рискует не пройти монетизацию."
