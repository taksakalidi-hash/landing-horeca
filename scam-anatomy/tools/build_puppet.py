"""Build a puppet-engine (puppet.html) video from a small plan.
venv/bin/python build_puppet.py <plan.py> <out_dir> <kokoro_dir>
plan: LINES=[(text, voice, speed, who)]  who="dave" drives lip-sync; SFX=[(keyword, name, gain, nth)]
"""
import sys, os, json, subprocess, re
import numpy as np, soundfile as sf
PLAN, OUT, KDIR = [os.path.abspath(a) for a in sys.argv[1:4]]
HERE = os.path.dirname(os.path.abspath(__file__)); os.makedirs(OUT, exist_ok=True)
FPS, SR = 30, 24000; rng = np.random.default_rng(5)
src = open(os.path.join(HERE, "build_comic.py")).read()
exec(src[src.index("# ---------------- DSP helpers"):src.index("def music(N)")], globals())   # tt, lowpass, sfx(...)
G = {}; exec(open(PLAN).read(), G); LINES, SFX = G["LINES"], G.get("SFX", [])
PRE, GAP, POST = G.get("PRE", .7), G.get("GAP", .32), G.get("POST", 3.4)
from kokoro_onnx import Kokoro
kok = Kokoro(os.path.join(KDIR, "kokoro-v1.0.onnx"), os.path.join(KDIR, "voices-v1.0.bin"))
clips, words, t = [], [], PRE
for text, voice, speed, who in LINES:
    a, _ = kok.create(text, voice=voice, speed=speed, lang="en-us"); a = a.astype(np.float32)
    nz = np.where(np.abs(a) > .01)[0]; a = a[max(0, nz[0] - 300): nz[-1] + 1200]
    a *= .11 / (np.sqrt(np.mean(a[np.abs(a) > .01] ** 2)) + 1e-9)
    d = len(a) / SR; pos = 0
    for w in text.split():   # word time estimate by character position
        words.append({"w": w, "t": round(t + d * pos / len(text), 3)}); pos += len(w) + 1
    clips.append((t, a, who)); t += d + GAP
N = int((t - GAP + POST) * SR); voice = np.zeros(N, np.float32); dave = np.zeros(N, np.float32)
for t0, a, who in clips:
    s = int(t0 * SR); voice[s:s + len(a)] += a
    if who == "dave": dave[s:s + len(a)] += a
nf = int(N / SR * FPS); hop = SR // FPS
env = np.array([np.sqrt(np.mean(dave[i * hop:(i + 1) * hop] ** 2)) for i in range(nf)])
env = np.clip(env / (np.percentile(env[env > 1e-4], 90) + 1e-9), 0, 1.3) if (env > 1e-4).any() else env
env = np.convolve(env, [.25, .5, .25], "same")
def kw(k, n=0):
    c = 0
    for w in words:
        if re.sub(r"[^a-z0-9]", "", w["w"].lower()).startswith(k.lower()):
            if c == n: return w["t"]
            c += 1
    raise SystemExit("keyword not found: " + k)
fx = np.zeros(N, np.float32)
for k, name, g, *nth in SFX:
    c = sfx(name) * g; s = int((kw(k, nth[0] if nth else 0) + (nth[1] if len(nth) > 1 else 0)) * SR); fx[s:s + len(c)] += c[: max(0, N - s)]
# upbeat comedic bed: pizzicato bass + plucks, C major I-vi-IV-V at 112 bpm
bt = 60 / 112; tm = np.arange(N) / SR; mus = np.zeros(N)
prog = [(130.8, [261.6, 329.6, 392]), (110, [220, 261.6, 329.6]), (87.3, [174.6, 220, 261.6]), (98, [196, 246.9, 293.7])]
for b in range(int(N / SR / bt * 2)):
    root, ch = prog[(b // 8) % 4]; s0 = int(b * bt / 2 * SR); d = .28; tc = tt(d)
    if b % 2 == 0:
        n = np.sin(2 * np.pi * root * tc) * envd(d, 9) * .9; mus[s0:s0 + len(n)] += n[: max(0, N - s0)]
    f = ch[(b * 7) % 3] * (2 if b % 4 == 3 else 1)
    n = (np.sin(2 * np.pi * f * tc) + .3 * np.sin(4 * np.pi * f * tc)) * envd(d, 14) * .35; mus[s0:s0 + len(n)] += n[: max(0, N - s0)]
mus /= np.abs(mus).max() + 1e-9
duck = np.convolve((np.abs(voice) > .01).astype(np.float32), np.ones(4800) / 4800, "same")
mix = voice + fx * .5 + mus * (.09 - .05 * np.clip(duck * 3, 0, 1)) * np.clip(tm / 1.0, 0, 1) * np.clip((N / SR - tm) / 1.5, 0, 1)
sf.write(os.path.join(OUT, "mix.wav"), (mix / max(1, np.abs(mix).max() / .95)).astype(np.float32), SR)
dur = N / SR; frames = int(dur * FPS)
shot = {"words": words, "env": [round(float(v), 3) for v in env]}
half = frames // 2
jobs = [{"id": "a", "shot": {**shot, "t0": 0}, "frames": half}, {"id": "b", "shot": {**shot, "t0": half / FPS}, "frames": frames - half}]
cart = os.path.join(HERE, "cartoon"); seg = os.path.join(OUT, "seg"); os.makedirs(seg, exist_ok=True)
for f in os.listdir(seg): os.remove(os.path.join(seg, f))
ps = []
for j in jobs:
    p = os.path.join(OUT, "job_" + j["id"] + ".json"); json.dump([j], open(p, "w"))
    ps.append(subprocess.Popen(["node", "render_shots.js", p, seg], cwd=cart, env={**os.environ, "ENGINE": "puppet.html"}))
for p in ps: p.wait()
open(os.path.join(seg, "list.txt"), "w").write("file 'a.mp4'\nfile 'b.mp4'\n")
name = G.get("NAME", "out")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", os.path.join(seg, "list.txt"), "-i", os.path.join(OUT, "mix.wav"),
                "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "160k",
                "-shortest", "-movflags", "+faststart", os.path.join(OUT, name + ".mp4")], check=True)
print("done", os.path.join(OUT, name + ".mp4"), round(dur, 2), "s")
