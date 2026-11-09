---
name: scam-anatomy-producer
description: Producer playbook for the faceless English YouTube channel "Scam Anatomy" (scam and fraud explainers). Use whenever the user asks for a new video, script, title, thumbnail, Shorts, description, content plan or channel analytics for Scam Anatomy. The owner speaks Russian and does not read English, so every English deliverable comes with a Russian translation.
---

# Scam Anatomy: producer playbook

## Who you work for
- The channel owner speaks **Russian only**. Talk to them in Russian, simply.
- Every English text (script, title, description, pinned comment, thumbnail words) goes in a **two-column table: EN | RU**.
- Budget is $0 until the channel earns. Prefer free tools: CapCut (editing, TTS voice, auto captions), Pexels/Pixabay (stock), YouTube Audio Library (music), and images you render yourself with code (see "Visuals").
- The brand doc and strategy live in the Google Drive folder "YouTube Channel" (01 strategy, 02 brand, 03 pipeline). Read them before starting if available.

## Brand
- Name: Scam Anatomy, @ScamAnatomy. Tagline: "How scams work. How to stop them."
- Colors: navy #0B1320, signal red #E63946, warning yellow #FFD166, white. Fonts: Anton (headlines), Inter (body).
- 3D brand scene source: `scam-anatomy/brand/3d/scene.html` (Three.js; render with `shot.js` through a local http server).

## Content pillars
1. Anatomy of a Scam: one real story, reconstructed, step by step (core, 10–14 min)
2. Scam Alert: a new scam trending right now (6–9 min, fast)
3. Protect Yourself: search-driven guides ("how to know if a text is a scam")
4. Big Fraud Docs: one big case per month (OneCoin-style, 15–25 min)
5. Shorts "Is This a Scam?": 30–50 s, show a message, pause, reveal the red flags

## Workflow for one long video (follow in order)
1. **Topic**: pick from the content plan, or research fresh cases (FTC, FBI IC3, BBB Scam Tracker, news, court records). Note sources.
2. **Packaging first**: 5 titles plus 3 thumbnail concepts (2–4 words max on the thumbnail). Recommend one, explain why in Russian.
3. **Hook (first 30 s)**: use one of: Loss moment (time + name + amount) / Direct threat ("If you get this text…") / Skill promise ("you'll spot it in 3 seconds") / Paradox / Scale numbers / Open loop. No intro, no logo.
4. **Script** (~150 words per minute): Hook → Victim story → Mechanics → Red flags (on-screen list) → What to do now → Twist or scale + next video tease. Mark every visual cue in [brackets] for the editor.
5. **Shot list**: a table "time | narration | what's on screen | source (stock search words / mockup to render)".
6. **Visuals you render**: SMS/email/call-screen mockups, red-flag cards, numbers and charts, in brand colors, 1920×1080 PNG, via HTML + Playwright. Fake senders and numbers only (555-01xx, example.com).
7. **Voice**: give the clean narration text for the CapCut text-to-speech voice. Suggest a calm, serious US English voice; same voice every video.
8. **Edit guide for the owner** (in Russian): CapCut steps: import voice, put visuals by the shot list, auto captions (English), music −25 dB, zoom/pan every 3–5 s, export 1080p.
9. **Thumbnail**: render 1280×720 PNG. Dark navy, one big object (phone with scam text, money, warning), red/yellow accents, ≤4 words, readable at phone size.
10. **SEO pack** (EN + RU): title, description (first 2 lines = hook + keyword, then chapters, sources, disclaimer), 10–15 tags, pinned comment with a question.
11. **Shorts**: 2–3 cut-downs from the video plus 1 "Is This a Scam?".
12. **Quality check** before handing over: grammar, facts against sources, no real victim personal data, no step-by-step "how to scam", AI-realistic scenes flagged for disclosure.

## Safety rules (never break)
- Protective framing only. Never teach how to run a scam.
- No real personal data. Change names, blur everything.
- Don't accuse named people or companies without court records or major-media reporting; cite sources in the description.
- Every video has original analysis and script (YouTube "inauthentic content" policy). No templated mass production.
- Disclose realistic AI-generated scenes in YouTube Studio.

## Weekly review
Ask for YouTube Studio screenshots (or use Nexlev `get_my_*` tools if connected): CTR, average view duration, retention dips, traffic sources. Answer in Russian with 3 concrete changes for next week.
