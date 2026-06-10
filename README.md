# Harrison Wheeler — Portfolio

A fast, static portfolio site. Plain HTML/CSS/JS — no build step, no framework. Deploys to GitHub Pages (or Netlify) as-is.

## Structure

```
website/
├── index.html              Home
├── about.html              About
├── 404.html                Not-found page  (Leadership & Projects are sections on the home page: index.html#leadership / #projects)
├── assets/
│   ├── css/styles.css      All styles (dark site + light case-study sheet)
│   ├── js/main.js          Nav, mobile menu, wavy headline, analytics helpers
│   ├── js/case-studies.js  ← All case-study content lives here (one file)
│   ├── js/overlay.js       Case-study overlay engine
│   └── img/                Drop portrait.jpg + card images here
├── CNAME                   Custom domain for GitHub Pages
├── robots.txt
├── sitemap.xml
└── .nojekyll               Tells GitHub Pages to serve files as-is
```

## How the case studies work (no sub-pages)

There are **no separate case-study pages**. All case-study content lives in a single file — `assets/js/case-studies.js` — as a `window.CASE_STUDIES` object keyed by slug (`quality`, `leadcraft`, `video-recorder`, `travel-advisors`).

A card opens a case study by carrying `data-cs="<slug>"`. When clicked, `overlay.js` renders that entry into a **full-width, grid-backed sheet that animates up from the bottom**, leaving a peek of the page behind it. It builds the sticky table of contents automatically from the `<h2 id>` headings, adds a `#cs=<slug>` hash for sharing, and fires a GA virtual pageview. Esc, the ✕, the back button, and clicking the peek/backdrop all close it.

**To edit a case study:** open `assets/js/case-studies.js` and edit the `body` HTML string for that slug — that's it. The change shows up everywhere the card appears (home, Leadership, Projects). To add a new one, add an entry and give a card `data-cs="<new-slug>"`.

You can deep-link straight to an open case study, e.g. `index.html#cs=quality`.

---

## 1. Add your images

Put images in `assets/img/`:
- `portrait.jpg` — hero photo on the home page.
- Card/case-study images — wire them into the `.card-media` and `.cs-hero-media .ph` blocks. (The site looks fine without them; placeholders show until you add them.)

## 2. Wire up Google Analytics (GA4)

1. Create a GA4 property at <https://analytics.google.com> → **Admin → Create property**.
2. Add a **Web** data stream for your domain. Copy the **Measurement ID** (looks like `G-ABC123XYZ`).
3. Find-and-replace **`G-XXXXXXXXXX`** with your real ID across every `.html` file. From this folder:
   ```bash
   grep -rl 'G-XXXXXXXXXX' . | xargs sed -i '' 's/G-XXXXXXXXXX/G-ABC123XYZ/g'   # macOS
   ```
   (On Linux drop the `''` after `-i`.)

**Why this setup is "bulletproof":**
- The gtag snippet is inline in the `<head>` of every page, so it loads early and never depends on your other JS.
- `window.track(name, params)` in `main.js` is a safe wrapper — it never throws even if GA is blocked, so analytics can't break the page.
- **Outbound links** and **mailto/contact clicks** are tracked automatically.
- **Overlay opens fire virtual pageviews** (`page_view` with `engagement: case_study_overlay`), so case studies show up in GA even though they open without a full navigation.
- `anonymize_ip` is on.

**Verify it works:** open the site, then in GA go to **Reports → Realtime** — you should see yourself. Or install the *Tag Assistant* Chrome extension.

## 3. Verify Google Search Console

1. Go to <https://search.google.com/search-console> → add a **URL-prefix** property for `https://www.harrisonwheeler.com`.
2. Choose the **HTML tag** verification method. Copy the token from the `content="..."` value.
3. Find-and-replace **`REPLACE_WITH_GSC_TOKEN`** with that token across all `.html` files (same `grep | sed` pattern as above).
4. Click **Verify** in Search Console.
5. Then **Sitemaps → submit** `https://www.harrisonwheeler.com/sitemap.xml`.

> Tip: if you verify the **domain** (DNS) property instead, you don't need the meta tag at all — but the meta tag is the simplest path and is already wired in.

## 4. Deploy to GitHub Pages

1. Create a repo (e.g. `harrison-portfolio`) and push these files so they're at the **repo root** (or use a `/docs` folder).
   > ⚠️ Push the **contents of `website/`** to the repo root, not the `website/` folder itself — so `index.html` is at the top level.
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. **Custom domain:** the included `CNAME` file already says `www.harrisonwheeler.com`. In Settings → Pages, confirm the custom domain and tick **Enforce HTTPS**.
4. At your domain registrar, add DNS records:
   - `CNAME` record: `www` → `<your-github-username>.github.io`
   - For the apex `harrisonwheeler.com`, add the four GitHub Pages `A` records (and/or an `ALIAS`/`ANAME` to the same `.github.io` host). See GitHub's "Managing a custom domain" docs.
5. Wait for DNS + HTTPS cert (can take up to an hour). Done.

> Update the domain in `CNAME`, `sitemap.xml`, `robots.txt`, and the `<link rel="canonical">`/`og:url` tags if your real domain differs from `www.harrisonwheeler.com`.

## 5. (Optional) Netlify instead

Drag-and-drop the `website/` folder at <https://app.netlify.com/drop>, or connect the repo (no build command, publish directory = repo root). Add your custom domain in **Site settings → Domain management**. GA/GSC steps are identical.

## Local preview

```bash
cd website
python3 -m http.server 8000
# open http://localhost:8000
```
(Opening `index.html` directly via `file://` also works now, since the overlay no longer fetches anything — but a local server better matches production.)
