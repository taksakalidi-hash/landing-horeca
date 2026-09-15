# Forever Launch Kit — product + go-to-market

A digital mini-product for **World of Warcraft: Forever** (launches **November 4, 2026**), built to be sold
in the pre-launch hype window.

```
wow-forever/
├── forever-launch-kit.html   ← THE PRODUCT (what the buyer downloads)
├── index.html                ← the sales page
└── README.md                 ← this file
```

Both files are standalone. No build step, no dependencies, no server. Open either in a browser.

---

## 1. What the product actually is

An interactive planner, not a guide. Six tools in one self-contained HTML file:

| # | Tool | What it does |
|---|------|--------------|
| 1 | Class recommender | Scores 9 classes against the buyer's goals, role, faction, experience and weekly hours. Filters by role/faction, returns a ranked shortlist with a fit %. |
| 2 | "What to buy" decider | 3 questions → a verdict on sub-only vs $30 race pack vs $59.99 Epic Pack vs $79.99 Collection vs $149.99 CE. |
| 3 | Day-One schedule | Hour-by-hour plan that resizes to the hours the buyer actually has on Nov 4, plus a T-minus-60 checklist. |
| 4 | 7-week prep checklist | 35 tasks across 7 phases, dated against the real calendar. Progress saves to `localStorage`. |
| 5 | Gold planner | Farming rate × weekly share → mount dates and a yes/no on affording raid consumables. |
| 6 | Content atlas | Every confirmed zone, dungeon, raid, racial and new system, with `TBD` marks where data doesn't exist yet. |

**Why this shape and not a PDF.** Wowhead and Icy Veins will publish better *information* than you can, for free,
within two weeks of launch. They will not publish *a decision tailored to one player*. The personalization is
the moat — and it's also why the file can't be screenshotted and passed around the way a PDF can.

---

## 2. Why this window is worth selling into

| Date | Event | Why it matters commercially |
|------|-------|-----------------------------|
| Sep 12, 2026 | Announced at BlizzCon | Hype starts, no information exists yet |
| **Sep 17, 2026** | **Beta opens, level 30 cap** | Real data starts flowing. Beta is locked behind the $59.99+ packs |
| **Nov 4, 2026** | **Global launch** | Peak purchase intent. Access comes with a normal subscription |
| **Dec 9, 2026** | First raid wave | Barrow Deeps (10), Hyjal Summit (20), Onyxia's Lair |

The 35-day gap between launch and raids is the product's core argument, and it's a real deadline the buyer
can feel. That is what makes "ten minutes now, thirty hours saved later" a credible claim rather than a slogan.

**The three highest-intent questions players are searching right now**, in order:

1. "Do I need to buy the $60 pack?" — answered by Tool 2
2. "Which class should I roll?" — answered by Tool 1
3. "Will I be 60 in time for raids?" — answered by Tool 1's projection

Every piece of marketing should lead with one of those three. They are not guide questions — they are
decision questions, which is precisely what free guide sites are bad at.

---

## 3. Pricing

| Tier | Pre-launch | From Nov 4 | Rationale |
|------|-----------|-----------|-----------|
| Launch Kit | **$19** | $29 | Early buyers absorb the risk that beta changes things, so they pay less |
| Guild Pack (5 seats) | **$49** | $95 | The product tells buyers to form a 5-person group — sell them five copies |

The price rise on Nov 4 is real, not fake scarcity: by then the product carries beta data it doesn't have today,
and it's worth more. Don't fake a countdown you won't honour — this audience punishes that publicly.

Every tier includes free updates through Dec 9. That promise is what makes buying *before* beta rational,
and you must actually ship those updates.

---

## 4. Distribution

Ranked by realistic return for a product with no existing audience.

**1. Creator affiliates — the highest-leverage channel.**
Classic WoW YouTubers and streamers have exactly this audience and are actively making
"should you buy the Epic Pack" content right now. Offer 40–50% revenue share. One mid-size creator
outperforms weeks of solo posting. Reach out in the week before beta, while they're still planning coverage.

**2. A free lead tool.**
Most WoW subreddits and Discords ban direct selling, so don't fight that. Split the class recommender out
as a **free standalone page**, let it spread on its own merit, and put a single unobtrusive link to the paid
Kit on it. A genuinely useful free tool is the only form of self-promotion these communities tolerate — and
the "what to buy" decider is the natural free hook, because its honest answer is often *buy nothing*, which
is exactly the kind of thing people share.

**3. Short-form video.**
"Do you need the $60 pack for WoW Forever?" is a 45-second video answering a question thousands of people
are typing into search this week. Cheapest possible content, highest intent.

**4. SEO.**
Target the decision queries, not the guide queries: `wow forever what to buy`, `wow forever which class`,
`wow forever worth it`, `is skyborne worth it`. You will never outrank Wowhead on `wow forever dungeons`.

**5. Discord.**
Classic WoW and guild-recruitment servers. Share the free tool in off-topic channels, never the paid link
cold. Guild leaders organising launch rosters are the exact Guild Pack buyer.

---

## 5. What to update during beta

Beta opened **September 17** at a level 30 cap. That cap defines what you can and can't learn:

**Can confirm (update these):** early class feel with the new 16-point talent node · Skyborne racials in play ·
Zephras Isle 1–12 · profession perks · camping mechanics · the Legacy tree's opening tiers · addon breakage.

**Cannot confirm (leave as TBD):** The Riverglades at 30–45 · Mount Hyjal · the 9 new dungeons at level ·
both raids · the new battleground.

Ship one update in the week beta opens and one in late October. Announce each to buyers by email — it's
what justifies the price and it's what makes the next product's pre-order credible.

---

## 6. Hooking up checkout

Open `index.html`, find the `CHECKOUT` object near the bottom of the `<script>` block, and paste your
product URLs:

```js
var CHECKOUT = { solo:"https://yourstore.lemonsqueezy.com/buy/xxxx", guild:"https://..." };
```

Until you do, the buy buttons show an explanatory alert instead of silently failing.

**Pick a merchant of record**, not a plain payment processor. Selling a digital product to EU consumers
means VAT is owed in the *buyer's* country, and past €10,000 of cross-border EU sales you'd have to
register for OSS and file for it yourself. Lemon Squeezy, Paddle and Gumroad act as the legal seller to
the end customer and handle all of that — you just receive a payout.

Seller is based in **Czechia**, so the full setup — trade licence, OSVČ as a side activity, the 2026
thresholds, and why the flat-tax regime is the wrong choice at this scale — is written up in
[`ОПЛАТА-И-НАЛОГИ-ЧЕХИЯ.md`](./ОПЛАТА-И-НАЛОГИ-ЧЕХИЯ.md) (in Russian).

Being in the EU also settles the language question: payouts are not a constraint, so the **English
version is the primary product** and the Russian one in `ru/` is a second channel.

---

## 7. Legal guardrails — read before publishing

This is a fan-made product about someone else's game. That's a well-established, widely tolerated business,
but it depends on staying inside the lines:

- **Keep the disclaimer.** It's in the footer of both files. Don't remove it to make the page look cleaner.
- **Use no Blizzard assets.** No logos, no screenshots, no icons, no art, no fonts, no audio. Both files
  ship with zero game assets — keep it that way.
- **Never imply affiliation.** Don't use "official", don't use Blizzard's marks in your domain or store name,
  don't style it to look like a Blizzard property.
- **Don't resell game content.** You're selling your planning tool, not access to anything Blizzard owns.
- **Price and date claims change.** Everything in the Kit came from BlizzCon 2026 announcements and launch
  coverage. Re-verify before each update, and keep the "confirm on the official shop" line intact.

---

## 8. Honest risk assessment

**The window is narrow.** This product's value decays sharply after launch week and is close to zero by
January. Price and plan accordingly — this is a sprint, not a catalogue item.

**Wowhead could ship a free class picker.** If they do, your differentiator narrows to the schedule-aware
projection and the spend decision. Lean into those two in your marketing now rather than after.

**You're selling before you can fully validate.** The beta cap at level 30 means nobody — including you —
can verify the endgame advice yet. The Kit handles this by marking gaps `TBD` instead of guessing, and the
sales page says so plainly in the FAQ. Keep that honesty: in a community this well-informed, one confidently
wrong claim costs more than ten missing ones.

**Best realistic outcome:** a few hundred sales through creator affiliates in the Oct–Nov window.
**Most likely failure mode:** building it and posting it nowhere. Distribution is the hard part, not the product.
