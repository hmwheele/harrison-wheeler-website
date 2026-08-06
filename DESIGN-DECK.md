# Presentation (Deck) Mode — design.md

Design system reference for Present mode: the full-screen deck mounted over the
site by `assets/js/deck.js` (~5,200 lines) and styled by `assets/css/deck.css`
(~4,350 lines), scoped entirely under `html.deck-mode` / `.deck-*`. Working
notes and slide-order/content docs live in `DECK-MODE.md`; the scrolling site's
system is in `DESIGN-WEBSITE.md`.

**The deck inherits, it doesn't redeclare.** deck.css has no `:root` block and
no `@font-face` — base colors and fonts come from `styles.css` tokens
(`--bg`, `--text`, `--primary`, `--light-pink`, `--mono`, `--serif`,
`--display`). Deck-specific tokens are declared on four scopes: `.deck`
(type/layout), `.deck-slide--charts` (chart palette), `.deck-slide--charts,
.deck-slide--diagram-full` (the `--v-*` viz system), and
`.deck-slide--diagram-full` (legacy `--dgm-*`).

---

## 1. Type scale (on `.deck`, deck.css:56–98)

Root font on `.deck` is `var(--mono)` — **the deck deliberately uses no GT
America** (`var(--font)` appears zero times in deck.css). Three families:
Neudron (display), Merriweather 300 (copy), IBM Plex Mono (labels/chrome).

### Layout origins

```
--title-top:       clamp(32px, 4.5vh, 60px)    /* every title lands here */
--deck-pad-bottom: clamp(104px, 13vh, 152px)   /* clears the fixed controls */
--about-copy-top:  clamp(72px, 18vh, 170px)
```

### Display steps (viewport-relative)

| Token | Value | Role |
|---|---|---|
| `--t-hero` | `clamp(2.6rem, 14.5vw, 13rem)` | Opening name |
| `--t-cover` | `clamp(4rem, 11.2vw, 9.6rem)` | Case-study cover |
| `--t-title` | `clamp(2.8rem, 7.6vw, 6.4rem)` | **Default slide title** |
| `--t-title-lg/-md/-sm/-xs` | 4.5 / 4 / 3.4 / 3.1rem max | Sub-steps; `-sm` is for headings *inside* a column only |
| `--t-stat` | `clamp(3.6rem, 9vw, 8.5rem)` | Big stats |
| `--t-quote` / `--t-quote-sm` | 3.6 / 2.8rem max | Pull quotes |

### Copy steps

`--t-lede → --t-item → --t-copy → --t-list → --t-label → --t-micro → --t-nano`
(1.8rem max down to 0.7rem max). Container-relative twins `--tc-head/-body/
-cell/-cap/-label/-desc` (in `cqi`) size type inside `container-type:
inline-size` cards.

### Core text roles

| Role | Class | Spec |
|---|---|---|
| Slide title | `.deck-title` | Neudron 800, `--t-title`, lh 0.98, `-0.01em`, `text-wrap: balance` |
| Hero name | `.deck-slide--title .deck-title` | `--t-hero`, lh 0.76, uppercase, `scaleY(1.5)`, mint gradient text |
| CS cover title | `.deck-slide--cs-title h1` | `--t-cover`, lh 0.76, `scaleY(1.5)`, pink gradient text |
| Eyebrow | `.deck-eyebrow` | mono `--t-micro`, `.14em`, uppercase, `--primary` |
| Lede / body | `.deck-lede` / `.deck-body` | Merriweather 300, `--t-lede`, lh 1.45/1.55, lede in `--light-pink`, measure 28–34ch |
| Statement | `.deck-statement` | serif 300, `clamp(1.5rem, 3.3vw, 2.9rem)`, 28ch |
| Big stat | `.deck-statfig-val` | Neudron 800, `--t-stat`, tabular-nums |

**Type rules:** display type tracks `-0.01em`; mono caps track `.06–.18em`
(most commonly `.12em`/`.14em`). A left-rail title is still a title — never
step it to `--t-title-sm`; narrow the column or shorten the words instead.

---

## 2. Color

**One slide background.** Every slide sits on the deck surface: `--bg`
`#0d0c11` plus two radial washes (lavender `rgba(208,188,255,.10)` top-right,
pink `rgba(255,216,228,.06)` bottom-left). There are **no white slides** —
case-study slides were converted to dark. The only light surfaces are the
`.deck-brief-sheet` paper document (`#f6f5f1`, ink `#1d1c22`), the
`viz-light` chart mode, audit-shot frames, and the green flow cards
(`#cff7da/#b9f2c8/#a3e8b6`).

### The `--v-*` viz system (edit tokens, not charts)

Declared on `.deck-slide--charts, .deck-slide--diagram-full` (deck.css:894):

```
Purple ramp   --v-p1 #e0d3ff · --v-p2 #c4b2ff · --v-p3 #a091f0 · --v-p4 #7a6ad6 · --v-p5 #5b4bb0
Accents       --v-green var(--mint) · --v-pink var(--light-pink)
Ink/lines     --v-ink #ffffff · --v-ink-muted var(--text-muted) · --v-line #545260 (solid, never alpha)
Fills         --v-fill-1/-2/-3  rgba(lavender) .14 / .22 / .30
Strokes       --v-stroke-hair 1px · --v-stroke 1.5px · --v-stroke-bold 2.5px · --v-dash "2 5"
SVG type      --v-t-title 30 · --v-t-head 24 · --v-t-node 17 (Neudron)
              --v-t-label 14 · --v-t-micro 11 (mono)
```

Semantic SVG classes so new viz never hardcode: `.v-title .v-head .v-node
.v-label .v-micro`, `.v-connector(-thin/-dash)`, `.v-surface(-2/-3)`.

### Chart palette (`--viz-s1…s6`, on `.deck-slide--charts`)

Dark: `#d7ccff → #5847ac` (6 steps on `--viz-surface #16151c`).
`viz-light` inverts the ramp (`#3a2c86 → #9a8be7` on `#f7f7f5`) — toggled by
`.viz-mode-toggle`. **Note: this is a different purple ramp from `--v-p*`**
(see Flags).

### Text gradients (background-clip)

All shared with the site via `:root` tokens in styles.css:

- Mint hero: `var(--grad-mint)` — same recipe as the site hero
- Pink cover: `var(--grad-pink)` — same as `.cs-hero-title`
- Mint→white closer: `var(--grad-mint-white)`
- Progress fill: `90deg, var(--primary), var(--light-pink))`

### Grain

`vizNoise(shape, opts)` + shared `vizNoiseFilter()` (fractalNoise): circles get
a radial clear-center fade, flat surfaces `{linear:true}` top→bottom. Card-level
grain via `.deck-about-card::before` and the reusable `.deck-grain` wash.

---

## 3. Layout

**No fixed canvas.** Slides are live DOM in viewport units — no
design-resolution scaling (only the press-`G` Overview scales real slides via
`transform: scale()` in `sizeOverview()`).

- `.deck` — `position: fixed; inset: 0; z-index: 1000`
- `.deck-stage` — grid, `place-items: center`; all slides stack in `grid-area: 1/1`
- `.deck-slide` — `max-width: 1400px`, `overflow-y: auto`, padding
  `var(--title-top) clamp(28px, 8vw, 160px) var(--deck-pad-bottom)` — one
  origin so the title never jumps between slides
- Breakpoints: 860px (grids → 1 col), 780/1100px (overview), 720px (chrome),
  small-screen slide padding `64px 24px 96px`

### Layout families

| Class | Grid |
|---|---|
| `.deck-slide--split` | `1fr / 0.92fr`, top-aligned |
| `.deck-titlefig` | `0.9fr / 1.1fr` centered — title/left-rail + figure; base for `titleSideSlide()`, `titleFigureSlide()`, roles & results slides |
| `.deck-vizsplit` | bullets left, chart right (chart ≤ 62vh) |
| `.deck-charts-grid` | 3-col dense grid of `.viz-card`s with `.viz-span-2/-3` |
| `.deck-figtext(-rev)` | figure/copy pair, reversible `1.15fr / 0.85fr` |
| `.deck-specs(--wide)` | spec column + device |
| `.deck-slide--cs-title` | `--cs-pad`/`--cs-col` even two columns: title left, standfirst bottom-right, device mock behind (z 1) under a fixed scrim (z 2) |

### Background grid

48px lavender lattice (`rgba(208,188,255,.07)`), radial-masked, drifting 48px
per 40s. Painted once on `.deck::before` (drift never resets); shown per-slide
via `deck--grid`, only on: title, both About slides, places, case-study
covers/outros, glow (`GRID_ON` in deck.js).

---

## 4. Components

**Chrome:** `.deck-progress` (3px, primary→pink fill, `.45s` house-ease width) ·
`.deck-controls` bottom bar · `.deck-exit(-–back)` mono pill · `.deck-arrow`
44px circle buttons · `.deck-counter` tabular mono · `.deck-hint` kbd toast ·
`.deck-overview` (`G`) grid of live scaled slides.

**Building blocks:** `.deck-eyebrow/-title/-lede/-body/-actions`,
`.deck-btn(--primary/--ghost)` (restyles the site `.btn`), `.deck-cols`,
`.deck-facts`, `.deck-split-head/-sub`, `.deck-slide-note`.

**~50 named slide types** (`.deck-slide--*`): title, split, places, aboutcards,
lead, timeline, charts, diagram-full, vizsplit, podcast, cta, pullquote,
statement, bigstats, statfigs, figtext, specs, roles, rituals, brief,
auditcollage, annotated, triptych, jobs, photowall, steps, words,
metricgroups, reflect, cs / cs-title / cs-outro / cs-media, glow, …
(full inventory greppable as `deck-slide--`).

**Notable content components:** portrait + logo rail · about cards (container
queries + grain) · Mapbox globe with SVG wireframe fallback · timeline rows ·
work list (numbered rows, arrow slides `6px` on hover) · guest wall (3 drifting
rows at 90/101/112s) · stat figures with count-up and delayed direction chip ·
enum (roman numerals) · quote lists · flow cards (purple→green) · brief "paper"
sheet · annotated screenshot callouts · reflect cards · placeholder wells
(`.deck-media-ph --landscape/--portrait/--square`, `.deck-fig-ph`).

**Device mockups:** `.dcd-window` (browser chrome: `#16151c`, 34px `#1f1d26`
bar, three dots, 16:10 screen) and `.dcd-phone` (9:19.5, 34px radius, notch).
Cover placement variants `--laptop` (fixed, bleeds `-16vw` right, 78vw wide),
`--desktop`, `--phone`. `PHONE_CASE_STUDIES` in deck.js picks the frame; both
fade up 60px with a 0.45s delay. Drop screenshots into `.dcd-screen`.

**Viz components:** `.viz-card(-head/-title)`, `.viz-svg` (base rule:
`text { font-family: var(--mono) }` — everything else must outrank it),
legends/swatches, donut/pyramid/axis label classes, `.viz-mode-toggle`.
Legacy layer: ~30 `.dgm-*` SVG classes with per-diagram sizes (see Flags).

---

## 5. Motion

**Slides cut — they do not fade.** `.deck-slide` transitions are `none`; the
copy is on screen the instant you advance. What animates is the content
*within* a slide, replayed on every activation.

**Easings:** house ease-out `cubic-bezier(.22, 1, .36, 1)` (15 uses — same
curve as the site); near-linear grow `cubic-bezier(.12, .12, .2, 1)` for
timeline/ribbon draws; plain `ease` elsewhere.

**Viz entrance choreography:** chart/diagram stages rest at `opacity 0,
translateY(28px)`; on `.is-active` they enter over 0.5–0.65s after a **340ms
delay** (`VIZ_IN_MS` in deck.js mirrors it; `afterVizIn()` gates in-SVG
builds). `[data-shared]` stages are exempt and hold still.

| Element | Motion |
|---|---|
| `.viz-bar` | scaleY 0→1 bottom-up, .8s, .08s stagger |
| `.viz-donut-ring` | 40° CCW spin-in, .9s |
| `.viz-line` | dashoffset trace, 1.1s (length via `getTotalLength()`) |
| `.viz-stat-num` | `countUp()` 950ms cosine ease |
| `.dgm-grow-path/-rect` | draw/grow left→right, 1.9s near-linear |
| `.v-plate` | stack plates drop in bottom-up, .055s stagger |
| `.v-bar` / `.v-flow` | Sankey bars grow down .7s / flows fade .8s |

**Shared elements:** `data-shared="<key>"` on consecutive slides triggers a
FLIP move (`flipShared()`: inverse transform, then `.72s` house ease) with an
80ms `deck--cut` guard. Used for the profile portrait (Intro ↔ About).

**Ambient loops:** grid drift 40s · guest rows 90/101/112s · photo wall 60s ·
vertical marquee 34s — all linear; off-screen rows pause via
`animation-play-state`.

**Reduced motion:** `html.deck-reduce` (set from `prefers-reduced-motion`) has
**43 overrides** in deck.css resolving every animation to its at-rest state;
JS honors it too (count-ups print final values, viz builds run synchronously,
FLIP returns early).

---

## 6. Content sources & state

- Slide order: `HOME_BUILDERS` array; case studies from `window.CASE_STUDIES`
  (same source as the site overlay); deck-only studies in `DECK_ONLY_STUDIES`
  (`accelerate`, deep-link-only `amplitude`).
- Chart numbers: `CHART_DATA` at the top of deck.js — **placeholders**.
- URL state: `#present=<n>` / `#present=cs.<key>.<n>` via `replaceState`.
- Enter: nav **Present** button, `P`, or `?present`. Exit: `Esc`. Overview: `G`.

---

## 7. Flags / known debt (deck-specific)

1. **Four purple ramps.** `--v-p1…p5` (diagrams), `--viz-s1…s6` dark
   (charts), `--viz-s*` light, and a private literal ramp inside
   `diagramRoadmap()` (`#39334e…#7568c4`) that matches none of them. One ramp
   should be canonical.
2. **13 legacy diagrams, not 7.** DECK-MODE.md's "seven older diagrams" is
   stale — the `.dgm-*` layer now covers 13 builders (tree, pods, roadmap,
   sitemap, swimlane, venn, acquisition, lifecycle, buy-in, cycle, load,
   pods-and-stacks, priorities) with **17+ hardcoded SVG font sizes** (9px to
   54px) versus the 5-step `--v-t-*` scale, several labels in mono that should
   be Neudron, and no `--v-stroke-*` usage.
3. **Token near-collisions (partly resolved).** `--v-ink` (#ffffff) vs
   `--viz-ink` (`var(--text)`) are still *different* values on overlapping
   selectors — deliberate, but easy to confuse. Resolved: `--dgm-line` now
   aliases `--v-line`; `--v-green`/`--v-pink` alias `--mint`/`--light-pink`;
   `--viz-surface/-ink/-ink-muted` alias the site tokens.
4. **44 hex literals in deck.js builders** — `diagramVenn` copies
   `--v-p1…p4` as literals; `podGlobe` has a private 5-step green ramp;
   `isoTower`, `slideMorale`, `globeGraphic`, `influenceShape` restate token
   values. ~14 hand-rolled lavender `rgba()` alphas match no `--v-fill-*` step.
5. **Radii/shadows are unsystematic** — ~20 distinct radius literals, 2 uses of
   `var(--radius-sm)`; shadows are one-off literals.
6. **`.viz-svg text` base rule** forces mono and requires specificity
   workarounds (`.viz-svg .dgm-*` prefixes) — any token migration must contend
   with it.
7. **Open content items** (from DECK-MODE.md): placeholder `CHART_DATA`,
   "Questions?" outro copy, cover screenshots, image-slide captions, the 92 MB
   `tokyo.MOV`, and 25 MB original JPGs that must stay out of deploys.
