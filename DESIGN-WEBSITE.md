# Website — design.md

Design system reference for the scrolling site: `index.html` (home), `about.html`
(My Story), `404.html`, and the light case-study overlay. Everything lives in
`assets/css/styles.css` (~1,950 lines) with behavior in `assets/js/main.js`,
`overlay.js`, `story.js`, and content in `assets/js/case-studies.js`.

For the Present/deck mode layered on top of this site, see `DESIGN-DECK.md`
(working notes: `DECK-MODE.md`).

---

## 1. Design tokens (`:root` in styles.css)

### Surfaces (dark theme)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0d0c11` | Page background (near-black) |
| `--surface` | `#16151c` | Raised surfaces (logo chips, timeline logos) |
| `--surface-2` | `#1f1d26` | Second-level surfaces, image placeholders |
| `--border` | `#2a2833` | Standard 1px borders |
| `--border-soft` | `#211f29` | Hairlines, background grid lines |

### Text

| Token | Value | Use |
|---|---|---|
| `--text` | `#ece9f1` | Primary text |
| `--text-muted` | `#a39fb0` | Secondary text |
| `--text-dim` | `#75717f` | Eyebrows, footer small print |

### Accents

| Token | Value | Use |
|---|---|---|
| `--primary` | `#d0bcff` | Lavender accent (from Figma / M3 primary) — links, hovers, filled buttons |
| `--primary-hover` | `#e3d6ff` | Button hover |
| `--on-primary` | `#381e72` | Text on lavender fills |
| `--light-pink` | `#ffd8e4` | Pink accent — ledes, card titles, section subtext |
| `--mint` | `#b9f2c8` | Mint accent — hero name, timeline years, finale years |

**Gradient tokens** (pair with a solid `--mint`/`--light-pink` `color:` line as
the `background-clip: text` fallback):

| Token | Recipe |
|---|---|
| `--grad-mint` | `to top, #e4fbea 0%, #cef6d9 20%, var(--mint) 48%` |
| `--grad-pink` | `to top, #fff4f8 0%, #ffe7f0 20%, var(--light-pink) 48%` |
| `--grad-mint-white` | `to top, var(--mint) 0%, #d9f8e3 42%, #ffffff 100%` |

### Layout

| Token | Value |
|---|---|
| `--max` | `1320px` container |
| `--gap` | `120px` section rhythm (→ `80px` ≤860px) |
| `--radius` / `--radius-sm` | `16px` / `10px` |
| Container padding | `32px` (→ `20px` ≤860px) |

### Case-study overlay (light theme, scoped on `.cs-sheet`)

| Token | Value |
|---|---|
| `--cs-bg` | `#ffffff` |
| `--cs-text` | `#17151b` |
| `--cs-muted` | `#5c5866` |
| `--cs-border` | `#e7e5ea` |
| `--cs-accent` | `#5b3df5` (violet; also hardcoded on the reading-progress bar) |

---

## 2. Typography

Sitewide fallback rule (comment in `:root`): sans stacks fall back to
Helvetica, serif stacks to Georgia — never to another webfont.

| Stack | Token | Source | Role |
|---|---|---|---|
| **GT America** 400/400i/500/700 | `--font` | self-hosted OTF | Body sans, buttons-adjacent UI |
| **Neudron** variable 100–900 | `--display` | self-hosted woff2 | Display: hero name, section headers, card titles, case-study H1/H2 — always `font-synthesis: none`, usually uppercase |
| **Reckless** variable (TRIAL) | (used directly) | self-hosted TTF | Wavy `.arc` marquee + `.head-display` serif headers ("Community") |
| **IBM Plex Mono** 400/500 | `--mono` | Google Fonts | Eyebrows, nav links, buttons, captions, labels |
| **Merriweather** 300/400/700 | `--serif` (`--serif-light: 300`) | Google Fonts | Ledes, belief statement, prose, card meta |

### Key type treatments

- **The "bigname" treatment** — the site's signature: Neudron, uppercase,
  `font-weight: 800`, `line-height: .92`, **`transform: scaleY(1.5)`** (stretch
  glyphs taller without widening), gradient-clipped text
  (`background-clip: text` + transparent fill, solid-color fallback).
  Applied to: hero name (mint), About "ABOUT" (mint), work-card titles (pink→white,
  hover slides to all-pink via `background-position`), "My story" band (pink),
  CTA headings (pink), case-study hero titles (pink), timeline years (mint, solid).
- **Eyebrow** — `.eyebrow`: mono, `.72rem`, `.18em` tracking, uppercase, dim.
  The same recipe recurs on captions, tags, and labels at .62–.72rem.
- **Section headers** — `.head-display h2`: Reckless 400 at `clamp(3rem, 7.5vw, 5.25rem)`;
  `.head-gt` variant swaps to Neudron.
- **Hero name sizing** — container-query units: `19cqw` desktop, `38cqw`
  two-line stacked on ≤560px.
- **Body prose** — Merriweather 300, `line-height` 1.5–1.8; overlay body copy
  is serif 300 on `#36333c` with `max-width: 42em`.

---

## 3. Color & gradient recipes

- **Mint text gradient** (hero, ABOUT): `var(--grad-mint)` — white-ish at baseline fading up into mint.
- **Pink text gradient** (CTA/globe, story band, cs-hero title): `var(--grad-pink)`.
  (Historically these were three slightly different stop sets; unified onto the
  cs-hero recipe when tokenized.)
- **Work cards**: two-tone `var(--light-pink)` top half / `#ffffff` bottom,
  animated via `background-position` on hover (unique — not tokenized).
- **Loadbar / intro gradient**: `linear-gradient(90deg, #ffe9f0, #ffd8e4, #ff9ec4)`.
- **Placeholder gradients**: `135deg` blends of `#2a2833 / #3a3747 / #1f1d26` family.
- **Scrims**: `rgba(13,12,17,…)` linear/radial fades (podcast wall, cs-hero, street-view).

## 4. Materials & signature surfaces

- **Glass pill** — `rgba(255,255,255,.08)` fill, `backdrop-filter: blur(14px) saturate(1.4)`,
  `.18` white border, inset highlight. Used for: nav links pill, ghost buttons,
  community photo captions (blur 10px).
- **Drifting grid** — 1px `--border-soft` lines on a `40px` tile, masked to fade
  out at the bottom, panning leftward on a 10s linear loop (`hero-grid-pan`).
  The cs-hero band uses the deck's variant: lavender `rgba(208,188,255,.07)`
  lines on `48px` tiles, 40s drift.
- **Folder cards** (`.card`) — 24px top-rounded outline drawn on a masked
  `::before` that fades to transparent toward the bottom; cards are sticky
  (`top: var(--stick-top)`) so they stack like a deck of folders on scroll.
- **Buttons** — one size/shape (`14px 28px`, radius 100px, mono 1.05rem):
  `.btn-primary` lavender fill, `.btn-ghost` glass.
- **Marching-ants contour** — dashed white SVG stroke tracing the hero portrait,
  `stroke-dasharray: 9 7`, 0.7s march.

## 5. Layout system

- Single container: `--max: 1320px`, centered, `padding-inline: 32px`.
- Section rhythm via `--gap` (120px), `.section { padding-block: var(--gap) }`.
- **Breakpoints**: `860px` (primary mobile switch), `560px` (phone hero/grid),
  `861px+` (desktop nav pill, floating overlay card), `1080px+` (carousel bleed).
- Grids are ad hoc per section: hero `1.6fr 1fr`, belief `1.3fr .7fr` with a
  sticky left column, timeline `1fr 132px 1fr` (year on the center spine),
  overlay `minmax(180px,1fr) minmax(0,720px) minmax(180px,1fr)` (TOC / content /
  bleed space).
- Full-bleed strips use the `width: 100vw; margin-left: calc(50% - 50vw)` trick.
- Mobile nav = the same centered pill (no hamburger; `.nav-toggle` exists but is
  `display: none` at ≤860px).

## 6. Motion

**Signature easing: `cubic-bezier(.22, 1, .36, 1)`** — used for nearly every
entrance, reveal, morph, and hover-slide. Micro-interactions use plain
`.2s` ease; ambient loops are `linear`.

| Pattern | Spec |
|---|---|
| Home intro sequence | scroll locked ~1.5s: loadbar sweeps 1.4s → HW logo tones white→black 1.4s → portrait + contour drag in from left 1.4s → content rises .7s at 1.5s delay |
| Scroll reveals | `[data-reveal-up]`: fade + 30px rise, .75s; About `[data-reveal]`: opacity-only .7s |
| Sticky storytelling | folder-card stack, parallax pinned headers (`.phead`), timeline spine draw (`--tl-draw`), 220vh "hold" chapter, 500vh globe scrolly journey |
| Ambient loops | grid pan 10s, badge spin 28s (+ counter-rotating burst), community marquee 70s, timeline crossfade 15s |
| Overlay open | sheet slides up `.5s` signature-ease; desktop: card-to-modal **morph ghost** (dark rect flies from clicked card into the sheet frame, then content fades up .45s) |
| Hovers | cards lift `-3px`; buttons lift `-1px`; community rows slide `24px` right; card titles flood pink `.6s` |

**Reduced motion**: honored per-pattern (contour, marquee, reveals, carousel,
static globe fallback) plus a global kill-switch:
`* { animation: none !important; transition-duration: .01ms !important }`.

## 7. Component inventory

| Component | Notes |
|---|---|
| `.nav` / `.nav-links` | Fixed transparent bar; centered glass pill of mono links; home hides wordmark until scrolled (`body.show-brand`) |
| `.btn` (+ `-primary`, `-ghost`) | See §4 |
| `.hero--stage` | Full-height portrait stage: bg HW logo, grid, contour, parallax vars `--plx-*` |
| `.arc` | Curved Reckless marquee headline |
| `.belief-grid` + `.timeline` | Sticky belief text + scrolling career timeline (logos, Neudron years) |
| `.card` / `.card-grid` | Sticky folder-stack case-study cards, alternating layout, pink gradient titles |
| `.phead` | Pinned section header that following content scrolls over |
| `.community-strip` / `.cg-group` | Marquee photo strip; labeled Talks/Writing/Events list rows with slide-right hover |
| `.podcast` | Guest-tile wall behind radial scrim + centered copy |
| `.cta-section` / `.globe-cta` | Mint/pink stretched CTA headings + button pair |
| `.footer` | Mono small print, social icons with follower counts |
| `.subpop` | Newsletter popover, bottom-right, white light-theme panel |
| **Case-study overlay** `.cs-*` | Light sheet: fixed topbar w/ progress bar, sticky TOC, 720px measure, carousels, `.cs-metrics` stat grids, `.cs-table`, `.cs-figure`/`.cs-shot`; dark `.cs-hero` cover band that mirrors the deck's title slide (grid, pink stretched Neudron, device art, height-container-queried type) |
| **About page** `.story-*`, `.tl-*`, `.globe-*` | Video hero w/ dot-lattice mask, about cards, central-spine timeline, Street View chapter, WebGL globe journey with blackout + starfield |

## 8. Flags / known debt

1. **Reckless is a trial font** — `RecklessCollectionVF-TRIAL.ttf` (897 KB)
   ships on the public site. Licensing must be resolved before/while this stays
   live; also the single heaviest font asset.
2. ~~Signature colors bypass tokens~~ — **resolved**: `--mint` and the
   `--grad-*` tokens now exist in `:root`; all CSS literals point at them, and
   the three drifted pink gradients were unified onto the cs-hero recipe.
   (Hex literals inside deck.js SVG builders remain — that's the diagram
   migration, see `DESIGN-DECK.md`.)
3. ~~`--cs-accent` duplicated~~ — **resolved**: the `--cs-*` tokens are now
   declared on `.cs-overlay, .cs-sheet` (the fixed topbar lives outside the
   sheet), and `.cs-progress span` uses `var(--cs-accent)`.
4. **README.md is stale** — describes `assets/img/`, no `deck.css/deck.js`,
   `story.js`, `fonts/`, or the cs-hero band; placeholder GA instructions remain
   though a real GA ID (`G-V0RBJMB8WZ`) is wired in.
5. **Deck payload loads on every home visit** — `deck.css` (155 KB) +
   `deck.js` (250 KB) are plain `<link>`/`<script>` tags in `index.html`,
   ~2× the weight of the rest of the CSS/JS combined, paid even by visitors who
   never press Present.
6. **Legacy copies outside `website/`** — the parent folder holds older
   generations of the site (root `index.html`/`styles.css`, `site/`,
   many `case-study-*.html`). Nothing links them, but they invite edits to the
   wrong file.
7. **Heavy assets** — `hero_big_transparent.png` (1.7 MB) sits beside its
   `.webp` (120 KB); `assets/slide/about/vertical/` holds a 92 MB `tokyo.MOV`
   and ~25 MB original JPGs (deck open item; keep out of deploys).
8. **Mixed font delivery** — GT America/Neudron/Reckless self-hosted, but IBM
   Plex Mono + Merriweather load from Google Fonts (extra origin, third-party
   request).
