# Srajit M. Kumar — Site Redesign: Design Spec & Reference

**Audience:** Claude Code (implementation agent)
**Status:** Spec only. Do not deviate from the hard constraints in §9 without flagging.
**Repo:** `mridlll.github.io/srajit-site` (GitHub Pages, static). Currently a single Markdown file rendered to HTML. The redesign replaces this with hand-authored HTML/CSS/JS — no build step, no framework.

---

## 1. Concept (read this first; everything else serves it)

The site is a **booting archival mainframe terminal that renders a 1999 personal homepage as its output.**

One conceit holds the whole thing together: *the visitor has dialed into an old institutional archive system.* The terminal session is the **chrome** (boot log, prompt, system notices). The GeoCities-era kitsch (visitor counter, `<NEW!>` badges, ASCII rules, "best viewed in" banner) is the **payload** the session prints. They are not two styles side by side — the kitsch is *diegetically* the content that the terminal is serving.

Why this fits Srajit specifically — and lean into it, don't flatten it: he is a historian of **industrial time-discipline and working-class temporality** (dissertation: *Time, (Non)Work and Political Consciousness: The Kanpur Working Class, 1914–47*). A site that performs obsolete computing time — boot delays, a session clock, an archive that predates the user — is thematically load-bearing, not decoration. The tone is **dry, institutional, slightly haunted**, not "lol retro." Closer to a decommissioned card catalogue than to a Fallout terminal.

**Synthesis split:**

| Layer | Source | What we take |
|---|---|---|
| Frame / structure / navigation | mariya.fyi | Boot-log preamble; commands as nav; content as command *output*; `key: value` metadata blocks; monospace discipline |
| Content texture / ornament | aleccali.com | Visitor counter, `<NEW!>` badge, ★ list bullets, ASCII/box-drawing rules, "best viewed in" banner, "Built With ___" footer, ALL-CAPS section banners |
| Information architecture | current srajit-site | The actual sections and copy (see §7). Keep all of it. Reorganize none of the *facts*. |

What we explicitly **discard** from the references: Alec's literal table-border layout and clip-art energy (too noisy for an academic); Mariya's pure-CLI opacity if it ever hides core content from a non-technical visitor (a hiring committee must be able to read the bio without typing anything).

---

## 2. The session metaphor — naming

Treat the site as a login to a fictional system. Suggested (Mridul to confirm in §10):

- System name: `SAI–ARCHIV` or `KANPUR-1` — an invented archive host.
- Prompt user/host: `guest@sai-archiv:~$`
- The "user profile loaded" is **Srajit's**; the visitor is `guest`.

Boot log should reference real, checkable facts so it reads as a record, not flavour text (DAAD funding, SAI Heidelberg, supervisor). Example register — match this *tone*, not these exact strings:

```
[ OK ]   power-on self test
[ OK ]   mounting /archive/sai-heidelberg
[ INFO ] record: KUMAR, SRAJIT M.
[ INFO ] funding token: DAAD ........................ valid
[ OK ]   profile loaded — dept. of history, south asia institute
[ .. ]   last indexed: <build date>
guest@sai-archiv:~$ _
```

Boot is **fast** (target < 1.2s total, see §6) and **skippable**. It is a curtain, not a paywall.

---

## 3. Layout & information architecture

Single page. No routing. The terminal is the page; sections are addressable both by scroll and by "command."

```
┌─ session frame (full viewport, max-width ~860px content column, centered) ─┐
│  BOOT LOG            (auto-runs once, then collapses to a 1-line status bar) │
│  ── identity block ──  (whois output: name, role, affiliation, portrait)     │
│  PROMPT + command nav  (about · research · talks · writing · contact · cv)   │
│  $ cat about.txt       → about prose                                         │
│  $ ls research/        → dissertation + interests                            │
│  $ cat talks.log       → talks list (★ bullets, dates)                       │
│  $ ls writing/         → "publications and working papers will appear here"  │
│  $ finger srajit       → contact block (address, email, links, CV)           │
│  ── system footer ──   visitor counter · "best viewed in" · built-with line  │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Command nav is real navigation, not just decoration.** Clicking `about` (or the visitor typing `about`/`cat about.txt` if the interactive prompt ships — see §6) scrolls to and "prints" that section. Sections may be pre-rendered in DOM and revealed/scrolled, *not* fetched. No-JS visitors see all sections expanded (see §8).
- The identity block is the equivalent of Mariya's `$ whois`: a fixed-width `key: value` table.
  ```
  name   : Srajit M. Kumar
  role   : PhD Candidate, Dept. of History
  org    : South Asia Institute, Heidelberg University
  advisor: Prof. Dr. Kama Maclean
  funding: DAAD PhD Scholarship
  fields : labour history · partition · communalism · C18 South Asia · urban Delhi
  ```
- Portrait (`images/srajit.jpg`, already in repo): render it as if the terminal is doing ASCII/dithered image preview *as progressive enhancement only* — but the real photo must be the actual served image (alt text mandatory). Acceptable simpler treatment: real photo in a 1px monospace-bordered box with a `[ IMG 01 ]`-style caption. Do not ship a literal ASCII-art conversion as the only representation of his face.

---

## 4. Visual design tokens

Monospace-first, but **not** neon-green-on-black hacker cosplay. Aim for *amber/paper terminal* — legible, archival, a little warm. Provide a light default; dark optional (§10).

```css
:root {
  /* type */
  --font-mono: "Berkeley Mono", "JetBrains Mono", "IBM Plex Mono",
               ui-monospace, "SFMono-Regular", Menlo, monospace;
  /* one humanist serif is permitted for long-form prose bodies ONLY
     (about.txt, dissertation abstract) to keep 800-word reading bearable */
  --font-serif: "Iowan Old Style", "Charter", Georgia, serif;

  /* palette — paper terminal (light, default) */
  --bg:        #f4f1ea;   /* warm paper */
  --bg-panel:  #ebe7dc;
  --ink:       #20201c;   /* near-black, warm */
  --ink-dim:   #6b675c;   /* secondary / log lines */
  --accent:    #9a4a1f;   /* burnt amber — links, prompt, counter */
  --accent-2:  #2f5d50;   /* deep green — used sparingly, e.g. [ OK ] */
  --rule:      #c9c2b0;   /* box-drawing / hr color */
  --ok:        #2f5d50;
  --warn:      #9a4a1f;

  /* spacing — terminal grid: everything snaps to a baseline */
  --ch: 1ch;
  --line: 1.55rem;        /* baseline grid unit */
  --col-max: 72ch;        /* content column ~72 monospace cols */
}
```

Type rules:
- Body/UI: mono. Section banners: mono, ALL CAPS, letter-spaced, wrapped in box-drawing chars (`╔══ ABOUT ══╗` style or `── about ─────`).
- Long prose blocks (the `about` paragraph, the dissertation abstract): may switch to `--font-serif` at ~1.05rem for readability. Everything else stays mono. This is the one allowed concession; do not let serif leak into nav, logs, or metadata.
- Line length capped at `--col-max`. The historian register rewards calm reading; don't let prose run full-bleed.

Ornament rules (the Alec layer), used **sparingly and dryly**:
- `<NEW!>` badge: only on genuinely new items (the 6 Nov 2024 talk, or "writing" once populated). Render as `[ NEW ]` in `--accent`, not blinking, not a GIF.
- ★ as list bullets in talks/links lists. Fine. Don't over-deploy.
- Box-drawing characters (`─ │ ┌ ┐ └ ┘ ╔ ═`) for rules and banners instead of `<hr>`/CSS borders where it reads well. Must degrade to plain `<hr>` semantics for screen readers (use `role`/`aria-hidden` correctly — decorative ASCII art is `aria-hidden="true"`, real separators are `<hr>`).
- Visitor counter: a faux odometer in the footer, e.g. `VISITORS: [ 0 0 4 1 2 ]`. **Do not implement real analytics.** Static number, or a trivial localStorage increment that is honest about being fake if asked. Per Mridul's standing rules: no tracking. This is an aesthetic object, not telemetry.
- Footer "built with" line: pick something true-but-wry, e.g. `Served from a static host · No JavaScript required to read this page · © 1999–<year> S. M. Kumar`. The "1999–" is the Alec wink; keep one wink, not five.
- "Best viewed in" banner: optional, single line, dry: `[ best viewed in any browser, at any width, since 1999 ]`. This is the *one* place self-aware humor is licensed.

---

## 5. Motion

- Boot log: typed/streamed line-by-line, monospace, ~40–80ms/line, total ≤ 1.2s. Then the log **collapses** into a single persistent status line (e.g. top or bottom: `● session: sai-archiv — uptime 00:02:14`) with a live-ticking uptime/session clock. The clock is the only perpetual animation and it is thematically deliberate (time-discipline). Keep it subtle, mono, dim.
- Prompt cursor: blinking block `_`. Standard.
- Command "execution": when a nav command is invoked, echo it at a prompt line (`guest@sai-archiv:~$ cat about.txt`), then reveal the section. Scroll smoothly. No long fake "loading" delays — respect the visitor's time; the historian joke is about clocks, not about wasting the reader's.
- **`prefers-reduced-motion: reduce`**: no typing, no blink, no auto-scroll. Boot log renders instantly and fully; cursor static; clock may still tick (text, no motion) or be frozen. This is mandatory, not optional.

---

## 6. Interactivity (tiered — ship Tier 1, then 2; 3 is optional)

- **Tier 1 (required):** Everything is real, static, semantic HTML in the DOM. The terminal aesthetic is CSS + a small JS enhancement layer. With JS disabled, the page is a fully readable academic homepage with all sections expanded and the boot log shown as static text. Nav links are anchor links. This tier alone must satisfy a hiring committee.
- **Tier 2 (required):** JS adds the boot animation, the collapse-to-status-bar, command-echo on nav click, smooth reveal. Pure progressive enhancement over Tier 1.
- **Tier 3 (optional, behind a clearly-offered affordance):** an actual typeable prompt. Supported commands: `help`, `about`, `research`, `talks`, `writing`, `contact`, `cv`, `whois srajit`, `clear`, plus 2–3 hidden easter-egg commands Mridul will supply (§10) — keep them in-character (a historian's archive: e.g. `man time`, `cat kanpur.txt`). Unknown command → dry `command not found` with a hint to type `help`. The prompt must never be the *only* way to reach core content.

No external JS libraries. Vanilla. Total JS budget: keep it small (target < 8KB minified, no dependencies). One CSS file, one JS file, one HTML file.

---

## 7. Content inventory (use this verbatim — do not re-scrape, do not invent)

All copy below is from the current live site. Reproduce facts exactly; you may re-voice *framing/labels* into terminal register but **not** alter any name, date, title, or affiliation.

- **Name:** Srajit M. Kumar
- **Role:** PhD candidate, Department of History, South Asia Institute, Heidelberg University
- **Supervisor:** Prof. Dr. Kama Maclean
- **Funding:** DAAD PhD scholarship
- **Education:** BA History, Jamia Millia Islamia, New Delhi (2020); MA History, University of Delhi (2022)
- **Dissertation title:** *Time, (Non)Work and Political Consciousness: The Kanpur Working Class, 1914–47*
- **Dissertation summary:** examines how labourers from the agrarian United Provinces adapted to industrial employment in Kanpur — in particular how their perception and experience of time shifted during this transition, and the political consequences of that shift.
- **Broader interests:** labour history; the partition of India; communalism; eighteenth-century South Asia; the urban history of Delhi.
- **Talks:**
  - 6 Nov 2024 — "Time is Money and Work is Worship: A Case from 20th Century North India" — Colloquium, South Asia Institute, Heidelberg University. (Description: on how working-class populations in 20th-century agrarian North India encountered and reshaped temporal concepts during their transition to industrial urban life in Kanpur, and how they sometimes turned the clock into an instrument of negotiation and resistance.) — link: `https://www.sai.uni-heidelberg.de/en/events-at-sai/time-is-money-and-work-is-worship-a-case-from-20th-century-north-india-2024-11-06`
- **Writing:** "Publications and working papers will appear here." (placeholder — keep as a placeholder section, do not fabricate publications)
- **Contact:**
  - South Asia Institute, Voßstraße 2, Building 4130, 69115 Heidelberg, Germany
  - Email: `srajit.kumar@sai.uni-heidelberg.de`
  - SAI profile: `https://www.sai.uni-heidelberg.de/en/departments-and-branches/south-asian-history/team/srajit-m-kumar`
  - CV: `https://mridlll.github.io/srajit-site/cv.pdf` (file exists in repo as `cv.pdf`)
- **Portrait:** `images/srajit.jpg` (exists in repo)
- **Footer line currently:** "© Srajit M. Kumar · last updated May 2026" — replace with the §4 footer treatment but keep the "last updated" semantic (drive it off build date or a single editable constant).

---

## 8. Accessibility & robustness (non-negotiable)

Both reference sites are gimmick-forward and would fail here; the redesign must not.

- Semantic HTML underneath the costume: `<header>`, `<main>`, `<section>` with headings, `<nav>`, `<footer>`. The terminal styling sits on top of a correct document outline.
- All decorative ASCII / box-drawing / the visitor counter: `aria-hidden="true"`. Real separators: `<hr>`. Real headings: real `<h1>`/`<h2>`, visually styled as banners but not faked with text.
- Portrait `<img>` has meaningful `alt`.
- Color contrast: the §4 light palette must pass WCAG AA for body text (`--ink` on `--bg`) and for links (`--accent` on `--bg` — verify and darken `--accent` if it fails AA at body size; legibility wins over the exact swatch).
- Keyboard: all nav reachable and operable by keyboard; visible focus states (a mono `▌`-style focus ring is fine if it also satisfies contrast).
- No-JS: full content, no boot animation needed, nothing hidden. Test by literally disabling JS.
- `prefers-reduced-motion`: see §5.
- The interactive prompt (Tier 3), if shipped, is an *enhancement*; screen-reader and keyboard users must reach 100% of content via the static nav/anchors without ever touching it. The prompt input, if present, needs a real `<label>` (visually hidden is fine).
- Mobile: the terminal column reflows to a single readable column at small widths; no horizontal scroll; box-drawing rules that would overflow are swapped for simple `<hr>` under ~480px. Monospace at a comfortable mobile size (≥16px effective).

---

## 9. Hard constraints

1. Static site, GitHub Pages, no build step, no framework, no package manager. Hand-written `index.html`, one `.css`, one `.js`. Keep existing repo assets (`images/srajit.jpg`, `cv.pdf`) and existing URLs working.
2. No third-party JS/CSS, no fonts that require external network calls *as a hard dependency* — system monospace stack must be the fallback and must look intentional on its own. If a webfont is used, it is progressive, self-hosted, and the page is fully styled without it.
3. No analytics, no tracking, no cookies beyond an optional honest localStorage counter. (Owner's standing preference; do not negotiate this.)
4. Every fact in §7 reproduced exactly. No invented publications, no embellished titles, no fake credentials in the boot log that aren't true.
5. Tone: dry, institutional, archival. Exactly one licensed "wink" (the "best viewed in" line) and one ornament budget (counter, ★, `[ NEW ]`, box rules) — used sparingly. If it starts to feel like a costume party, you've overshot; pull back toward "old library terminal."
6. The site must be fully readable and credible to a non-technical academic hiring committee with JS off. The terminal is a skin, never a gate.

## 10. Decisions for Mridul (leave as clearly-marked TODOs in code; do not guess)

- System/host name + prompt string (`sai-archiv`? `kanpur-1`? `guest@host`?).
- Light-only, or ship a dark "phosphor" theme toggle as well? (Default stays light/paper regardless.)
- Ship Tier 3 typeable prompt, or stop at Tier 2?
- 2–3 in-character easter-egg commands + their output text (Mridul to write — should sound like Srajit, the time/labour theme is the obvious vein).
- Exact footer "built with" wording (one wink only — pick the line).
- Visitor counter starting number (and: static vs. honest-fake localStorage).
- Whether the dissertation gets an expanded abstract beyond the §7 summary (if so, Srajit supplies the text; do not pad it yourself).

---

## 11. Acceptance checklist

- [ ] JS off: all content present, readable, no broken layout, boot log shown as static text.
- [ ] `prefers-reduced-motion`: zero motion except (optionally) a non-animated clock.
- [ ] WCAG AA contrast on body + links verified.
- [ ] Keyboard-only traversal of all nav + links with visible focus.
- [ ] All §7 facts present and exact; no fabricated content; placeholder writing section intact.
- [ ] Mobile (≤480px): single column, no horizontal scroll, ≥16px mono.
- [ ] No external network dependencies required for full styling/function.
- [ ] Reads as "old institutional archive," not "hacker terminal" and not "GeoCities parody" — the synthesis, not either pole.
- [ ] Existing repo URLs/assets (`cv.pdf`, `images/srajit.jpg`) still resolve.
