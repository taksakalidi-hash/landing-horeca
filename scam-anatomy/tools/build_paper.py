"""Build a video in the "paper" cartoon style (cartoon/paper.html).

python build_paper.py <video_dir> <kokoro_dir> [plan_file] [voice] [speed]
plan_file (default paper_plan.py in video_dir) defines
  LINES = [(text, [(start, scene, params, events, trans, sfx), ...]), ...]
  start/events values: seconds or "keyword" / "keyword+0.4" (position of the word in the line)
  trans: None | "page";  sfx: {event_name: sound} or [(time_or_kw, sound)]
Output: <video_dir>/final-paper/<name>.mp4
"""
import os, re, sys, json, subprocess
import numpy as np, soundfile as sf

VDIR = os.path.abspath(sys.argv[1]); KDIR = os.path.abspath(sys.argv[2])
PLAN = sys.argv[3] if len(sys.argv) > 3 else os.path.join(VDIR, "paper_plan.py")
VOICE = sys.argv[4] if len(sys.argv) > 4 else "af_heart"
SPEED = float(sys.argv[5]) if len(sys.argv) > 5 else 0.9
FPS, SR = 30, 24000
HERE = os.path.dirname(os.path.abspath(__file__))
NAME = os.path.splitext(os.path.basename(PLAN))[0]
OUT = os.path.join(VDIR, "final-paper"); TMP = os.path.join(OUT, "tmp-" + NAME); SEG = os.path.join(TMP, "seg")
os.makedirs(SEG, exist_ok=True)
G = {"VDIR": VDIR}; exec(open(PLAN, encoding="utf-8").read(), G)
LINES = G["LINES"]; GAP = G.get("GAP", 0.45); TTS_FIX = G.get("TTS_FIX", [])
HIGHLIGHT = G.get("HIGHLIGHT", [])
rng = np.random.default_rng(7)

# ---------- sound ----------
def tt(d): return np.arange(int(d * SR)) / SR
def envd(d, k): return np.exp(-tt(d) * k)
def lowpass(x, a):
    k = a * (1 - a) ** np.arange(int(min(4000, 12 / a)))
    return np.convolve(x, k)[: len(x)]
def sfx(name):
    if name == "whoosh":   # paper swipe
        n = int(.6 * SR); y = lowpass(rng.standard_normal(n), .08); e = np.sin(np.pi * np.linspace(0, 1, n) ** .7) ** 2
        y2 = rng.standard_normal(n) * .15 * e
        return .7 * (y / np.abs(y).max() * e + y2)
    if name == "pop":
        t = tt(.14); return .5 * np.sin(2 * np.pi * np.cumsum(300 + 1100 * t / .14) / SR) * envd(.14, 22)
    if name == "boing":
        t = tt(.45); return .35 * np.sin(2 * np.pi * np.cumsum(180 + 120 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4)) / SR) * envd(.45, 6)
    if name == "ding":
        t = tt(1.0); return .3 * (np.sin(2 * np.pi * 1320 * t) * envd(1, 5) + .6 * np.sin(2 * np.pi * 1980 * t) * envd(1, 7))
    if name == "tick":
        t = tt(.05); return .5 * np.sin(2 * np.pi * 2200 * t) * envd(.05, 90)
    if name == "rip":
        n = int(.25 * SR); x = rng.standard_normal(n); return .35 * (x - lowpass(x, .3)) * envd(.25, 10)
    if name == "knock":
        t = tt(.16); return 1.0 * np.sin(2 * np.pi * np.cumsum(140 * np.exp(-t * 18) + 70) / SR) * envd(.16, 30) + .25 * lowpass(rng.standard_normal(len(t)), .2) * envd(.16, 40)
    if name == "stamp":
        t = tt(.4); return .8 * np.sin(2 * np.pi * 70 * t) * envd(.4, 14) + .3 * rng.standard_normal(len(t)) * envd(.4, 40)
    if name == "cash":
        out = np.zeros(int(1.0 * SR))
        for k, f in enumerate([523, 659, 784, 1047]):
            s0 = int(k * .08 * SR); t = tt(.5); out[s0:s0 + len(t)] += .2 * np.sin(2 * np.pi * f * t) * envd(.5, 6)
        for k in range(6):
            s0 = int((.05 + k * .07) * SR); t = tt(.2); out[s0:s0 + len(t)] += .12 * np.sin(2 * np.pi * (3000 + 400 * k) * t) * envd(.2, 20)
        return out
    if name == "steps":
        out = np.zeros(int(1.5 * SR))
        for k in range(6):
            s0 = int(k * .25 * SR); c = sfx("tick")[: int(.04 * SR)] * .5; t = tt(.08); c2 = .3 * np.sin(2 * np.pi * 110 * t) * envd(.08, 40)
            out[s0:s0 + len(c2)] += c2
        return out
    if name == "uhoh":
        t = tt(.7); f = np.where(t < .3, 392, 311); return .25 * np.sin(2 * np.pi * np.cumsum(f) / SR) * (np.sin(np.pi * np.clip(t / .3, 0, 1)) * (t < .3) + np.sin(np.pi * np.clip((t - .3) / .4, 0, 1)) * (t >= .3))
    if name == "click": return sfx("tick") * 1.3
    if name == "ring":
        t = tt(1.6); return .18 * (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * ((t % .8) < .5) * (.6 + .4 * np.sign(np.sin(2 * np.pi * 18 * t)))
    if name == "success":
        out = np.zeros(int(1.0 * SR))
        for k, f in enumerate([523, 659, 784, 1047]):
            s0 = int(k * .1 * SR); t = tt(.5); out[s0:s0 + len(t)] += .25 * np.sin(2 * np.pi * f * t) * envd(.5, 6)
        return out
    if name == "glitch":
        n = int(.4 * SR); x = rng.standard_normal(n); x = np.repeat(x[::40], 40)[:n]; return .3 * x * ((np.arange(n) // 1500) % 2)
    if name == "heart":
        out = np.zeros(int(2.0 * SR)); t = tt(.18); beat = np.sin(2 * np.pi * 55 * t) * envd(.18, 18)
        for s_ in np.arange(0, 1.8, .6):
            for o_, g_ in ((0, 1), (.2, .7)):
                i = int((s_ + o_) * SR); out[i:i + len(beat)] += .6 * g_ * beat
        return out
    if name == "send":
        t = tt(.35); return .25 * np.sin(2 * np.pi * np.cumsum(500 + 1500 * t / .35) / SR) * envd(.35, 6)
    raise KeyError(name)

def pluck(f, d, a=.996):
    n = int(SR / f); buf = rng.uniform(-1, 1, n); out = np.zeros(int(d * SR))
    for i in range(len(out)):
        out[i] = buf[i % n]; buf[i % n] = a * .5 * (buf[i % n] + buf[(i + 1) % n])
    return out
def music(N, bpm=96):
    beat = 60 / bpm; out = np.zeros(N + SR * 4)
    prog = [(261.6, 329.6, 392.0), (220.0, 261.6, 329.6), (174.6, 220.0, 261.6), (196.0, 246.9, 293.7)]
    cache = {}
    def pl(f, d):
        k = (round(f, 1), d)
        if k not in cache: cache[k] = pluck(f, d)
        return cache[k]
    t = 0.0; bar = 0
    while int(t * SR) < N:
        ch = prog[bar % 4]
        for b in range(8):  # eighth-note arpeggio
            s0 = int((t + b * beat / 2) * SR); f = ch[[0, 1, 2, 1, 0, 2, 1, 2][b]] * (2 if b in (2, 5) else 1)
            x = pl(f, .9) * (.5 if b % 2 else .7); out[s0:s0 + len(x)] += x
        s0 = int(t * SR); x = pl(ch[0] / 2, 1.8) * .8; out[s0:s0 + len(x)] += x
        t += 4 * beat; bar += 1
    out = out[:N]; return out / (np.abs(out).max() + 1e-9)

# ---------- TTS ----------
from kokoro_onnx import Kokoro
kok = Kokoro(os.path.join(KDIR, "kokoro-v1.0.onnx"), os.path.join(KDIR, "voices-v1.0.bin"))
def tts(text):
    for a, b in TTS_FIX: text = text.replace(a, b)
    a, _ = kok.create(text, voice=VOICE, speed=SPEED, lang="en-us"); a = a.astype(np.float32)
    nz = np.where(np.abs(a) > .01)[0]; return a[max(0, nz[0] - 600): nz[-1] + 1200] if len(nz) else a
def kw(text, key, voiced):
    if isinstance(key, (int, float)): return float(key)
    m = re.match(r"^(.*)\+(-?\d+(?:\.\d+)?)$", key)
    if m: return kw(text, m.group(1), voiced) + float(m.group(2))
    i = text.lower().find(key.lower())
    if i < 0: print("WARN keyword not found:", key); return voiced * .5
    return voiced * i / len(text)

# ---------- timeline ----------
audio = []; caps = []; shots = []; t0 = 0.6; LT = []
for entry in LINES:
    text, plan = entry[0], entry[1]; extra = entry[2] if len(entry) > 2 else 0.0
    v = tts(text); d = len(v) / SR; audio.append((t0, v, 1.0, "voice"))
    # captions: split into ~6-word chunks proportional to characters
    words = text.split(); chunks = []; cur = []
    for w in words:
        cur.append(w)
        if len(" ".join(cur)) > 34 or w.endswith((".", "?", "!")): chunks.append(" ".join(cur)); cur = []
    if cur: chunks.append(" ".join(cur))
    pos = 0; L = len(text)
    for c in chunks:
        a = t0 + d * pos / L; pos += len(c) + 1; caps.append((a, t0 + d * min(pos, L) / L, c))
    starts = [kw(text, s[0], d) for s in plan]
    for k, (st, scene, params, events, trans, fx) in enumerate(plan):
        shots.append(dict(li=len(LT), text=text, tline=t0, d=d, st=starts[k], scene=scene, p=params, ev=events, trans=trans, fx=fx))
    LT.append((text, t0, d)); t0 += d + GAP + extra
TOTAL = t0 + 0.8
# absolute shot starts: first shot of whole video at 0; others at their keyword time
for i, s in enumerate(shots):
    s["abs"] = 0.0 if i == 0 else s["tline"] + s["st"]
for i, s in enumerate(shots):
    end = shots[i + 1]["abs"] if i + 1 < len(shots) else TOTAL
    s["dur"] = end - s["abs"]; s["frames"] = int(round(end * FPS)) - int(round(s["abs"] * FPS))
    def at_(v):  # "@n:keyword" -> keyword in line li+n
        li = s["li"]
        m_ = re.match(r"^@(-?\d+):(.*)$", v)
        if m_: li += int(m_.group(1)); v = m_.group(2)
        tx, tl, dd = LT[li]; return tl + kw(tx, v, dd) - s["abs"]
    ev = {}
    for k, v in s["ev"].items():
        ev[k] = at_(v) if isinstance(v, str) else v
    s["evr"] = ev
    if s["trans"]: audio.append((s["abs"], sfx("whoosh"), .7, "fx"))
    fx = s["fx"] or {}
    items = fx.items() if isinstance(fx, dict) else fx
    for k, name in items:
        if isinstance(k, str) and k in ev: at = ev[k]
        elif isinstance(k, str): at = at_(k)
        else: at = k
        for nm in (name if isinstance(name, list) else [name]):
            off = 0.0
            if "@" in nm: nm, off = nm.split("@"); off = float(off)
            audio.append((s["abs"] + at + off, sfx(nm), .8, "fx"))
jobs = []
for i, s in enumerate(shots):
    sh = {"scene": s["scene"], "p": s["p"], "ev": s["evr"], "dur": s["dur"], "trans": s["trans"], "cam": s["p"].get("cam")}
    if s["trans"] == "page" and i:
        pv = shots[i - 1]; sh["prev"] = {"scene": pv["scene"], "p": pv["p"], "ev": pv["evr"], "dur": pv["dur"], "cam": pv["p"].get("cam")}
    jobs.append({"id": f"s{i:03d}", "shot": sh, "frames": s["frames"]})
json.dump(jobs, open(os.path.join(TMP, "shots.json"), "w"), indent=1)
json.dump([{"text": a, "start": b_, "dur": c_} for a, b_, c_ in LT], open(os.path.join(TMP, "lines.json"), "w"), indent=1)

if os.environ.get("DRY"):
    print("dry run", round(TOTAL, 1), "s", len(jobs), "shots"); sys.exit(0)
# ---------- render ----------
for f in os.listdir(SEG):
    os.remove(os.path.join(SEG, f))
W = min(4, len(jobs)); buckets = [jobs[k::W] for k in range(W)]; procs = []
env = dict(os.environ, ENGINE="paper.html")
for k in range(W):
    jf = os.path.join(TMP, f"jobs{k}.json"); json.dump(buckets[k], open(jf, "w"))
    procs.append(subprocess.Popen(["node", os.path.join(HERE, "cartoon", "render_shots.js"), jf, SEG], env=env))
for p_ in procs: p_.wait(); assert p_.returncode == 0
with open(os.path.join(TMP, "list.txt"), "w") as lst:
    for j in jobs: lst.write(f"file '{os.path.join(SEG, j['id'] + '.mp4')}'\n")

# ---------- mix ----------
N = int(TOTAL * SR) + SR
voice = np.zeros(N, np.float32); fxb = np.zeros(N, np.float32)
for at, smp, g, kind in audio:
    s0 = int(at * SR); seg = smp[: max(0, N - s0)] * g
    (voice if kind == "voice" else fxb)[s0:s0 + len(seg)] += seg
voice = voice / np.abs(voice).max() * .9
mus = music(N) * .07
duck = np.convolve((np.abs(voice) > .02).astype(float), np.ones(SR // 4) / (SR // 4), "same")
mus *= 1 - .4 * np.clip(duck * 3, 0, 1)
mix = voice + fxb * .5 + mus; mix = mix / np.abs(mix).max() * .95
sf.write(os.path.join(TMP, "mix.wav"), mix, SR)

# ---------- captions ----------
def ts(t): h, r = divmod(t, 3600); m, s = divmod(r, 60); return f"{int(h)}:{int(m):02d}:{s:05.2f}"
def hl(c):
    for k in sorted(HIGHLIGHT, key=len, reverse=True):
        c = re.sub(r"(?<![\w$])(" + re.escape(k) + r")(?![\w])", r"{\\c&H66D1FF&}\1{\\c&HFFFFFF&}", c)
    return c
ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1920", "PlayResY: 1080", "", "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       "Style: Cap,Inter,58,&H00FFFFFF,&H00FFFFFF,&H4020130B,&H4020130B,1,0,0,0,100,100,0,0,3,10,0,2,160,160,40,1", "", "[Events]",
       "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
for a, b, c in caps: ass.append(f"Dialogue: 0,{ts(a)},{ts(b)},Cap,,0,0,0,,{hl(c)}")
open(os.path.join(TMP, "cap.ass"), "w").write("\n".join(ass))
fonts = os.path.join(HERE, "fonts")
dst = os.path.join(OUT, NAME + ".mp4")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", os.path.join(TMP, "list.txt"), "-i", os.path.join(TMP, "mix.wav"),
                "-vf", f"subtitles={os.path.join(TMP, 'cap.ass')}:fontsdir={fonts}", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest",
                "-movflags", "+faststart", dst], check=True)
print("done", dst, round(TOTAL, 1), "s", flush=True)
