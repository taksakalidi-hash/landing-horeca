"""Assemble a full Scam Anatomy long-form video from script.md + rendered visuals.

Usage: python build_video.py <video_dir> <kokoro_dir> [voice]
Produces <video_dir>/final/ : video.mp4, captions.srt, voice.wav
"""
import re, sys, os, subprocess, json, math
import numpy as np, soundfile as sf

VDIR = os.path.abspath(sys.argv[1]); KDIR = os.path.abspath(sys.argv[2])
VOICE = sys.argv[3] if len(sys.argv) > 3 else "af_heart"
FPS, SR, W, H = 30, 24000, 1920, 1080
OUT = os.path.join(VDIR, "final"); TMP = os.path.join(OUT, "tmp"); os.makedirs(TMP, exist_ok=True)

# ---------- script ----------
md = open(os.path.join(VDIR, "script.md"), encoding="utf-8").read()
md = md.split("## Чистый текст")[0]
paras = []
for line in md.splitlines():
    m = re.match(r"^\| (.+?) \| (.+?) \|$", line)
    if m and not m.group(1).startswith(("EN", "---")):
        paras.append(m.group(1).strip())
assert len(paras) == 31, len(paras)

# visual per paragraph + inserted cards/anims (before paragraph index)
VIS = ["01-hook-text", "02-amount-gone", "02-amount-gone", "01-hook-text", "03-composite-note",
       "01-hook-text", "01-hook-text", "04-reply-no", "04-reply-no", "04-reply-no",
       "05-incoming-call", "05-incoming-call", "05-incoming-call", "06-they-know", "06-they-know",
       "07-code-text", "07-code-text", "07-code-text", "07-code-text", "07-code-text",
       "08-safe-account", "08-safe-account", "08-safe-account", "09-money-flow",
       "10-psychology", "11-ftc-stat",
       "12-red-flags", "13-what-to-do", "14-report", "13-what-to-do",
       "15-next-mules"]
INSERT = {5: [("anim", "intro-3d", "whoosh"), ("card", "ch1-the-text", "whoosh")],
          10: [("card", "ch2-the-call", "whoosh"), ("anim", "ringing-phone-3d", "ring")],
          15: [("card", "ch3-the-code", "whoosh")],
          20: [("card", "ch4-safe-account", "whoosh"), ("anim", "alert-transition-3d", "impact")],
          26: [("card", "ch5-protect", "whoosh")]}

TTS_FIX = [("FTC", "F.T.C."), ("Mrs. R.", "Missus R."), ("Mrs. R", "Missus R")]
CAP_FIX = [("one thousand, two hundred and forty-nine dollars", "$1,249"),
           ("eighteen thousand, four hundred dollars", "$18,400"),
           ("4-8-2-9-1-3", "482913"),
           ("fifteen point nine billion dollars", "$15.9 billion"),
           ("ReportFraud dot F-T-C dot gov, and I-C-3 dot gov", "ReportFraud.ftc.gov and ic3.gov")]
HIGHLIGHT = ["NO", "$18,400", "$1,249", "482913", "$15.9 billion", "code", "secure account", "caller ID can lie",
             "never", "red flags", "spoofing", "money mule", "money mules", "hang up"]

# ---------- TTS ----------
from kokoro_onnx import Kokoro
kok = Kokoro(os.path.join(KDIR, "kokoro-v1.0.onnx"), os.path.join(KDIR, "voices-v1.0.bin"))
def tts(text):
    t = text
    for a, b in TTS_FIX: t = t.replace(a, b)
    a, sr = kok.create(t, voice=VOICE, speed=1.0, lang="en-us"); assert sr == SR
    return a.astype(np.float32)

# ---------- sfx & music ----------
rng = np.random.default_rng(3)
def env(n, a, r):
    e = np.ones(n); ai, ri = int(a * SR), int(r * SR)
    e[:ai] = np.linspace(0, 1, ai); e[-ri:] = np.linspace(1, 0, ri); return e
def whoosh(d=0.9):
    n = int(d * SR); x = rng.standard_normal(n); y = np.zeros(n); s = 0.0
    cut = np.concatenate([np.linspace(0.01, 0.25, n // 2), np.linspace(0.25, 0.02, n - n // 2)])
    for i in range(n): s += cut[i] * (x[i] - s); y[i] = s
    return 0.5 * y / np.abs(y).max() * env(n, d * 0.6, d * 0.4)
def impact(d=1.4):
    t = np.arange(int(d * SR)) / SR; f = 90 * np.exp(-t * 3) + 38
    return 0.8 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
def ring(d=4.0):
    t = np.arange(int(d * SR)) / SR; tone = 0.18 * (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t))
    gate = ((t % 2.0) < 1.0).astype(float) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 20 * t)))
    return tone * gate
SFX = {"whoosh": whoosh, "impact": impact, "ring": ring}
def music(n):
    t = np.arange(n) / SR; m = np.zeros(n)
    for f, a in [(55, .5), (82.41, .35), (110, .25), (130.81, .18), (164.81, .1)]:
        m += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (0.6 + 0.4 * np.sin(2 * np.pi * t / rng.uniform(9, 17)))
    x = rng.standard_normal(n); y = np.zeros(n); s = 0.0
    for i in range(0, n): s += 0.002 * (x[i] - s); y[i] = s
    m += 3 * y / (np.abs(y).max() + 1e-9)
    return m / np.abs(m).max()

# ---------- timeline ----------
shots = []   # (kind, src, frames, motion)
audio_events = []  # (start_frame, samples, gain)
captions = []  # (start_s, end_s, text)
frame = 0
chapters = {}
PRESETS = ["in_c", "in_r", "out_c", "in_l"]
pi = 0
def add_img(img, frames, motion):
    shots.append(("img", img, frames, motion))

for idx, text in enumerate(paras):
    for kind, name, sfx in INSERT.get(idx, []):
        if kind == "card": fr = int(2.0 * FPS); add_img(name, fr, "in_c"); chapters[name] = frame / FPS
        else:
            dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                                  os.path.join(VDIR, "anim", name + ".mp4")]).decode())
            fr = int(round(dur * FPS)); shots.append(("anim", name, fr, None))
        audio_events.append((frame, SFX[sfx](), 0.9 if sfx != "ring" else 0.7)); frame += fr
    if idx in (24, 26, 30): chapters[f'para{idx}'] = frame / FPS
    a = tts(text); pause = 0.35 if idx not in (4, 30) else 0.8
    total = len(a) / SR + pause; frames = int(math.ceil(total * FPS))
    audio_events.append((frame, a, 1.0))
    # captions: chunk the caption text, time proportional to length over voiced part
    cap = text
    for x, y in CAP_FIX: cap = cap.replace(x, y)
    words = cap.split(); chunks, cur = [], []
    for w_ in words:
        cur.append(w_)
        if len(cur) >= 7 or (re.search(r"[.?!:]\"?$", w_) and len(cur) >= 3): chunks.append(" ".join(cur)); cur = []
    if cur: chunks.append(" ".join(cur))
    voiced = len(a) / SR; tot = sum(len(c) for c in chunks); t0 = frame / FPS
    for c in chunks:
        d = voiced * len(c) / tot; captions.append((t0, t0 + d, c)); t0 += d
    # split into shots of <= 6 s, alternate camera motion
    n = max(1, round(frames / (6 * FPS))); base = frames // n
    for k in range(n):
        f = base if k < n - 1 else frames - base * (n - 1)
        add_img(VIS[idx], f, PRESETS[pi % 4]); pi += 1
    frame += frames
# end screen hold
add_img("15-next-mules", 12 * FPS, "out_c"); frame += 12 * FPS
TOTAL = frame
print("duration", TOTAL / FPS, "s, shots", len(shots))

# ---------- render shots ----------
def zp(motion, N):
    p = f"(on/{N})"
    z = {"in_c": f"1+0.08*{p}", "out_c": f"1.09-0.08*{p}", "in_l": f"1.06+0.06*{p}", "in_r": f"1.06+0.06*{p}"}[motion]
    fx = {"in_c": 0.5, "out_c": 0.5, "in_l": 0.2, "in_r": 0.8}[motion]
    return f"zoompan=z='{z}':x='(iw-iw/zoom)*{fx}':y='(ih-ih/zoom)*0.5':d={N}:s={W}x{H}:fps={FPS}"
lst = open(os.path.join(TMP, "list.txt"), "w")
enc = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p", "-r", str(FPS)]
for i, (kind, src, N, motion) in enumerate(shots):
    out = os.path.join(TMP, f"s{i:04d}.mp4")
    if kind == "img":
        cmd = ["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", os.path.join(VDIR, "visuals", src + ".png"),
               "-vf", f"scale=3840:-1,{zp(motion, N)}", "-frames:v", str(N)] + enc + [out]
    else:
        cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(VDIR, "anim", src + ".mp4"),
               "-vf", f"scale={W}:{H},fps={FPS}", "-frames:v", str(N)] + enc + [out]
    subprocess.run(cmd, check=True); lst.write(f"file '{out}'\n")
lst.close()

# ---------- audio mix ----------
n = int(TOTAL / FPS * SR) + SR
voice = np.zeros(n, np.float32); fx = np.zeros(n, np.float32)
for f0, samp, g in audio_events:
    s0 = int(f0 / FPS * SR); seg = samp[: n - s0] * g
    (voice if g == 1.0 else fx)[s0:s0 + len(seg)] += seg
vpk = np.abs(voice).max(); voice = voice / vpk * 0.9
mus = music(n) * 0.055
duck = np.convolve((np.abs(voice) > 0.02).astype(float), np.ones(SR // 4) / (SR // 4), "same")
mus = mus * (1 - 0.45 * np.clip(duck * 3, 0, 1))
mix = voice + fx * 0.6 + mus
mix = mix / np.abs(mix).max() * 0.95
sf.write(os.path.join(OUT, "voice.wav"), voice, SR); sf.write(os.path.join(TMP, "mix.wav"), mix, SR)

# ---------- captions ----------
def ts(t, ass=True):
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}" if ass else f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int((s % 1) * 1000):03d}"
def hl(c):
    out = c
    for k in sorted(HIGHLIGHT, key=len, reverse=True):
        out = re.sub(r"(?<![\w$])(" + re.escape(k) + r")(?![\w])", r"{\\c&H66D1FF&}\1{\\c&HFFFFFF&}", out)
    return out
ass = ["[Script Info]", "ScriptType: v4.00+", f"PlayResX: {W}", f"PlayResY: {H}", "", "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       "Style: Cap,Inter,62,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,5,2,2,160,160,64,1",
       "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
srt = []
for i, (a_, b_, c) in enumerate(captions):
    ass.append(f"Dialogue: 0,{ts(a_)},{ts(b_)},Cap,,0,0,0,,{hl(c)}")
    srt += [str(i + 1), f"{ts(a_, False)} --> {ts(b_, False)}", c, ""]
open(os.path.join(TMP, "cap.ass"), "w").write("\n".join(ass))
open(os.path.join(OUT, "captions.srt"), "w").write("\n".join(srt))

# ---------- final ----------
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", os.path.join(TMP, "list.txt"),
                "-i", os.path.join(TMP, "mix.wav"),
                "-vf", f"subtitles={os.path.join(TMP, 'cap.ass')}:fontsdir=/usr/share/fonts/opentype/inter",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:v", "libx264", "-preset", "medium", "-crf", "19",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart",
                os.path.join(OUT, "video.mp4")], check=True)
json.dump({"duration_s": TOTAL / FPS, "voice": VOICE, "shots": len(shots),
           "chapters": chapters}, open(os.path.join(OUT, "build.json"), "w"))
print("done", os.path.join(OUT, "video.mp4"))
