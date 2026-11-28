"""Puppet engine v2 builder (multi-scene episodes).
venv/bin/python build_puppet2.py <episode_dir> <kokoro_dir> [--dry]
episode_dir has plan.py (LINES dicts: text,v=(voice,speed),who,sc,...; SFX=[(kw,name,gain[,nth,offset])]) and scenes.js
"""
import sys, os, json, subprocess, re
import numpy as np, soundfile as sf
EP, KDIR = [os.path.abspath(a) for a in sys.argv[1:3]]; DRY = "--dry" in sys.argv
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(EP, "out"); os.makedirs(OUT, exist_ok=True)
FPS, SR = 30, 24000; rng = np.random.default_rng(5)
G = {}; exec(open(os.path.join(EP, "plan.py")).read(), G); LINES, SFX = G["LINES"], G.get("SFX", [])
PRE, GAP, SCGAP, POST = .6, .36, .6, 2.5

# ---------------- sound design (all synthesized) ----------------
def tt(d): return np.arange(int(d * SR)) / SR
def env(d, k): return np.exp(-tt(d) * k)
def lp(x, a):
    k = np.exp(-a); ker = (1 - k) * k ** np.arange(int(min(6000, 8 / (1 - k + 1e-9))))
    return np.convolve(x, ker)[: len(x)]
def noise(d): return rng.standard_normal(int(d * SR))
def sweep(f0, f1, d, k=0):
    t = tt(d); f = f0 * (f1 / f0) ** (t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR) * (env(d, k) if k else 1)
def SFXF(name):
    if name == "pop":   return sweep(300, 900, .09, 30) * .8
    if name == "pop2":  return sweep(500, 1400, .07, 40) * .7
    if name == "boing": t = tt(.45); return np.sin(2 * np.pi * (180 + 120 * np.sin(2 * np.pi * 9 * t) * env(.45, 4)) * t) * env(.45, 6) * .7
    if name == "whoosh":
        x = noise(.45); w = np.sin(np.pi * np.linspace(0, 1, len(x))) ** 2; return lp(x, 2.2 - 1.6 * 0) * w * .35
    if name == "slide_up": return sweep(400, 1600, .35) * np.sin(np.pi * np.linspace(0, 1, int(.35 * SR))) * .35
    if name == "slide_down": return sweep(1400, 300, .45) * np.sin(np.pi * np.linspace(0, 1, int(.45 * SR))) * .35
    if name == "coin":
        t = tt(.5); return sum(a * np.sin(2 * np.pi * f * t) for f, a in [(2637, .5), (3951, .35), (5274, .2)]) * env(.5, 9) * .5
    if name == "coins":
        out = np.zeros(int(.9 * SR))
        for k in range(7): s = int(k * .09 * SR + rng.uniform(0, .03) * SR); c = SFXF("coin")[: len(out) - s] * rng.uniform(.4, .8); out[s:s + len(c)] += c
        return out
    if name == "kaching":
        out = np.zeros(int(1.0 * SR)); dr = lp(noise(.15), 1.2) * env(.15, 25) * .5; out[:len(dr)] += dr
        b = SFXF("coin") * 1.4; s = int(.12 * SR); out[s:s + len(b)] += b; return out
    if name == "buzz":   # phone vibrating on a desk: two short motor bursts with rattle
        out = np.zeros(int(.9 * SR))
        for s0 in (0, .42):
            t = tt(.3); m = np.sign(np.sin(2 * np.pi * 150 * t)) * .5 + np.sin(2 * np.pi * 300 * t) * .3
            m = lp(m, 1.5) * (np.sin(np.pi * t / .3) ** .5) * (1 + .3 * np.sin(2 * np.pi * 23 * t)); s = int(s0 * SR); out[s:s + len(m)] += m * .45
        return out
    if name == "notify": t = tt(.35); return (np.sin(2 * np.pi * 1318 * t) * env(.35, 10) + np.roll(np.sin(2 * np.pi * 1760 * t) * env(.35, 10), int(.09 * SR))) * .35
    if name == "slam":   return (lp(noise(.5), 3.5) * env(.5, 9) * 1.2 + np.sin(2 * np.pi * 55 * tt(.5)) * env(.5, 7)) * .7
    if name == "stamp":  return (lp(noise(.25), 2.5) * env(.25, 22) + np.sin(2 * np.pi * 90 * tt(.25)) * env(.25, 18)) * .8
    if name == "scribble":
        x = noise(.6); a = (np.abs(np.sin(2 * np.pi * 7 * tt(.6))) ** 2); return (x - lp(x, .3)) * a * .12
    if name == "tick": return (noise(.03) - lp(noise(.03), .2)) * env(.03, 120) * .5
    if name == "clock":
        out = np.zeros(int(1.2 * SR))
        for k in range(6): c = SFXF("tick"); s = int(k * .2 * SR); out[s:s + len(c)] += c
        return out
    if name == "snip": return np.concatenate([(noise(.05) - lp(noise(.05), .1)) * env(.05, 60), np.zeros(int(.07 * SR)), (noise(.06) - lp(noise(.06), .1)) * env(.06, 50)]) * .6
    if name == "roar":
        t = tt(.9); x = lp(noise(.9), 1.8) * (1 + np.sin(2 * np.pi * 28 * t)) * np.sin(np.pi * t / .9) ** .6; return x * .5 + sweep(140, 70, .9) * np.sin(np.pi * t / .9) * .3
    if name == "sputter":
        out = np.zeros(int(1.2 * SR))
        for k in range(6): s = int((k * .17 + rng.uniform(0, .04)) * SR); c = lp(noise(.12), 2.2) * env(.12, 25) * rng.uniform(.4, .9); out[s:s + len(c)] += c
        return out
    if name == "melt": return sweep(900, 200, .9) * np.sin(np.pi * np.linspace(0, 1, int(.9 * SR))) * (1 + .5 * np.sin(2 * np.pi * 7 * tt(.9))) * .2
    if name == "success":
        out = np.zeros(int(.9 * SR))
        for k, f in enumerate([523, 659, 784, 1047]): t = tt(.4); s = int(k * .09 * SR); c = (np.sin(2 * np.pi * f * t) + .3 * np.sin(4 * np.pi * f * t)) * env(.4, 8) * .3; out[s:s + len(c)] += c[: len(out) - s]
        return out
    if name == "glitch":
        out = np.zeros(int(.5 * SR))
        for k in range(8): s = int(k * .06 * SR); c = (noise(.03) - lp(noise(.03), .3)) * .4; out[s:s + len(c)] += c
        return out
    if name == "crowd_aw": t = tt(1.0); return lp(noise(1.0), 1.2) * np.sin(np.pi * t) * .25 + sweep(320, 220, 1.0) * np.sin(np.pi * t) * .15
    raise SystemExit("unknown sfx " + name)

# ---------------- TTS ----------------
from kokoro_onnx import Kokoro
kok = Kokoro(os.path.join(KDIR, "kokoro-v1.0.onnx"), os.path.join(KDIR, "voices-v1.0.bin"))
cache = os.path.join(OUT, "tts"); os.makedirs(cache, exist_ok=True)
clips, words, lines, t, prev = [], [], [], PRE, None
for i, L in enumerate(LINES):
    key = re.sub(r"[^a-z0-9]", "", (L["v"][0] + str(L["v"][1]) + L["text"]).lower())[:120]
    fp = os.path.join(cache, f"{i:03d}_{abs(hash(key)) % 10**8}.wav")
    if os.path.exists(fp): a, _ = sf.read(fp, dtype="float32")
    else:
        a, _ = kok.create(L["text"], voice=L["v"][0], speed=L["v"][1], lang="en-us"); a = a.astype(np.float32)
        nz = np.where(np.abs(a) > .01)[0]; a = a[max(0, nz[0] - 300): nz[-1] + 1200]; sf.write(fp, a, SR)
    a = a * (.11 / (np.sqrt(np.mean(a[np.abs(a) > .01] ** 2)) + 1e-9))
    if prev is not None and L["sc"] != prev: t += SCGAP - GAP
    d = len(a) / SR; pos = 0
    for w in L["text"].split():
        words.append({"w": w, "t": round(t + d * pos / len(L["text"]), 3), "l": i}); pos += len(w) + 1
    lines.append({**{k: v for k, v in L.items() if k != "v"}, "start": round(t, 3), "dur": round(d, 3)})
    clips.append((t, a, L["who"])); t += d + GAP; prev = L["sc"]
TOTAL = t - GAP + POST; N = int(TOTAL * SR)
print("timeline", round(TOTAL, 1), "s", len(lines), "lines")
if DRY:
    for l in lines: print(f'{l["start"]:7.2f} {l["sc"]:8s} {l["text"][:70]}')
    raise SystemExit
voice = np.zeros(N, np.float32); spk = {"dave": np.zeros(N, np.float32), "penny": np.zeros(N, np.float32)}
for t0, a, who in clips:
    s = int(t0 * SR); voice[s:s + len(a)] += a
    if who in spk: spk[who][s:s + len(a)] += a
nf = int(TOTAL * FPS); hop = SR // FPS
def envof(x):
    e = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2)) for i in range(nf)])
    if (e > 1e-4).any(): e = np.clip(e / (np.percentile(e[e > 1e-4], 90) + 1e-9), 0, 1.3)
    return [round(float(v), 3) for v in np.convolve(e, [.25, .5, .25], "same")]
def kw(k, n=0):
    c = 0
    for w in words:
        if re.sub(r"[^a-z0-9]", "", w["w"].lower()).startswith(k.lower()):
            if c == n: return w["t"]
            c += 1
    raise SystemExit("keyword not found: " + k)
fx = np.zeros(N, np.float32)
def put(t0, c, g=1.):
    s = int(t0 * SR)
    if s >= N: return
    c = np.asarray(c, np.float32)[: N - s]; fx[s:s + len(c)] += c * g
for i, l in enumerate(lines):   # automatic: whoosh on scene change, sting on rule cards
    if i and l["sc"] != lines[i - 1]["sc"]: put(l["start"] - .35, SFXF("whoosh"), .8)
    if l["sc"] == "rule": put(l["start"] - .05, SFXF("slam"), .5); put(l["start"] + .05, SFXF("success"), .5)
for k, name, g, *o in SFX: put(kw(k, o[0] if o else 0) + (o[1] if len(o) > 1 else 0), SFXF(name), g)
# ---------------- music: light lo-fi groove, 96 bpm ----------------
bt = 60 / 96; tm = np.arange(N) / SR; mus = np.zeros(N)
prog = [(130.8, [261.6, 329.6, 392, 493.9]), (110, [220, 261.6, 329.6, 392]), (87.3, [174.6, 220, 261.6, 329.6]), (98, [196, 246.9, 293.7, 349.2])]
kick = sweep(120, 45, .25, 14) * .9; hat = (noise(.04) - lp(noise(.04), .1)) * env(.04, 90) * .25; snr = (lp(noise(.18), 1.0) * env(.18, 22) * .5 + np.sin(2 * np.pi * 190 * tt(.18)) * env(.18, 30) * .3)
def add(sig, s0, g):
    s = int(s0 * SR)
    if s < N: mus[s:s + len(sig)] += sig[: N - s] * g
for b in range(int(TOTAL / bt) + 1):
    s0 = b * bt; root, ch = prog[(b // 4) % 4]
    add(kick, s0, .55 if b % 2 == 0 else .0); add(snr, s0, .35 if b % 2 == 1 else 0)
    for h in (0, .5): add(hat, s0 + h * bt, .5)
    d = bt * 1.9
    if b % 2 == 0:
        bass = (np.sin(2 * np.pi * root / 2 * tt(d)) + .2 * np.sin(2 * np.pi * root * tt(d))) * env(d, 3); add(bass, s0, .5)
        pad = sum(np.sin(2 * np.pi * f * tt(d * 2)) for f in ch) * env(d * 2, 1.2) * .12; add(pad, s0, 1)
    f = ch[(b * 3) % 4] * 2; pl = (np.sin(2 * np.pi * f * tt(.3)) + .3 * np.sin(4 * np.pi * f * tt(.3))) * env(.3, 14) * .18; add(pl, s0 + .5 * bt, 1)
mus /= np.abs(mus).max() + 1e-9
duck = np.convolve((np.abs(voice) > .01).astype(np.float32), np.ones(4800) / 4800, "same")
mix = voice + fx * .45 + mus * (.085 - .045 * np.clip(duck * 3, 0, 1)) * np.clip(tm / 1.5, 0, 1) * np.clip((TOTAL - tm) / 2, 0, 1)
sf.write(os.path.join(OUT, "mix.wav"), (mix / max(1, np.abs(mix).max() / .95)).astype(np.float32), SR)
shot = {"words": words, "lines": lines, "env": {k: envof(v) for k, v in spk.items()}, "total": TOTAL}
json.dump(shot, open(os.path.join(OUT, "shot.json"), "w"))
if "--noshoot" in sys.argv: print("shot.json written"); raise SystemExit
# ---------------- render (4 workers) ----------------
frames = int(TOTAL * FPS); NW = int(os.environ.get("NW", 4)); cuts = [frames * k // NW for k in range(NW + 1)]
cart = os.path.join(HERE, "cartoon"); seg = os.path.join(OUT, "seg"); os.makedirs(seg, exist_ok=True)
for f in os.listdir(seg): os.remove(os.path.join(seg, f))
ps = []
for k in range(NW):
    j = [{"id": f"p{k}", "shot": {**shot, "t0": cuts[k] / FPS}, "frames": cuts[k + 1] - cuts[k]}]
    jp = os.path.join(OUT, f"job{k}.json"); json.dump(j, open(jp, "w"))
    ps.append(subprocess.Popen(["node", "render_shots.js", jp, seg], cwd=cart, env={**os.environ, "ENGINE": "puppet2.html?ep=" + EP + "/scenes.js"}))
for p in ps: p.wait()
open(os.path.join(seg, "list.txt"), "w").write("".join(f"file 'p{k}.mp4'\n" for k in range(NW)))
name = G.get("NAME", "out")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", os.path.join(seg, "list.txt"), "-i", os.path.join(OUT, "mix.wav"),
                "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "160k",
                "-shortest", "-movflags", "+faststart", os.path.join(OUT, name + ".mp4")], check=True)
print("done", os.path.join(OUT, name + ".mp4"), round(TOTAL, 2), "s")
