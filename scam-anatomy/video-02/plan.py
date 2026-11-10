# Shot plan for Video 02 — Money Mules. Executed by tools/build_cartoon.py (overrides its defaults).
N_PARAS = 31
JOBTXT = ["JOB OFFER: Payment Assistant.", "Earn $3,500/mo + 10%. Receive", "client payments to your bank,", "send the rest via Bitcoin ATM.", "Reply YES to start today!"]
HELLO = {"who": "in", "txt": ["Hi Tyler! 👋 Sarah from HR here.", "Loved your profile — you're hired!"], "at": -1}
PLAN = {
 0: ("room", {"brow": .3, "label": "TYLER, 24", "stampTxt": "KNOCK KNOCK"}, {"label": "This is Tyler", "stamp": "knock"}, None),
 1: ("trace", {}, {"n0": "Remember Denise", "n1": "Tyler moved", "n2": 99, "n3": 99}, "glitch"),
 2: ("web", {"title": "MONEY MULES"}, {"m0": "money mule"}, "wipe"),
 3: ("casefile", {"name": "CASE FILE: TYLER M.", "lines": ["Based on real FBI and DOJ cases.", "Names changed.", "The playbook is real."]}, {"stamp": "composite"}, "wipe"),
 4: ("room", {"brow": 1, "sweat": .5, "label": "JUST LOST HIS JOB"}, {"label": "lost his warehouse"}, "wipe"),
 5: ("room", {"phone": "hands", "smile": 1, "notif": {"title": "📩 New email · GlobalPay", "lines": ["Congratulations! 🎉", "Remote Payment Assistant", "$3,500/mo + 10% bonus"], "hl": 2}},
     {"buzz": "one morning", "notif": "Congratulations"}, "wipe"),
 6: ("laptop", {"kind": "job"}, {"sal": "professional", "rem": "logo", "exp": "website", "now": "interview"}, "wipe"),
 7: ("laptop", {"kind": "job", "fbi": 1, "hl": 1}, {"sal": -1, "rem": -1, "exp": -1, "now": -1, "hl": "exactly like this", "fbi": "FBI has warned"}, None),
 8: ("laptop", {"kind": "chat", "msgs": [{"who": "in", "txt": ["Hi Tyler! 👋 Sarah from HR here.", "Loved your profile — you're hired!"], "at": 0.1},
                                          {"who": "out", "txt": ["Thank you!! When can I start? 🙏"], "w": 560, "at": "KW:She doesn't"}]},
     {"reveal": "someone we"}, "wipe"),
 9: ("split", {"left": "tyler", "lPhone": "type", "dSmile": 1, "tag": '"SARAH, HR"', "tag2": "(it's Mark)", "fake": "Keep 10% 💸"}, {"tag": 0.2, "fake": "You keep"}, "wipe"),
 10: ("room", {"phone": "hands", "money": 1, "wide": 1.3, "smile": 1}, {"buzz": "phone buzzed", "money": "A deposit"}, "wipe"),
 11: ("laptop", {"kind": "chat", "msgs": [HELLO, {"who": "in", "txt": ["Great job! 🎉 Withdraw the funds today", "and deposit them into this Bitcoin ATM."], "at": 0.3},
                                           {"who": "in", "txt": ["⏰ Time-sensitive. Our client is waiting."], "at": "KW:Time-sensitive"}]},
      {"reveal": -1}, "wipe"),
 12: ("atm", {"keep": 1}, {"cash": "fed cash", "sent": "and kept", "keep": "kept his"}, "wipe"),
 13: ("trace", {}, {"n0": 0, "n1": 0.15, "n2": "cryptocurrency", "n3": "in a wallet", "fog": "no one could trace", "last": "last real name"}, "wipe"),
 14: ("web", {"title": "MULES COME FROM EVERYWHERE"}, {"m0": 0.3}, "wipe"),
 15: ("romance", {"from": "Captain Mike", "label": "LINDA, 67", "msgs": [{"who": "in", "txt": ["Good night, my love ❤️"], "ev": "m0"}, {"who": "in", "txt": ["You're the best thing in my life 🌹"], "ev": "m1"}]},
      {"label": "Meet Linda", "m0": "talking every night", "m1": "He says he loves"}, "wipe"),
 16: ("romance", {"from": "Captain Mike", "label": "= MONEY MULE", "msgs": [{"who": "in", "txt": ["Good night, my love ❤️"], "at": -1},
        {"who": "in", "txt": ["Darling, my account is frozen…", "Friends will send money to you.", "Can you forward it to me?"], "ev": "ask"}, {"who": "out", "txt": ["Of course ❤️"], "ev": "yes"}]},
      {"ask": "Darling", "yes": "Linda says yes", "label": "Of course she"}, None),
 17: ("recruit", {}, {"sell": "sell their bank", "bad": "nothing will happen"}, "wipe"),
 18: ("web", {"title": "EVERY MULE IS A LINK IN THE CHAIN"}, {"m0": 0.2}, "wipe"),
 19: ("anatomy", {"title": "THE HIDDEN BACKBONE OF FRAUD", "labels": ["STOLEN MONEY", "MULE ACCOUNTS", '"CLEAN" MONEY', "SCAMMERS GET PAID"]},
      {"l0": "backbone", "l1": "Without them", "l2": "stuck", "l3": "stop working"}, "wipe"),
 20: ("door", {"frozen": 1}, {"frozen": "Account frozen", "letter": "letter arrived", "k0": "knock on", "k1": "knock on+0.35", "k2": "knock on+0.7"}, "wipe"),
 21: ("law", {}, {"title": 0.2, "close": "Banks close", "report": "report them", "charges": "federal charges"}, "wipe"),
 22: ("stat", {"value": 4000, "int": 1, "prefix": "", "suffix": "+", "label": "SUSPECTED MONEY MULES · ONE U.S. CRACKDOWN", "top": "Warning letters · frozen accounts · charges",
             "src": "Source: U.S. Department of Justice, Money Mule Initiative"}, {"top": "suspected money"}, "wipe"),
 23: ("checklist", {"title": "WHAT TYLER LOST", "items": ["Bank account closed", "Flagged: hard to open a new account", "Had to pay the commission back"]},
      {"i0": "closed his account", "i1": "flagged", "i2": "pay it back"}, "wipe"),
 24: ("callcenter", {"smirk": 1, "monitor": [{"txt": "MULE: Tyler ✓"}, {"txt": "MULE: Linda ✓"}, {"txt": "MULE: student ✓"}, {"txt": "OUR OWN ACCOUNTS: none", "c": "#7a1020"}]},
      {"m0": 0.2, "m1": 0.6, "m2": 1.0, "m3": "They use yours", "smirk": "never use"}, "glitch"),
 25: ("quiz", {"from": "GlobalPay Recruiting", "msg": JOBTXT, "linkLine": 9,
              "flags": ["Unsolicited offer", "Uses YOUR bank account", "Crypto / gift cards", "Keep a %", "Urgent, chat only"]},
      {"pause": "PAUSE_START", "resume": "PAUSE_END", "f0": "REVEAL+0", "f1": "REVEAL+0.4", "f2": "REVEAL+0.8", "f3": "REVEAL+1.2", "f4": "REVEAL+1.6"}, "wipe"),
 26: ("checklist", {"title": "5 RED FLAGS", "items": ["A job you never applied for — big pay", "Money lands in YOUR account", "You forward it: crypto, gift cards, wires",
                                                   "You keep a percentage", "Urgent, and only over chat"]},
      {"i0": "One:", "i1": "Two:", "i2": "Three:", "i3": "Four:", "i4": "five:"}, "wipe"),
 27: ("costumes", {"mode": "intro"}, {"c0": "same scam"}, "glitch"),
 28: ("checklist", {"good": 1, "title": "ALREADY INVOLVED?", "items": ["STOP. Don't move any more money.", "Call your bank and explain.", "Report it at ic3.gov."]},
      {"i0": "stop right now", "i1": "Call your bank", "i2": "I-C-3"}, "wipe"),
 29: ("share", {}, {"send": "share this"}, "wipe"),
 30: ("next", {"title": '"GRANDMA, IT\'S ME"', "fs": 140}, {}, "glitch"),
}
INSERT = {4: [("anim", "intro-3d"), ("chapter", 1, "THE JOB")], 9: [("chapter", 2, "THE TASK")], 14: [("chapter", 3, "THE OTHER|MULES")],
          20: [("chapter", 4, "THE KNOCK"), ("anim", "alert-transition-3d")], 25: [("chapter", 5, "PROTECT|YOURSELF")]}
TENSE = set(range(20, 25))
HEART_IDX = {12}
LONG_PAUSE = {3, 30}
CHAPTER_MARKS = {25: "Quick test", 26: "5 red flags", 28: "Already involved? Do this", 30: "Next: the AI voice scam"}
TTS_FIX = TTS_FIX + [("FBI", "F.B.I."), ("Sarah from HR", "Sarah from H.R.")]
CAP_FIX = [("eighteen thousand, four hundred dollars", "$18,400"), ("Three thousand five hundred dollars a month", "$3,500 a month"),
           ("one thousand, eight hundred and forty dollars", "$1,840"), ("ten percent", "10%"), ("more than four thousand", "more than 4,000"),
           ("I-C-3 dot gov", "ic3.gov"), ("twenty-four", "24"), ("sixty-seven", "67")]
HIGHLIGHT = ["$18,400", "$3,500", "10%", "$1,840", "money mule", "money mules", "Sarah", "Bitcoin ATM", "frozen", "money laundering", "4,000",
             "red flags", "ic3.gov", "stop right now", "Denise", "AI"]
