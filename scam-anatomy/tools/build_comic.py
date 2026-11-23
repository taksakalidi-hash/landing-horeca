"""Build a video in the comic / graphic-novel style (cartoon/comic2.html) from still images.

python build_comic.py <video_dir> <kokoro_dir> <plan_file> [--only N-M] [--name NAME]
plan_file defines:
  LINES = [(text, shots, opts), ...]
    opts: {"voice": "af_heart", "speed": 0.9, "phone": False, "cry": False, "pre": 0.0, "post": 0.0, "cap": True}
    shots: [ {"at": 0|"keyword"|"kw+0.5", "img": "03", "cam": [[fx,fy,z],[fx,fy,z]], "fx": {...}, "ov": [...],
              "trans": "cut|fade|black|whip|flash", "sfx": [(when, name[, gain])], "amb": "rain|room|office|night"} ]
  Times inside a shot (ov "at"/"until"/..., fx windows, sfx) are seconds from the shot start or "keyword" /
  "keyword+0.4" / "@1:keyword" (keyword in the next line).
Output: <video_dir>/final/<NAME>.mp4
"""
import os, re, sys, json, subprocess
import numpy as np, soundfile as sf

VDIR = os.path.abspath(sys.argv[1]); KDIR = os.path.abspath(sys.argv[2]); PLAN = os.path.abspath(sys.argv[3])
ARGS = sys.argv[4:]
ONLY = None; NAME = os.path.splitext(os.path.basename(PLAN))[0]
if "--only" in ARGS: a, b = ARGS[ARGS.index("--only") + 1].split("-"); ONLY = (int(a), int(b))
if "--name" in ARGS: NAME = ARGS[ARGS.index("--name") + 1]
FPS, SR = 30, 24000
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(VDIR, "final"); TMP = os.path.join(OUT, "tmp-" + NAME); SEG = os.path.join(TMP, "seg")
os.makedirs(SEG, exist_ok=True)
G = {"VDIR": VDIR}; exec(open(PLAN, encoding="utf-8").read(), G)
LINES = G["LINES"]; GAP = G.get("GAP", 0.42); HIGHLIGHT = G.get("HIGHLIGHT", []); TTS_FIX = G.get("TTS_FIX", [])
if ONLY: LINES = LINES[ONLY[0]:ONLY[1]]
rng = np.random.default_rng(11)

# ---------------- DSP helpers ----------------
def tt(d): return np.arange(int(d * SR)) / SR
def envd(d, k): return np.exp(-tt(d) * k)
def lowpass(x, a):
    k = a * (1 - a) ** np.arange(int(min(4000, 12 / a))); return np.convolve(x, k)[: len(x)]
def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.clip((f - lo * .7) / (lo * .3), 0, 1) * np.clip((hi * 1.3 - f) / (hi * .3), 0, 1)
    return np.fft.irfft(X * m, len(x))
def phone_fx(x):
    y = band(x, 320, 3300); y = np.tanh(y / (np.abs(y).max() + 1e-9) * 2.2) * .8
    y += rng.standard_normal(len(y)) * .006 + .004 * np.sin(2 * np.pi * 50 * tt(len(y) / SR))
    return y.astype(np.float32)
def cry_fx(x):
    t = tt(len(x) / SR); trem = 1 - .22 * (.5 + .5 * np.sin(2 * np.pi * 5.6 * t + np.sin(2 * np.pi * .7 * t) * 2))
    # tiny pitch wobble via resample with sinusoidal time warp
    warp = t + .0016 * np.sin(2 * np.pi * 4.8 * t); idx = np.clip(warp * SR, 0, len(x) - 1)
    y = np.interp(idx, np.arange(len(x)), x) * trem
    return y.astype(np.float32)
def sniff():
    n = int(.32 * SR); x = band(rng.standard_normal(n), 1500, 6000); return .12 * x / np.abs(x).max() * np.sin(np.pi * np.linspace(0, 1, n)) ** 2

def sfx(name):
    if name == "whoosh":
        n = int(.6 * SR); y = lowpass(rng.standard_normal(n), .08); e = np.sin(np.pi * np.linspace(0, 1, n) ** .7) ** 2; return .8 * y / np.abs(y).max() * e
    if name == "impact":
        t = tt(1.6); f = 85 * np.exp(-t * 3) + 34; return .95 * np.sin(2 * np.pi * np.cumsum(f) / SR) * envd(1.6, 2.6) + .25 * lowpass(rng.standard_normal(len(t)), .2) * envd(1.6, 14)
    if name == "riser":
        t = tt(2.2); return .35 * band(rng.standard_normal(len(t)), 400, 6000) * (t / 2.2) ** 2 + .2 * np.sin(2 * np.pi * np.cumsum(120 + 500 * (t / 2.2) ** 2) / SR) * (t / 2.2)
    if name == "pop":
        t = tt(.14); return .45 * np.sin(2 * np.pi * np.cumsum(300 + 1100 * t / .14) / SR) * envd(.14, 22)
    if name == "stamp":
        t = tt(.4); return .8 * np.sin(2 * np.pi * 70 * t) * envd(.4, 14) + .3 * rng.standard_normal(len(t)) * envd(.4, 40)
    if name == "tick":
        t = tt(.05); return .5 * np.sin(2 * np.pi * 2200 * t) * envd(.05, 90)
    if name == "ticks":
        out = np.zeros(int(2.4 * SR))
        for k in range(12):
            s0 = int(k * (.22 - k * .008) * SR); c = sfx("tick"); out[s0:s0 + len(c)] += c * (.5 + k * .04)
        return out
    if name == "ring":
        t = tt(2.0); g = ((t % 1.0) < .55).astype(float)
        return .2 * (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * g
    if name == "ring1":
        return sfx("ring")[: int(1.0 * SR)]
    if name == "buzz":
        t = tt(1.2); g = ((t % .45) < .32).astype(float); return .4 * np.sign(np.sin(2 * np.pi * 150 * t)) * g * (.6 + .4 * np.sin(2 * np.pi * 8 * t)) * .5
    if name == "dialtone":
        t = tt(2.6); g = ((t % 1.3) < .9).astype(float); return .14 * (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * g
    if name == "click":
        return sfx("tick") * 1.3
    if name == "hangup":
        t = tt(.5); return .5 * np.sin(2 * np.pi * 480 * t) * (t < .18) + .4 * np.sin(2 * np.pi * 620 * t) * ((t > .25) & (t < .43))
    if name == "knock":
        out = np.zeros(int(1.0 * SR))
        for k in range(3):
            t = tt(.16); c = 1.0 * np.sin(2 * np.pi * np.cumsum(140 * np.exp(-t * 18) + 70) / SR) * envd(.16, 30) + .25 * lowpass(rng.standard_normal(len(t)), .2) * envd(.16, 40)
            s0 = int(k * .26 * SR); out[s0:s0 + len(c)] += c
        return out
    if name == "cash":
        out = np.zeros(int(1.2 * SR))
        for k in range(14):
            s0 = int(k * .06 * SR); n = int(.05 * SR); out[s0:s0 + n] += .25 * band(rng.standard_normal(n), 2000, 7000) * np.hanning(n)
        return out
    if name == "glitch":
        n = int(.45 * SR); x = rng.standard_normal(n); x = np.repeat(x[::40], 40)[:n]; return .3 * x * ((np.arange(n) // 1500) % 2)
    if name == "heart":
        out = np.zeros(int(3.4 * SR)); t = tt(.18); beat = np.sin(2 * np.pi * 52 * t) * envd(.18, 16)
        for s_ in np.arange(0, 3.2, .85):
            for o_, g_ in ((0, 1), (.2, .65)):
                i = int((s_ + o_) * SR); out[i:i + len(beat)] += .8 * g_ * beat
        return out
    if name == "siren":
        t = tt(2.6); f = np.where((t % 1.0) < .5, 700, 950); return .12 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 2.6)
    if name == "crash":
        n = int(1.6 * SR); x = rng.standard_normal(n); y = (x - lowpass(x, .25)) * envd(1.6, 3.5) * .5 + sfx("impact")[:n] * .7; return y
    if name == "thunder":
        n = int(3.2 * SR); return lowpass(rng.standard_normal(n), .01) * envd(3.2, 1.2) * 7
    if name == "type":
        out = np.zeros(int(1.4 * SR))
        for k in range(12):
            s0 = int((k * .1 + rng.uniform(0, .03)) * SR); c = sfx("tick") * rng.uniform(.3, .6); out[s0:s0 + len(c)] += c
        return out
    if name == "success":
        out = np.zeros(int(1.2 * SR))
        for k, f in enumerate([523, 659, 784, 1047]):
            s0 = int(k * .1 * SR); t = tt(.6); out[s0:s0 + len(t)] += .22 * np.sin(2 * np.pi * f * t) * envd(.6, 5)
        return out
    if name == "msg":
        t = tt(.3); return .3 * (np.sin(2 * np.pi * 1320 * t) * envd(.3, 14) + .6 * np.sin(2 * np.pi * 1760 * t) * envd(.3, 14) * (t > .09))
    if name == "send":
        t = tt(.35); return .25 * np.sin(2 * np.pi * np.cumsum(500 + 1500 * t / .35) / SR) * envd(.35, 6)
    if name == "steps":
        out = np.zeros(int(2.0 * SR))
        for k in range(7):
            t = tt(.09); c = .35 * np.sin(2 * np.pi * 95 * t) * envd(.09, 35) + .08 * band(rng.standard_normal(len(t)), 800, 4000) * envd(.09, 50)
            s0 = int(k * .28 * SR); out[s0:s0 + len(c)] += c
        return out
    if name == "door":
        t = tt(.9); return .3 * band(rng.standard_normal(len(t)), 200, 1200) * envd(.9, 6) + .4 * np.sin(2 * np.pi * 60 * t) * envd(.9, 10)
    if name == "hit":
        t = tt(.5); return .7 * np.sin(2 * np.pi * np.cumsum(120 * np.exp(-t * 10) + 45) / SR) * envd(.5, 7)
    raise KeyError(name)

def amb(name, n):
    x = rng.standard_normal(n)
    if name == "rain": return (lowpass(x, .25) * .5 + x * .05) * .7
    if name == "room": return lowpass(x, .02) * 1.2
    if name == "office": return lowpass(x, .03) * 1.0 + .02 * np.sin(2 * np.pi * 120 * tt(n / SR))
    if name == "night": return lowpass(x, .015) * 1.5
    if name == "class": return lowpass(x, .05) * .8
    if name == "birds":
        y = lowpass(x, .03) * .6; t = tt(n / SR)
        for k in range(int(n / SR / 1.7)):
            s0 = int((k * 1.7 + rng.uniform(0, .8)) * SR); d = .18; tc = tt(d)
            c = .12 * np.sin(2 * np.pi * np.cumsum(2600 + 900 * np.sin(2 * np.pi * 18 * tc)) / SR) * np.hanning(len(tc))
            y[s0:s0 + len(c)] += c[: max(0, n - s0)]
        return y
    return np.zeros(n)

def music(N):
    t = np.arange(N) / SR; m = np.zeros(N)
    for f, a in [(55, .55), (82.41, .3), (110, .18), (164.8, .06)]:
        m += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (.65 + .35 * np.sin(2 * np.pi * t / rng.uniform(11, 19)))
    # sparse minor piano notes
    notes = [220.0, 261.6, 196.0, 174.6, 220.0, 329.6, 293.7, 261.6]
    for k, s0 in enumerate(np.arange(1.0, N / SR - 2, 2.6)):
        f = notes[k % len(notes)]; d = 2.4; tc = tt(d); n0 = int(s0 * SR)
        note = (np.sin(2 * np.pi * f * tc) + .35 * np.sin(2 * np.pi * 2 * f * tc) + .12 * np.sin(2 * np.pi * 3 * f * tc)) * envd(d, 1.8)
        m[n0:n0 + len(note)] += .32 * note[: max(0, N - n0)]
    return m / (np.abs(m).max() + 1e-9)

# ---------------- TTS ----------------
from kokoro_onnx import Kokoro
kok = Kokoro(os.path.join(KDIR, "kokoro-v1.0.onnx"), os.path.join(KDIR, "voices-v1.0.bin"))
def tts(text, voice, speed):
    for a, b in TTS_FIX: text = text.replace(a, b)
    a, _ = kok.create(text, voice=voice, speed=speed, lang="en-us"); a = a.astype(np.float32)
    nz = np.where(np.abs(a) > .01)[0]; return a[max(0, nz[0] - 500): nz[-1] + 1000] if len(nz) else a
def kw(text, key, voiced):
    if isinstance(key, (int, float)): return float(key)
    m = re.match(r"^(.*)\+(-?\d+(?:\.\d+)?)$", key)
    if m: return kw(text, m.group(1), voiced) + float(m.group(2))
    i = text.lower().find(key.lower())
    if i < 0: print("WARN keyword not found:", key, "|", text[:50]); return voiced * .5
    return voiced * i / len(text)

# ---------------- timeline ----------------
audio = []; caps = []; shots = []; LT = []; t0 = 0.0
for li, (text, plan, opts) in enumerate(LINES):
    t0 += opts.get("pre", 0.0)
    v = tts(text, opts.get("voice", "af_heart"), opts.get("speed", 0.9))
    if opts.get("cry"): v = cry_fx(v)
    if opts.get("phone"): v = phone_fx(v)
    rms = np.sqrt(np.mean(v[np.abs(v) > .01] ** 2)) if np.any(np.abs(v) > .01) else 1.0
    v = v * (0.11 / (rms + 1e-9)) * (0.92 if opts.get("phone") else 1.0)
    d = len(v) / SR; audio.append((t0, v * opts.get("gain", 1.0), "voice"))
    if opts.get("cry"):
        for s_ in opts.get("sniffs", [0.0]): audio.append((t0 + s_ * d - .25, sniff(), "fx"))
    if opts.get("cap", True):
        words = text.split(); chunks = []; cur = []
        for w in words:
            cur.append(w)
            if len(" ".join(cur)) > (26 if G.get("VERTICAL") else 38) or w.endswith((".", "?", "!")) and len(" ".join(cur)) > 12: chunks.append(" ".join(cur)); cur = []
        if cur: chunks.append(" ".join(cur))
        pos = 0; L = len(text)
        for c in chunks:
            a = t0 + d * pos / L; pos += len(c) + 1; caps.append((a, t0 + d * min(pos, L) / L, c, bool(opts.get("phone"))))
    for sp in plan:
        shots.append(dict(sp, li=li, tline=t0, d=d, text=text, st=kw(text, sp.get("at", 0), d)))
    LT.append((text, t0, d)); t0 += d + GAP + opts.get("post", 0.0)
TOTAL = t0 + 0.6
shots[0]["st"] = -shots[0]["tline"]  # first shot starts at 0
for s in shots: s["abs"] = s["tline"] + s["st"]
def at_(s, v):
    if isinstance(v, (int, float)): return float(v)
    li = s["li"]; m_ = re.match(r"^@(-?\d+):(.*)$", v)
    if m_: li += int(m_.group(1)); v = m_.group(2)
    tx, tl, dd = LT[li]; return tl + kw(tx, v, dd) - s["abs"]
TIMEKEYS = {"at", "at2", "until", "peel", "out"}
def resolve(s, obj, key=None):
    if isinstance(obj, dict): return {k: (at_(s, v) if k in TIMEKEYS and isinstance(v, (str, int, float)) else resolve(s, v, k)) for k, v in obj.items()}
    if isinstance(obj, list):
        if key in ("shake", "heart", "glitch"):
            if key == "heart": return [at_(s, x) for x in obj]
            return [[at_(s, x[0]), at_(s, x[1])] + list(x[2:]) for x in obj]
        return [resolve(s, x, key) for x in obj]
    return obj
from PIL import Image
imgsize = {}
jobs = []
for i, s in enumerate(shots):
    end = shots[i + 1]["abs"] if i + 1 < len(shots) else TOTAL
    s["dur"] = end - s["abs"]; s["frames"] = int(round(end * FPS)) - int(round(s["abs"] * FPS))
    src = os.path.join(VDIR, "img", s["img"] + ".jpg")
    if src not in imgsize: imgsize[src] = Image.open(src).size
    w, h = imgsize[src]
    p = {"src": os.path.relpath(src, os.path.join(HERE, "cartoon")), "w": w, "h": h, "cam": s.get("cam"), "ease": s.get("ease"),
         "fx": resolve(s, s.get("fx", {})), "ov": resolve(s, s.get("ov", [])), "seed": i * 1.7}
    s["P"] = p
    if s.get("trans"): audio.append((s["abs"], sfx("whoosh") * (.5 if s["trans"] != "whip" else .8), "fx")) if s["trans"] in ("whip", "fade", "black") else None
    for item in s.get("sfx", []):
        when, nm = item[0], item[1]; g = item[2] if len(item) > 2 else .8
        audio.append((s["abs"] + at_(s, when), sfx(nm) * g, "fx"))
    if s.get("amb"):
        n = int(s["dur"] * SR); a_ = amb(s["amb"], n); a_ = a_ / (np.abs(a_).max() + 1e-9)
        fade = np.minimum(1, np.minimum(np.arange(n), n - np.arange(n)) / (SR * .4)); audio.append((s["abs"], a_ * fade * s.get("ambg", .12), "amb"))
for i, s in enumerate(shots):
    sh = {"p": s["P"], "dur": s["dur"], "trans": s.get("trans", "cut"), "id": i}
    if i and s.get("trans", "cut") != "cut":
        pv = shots[i - 1]; sh["prev"] = {"p": pv["P"], "dur": pv["dur"], "id": i - 1}
    jobs.append({"id": f"s{i:03d}", "shot": sh, "frames": s["frames"]})
json.dump(jobs, open(os.path.join(TMP, "shots.json"), "w"), indent=1)
json.dump([{"text": a, "start": b_, "dur": c_} for a, b_, c_ in LT], open(os.path.join(TMP, "lines.json"), "w"), indent=1)
print("timeline", round(TOTAL, 1), "s", len(jobs), "shots", flush=True)
if os.environ.get("DRY"): sys.exit(0)

# ---------------- render ----------------
for f in os.listdir(SEG): os.remove(os.path.join(SEG, f))
W = min(4, len(jobs)); order = sorted(jobs, key=lambda j: -j["frames"]); buckets = [[] for _ in range(W)]; load = [0] * W
for j in order: k = load.index(min(load)); buckets[k].append(j); load[k] += j["frames"]
VERT = bool(G.get("VERTICAL"))
procs = []; env = dict(os.environ, ENGINE="comic2v.html" if VERT else "comic2.html", VW="1080" if VERT else "1920", VH="1920" if VERT else "1080")
for k in range(W):
    jf = os.path.join(TMP, f"jobs{k}.json"); json.dump(buckets[k], open(jf, "w"))
    procs.append(subprocess.Popen(["node", os.path.join(HERE, "cartoon", "render_shots.js"), jf, SEG], env=env, stdout=subprocess.DEVNULL))
for p_ in procs: p_.wait(); assert p_.returncode == 0
with open(os.path.join(TMP, "list.txt"), "w") as lst:
    for j in jobs: lst.write(f"file '{os.path.join(SEG, j['id'] + '.mp4')}'\n")

# ---------------- mix ----------------
N = int(TOTAL * SR) + SR
bus = {"voice": np.zeros(N, np.float32), "fx": np.zeros(N, np.float32), "amb": np.zeros(N, np.float32)}
for at, smp, kind in audio:
    s0 = max(0, int(at * SR)); seg = smp[: max(0, N - s0)]; bus[kind][s0:s0 + len(seg)] += seg
voice = bus["voice"] / (np.percentile(np.abs(bus["voice"]), 99.9) + 1e-9) * .8
mus = music(N) * .075
duck = np.convolve((np.abs(voice) > .02).astype(float), np.ones(SR // 4) / (SR // 4), "same")
mus *= 1 - .45 * np.clip(duck * 3, 0, 1)
mix = voice + bus["fx"] * .5 + bus["amb"] + mus; mix = mix / np.abs(mix).max() * .95
sf.write(os.path.join(TMP, "mix.wav"), mix, SR)

# ---------------- captions ----------------
def ts(t): h, r = divmod(max(t, 0), 3600); m, s = divmod(r, 60); return f"{int(h)}:{int(m):02d}:{s:05.2f}"
def hl(c):
    for k in sorted(HIGHLIGHT, key=len, reverse=True):
        c = re.sub(r"(?<![\w$])(" + re.escape(k) + r")(?![\w])", r"{\\c&H66D1FF&}\1{\\c&HFFFFFF&}", c)
    return c
PRX, PRY = (1080, 1920) if VERT else (1920, 1080)
CAPS = ("Inter,66", "70,70,430") if VERT else ("Inter,54", "180,180,38")
ass = ["[Script Info]", "ScriptType: v4.00+", f"PlayResX: {PRX}", f"PlayResY: {PRY}", "", "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       f"Style: Cap,{CAPS[0]},&H00FFFFFF,&H00FFFFFF,&H5020130B,&H5020130B,1,0,0,0,100,100,0,0,3,10,0,2,{CAPS[1]},1",
       f"Style: Phone,{CAPS[0]},&H0066D1FF,&H0066D1FF,&H5020130B,&H5020130B,1,1,0,0,100,100,0,0,3,10,0,2,{CAPS[1]},1", "", "[Events]",
       "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
srt = []
for i, (a, b, c, ph) in enumerate(caps):
    ass.append(f"Dialogue: 0,{ts(a)},{ts(b)},{'Phone' if ph else 'Cap'},,0,0,0,,{c if ph else hl(c)}")
    f = lambda x: f"{int(x//3600):02d}:{int(x%3600//60):02d}:{int(x%60):02d},{int((x%1)*1000):03d}"
    srt += [str(i + 1), f"{f(a)} --> {f(b)}", c, ""]
open(os.path.join(TMP, "cap.ass"), "w").write("\n".join(ass)); open(os.path.join(TMP, "captions.srt"), "w").write("\n".join(srt))
fonts = os.path.join(HERE, "fonts"); dst = os.path.join(OUT, NAME + ".mp4")
meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", os.path.join(TMP, "mix.wav"), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                      capture_output=True, text=True).stderr
mj = json.loads(meas[meas.rindex("{"):meas.rindex("}") + 1])
LN = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={mj['input_i']}:measured_TP={mj['input_tp']}:measured_LRA={mj['input_lra']}"
      f":measured_thresh={mj['input_thresh']}:offset={mj['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", os.path.join(TMP, "list.txt"), "-i", os.path.join(TMP, "mix.wav"),
                "-vf", f"subtitles={os.path.join(TMP, 'cap.ass')}:fontsdir={fonts}", "-af", LN,
                "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest",
                "-movflags", "+faststart", dst], check=True)
print("done", dst, round(TOTAL, 1), "s", flush=True)
