"""Audio + render for the comic-style test scene. python build_comic_test.py <kokoro_dir>"""
import os, sys, json, subprocess, numpy as np, soundfile as sf
K = sys.argv[1]; HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "..", "tests", "comic"); SR = 24000; END = 19.8
from kokoro_onnx import Kokoro
kok = Kokoro(os.path.join(K, "kokoro-v1.0.onnx"), os.path.join(K, "voices-v1.0.bin"))
LINES = [(0.9, "Eleven forty-seven p.m. Another long day."), (6.9, "Then, her phone buzzes."),
         (11.9, "An unpaid road toll. Just three dollars and ninety-five cents."), (15.9, "It looks harmless. It's not.")]
N = int((END + 1) * SR); voice = np.zeros(N); fx = np.zeros(N); rng = np.random.default_rng(3)
for at, txt in LINES:
    a, _ = kok.create(txt, voice="af_heart", speed=0.9, lang="en-us"); i = int(at * SR); voice[i:i + len(a)] += a[: N - i]; print(at, round(len(a) / SR, 2), txt)
def lp(x, a): k = a * (1 - a) ** np.arange(int(12 / a)); return np.convolve(x, k)[: len(x)]
t = np.arange(N) / SR
rain = lp(rng.standard_normal(N), .25) * .5 + rng.standard_normal(N) * .04
rain *= np.where(t < 11.2, 1.0, .55)
thunder = np.zeros(N); i = int(.2 * SR); n = int(3.5 * SR); tt = np.arange(n) / SR
thunder[i:i + n] = lp(rng.standard_normal(n), .01) * np.exp(-tt * 1.2) * 6
def put(at, x, g=1.0):
    i = int(at * SR); fx[i:i + len(x)] += g * x[: N - i]
tb = 5.4 + 1.2; bz = np.arange(int(1.3 * SR)) / SR
put(tb, .5 * np.sign(np.sin(2 * np.pi * 150 * bz)) * ((bz % .45) < .32) * (.6 + .4 * np.sin(2 * np.pi * 8 * bz)))
w = np.arange(int(.5 * SR)) / SR; put(11.1, lp(rng.standard_normal(len(w)), .1) * np.sin(np.pi * w / .5) ** 2 * 3)
d = np.arange(int(.14 * SR)) / SR; put(12.0, .4 * (np.sin(2 * np.pi * 1320 * d) + np.sin(2 * np.pi * 1760 * d)) * np.exp(-d * 20))
s = np.arange(int(.5 * SR)) / SR; put(16.9, .9 * np.sin(2 * np.pi * 60 * s) * np.exp(-s * 9) + .3 * rng.standard_normal(len(s)) * np.exp(-s * 30))
put(18.2, .5 * np.sin(2 * np.pi * np.cumsum(500 * np.exp(-s * 3) + 80) / SR) * np.exp(-s * 3))
drone = sum(a * np.sin(2 * np.pi * f * t) for f, a in [(55, .5), (82.4, .3), (110, .2), (164.8, .08)]) * (.6 + .4 * np.sin(2 * np.pi * t / 7))
drone *= np.clip(t / 2, 0, 1) * np.clip((END + .5 - t) / 1.5, 0, 1)
voice /= np.abs(voice).max(); mix = voice * .9 + fx * .35 + rain * .05 + thunder * .05 + drone * .05
mix = mix / np.abs(mix).max() * .95; wav = os.path.join(OUT, "mix.wav"); sf.write(wav, mix, SR)
jobs = [{"id": "comic", "shot": {}, "frames": int(END * 30)}]; jf = os.path.join(OUT, "jobs.json"); json.dump(jobs, open(jf, "w"))
seg = os.path.join(OUT, "seg"); os.makedirs(seg, exist_ok=True)
for f in os.listdir(seg): os.remove(os.path.join(seg, f))
subprocess.run(["node", os.path.join(HERE, "cartoon", "render_shots.js"), jf, seg], env=dict(os.environ, ENGINE="comic.html"), check=True)
dst = os.path.join(OUT, "comic-test.mp4")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(seg, "comic.mp4"), "-i", wav, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", dst], check=True)
print("done", dst)
