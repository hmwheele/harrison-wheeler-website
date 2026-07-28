# Deck (Present) Mode — working notes

Scope for any session using this doc: **only** `website/` — the deck-mode
files below and the site content they read from. Nothing outside this repo
folder, no other projects.

## Files

| File | What's in it |
|---|---|
| `assets/js/deck.js` | The whole deck: slide builders, diagram/chart SVG builders, controller, animations. Self-contained IIFE. |
| `assets/css/deck.css` | All deck styling, scoped under `html.deck-mode` / `.deck-*`. Nothing leaks into the normal site. |
| `index.html` | Three hooks only: the `deck.css` link, the nav **Present** button (`[data-present]`), the `deck.js` script tag. |

The normal scrolling site is untouched. Entering deck mode hides `main`,
`.nav`, `.footer` and mounts a `.deck` overlay.

## Running it

```
python3 dev-server.py     # serves website/ on :8000 (file lives one level up)
```

- Open the deck: **Present** in the nav, press **P**, or `?present`
- Move: `← →` / Space / PageUp-Down / Home / End, or the on-screen arrows
- Exit: `Esc` (from a case study, Esc first returns to the main deck)

## URL state

Position is written to the hash with `replaceState`, so refresh keeps your
place and any slide is shareable:

- `#present=<n>` — home deck, slide n
- `#present=cs.<key>.<n>` — case study `<key>`, slide n

Exiting clears the hash.

## Slide order (home deck)

Defined by `HOME_BUILDERS` in `deck.js`. Currently:

`Intro → About (belief) → About (globe) → How I work → Career → Select work
→ Impact (charts) → Marketing solutions → The system → Retention → Building
the stack → Narrative development → Roadmap → Build the narrative → Marketing
overview → LeadCraft → Podcast → Community → Contact`

To reorder or drop a slide, edit that array — each entry is a builder
function returning one `<section class="deck-slide">`.

## Case studies

Built from `window.CASE_STUDIES` (`assets/js/case-studies.js`) — the same
source the normal site overlay uses, so content stays in sync.
`buildCaseStudySlides(key)` splits each study:

- Everything before the first `<h2>` → **cover slide** (dark purple, grid bg,
  stretched Neudron title in the pink gradient, device mockup)
- Each `<h2>` section → one **white content slide** (keeps `.cs-main` styling)
- Every `<img>`/`<video>` → its **own slide** + caption placeholder
- Appended: a **"Questions?"** outro slide (purple, same treatment as the cover)

Clicking a row on **Select work** opens that study as its own deck.

### Cover device mockups

`PHONE_CASE_STUDIES` (array of keys) decides phone vs. desktop frame.
Both fade up from below with a 0.45s delay. Drop a real screenshot in by
putting an `<img>` inside the mockup's `.dcd-screen`.

## Data-viz design system

**Edit the tokens, not the individual charts.** Defined in `deck.css` on
`.deck-slide--charts, .deck-slide--diagram-full`:

- **Purple ramp** `--v-p1`…`--v-p5` (light → dark)
- **Accents** `--v-green` (#b9f2c8), `--v-pink` (#ffd8e4)
- **Ink/lines** `--v-ink`, `--v-ink-muted`, `--v-line` (solid — never
  translucent, or overlapping connectors compound at the joints)
- **Strokes** `--v-stroke-hair/-stroke/-stroke-bold`, one dash `--v-dash`
- **Type scale** — Neudron for `--v-t-title` (30) / `--v-t-head` (24) /
  `--v-t-node` (17); mono for `--v-t-label` (14) / `--v-t-micro` (11)

Semantic SVG classes so new viz never hardcode values:
`.v-title .v-head .v-node .v-label .v-micro`,
`.v-connector .v-connector-thin .v-connector-dash`,
`.v-surface .v-surface-2 .v-surface-3`.

### Grain texture

`vizNoise(shape, opts)` + one shared `vizNoiseFilter()`. Pass a circle
(`{tag:'circle',cx,cy,r}`) or rect (`{tag:'rect',x,y,width,height}`);
returns `{defs, layer}` — append both.

- Circles get a **radial** fade (clear centre → grain at the rim)
- Flat surfaces pass `{linear:true}` for a top→bottom fade
- Currently on: venn lobes, tree nodes, Pods hub, Sankey bars, stack top face

### Known inconsistency (not yet migrated)

The token layer exists and the newer viz use it, but the **seven older
diagrams still carry hardcoded values** — the roadmap chevron has its own
5-step purple ramp, several node labels are mono where they should be
Neudron, and sizes vary. Migrating them means swapping literals for
`var(--v-*)` and inline attrs for the `.v-*` classes. That's the main
outstanding cleanup.

## Animations

All replay on slide activation and are disabled under
`prefers-reduced-motion` (`html.deck-reduce`).

| What | How |
|---|---|
| Charts (bars/donut/line/stats) | `animateCharts()` — bars grow, donut spins CCW, line traces, numbers count up |
| Timeline + swimlane ribbon | `animateDiagram()` — grow left→right, near-linear easing that settles at the end |
| Stack plates | `.v-plate`, staggered bottom-up via inline `transition-delay` |
| Sankey | `.v-bar` grows down, `.v-flow` fades in |
| Globe media cards | fade in ~2.4s after the globe starts spinning |

## Background grid

Painted once on `.deck::before` so the drift never resets between slides;
visibility is toggled per-slide via the `deck--grid` class. Shown **only**
on: title, both About slides, and case-study covers/outros.

## Type rules

**A slide title is a slide title.** Every `.deck-title` renders at
`--t-title`, including the ones in a left rail beside a figure, a stat
grid, or a diagram (`.deck-slide--titlefig` and everything built on it:
`titleSideSlide`, `titleFigureSlide`, the role and results slides). Never
step a title down to `--t-title-sm` to make a split layout fit — narrow the
column or shorten the title instead. `--t-title-sm` is for headings *inside*
a column that sit below a real slide title (e.g. `.deck-job`).

## Shared elements between slides

An element marked `data-shared="<key>"` that appears on two consecutive
slides makes the deck **cut** (no cross-fade) between them, so it appears to
stay put. Currently used for the profile portrait (Intro ↔ About).

## Content sources

| Slide | Reads from |
|---|---|
| Intro / About / Career / Work / Podcast / Community / Contact | the live `index.html` DOM |
| How I work | copy mirrored from `about.html`'s `.about-card` set; illustrations drawn inline in `deck.js` (`ABOUT_ILLOS`) to keep the pink→green gradient. Flat-grey standalone copies live in `assets/illustrations/icon-*.svg` |
| Case studies | `window.CASE_STUDIES` |
| Charts | `CHART_DATA` at the top of `deck.js` — **placeholder numbers**, swap for real ones |
| Diagrams | hardcoded in each `diagram*()` builder |

## Open items

- [ ] Migrate the older diagrams onto the design tokens (see above)
- [ ] Replace `CHART_DATA` placeholder metrics with real figures
- [ ] Write real copy for the case-study "Questions?" outro
- [ ] Drop real screenshots into the case-study cover mockups
- [ ] Caption text for the case-study image slides (currently
      "Caption placeholder")
- [ ] `tokyo.MOV` in `assets/slide/about/vertical/` is 92 MB and unused —
      needs compressing before it could go in the globe slide's video card
      (local `ffmpeg` is broken: missing `libass`)
- [ ] The large original `.JPG`s in `assets/slide/about/vertical/` (~25 MB
      each) should be kept out of the deploy; only the `.webp`s are used
