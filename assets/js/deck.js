/* =====================================================================
   deck.js — "Present" mode.

   Reads the existing home-page sections and reflows them into a
   full-screen, keyboard-navigable slide deck. The normal scrolling
   site is untouched; entering the deck just hides it and mounts an
   overlay. Slides are built from the live DOM so the deck stays in
   sync with the page content automatically.

   Case studies present too: clicking a work card while presenting
   opens that case study as its own slide deck (one slide per <h2>
   section), on the light "paper" surface the case studies already use.
   A "Back to deck" control returns to the home deck.

   Enter:  the nav "Present" button, ?present in the URL, or press P.
   Move:   → / ← / Space / PageDown / PageUp / Home / End, on-screen
           or the on-screen arrows.
   Exit:   Esc (backs out of a case study first, then exits) or the
           bottom-left button.
   ===================================================================== */
(function () {
  'use strict';

  // Only build the deck where the source sections exist (the home page).
  if (!document.querySelector('.hero-bigname')) return;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) document.documentElement.classList.add('deck-reduce');

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  // Small DOM builder: el('div.foo', {attr}, [children | 'text']).
  function el(spec, attrs, kids) {
    var parts = spec.split('.');
    var node = document.createElement(parts.shift() || 'div');
    if (parts.length) node.className = parts.join(' ');
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) {
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function text(sel) { var n = $(sel); return n ? n.textContent.trim() : ''; }

  // A caret/chevron icon (matches the site's outbound-link style).
  function extIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>';
  }

  /* ====================================================================
     CHARTS SLIDE — customize your data here
     --------------------------------------------------------------------
     Edit the numbers/labels below and the charts redraw. Colors are the
     `--viz-s1..s6` slots defined in deck.css (a colorblind-safe palette
     validated for the dark deck surface); swap those to recolor.
     ==================================================================== */
  var CHART_DATA = {
    // Column chart — one series (magnitude over time)
    // `span` sizes a card: 1, 2, or 3 columns wide. Height follows the
    // chart's aspect ratio, so wider = proportionally taller.
    columns: {
      title: 'Campaigns created (indexed to Q1)',
      span: 1,
      color: 'var(--viz-s1)',
      suffix: '',
      data: [
        { label: 'Q1', value: 100 },
        { label: 'Q2', value: 118 },
        { label: 'Q3', value: 132 },
        { label: 'Q4', value: 151 }
      ]
    },

    // Line chart — two series (change over time)
    line: {
      title: 'Product engagement index',
      span: 1,
      xLabels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
      series: [
        { name: 'Audiences',   color: 'var(--viz-s1)', values: [100, 128, 150, 171, 190, 205] },
        { name: 'Measurement', color: 'var(--viz-s5)', values: [100, 106, 112, 119, 121, 124] }
      ]
    },

    // Donut — part-to-whole (≤ 6 slices)
    donut: {
      title: 'Where design time goes',
      span: 2,
      centerValue: '100%',
      centerLabel: 'of a sprint',
      data: [
        { label: 'Product craft',     value: 42, color: 'var(--viz-s1)' },
        { label: 'Coaching & 1:1s',    value: 26, color: 'var(--viz-s3)' },
        { label: 'Cross-functional',   value: 20, color: 'var(--viz-s2)' },
        { label: 'Hiring',             value: 12, color: 'var(--viz-s4)' }
      ]
    },

    // Stat tiles — headline numbers
    stats: {
      title: 'Highlights',
      span: 1,
      items: [
        { value: '32%',  label: 'increase in campaigns created' },
        { value: '175%', label: 'lift in Audiences engagement' },
        { value: '−14d', label: 'time-to-value churn' }
      ]
    },

    // Pyramid — ordered layers, top → base. Colors are the --viz-p1..p5
    // ordinal ramp (validated single-hue violet, light→dark).
    pyramid: {
      title: 'Innovation pyramid',
      span: 1,
      layers: [
        { label: 'Optimize' },
        { label: 'Implement' },
        { label: 'Conceptualize' },
        { label: 'Understand' },
        { label: 'Budget Time' }
      ]
    }
  };

  /* ── Tiny SVG chart engine (no libraries) ──────────────────────── */
  var SVGNS = 'http://www.w3.org/2000/svg';
  function sEl(name, attrs, kids) {
    var n = document.createElementNS(SVGNS, name);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }
  function svgRoot(w, h, kids) {
    return sEl('svg', {
      viewBox: '0 0 ' + w + ' ' + h, class: 'viz-svg',
      preserveAspectRatio: 'xMidYMid meet', role: 'img'
    }, kids);
  }
  function niceMax(v) {
    if (v <= 0) return 1;
    var pow = Math.pow(10, Math.floor(Math.log(v) / Math.LN10));
    var n = v / pow;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return step * pow;
  }
  function vfmt(v, cfg) { return (cfg.prefix || '') + v + (cfg.suffix || ''); }
  // bar with a rounded top cap and a square base
  function barPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return 'M' + x + ',' + (y + h) + 'V' + (y + r) +
      'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + (-r) +
      'h' + (w - 2 * r) + 'a' + r + ',' + r + ' 0 0 1 ' + r + ',' + r +
      'V' + (y + h) + 'Z';
  }

  function chartColumn(cfg) {
    var W = 480, H = 220, padT = 30, padB = 30, pad = 10;
    var data = cfg.data, n = data.length;
    var max = niceMax(Math.max.apply(null, data.map(function (d) { return d.value; })));
    var plotW = W - pad * 2, plotH = H - padT - padB, base = H - padB;
    var band = plotW / n, bw = Math.min(52, band * 0.72);
    var kids = [sEl('line', { x1: pad, y1: base, x2: W - pad, y2: base, stroke: 'var(--viz-grid)', 'stroke-width': 1 })];
    data.forEach(function (d, i) {
      var h = Math.max(2, d.value / max * plotH);
      var x = pad + band * i + (band - bw) / 2, y = base - h;
      kids.push(sEl('path', { d: barPath(x, y, bw, h, 4), fill: cfg.color, class: 'viz-bar', style: 'transition-delay:' + (i * 0.08) + 's' }));
      kids.push(sEl('text', { x: x + bw / 2, y: y - 8, 'text-anchor': 'middle', class: 'viz-val', text: vfmt(d.value, cfg) }));
      kids.push(sEl('text', { x: x + bw / 2, y: base + 18, 'text-anchor': 'middle', class: 'viz-axis', text: d.label }));
    });
    return svgRoot(W, H, kids);
  }

  function chartLine(cfg) {
    var W = 480, H = 220, padT = 18, padB = 28, padL = 34, padR = 46;
    var xs = cfg.xLabels, m = xs.length;
    var all = cfg.series.reduce(function (a, s) { return a.concat(s.values); }, []);
    var max = niceMax(Math.max.apply(null, all));
    var plotW = W - padL - padR, plotH = H - padT - padB, base = H - padB;
    var xAt = function (i) { return padL + (m > 1 ? plotW * i / (m - 1) : 0); };
    var yAt = function (v) { return base - (v / max) * plotH; };
    var kids = [];
    [0, 0.5, 1].forEach(function (t) {
      var y = base - t * plotH;
      kids.push(sEl('line', { x1: padL, y1: y, x2: W - padR, y2: y, stroke: 'var(--viz-grid)', 'stroke-width': 1 }));
      kids.push(sEl('text', { x: padL - 8, y: y + 4, 'text-anchor': 'end', class: 'viz-axis', text: String(Math.round(max * t)) }));
    });
    xs.forEach(function (lb, i) { kids.push(sEl('text', { x: xAt(i), y: base + 18, 'text-anchor': 'middle', class: 'viz-axis', text: lb })); });
    cfg.series.forEach(function (s) {
      kids.push(sEl('polyline', {
        points: s.values.map(function (v, i) { return xAt(i) + ',' + yAt(v); }).join(' '),
        fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', class: 'viz-line'
      }));
      var lx = xAt(m - 1), ly = yAt(s.values[m - 1]);
      kids.push(sEl('circle', { cx: lx, cy: ly, r: 6, fill: 'var(--viz-surface)', class: 'viz-dot' }));   // surface ring
      kids.push(sEl('circle', { cx: lx, cy: ly, r: 4, fill: s.color, class: 'viz-dot' }));
      kids.push(sEl('text', { x: lx + 9, y: ly + 4, 'text-anchor': 'start', class: 'viz-val', text: String(s.values[m - 1]) }));
    });
    return svgRoot(W, H, kids);
  }

  function chartDonut(cfg) {
    var W = 200, H = 200, cx = 100, cy = 100, R = 72, T = 38;
    var total = cfg.data.reduce(function (a, d) { return a + d.value; }, 0);
    var C = 2 * Math.PI * R, gap = 4, off = 0;
    // ring (track + segments) spins in on animation; labels stay put
    var ring = [sEl('circle', { cx: cx, cy: cy, r: R, fill: 'none', stroke: 'var(--viz-grid)', 'stroke-width': T, opacity: 0.4 })];
    var labels = [];
    cfg.data.forEach(function (d) {
      var len = d.value / total * C, dash = Math.max(0, len - gap);
      ring.push(sEl('circle', {
        cx: cx, cy: cy, r: R, fill: 'none', stroke: d.color, 'stroke-width': T,
        'stroke-dasharray': dash + ' ' + (C - dash), 'stroke-dashoffset': (-off),
        transform: 'rotate(-90 ' + cx + ' ' + cy + ')', 'stroke-linecap': 'butt'
      }));
      var pct = Math.round(d.value / total * 100);
      if (pct >= 9) {
        var mid = (off + len / 2) / C * 2 * Math.PI - Math.PI / 2;
        labels.push(sEl('text', {
          x: cx + Math.cos(mid) * R, y: cy + Math.sin(mid) * R + 4,
          'text-anchor': 'middle', class: 'viz-donut-lbl', text: pct + '%'
        }));
      }
      off += len;
    });
    if (cfg.centerValue) {
      labels.push(sEl('text', { x: cx, y: cy - 2, 'text-anchor': 'middle', class: 'viz-donut-center', text: cfg.centerValue }));
      labels.push(sEl('text', { x: cx, y: cy + 17, 'text-anchor': 'middle', class: 'viz-donut-sub', text: cfg.centerLabel || '' }));
    }
    var g = sEl('g', { class: 'viz-donut-ring', 'transform-origin': cx + 'px ' + cy + 'px' }, ring);
    return svgRoot(W, H, [g].concat(labels));
  }

  // Pyramid: stacked trapezoids, apex up, one fill per mode
  // (--viz-pyr-fill), separated by semi-transparent white seams.
  function chartPyramid(cfg) {
    var W = 480, H = 320, apexY = 10, baseY = H - 10, cx2 = W / 2, halfBase = 220;
    var n = cfg.layers.length;
    var yAt = function (i) { return apexY + (baseY - apexY) * i / n; };
    var halfAt = function (y) { return (y - apexY) / (baseY - apexY) * halfBase; };
    var kids = [];
    cfg.layers.forEach(function (L, i) {
      var yT = yAt(i), yB = yAt(i + 1);
      var hT = halfAt(yT), hB = halfAt(yB);
      var pts = (cx2 - hT) + ',' + yT + ' ' + (cx2 + hT) + ',' + yT + ' ' +
                (cx2 + hB) + ',' + yB + ' ' + (cx2 - hB) + ',' + yB;
      kids.push(sEl('polygon', {
        points: pts,
        fill: 'var(--viz-pyr-fill)',
        stroke: '#b9b3d6',           /* solid — shared seams would double up */
        'stroke-width': 1.5,
        'stroke-linejoin': 'round',
        class: 'viz-pyr-layer',
        style: 'transition-delay:' + ((n - 1 - i) * 0.1) + 's'   // builds bottom-up
      }));
      var midY = (yT + yB) / 2;
      var hasSub = L.sub && halfAt(midY) * 2 > 240;   // sub only where the band is wide enough
      // The apex band is too narrow at its center for a label — sit the
      // top layer's label near the bottom of its band (where it's widest)
      // and a step smaller so it clears the slanted edges.
      var lblY = i === 0 ? yB - 5 : (hasSub ? midY - 4 : midY + 5);
      kids.push(sEl('text', {
        x: cx2, y: lblY, 'text-anchor': 'middle',
        class: 'viz-pyr-lbl' + (i === 0 ? ' viz-pyr-lbl--sm' : ''), text: L.label,
        style: 'transition-delay:' + ((n - 1 - i) * 0.1 + 0.25) + 's'
      }));
      if (hasSub) kids.push(sEl('text', {
        x: cx2, y: midY + 15, 'text-anchor': 'middle',
        class: 'viz-pyr-sub', text: L.sub,
        style: 'transition-delay:' + ((n - 1 - i) * 0.1 + 0.25) + 's'
      }));
    });
    return svgRoot(W, H, kids);
  }

  function vizCard(title, bodyNodes, extraCls) {
    return el('div.viz-card' + (extraCls || ''), null,
      [el('div.viz-card-head', null, [el('span.viz-card-title', null, [title])])].concat(bodyNodes));
  }
  function vizLegend(items) {
    return el('div.viz-legend', null, items.map(function (it) {
      return el('span.viz-legend-item', null, [
        el('span.viz-swatch', { style: 'background:' + it.color }),
        el('span', null, [it.name || it.label])
      ]);
    }));
  }

  function slideCharts() {
    var C = CHART_DATA;
    // each card carries its configured width: viz-span-1 / -2 / -3
    var spanCls = function (cfg) { return '.viz-span-' + (cfg.span || 1); };
    var colCard = vizCard(C.columns.title, [chartColumn(C.columns)], spanCls(C.columns));
    var lineCard = vizCard(C.line.title, [chartLine(C.line), vizLegend(C.line.series)], spanCls(C.line));
    var donutCard = vizCard(C.donut.title, [
      el('div.viz-donut-wrap', null, [
        chartDonut(C.donut),
        el('div.viz-donut-legend', null, C.donut.data.map(function (d) {
          return el('div.viz-legend-item', null, [
            el('span.viz-swatch', { style: 'background:' + d.color }),
            el('span.viz-legend-name', null, [d.label]),
            el('span.viz-legend-val', null, [d.value + '%'])
          ]);
        }))
      ])
    ], '.viz-card--donut' + spanCls(C.donut));
    var statCard = vizCard(C.stats.title, [
      el('div.viz-stats', null, C.stats.items.map(function (s) {
        return el('div.viz-stat', null, [
          el('div.viz-stat-num', null, [s.value]),
          el('div.viz-stat-label', null, [s.label])
        ]);
      }))
    ], '.viz-card--stats' + spanCls(C.stats));
    var pyramidCard = vizCard(C.pyramid.title, [chartPyramid(C.pyramid)], '.viz-card--pyramid' + spanCls(C.pyramid));
    // Light/dark toggle for the charts (flips the --viz-* palette).
    var toggle = el('button.viz-mode-toggle', { type: 'button', 'aria-label': 'Toggle chart theme' }, [
      el('span.viz-mode-opt.is-on', { 'data-mode': 'dark' }, ['Dark']),
      el('span.viz-mode-opt', { 'data-mode': 'light' }, ['Light'])
    ]);
    var section = el('section.deck-slide.deck-slide--charts', { 'data-label': 'Impact' }, [
      el('div.deck-charts-head', null, [
        el('div', null, []),
        toggle
      ]),
      el('div.deck-charts-grid', null, [colCard, lineCard, pyramidCard, donutCard, statCard])
    ]);
    toggle.addEventListener('click', function () {
      var light = section.classList.toggle('viz-light');
      toggle.querySelectorAll('.viz-mode-opt').forEach(function (o) {
        o.classList.toggle('is-on', (o.getAttribute('data-mode') === 'light') === light);
      });
    });
    return section;
  }

  // Count a stat tile up from 0 to its value (keeps the sign/prefix/suffix).
  function countUp(el2) {
    if (!el2.dataset.final) el2.dataset.final = el2.textContent;
    var str = el2.dataset.final;
    var m = str.match(/^(\D*)(-?\d+(?:\.\d+)?)(.*)$/);
    if (!m || reduce) { el2.textContent = str; return; }
    var pre = m[1], target = parseFloat(m[2]), suf = m[3];
    var dec = (m[2].split('.')[1] || '').length, dur = 950, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var t = Math.min(1, (ts - t0) / dur);
      var e = 0.5 - 0.5 * Math.cos(Math.PI * t);       // ease in-out
      el2.textContent = pre + (target * e).toFixed(dec) + suf;
      if (t < 1) requestAnimationFrame(step); else el2.textContent = str;
    }
    requestAnimationFrame(step);
  }

  // How long the viz panel takes to rise into place (matches the
  // transition-delay on .deck-diagram-stage / .deck-charts-grid in
  // deck.css). Internal builds — bars, traced lines, counters — wait this
  // long so the copy reads first, then the visual arrives.
  var VIZ_IN_MS = 340;
  function afterVizIn(fn) {
    if (reduce) { fn(); return; }
    setTimeout(fn, VIZ_IN_MS);
  }

  // Replay the chart entrance animations. Called when the slide activates.
  function animateCharts(slide) {
    var grid = slide.querySelector('.deck-charts-grid');
    if (!grid) return;
    grid.classList.remove('viz-anim');
    // set up line "trace": dash the whole length, then release to 0
    var lines = slide.querySelectorAll('.viz-line');
    lines.forEach(function (p) {
      var len = p.getTotalLength();
      p.style.transition = 'none';
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reduce ? 0 : len;
    });
    void grid.offsetWidth;                              // force reflow so the reset sticks
    lines.forEach(function (p) { p.style.transition = ''; p.style.strokeDashoffset = 0; });
    grid.classList.add('viz-anim');
    slide.querySelectorAll('.viz-stat-num').forEach(countUp);
  }

  /* ── Home slide builders. Each returns a .deck-slide element (or null
     to skip). They read from the live page, so edits to the site flow
     straight into the deck. ─────────────────────────────────────── */

  /* The home page's photo card (tilted 4:5 portrait with the spinning
     Amplitude badge), cloned so it stays in sync with the site. Used on
     more than one slide, so ids are made unique per copy. */
  /* The companies behind "a decade leading design". Deck-only, and they sit
     outside the photo — the site's portrait carries no logos. */
  var PORTRAIT_LOGOS = ['assets/logos/linkedin.jpg', 'assets/logos/zendesk.jpg'];
  function portraitLogos() {
    return el('span.deck-portrait-logos', { 'aria-hidden': 'true' },
      [el('span.deck-portrait-logos-lbl', null, ['Previously'])].concat(
        PORTRAIT_LOGOS.map(function (src) { return el('img', { src: src, alt: '' }); })));
  }

  var portraitSeq = 0;
  function portraitCard(withLogos) {
    var photo = $('.timeline-photo');
    if (!photo) return null;
    var card = photo.cloneNode(true);
    // [data-reveal-up] starts at opacity 0 until the observer adds .in —
    // the clone is never observed, so mark it revealed (this also applies
    // the -3.5deg tilt it rests at on the home page).
    card.removeAttribute('data-reveal-up');
    card.classList.add('in');
    // The badge SVG references ids; make them unique so multiple copies
    // (and the original) can coexist in one document.
    var n = ++portraitSeq;
    card.innerHTML = card.innerHTML
      .replace(/badge-arc/g, 'deck-badge-arc-' + n)
      .replace(/burst-grad/g, 'deck-burst-grad-' + n);
    // data-shared marks an element that persists across slides — the deck
    // cuts (no transition) between two slides that share a key, so this
    // stays put instead of cross-fading.
    // The frame matches the card's box, so anything anchored to it (the
    // logos) lines up with the photo rather than the whole column.
    var frame = el('div.deck-portrait-frame', null,
      withLogos ? [card, portraitLogos()] : [card]);
    return el('div.deck-portrait', { 'aria-hidden': 'true', 'data-shared': 'portrait' }, [frame]);
  }

  // Empty framed placeholder for the right column — drop a real <img> in
  // later (replace the .deck-photo-ph contents, or swap this for
  // portraitCard()).
  function photoPlaceholder() {
    return el('div.deck-portrait', { 'aria-hidden': 'true' }, [
      el('div.deck-photo-ph', null, [
        el('span.deck-photo-ph-icon', {
          html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 15l-5-5L5 21"/></svg>'
        }),
        el('span.deck-photo-ph-label', null, ['Photo'])
      ])
    ]);
  }

  var IMG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 15l-5-5L5 21"/></svg>';

  // Which case studies read as a phone (portrait) vs. desktop (landscape)
  // placeholder on their cover. Edit this map to taste.
  var PHONE_CASE_STUDIES = ['video-recorder', 'events'];
  function deviceFor(key) { return PHONE_CASE_STUDIES.indexOf(key) >= 0 ? 'phone' : 'desktop'; }

  // A device-shaped image placeholder that bleeds off the slide edge.
  // Drop a real <img> into the .dcd-screen to replace it.
  function deviceMock(orient) {
    var screen = el('div.dcd-screen', null, [
      el('span.deck-photo-ph-icon', { html: IMG_ICON }),
      el('span.deck-photo-ph-label', null, [orient === 'phone' ? 'Phone' : 'Desktop'])
    ]);
    if (orient === 'phone') {
      return el('div.deck-cs-device.deck-cs-device--phone', { 'aria-hidden': 'true' }, [
        el('div.dcd-phone', null, [el('div.dcd-notch'), screen])
      ]);
    }
    return el('div.deck-cs-device.deck-cs-device--desktop', { 'aria-hidden': 'true' }, [
      el('div.dcd-window', null, [
        el('div.dcd-bar', null, [el('span'), el('span'), el('span')]),
        screen
      ])
    ]);
  }

  function slideTitle() {
    var name = $('.hero-bigname');
    var lede = text('.lede');
    // Left column: stacked name + lede. (No CTAs here — they close the
    // deck on the Contact slide instead.)
    var copy = [];
    copy.push(el('h2.deck-title', { html: name ? name.innerHTML : 'Harrison<br class="bigname-br"> Wheeler' }));
    if (lede) copy.push(el('p.deck-lede', null, [lede]));
    var kids = [el('div.deck-split-copy', null, copy)];
    var portrait = portraitCard();
    if (portrait) kids.push(portrait);
    return el('section.deck-slide.deck-slide--title.deck-slide--split', { 'data-label': 'Intro' }, kids);
  }

  function slideBelief() {
    var big = $('.belief-text .big');
    if (!big) return null;
    var kids = [el('div.deck-split-copy', null, [
      el('h2.deck-title', null, ['About']),
      el('p.deck-body', null, [big.textContent.trim()])
    ])];
    var portrait = portraitCard(true);   // logos ride alongside on About
    if (portrait) kids.push(portrait);
    return el('section.deck-slide.deck-slide--belief.deck-slide--split', { 'data-label': 'About' }, kids);
  }

  // A wireframe globe with location pins + a dotted travel path.
  function globeGraphic() {
    var cx = 200, cy = 200, R = 168, line = 'rgba(208, 188, 255, 0.28)';
    var k = [];
    var defs = sEl('defs', null, [
      sEl('radialGradient', { id: 'deck-globe-glow', cx: '50%', cy: '42%', r: '62%' }, [
        sEl('stop', { offset: '0%', 'stop-color': '#d0bcff', 'stop-opacity': '0.18' }),
        sEl('stop', { offset: '100%', 'stop-color': '#d0bcff', 'stop-opacity': '0' })
      ])
    ]);
    k.push(sEl('circle', { cx: cx, cy: cy, r: R, fill: 'url(#deck-globe-glow)', stroke: line, 'stroke-width': 1.5 }));
    // latitudes (equator + two above/below)
    k.push(sEl('ellipse', { cx: cx, cy: cy, rx: R, ry: R * 0.22, fill: 'none', stroke: line, 'stroke-width': 1 }));
    [58, 116].forEach(function (off) {
      var rx = Math.sqrt(R * R - off * off), ry = Math.max(5, rx * 0.2);
      k.push(sEl('ellipse', { cx: cx, cy: cy - off, rx: rx, ry: ry, fill: 'none', stroke: line, 'stroke-width': 1 }));
      k.push(sEl('ellipse', { cx: cx, cy: cy + off, rx: rx, ry: ry, fill: 'none', stroke: line, 'stroke-width': 1 }));
    });
    // meridians
    [0.34, 0.68].forEach(function (f) {
      k.push(sEl('ellipse', { cx: cx, cy: cy, rx: R * f, ry: R, fill: 'none', stroke: line, 'stroke-width': 1 }));
    });
    k.push(sEl('line', { x1: cx, y1: cy - R, x2: cx, y2: cy + R, stroke: line, 'stroke-width': 1 }));
    // dotted travel paths
    ['M150,132 Q212,104 286,168', 'M118,206 Q132,166 150,132'].forEach(function (d) {
      k.push(sEl('path', { d: d, fill: 'none', stroke: 'var(--light-pink)', 'stroke-width': 1.5, 'stroke-dasharray': '1.5 6', 'stroke-linecap': 'round', opacity: '0.75' }));
    });
    // location pins
    [{ x: 150, y: 132, t: 'Milwaukee' }, { x: 118, y: 206, t: 'Bay Area' }, { x: 286, y: 168, t: 'Asia' }].forEach(function (p) {
      k.push(sEl('circle', { cx: p.x, cy: p.y, r: 5.5, fill: 'var(--light-pink)', stroke: '#0d0c11', 'stroke-width': 2 }));
      k.push(sEl('text', { x: p.x + 12, y: p.y + 4, class: 'deck-globe-lbl', text: p.t }));
    });
    var svg = svgRoot(400, 400, [defs].concat(k));
    svg.setAttribute('class', 'viz-svg deck-globe-svg');
    // The real Mapbox globe mounts over the wireframe once it loads; the
    // SVG stays as the fallback (no WebGL / token / CDN blocked).
    // Media placeholders overlap the globe and fade in after it spins a bit.
    var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    var IMG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 15l-5-5L5 21"/></svg>';
    // Vertical media — cycles/crossfades inside the portrait card.
    var VERTICAL = [
      'assets/slide/about/vertical/taiwan.webp',
      'assets/slide/about/vertical/kyoto.webp',
      'assets/slide/about/vertical/chongqing.webp',
      'assets/slide/about/vertical/fuji.webp'
    ];
    var portrait = mediaPlaceholder('portrait', 'Portrait · 9:16', IMG);
    portrait.classList.add('deck-media-ph--filled');
    VERTICAL.forEach(function (src, i) {
      var im = el('img.deck-media-img' + (i === 0 ? '.is-shown' : ''), { src: src, alt: '' });
      portrait.appendChild(im);
    });
    var square = mediaPlaceholder('square', 'Photo · 1:1', IMG);
    square.classList.add('deck-media-ph--filled');
    square.appendChild(el('img.deck-media-img.is-shown', { src: 'assets/slide/about/cat.jpg', alt: '' }));
    var landscape = mediaPlaceholder('landscape', 'Video · 16:9', PLAY);
    landscape.classList.add('deck-media-ph--filled');
    landscape.appendChild(el('img.deck-media-img.is-shown', { src: 'assets/slide/about/fujiclip.gif', alt: '' }));
    var media = el('div.deck-globe-media', { 'aria-hidden': 'true' }, [
      landscape,
      portrait,
      square
    ]);
    return el('div.deck-globe', { 'aria-hidden': 'true' }, [
      el('div.deck-globe-map', { 'data-globe': '' }),
      svg,
      media
    ]);
  }

  function mediaPlaceholder(shape, label, iconHtml) {
    return el('figure.deck-media-ph.deck-media-ph--' + shape, null, [
      el('span.deck-media-ph-icon', { html: iconHtml }),
      el('span.deck-media-ph-label', null, [label])
    ]);
  }

  // Fade the media placeholders in after the globe has spun for a moment,
  // then crossfade the vertical images inside the portrait card.
  var placesMediaTimer = null, mediaCycleTimer = null;
  function revealPlacesMedia(slide) {
    var wrap = slide.querySelector('.deck-globe-media');
    if (!wrap) return;
    wrap.classList.remove('is-revealed');    // reset so it replays on re-entry
    clearTimeout(placesMediaTimer);
    clearInterval(mediaCycleTimer);
    var reveal = function () {
      if (!slide.classList.contains('is-active')) return;
      wrap.classList.add('is-revealed');
      startMediaCycle(slide);
    };
    if (reduce) { reveal(); return; }
    placesMediaTimer = setTimeout(reveal, 2400);
  }
  function startMediaCycle(slide) {
    var imgs = slide.querySelectorAll('.deck-media-ph--portrait .deck-media-img');
    if (imgs.length < 2 || reduce) return;
    clearInterval(mediaCycleTimer);
    var idx = 0;
    mediaCycleTimer = setInterval(function () {
      if (!slide.classList.contains('is-active') || document.hidden) return;
      imgs[idx].classList.remove('is-shown');
      idx = (idx + 1) % imgs.length;
      imgs[idx].classList.add('is-shown');
    }, 3600);
  }

  /* ── Mapbox globe (reuses the site's token; SVG wireframe fallback) ── */
  var MAPBOX_TOKEN = 'pk.eyJ1IjoiaG13aGVlbGUiLCJhIjoiY21yZXpzMzk3MHQ4NDJ3b282YmQzZzFoYyJ9.eMJQn_b6U2Fl3uD4IOEJnw';
  /* The sabbatical itinerary, in travel order — the same list the about
     page's globe uses (story.js PLACES), starting from home in San
     Francisco and ending in Sydney. Keep the two in sync. */
  var GLOBE_PLACES = [
    { lng: -122.4194, lat:  37.7749, t: 'San Francisco' },
    { lng:  139.6503, lat:  35.6762, t: 'Tokyo' },
    { lng:  135.7681, lat:  35.0116, t: 'Kyoto' },
    { lng:  129.0756, lat:  35.1796, t: 'Busan' },
    { lng:  126.9780, lat:  37.5665, t: 'Seoul' },
    { lng:  126.5312, lat:  33.4996, t: 'Jeju' },
    { lng:  121.4737, lat:  31.2304, t: 'Shanghai' },
    { lng:  104.0668, lat:  30.5728, t: 'Chengdu' },
    { lng:  106.9123, lat:  29.4316, t: 'Chongqing' },
    { lng:  114.1694, lat:  22.3193, t: 'Hong Kong' },
    { lng:  121.5654, lat:  25.0330, t: 'Taipei' },
    { lng:  120.3014, lat:  22.6273, t: 'Kaohsiung' },
    { lng:  105.8342, lat:  21.0278, t: 'Hanoi' },
    { lng:  108.2022, lat:  16.0544, t: 'Da Nang' },
    { lng:  100.5018, lat:  13.7563, t: 'Bangkok' },
    { lng:  106.6297, lat:  10.8231, t: 'Ho Chi Minh City' },
    { lng:  103.8198, lat:   1.3521, t: 'Singapore' },
    { lng:  115.1889, lat:  -8.4095, t: 'Bali' },
    { lng:  151.2093, lat: -33.8688, t: 'Sydney' }
  ];
  var deckGlobeInited = false, deckGlobeMap = null;
  var globePins = [];    // {el, lng, lat} per city, for the rotate-out fade

  // The wireframe globe is hidden by default (so it never flashes on load);
  // reveal it only when Mapbox can't run.
  function showGlobeFallback(mount) {
    var svg = mount && mount.parentNode && mount.parentNode.querySelector('.deck-globe-svg');
    if (svg) svg.style.visibility = 'visible';
  }

  function initDeckGlobe(slide) {
    var mount = slide.querySelector('[data-globe]');
    if (!mount) return;
    if (deckGlobeInited) { if (deckGlobeMap) try { deckGlobeMap.resize(); } catch (e) {} return; }

    // Need WebGL; otherwise fall back to the wireframe.
    var gl2 = false, gl1 = false;
    try {
      var c = document.createElement('canvas');
      gl2 = !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
      gl1 = !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {}
    if (!gl2 && !gl1) { showGlobeFallback(mount); return; }
    deckGlobeInited = true;

    if (window.mapboxgl) { buildDeckGlobe(mount); return; }
    var ver = gl2 ? 'v3.9.3' : 'v2.15.0';   // v3 needs WebGL2; v2 covers WebGL1-only
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/' + ver + '/mapbox-gl.css';
    document.head.appendChild(link);
    var sc = document.createElement('script');
    sc.src = 'https://api.mapbox.com/mapbox-gl-js/' + ver + '/mapbox-gl.js';
    sc.async = true;
    sc.onerror = function () { showGlobeFallback(mount); };   // CDN blocked
    sc.onload = function () { buildDeckGlobe(mount); };
    document.head.appendChild(sc);
  }

  /* The globe shows the stops alone — no connecting trail between them.
     (The about page's globe still draws its flight-path arcs.) */

  function buildDeckGlobe(mount) {
    var mapboxgl = window.mapboxgl;
    if (!mapboxgl || !MAPBOX_TOKEN || MAPBOX_TOKEN.indexOf('pk.') !== 0) { showGlobeFallback(mount); return; }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    var map;
    try {
      map = new mapboxgl.Map({
        container: mount,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        center: [112, 16],   // opens on Asia, where most of the itinerary sits
        zoom: 1.45,
        interactive: false,
        antialias: true,
        fadeDuration: 0,
        renderWorldCopies: false,
        dragRotate: false
      });
    } catch (e) { showGlobeFallback(mount); return; }
    deckGlobeMap = map;
    map.on('error', function () {});
    // `style.load` fires reliably once the style JSON is parsed; the `load`
    // event can stall in globe projection while it waits on all tiles.
    var setup = function () {
      try {
        // No atmospheric glow: the sphere sits on the dark slide unhaloed.
        map.setFog({
          color: 'rgba(12, 14, 22, 0.9)', 'high-color': 'rgba(0, 0, 0, 0)',
          'horizon-blend': 0, 'space-color': 'rgba(0, 0, 0, 0)', 'star-intensity': 0
        });
      } catch (e) {}
      // hide the base style's place labels; keep borders
      try {
        map.getStyle().layers.forEach(function (l) {
          if (l.type === 'symbol') try { map.setLayoutProperty(l.id, 'visibility', 'none'); } catch (e) {}
        });
      } catch (e) {}
      /* Dots only — no city names. The marker is centred on its coordinate,
         since there's no label to sit to one side of it. */
      GLOBE_PLACES.forEach(function (p) {
        var pin = document.createElement('div');
        pin.className = 'deck-globe-pin';
        pin.innerHTML = '<span class="deck-globe-pin-dot"></span>';
        pin.setAttribute('aria-label', p.t);
        try {
          new mapboxgl.Marker({
            element: pin, anchor: 'center', opacityWhenCovered: '0'
          }).setLngLat([p.lng, p.lat]).addTo(map);
          globePins.push({ el: pin, lng: p.lng, lat: p.lat });
        } catch (e) {}
      });
      // real globe is up → hide the wireframe fallback (visibility, not
      // display, so it keeps defining the container's square height)
      var svg = mount.parentNode.querySelector('.deck-globe-svg');
      if (svg) svg.style.visibility = 'hidden';
      mount.parentNode.classList.add('has-globe');
      spinDeckGlobe(map, mount);
    };
    if (map.isStyleLoaded && map.isStyleLoaded()) setup();
    else map.on('style.load', setup);
  }

  /* Fade each label out as its city rotates toward the limb. The measure is
     the angle between the city and the point facing the camera: 1 dead
     centre, 0 at the edge of the visible hemisphere. Mapbox's
     opacityWhenCovered only cuts labels once they're fully round the back,
     which pops — this eases them out before they get there. */
  var FADE_OUT = 0.42, FADE_IN = 0.72;   // cos of the angle from centre
  function updateGlobePinFade(map) {
    if (!globePins.length) return;
    var c;
    try { c = map.getCenter(); } catch (e) { return; }
    var rad = Math.PI / 180;
    var clat = c.lat * rad, clng = c.lng * rad;
    var sinC = Math.sin(clat), cosC = Math.cos(clat);
    globePins.forEach(function (p) {
      var lat = p.lat * rad;
      var cosGamma = sinC * Math.sin(lat) + cosC * Math.cos(lat) * Math.cos(p.lng * rad - clng);
      var t = (cosGamma - FADE_OUT) / (FADE_IN - FADE_OUT);
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      p.el.style.opacity = (t * t * (3 - 2 * t)).toFixed(3);   // smoothstep
    });
  }

  // Slow auto-spin, paused when the slide isn't the active one.
  function spinDeckGlobe(map, mount) {
    var slide = mount.closest('.deck-slide');
    updateGlobePinFade(map);
    if (reduce) return;
    var last = null;
    (function frame(ts) {
      if (last === null) last = ts;
      var dt = Math.min(64, ts - last); last = ts;
      if (slide && slide.classList.contains('is-active') && !document.hidden) {
        try { var ctr = map.getCenter(); ctr.lng += dt * 0.0016; map.setCenter(ctr); } catch (e) {}
        updateGlobePinFade(map);
      }
      requestAnimationFrame(frame);
    })(0);
  }

  // "About / personal" slide — bullet facts on the left, globe on the right.
  function slidePlaces() {
    var facts = [
      '🏙️ Born in Milwaukee',
      '🏈 Former D1 athlete',
      '✈️ One-year sabbatical in Asia',
      '📷 Avid photographer and drone lover',
      '🐱 I have a pet cat, Luna'
    ];
    return el('section.deck-slide.deck-slide--places.deck-slide--split', { 'data-label': 'About' }, [
      el('div.deck-split-copy', null, [
        el('h2.deck-title', null, ['About']),
        el('ul.deck-facts', null, facts.map(function (f) { return el('li', null, [f]); }))
      ]),
      // The portrait rides over from the previous slide (same [data-shared]
      // key, so the swap cuts and it stays put), then slides off to the
      // right as the globe arrives underneath it.
      el('div.deck-places-media', null, [globeGraphic(), portraitCard()].filter(Boolean))
    ]);
  }

  function slideTimeline() {
    var groups = $$('.timeline-group');
    if (!groups.length) return null;
    var rows = groups.map(function (g) {
      var year = (g.querySelector('.timeline-year') || {}).textContent || '';
      var logoImg = g.querySelector('.timeline-logo img');
      var name = g.querySelector('strong');
      var role = g.querySelector('em');
      var logoWrap = el('span.deck-tl-logo');
      if (logoImg) logoWrap.appendChild(el('img', {
        src: logoImg.getAttribute('src'), alt: '', loading: 'lazy'
      }));
      return el('div.deck-tl-row', null, [
        el('span.deck-tl-year', null, [year.trim()]),
        logoWrap,
        el('span', null, [
          el('span.deck-tl-name', null, [name ? name.textContent.trim() : '']),
          document.createTextNode('  '),
          el('span.deck-tl-role', null, [role ? '— ' + role.textContent.trim() : ''])
        ])
      ]);
    });
    return el('section.deck-slide.deck-slide--timeline', { 'data-label': 'Career' }, [
      el('h2.deck-title', null, ['A decade leading design']),
      el('div.deck-timeline', null, rows)
    ]);
  }

  function slideWork() {
    // Case studies kept off the deck's work list (still on the normal site).
    var SKIP = ['base'];
    var cards = $$('#leadership .card-grid .card').filter(function (c) {
      return SKIP.indexOf(c.getAttribute('data-cs') || '') < 0;
    });
    if (!cards.length) return null;
    /* Deck-only studies have no card on the site, so they're appended here.
       `{ deckOnly: key }` stands in for the card element. */
    var entries = cards.concat([{ deckOnly: 'accelerate' }]);
    var items = entries.map(function (c, i) {
      var num = (i < 9 ? '0' : '') + (i + 1);
      if (c.deckOnly) {
        return el('li.deck-work-item', null, [
          el('a.deck-work-link', {
            href: '#present=cs.' + c.deckOnly + '.0',
            'data-cs-key': c.deckOnly,
            'aria-label': DECK_ONLY_STUDIES[c.deckOnly].title + ' — present as slides'
          }, [
            el('span.deck-work-num', { 'aria-hidden': 'true' }, [num]),
            el('span.deck-work-title', null, [DECK_ONLY_STUDIES[c.deckOnly].title]),
            el('span.deck-work-arrow', {
              'aria-hidden': 'true',
              html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
            })
          ])
        ]);
      }
      var title = c.querySelector('h3');
      var label = title ? title.textContent.trim() : 'Case study';
      // Carry the case-study key so a click opens it as its own deck.
      return el('li.deck-work-item', null, [
        el('a.deck-work-link', {
          href: c.getAttribute('href') || '#',
          'data-cs-key': c.getAttribute('data-cs') || '',
          'aria-label': label + ' — present as slides'
        }, [
          el('span.deck-work-num', { 'aria-hidden': 'true' }, [num]),
          el('span.deck-work-title', null, [label]),
          el('span.deck-work-arrow', {
            'aria-hidden': 'true',
            html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
          })
        ])
      ]);
    });
    return el('section.deck-slide.deck-slide--work', { 'data-label': 'Work' }, [
      el('div.deck-work-split', null, [
        el('div.deck-work-head', null, [el('h2.deck-title', null, ['Select work'])]),
        el('ol.deck-work-list', null, items)
      ])
    ]);
  }

  function slideLeadcraft() {
    var sec = $('.leadcraft-section');
    if (!sec) return null;
    return el('section.deck-slide.deck-slide--leadcraft', { 'data-label': 'LeadCraft' }, [
      el('p.deck-eyebrow', null, [text('.leadcraft-section .eyebrow') || 'Now building']),
      el('h2.deck-title', null, [text('.leadcraft-section h2') || 'LeadCraft']),
      el('p.deck-body', null, [text('.leadcraft-section .head-sub')])
    ]);
  }

  function slidePodcast() {
    var overlay = $('.podcast-overlay');
    if (!overlay) return null;
    // Guest wall sits on the right and fades left, toward the copy.
    var imgs = $$('.podcast-guests img').slice(0, 27);
    var wall = null;
    if (imgs.length) {
      var rowCount = 3;
      var perRow = Math.ceil(imgs.length / rowCount);
      var mkRow = function (list) {
        var make = function (im) {
          return el('img', { src: im.getAttribute('src'), alt: '', loading: 'lazy' });
        };
        // The set is duplicated so the marquee can loop seamlessly: by the
        // time it has drifted -50%, the copy sits exactly where the
        // original started.
        return el('div.deck-guest-row', null, list.map(make).concat(list.map(make)));
      };
      var rows = [];
      for (var r = 0; r < rowCount; r++) {
        var slice = imgs.slice(r * perRow, (r + 1) * perRow);
        if (slice.length) rows.push(mkRow(slice));
      }
      wall = el('div.deck-guest-wall', { 'aria-hidden': 'true' }, rows);
    }
    var kids = [];
    if (wall) kids.push(wall);
    kids.push(el('h2.deck-title', null, ['Technically Speaking']));
    kids.push(el('p.deck-body', null, [text('.podcast-overlay .head-sub')]));
    kids.push(el('div.deck-actions', null, [
      el('a.deck-btn.deck-btn--primary', {
        href: 'https://technicallyspeakinghw.com', target: '_blank', rel: 'noopener',
        html: 'Listen now' + extIcon()
      })
    ]));
    return el('section.deck-slide.deck-slide--podcast', { 'data-label': 'Podcast' }, kids);
  }

  function slideCommunity() {
    var groups = $$('.community-groups .cg-group');
    if (!groups.length) return null;
    var cols = groups.map(function (g) {
      var label = g.querySelector('.cg-label');
      var items = $$('.cg-item', g).slice(0, 4).map(function (it) {
        return el('li', null, [it.textContent.trim()]);
      });
      return el('div.deck-col', null, [
        el('p.deck-col-label', null, [label ? label.textContent.trim() : '']),
        el('ul', null, items)
      ]);
    });
    return el('section.deck-slide.deck-slide--community', { 'data-label': 'Community' }, [
      el('p.deck-eyebrow', null, ['Community']),
      el('h2.deck-title', null, ['Talks, writing & events']),
      el('div.deck-cols', null, cols)
    ]);
  }

  /* The site's outbound-link glyph, same as the home page's ghost button. */
  function extLinkIcon() {
    return sEl('svg', {
      class: 'deck-btn-ext', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      'stroke-width': '2.4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true'
    }, [
      sEl('path', { d: 'M7 7h10v10' }),
      sEl('path', { d: 'M7 17 17 7' })
    ]);
  }

  function slideCTA() {
    return el('section.deck-slide.deck-slide--cta', { 'data-label': 'Contact' }, [
      el('h2.deck-title', null, [text('.cta-section h2') || "Let's work together"]),
      el('div.deck-actions', null, [
        el('a.deck-btn.deck-btn--primary', { href: 'mailto:hello@harrisonwheeler.com' }, ['Get in touch']),
        el('a.deck-btn.deck-btn--ghost', {
          href: 'https://www.linkedin.com/in/hmwheeler', target: '_blank', rel: 'noopener'
        }, ['Connect on LinkedIn', extLinkIcon()])
      ])
    ]);
  }

  /* ── Framework diagrams (themed re-creations, SVG) ─────────────────── */
  function dgmBox(x, y, w, h, t, cls) {
    return sEl('g', null, [
      sEl('rect', { x: x, y: y, width: w, height: h, rx: 5, fill: 'var(--dgm-node)', stroke: 'var(--dgm-node-bd)', 'stroke-width': 1 }),
      sEl('text', { x: x + w / 2, y: y + h / 2 + 4, 'text-anchor': 'middle', class: cls || 'dgm-box-lbl', text: t })
    ]);
  }

  // Hierarchy tree: one root → four lettered circle nodes with captions.
  // The four LMS product areas, shared by the org tree and the pod slides so
  // the names never drift apart.
  var LMS_AREAS = [
    { ab: 'GR',  cap: 'Campaign Manager Growth' },
    { ab: 'AFP', cap: 'Ad Formats & Placements' },
    { ab: 'AUD', cap: 'Measurement & Audiences' },
    { ab: 'R&O', cap: 'Relevance & Optimization' }
  ];

  function diagramTree(highlight) {
    var W = 500, H = 300, cx = 250, junc = 60, r = 34, ncy = 158;
    var xs = [66, 194, 322, 450];
    var nodes = LMS_AREAS.map(function (a, i) {
      return { x: xs[i], ab: a.ab, cap: a.cap };
    });
    var defs = sEl('defs', null, [vizNoiseFilter()]);
    var k = [];
    // optional spotlight behind one branch — used for the pilot team
    if (highlight != null) {
      var hn = nodes[highlight];
      k.push(sEl('rect', {
        x: hn.x - 62, y: 40, width: 124, height: 216, rx: 16,
        fill: 'rgba(208, 188, 255, 0.10)', stroke: 'var(--dgm-node-bd)', 'stroke-width': 1
      }));
      k.push(sEl('text', { x: hn.x, y: 62, 'text-anchor': 'middle', class: 'dgm-node-lbl', text: 'Pilot team' }));
    }
    k.push(sEl('path', { d: 'M' + cx + ',18 V' + junc, fill: 'none', stroke: 'var(--dgm-line)', 'stroke-width': 2, 'stroke-linecap': 'round' }));
    nodes.forEach(function (n) {
      k.push(sEl('path', { d: 'M' + cx + ',' + junc + ' C' + cx + ',' + (junc + 46) + ' ' + n.x + ',' + (ncy - r - 46) + ' ' + n.x + ',' + (ncy - r), fill: 'none', stroke: 'var(--dgm-line)', 'stroke-width': 2 }));
      k.push(sEl('circle', { cx: n.x, cy: ncy, r: r, fill: 'rgba(255, 216, 228, 0.16)', stroke: '#ffd8e4', 'stroke-width': 1.5 }));
      var nz = vizNoise({ tag: 'circle', cx: n.x, cy: ncy, r: r }, { opacity: '0.4' });
      nz.defs.forEach(function (d) { defs.appendChild(d); });
      k.push(nz.layer);
      k.push(sEl('text', { x: n.x, y: ncy + 5, 'text-anchor': 'middle', class: 'dgm-node-lbl', text: n.ab }));
      var w = n.cap.split(' '), m = Math.ceil(w.length / 2);
      k.push(sEl('text', { x: n.x, y: ncy + r + 22, 'text-anchor': 'middle', class: 'dgm-cap', text: w.slice(0, m).join(' ') }));
      k.push(sEl('text', { x: n.x, y: ncy + r + 36, 'text-anchor': 'middle', class: 'dgm-cap', text: w.slice(m).join(' ') }));
    });
    k.unshift(defs);
    return svgRoot(W, H, k);
  }

  // Hub & spokes: themes → Pods hub → deliverables.
  function diagramPods() {
    var W = 560, H = 330, cx = 280, hubY = 168, hubR = 34;
    // evenly spaced, no collisions. The bottom row spans wider (5 chips)
    // than the top (4), so its chips are a little narrower.
    var TOP_W = 118, TOP_GAP = 18, BOT_W = 100, BOT_GAP = 10;
    var topStart = (W - (4 * TOP_W + 3 * TOP_GAP)) / 2 + TOP_W / 2;
    var botStart = (W - (5 * BOT_W + 4 * BOT_GAP)) / 2 + BOT_W / 2;
    var top = ['Initiative', 'JTBD', 'Surface', 'Customer'].map(function (t, i) {
      return { x: topStart + i * (TOP_W + TOP_GAP), t: t };
    });
    var bot = ['KPI', 'Data', 'Research', 'Narrative', 'Success'].map(function (t, i) {
      return { x: botStart + i * (BOT_W + BOT_GAP), t: t };
    });
    var k = [];
    top.forEach(function (b) {
      k.push(sEl('path', { d: 'M' + b.x + ',48 C' + b.x + ',108 ' + cx + ',108 ' + cx + ',' + (hubY - hubR), fill: 'none', stroke: 'var(--dgm-line)', 'stroke-width': 2 }));
      k.push(dgmBox(b.x - TOP_W / 2, 18, TOP_W, 30, b.t));
    });
    bot.forEach(function (b) {
      k.push(sEl('path', { d: 'M' + cx + ',' + (hubY + hubR) + ' C' + cx + ',250 ' + b.x + ',250 ' + b.x + ',282', fill: 'none', stroke: 'var(--dgm-line)', 'stroke-width': 2 }));
      k.push(dgmBox(b.x - BOT_W / 2, 282, BOT_W, 30, b.t));
    });
    var hubDefs = sEl('defs', null, [vizNoiseFilter()]);
    podGlyph(k, hubDefs, cx, hubY, hubR);
    k.push(sEl('text', { x: cx + hubR + 10, y: hubY + 5, 'text-anchor': 'start', class: 'dgm-node-lbl', text: 'Pods' }));
    k.unshift(hubDefs);
    return svgRoot(W, H, k);
  }

  /* A stack of plates seen in three-quarter view. Layers land bottom-up
     each time the slide activates (see .v-plate in deck.css). */
  /* Plate geometry for a stack, shared by the full-size stack diagram and
     the small per-pod stacks on the Pods case study. */
  function stackPlates(o) {
    var N = o.count, cx = o.cx, TW = o.TW, BW = o.BW, depth = o.depth, step = o.step, yTop = o.yTop;
    var k = [];
    // draw bottom-up so upper plates overlap the ones beneath
    for (var i = N - 1; i >= 0; i--) {
      var y = yTop + i * step;
      var pts = [
        [cx - TW / 2, y], [cx + TW / 2, y],
        [cx + BW / 2, y + depth], [cx - BW / 2, y + depth]
      ].map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
      // top plate reads brightest; the stack recedes beneath it
      var t = i / (N - 1);
      var fill = i === 0 ? 'rgba(208,188,255,0.30)'
                         : 'rgba(160,145,240,' + (0.20 - t * 0.10).toFixed(3) + ')';
      k.push(sEl('polygon', {
        points: pts, fill: fill, stroke: 'var(--dgm-node-bd)', 'stroke-width': 1.25,
        'stroke-linejoin': 'round', class: 'v-plate',
        style: 'transition-delay:' + ((N - 1 - i) * 0.055).toFixed(3) + 's'
      }));
    }
    return k;
  }

  function diagramStack(opts) {
    opts = opts || {};
    return svgRoot(760, 540, stackPlates({
      count: opts.count || 12, cx: 380, TW: 300, BW: 560, depth: 92, step: 30, yTop: 56
    }));
  }

  function slideStack() {
    var bullets = [
      'Every surface shipped on the same foundation',
      'One system, layered — not a pile of one-offs',
      'Each release compounds on the one beneath it',
      'The stack is the strategy'
    ];
    return el('section.deck-slide.deck-slide--diagram-full.deck-slide--vizsplit', { 'data-label': 'Foundation' }, [
      el('h2.deck-title', null, ['Building the stack']),
      el('div.deck-vizsplit', null, [
        el('div.deck-vizsplit-copy', null, [
          el('ul.deck-facts', null, bullets.map(function (b) { return el('li', null, [b]); }))
        ]),
        el('div.deck-vizsplit-chart', null, [diagramStack({ count: 12 })])
      ])
    ]);
  }

  /* ── Headline stats: "Metrics" in one column, the figures stacked in the
     other. `dir` draws the ▲/▼ delta marker. ───────────────────────── */
  var STAT_HERO = [
    { value: '47%',  dir: 'down', label: 'Project reduction' },
    { value: '88',   dir: 'up',   label: 'Team morale was at an all time high.' },
    { value: '100%', dir: 'up',   label: 'Shipping velocity' }
  ];

  /* ── Full-bleed statement: one large paragraph, nothing else. ─────── */
  var STATEMENT = "A Q3 deadline for the company's flagship AI product met a team " +
    'running on empty and a system of work that was already broken. ' +
    'Pace was about to compound the problem.';

  function slideStatement() {
    return el('section.deck-slide.deck-slide--statement', { 'data-label': 'Context' }, [
      el('p.deck-statement', null, [STATEMENT])
    ]);
  }

  function slideStatHero() {
    return el('section.deck-slide.deck-slide--statfigs', { 'data-label': 'Results' }, [
      el('div.deck-statfigs-split', null, [
        el('div.deck-statfigs-head', null, [el('h2.deck-title', null, ['Results'])]),
        el('div.deck-statfigs', null, STAT_HERO.map(function (s) {
          return el('div.deck-statfig', null, [
            el('div.deck-statfig-num', null, [
              el('span.deck-statfig-val', null, [s.value]),
              el('span.deck-statfig-dir', { 'data-dir': s.dir, 'aria-hidden': 'true' },
                 [s.dir === 'down' ? '▼' : '▲'])
            ]),
            el('div.deck-statfig-label', null, [s.label])
          ]);
        }))
      ])
    ]);
  }

  // Roadmap chevron with callouts.
  function diagramRoadmap() {
    var W = 1200, H = 520, y = 300, h = 24, n = 5, pad = 20, notch = 14, x0 = pad;
    var segW = (W - pad * 2) / n;
    var top = y - h / 2, bot = y + h / 2;
    var shades = ['#39334e', '#463f68', '#544c86', '#6459a6', '#7568c4'];
    var k = [];
    // The bar grows in behind a clip that wipes left→right.
    var bars = [];
    for (var i = 0; i < n; i++) {
      var x = x0 + i * segW;
      var pts = i === 0
        ? [[x, top], [x + segW - notch, top], [x + segW, y], [x + segW - notch, bot], [x, bot]]
        : [[x, top], [x + segW - notch, top], [x + segW, y], [x + segW - notch, bot], [x, bot], [x + notch, y]];
      bars.push(sEl('polygon', { points: pts.map(function (p) { return p.join(','); }).join(' '), fill: shades[i] }));
    }
    k.push(sEl('defs', null, [
      sEl('clipPath', { id: 'dgm-roadmap-clip' }, [
        sEl('rect', { x: x0, y: top - 4, width: W - pad * 2, height: h + 8, class: 'dgm-grow-rect' })
      ])
    ]));
    k.push(sEl('g', { 'clip-path': 'url(#dgm-roadmap-clip)' }, bars));
    // Beta marker sits above the timeline bar, at its start.
    k.push(sEl('text', { x: x0 + 2, y: top - 14, 'text-anchor': 'start', class: 'dgm-chev-lbl', text: "Beta · Feb '24" }));

    var callouts = [
      { title: 'Live Event Format', below: true, bx: 40, bw: 300, dotX: 200,
        bullets: ['Accelerated Pacing +', 'Pre, During, Post experiences ++', 'Retarget Live Event viewers', 'Day Parting on campaigns'] },
      { title: 'Elevate Event Organizers & Marketers', below: false, bx: 330, bw: 360, dotX: 480,
        bullets: ['Regional events, External links', 'Sync Leads and Registrants', 'Events API and Onboarding', 'Optimization by Objective', 'Umbrella events (series & session)'] },
      { title: 'Full Funnel Analytics', below: true, bx: 640, bw: 320, dotX: 770,
        bullets: ['Organic vs Paid Funnel', 'Analytics by Event Stage', 'Viewership by depth & demography', 'Buyer Intent funnel', 'CRM sync (two way)'] },
      { title: 'Elevate Attendee Experience', below: false, bx: 880, bw: 300, dotX: 1030,
        bullets: ['Stay connected to Brand', 'Networking 2.0', 'Day of the Event experience', 'Recap and Saved Content'] }
    ];
    var lineH = 23, titleH = 36, padY = 14, gap = 48;
    callouts.forEach(function (c) {
      var boxH = titleH + c.bullets.length * lineH + padY;
      var boxTop = c.below ? (bot + gap) : (top - gap - boxH);
      // no box — plain text connected to the chevron by a line
      k.push(sEl('line', { x1: c.dotX, y1: c.below ? bot : top, x2: c.dotX, y2: c.below ? boxTop : boxTop + boxH, stroke: 'var(--dgm-line)', 'stroke-width': 1.5 }));
      k.push(sEl('circle', { cx: c.dotX, cy: y, r: 4, fill: 'var(--dgm-ink)' }));
      k.push(sEl('text', { x: c.bx + 2, y: boxTop + 14, 'text-anchor': 'start', class: 'dgm-callout-title', text: c.title }));
      c.bullets.forEach(function (b, bi) {
        k.push(sEl('text', { x: c.bx + 4, y: boxTop + titleH + 8 + bi * lineH, 'text-anchor': 'start', class: 'dgm-callout-item', text: '·  ' + b }));
      });
    });
    return svgRoot(W, H, k);
  }

  /* Shared grain texture for large surfaces (venn lobes, swimlanes,
     areas). Returns [defs, layer] — append both. The noise is densest at
     the shape's rim and fades to nothing toward its centre. */
  var noiseSeq = 0;
  function vizNoise(shape, opts) {
    opts = opts || {};
    var id = 'v-noise-' + (++noiseSeq);
    var fade = opts.fadeFrom || '38%';
    // linear fade (top→bottom) for flat/rectangular surfaces; radial for discs
    var grad = opts.linear
      ? sEl('linearGradient', { id: id + '-g', gradientUnits: 'userSpaceOnUse',
          x1: shape.x, y1: shape.y, x2: shape.x, y2: shape.y + shape.height }, [
          sEl('stop', { offset: '0%', 'stop-color': '#fff' }),
          sEl('stop', { offset: '100%', 'stop-color': '#000' })
        ])
      : shape.tag === 'circle'
      ? sEl('radialGradient', { id: id + '-g', gradientUnits: 'userSpaceOnUse', cx: shape.cx, cy: shape.cy, r: shape.r }, [
          sEl('stop', { offset: '0%', 'stop-color': '#000' }),
          sEl('stop', { offset: fade, 'stop-color': '#000' }),
          sEl('stop', { offset: '100%', 'stop-color': '#fff' })
        ])
      : sEl('radialGradient', { id: id + '-g', gradientUnits: 'userSpaceOnUse',
          cx: shape.x + shape.width / 2, cy: shape.y + shape.height / 2,
          r: Math.max(shape.width, shape.height) * 0.62 }, [
          sEl('stop', { offset: '0%', 'stop-color': '#000' }),
          sEl('stop', { offset: fade, 'stop-color': '#000' }),
          sEl('stop', { offset: '100%', 'stop-color': '#fff' })
        ]);
    var maskShape = shape.tag === 'circle'
      ? sEl('circle', { cx: shape.cx, cy: shape.cy, r: shape.r, fill: 'url(#' + id + '-g)' })
      : sEl('rect', { x: shape.x, y: shape.y, width: shape.width, height: shape.height, rx: shape.rx || 0, fill: 'url(#' + id + '-g)' });
    var body = shape.tag === 'circle'
      ? sEl('circle', { cx: shape.cx, cy: shape.cy, r: shape.r, filter: 'url(#v-noise-filter)', opacity: opts.opacity || '0.42' })
      : sEl('rect', { x: shape.x, y: shape.y, width: shape.width, height: shape.height, rx: shape.rx || 0, filter: 'url(#v-noise-filter)', opacity: opts.opacity || '0.42' });
    return {
      defs: [grad, sEl('mask', { id: id }, [maskShape])],
      layer: sEl('g', { mask: 'url(#' + id + ')' }, [body])
    };
  }
  // one shared turbulence filter for every noise surface
  function vizNoiseFilter() {
    return sEl('filter', { id: 'v-noise-filter', x: '-20%', y: '-20%', width: '140%', height: '140%' }, [
      sEl('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.85', numOctaves: '3', stitchTiles: 'stitch', result: 'n' }),
      sEl('feColorMatrix', { in: 'n', type: 'saturate', values: '0' })
    ]);
  }

  /* 90-day retention curve: the cohort decays hard in the first 90 days,
     and what's left past day 90 (the >$10k spenders) holds. */
  /* Sankey-style cohort flow: one bar per stage, ribbons carrying the
     volume between them, with the churn peeling off downward. */
  function diagramSankey() {
    var W = 900, H = 520, padT = 76, padB = 54, colW = 66;
    var plotH = H - padT - padB;
    var stages = [
      { x: 40,  label: 'DAY 0',    pct: 100, note: 'Signed up' },
      { x: 300, label: 'DAY 30',   pct: 45,  note: 'Still active' },
      { x: 560, label: 'DAY 90',   pct: 20,  note: 'Still active' },
      { x: 820, label: 'DAY 180+', pct: 18,  note: '$10K+ · retained' }
    ];
    var h = function (pct) { return (pct / 100) * plotH; };
    var defs = sEl('defs', null, [vizNoiseFilter()]);
    var k = [];

    // ribbons between consecutive stages: the surviving band stays at the
    // top, the churn splays away beneath it
    for (var i = 0; i < stages.length - 1; i++) {
      var a = stages[i], b = stages[i + 1];
      var x1 = a.x + colW, x2 = b.x, mid = (x1 + x2) / 2;
      var aTop = padT, bTop = padT;
      var keepA = padT + h(b.pct), keepB = padT + h(b.pct);
      // surviving flow
      k.push(sEl('path', {
        d: 'M' + x1 + ',' + aTop + ' C' + mid + ',' + aTop + ' ' + mid + ',' + bTop + ' ' + x2 + ',' + bTop +
           ' L' + x2 + ',' + keepB + ' C' + mid + ',' + keepB + ' ' + mid + ',' + keepA + ' ' + x1 + ',' + keepA + ' Z',
        fill: 'rgba(160,145,240,0.34)', class: 'v-flow', style: 'transition-delay:' + (i * 0.14) + 's'
      }));
      // churn peeling off
      var chA = padT + h(a.pct), chB = padT + h(b.pct) + 26;
      k.push(sEl('path', {
        d: 'M' + x1 + ',' + keepA + ' C' + mid + ',' + keepA + ' ' + mid + ',' + chB + ' ' + x2 + ',' + chB +
           ' L' + x2 + ',' + (chB + (chA - keepA) * 0.5) + ' C' + mid + ',' + (chB + (chA - keepA) * 0.5) + ' ' + mid + ',' + chA + ' ' + x1 + ',' + chA + ' Z',
        fill: 'rgba(255,216,228,0.13)', class: 'v-flow', style: 'transition-delay:' + (i * 0.14 + 0.05) + 's'
      }));
    }

    // stage bars
    stages.forEach(function (s, i) {
      var bh = h(s.pct);
      var isLast = i === stages.length - 1;
      k.push(sEl('rect', {
        x: s.x, y: padT, width: colW, height: bh, rx: 4,
        fill: isLast ? 'var(--v-green)' : 'var(--v-p3)', class: 'v-bar',
        style: 'transition-delay:' + (i * 0.14) + 's'
      }));
      var nz = vizNoise({ tag: 'rect', x: s.x, y: padT, width: colW, height: bh }, { opacity: '0.22', linear: true });
      nz.defs.forEach(function (d) { defs.appendChild(d); });
      k.push(nz.layer);
      // header: stage name + the number
      k.push(sEl('text', { x: s.x, y: padT - 40, 'text-anchor': 'start', class: 'v-micro', text: s.label }));
      k.push(sEl('text', { x: s.x, y: padT - 14, 'text-anchor': 'start', class: 'v-head',
        fill: isLast ? 'var(--v-green)' : 'var(--v-ink)', text: s.pct + '%' }));
      k.push(sEl('text', { x: s.x, y: padT + bh + 20, 'text-anchor': 'start', class: 'v-micro', text: s.note }));
    });

    // the headline drop
    k.push(sEl('text', { x: 300, y: H - 18, 'text-anchor': 'start', class: 'v-node', fill: 'var(--v-pink)',
      text: '80% churn before day 90' }));
    k.unshift(defs);
    return svgRoot(W, H, k);
  }

  function diagramRetention() {
    var W = 760, H = 470, padL = 64, padR = 34, padT = 34, padB = 62;
    var pw = W - padL - padR, ph = H - padT - padB;
    var x = function (d) { return padL + (d / 180) * pw; };
    var y = function (p) { return padT + (1 - p / 100) * ph; };
    var day90 = x(90), k = [];
    var defs = sEl('defs', null, [vizNoiseFilter()]);

    // gridlines + y ticks
    [0, 20, 40, 60, 80, 100].forEach(function (p) {
      k.push(sEl('line', { x1: padL, y1: y(p), x2: W - padR, y2: y(p), class: 'v-connector-thin', opacity: p === 0 ? 1 : 0.35 }));
      k.push(sEl('text', { x: padL - 12, y: y(p) + 4, 'text-anchor': 'end', class: 'v-micro', text: p + '%' }));
    });

    // decay curve: 100% → 20% by day 90, then flat
    var curve = 'M' + x(0) + ',' + y(100) +
      ' C' + x(18) + ',' + y(62) + ' ' + x(38) + ',' + y(34) + ' ' + x(62) + ',' + y(24) +
      ' S' + x(80) + ',' + y(20) + ' ' + day90 + ',' + y(20);
    var tail = ' L' + x(180) + ',' + y(20);

    // shaded area under the decay, with grain
    var area = curve + tail + ' L' + x(180) + ',' + y(0) + ' L' + x(0) + ',' + y(0) + ' Z';
    k.push(sEl('path', { d: area, fill: 'var(--v-fill-2)', stroke: 'none' }));
    var n = vizNoise({ tag: 'rect', x: padL, y: padT, width: pw, height: ph }, { opacity: '0.3', fadeFrom: '20%' });
    n.defs.forEach(function (d) { defs.appendChild(d); });
    k.push(n.layer);

    // retained band past day 90 (green)
    k.push(sEl('rect', { x: day90, y: y(20), width: x(180) - day90, height: y(0) - y(20), fill: 'rgba(185,242,200,0.16)' }));
    k.push(sEl('path', { d: 'M' + day90 + ',' + y(20) + ' L' + x(180) + ',' + y(20), fill: 'none', stroke: 'var(--v-green)', 'stroke-width': 2.5, 'stroke-linecap': 'round' }));

    // the decay line itself
    k.push(sEl('path', { d: curve, fill: 'none', stroke: 'var(--v-p2)', 'stroke-width': 2.5, 'stroke-linecap': 'round', class: 'dgm-grow-path' }));

    // day-90 marker
    k.push(sEl('line', { x1: day90, y1: padT, x2: day90, y2: y(0), class: 'v-connector-dash' }));
    k.push(sEl('circle', { cx: day90, cy: y(20), r: 6, fill: 'var(--v-green)' }));

    // callouts
    k.push(sEl('text', { x: x(30), y: y(72), 'text-anchor': 'start', class: 'v-head', fill: 'var(--v-pink)', text: '80% churn' }));
    k.push(sEl('text', { x: x(30), y: y(72) + 20, 'text-anchor': 'start', class: 'v-micro', text: 'IN THE FIRST 90 DAYS' }));
    k.push(sEl('text', { x: day90 + 16, y: y(34), 'text-anchor': 'start', class: 'v-node', fill: 'var(--v-green)', text: '20% retained' }));
    k.push(sEl('text', { x: day90 + 16, y: y(34) + 18, 'text-anchor': 'start', class: 'v-micro', text: '$10K+ SPEND · STAY' }));

    // x axis
    [{ d: 0, t: 'DAY 0' }, { d: 90, t: 'DAY 90' }, { d: 180, t: 'DAY 180+' }].forEach(function (t) {
      k.push(sEl('text', { x: x(t.d), y: H - 28, 'text-anchor': 'middle', class: 'v-micro', text: t.t }));
    });
    k.unshift(defs);
    return svgRoot(W, H, k);
  }

  function slideRetention() {
    var bullets = [
      '80% of new customers churn inside the first 90 days',
      'Time-to-value, not price, drives the drop-off',
      'Past day 90, retention holds — spend compounds',
      'Customers over $10K/yr renew at a materially higher rate',
      'So: the first 90 days are the whole growth problem'
    ];
    return el('section.deck-slide.deck-slide--diagram-full.deck-slide--vizsplit', { 'data-label': 'Retention' }, [
      el('h2.deck-title', null, ['The first 90 days']),
      el('div.deck-vizsplit', null, [
        el('div.deck-vizsplit-copy', null, [
          el('ul.deck-facts', null, bullets.map(function (b) { return el('li', null, [b]); }))
        ]),
        el('div.deck-vizsplit-chart', null, [diagramSankey()])
      ])
    ]);
  }

  /* Three "how I work" cards — same copy + line-art illustrations as the
     about page's .about-card set (assets/illustrations has flat-grey
     standalone copies; these are drawn inline so they keep the
     pink→green gradient stroke). */
  var ABOUT_ILLOS = {
    plan: '<rect x="45" y="45" width="210" height="210"/><line x1="185" y1="45" x2="185" y2="255"/>' +
          '<line x1="115" y1="115" x2="115" y2="255"/><line x1="45" y1="185" x2="255" y2="185"/>' +
          '<line x1="115" y1="115" x2="255" y2="115"/>',
    rays: '<rect x="45" y="45" width="210" height="210"/><line x1="45" y1="255" x2="150" y2="45"/>' +
          '<line x1="45" y1="255" x2="255" y2="45"/><line x1="45" y1="255" x2="255" y2="150"/>' +
          '<path d="M45,135 A120 120 0 0 1 165,255"/>',
    globe: '<rect x="45" y="45" width="210" height="210"/><circle cx="150" cy="150" r="105"/>' +
           '<ellipse cx="150" cy="150" rx="52" ry="105"/><line x1="150" y1="45" x2="150" y2="255"/>' +
           '<line x1="45" y1="97.5" x2="255" y2="97.5"/><line x1="45" y1="150" x2="255" y2="150"/>' +
           '<line x1="45" y1="202.5" x2="255" y2="202.5"/>'
  };
  function aboutIllo(key) {
    var gid = 'deck-illo-' + key;
    var svg = '<svg class="deck-about-illo" viewBox="40 40 220 220" aria-hidden="true">' +
      '<defs><linearGradient id="' + gid + '" gradientUnits="userSpaceOnUse" x1="45" y1="255" x2="255" y2="45">' +
      '<stop offset="0" stop-color="#ffd8e4"/><stop offset=".5" stop-color="#b9f2c8"/>' +
      '<stop offset="1" stop-color="#ffffff"/></linearGradient></defs>' +
      '<g stroke="url(#' + gid + ')" stroke-width="1.5" fill="none">' + ABOUT_ILLOS[key] + '</g></svg>';
    return el('span.deck-about-illo-wrap', { html: svg });
  }

  function slideAboutCards() {
    var cards = [
      { illo: 'plan', h: 'Designing experiences, and the organizations that ship them',
        p: 'A decade leading design at LinkedIn and Zendesk taught me that quality starts upstream, in how teams, systems, and strategy fit together. I design the organization, not just the interface.' },
      { illo: 'rays', h: 'Empowering the people I work with',
        p: "The work I'm proudest of is the people. I lead by mentoring and coaching designers into leaders, building real relationships, and creating teams where everyone can do their best work." },
      { illo: 'globe', h: 'Building from curiosity',
        p: "Curiosity is the engine. Following it is how I've built LeadCraft, Facilitator, Dual Creator Cam, and the Technically Speaking podcast, and how it keeps opening new opportunities." }
    ];
    return el('section.deck-slide.deck-slide--aboutcards', { 'data-label': 'How I work' }, [
      el('div.deck-about-grid', null, cards.map(function (c) {
        return el('article.deck-about-card', null, [
          aboutIllo(c.illo),
          el('h3', null, [c.h]),
          el('p', null, [c.p])
        ]);
      }))
    ]);
  }

  /* How I lead: three principles, numbered, each with the reasoning under
     it. Same card grid as the About slide it follows. */
  var LEAD_PRINCIPLES = [
    { h: 'Through clarity and trust',
      p: 'A clear idea of what the goal is, plus transparency and communication, sets the tone for everything else.' },
    { h: 'Set the altitude and why',
      p: "However deep in the weeds I am, or however horizontally I'm thinking, I don't lose sight of what the motivation is." },
    { h: 'Give designers the room to grow',
      p: 'People need to understand their purpose and their role, then get the room to reach potential they have not tapped yet.' }
  ];

  function slideHowILead() {
    return el('section.deck-slide.deck-slide--aboutcards.deck-slide--lead', { 'data-label': 'How I lead' }, [
      el('h2.deck-title', null, ['How I lead']),
      /* The numeral is a sibling of the card, not a child: it has to paint
         *behind* the card's surface, and a child can't sit under its own
         parent's background. */
      el('div.deck-about-grid', null, LEAD_PRINCIPLES.map(function (c, i) {
        return el('div.deck-lead-cell', null, [
          el('span.deck-lead-num', { 'aria-hidden': 'true' }, [['I', 'II', 'III'][i]]),
          el('article.deck-about-card', null, [
            el('h3', null, [c.h]),
            el('p', null, [c.p])
          ])
        ]);
      }))
    ]);
  }

  /* Closing About slide: three rows of image placeholders drifting left
     behind a centred serif statement. Each row's tiles are duplicated so
     the -50% translate loops seamlessly; rows differ in speed/offset so
     the wall never reads as one solid block sliding. */
  var WALL_IMAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(function (n) {
    return 'assets/slide/5_introduction/' + n + '.jpg';
  });

  /* Deal the photos out in a fresh order each time the deck builds. There
     are more tiles than photos, so the pool refills with another shuffle
     rather than repeating the same run twice. */
  function shuffled(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function wallDealer() {
    var pool = [];
    return function () {
      if (!pool.length) pool = shuffled(WALL_IMAGES);
      return pool.pop();
    };
  }

  function slidePhotoWall() {
    var ROWS = [
      { n: 5, dur: 64, off: 0 },
      { n: 5, dur: 52, off: -140 },
      { n: 5, dur: 74, off: -60 }
    ];
    var deal = wallDealer();
    var rows = ROWS.map(function (r) {
      // one set of photos for the row; the wrap pass repeats it exactly so
      // the -50% loop lands on an identical frame
      var picks = [];
      for (var p = 0; p < r.n; p++) picks.push(deal());
      var tiles = [];
      for (var pass = 0; pass < 2; pass++) {
        for (var i = 0; i < r.n; i++) {
          tiles.push(el('span.deck-wall-tile', null, [
            el('img', { src: picks[i], alt: '', loading: 'lazy' })
          ]));
        }
      }
      var track = el('div.deck-wall-track', null, tiles);
      track.style.animationDuration = r.dur + 's';
      track.style.marginLeft = r.off + 'px';
      return el('div.deck-wall-row', null, [track]);
    });
    return el('section.deck-slide.deck-slide--photowall', { 'data-label': 'About' }, [
      el('div.deck-wall', { 'aria-hidden': 'true' }, rows),
      el('p.deck-statement.deck-wall-copy', null, [
        "I've led teams and experiences at the intersection of consumer and " +
        'enterprise, shaping how organizations and the people inside them do ' +
        'their best work, building from curiosity and making quality a ' +
        'business strategy.'
      ])
    ]);
  }

  // Product sitemap: three top-level surfaces, their sections and children.
  function diagramSitemap() {
    var k = [];
    var L1 = 70, H1 = 48, L2 = 174, H2 = 42, LEAF = 262, HL = 40, STEP = 50;
    var line = 'var(--dgm-line)';

    // rounded elbow: down from a stem, then right into a child's left edge
    function sideElbow(sx, fromY, toY, toX, stroke) {
      k.push(sEl('path', {
        d: 'M' + sx + ',' + fromY + ' V' + (toY - 10) + ' Q' + sx + ',' + toY + ' ' + (sx + 10) + ',' + toY + ' H' + toX,
        fill: 'none', stroke: stroke || line, 'stroke-width': 1.5
      }));
    }
    // rounded elbow: down from a parent, across, then down into a child's top
    function topElbow(px, py, cxx, cyy, stroke) {
      var midY = cyy - 22, dir = cxx > px ? 1 : -1;
      k.push(sEl('path', {
        d: 'M' + px + ',' + py + ' V' + (midY - 10) + ' Q' + px + ',' + midY + ' ' + (px + 10 * dir) + ',' + midY +
           ' H' + (cxx - 10 * dir) + ' Q' + cxx + ',' + midY + ' ' + cxx + ',' + (midY + 10) + ' V' + cyy,
        fill: 'none', stroke: stroke || line, 'stroke-width': 1.5
      }));
    }
    // `dy` is half the cap height of the label's size, so the text optically
    // centers. `ink` is an inline fill — inline style outranks the class rule,
    // which is how each family tints its own labels.
    function box(x, y, w, h, t, fill, stroke, cls, dy, ink) {
      k.push(sEl('rect', { x: x, y: y, width: w, height: h, rx: 6, fill: fill, stroke: stroke || 'none', 'stroke-width': 1 }));
      var a = { x: x + w / 2, y: y + h / 2 + (dy || 5), 'text-anchor': 'middle', class: cls, text: t };
      if (ink) a.style = 'fill:' + ink;
      k.push(sEl('text', a));
    }

    var F1 = 'rgba(122, 106, 214, 0.95)';                     // level 1
    var F2 = 'rgba(160, 145, 240, 0.42)';                     // level 2
    // leaves — the shared node tokens, same contrast as the tree diagram
    var F3 = 'var(--dgm-node)';
    var S3 = 'var(--dgm-node-bd)';

    var roots = [
      { x: 153, w: 300, t: 'Flagship' },
      { x: 640, w: 300, t: 'Campaign Manager' },
      { x: 1000, w: 300, t: 'Sales Navigator' }
    ];
    // bracket joining the three roots
    var bY = 28;
    var c0 = roots[0].x + roots[0].w / 2, c2 = roots[2].x + roots[2].w / 2;
    k.push(sEl('path', {
      d: 'M' + c0 + ',' + L1 + ' V' + (bY + 10) + ' Q' + c0 + ',' + bY + ' ' + (c0 + 10) + ',' + bY +
         ' H' + (c2 - 10) + ' Q' + c2 + ',' + bY + ' ' + c2 + ',' + (bY + 10) + ' V' + L1,
      fill: 'none', stroke: line, 'stroke-width': 1.5
    }));
    var c1 = roots[1].x + roots[1].w / 2;
    k.push(sEl('path', { d: 'M' + c1 + ',' + bY + ' V' + L1, fill: 'none', stroke: line, 'stroke-width': 1.5 }));
    roots.forEach(function (r) { box(r.x, L1, r.w, H1, r.t, F1, null, 'dgm-l1-lbl', 6); });

    // Flagship → Feed / Pages / Messaging
    var sections = [
      { x: 60, t: 'Feed', kids: ['Ads', 'Event'] },
      { x: 260, t: 'Pages', kids: ['Analytics', 'Boosting', 'Event Creation', 'Lead Gen Forms', 'Products', 'Third-party int.', 'Permissions'] },
      { x: 460, t: 'Messaging', kids: [] }
    ];
    // stems sit 8px clear of the child cards so the verticals never cross them
    var GAP = 8;
    sections.forEach(function (s) {
      topElbow(c0, L1 + H1, s.x + 85, L2);
      box(s.x, L2, 170, H2, s.t, F2, null, 'dgm-l2-lbl', 5);
      var kidX = s.x + 30, kidW = 156, stemX = kidX - GAP;
      s.kids.forEach(function (kid, i) {
        var y = LEAF + i * STEP;
        sideElbow(stemX, L2 + H2, y + HL / 2, kidX);
        box(kidX, y, kidW, HL, kid, F3, S3, 'dgm-l3-lbl', 5);
      });
    });

    // Campaign Manager + Sales Navigator → their children
    [
      { root: roots[1], kids: ['Event Objectives', 'Measurement', 'Attribution', 'Retargeting', 'Interests'] },
      { root: roots[2], kids: ['Leads', 'Attribution'] }
    ].forEach(function (g) {
      var kx = g.root.x + 30, kw = 262, sx = kx - GAP;
      g.kids.forEach(function (kid, i) {
        var y = L2 + i * STEP;
        sideElbow(sx, L1 + H1, y + HL / 2, kx);
        box(kx, y, kw, HL, kid, F3, S3, 'dgm-l3-lbl', 5);
      });
    });
    // viewBox trimmed to the drawn bounds (no dead margin) so the map scales up
    // to fill the stage instead of sitting at ~0.8.
    return sEl('svg', {
      viewBox: '40 8 1280 614', class: 'viz-svg viz-svg--sitemap',
      preserveAspectRatio: 'xMidYMid meet', role: 'img'
    }, k);
  }

  // Two-lane swimlane with a snaking path (Marketer ↔ Attendee).
  function diagramSwimlane() {
    // extra width so the ribbon's overhanging ends aren't clipped
    var W = 1260, H = 560, x0 = 95, colW = 155, cols = 7;
    var laneTop = { y: 70, h: 180 }, laneBot = { y: 300, h: 180 };
    var yTop = laneTop.y + laneTop.h / 2, yBot = laneBot.y + laneBot.h / 2;
    var cx = function (c) { return x0 + c * colW + colW / 2; };
    var k = [];
    // Each lane is a row of stage cells separated by gaps (the "squares"),
    // clipped to a rounded rect so the lane's outer corners stay round.
    var defs = sEl('defs', null, [vizNoiseFilter()]);
    var gap = 5;
    [laneTop, laneBot].forEach(function (l, li) {
      var clipId = 'dgm-lane-clip-' + li;
      defs.appendChild(sEl('clipPath', { id: clipId }, [
        sEl('rect', { x: x0, y: l.y, width: cols * colW, height: l.h, rx: 24 })
      ]));
      var cells = [];
      for (var c = 0; c < cols; c++) {
        var cellX = x0 + c * colW + (c === 0 ? 0 : gap / 2);
        var cellW = colW - (c === 0 || c === cols - 1 ? gap / 2 : gap);
        // flat fill only — the gaps do the separating, no outline, no grain
        cells.push(sEl('rect', {
          x: cellX, y: l.y, width: cellW, height: l.h,
          fill: 'rgba(255,255,255,0.045)'
        }));
      }
      k.push(sEl('g', { 'clip-path': 'url(#' + clipId + ')' }, cells));
    });
    k.unshift(defs);

    // rotated row labels
    k.push(sEl('text', { x: 26, y: yTop, 'text-anchor': 'middle', class: 'dgm-lane-row', transform: 'rotate(-90 26 ' + yTop + ')', text: 'MARKETER' }));
    k.push(sEl('text', { x: 26, y: yBot, 'text-anchor': 'middle', class: 'dgm-lane-row', transform: 'rotate(-90 26 ' + yBot + ')', text: 'ATTENDEE' }));

    // Continuous ribbon: marketer lane → down into attendee → back up.
    // Its ends overhang the lanes slightly on both sides.
    var overhang = 8;
    var RIBBON_W = 46;
    var ribbonD = 'M' + (x0 - overhang) + ',' + yTop + ' H' + (x0 + 2.1 * colW) +
      ' C' + (x0 + 2.6 * colW) + ',' + yTop + ' ' + (x0 + 2.6 * colW) + ',' + yBot + ' ' + (x0 + 3.1 * colW) + ',' + yBot +
      ' H' + (x0 + 5.5 * colW) +
      ' C' + (x0 + 6.0 * colW) + ',' + yBot + ' ' + (x0 + 6.0 * colW) + ',' + yTop + ' ' + (x0 + 6.5 * colW) + ',' + yTop +
      ' H' + (x0 + cols * colW + overhang);
    k.push(sEl('path', {
      d: ribbonD,
      // transparent enough that the grain on top reads instead of being
      // washed out by the flat green
      fill: 'none', stroke: 'rgba(185, 242, 200, 0.55)', 'stroke-width': RIBBON_W,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'dgm-grow-path'
    }));
    // Grain over the ribbon: a full-bleed noise rect masked to the ribbon's
    // own stroke. The mask path carries .dgm-grow-path too, so animateDiagram
    // traces it with the ribbon and the grain arrives in step instead of
    // sitting there fully drawn while the ribbon is still growing.
    // Linear fade on the mask (white → black, top → bottom over the ribbon's
    // full vertical extent), so the grain thins out down the shape — same
    // treatment `vizNoise({linear:true})` gives flat surfaces elsewhere.
    defs.appendChild(sEl('linearGradient', {
      id: 'dgm-ribbon-noise-fade', gradientUnits: 'userSpaceOnUse',
      x1: 0, y1: yTop - RIBBON_W / 2, x2: 0, y2: yBot + RIBBON_W / 2
    }, [
      sEl('stop', { offset: '0%', 'stop-color': '#ffffff' }),
      sEl('stop', { offset: '100%', 'stop-color': '#000000' })
    ]));
    defs.appendChild(sEl('mask', { id: 'dgm-ribbon-noise', maskUnits: 'userSpaceOnUse' }, [
      sEl('path', {
        d: ribbonD, fill: 'none', stroke: 'url(#dgm-ribbon-noise-fade)', 'stroke-width': RIBBON_W,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'dgm-grow-path'
      })
    ]));
    k.push(sEl('rect', {
      x: 0, y: 0, width: W, height: H,
      filter: 'url(#v-noise-filter)', mask: 'url(#dgm-ribbon-noise)',
      opacity: '0.55', 'pointer-events': 'none'
    }));
    // Solid outline around the ribbon. Built as a mask ring — white at the
    // outer width, knocked back to black at the inner width — so the border
    // is opaque without laying a solid colour behind the transparent fill.
    var BORDER = 3;
    defs.appendChild(sEl('mask', { id: 'dgm-ribbon-border', maskUnits: 'userSpaceOnUse' }, [
      sEl('path', {
        d: ribbonD, fill: 'none', stroke: '#ffffff', 'stroke-width': RIBBON_W + BORDER * 2,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'dgm-grow-path'
      }),
      sEl('path', {
        d: ribbonD, fill: 'none', stroke: '#000000', 'stroke-width': RIBBON_W,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'dgm-grow-path'
      })
    ]));
    k.push(sEl('rect', {
      x: 0, y: 0, width: W, height: H,
      fill: '#b9f2c8', mask: 'url(#dgm-ribbon-border)', 'pointer-events': 'none'
    }));

    // Stage labels sit outside the lane boxes — above the marketer lane,
    // below the attendee lane.
    [{ c: 0, t: 'Planning' }, { c: 1, t: 'Marketing' }, { c: 6, t: 'Results' }].forEach(function (s) {
      k.push(sEl('text', { x: cx(s.c), y: laneTop.y - 16, 'text-anchor': 'middle', class: 'dgm-lane-lbl', text: s.t }));
    });
    [{ c: 2, t: 'Awareness' }, { c: 3, t: 'Interest' }, { c: 4, t: 'Attend' }, { c: 5, t: 'Post-event' }].forEach(function (s) {
      k.push(sEl('text', { x: cx(s.c), y: laneBot.y + laneBot.h + 34, 'text-anchor': 'middle', class: 'dgm-lane-lbl', text: s.t }));
    });
    return svgRoot(W, H, k);
  }

  // Overlapping-circle "flower" with a pointer to the overview.
  function diagramVenn() {
    var W = 620, H = 470, cx = 270, cy = 210, R = 125, off = 78;
    var k = [];
    // Grain lives inside each lobe: strongest at that circle's rim, fading
    // to nothing at its centre (radial mask — black hides, white reveals).
    var defs = sEl('defs', null, [
      sEl('filter', { id: 'dgm-venn-noise', x: '-20%', y: '-20%', width: '140%', height: '140%' }, [
        sEl('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.85', numOctaves: '3', stitchTiles: 'stitch', result: 'n' }),
        sEl('feColorMatrix', { in: 'n', type: 'saturate', values: '0' })
      ])
    ]);
    // four shades of the brand purple, each with a solid outline
    var lobes = [
      { d: [0, -off], fill: 'rgba(224, 211, 255, 0.20)', stroke: '#e0d3ff' },  // top    — lightest
      { d: [-off, 0], fill: 'rgba(196, 178, 255, 0.20)', stroke: '#c4b2ff' },  // left
      { d: [off, 0], fill: 'rgba(160, 145, 240, 0.22)', stroke: '#a091f0' },   // right
      { d: [0, off], fill: 'rgba(122, 106, 214, 0.24)', stroke: '#7a6ad6' }    // bottom — deepest
    ];
    lobes.forEach(function (c, i) {
      var lx = cx + c.d[0], ly = cy + c.d[1];
      // per-lobe fade: clear at its centre → grainy at its rim
      defs.appendChild(sEl('radialGradient', {
        id: 'dgm-venn-fade-' + i, gradientUnits: 'userSpaceOnUse', cx: lx, cy: ly, r: R
      }, [
        sEl('stop', { offset: '0%', 'stop-color': '#000' }),
        sEl('stop', { offset: '38%', 'stop-color': '#000' }),
        sEl('stop', { offset: '100%', 'stop-color': '#fff' })
      ]));
      defs.appendChild(sEl('mask', { id: 'dgm-venn-mask-' + i }, [
        sEl('circle', { cx: lx, cy: ly, r: R, fill: 'url(#dgm-venn-fade-' + i + ')' })
      ]));
      k.push(sEl('circle', { cx: lx, cy: ly, r: R, fill: c.fill, stroke: c.stroke, 'stroke-width': 1.5 }));
      k.push(sEl('g', { mask: 'url(#dgm-venn-mask-' + i + ')' }, [
        sEl('circle', { cx: lx, cy: ly, r: R, filter: 'url(#dgm-venn-noise)', opacity: '0.42' })
      ]));
    });
    k.unshift(defs);
    // labels sit in each lobe's own (non-overlapping) outer region
    k.push(sEl('text', { x: cx, y: cy - off - 48, 'text-anchor': 'middle', class: 'dgm-venn-lbl', text: 'AUDIENCES' }));
    k.push(sEl('text', { x: cx, y: cy + off + 56, 'text-anchor': 'middle', class: 'dgm-venn-lbl', text: 'MEASUREMENT' }));
    k.push(sEl('text', { x: cx - off - 46, y: cy + 5, 'text-anchor': 'middle', class: 'dgm-venn-lbl', text: 'CAMPAIGN MGR' }));
    k.push(sEl('text', { x: cx + off + 50, y: cy + 5, 'text-anchor': 'middle', class: 'dgm-venn-lbl', text: 'RELEVANCE' }));
    k.push(sEl('circle', { cx: cx, cy: cy, r: 8, fill: 'var(--dgm-ink)' }));
    k.push(sEl('path', { d: 'M' + cx + ',' + cy + ' C' + (cx + 70) + ',' + (cy + 95) + ' ' + (cx + 185) + ',' + (cy + 150) + ' ' + (cx + 240) + ',' + (cy + 196), fill: 'none', stroke: 'var(--dgm-ink)', 'stroke-width': 1.5, 'stroke-dasharray': '2 4' }));
    k.push(sEl('text', { x: cx + 246, y: cy + 214, 'text-anchor': 'end', class: 'dgm-venn-lbl', text: 'MARKETING OVERVIEW' }));
    var svg = svgRoot(W, H, k);
    svg.setAttribute('data-fit', '');   // centre the art in whatever box holds it
    return svg;
  }

  // Grow the timeline bar / swimlane ribbon in from the left each time the
  // slide activates. Both use the same easing: near-linear, easing out at
  // the end (see .dgm-grow-* in deck.css).
  /* Some diagrams draw off-centre inside their authored viewBox (the venn's
     lobes and callout aren't symmetric about the canvas). Re-fit the viewBox
     to the actual ink once, with even padding, so the art centres in whatever
     box it's placed in. Runs on activation, when the SVG has layout. */
  function fitViewBox(slide) {
    slide.querySelectorAll('.viz-svg[data-fit]').forEach(function (svg) {
      if (svg.dataset.fitted) return;
      var b;
      try { b = svg.getBBox(); } catch (e) { return; }
      if (!b || !b.width || !b.height) return;
      var pad = Math.max(b.width, b.height) * 0.04;
      svg.setAttribute('viewBox', [
        (b.x - pad).toFixed(1), (b.y - pad).toFixed(1),
        (b.width + pad * 2).toFixed(1), (b.height + pad * 2).toFixed(1)
      ].join(' '));
      svg.dataset.fitted = '1';
    });
  }

  function animateDiagram(slide) {
    if (reduce) return;
    var paths = slide.querySelectorAll('.dgm-grow-path');
    var rects = slide.querySelectorAll('.dgm-grow-rect');
    if (!paths.length && !rects.length) return;
    paths.forEach(function (p) {
      var len = p.getTotalLength();
      p.style.transition = 'none';
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
    rects.forEach(function (r) { r.style.transition = 'none'; r.style.transform = 'scaleX(0)'; });
    void slide.offsetWidth;                       // reflow so the reset sticks
    paths.forEach(function (p) { p.style.transition = ''; p.style.strokeDashoffset = 0; });
    rects.forEach(function (r) { r.style.transition = ''; r.style.transform = 'scaleX(1)'; });
  }

  // One diagram per full-page slide.
  /* `shared` marks the diagram stage as a persistent element: consecutive
     slides carrying the same key cut rather than cross-fade, so a diagram
     that only changes which nodes are lit reads as one drawing changing
     state instead of two slides swapping. */
  function diagramSlide(label, title, svg, shared) {
    var stageAttrs = shared ? { 'data-shared': shared } : null;
    return el('section.deck-slide.deck-slide--diagram-full', { 'data-label': label }, [
      el('h2.deck-title', null, [title]),
      el('div.deck-diagram-stage', stageAttrs, [svg])
    ]);
  }
  function slideDgmTree() { return diagramSlide('Marketing', 'Marketing solutions', diagramTree()); }
  function slideDgmPods() { return diagramSlide('Narrative', 'Narrative development', diagramPods()); }
  function slideDgmRoadmap() { return diagramSlide('Result', 'Result', diagramRoadmap()); }
  function slideDgmSwimlane() { return diagramSlide('Narrative flow', 'Build the narrative', diagramSwimlane()); }
  function slideDgmSitemap() { return diagramSlide('System', 'The system', diagramSitemap()); }
  function slideDgmVenn() { return diagramSlide('Overview', 'Marketing overview', diagramVenn()); }

  var HOME_BUILDERS = [
    // the photo wall closes the About run rather than sitting after How I lead
    // slideOrgTree also opens the Pods case study — the builder runs twice,
    // so each deck gets its own copy of the diagram.
    slideTitle, slideBelief, slidePlaces, slidePhotoWall, slideAboutCards, slideHowILead, slideOrgTree, slideWork,
    slidePodcast, slideCTA
  ];
  /* Cut from the main flow (the builders are still defined and can be
     dropped back into the list above at any point):
       slideTimeline    'Career'       A decade leading design
       slideLeadcraft   'LeadCraft'    LeadCraft
       slideCommunity   'Community'    Community
       slideStatement   'Context'      statement slide
       slideStatHero    'Results'      stat figures
       slideDgmTree     'Marketing'    Marketing solutions
       slideDgmSitemap  'System'       The system
       slideRetention   'Retention'    The first 90 days
       slideStack       'Foundation'   Building the stack
       slideDgmPods     'Narrative'    Narrative development
       slideDgmVenn     'Overview'     Marketing overview
       slideCharts      'Impact'       four-chart grid
     slideDgmRoadmap ('Result') moved to the events case study, where it
     stands in for that deck's Outcomes section.
     slideDgmSwimlane ('Build the narrative') moved to the events case
     study, where it sets up the event ad experience.                 */

  /* ── Extra case-study slides, inserted after a named section ────────
     Keyed by case-study key; each entry lists {after, build}. `after`
     matches a section's <h2> text. ──────────────────────────────────── */

  // Three gradient forms: an elbow in from the left, a straight column, and
  // a mirrored elbow in from the right. Each fades from the background at
  // its outer end to full lavender at the base, so the labels anchor them.
  function influenceShape(kind, gradId) {
    var W = 320, H = 400, SW = 86, half = SW / 2;
    var d = kind === 'column'
      ? 'M' + (W / 2) + ',' + half + ' V' + (H - half)
      : kind === 'left'
        // in from the left edge, quarter-turn down
        ? 'M0,' + (half + 20) + ' H150 Q' + (W - 80) + ',' + (half + 20) + ' ' + (W - 80) + ',' + (half + 100) + ' V' + (H - half)
        // mirrored: in from the right edge, quarter-turn down
        : 'M' + W + ',' + (half + 20) + ' H170 Q80,' + (half + 20) + ' 80,' + (half + 100) + ' V' + (H - half);
    return sEl('svg', {
      viewBox: '0 0 ' + W + ' ' + H, class: 'deck-infl-svg',
      preserveAspectRatio: 'xMidYMax meet', role: 'img'
    }, [
      sEl('defs', null, [
        sEl('linearGradient', { id: gradId, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: H }, [
          sEl('stop', { offset: '0%', 'stop-color': '#d0bcff', 'stop-opacity': '0.05' }),
          sEl('stop', { offset: '55%', 'stop-color': '#d0bcff', 'stop-opacity': '0.55' }),
          sEl('stop', { offset: '100%', 'stop-color': '#d0bcff', 'stop-opacity': '1' })
        ])
      ]),
      sEl('path', {
        d: d, fill: 'none', stroke: 'url(#' + gradId + ')', 'stroke-width': SW,
        'stroke-linejoin': 'round', 'stroke-linecap': 'butt'
      })
    ]);
  }

  var INFLUENCES = [
    { kind: 'left',   label: 'Competitor parody' },
    { kind: 'column', label: 'Product led growth' },
    { kind: 'right',  label: 'Clear value' }
  ];

  /* A statement slide: the line alone, centred on both axes. The shapes and
     pills that used to sit under it are gone — INFLUENCES is kept in case
     they're wanted back. */
  /* What the evidence that follows is evidence of: title in the left rail,
     the four signals as a 2x2 beside it. */
  var GROWTH_SIGNALS = [
    'Compounding Debt',
    'Experience',
    'New User Acquisition'
  ];

  /* The three threads the evidence pulled together, framed before the
     buy-in story. */
  var MAKING_SENSE = ['Marketing lifecycle', 'User retention', 'Operational challenges'];

  function slideMakingSense() {
    return titleSideSlide('Making sense of it', 'Making Sense of It',
      el('div.deck-quad.deck-quad--stack', null, MAKING_SENSE.map(function (t) {
        return el('div.deck-quad-item', null, [el('p.deck-quad-title', null, [t])]);
      })));
  }

  function slideSignals() {
    return titleSideSlide('Understanding the signals', 'Understanding the Signals',
      el('div.deck-quad.deck-quad--stack', null, GROWTH_SIGNALS.map(function (t) {
        return el('div.deck-quad-item', null, [el('p.deck-quad-title', null, [t])]);
      })));
  }

  /* The drop-off, stated plainly — it sets up the verbatims that follow. */
  function slideNeverLaunched() {
    return el('section.deck-slide.deck-slide--statement', { 'data-label': 'Never launched' }, [
      el('p.deck-statement', null, ['8 out of 10 users never launched a campaign.'])
    ]);
  }

  function slideOutsideInfluences() {
    return el('section.deck-slide.deck-slide--influences', { 'data-label': 'Influences' }, [
      el('h2.deck-title', null, ['Outside competitive influences'])
    ]);
  }

  // Three problem columns — the prose in the Background section, split out.
  var DEBT_COLUMNS = [
    { head: 'Business problem', items: [
      "Surfaces existed but didn't connect: boosting, notifications, recommendations, billing, measurement",
      'Campaign lifecycle is 90 days — UX treated each touchpoint as a one-off',
      "ROI on a campaign doesn't show up immediately, but the product wasn't designed on a time continuum"
    ] },
    { head: 'Organizational problem', items: [
      'Pods owned their surfaces but not a connected way of systems thinking',
      "Some leaders didn't believe self-serve was the right customer at all."
    ] }
  ];

  function slideCompoundingDebt() {
    return el('section.deck-slide.deck-slide--debt', { 'data-label': 'Compounding debt' }, [
      el('h2.deck-title', null, ['Compounding debt']),
      el('div.deck-debt-grid', null, DEBT_COLUMNS.map(function (c) {
        return el('div.deck-debt-col', null, [
          el('p.deck-debt-head', null, [c.head]),
          el('ul.deck-debt-list', null, c.items.map(function (t) { return el('li', null, [t]); }))
        ]);
      }))
    ]);
  }

  // Centered pull-quote with a small mono eyebrow above it.
  function slidePushback() {
    return el('section.deck-slide.deck-slide--pullquote', { 'data-label': 'Pushback' }, [
      el('p.deck-pq-eyebrow', null, ['Pushback']),
      el('blockquote.deck-pq', null, ['"Self-serve isn\'t our ideal customer."'])
    ]);
  }

  // The four motions the enterprise business was built on.
  var LEGACY_MODEL = ['Rep-assisted', 'Agency-managed', 'API / custom-built', 'Bundled'];

  function slideLegacyModel() {
    return el('section.deck-slide.deck-slide--legacy', { 'data-label': 'Legacy model' }, [
      el('h2.deck-title', null, ['Legacy enterprise model']),
      el('div.deck-legacy-grid', null, LEGACY_MODEL.map(function (t) {
        return el('div.deck-legacy-cell', null, [el('span', null, [t])]);
      }))
    ]);
  }

  /* ── Slides lifted from the original LMS presentation ──────────────
     Everything below mirrors a deck slide one-to-one. Anything that was
     a screenshot or a hand-drawn diagram uses a media placeholder until
     the real export is dropped in. ─────────────────────────────────── */

  // Inline figure placeholder — flows in the slide, unlike .deck-media-ph
  // which is absolutely positioned over the globe. Swap the whole call for
  // an <img> once the real export exists.
  function figurePlaceholder(shape, label) {
    return el('figure.deck-fig-ph.deck-fig-ph--' + shape, null, [
      el('span.deck-fig-ph-icon', { html: IMG_ICON, 'aria-hidden': 'true' }),
      el('span.deck-fig-ph-label', null, [label])
    ]);
  }

  // Roman-numbered setup: the three things that were true at the same time.
  var TRUE_AT_ONCE = [
    'Quality was an issue in our product and there was a mandate across the company to prioritizing it.',
    'One of the initiatives across the company was building for self serve as it was an opportunity to bring in more users.',
    'Campaign boosting was seeing success on the consumer side.'
  ];

  function slideTrueAtOnce() {
    return el('section.deck-slide.deck-slide--enum', { 'data-label': 'Three things were true' }, [
      el('ol.deck-enum', null, TRUE_AT_ONCE.map(function (t) {
        return el('li.deck-enum-item', null, [
          el('span.deck-enum-mark', { 'aria-hidden': 'true' }, []),
          el('p.deck-enum-text', null, [t])
        ]);
      }))
    ]);
  }

  // The quality talk: a screenshot of Campaign Manager with verbatim
  // customer complaints pinned over it.
  var TOP50_QUOTES = [
    'OVER complicated!!!! VEEEEEERY complex process. Please, have an easier way to do everything. It is overkill doing an ad, or a campaign … You MUST do an easier UI.',
    'I find the overall process of setting up ads on LinkedIn to be awkward, challenging, and not user-friendly. Please, check out the Google, Microsoft, and Facebook interfaces…. much easier setup.',
    'This is the most UN user friendly interface. I have had to redo this 3 times. This was HAAARD!!!! and FRUSTRATING'
  ];

  function slideTop50() {
    return el('section.deck-slide.deck-slide--top50', { 'data-label': 'Top 50 issues' }, [
      el('h2.deck-title', null, ['Top 50 issues were put on the backlog for new revenue driving projects']),
      // The verbatims carry this slide on their own — no screenshot beside them.
      el('div.deck-top50-body', null, [
        /* Feedback frame: avatar slot on the left, the verbatim beside it —
           the layout from the source Figma frame. */
        el('ul.deck-quote-list', null, TOP50_QUOTES.map(function (q) {
          return el('li.deck-quote-note', null, [
            el('span.deck-quote-avatar', { 'aria-hidden': 'true' }, []),
            el('p.deck-quote-text', null, [q])
          ]);
        }))
      ]),
      el('p.deck-slide-note', null, ['A part of the presentation on product quality I gave at LMS all-hands'])
    ]);
  }

  /* An orthogonal connector with rounded corners: give it the corner
     points and it turns each into a quarter-arc of radius r. */
  function roundedPath(pts, r) {
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 1; i < pts.length - 1; i++) {
      var p = pts[i], a = pts[i - 1], b = pts[i + 1];
      var inX = Math.sign(p[0] - a[0]), inY = Math.sign(p[1] - a[1]);
      var outX = Math.sign(b[0] - p[0]), outY = Math.sign(b[1] - p[1]);
      // don't overrun a short leg
      var rr = Math.min(r, Math.hypot(p[0] - a[0], p[1] - a[1]) / 2,
                           Math.hypot(b[0] - p[0], b[1] - p[1]) / 2);
      d += ' L' + (p[0] - inX * rr) + ',' + (p[1] - inY * rr) +
           ' Q' + p[0] + ',' + p[1] + ' ' + (p[0] + outX * rr) + ',' + (p[1] + outY * rr);
    }
    var last = pts[pts.length - 1];
    return d + ' L' + last[0] + ',' + last[1];
  }

  /* The acquisition map: every door a new user could come through, all of
     them landing on Campaign Manager reporting. Grey pills for the doors,
     the destination carried in the deck's accent. */
  function diagramAcquisition() {
    var W = 1400, H = 780;
    var defs = sEl('defs', null, [vizNoiseFilter()]);
    var k = [];

    var NODES = [
      { id: 'pages',   t: 'Pages',            x: 40,  y: 356, w: 180, tone: 'mid' },
      { id: 'boost',   t: 'Boosting',         x: 258, y: 356, w: 210, tone: 'lit' },
      { id: 'onboard', t: 'Onboarding',       x: 506, y: 356, w: 240, tone: 'lit' },
      { id: 'cm',      t: 'Campaign Manager reporting', x: 900, y: 346, w: 470, h: 84, tone: 'key' },
      { id: 'li',      t: 'LinkedIn navigation', x: 470, y: 96,  w: 300, tone: 'mid' },
      { id: 'mktg',    t: 'Marketing website', x: 470, y: 540, w: 300, tone: 'mid' },
      { id: 'email',   t: 'Email',             x: 560, y: 686, w: 170, tone: 'mid' }
    ];
    var N = {};
    NODES.forEach(function (n) {
      n.h = n.h || 64;
      n.cx = n.x + n.w / 2; n.cy = n.y + n.h / 2;
      n.r = n.x + n.w; n.b = n.y + n.h;
      N[n.id] = n;
    });

    // Connectors first, so the pills sit on top of the line ends.
    var LINKS = [
      [[N.pages.r, N.pages.cy], [N.boost.x, N.boost.cy]],
      [[N.boost.r, N.boost.cy], [N.onboard.x, N.onboard.cy]],
      [[N.onboard.r, N.onboard.cy], [N.cm.x, N.cm.cy]],
      // LinkedIn drops down, runs across, and comes into the top edge
      [[N.li.cx, N.li.b], [N.li.cx, 232], [1300, 232], [1300, N.cm.y]],
      // Marketing website rises and enters the bottom edge
      [[N.mktg.cx, N.mktg.y], [N.mktg.cx, 492], [1250, 492], [1250, N.cm.b]],
      // Email runs right and turns up into the bottom edge
      [[N.email.r, N.email.cy], [1340, N.email.cy], [1340, N.cm.b]]
    ];
    LINKS.forEach(function (pts) {
      k.push(sEl('path', {
        d: roundedPath(pts, 26), fill: 'none', class: 'dgm-acq-link dgm-grow-path',
        'stroke-linecap': 'round'
      }));
    });

    NODES.forEach(function (n) {
      k.push(sEl('rect', {
        x: n.x, y: n.y, width: n.w, height: n.h, rx: n.h / 2,
        class: 'dgm-acq-pill dgm-acq-pill--' + n.tone
      }));
      var nz = vizNoise({ tag: 'rect', x: n.x, y: n.y, width: n.w, height: n.h, rx: n.h / 2 },
        { opacity: n.tone === 'key' ? '0.16' : '0.3' });
      nz.defs.forEach(function (d) { defs.appendChild(d); });
      k.push(nz.layer);
      k.push(sEl('text', {
        x: n.cx, y: n.cy + 5, 'text-anchor': 'middle',
        class: 'dgm-acq-lbl dgm-acq-lbl--' + n.tone, text: n.t.toUpperCase()
      }));
    });

    var svg = svgRoot(W, H, [defs].concat(k));
    svg.setAttribute('data-fit', '');
    return svg;
  }

  function slideAcquisition() {
    return diagramSlide('New user acquisition', 'New user acquisition', diagramAcquisition());
  }

  // Three numbers that broke the "churn is seasonal" story.
  var DATA_POINTS = [
    { lead: '80%', rest: 'new customers churn within the first week' },
    { lead: '90 days', rest: 'it takes for the average customer to see ROI from campaigns' },
    { lead: '30 out of 100', rest: 'customer satisfaction at a historical low' }
  ];

  function slideUnderstandingData() {
    return el('section.deck-slide.deck-slide--pointsplit', { 'data-label': 'User retention' }, [
      el('div.deck-split-head', null, [
        el('h2.deck-title', null, ['User retention']),
        el('p.deck-split-sub', null, ['Opportunity was left on the table'])
      ]),
      el('ul.deck-split-list', null, DATA_POINTS.map(function (d) {
        return el('li', null, [el('strong', null, [d.lead]), ' ' + d.rest]);
      }))
    ]);
  }

  // The 90-day marketing lifecycle, drawn as one continuous loop.
  /* The 90-day marketing lifecycle: four phase panels under a day 1 → day 90
     arrow, each holding its milestones as a labelled dot. `x`/`y` are
     fractions of the panel, so a milestone sits where it does on the
     original whiteboard rather than on a grid. Execution is the phase the
     work focused on, so it carries the accent outline. */
  var LIFECYCLE_PHASES = [
    { name: 'Onboarding', dots: [
      { t: 'Campaign Manager', x: 0.22, y: 0.46 },
      { t: 'Install insight tag', x: 0.62, y: 0.72 }
    ] },
    { name: 'Plan', dots: [
      { t: 'Creates campaign', x: 0.14, y: 0.42 },
      { t: 'Build audience', x: 0.46, y: 0.62 },
      { t: 'Launch campaign', x: 0.82, y: 0.36 }
    ] },
    { name: 'Execution', focus: true, dots: [
      { t: 'Completes campaign', x: 0.42, y: 0.32 },
      { t: 'Optimizations and recommendations', x: 0.14, y: 0.68 },
      { t: 'Performance measurement', x: 0.76, y: 0.52 }
    ] },
    { name: 'Evaluation', dots: [
      { t: 'Quarterly Performance Review', x: 0.58, y: 0.50 },
      { t: 'Audience segmentation', x: 0.20, y: 0.74 }
    ] }
  ];

  function diagramLifecycle() {
    var W = 1200, H = 560, pad = 20;
    var railY = 44, panelTop = 96, panelH = H - panelTop - 24;
    var gap = 14, panelW = (W - pad * 2 - gap * 3) / 4;
    var k = [];

    // Day 1 → Day 90 rail: dot at the start, arrowhead at the end.
    k.push(sEl('defs', null, [
      sEl('marker', {
        id: 'dgm-life-arrow', markerWidth: 10, markerHeight: 8,
        refX: 9, refY: 4, orient: 'auto'
      }, [sEl('path', { d: 'M0,0 L10,4 L0,8 Z', fill: 'var(--dgm-line)' })])
    ]));
    k.push(sEl('text', { x: pad, y: railY - 16, 'text-anchor': 'start', class: 'dgm-life-day', text: 'Day 1' }));
    k.push(sEl('text', { x: W - pad, y: railY - 16, 'text-anchor': 'end', class: 'dgm-life-day', text: 'Day 90' }));
    k.push(sEl('circle', { cx: pad + 3, cy: railY, r: 3.5, fill: 'var(--dgm-line)' }));
    k.push(sEl('line', {
      x1: pad + 8, y1: railY, x2: W - pad, y2: railY,
      stroke: 'var(--dgm-line)', 'stroke-width': 1.5, 'marker-end': 'url(#dgm-life-arrow)'
    }));

    LIFECYCLE_PHASES.forEach(function (p, pi) {
      var px = pad + pi * (panelW + gap);
      k.push(sEl('rect', {
        x: px, y: panelTop, width: panelW, height: panelH, rx: 10,
        fill: 'var(--dgm-node)',
        stroke: p.focus ? 'var(--dgm-node-bd)' : 'var(--dgm-line)',
        'stroke-width': p.focus ? 2 : 1,
        class: p.focus ? 'dgm-life-panel dgm-life-panel--focus' : 'dgm-life-panel'
      }));
      k.push(sEl('text', {
        x: px + panelW / 2, y: panelTop + 34, 'text-anchor': 'middle',
        class: 'dgm-lane-lbl', text: p.name
      }));

      p.dots.forEach(function (d) {
        var cx = px + d.x * panelW, cy = panelTop + d.y * panelH;
        // Label above the dot, wrapped to the panel so it never crosses out
        // of its phase; the last line sits just clear of the dot.
        var charW = 8.6;                       // 16px serif, roughly
        var lines = wrapWords(d.t, Math.floor((panelW - 20) / charW));
        var widest = lines.reduce(function (w, l) { return Math.max(w, l.length); }, 0);
        // keep the centred label inside its own panel
        var half = (widest * charW) / 2;
        var lx = Math.max(px + half + 8, Math.min(cx, px + panelW - half - 8));
        lines.forEach(function (ln, li) {
          k.push(sEl('text', {
            x: lx, y: cy - 26 - (lines.length - 1 - li) * 22,
            'text-anchor': 'middle', class: 'dgm-life-lbl', text: ln
          }));
        });
        k.push(sEl('circle', { cx: cx, cy: cy, r: 9, fill: 'var(--dgm-ink)', class: 'dgm-life-dot' }));
      });
    });

    return svgRoot(W, H, k);
  }

  function slideLifecycle() {
    // labelled for its own title — "User retention" now belongs to the
    // data slide before it
    return el('section.deck-slide.deck-slide--diagram-full', { 'data-label': 'Marketing lifecycle' }, [
      el('h2.deck-title', null, ['The marketing lifecycle']),
      el('div.deck-diagram-stage', null, [diagramLifecycle()])
    ]);
  }

  // Six months of socialization, month by month.
  /* By quarter rather than by month — thirteen monthly stops made the
     callouts taller than the slide. The run spans six quarters, so the
     labels come back around to Q3/Q4 at the end. */
  var BUY_IN_STEPS = [
    { when: 'Q3', what: 'Quality presentation at LMS all-hands' },
    { when: 'Q3', what: 'Partnered with the PMs who owned growth' },
    { when: 'Q3', what: 'Drafted the initial strategy document' },
    { when: 'Q4', what: 'Co-authored the strategy doc with xfn partners' },
    { when: 'Q4', what: 'Socialized it with product owners across LMS' },
    { when: 'Q4', what: 'Named the pain points with the biggest self-serve upside' },
    { when: 'Q1', what: 'All four product areas set an “ideal state” narrative' },
    { when: 'Q1', what: 'Gained Sr. Director support and research funding' },
    { when: 'Q2', what: 'Added to the planning cycle' },
    { when: 'Q2', what: 'Second round of socializing across LMS' },
    { when: 'Q2', what: 'Secured VP-level support' },
    // same labels as the first two stops, so they group under their own key
    { when: 'Q3', key: 'Q3-2', what: 'Build' },
    { when: 'Q4', key: 'Q4-2', what: 'Pilot' }
  ];

  // One stop per month, in order; months with more than one thing that
  // happened stack as bullets under that month. Same chevron treatment as
  // the Roadmap slide, callouts alternating above and below the bar.
  var BUY_IN_MONTHS = (function () {
    var out = [], byKey = {};
    BUY_IN_STEPS.forEach(function (s) {
      var k = s.key || s.when;
      if (!byKey[k]) { byKey[k] = { when: s.when, items: [] }; out.push(byKey[k]); }
      byKey[k].items.push(s.what);
    });
    return out;
  })();

  // SVG text doesn't wrap, so break each bullet at roughly `max` characters.
  function wrapWords(str, max) {
    var lines = [], line = '';
    str.split(' ').forEach(function (w) {
      if (!line) { line = w; return; }
      if ((line + ' ' + w).length > max) { lines.push(line); line = w; }
      else line += ' ' + w;
    });
    if (line) lines.push(line);
    return lines;
  }

  function diagramBuyIn() {
    var months = BUY_IN_MONTHS;
    var n = months.length;
    // Same canvas and bar metrics as the Result roadmap, so the two
    // timelines read as one component across the decks.
    var W = 1200, h = 24, pad = 20, notch = 14, x0 = pad;
    var segW = (W - pad * 2) / n;
    var k = [];

    /* Callout metrics copied from the Result roadmap (mono bullets at
       15px). `maxChars` is capped so a block stays inside the two segments
       between it and the next callout on its own side — they alternate
       above/below the bar, so same-side neighbours sit 2 * segW apart. */
    // charW is in user units: the bullets set at 15px mono, ~0.6em per glyph,
    // so a character is a shade over 9 — undercount it and neighbouring
    // callouts on the same side collide.
    var lineH = 23, titleH = 36, padY = 14, gap = 48, charW = 9.4;
    var maxChars = Math.max(14, Math.floor((2 * segW - 24) / charW));

    // Measure every block first: the bar's y and the viewBox height both fall
    // out of how tall the tallest stack above and below it turn out to be.
    var blocks = months.map(function (m, mi) {
      var lines = [];
      m.items.forEach(function (t) {
        wrapWords(t, maxChars).forEach(function (ln, i) {
          lines.push({ text: (i === 0 ? '·  ' : '   ') + ln, indent: i > 0 });
        });
      });
      return { m: m, mi: mi, below: mi % 2 === 1, lines: lines,
               h: titleH + lines.length * lineH + padY };
    });
    var tallestAbove = blocks.reduce(function (t, b) { return b.below ? t : Math.max(t, b.h); }, 0);
    var tallestBelow = blocks.reduce(function (t, b) { return b.below ? Math.max(t, b.h) : t; }, 0);

    var y = 44 + tallestAbove + gap + h / 2;      // 44 leaves room for the header
    var top = y - h / 2, bot = y + h / 2;
    var H = Math.ceil(bot + gap + tallestBelow + 24);
    var alignTop = top - gap - tallestAbove;

    // Segment fill ramps from the deck's darkest purple to the brightest,
    // same endpoints as the Roadmap chevron.
    function shade(i) {
      var a = [0x39, 0x33, 0x4e], b = [0x75, 0x68, 0xc4], t = n < 2 ? 0 : i / (n - 1);
      return '#' + a.map(function (c, ci) {
        return ('0' + Math.round(c + (b[ci] - c) * t).toString(16)).slice(-2);
      }).join('');
    }

    var bars = [];
    for (var i = 0; i < n; i++) {
      var x = x0 + i * segW;
      var pts = i === 0
        ? [[x, top], [x + segW - notch, top], [x + segW, y], [x + segW - notch, bot], [x, bot]]
        : [[x, top], [x + segW - notch, top], [x + segW, y], [x + segW - notch, bot], [x, bot], [x + notch, y]];
      bars.push(sEl('polygon', { points: pts.map(function (p) { return p.join(','); }).join(' '), fill: shade(i) }));
    }
    k.push(sEl('defs', null, [
      sEl('clipPath', { id: 'dgm-buyin-clip' }, [
        sEl('rect', { x: x0, y: top - 4, width: W - pad * 2, height: h + 8, class: 'dgm-grow-rect' })
      ])
    ]));
    k.push(sEl('g', { 'clip-path': 'url(#dgm-buyin-clip)' }, bars));
    k.push(sEl('text', { x: x0 + 2, y: top - 14, 'text-anchor': 'start', class: 'dgm-chev-lbl', text: 'Socialize the opportunity' }));

    blocks.forEach(function (b) {
      var m = b.m, below = b.below, lines = b.lines, boxH = b.h;
      var dotX = x0 + b.mi * segW + segW / 2;
      var boxTop = below ? (bot + gap) : alignTop;
      // Clamp against the block's own measured width (mono, so char count is
      // a good proxy) rather than a fixed box, otherwise the last stops get
      // pulled left far enough to collide with the one before them.
      var widest = lines.reduce(function (w, l) { return Math.max(w, l.text.length); }, 0);
      var bx = Math.max(4, Math.min(dotX - 12, W - (widest * charW + 12)));

      k.push(sEl('line', {
        x1: dotX, y1: below ? bot : top,
        x2: dotX, y2: below ? boxTop : boxTop + boxH,
        stroke: 'var(--dgm-line)', 'stroke-width': 1.5
      }));
      k.push(sEl('circle', { cx: dotX, cy: y, r: 4, fill: 'var(--dgm-ink)' }));
      k.push(sEl('text', { x: bx + 2, y: boxTop + 14, 'text-anchor': 'start', class: 'dgm-callout-title', text: m.when }));
      lines.forEach(function (t, li) {
        k.push(sEl('text', {
          x: bx + 4, y: boxTop + titleH + 8 + li * lineH,
          'text-anchor': 'start', class: 'dgm-callout-item', text: t.text
        }));
      });
    });
    // dense like the sitemap — let it use the full stage width so the mono
    // bullets don't scale down into illegibility
    var svg = svgRoot(W, H, k);
    svg.setAttribute('class', 'viz-svg viz-svg--buyin');
    return svg;
  }

  function slideBuyIn() {
    return diagramSlide('Buy-in', 'The buy-in journey', diagramBuyIn());
  }

  // The behavioural insights the surface was designed around.
  var SOLUTION_POINTS = [
    'Self serve customers often lead with content so surfacing earlier can help drive success',
    'Dropping users into a campaign table doesn’t surface next best action',
    'Users that are connected with insight tag can build better campaigns'
  ];

  // Title and the behavioural insights stack up the left column; the venn of
  // the four product areas (same diagram as the home deck) sits on the right.
  function slideSolutionPoints() {
    return el('section.deck-slide.deck-slide--diagram-full.deck-slide--vizsplit.deck-slide--vizsplit-top', { 'data-label': 'Solution insights' }, [
      el('div.deck-vizsplit', null, [
        el('div.deck-vizsplit-copy', null, [
          el('h2.deck-title', null, ['Solution']),
          el('ul.deck-facts', null, SOLUTION_POINTS.map(function (t) { return el('li', null, [t]); }))
        ]),
        el('div.deck-vizsplit-chart', null, [diagramVenn()])
      ])
    ]);
  }

  // Marketing Overview, module by module.
  var OVERVIEW_MODULES = [
    { lbl: 'Create button',            desc: 'Create to drive more campaign creation' },
    { lbl: 'Onboarding',               desc: 'Onboarding to assist with launched campaigns and insight tag adoption' },
    { lbl: 'Campaign summary',         desc: 'Campaign summary provides snapshot of overall campaign performance' },
    { lbl: 'Campaign performance',     desc: 'Campaign performance highlights draft, inflight and complete campaigns' },
    { lbl: 'Organic and paid content', desc: 'Content module can help with customers with a cold start by porting content from pages they can sponsor' },
    { lbl: 'Best practice + incentives', desc: 'Incentives include credit or discounts to help with first campaign launches.' }
  ];

  function slideOverviewModules() {
    return el('section.deck-slide.deck-slide--annotated', { 'data-label': 'Marketing Overview' }, [
      el('div.deck-annotated', null, [
        el('figure.deck-annotated-shot', null, [
          el('img', { src: 'assets/slide/growth/layout.png', alt: '' })
        ]),
        el('ol.deck-callouts', null, OVERVIEW_MODULES.map(function (m) {
          // lbl + desc share one grid cell, so the ::before counter keeps
          // its own column instead of pushing the description onto a new row
          return el('li.deck-callout', null, [
            el('div.deck-callout-body', null, [
              el('span.deck-callout-lbl', null, [m.lbl]),
              el('span.deck-callout-desc', null, [m.desc])
            ])
          ]);
        }))
      ])
    ]);
  }

  /* Outcomes for the growth deck: section title on the left rail, the four
     figures as a 2×2 of the same bordered stat cards used elsewhere. */
  var GROWTH_OUTCOMES = [
    { v: '14-day', l: 'reduction in time-to-value churn' },
    { v: '32%',    l: 'increase in campaigns created' },
    { v: '175%',   l: 'increase in engagement with the Audiences product' },
    { v: '24%',    l: 'increase in conversion-tracking engagement' }
  ];

  // Labelled 'Results' so the skipped 'Outcomes' section doesn't take this
  // slide with it — the filter matches on label.
  function slideGrowthOutcomes() {
    return titleSideSlide('Results', 'Outcomes',
      el('div.deck-statgrid', null, GROWTH_OUTCOMES.map(function (o) {
        return el('div.deck-statfig', null, [
          el('div.deck-statfig-num', null, [el('span.deck-statfig-val', null, [o.v])]),
          el('div.deck-statfig-label', null, [o.l])
        ]);
      })), '.deck-slide--counts');
  }

  /* ── B2B Events: slides carried over from the LMS events deck ──────
     Same components as the growth deck where they fit; screenshots use
     figurePlaceholder() until the exports are dropped in. ──────────── */

  // The 2021 experience, and the question the 2023 CPO shift opened up.
  function slideEventsOrigin() {
    return el('section.deck-slide.deck-slide--figtext', { 'data-label': 'Events circa 2021' }, [
      el('div.deck-figtext', null, [
        el('div.deck-figtext-media', null, [
          // the export already carries its own device chrome, so it stands
          // on the slide as-is rather than going into a template
          el('figure.deck-figtext-shot', null, [
            el('img', { src: 'assets/slide/4_events_ad_experience/events 1.png', alt: '' })
          ])
        ]),
        el('div.deck-figtext-copy', null, [
          el('p', null, ["Original events experience routed to third-party platforms. Fast to ship, but missing LinkedIn's B2B context."]),
          el('p', null, ['2023 CPO shift: new question — what if events were inclusive to marketers with a marketplace at the core?'])
        ])
      ])
    ]);
  }

  function slideTrustLow() {
    return el('section.deck-slide.deck-slide--pullquote', { 'data-label': 'Trust was low' }, [
      el('blockquote.deck-pq', null, ['Trust was low'])
    ]);
  }

  // Event-formatted ads were already outperforming.
  // The multiplier is its own span so it can sit on the number's baseline.
  var PILOT_STATS = [
    { value: '20', mult: '×', label: 'Views as compared to organic only' },
    { value: '3',  mult: '×', label: 'Registrations as compared to organic only' },
    { value: '2',  mult: '×', label: 'ROI compared to competition' }
  ];

  // Same cell as the morale figure on Pods Over Silos: outlined box, display
  // numeral left, marker on its baseline at the right, mono label beneath.
  function slidePilotHope() {
    return el('section.deck-slide.deck-slide--bigstats', { 'data-label': 'A pilot for ads' }, [
      el('h2.deck-title', null, ['A pilot for ads gave us hope']),
      el('div.deck-bigstats', null, PILOT_STATS.map(function (s) {
        return el('div.deck-statfig', null, [
          el('div.deck-statfig-num', null, [
            el('span.deck-statfig-val', null, [s.value]),
            el('span.deck-statfig-mult', { 'aria-hidden': 'true' }, [s.mult])
          ]),
          el('div.deck-statfig-label', null, [s.label])
        ]);
      }))
    ]);
  }

  function slideCommitment() {
    return el('section.deck-slide.deck-slide--pullquote', { 'data-label': 'Anchor commitment' }, [
      el('p.deck-pq-eyebrow', null, ['Signal']),
      el('blockquote.deck-pq.deck-pq--tight', null, ['$100M+ commitment from advertiser willing to invest more in our product'])
    ]);
  }

  // North-star statement; the emphasised phrases carry the argument.
  function slideNorthStar() {
    var p = el('p.deck-statement.deck-statement--center', { 'data-label': 'North star' }, []);
    p.innerHTML = '<strong>LinkedIn Live Events</strong> aim to deeply enhance the experience and promotion of ' +
                  '<strong>large tentpole events</strong> for enterprise businesses seeking to ' +
                  '<strong>build lasting connections with their attendees</strong>.';
    return el('section.deck-slide.deck-slide--statement.deck-slide--statement-center', { 'data-label': 'North star' }, [p]);
  }

  // What the narrative had to do. Title on the left, the steps as a grid of
  // headed notes on the right — the last one takes it out to the org.
  var APPROACH_STEPS = [
    { head: 'Incorporate research', note: 'What did customers and organizers actually tell us?' },
    { head: 'Speak to business case', note: 'Where is the revenue, and what is the upside worth?' },
    { head: 'Systems-aware', note: 'How do the surfaces connect across the event lifecycle?' },
    { head: 'Initiative-aware', note: 'Where does the work teams already own fit inside the story?' },
    { head: 'Build narrative', note: 'Tie it into one story an executive room can fund.' },
    { head: 'Socialize', note: 'Take it room by room until the org tells the story back to you.' }
  ];

  function slideApproachStairs() {
    // Label differs from the section's so skipping the prose 'Approach'
    // slide doesn't take this one with it.
    return el('section.deck-slide.deck-slide--notes', { 'data-label': 'Approach steps' }, [
      el('div.deck-notes-head', null, [el('h2.deck-title', null, ['Approach'])]),
      el('div.deck-notes', null, APPROACH_STEPS.map(function (s2) {
        return el('div.deck-note', null, [
          el('p.deck-note-head', null, [s2.head]),
          el('p.deck-note-body', null, [s2.note])
        ]);
      }))
    ]);
  }

  // Events lifecycle ring. `focus` names the stages drawn as filled pills.
  var EVENT_STAGES = ['Plan', 'Attract', 'Engage', 'Live Event', 'Amplify', 'Convert'];

  function diagramCycle(focus) {
    // Proportions follow the source slide: a wide ellipse with the stage
    // pills sitting in breaks in the stroke, and a soft grained disc at the
    // centre for the loop everything reports back into.
    var W = 1200, H = 700, cx = 620, cy = 350, rx = 350, ry = 268;
    var k = [], defs = sEl('defs', null, [vizNoiseFilter()]);
    k.push(defs);

    function pt(deg) {
      var a = (deg - 90) * Math.PI / 180;
      return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
    }
    // Pill geometry first — the ring gap at each stage is sized to it.
    var pills = EVENT_STAGES.map(function (name, i) {
      var deg = i * 60, c = pt(deg);
      var w = name.length * 13 + 52, h = 56;
      // half the pill's width along the ring, converted back to degrees
      var tangent = Math.sqrt(Math.pow(rx * Math.sin((deg - 90) * Math.PI / 180), 2) +
                              Math.pow(ry * Math.cos((deg - 90) * Math.PI / 180), 2));
      return { name: name, deg: deg, c: c, w: w, h: h,
               gap: Math.min(34, (w / 2 + 12) / tangent * 180 / Math.PI),
               on: (focus || []).indexOf(name) >= 0 };
    });

    // Ring: one arc between consecutive stages, broken only where a pill sits.
    pills.forEach(function (pl, i) {
      var next = pills[(i + 1) % 6];
      var a0 = pl.deg + pl.gap, a1 = pl.deg + 60 - next.gap;
      var p0 = pt(a0), p1 = pt(a1);
      k.push(sEl('path', {
        d: 'M' + p0[0].toFixed(1) + ',' + p0[1].toFixed(1) +
           ' A' + rx + ',' + ry + ' 0 0 1 ' + p1[0].toFixed(1) + ',' + p1[1].toFixed(1),
        fill: 'none', stroke: 'var(--dgm-line)', 'stroke-width': 13, 'stroke-linecap': 'round'
      }));
    });

    // Centre disc: tinted fill plus a grain layer that fades out at the rim.
    var hubR = 152;
    k.push(sEl('circle', { cx: cx, cy: cy, r: hubR, fill: 'rgba(208, 188, 255, 0.11)' }));
    var hubNz = vizNoise({ tag: 'circle', cx: cx, cy: cy, r: hubR }, { opacity: '0.34' });
    hubNz.defs.forEach(function (d) { defs.appendChild(d); });
    k.push(hubNz.layer);
    k.push(sEl('text', { x: cx, y: cy - 6, 'text-anchor': 'middle', class: 'dgm-cycle-hub', text: 'Analyze +' }));
    k.push(sEl('text', { x: cx, y: cy + 40, 'text-anchor': 'middle', class: 'dgm-cycle-hub', text: 'Optimize' }));

    pills.forEach(function (pl) {
      var x = pl.c[0] - pl.w / 2, y = pl.c[1] - pl.h / 2;
      k.push(sEl('rect', {
        x: x, y: y, width: pl.w, height: pl.h, rx: pl.h / 2,
        fill: pl.on ? 'var(--primary)' : 'var(--bg)',
        stroke: pl.on ? 'var(--primary)' : 'var(--dgm-node-bd)', 'stroke-width': 1.5
      }));
      // grain on the pill too, so filled and outlined stages share a surface
      var nz = vizNoise({ tag: 'rect', x: x, y: y, width: pl.w, height: pl.h, rx: pl.h / 2 },
                        { opacity: pl.on ? '0.16' : '0.26' });
      nz.defs.forEach(function (d) { defs.appendChild(d); });
      k.push(nz.layer);
      k.push(sEl('text', {
        x: pl.c[0], y: pl.c[1] + 8, 'text-anchor': 'middle', class: 'dgm-cycle-lbl',
        fill: pl.on ? 'var(--on-primary)' : 'var(--viz-ink)', text: pl.name
      }));
    });
    return svgRoot(W, H, k);
  }

  /* One diagram, two states: the full lifecycle, then the same drawing with
     the three stages we focused on lit. Same title and a shared stage, so
     advancing lights the nodes up in place rather than swapping slides. */
  function slideEventsLifecycle() {
    return diagramSlide('Lifecycle', 'Events lifecycle', diagramCycle(), 'events-cycle');
  }
  function slideFocusStory() {
    return diagramSlide('Focus', 'Events lifecycle', diagramCycle(['Attract', 'Engage', 'Live Event']), 'events-cycle');
  }

  // Ad experience across the three moments of an event.
  var AD_MOMENTS = [
    { cap: 'Pre-event',    shot: 'assets/slide/14_events_ad_experience/Mobile - Before.png' },
    { cap: 'During event', shot: 'assets/slide/14_events_ad_experience/Mobile - During.png' },
    { cap: 'Post-event',   shot: 'assets/slide/14_events_ad_experience/Mobile - After.png' }
  ];

  function slideEventAdExperience() {
    return el('section.deck-slide.deck-slide--triptych', { 'data-label': 'Event ad experience' }, [
      el('h2.deck-title', null, ['Event Ad Experience']),
      el('div.deck-triptych', null, AD_MOMENTS.map(function (m) {
        return el('div.deck-triptych-col', null, [
          el('p.deck-triptych-cap', null, [m.cap]),
          phoneFrame(m.cap + ' ad unit', m.shot)
        ]);
      }))
    ]);
  }

  /* Spec slides: labelled cards flanking a screen. `left` / `right` are the
     card columns; either can be empty. */
  function specCard(c) {
    return el('div.deck-spec', null, [
      el('span.deck-spec-lbl', null, [c.lbl]),
      el('span.deck-spec-desc', null, [c.desc])
    ]);
  }

  function specSlide(label, title, shape, phLabel, left, right, sub, shot, shotMode) {
    var head = [el('h2.deck-title', null, [title])];
    if (sub) head.push(el('p.deck-split-sub', null, [sub]));
    // with no right-hand column the screen takes that space instead of
    // leaving a hole beside it
    // 'laptop' swaps the flat placeholder for the MacBook template, with
    // the label sitting in its screen well.
    var art = shape === 'laptop'
      ? laptopFrame(phLabel, shot)
      : (shape === 'phone' && shot)
        ? phoneFrame(phLabel, shot, shotMode || true)
        : figurePlaceholder(shape, phLabel);
    if (shape === 'laptop') art.classList.add('deck-laptop--spec');
    var cols = [el('div.deck-spec-col', null, left.map(specCard)), art];
    if (right.length) cols.push(el('div.deck-spec-col', null, right.map(specCard)));
    return el('section.deck-slide.deck-slide--specs', { 'data-label': label }, [
      el('div.deck-split-head', null, head),
      el('div.deck-specs' + (right.length ? '' : '.deck-specs--wide'), null, cols)
    ]);
  }

  function slidePreEventPage() {
    return specSlide('Pre-event page', 'Pre-Event Page', 'phone', 'Pre-event page — Dreamforce', [
      { lbl: 'Takeover ads', desc: 'Create an immersive entry through sponsored events.' },
      { lbl: 'Event surface', desc: 'Enhance the existing event surface with an in-person tentpole context that includes highlighting speakers and agenda' },
      { lbl: 'Promote members', desc: 'Promote members and on platform thought-leaders.' },
      { lbl: 'Registration', desc: 'Utilize on-platform lead generation forms for seamless signup.' }
    ], [
      { lbl: 'Promote associated products and services', desc: 'Provide discovery to products and services that users may be curious about demoing or have skills' },
      { lbl: 'Increase network engagement', desc: 'Enhance the existing event surface with an in-person tentpole context.' }
    ], null, 'assets/slide/events_hero/pre-event.png');
  }

  function slideAttendeeCheckIn() {
    return el('section.deck-slide.deck-slide--figtext.deck-slide--figtext-rev', { 'data-label': 'Attendee check-in' }, [
      el('div.deck-figtext', null, [
        el('div.deck-figtext-copy', null, [
          el('h2.deck-title', null, ['Attendee Event Experience']),
          el('p.deck-split-sub', null, ['How businesses can build lasting connections with their attendees.'])
        ]),
        el('div.deck-figtext-media', null, [phoneFrame('Event check-in pass', 'assets/slide/events_hero/pass.png')])
      ])
    ]);
  }

  function slideAttendeeExperience() {
    return specSlide('Attendee experience', 'Attendee Event Experience', 'phone', 'In-event attendee home', [
      { lbl: 'Promote conversation', desc: 'Connect employees to introduce warm connections' },
      { lbl: 'Event surface', desc: 'Customize event content with sessions contextual to member' },
      { lbl: 'Promote conversation', desc: 'Enhance the existing event surface with an in-person tentpole context.' },
      { lbl: 'Increase network engagement', desc: 'Provide opportunities to connect with members with similar interest in groups' }
    ], [
      { lbl: 'Promote associated products and services', desc: 'Promote associated products and services tied to event' },
      { lbl: 'Increase network engagement', desc: 'Enhance the existing event surface with an in-person tentpole context.' }
    ], null, 'assets/slide/16_events_ad_experience/attendee.jpg', 'scroll');
  }

  function slideMarketingSales() {
    return specSlide('Marketing and sales', 'Marketing and Sales Experience', 'laptop', 'Event overview in Pages — funnel and paid vs. organic', [
      { lbl: 'Event overview within Pages', desc: 'Dedicated event overview experience for event organizers and marketing managers delivering comprehensive information at a glance' },
      { lbl: 'Marketing funnel', desc: 'Market and sales-aware insights that connect impressions, leads, and conversations with sales during event for clear understanding of attribution' },
      { lbl: 'Organic and paid integrations', desc: 'Given the positive ROI and performance of paid promotion we provide integration partners to see full picture if events capture attendees on other platforms' }
    ], [], null, 'assets/slide/18_events_ad_experience/marketer.jpg');
  }

  /* ── Pods Over Silos: slides from the restructure deck ─────────────
     Reuses the home deck's org tree, pod hub, plate stack, statement and
     stat-figure components so the visual language never resets. ────── */

  // The pod glyph: grained disc with four members in a 2×2. Shared by the
  // pods hub diagram and every pod on the case study so they never differ.
  function podGlyph(k, defs, cx, cy, r) {
    k.push(sEl('circle', { cx: cx, cy: cy, r: r, fill: 'rgba(185, 242, 200, 0.16)', stroke: '#b9f2c8', 'stroke-width': Math.max(1.5, r * 0.045) }));
    var nz = vizNoise({ tag: 'circle', cx: cx, cy: cy, r: r }, { opacity: '0.4' });
    nz.defs.forEach(function (d) { defs.appendChild(d); });
    k.push(nz.layer);
    var d = r * 0.32, dr = r * 0.18;
    [[-d, -d], [d, -d], [-d, d], [d, d]].forEach(function (o) {
      k.push(sEl('circle', { cx: cx + o[0], cy: cy + o[1], r: dr, fill: 'rgba(185, 242, 200, 0.55)' }));
    });
  }

  // Left: the quarterly request pile. Right: the designers absorbing it.
  // Each half sits in its own panel so the shapes read as two compared
  // quantities rather than art floating on the slide.
  function diagramLoad() {
    var W = 1200, H = 600, k = [], defs = sEl('defs', null, [vizNoiseFilter()]);
    k.push(defs);
    // Outline only, and flush to the canvas edge (2 units clears the stroke)
    // so the panels line up with the slide title above them.
    [2, 612].forEach(function (x) {
      k.push(sEl('rect', {
        x: x, y: 24, width: 586, height: 552, rx: 22,
        fill: 'none', stroke: 'var(--border)', 'stroke-width': 1.5
      }));
    });
    k.push(sEl('text', { x: 34, y: 80, 'text-anchor': 'start', class: 'dgm-lane-lbl', text: 'Projects' }));
    k.push(sEl('text', { x: 644, y: 80, 'text-anchor': 'start', class: 'dgm-lane-lbl', text: 'Designers' }));
    k.push(sEl('text', { x: 295, y: 162, 'text-anchor': 'middle', class: 'dgm-stat-lbl', text: '99+' }));
    stackPlates({ count: 12, cx: 295, TW: 210, BW: 400, depth: 62, step: 22, yTop: 194 }).forEach(function (n) { k.push(n); });
    k.push(sEl('text', { x: 295, y: 546, 'text-anchor': 'middle', class: 'dgm-cap', text: 'Quarterly requests' }));
    // four pods in a diamond, matching the source slide's cluster
    [[905, 176], [769, 320], [1041, 320], [905, 464]].forEach(function (c) {
      podGlyph(k, defs, c[0], c[1], 66);
    });
    var svg = svgRoot(W, H, k);
    svg.setAttribute('class', 'viz-svg viz-svg--wide');
    return svg;
  }

  // Four pods, each carrying its own stack of work. One outlined panel per
  // pair, sized off the canvas so the columns are evenly gutted edge to edge.
  function diagramPodsAndStacks() {
    var W = 1360, H = 640, k = [], defs = sEl('defs', null, [vizNoiseFilter()]);
    k.push(defs);
    var m = 2, gap = 22, n = 4;
    var boxW = (W - m * 2 - gap * (n - 1)) / n;
    for (var i = 0; i < n; i++) {
      var x = m + i * (boxW + gap), cx = x + boxW / 2;
      k.push(sEl('rect', {
        x: x, y: 20, width: boxW, height: H - 40, rx: 22,
        fill: 'none', stroke: 'var(--border)', 'stroke-width': 1.5
      }));
      // the product area this pod owns, same names as the org tree, split
      // across two lines so the longest one still clears the box
      var words = LMS_AREAS[i].cap.split(' '), half = Math.ceil(words.length / 2);
      [words.slice(0, half).join(' '), words.slice(half).join(' ')].forEach(function (line, li) {
        k.push(sEl('text', {
          x: cx, y: 68 + li * 30, 'text-anchor': 'middle', class: 'dgm-pod-lbl', text: line
        }));
      });
      podGlyph(k, defs, cx, 225, 80);
      stackPlates({ count: 8, cx: cx, TW: 140, BW: 264, depth: 46, step: 16, yTop: 386 }).forEach(function (pl) { k.push(pl); });
    }
    var svg = svgRoot(W, H, k);
    svg.setAttribute('class', 'viz-svg viz-svg--wide');
    return svg;
  }

  function slideOrgTree() { return diagramSlide('Org', 'LinkedIn Marketing Solutions', diagramTree()); }
  function slidePilotTeam() { return diagramSlide('Pilot team', 'Pilot team', diagramTree(0)); }
  function slideThemes() { return diagramSlide('Themes', 'Identify themes', diagramPods()); }
  // No slide title — each panel is already headed Projects / Designers.
  function slideLoad() {
    return el('section.deck-slide.deck-slide--diagram-full', { 'data-label': 'The load' }, [
      el('div.deck-diagram-stage', null, [diagramLoad()])
    ]);
  }
  function slidePodsAndStacks() { return diagramSlide('Pods', 'A pod per theme, each with its own stack', diagramPodsAndStacks()); }

  function slideMandate() {
    return el('section.deck-slide.deck-slide--statement', { 'data-label': 'The mandate' }, [
      el('p.deck-statement', null, ['There was a mandate across the company to build a flagship AI assisted product for a Q3 debut.'])
    ]);
  }

  function slideOldWay() {
    return el('section.deck-slide.deck-slide--pullquote', { 'data-label': 'The old way' }, [
      el('blockquote.deck-pq', null, ['The old way of doing work…'])
    ]);
  }

  // One hero figure plus the reasons behind it.
  var MORALE_REASONS = [
    'Looking for more growth opportunity',
    'Not clear on how work impacts strategy',
    'Uncertain on what’s expected of them in role'
  ];

  function slideMorale() {
    return el('section.deck-slide.deck-slide--statfigs', { 'data-label': 'Morale' }, [
      el('div.deck-statfigs-split', null, [
        el('div.deck-statfigs', null, [
          el('div.deck-statfig', null, [
            el('div.deck-statfig-num', null, [
              el('span.deck-statfig-val', null, ['66']),
              // pink, not green: this drop is the problem, not the win
              el('span.deck-statfig-dir.deck-statfig-dir--bad', { 'data-dir': 'down', 'aria-hidden': 'true' }, ['▼'])
            ]),
            el('div.deck-statfig-label', null, ['Team morale was at an all time low.'])
          ])
        ]),
        el('div.deck-statfigs-head', null, [
          el('ul.deck-facts', null, MORALE_REASONS.map(function (t) { return el('li', null, [t]); }))
        ])
      ])
    ]);
  }

  // P0/P1/P2 as three discs, smallest scope on the left. Same treatment as
  // the venn lobes: a step up the purple ramp, solid outline, and grain that
  // fades from clear at the centre to the rim.
  var PRIORITY_TIERS = [
    { scope: 'Team',         tier: 'P2', fill: 'rgba(224, 211, 255, 0.20)', stroke: '#e0d3ff' },
    { scope: 'Organization', tier: 'P1', fill: 'rgba(196, 178, 255, 0.20)', stroke: '#c4b2ff' },
    { scope: 'Company',      tier: 'P0', fill: 'rgba(160, 145, 240, 0.22)', stroke: '#a091f0' }
  ];

  function diagramPriorities() {
    var W = 1200, H = 560, R = 148, cy = 236, badge = 52;
    var k = [], defs = sEl('defs', null, [vizNoiseFilter()]);
    k.push(defs);
    PRIORITY_TIERS.forEach(function (t, i) {
      var cx = 200 + i * 400;
      k.push(sEl('circle', { cx: cx, cy: cy, r: R, fill: t.fill, stroke: t.stroke, 'stroke-width': 1.5 }));
      var nz = vizNoise({ tag: 'circle', cx: cx, cy: cy, r: R }, { opacity: '0.42' });
      nz.defs.forEach(function (d) { defs.appendChild(d); });
      k.push(nz.layer);
      k.push(sEl('text', { x: cx, y: cy + 13, 'text-anchor': 'middle', class: 'dgm-cycle-hub dgm-scope-lbl', text: t.scope }));
      // tier badge straddles the bottom edge, as on the source slide
      k.push(sEl('circle', {
        cx: cx, cy: cy + R, r: badge,
        fill: 'var(--bg)', stroke: t.stroke, 'stroke-width': 1.5
      }));
      k.push(sEl('text', { x: cx, y: cy + R + 7, 'text-anchor': 'middle', class: 'dgm-node-lbl', text: t.tier }));
    });
    var svg = svgRoot(W, H, k);
    svg.setAttribute('class', 'viz-svg viz-svg--wide');
    return svg;
  }

  function slidePriorities() { return diagramSlide('Define priorities', 'Define priorities', diagramPriorities()); }

  // Title on the left, the points as a grid of headed notes on the right —
  // same .deck-slide--notes type the events deck's 'Approach' slide uses.
  // NOTE: the `note` lines are placeholder copy — replace with the real
  // framing for each point.
  var DISCUSS_POINTS = [
    { head: '4:1 PM-to-designer ratio',
      note: 'One designer across four product managers — where does the time actually go?' },
    { head: 'Understand product goals',
      note: 'What is each PM trying to ship, and by when?' },
    { head: 'Identify opportunities to collaborate with other teams',
      note: 'Where does this overlap with work another team already owns?' },
    { head: 'Build trust',
      note: 'Show up early enough that design is a partner, not a service desk.' }
  ];

  function slideDiscussProjects() {
    return el('section.deck-slide.deck-slide--notes', { 'data-label': 'Discuss projects' }, [
      el('div.deck-notes-head', null, [el('h2.deck-title', null, ['Discuss projects'])]),
      el('div.deck-notes', null, DISCUSS_POINTS.map(function (d) {
        return el('div.deck-note', null, [
          el('p.deck-note-head', null, [d.head]),
          el('p.deck-note-body', null, [d.note])
        ]);
      }))
    ]);
  }

  var TEAM_ROLES = [
    { key: 'P',  role: 'Principal Designer', desc: 'Aligned with design leadership on larger scale projects to help establish broad narrative.' },
    { key: 'M',  role: 'Sr. Manager + Manager', desc: 'Help drive alignment and planning with product managers.' },
    { key: 'S',  role: 'Staff Designer', desc: 'Exemplify high quality and craft on large to medium-sized projects.' },
    { key: 'Sr', role: 'Sr. Designer', desc: 'Collaborate with staff designer to ensure quality and consistency across their work.' },
    { key: 'IC', role: 'Individual Contributor + Associate', desc: 'ICs work with Sr. Designers to help drive smaller projects.' }
  ];

  function slideDefineRoles() {
    return el('section.deck-slide.deck-slide--roles', { 'data-label': 'Define roles' }, [
      el('h2.deck-title', null, ['Define roles']),
      el('ul.deck-roles', null, TEAM_ROLES.map(function (r) {
        return el('li.deck-role', null, [
          el('span.deck-role-key', null, [r.key]),
          el('span.deck-role-name', null, [r.role]),
          el('span.deck-role-desc', null, [r.desc])
        ]);
      }))
    ]);
  }

  var RITUALS = [
    { head: 'Design-focused', items: ['1:1’s', 'Design Crits', 'Standups', 'Design Reviews'] },
    { head: 'Cross-functional', items: ['Standups', 'Weekly Product Review', 'Product Jam', 'Strategy Review'] }
  ];

  function slideDefineRituals() {
    return el('section.deck-slide.deck-slide--rituals', { 'data-label': 'Define rituals' }, [
      el('h2.deck-title', null, ['Define rituals']),
      el('div.deck-rituals', null, RITUALS.map(function (c) {
        return el('div.deck-ritual-col', null, [
          el('p.deck-ritual-head', null, [c.head]),
          el('ul', null, c.items.map(function (t) { return el('li.deck-ritual-pill', null, [t]); }))
        ]);
      }))
    ]);
  }

  var POD_APPROACH = [
    'Flexibility on focus area based on themes',
    'Shared product goals',
    'Federated priority structure',
    'Shared language',
    'Faster decision-making'
  ];

  function slidePodApproach() {
    return el('section.deck-slide.deck-slide--pointsplit', { 'data-label': 'Pod approach' }, [
      el('div.deck-split-head', null, [el('h2.deck-title', null, ['Pod approach'])]),
      el('ul.deck-split-list', null, POD_APPROACH.map(function (t) { return el('li', null, [t]); }))
    ]);
  }

  /* ── Dual Creator Cam: process slides ──────────────────────────────
     Display title in the left column, a screenshot placeholder filling
     the right. Same bones as .deck-slide--figtext, but the copy column
     is a title rather than body paragraphs. */
  /* The MacBook template with its screen area exposed: the artwork is a
     transparent PNG of the laptop, and the screen well is positioned to
     the white rectangle inside it, so a screenshot drops straight in. */
  /* `src` may instead be a ready-made media element (a <video> lifted from
     the case study), which drops into the well as-is. */
  function laptopFrame(label, src) {
    var screen = el('div.deck-laptop-screen', null, [
      src && src.nodeType === 1 ? src
      : src ? el('img', { src: src, alt: '' })
          : el('span.deck-laptop-lbl', null, [label])
    ]);
    return el('figure.deck-laptop', null, [
      screen,
      el('img.deck-laptop-art', { src: 'assets/templates/macbookpro.png', alt: '' })
    ]);
  }

  /* Several screenshots in one machine: click the screen to step through
     them, wrapping at the end. Dots under the copy show where you are. */
  function laptopGallery(srcs) {
    var frame = laptopFrame('', srcs[0]);
    frame.classList.add('deck-laptop--gallery');
    var screen = frame.querySelector('.deck-laptop-screen');
    screen.innerHTML = '';
    var shots = srcs.map(function (src, i) {
      return el('img' + (i === 0 ? '.is-on' : ''), { src: src, alt: '' });
    });
    shots.forEach(function (im) { screen.appendChild(im); });

    var at = 0;
    function show(next) {
      shots[at].classList.remove('is-on');
      at = (next + srcs.length) % srcs.length;
      shots[at].classList.add('is-on');
    }
    frame.addEventListener('click', function () { show(at + 1); });
    return frame;
  }

  /* iPhone template, same idea as laptopFrame: the well is measured to the
     artwork's screen and sits under the transparent PNG, so the bezel and
     dynamic island paint over whatever is in it. */
  /* `fit` shows the whole screenshot rather than filling the well with it —
     for captures that aren't the template's exact aspect ratio and would
     otherwise lose an edge to the crop. */
  /* `fit` may also be the string 'scroll': a long screenshot keeps its full
     height and the screen well scrolls it under the bezel on hover. */
  function phoneFrame(label, src, fit) {
    var scroll = fit === 'scroll';
    var screen = el('div.deck-phone-screen', null, [
      src ? el('img', { src: src, alt: '' })
          : el('span.deck-laptop-lbl', null, [label])
    ]);
    return el('figure.deck-phone' + (scroll ? '.deck-phone--scroll' : fit ? '.deck-phone--fit' : ''), null, [
      screen,
      el('img.deck-phone-art', { src: 'assets/templates/iphone1.png', alt: '' })
    ]);
  }

  /* `shot` may be an array — the machine then holds a click-through
     gallery of those screenshots instead of a single still. */
  function titleFigureSlide(label, title, figLabel, note, shot) {
    var copy = [el('h2.deck-title', null, [title])];
    if (note) copy.push(el('p.deck-body', null, [note]));
    var art = Array.isArray(shot) ? laptopGallery(shot) : laptopFrame(figLabel, shot);
    return el('section.deck-slide.deck-slide--titlefig.deck-slide--laptop', { 'data-label': label }, [
      el('div.deck-titlefig', null, [
        el('div.deck-titlefig-copy', null, copy),
        art
      ])
    ]);
  }

  function slideDccFigma() {
    return titleFigureSlide('Core screens', 'Designing core screens in Figma',
      'Figma core screens',
      'The spec came first. Agents build far better against a defined target than a description.',
      'assets/slide/dual_creator_cam/figma.png');
  }
  function slideDccPlaygrounds() {
    return titleFigureSlide('Playgrounds', 'Building playgrounds to test concepts',
      'Concept playground',
      'Throwaway builds to feel an interaction on device before it earned a place in the app.',
      'assets/slide/dual_creator_cam/xcode.png');
  }
  function slideDccClaudeXcode() {
    return titleFigureSlide('Claude to Xcode', 'From Claude to Xcode',
      'Claude Code ↔ Xcode',
      'Figma via MCP into Claude Code, straight into the Swift build, then back on device.',
      'assets/slide/dual_creator_cam/claude.png');
  }

  /* The agents slide: the four standing roles I delegate to, arranged
     around the build at the centre. */
  var DCC_AGENTS = [
    { t: 'Performance',       pos: 'tl' },
    { t: 'Bug Bash',          pos: 'tr' },
    { t: 'Code Review',       pos: 'bl' },
    { t: 'Product Marketing', pos: 'br' }
  ];

  function slideDccAgents() {
    return el('section.deck-slide.deck-slide--titlefig.deck-slide--agents', { 'data-label': 'Agents as a team' }, [
      el('div.deck-titlefig', null, [
        el('div.deck-titlefig-copy', null, [
          el('h2.deck-title', null, ['Running agents that are a product development team']),
          el('p.deck-body', null, ['I delegate, review, and redirect the same way I would with engineers, ' +
            'switching models by task. Treating them as a team, not a single tool, is what made the workflow scale.'])
        ]),
        el('div.deck-agents', null, DCC_AGENTS.map(function (a) {
          return el('span.deck-agent-lbl.deck-agent-lbl--' + a.pos, null, [a.t]);
        }).concat([figurePlaceholder('screen', 'The build')]))
      ])
    ]);
  }

  /* Section title held in the left column, the payload stacked on the
     right — the same bones as titleFigureSlide, so the DCC slides all
     share one left rail. */
  function titleSideSlide(label, title, right, extraCls) {
    return el('section.deck-slide.deck-slide--titlefig' + (extraCls || ''), { 'data-label': label }, [
      el('div.deck-titlefig', null, [
        el('div.deck-titlefig-copy', null, [el('h2.deck-title', null, [title])]),
        right
      ])
    ]);
  }

  var DCC_PRINCIPLES = [
    { h: 'Keep it simple.', p: 'One core feature; everything else exists to support it.' },
    { h: 'Maintain baseline parity.', p: 'Match the stock iOS camera, then leverage the hardware of supported devices.' },
    { h: 'Stay relevant.', p: "Language, customization, and settings tuned to creators, that's what sets it apart from the dozens of recorders in the store." }
  ];

  function slideDccApproach() {
    return titleSideSlide('Approach', 'Approach',
      el('ul.deck-principles', null, DCC_PRINCIPLES.map(function (pr) {
        return el('li.deck-principle', null, [
          el('strong', null, [pr.h]),
          document.createTextNode(' ' + pr.p)
        ]);
      })));
  }

  var DCC_NUMBERS = [
    { v: '207M+',  l: 'people identify as content creators worldwide' },
    { v: '$250B',  l: 'creator economy in 2025, on a path to $1T+ by 2030–33' },
    { v: '10–20%', l: 'audience overlap between platforms, why creators cross-post' }
  ];

  // .deck-slide--counts opts the figures into the shared count-up on entry.
  function slideDccNumbers() {
    return titleSideSlide('By the numbers', 'By the numbers',
      el('div.deck-numstack', null, DCC_NUMBERS.map(function (n) {
        return el('div.deck-statfig', null, [
          el('div.deck-statfig-num', null, [el('span.deck-statfig-val', null, [n.v])]),
          el('div.deck-statfig-label', null, [n.l])
        ]);
      })), '.deck-slide--counts');
  }

  function slideDccFriction() {
    return el('section.deck-slide.deck-slide--statement', { 'data-label': 'The friction' }, [
      el('p.deck-statement.deck-statement--wide', null, [
        "When traveling, it's hard to capture a moment at a moment's notice. A camera on a " +
        "tripod, a DJI Osmo Pocket, an Insta360: they're slow to start up and set up, costly, " +
        'and carry the risk of being misplaced or damaged through airport security, storage, ' +
        'and the elements. More and more social creators are filming with their iPhones instead.'
      ])
    ]);
  }

  var DCC_JOBS = [
    'I want to film vertical for short form content',
    'I want to film horizontal for YouTube'
  ];

  /* Two circles wide enough to run off the slide, offset so they meet in
     a narrow lens down the middle — the two jobs as a Venn, with the
     overlap standing in for the one take that serves both. */
  function jobsVenn() {
    // R is bigger than the canvas so each lobe runs past the top, bottom,
    // and outer edge — only the inner rims and the lens are ever on screen.
    var R = 900, CY = 450;
    var defs = sEl('defs', null, [vizNoiseFilter()]);
    var kids = [defs];
    [-70, 1670].forEach(function (cx) {
      kids.push(sEl('circle', { cx: cx, cy: CY, r: R, fill: 'none', class: 'deck-jobs-ring' }));
      // grain inside each lobe, on the same fractalNoise recipe as the
      // diagram surfaces — masked so it builds toward the lobe's edge
      var nz = vizNoise({ tag: 'circle', cx: cx, cy: CY, r: R }, { opacity: '0.12', fadeFrom: '55%' });
      nz.defs.forEach(function (d) { defs.appendChild(d); });
      kids.push(nz.layer);
    });
    var svg = svgRoot(1600, 900, kids);
    svg.setAttribute('class', 'viz-svg deck-jobs-venn');
    // stretch rather than fit: the lens stays centred and the lobes reach
    // the slide edges at any aspect
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    return svg;
  }

  function slideDccJobs() {
    return el('section.deck-slide.deck-slide--jobs', { 'data-label': 'Jobs to be done' }, [
      jobsVenn(),
      el('div.deck-jobs', null, DCC_JOBS.map(function (j) {
        return el('div.deck-job', null, [
          el('p.deck-eyebrow', null, ['JTBD']),
          el('h2.deck-title', null, [j])
        ]);
      }))
    ]);
  }

  /* Expression: an offset collage of media placeholders — record-button
     finishes and themes, which is what the personalization work is. */
  var DCC_EXPRESSION = [
    { cls: 'a', shape: 'screen' },
    { cls: 'b', shape: 'wide' },
    { cls: 'c', shape: 'wide' },
    { cls: 'd', shape: 'wide' }
  ];

  function slideDccExpression() {
    return titleSideSlide('Expression', 'Expression',
      el('div.deck-collage', null, DCC_EXPRESSION.map(function (t) {
        var f = figurePlaceholder(t.shape, 'Record button');
        f.classList.add('deck-collage-item', 'deck-collage-item--' + t.cls);
        return f;
      })));
  }

  var CS_EXTRA_SLIDES = {
    leadcraft: [
      { after: 'Overview',   build: slideNeverLaunched },
      { after: 'Overview',   build: slideLegacyModel },
      { after: 'Overview',   build: slidePushback },
      { after: 'Overview',   build: slideSignals },
      { after: 'Overview',   build: slideCompoundingDebt },
      { after: 'Background', build: slideTop50 },
      { after: 'Background', build: slideMakingSense },
      { after: 'Background', build: slideAcquisition },
      { after: 'Background', build: slideUnderstandingData },
      { after: 'Approach',   build: slideLifecycle },
      { after: 'Approach',   build: slideSolutionPoints },
      { after: 'Approach',   build: slideOverviewModules },
      { after: 'Approach',   build: slideBuyIn },
      { after: 'Outcomes',   build: slideGrowthOutcomes }
    ],
    events: [
      { after: 'Background', build: slideEventsOrigin },
      { after: 'Background', build: slideTrustLow },
      { after: 'Background', build: slidePilotHope },
      { after: 'Background', build: slideCommitment },
      { after: 'Approach',   build: slideNorthStar },
      { after: 'Approach',   build: slideApproachStairs },
      { after: 'Approach',   build: slideEventsLifecycle },
      { after: 'Approach',   build: slideFocusStory },
      { after: 'Solution',   build: slideDgmSwimlane },
      { after: 'Solution',   build: slideEventAdExperience },
      { after: 'Solution',   build: slidePreEventPage },
      { after: 'Solution',   build: slideAttendeeCheckIn },
      { after: 'Solution',   build: slideAttendeeExperience },
      { after: 'Solution',   build: slideMarketingSales },
      // stands in for the skipped Outcomes section (see CS_SKIP_SECTIONS)
      { after: 'Outcomes',   build: slideDgmRoadmap }
    ],
    pods: [
      { after: 'Overview',   build: slideOrgTree },
      { after: 'Overview',   build: slideMandate },
      { after: 'Background', build: slideOldWay },
      { after: 'Background', build: slideLoad },
      { after: 'Background', build: slideMorale },
      { after: 'Background', build: slideStatement },
      { after: 'Approach',   build: slidePriorities },
      { after: 'Approach',   build: slideDiscussProjects },
      { after: 'Approach',   build: slideThemes },
      { after: 'Approach',   build: slideDefineRoles },
      { after: 'Approach',   build: slideDefineRituals },
      { after: 'Solution',   build: slidePilotTeam },
      { after: 'Solution',   build: slidePodsAndStacks },
      { after: 'Solution',   build: slidePodApproach },
      { after: 'Outcomes',   build: slideStatHero }
    ],
    'video-recorder': [
      { after: 'The Problem',             build: slideDccFriction },
      { after: 'The Problem',             build: slideDccNumbers },
      { after: 'Customer',                build: slideDccJobs },
      { after: 'Approach & Principles',   build: slideDccApproach },
      { after: 'Craft & Personalization', build: slideDccExpression },
      { after: 'Craft & Personalization', build: slideDccFigma },
      { after: 'Craft & Personalization', build: slideDccPlaygrounds },
      { after: 'Craft & Personalization', build: slideDccClaudeXcode },
      { after: 'Craft & Personalization', build: slideDccAgents }
    ]
  };

  /* Deck-only cover art, per case study. Without an entry here the cover
     falls back to the device mock. */
  var CS_COVER_ART = {
    'video-recorder': 'assets/slide/dual_creator_cam/title.png',
    'leadcraft': 'assets/slide/growth/hero.jpg',
    'events': 'assets/slide/events_hero/hero.png',
    'pods': 'assets/slide/pods/hero.jpg'
  };

  /* Cover art that presents inside the MacBook template rather than
     free-floating. */
  var CS_COVER_IN_LAPTOP = ['leadcraft', 'pods'];

  /* Real captions for body media, keyed by the image's file name. Anything
     not listed here still falls back to the placeholder. */
  var CS_CAPTIONS = {
    'campaign_reporting.jpg': 'When users onboarded to Campaign Manager, they were typically dumped into this reporting view without a way to know where to start.'
  };
  function captionFor(src) {
    var name = String(src || '').split('/').pop();
    return CS_CAPTIONS[name] || 'Caption placeholder';
  }

  /* Studies whose body hero art does NOT get its own slide after the cover:
     the cover already opens on that same image, so the slide just repeats
     it. Keyed by study. */
  var CS_SKIP_COVER_MEDIA = ['events', 'video-recorder'];

  /* Studies whose cover media slide plays later in the deck rather than
     straight after the cover. Value is the label it should follow. */
  var CS_COVER_MEDIA_AFTER = {
    leadcraft: 'Buy-in'
  };

  /* Sections whose screenshots present inside the MacBook template.
     Keyed by case study, listing the section labels. */
  /* The hero video plays in the template rather than bare on the slide —
     keyed by the label its media group carries (the study title, for the
     cover art moved later by CS_COVER_MEDIA_AFTER). */
  var CS_LAPTOP_MEDIA = {};

  /* Sections whose screenshot presents as a split slide instead: the
     caption becomes the left-column copy and the MacBook runs oversized off
     the right edge. Keyed by case study, listing the section labels. */
  var CS_LAPTOP_SPLIT_MEDIA = {
    leadcraft: ['Background'],
    pods: ['Outcomes']
  };

  /* Slides that play somewhere other than where the section split puts
     them. Each entry moves `label` to sit directly behind `after`. */
  var CS_MOVE_AFTER = {
    leadcraft: [{ label: 'Background — image', after: 'Never launched' }]
  };

  /* Studies that don't show the lifted "Role" slide. The bullet still comes
     out of the Overview list either way, so it isn't listed twice. */
  var CS_SKIP_ROLE = ['leadcraft'];

  /* Section slides a given deck drops. The extra slides still anchor to
     these labels — the filter runs after they've been spliced in. */
  var CS_SKIP_SECTIONS = {
    leadcraft: ['Background', 'Approach', 'Solution', 'Outcomes'],
    events:    ['Background', 'Approach', 'Solution', 'Outcomes'],
    pods:      ['Background', 'Approach', 'Solution', 'Outcomes'],
    /* The prose sections — the purpose-built slides above carry these
       beats, so the body copy would only repeat them. */
    'video-recorder': ['The Problem', 'Customer', 'Approach & Principles',
                       'The Architecture Pivot', 'Craft & Personalization',
                       'Tracking, Testing & Outcomes']
  };

  /* ── Accelerate: AI campaign creation ─────────────────────────────
     A deck-only case study: it has no written case study behind it, so
     every slide is built here rather than split out of CASE_STUDIES.
     Fifteen slides, no agenda, no dividers, no outro past the last one. */

  // Title + the bullets under it, for the plain point slides.
  function pointsSlide(label, title, points) {
    return el('section.deck-slide.deck-slide--pointsplit', { 'data-label': label }, [
      el('div.deck-split-head', null, [el('h2.deck-title', null, [title])]),
      el('ul.deck-split-list', null, points.map(function (t) { return el('li', null, [t]); }))
    ]);
  }

  /* Screenshot slide: copy on the left rail, the MacBook oversized and
     bleeding off the right edge — the same treatment the Dual Creator Cam
     slides use. The screen well holds the label until a capture replaces it. */
  function shotSlide(label, phLabel, caption, shot) {
    return titleFigureSlide(label, label, phLabel, caption, shot);
  }

  // Campaign Manager Classic, four captures deep.
  var ACC_CLASSIC_SHOTS = [1, 2, 3, 4].map(function (n) {
    return 'assets/slide/accelerate/classic/' + n + '.jpg';
  });

  // The simplified flow, step by step — click through in order.
  var ACC_SIMPLIFIED_SHOTS = [1, 2, 3, 4, 5, 6].map(function (n) {
    return 'assets/slide/accelerate/simplified/' + n + '.jpg';
  });

  var ACC_STEPS = [
    'User describes their business in a prompt',
    'System reads LinkedIn data to infer audience and competitor set',
    'Generates targeting facets',
    'Generates ad formats'
  ];

  var ACC_PRINCIPLES = [
    { w: 'Simple', p: 'Ask for the fewest decisions that still produce a campaign worth running.' },
    { w: 'Intuitive', p: 'Every step should explain itself in the place where the choice is made.' },
    { w: 'Trustworthy', p: 'Show what the system did on your behalf, and let you change it.' }
  ];

  /* Each decision carries the principle it serves, so the three words from
     the Principles slide keep running through the design decisions. */
  var ACC_DECISIONS = [
    { p: 'Simple',
      d: 'Summaries per section instead of every underlying control' },
    { p: 'Intuitive',
      d: 'Explain what a thing does without opening new questions' },
    { p: 'Trustworthy',
      d: 'Contextual help inside each box, at the point of the decision' },
    { p: 'Simple',
      d: 'Reduce the number of inputs the user has to make in the interface' }
  ];

  /* The pod hub on its own — same glyph (and noise) as the one at the
     centre of the Themes diagram, just without the diagram around it. */
  function podGlyphSvg() {
    var k = [], defs = sEl('defs', null, [vizNoiseFilter()]);
    podGlyph(k, defs, 100, 100, 68);
    k.unshift(defs);
    return svgRoot(200, 200, k);
  }

  /* How the design team was organized against the initiative. */
  var ACC_TEAM = [
    { key: 'P',  role: 'Principal Designer',
      desc: 'Drove overall direction for the initiative.' },
    { key: 'S',  role: 'Staff Designer',
      desc: 'Drove cohesiveness in craft and quality across the whole project.' },
    { key: 'Sr', role: 'Sr. Designer',
      desc: 'Led the additional initiatives feeding into the work.' },
    { key: 'IC', role: 'Individual Contributor',
      desc: 'Supported those initiatives alongside the senior designers.' }
  ];

  /* Kept for reference — the Reflection slide it fed is cut from the deck. */
  var ACC_REFLECTION = [
    { h: 'The mandate was not the problem',
      b: 'We were told to ship AI. The leadership work was finding the real user problem — an 80% drop-off in campaign creation — inside a directive that never named one.' },
    { h: 'Infrastructure decides the ceiling',
      b: 'Siloed performance data and rudimentary retrieval capped how much the interface could promise, and no amount of design covered that gap.' },
    { h: 'The team was the deliverable',
      b: 'Reorganizing around the surfaces, staffing the gaps, and giving the work a rhythm is what let a mandate-driven effort ship at all.' }
  ];

  /* The honest second look — what would change on a rerun. */
  var ACC_DIFFERENT = [
    'Pressure-test the data layer before committing to the experience: what the system could retrieve should have set the scope',
    'Ship a narrower first release, with one generative moment done well instead of assistance spread across the flow',
    'Put the completion-rate goal in front of leadership earlier, so the mandate was measured against the user problem rather than the launch date',
    'Staff the adjacent surfaces from the start instead of covering them with a consulting posture'
  ];

  /* Results, consolidated to three figures. The third is the average of the
     four growth numbers this deck used to list separately: brand awareness
     97%, website conversions 55%, document ads 64%, video ads 57% → 68%. */
  var ACC_RESULTS = [
    { v: '$94M', l: 'annual run rate', dir: 'up' },
    { v: '41%',  l: 'week-over-week revenue growth', dir: 'up' },
    { v: '68%',  l: 'average growth across objectives and ad formats', dir: 'up' },
    // a drop that is a win, so it keeps the green chip rather than --bad
    // the adoption read, and the one figure that carries the grain wash
    { v: '14%',  l: 'reduction in churn through campaign creation', dir: 'down', grain: true }
  ];

  // `dir` adds the same ▲ delta chip the other stat slides use.
  function statFig(f) {
    return el('div.deck-statfig' + (f.grain ? '.deck-grain' : ''), null, [
      el('div.deck-statfig-num', null, [
        el('span.deck-statfig-val', null, [f.v]),
        f.dir ? el('span.deck-statfig-dir', { 'data-dir': f.dir, 'aria-hidden': 'true' },
                   [f.dir === 'down' ? '▼' : '▲']) : null
      ].filter(Boolean)),
      el('div.deck-statfig-label', null, [f.l])
    ]);
  }

  function buildAccelerateSlides() {
    var s = [];

    // 1. Title — MacBook template on the cover, same slot as the other
    // desktop case studies.
    var coverArt = laptopFrame('', 'assets/slide/accelerate/hero.jpg');
    coverArt.classList.add('deck-cs-device', 'deck-cs-device--laptop');
    coverArt.setAttribute('aria-hidden', 'true');
    s.push(el('section.deck-slide.deck-slide--cs.deck-slide--cs-title.deck-slide--acc-title', { 'data-label': 'Accelerate' }, [
      coverArt,
      el('div.deck-cs-paper', null, [
        el('div.cs-main', null, [el('h1', null, ['Accelerate'])])
      ]),
      el('div.deck-cs-cover-desc', null, [
        el('p.cs-deck', null, ['AI-assisted campaign creation in LinkedIn Campaign Manager'])
      ])
    ]));

    // 2. The mandate
    s.push(pointsSlide('The mandate', 'The mandate', [
      'Q2 2023: every product area in LinkedIn Business was directed to ship an AI product',
      'Campaign creation was the most complex feature in our experience',
      'Existing AI in the product was limited to recommendations, and it underperformed'
    ]));

    /* 3. My role — the "how the work was led" content moved up here, so the
       team setup sits with the mandate rather than late in the deck. */
    s.push(titleSideSlide('My role', 'My role',
      el('div.deck-role-body', null, [
        el('p.deck-role-title', null, ['Design lead on the initiative']),
        el('ul.deck-role-list', null, [
          'Setting the team up for success: staffing the surfaces, reorganizing around the work, and operationalizing how it ran',
          'Functional direction and critique to the Senior Principal Designer paired with executive leadership',
          'Direct partnership with the principal engineer on what the system could actually return',
          'Consultant posture on adjacent surfaces where no dedicated designer was staffed'
        ].map(function (t) { return el('li', null, [t]); }))
      ]), '.deck-slide--role'));

    /* The team beat moves up front: who was on it, then what they were
       working against. (The Themes slide is cut.) */
    s.push(slidePilotTeam());

    // Campaign Manager Classic
    s.push(shotSlide('Campaign Manager Classic', '',
      'Robust by design, and built for the expert rather than the first-time advertiser',
      ACC_CLASSIC_SHOTS));

    /* Team setup — the pod glyph from the Themes slide on the left, the
       role rows on the right. */
    s.push(el('section.deck-slide.deck-slide--roles.deck-slide--teamsetup', { 'data-label': 'Team Setup' }, [
      el('h2.deck-title', null, ['Team Setup']),
      el('div.deck-teamsetup', null, [
        el('div.deck-teamsetup-glyph', { 'aria-hidden': 'true' }, [podGlyphSvg()]),
        el('ul.deck-roles', null, ACC_TEAM.map(function (r) {
          return el('li.deck-role', null, [
            el('span.deck-role-key', null, [r.key]),
            el('span.deck-role-name', null, [r.role]),
            el('span.deck-role-desc', null, [r.desc])
          ]);
        }))
      ])
    ]));

    // 4. The concept
    s.push(el('section.deck-slide.deck-slide--steps', { 'data-label': 'The concept' }, [
      el('h2.deck-title', null, ['The concept']),
      /* Each step is a box holding its own copy, with the numeral straddling
         the bottom-left corner. */
      el('ol.deck-steps', null, ACC_STEPS.map(function (t, i) {
        return el('li.deck-step', null, [
          el('div.deck-step-fig', null, [
            el('p.deck-step-text', null, [t]),
            el('span.deck-step-num', { 'aria-hidden': 'true' }, [String(i + 1)])
          ])
        ]);
      }))
    ]));

    // 5. The goal
    s.push(pointsSlide('The goal', 'The goal', [
      'Increase campaign completion rate',
      'Our data showed 80% churn in campaign creation',
      'Focused on small and medium business new user acquisition'
    ]));

    // 6. Principles — the three words alone
    s.push(el('section.deck-slide.deck-slide--words', { 'data-label': 'Principles' }, [
      el('h2.deck-title', null, ['Principles']),
      // the grain sits in each box, not behind the slide
      el('div.deck-words', null, ACC_PRINCIPLES.map(function (p) {
        return el('div.deck-word-block.deck-grain', null, [
          el('p.deck-word', null, [p.w]),
          el('p.deck-word-sub', null, [p.p])
        ]);
      }))
    ]));

    // 6. Design decisions
    s.push(el('section.deck-slide.deck-slide--notes', { 'data-label': 'Design decisions' }, [
      el('div.deck-notes-head', null, [el('h2.deck-title', null, ['Design decisions'])]),
      // three across reads as a row; four falls back to the default 2x2
      el('div.deck-notes' + (ACC_DECISIONS.length === 3 ? '.deck-notes--trio' : ''), null,
         ACC_DECISIONS.map(function (d) {
           return el('div.deck-note', null, [
             el('p.deck-note-principle', null, [d.p]),
             el('p.deck-note-head', null, [d.d])
           ]);
         }))
    ]));

    // 7. The simplified flow
    s.push(shotSlide('The simplified flow', '',
      'Same decisions, sequenced and summarized',
      ACC_SIMPLIFIED_SHOTS));

    // 8-10, 12-13, 15: point slides
    // Title and points in the left column, the assistant itself on the right.
    s.push(el('section.deck-slide.deck-slide--figtext', { 'data-label': 'The chat assistant' }, [
      el('div.deck-figtext', null, [
        el('div.deck-figtext-copy', null, [
          el('h2.deck-title', null, ['The chat assistant']),
          el('ul.deck-split-list', null, [
            'A cross-company initiative: LinkedIn was implementing an assistant across the business',
            'Our work defined the patterns and use cases for the advertising context',
            'Presented to the broader design organization on where advertising diverges from flagship and jobs'
          ].map(function (t) { return el('li', null, [t]); }))
        ]),
        el('div.deck-figtext-media', null, [
          // the export carries its own chrome, so it stands on the slide
          // as-is rather than going into a device template
          el('figure.deck-figtext-shot.deck-figtext-shot--chat', null, [
            el('img', { src: 'assets/slide/accelerate/chat/chat.png', alt: '' })
          ])
        ])
      ])
    ]));

    s.push(pointsSlide('The constraint', 'The constraint that decided the outcome', [
      'Performance data lived in silos across the product',
      'Retrieval was rudimentary',
      'Design could not compensate for what the backend could not return'
    ]));


    /* 11. Results — title on the left, the four figures as a 2x2 on the
       right. --counts opts into the shared count-up. */
    s.push(titleSideSlide('Results', 'Results',
      el('div.deck-metric-quad', null, ACC_RESULTS.map(statFig)),
      '.deck-slide--counts'));

    // 12-13
    s.push(pointsSlide('Where the work went next', 'Where the work went next', [
      'Recommendations in the Campaign Manager overview',
      'Post-campaign reporting: campaign health insights and forecasting',
      'Experiments shipped to gather signal for longer-term investment'
    ]));

    // 14. What I carry forward
    s.push(pointsSlide('What I carry forward', 'What I carry forward', [
      'AI features fail at the data layer before they fail at the interface',
      'Trust is a design requirement with an engineering dependency',
      'A mandate is a starting condition, and the leadership work is finding the real problem inside it'
    ]));

    // 15. What I'd do differently
    s.push(pointsSlide('What I would do differently', 'What I would do differently', ACC_DIFFERENT));

    return s;
  }

  /* Studies built entirely in the deck, with no entry in CASE_STUDIES. */
  var DECK_ONLY_STUDIES = {
    accelerate: { title: 'Accelerate: AI Campaign Creation', build: buildAccelerateSlides }
  };

  /* ── Case-study slides: one slide per <h2> section ─────────────────
     CASE_STUDIES[key].body is an HTML string. We split it at each
     <h2> heading: everything before the first <h2> becomes the title
     slide (h1 + deck subtitle + hero media), and each <h2> section
     becomes its own slide. Content keeps its .cs-main styling on a
     light "paper" card. ─────────────────────────────────────────── */
  /* First sentence of a passage, for the one-line summaries on Reflection.
     Splits on terminal punctuation followed by a capital, skipping the
     abbreviations that actually turn up in this copy ("Sr. Director",
     "Q3.", initials) so a title doesn't get cut mid-phrase. */
  /* Reflection points a deck leaves out, keyed by study and matched on the
     point's lead-in. The case study itself still carries them — this only
     trims what gets a slide. */
  var CS_REFLECT_SKIP = {
    'video-recorder': ["Figma isn't dead"]
  };

  var SENTENCE_SAFE = /(?:Mr|Mrs|Ms|Dr|Sr|Jr|St|vs|etc|e\.g|i\.e|No|Fig|Inc|Co)$/;
  function firstSentence(str) {
    var s = String(str || '').replace(/\s+/g, ' ').trim();
    var re = /([.!?])["')\]]?\s+(?=[A-Z“"(])/g, m;
    while ((m = re.exec(s))) {
      var head = s.slice(0, m.index);
      // a single capital before the stop is an initial, not a sentence end
      if (SENTENCE_SAFE.test(head) || /(^|\s)[A-Z]$/.test(head)) continue;
      return s.slice(0, m.index + 1);
    }
    return s;
  }

  /* Reflection reads as a run of paragraphs in the case study, each opening
     with a bolded lead-in. On a slide those become columns: the lead-in is
     the card's heading, the first sentence of the paragraph its summary.
     Returns null if the section has no paragraphs to lay out. */
  function reflectionSlideFrom(nodes, label, key) {
    var skip = CS_REFLECT_SKIP[key] || [];
    var cards = [];
    nodes.forEach(function (n) {
      if (n.nodeType !== 1 || n.tagName !== 'P') return;
      var p = n.cloneNode(true);
      var head = null;
      var first = p.firstElementChild;
      // Only a <strong> that opens the paragraph is a heading; a bolded
      // phrase further in is emphasis and stays in the body.
      if (first && first.tagName === 'STRONG' && !(p.firstChild.nodeType === 3 && p.firstChild.textContent.trim())) {
        head = first.textContent.replace(/[.:]\s*$/, '').trim();
        first.parentNode.removeChild(first);
      }
      if (head && skip.indexOf(head) >= 0) return;
      var body = firstSentence(p.textContent);
      if (!head && !body) return;
      cards.push(el('article.deck-reflect-card', null, [
        head ? el('h3.deck-reflect-head', null, [head]) : null,
        body ? el('p.deck-reflect-body', null, [body]) : null
      ].filter(Boolean)));
    });
    if (!cards.length) return null;
    return el('section.deck-slide.deck-slide--cs.deck-slide--reflect', { 'data-label': label }, [
      el('h2.deck-title', null, ['Reflection']),
      el('div.deck-reflect-grid', null, cards)
    ]);
  }

  /* Every study's Overview lists a "Role:" bullet that reads as one long
     sentence. It carries more weight as its own slide, so we lift it out of
     the Overview list and split it into the role itself plus what it owned.
     Returns null when a study has no Role bullet. */
  function roleSlideFrom(nodes, label) {
    var li = null;
    nodes.forEach(function (n) {
      if (li || n.nodeType !== 1) return;
      Array.prototype.forEach.call(n.querySelectorAll ? n.querySelectorAll('li') : [], function (cand) {
        if (li) return;
        var strong = cand.querySelector('strong');
        if (strong && /^role:?$/i.test(strong.textContent.trim())) li = cand;
      });
    });
    if (!li) return null;

    var strongEl = li.querySelector('strong');
    var body = li.textContent.replace(strongEl ? strongEl.textContent : '', '').trim();
    li.parentNode.removeChild(li);          // it lives on its own slide now

    // "Design lead, owned the data narrative, the lifecycle framing, and …"
    // → title "Design lead", then one bullet per clause.
    var cut = body.indexOf(',');
    var title = cut > 0 ? body.slice(0, cut).trim() : body.replace(/\.$/, '').trim();
    var rest = cut > 0 ? body.slice(cut + 1) : '';
    var items = rest.split(/[,;]|\band\b/)
      .map(function (s) { return s.replace(/\.$/, '').trim(); })
      .filter(function (s) { return s.length > 1; })
      .map(function (s) { return s.charAt(0).toUpperCase() + s.slice(1); });

    var right = el('div.deck-role-body', null, [
      el('p.deck-role-title', null, [title]),
      el('ul.deck-role-list', null, items.map(function (t) { return el('li', null, [t]); }))
    ]);
    return titleSideSlide(label, 'Role', right, '.deck-slide--role');
  }

  function buildCaseStudySlides(key) {
    // Deck-only studies are hand-built, not split out of a written case study.
    var only = DECK_ONLY_STUDIES[key];
    if (only) return { title: only.title, slides: only.build() };

    var data = window.CASE_STUDIES && window.CASE_STUDIES[key];
    if (!data || !data.body) return null;

    var tmp = document.createElement('div');
    tmp.innerHTML = data.body;

    var groups = [];
    var group = { label: null, nodes: [] };
    Array.prototype.slice.call(tmp.childNodes).forEach(function (n) {
      var isH2 = n.nodeType === 1 && n.tagName === 'H2';
      if (isH2) {
        if (group.nodes.length) groups.push(group);
        group = { label: n.textContent.trim(), nodes: [n] };
      } else {
        group.nodes.push(n);
      }
    });
    if (group.nodes.length) groups.push(group);
    if (!groups.length) return null;

    var slides = [];
    var roleSlide = null;      // built from the Overview list, placed below
    groups.forEach(function (g, i) {
      // Split each section: text stays on the section slide; media becomes
      // its own slide with a caption placeholder. A carousel is one slide
      // with its frames side by side — on a deck you see them all at once
      // instead of paging through the same story four times.
      var textNodes = [], mediaEls = [];
      g.nodes.forEach(function (n) {
        if (n.nodeType !== 1) { textNodes.push(n); return; }
        var found = (n.tagName === 'IMG' || n.tagName === 'VIDEO')
          ? [n] : Array.prototype.slice.call(n.querySelectorAll('img, video'));
        var isCarousel = n.classList && n.classList.contains('cs-carousel');
        if (found.length && isCarousel && found.length > 1) mediaEls.push(found);
        else if (found.length) found.forEach(function (m) { mediaEls.push([m]); });
        else textNodes.push(n);
      });

      var label = i === 0 ? (data.title || 'Overview') : (g.label || ('Section ' + (i + 1)));
      if (i === 0) {
        // Cover: title in the left column; the description sits bottom-right
        // in front of the device placeholder, over a scrim that fades up so
        // the device reads as emerging from the background.
        var h1n = null, deckn = null;
        textNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.tagName === 'H1' && !h1n) h1n = n;
          else if (n.classList && n.classList.contains('cs-deck') && !deckn) deckn = n;
        });
        /* A deck-only cover image when the study has one (CS_COVER_ART),
           otherwise the device mock. The study's own hero art stays where
           it is in the body — it still gets its own slide. */
        var coverSrc = CS_COVER_ART[key];
        var coverArt;
        if (coverSrc && CS_COVER_IN_LAPTOP.indexOf(key) >= 0) {
          coverArt = laptopFrame('', coverSrc);
          coverArt.classList.add('deck-cs-device', 'deck-cs-device--laptop');
          coverArt.setAttribute('aria-hidden', 'true');
        } else if (coverSrc) {
          coverArt = el('div.deck-cs-cover-art', { 'aria-hidden': 'true' }, [el('img', { src: coverSrc, alt: '' })]);
          // Art that is already a phone render stands in for the mock, so it
          // gets the phone's narrow slot rather than the wide landscape one.
          if (deviceFor(key) === 'phone') coverArt.classList.add('deck-cs-cover-art--phone');
        } else if (deviceFor(key) === 'desktop') {
          // Desktop studies open on the MacBook template rather than the
          // drawn browser window — same slot, same entrance.
          coverArt = laptopFrame('Screenshot');
          coverArt.classList.add('deck-cs-device', 'deck-cs-device--laptop');
          coverArt.setAttribute('aria-hidden', 'true');
        } else {
          coverArt = deviceMock(deviceFor(key));
        }
        var coverKids = [
          coverArt,
          el('div.deck-cs-paper', null, [el('div.cs-main', null, [h1n].filter(Boolean))])
        ];
        if (deckn) coverKids.push(el('div.deck-cs-cover-desc', null, [deckn]));
        slides.push(el('section.deck-slide.deck-slide--cs.deck-slide--cs-title', { 'data-label': label }, coverKids));
      } else {
        // Lift the Role bullet out before the section slide is built, so it
        // isn't listed twice — it becomes its own slide immediately after.
        if (label === 'Overview') roleSlide = roleSlideFrom(textNodes, 'Role');
        // Reflection lays out as columns rather than a wall of paragraphs.
        var reflect = label === 'Reflection' ? reflectionSlideFrom(textNodes, label, key) : null;
        if (reflect) {
          slides.push(reflect);
        } else {
          var mainT = el('div.cs-main');
          textNodes.forEach(function (n) { mainT.appendChild(n); });
          slides.push(el('section.deck-slide.deck-slide--cs', { 'data-label': label }, [el('div.deck-cs-paper', null, [mainT])]));
        }
      }

      // Sections whose screenshots present inside the MacBook template
      // rather than as bare images on the slide.
      var inLaptop = (CS_LAPTOP_MEDIA[key] || []).indexOf(label) >= 0;
      var splitLaptop = (CS_LAPTOP_SPLIT_MEDIA[key] || []).indexOf(label) >= 0;

      // The cover's own hero art, when the cover already opens on it.
      if (i === 0 && CS_SKIP_COVER_MEDIA.indexOf(key) >= 0) mediaEls = [];

      mediaEls.forEach(function (group) {
        var body;
        // Caption on the left, the machine bleeding off the right edge.
        if (splitLaptop && group.length === 1 && group[0].tagName === 'IMG') {
          var src = group[0].getAttribute('src');
          // No written caption yet → the machine carries the slide alone,
          // rather than announcing a placeholder in the left rail.
          var cap = CS_CAPTIONS[String(src || '').split('/').pop()];
          slides.push(el('section.deck-slide.deck-slide--titlefig.deck-slide--laptop.deck-slide--capfig',
            { 'data-label': label + ' — image' }, [
              el('div.deck-titlefig', null, [
                el('div.deck-titlefig-copy', null,
                   cap ? [el('p.deck-body', null, [cap])] : []),
                laptopFrame('', src)
              ])
            ]));
          return;
        }
        if (group.length === 1 && group[0].tagName === 'VIDEO') {
          // No device frame: the recording is its own aspect, shown whole.
          body = el('figure.deck-cs-video', null, [group[0].cloneNode(true)]);
        } else if (inLaptop && group.length === 1 && group[0].tagName === 'IMG') {
          body = laptopFrame('', group[0].getAttribute('src'));
          body.classList.add('deck-laptop--media');
        } else {
          var figCls = 'figure.deck-cs-media' + (group.length > 1 ? '.deck-cs-media--row' : '');
          body = el(figCls, null, group.map(function (m) { return m.cloneNode(true); }).concat([
            el('figcaption.deck-cs-caption', null, [captionFor(group[0].getAttribute('src'))])
          ]));
        }
        slides.push(el('section.deck-slide.deck-slide--cs.deck-slide--cs-media', { 'data-label': label + ' — image' }, [body]));
      });
    });

    // Extra slides for this study, dropped in after their named section
    // (past that section's image slides, which carry the "— image" suffix).
    // Grouped by `after` and spliced in one go — inserting them one at a
    // time would resolve the same index each pass and reverse their order.
    var byAfter = {};
    (CS_EXTRA_SLIDES[key] || []).forEach(function (extra) {
      (byAfter[extra.after] = byAfter[extra.after] || []).push(extra.build());
    });
    Object.keys(byAfter).forEach(function (after) {
      var at = -1;
      slides.forEach(function (s, si) {
        var lbl = s.getAttribute('data-label') || '';
        if (lbl === after || lbl === after + ' — image') at = si;
      });
      if (at >= 0) slides.splice.apply(slides, [at + 1, 0].concat(byAfter[after]));
    });

    /* Cover media that plays later in the deck: pull the slide out and drop
       it back in behind its named anchor. */
    var moveAfter = CS_COVER_MEDIA_AFTER[key];
    if (moveAfter) {
      var coverMediaLabel = (data.title || 'Overview') + ' — image';
      var fromAt = -1, toAt = -1;
      slides.forEach(function (s, si) {
        var lbl = s.getAttribute('data-label');
        if (fromAt < 0 && lbl === coverMediaLabel) fromAt = si;
        if (lbl === moveAfter) toAt = si;
      });
      if (fromAt >= 0 && toAt >= 0) {
        var moved = slides.splice(fromAt, 1)[0];
        slides.forEach(function (s, si) { if (s.getAttribute('data-label') === moveAfter) toAt = si; });
        slides.splice(toAt + 1, 0, moved);
      }
    }

    (CS_MOVE_AFTER[key] || []).forEach(function (mv) {
      var from = -1;
      slides.forEach(function (s2, si) { if (from < 0 && s2.getAttribute('data-label') === mv.label) from = si; });
      if (from < 0) return;
      var moved = slides.splice(from, 1)[0];
      var to = -1;
      slides.forEach(function (s2, si) { if (s2.getAttribute('data-label') === mv.after) to = si; });
      slides.splice(to >= 0 ? to + 1 : slides.length, 0, moved);
    });

    /* The Role slide goes in after the extras, so it lands directly behind
       the Overview slide rather than behind that section's extra slides. */
    if (roleSlide && CS_SKIP_ROLE.indexOf(key) < 0) {
      var ovAt = -1;
      slides.forEach(function (s, si) { if (ovAt < 0 && s.getAttribute('data-label') === 'Overview') ovAt = si; });
      slides.splice(ovAt >= 0 ? ovAt + 1 : 1, 0, roleSlide);
    }

    var skip = CS_SKIP_SECTIONS[key];
    if (skip) {
      slides = slides.filter(function (sl) { return skip.indexOf(sl.getAttribute('data-label')) < 0; });
    }

    // Closing slide — placeholder for end questions (copy TBD).
    slides.push(el('section.deck-slide.deck-slide--cs.deck-slide--cs-title.deck-slide--cs-outro', { 'data-label': 'Questions' }, [
      el('div.deck-cs-paper', null, [el('div.cs-main', null, [el('h1', null, ['Questions?'])])])
    ]));

    return { title: data.title || 'Case study', slides: slides };
  }

  /* Cover titles are set as large as the CSS allows, then stepped down
     only as far as needed to fit the slide. A 45-character title in a
     half-width column can't carry the same display size as a short one,
     so each cover lands at its own best size instead of clipping. */
  function fitCoverTitle(slide) {
    if (!slide) return;
    var h1 = slide.querySelector('.cs-main h1');
    if (!h1) return;
    h1.style.fontSize = '';           // back to the CSS size before measuring
    var scs = getComputedStyle(slide);
    var avail = slide.clientHeight -
      parseFloat(scs.paddingTop) - parseFloat(scs.paddingBottom);
    if (!(avail > 0)) return;
    // The description sits below the title in the same column, so reserve
    // its height too.
    var sub = slide.querySelector('.deck-cs-paper .cs-main > .cs-deck');
    var size = parseFloat(getComputedStyle(h1).fontSize);
    var STRETCH = 1.5;                // matches transform: scaleY(1.5)
    // Shrink until the title fits the slide height AND stops overflowing
    // its column width (long unbreakable words like "RESTRUCTURING" can't
    // wrap).
    for (var i = 0; i < 80; i++) {
      var hcs = getComputedStyle(h1);
      var subH = sub ? sub.offsetHeight + parseFloat(getComputedStyle(sub).marginTop) : 0;
      var need = parseFloat(hcs.marginTop) +
                 h1.offsetHeight * STRETCH +
                 parseFloat(hcs.marginBottom) + subH;
      var fitsHeight = need <= avail;
      var fitsWidth = h1.scrollWidth <= h1.clientWidth + 1;
      if ((fitsHeight && fitsWidth) || size <= 26) break;
      size -= Math.max(2, size * 0.05);
      h1.style.fontSize = size + 'px';
    }
  }

  /* ── Deck controller ───────────────────────────────────────────── */
  var deck = null;          // root overlay element (built lazily)
  var stage, fillEl, nowEl, totalEl, prevBtn, nextBtn, hintEl, leftBtn;
  var slides = [];          // active slide elements
  var current = 0;
  var mode = 'home';        // 'home' | 'cs'
  var currentCsKey = null;  // which case study is presenting (cs mode)
  var lastActive = null;    // last slide we ran on-activate hooks for
  var shellBuilt = false;
  var homeSlidesCache = null;
  var workIndex = 0;        // where the Work slide sits in the home deck

  function homeSlides() {
    if (!homeSlidesCache) {
      homeSlidesCache = HOME_BUILDERS.map(function (fn) {
        try { return fn(); } catch (e) { return null; }
      }).filter(Boolean);
      homeSlidesCache.forEach(function (s, i) {
        if (s.getAttribute('data-label') === 'Work') workIndex = i;
      });
    }
    return homeSlidesCache;
  }

  function ensureShell() {
    if (shellBuilt) return;

    stage = el('div.deck-stage', { role: 'region', 'aria-roledescription': 'presentation' });

    fillEl = el('div.deck-progress-fill');
    var progress = el('div.deck-progress', { 'aria-hidden': 'true' }, [fillEl]);

    leftBtn = el('button.deck-exit', { type: 'button' }, []);
    leftBtn.addEventListener('click', function () {
      if (mode === 'cs') back(); else close();
    });

    prevBtn = el('button.deck-arrow', {
      type: 'button', 'aria-label': 'Previous slide',
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'
    });
    nextBtn = el('button.deck-arrow', {
      type: 'button', 'aria-label': 'Next slide',
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>'
    });
    prevBtn.addEventListener('click', function () { go(current - 1); });
    nextBtn.addEventListener('click', function () { go(current + 1); });

    nowEl = el('span.deck-counter-now', null, ['1']);
    totalEl = el('span', null, ['1']);
    var counter = el('span.deck-counter', { 'aria-live': 'polite' }, [
      nowEl, document.createTextNode(' / '), totalEl
    ]);

    var controls = el('div.deck-controls', null, [
      leftBtn,
      el('div.deck-nav-group', null, [counter, prevBtn, nextBtn])
    ]);

    hintEl = el('div.deck-hint.is-hidden', null, []);
    hintEl.innerHTML =
      'Use <kbd>&larr;</kbd> <kbd>&rarr;</kbd> to move &middot; <kbd>G</kbd> for all slides &middot; <kbd>Esc</kbd> to exit';

    deck = el('div.deck', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Presentation', hidden: 'hidden' },
      [progress, hintEl, stage, controls]);
    document.body.appendChild(deck);

    // Click a work card while presenting → open that case study as slides.
    deck.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a[data-cs-key]');
      if (!link) return;
      e.preventDefault();
      var key = link.getAttribute('data-cs-key');
      if (key) openCaseStudy(key);
    });

    shellBuilt = true;
  }

  // Swap the active slide set into the shell.
  function mount(slideEls, opts) {
    opts = opts || {};
    mode = opts.mode || 'home';
    slides = slideEls;

    // Any deck swap dismisses a lingering entry hint (home re-shows it after).
    clearTimeout(hintTimer);
    if (hintEl) hintEl.classList.add('is-hidden');

    // Slides
    while (stage.firstChild) stage.removeChild(stage.firstChild);
    slides.forEach(function (s, i) {
      s.classList.remove('is-active', 'is-prev');
      s.setAttribute('aria-hidden', 'true');
      s.setAttribute('data-index', i);
      stage.appendChild(s);
    });

    // Left button label depends on mode
    while (leftBtn.firstChild) leftBtn.removeChild(leftBtn.firstChild);
    if (mode === 'cs') {
      leftBtn.classList.add('deck-exit--back');
      leftBtn.setAttribute('aria-label', 'Back to the main deck');
      leftBtn.innerHTML =
        '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg> Back to deck';
    } else {
      leftBtn.classList.remove('deck-exit--back');
      leftBtn.setAttribute('aria-label', 'Exit presentation');
      leftBtn.appendChild(document.createTextNode('Exit '));
      leftBtn.appendChild(el('kbd', null, ['Esc']));
    }

    deck.classList.toggle('deck--cs', mode === 'cs');
    totalEl.textContent = String(slides.length);
    current = Math.max(0, Math.min(slides.length - 1, opts.startAt || 0));
    render();
  }

  function render() {
    slides.forEach(function (s, i) {
      s.classList.remove('is-active', 'is-prev', 'is-viz-in');
      if (i === current) s.classList.add('is-active');
      else if (i < current) s.classList.add('is-prev');
      s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      // Keyboard access: only the active slide is tabbable — `inert` takes
      // hidden slides (and their links) out of the tab order entirely.
      if (i === current) s.removeAttribute('inert');
      else s.setAttribute('inert', '');
      if (i === current) s.scrollTop = 0;
    });
    // Every case-study slide is dark now, so the chrome is always the
    // light-on-dark treatment.
    var activeSlide = slides[current];
    deck.classList.toggle('deck--dark-slide', true);

    // The moving grid shows only on the title, about, and case-study cover
    // slides (it keeps animating underneath, so the drift never resets).
    var GRID_ON = ['deck-slide--title', 'deck-slide--belief', 'deck-slide--places', 'deck-slide--cs-title'];
    deck.classList.toggle('deck--grid', !!(activeSlide && GRID_ON.some(function (c) {
      return activeSlide.classList.contains(c);
    })));

    var pct = slides.length > 1 ? (current / (slides.length - 1)) * 100 : 100;
    if (fillEl) fillEl.style.width = pct + '%';
    if (nowEl) nowEl.textContent = String(current + 1);
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;
    syncHash();

    // On-activate hooks (only when the active slide actually changes):
    // fit stretched cover/outro titles, and replay chart animations.
    if (activeSlide && activeSlide !== lastActive) {
      lastActive = activeSlide;
      // Marks the moment the viz panel has landed — the in-SVG builds
      // (stacked plates, sankey bars/flows) key off this, not .is-active,
      // so they don't play out behind a panel that's still fading up.
      afterVizIn(function () {
        if (activeSlide === lastActive) activeSlide.classList.add('is-viz-in');
      });
      if (activeSlide.classList.contains('deck-slide--cs-title')) fitCoverTitle(activeSlide);
      if (activeSlide.classList.contains('deck-slide--charts')) {
        afterVizIn(function () { animateCharts(activeSlide); });
      }
      if (activeSlide.classList.contains('deck-slide--places')) {
        initDeckGlobe(activeSlide);
        revealPlacesMedia(activeSlide);
      }
      if (activeSlide.classList.contains('deck-slide--diagram-full')) {
        requestAnimationFrame(function () { fitViewBox(activeSlide); });
        afterVizIn(function () { animateDiagram(activeSlide); });
      }
      if (activeSlide.classList.contains('deck-slide--statfigs') ||
          activeSlide.classList.contains('deck-slide--counts')) {
        afterVizIn(function () {
          activeSlide.querySelectorAll('.deck-statfig-val').forEach(countUp);
        });
      }
    }
  }

  // Mirror the current position into the URL (via replaceState, so it never
  // adds history entries or fires a hashchange) — a refresh reopens right
  // here instead of restarting at the home deck's first slide.
  //   home:        #present=<index>
  //   case study:  #present=cs.<key>.<index>
  function syncHash() {
    if (!deck || deck.hidden) return;
    var frag = (mode === 'cs' && currentCsKey)
      ? 'cs.' + currentCsKey + '.' + current
      : String(current);
    history.replaceState(null, '', location.pathname + '#present=' + frag);
  }

  // Keys of the [data-shared] elements a slide holds.
  function sharedKeys(slide) {
    var keys = {};
    if (slide) Array.prototype.forEach.call(slide.querySelectorAll('[data-shared]'),
      function (n) { keys[n.getAttribute('data-shared')] = 1; });
    return keys;
  }
  // Do two slides share a persistent element?
  function slidesShareElement(a, b) {
    if (!a || !b) return false;
    var ka = sharedKeys(a), kb = sharedKeys(b);
    return Object.keys(ka).some(function (k) { return kb[k]; });
  }

  // A [data-shared] element that sits at a different spot on the next slide
  // would otherwise jump the instant the slides swap. Measure it before the
  // swap and after, then run the incoming copy from the old position back to
  // its own (a FLIP) so the photo travels instead of teleporting.
  function sharedRects(slide) {
    var r = {};
    if (slide) Array.prototype.forEach.call(slide.querySelectorAll('[data-shared]'),
      function (n) { r[n.getAttribute('data-shared')] = n.getBoundingClientRect(); });
    return r;
  }
  function flipShared(before, toSlide) {
    if (!toSlide || reduce) return;
    // The globe slide drives its portrait with its own exit animation — an
    // inline transform here would fight it.
    if (toSlide.classList.contains('deck-slide--places')) return;
    Array.prototype.forEach.call(toSlide.querySelectorAll('[data-shared]'), function (n) {
      var a = before[n.getAttribute('data-shared')];
      if (!a) return;
      var b = n.getBoundingClientRect();
      var dx = a.left - b.left, dy = a.top - b.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      n.style.transition = 'none';
      n.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      void n.offsetWidth;                                  // reflow so the start sticks
      n.style.transition = 'transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)';
      n.style.transform = '';
      setTimeout(function () { n.style.transition = ''; n.style.transform = ''; }, 800);
    });
  }

  var cutTimer = null;
  function go(i) {
    if (!slides.length) return;
    i = Math.max(0, Math.min(slides.length - 1, i));
    // Cut (no transition) when leaving/arriving on slides that share an
    // element — e.g. the portrait on Intro → About stays put instead of
    // cross-fading.
    var cut = slidesShareElement(slides[current], slides[i]);
    var before = cut ? sharedRects(slides[current]) : null;
    if (cut) {
      deck.classList.add('deck--cut');
      clearTimeout(cutTimer);
      cutTimer = setTimeout(function () { deck.classList.remove('deck--cut'); }, 80);
    }
    current = i;
    render();
    if (cut) flipShared(before, slides[i]);
  }

  /* ── Overview: every slide in the deck, as live scaled previews ────
     Press G while presenting. Sections are the main flow ("Introduction")
     followed by one per case study. Each card holds a real slide element,
     rendered at full size inside a stage the same shape as the live one
     and scaled down — so a preview is the slide, not a picture of it. */
  var overview = null, ovGrid = null, ovCards = [], ovBase = null;

  // The case studies the Work slide links to, in the order it lists them.
  function caseStudyKeys() {
    var work = homeSlides()[workIndex];
    if (!work) return [];
    return Array.prototype.map.call(work.querySelectorAll('a[data-cs-key]'), function (a) {
      return a.getAttribute('data-cs-key');
    }).filter(Boolean);
  }

  function ovCard(slideEl, num, onPick) {
    var stageBox = el('div.deck-ov-stage', null, [slideEl]);
    slideEl.classList.add('is-active', 'is-viz-in');
    slideEl.removeAttribute('inert');
    slideEl.setAttribute('aria-hidden', 'true');
    var frame = el('div.deck-ov-frame', null, [stageBox]);
    var label = slideEl.getAttribute('data-label') || 'Slide';
    var btn = el('button.deck-ov-card', {
      type: 'button', 'aria-label': 'Slide ' + num + ' — ' + label
    }, [
      frame,
      // the deck's own position, so it matches the counter while presenting
      el('span.deck-ov-num', { 'aria-hidden': 'true' }, [String(num)])
    ]);
    btn.addEventListener('click', onPick);
    ovCards.push({ frame: frame, stage: stageBox });
    return btn;
  }

  function buildOverview() {
    ovCards = [];
    ovGrid = el('div.deck-ov-body');

    // Numbering runs straight through every section — the card number is
    // the slide's place in the whole presentation, not within its deck.
    var seq = 0;
    function section(title, slideEls, pick) {
      ovGrid.appendChild(el('h2.deck-ov-head', null, [title]));
      ovGrid.appendChild(el('div.deck-ov-grid', null, slideEls.map(function (s, i) {
        return ovCard(s, ++seq, function () { pick(i); });
      })));
    }

    // Home flow — cached elements are live in the stage, so preview clones.
    section('Introduction', homeSlides().map(function (s) { return s.cloneNode(true); }),
      function (i) { closeOverview(); openHome(i); });

    caseStudyKeys().forEach(function (key) {
      var cs = buildCaseStudySlides(key);
      if (!cs) return;
      section(cs.title, cs.slides, function (i) { closeOverview(); openCaseStudy(key, i); });
    });

    // Previews are for looking at, not listening to.
    Array.prototype.forEach.call(ovGrid.querySelectorAll('video'), function (v) {
      v.removeAttribute('autoplay'); v.pause && v.pause();
    });

    overview = el('div.deck-overview', { hidden: 'hidden' }, [
      el('div.deck-ov-bar', null, [
        el('p.deck-ov-title', null, ['Jump to a slide']),
        el('p.deck-ov-hint', { html: 'Press <kbd>G</kbd> or <kbd>Esc</kbd> to go back' })
      ]),
      ovGrid
    ]);
    deck.appendChild(overview);
  }

  /* Previews render at the live stage's size, then scale to the card. Run
     on open and on resize — the stage has no size until the deck is up. */
  function sizeOverview() {
    if (!overview || !stage) return;
    var W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;
    ovBase = { w: W, h: H };
    ovGrid.style.setProperty('--ov-ratio', W + ' / ' + H);
    ovCards.forEach(function (c) {
      c.stage.style.width = W + 'px';
      c.stage.style.height = H + 'px';
      c.stage.style.transform = 'scale(' + (c.frame.clientWidth / W) + ')';
    });
  }

  function openOverview() {
    if (!deck || deck.hidden) return;
    if (!overview) buildOverview();
    overview.hidden = false;
    deck.classList.add('deck--overview');
    sizeOverview();
  }
  function closeOverview() {
    if (!overview || overview.hidden) return;
    overview.hidden = true;
    deck.classList.remove('deck--overview');
  }
  function overviewOpen() { return !!overview && !overview.hidden; }

  var hintTimer = null;
  function showHint() {
    if (!hintEl) return;
    hintEl.classList.remove('is-hidden');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () { hintEl.classList.add('is-hidden'); }, 3200);
  }

  function reveal() {
    document.documentElement.classList.add('deck-mode');
    deck.hidden = false;
    deck.focus && deck.focus();
    document.addEventListener('keydown', onKey);
  }

  function openHome(startAt) {
    ensureShell();
    var hs = homeSlides();
    if (!hs.length) return;
    currentCsKey = null;
    reveal();
    mount(hs, { mode: 'home', startAt: startAt || 0 });
    if (window.track) window.track('present_open', {});
    showHint();
  }

  function openCaseStudy(key, startAt) {
    ensureShell();
    var cs = buildCaseStudySlides(key);
    if (!cs) return;
    currentCsKey = key;
    reveal();
    mount(cs.slides, { mode: 'cs', startAt: startAt || 0 });
    fitCoverTitle(cs.slides[0]);
    if (window.track) window.track('present_case_study', { case_study: key });
  }

  // Return from a case study to the home deck, landing on the Work slide.
  function back() {
    currentCsKey = null;
    mount(homeSlides(), { mode: 'home', startAt: workIndex });
  }

  function close() {
    if (!deck || deck.hidden) return;
    closeOverview();
    deck.hidden = true;
    document.documentElement.classList.remove('deck-mode');
    document.removeEventListener('keydown', onKey);
    // Clean the ?present flag / #present… hash so a refresh doesn't reopen.
    if (/[?&]present\b/.test(location.search) || /^#present/.test(location.hash)) {
      history.replaceState(null, '', location.pathname);
    }
    if (window.track) window.track('present_close', {});
  }

  function onKey(e) {
    if (e.key === 'g' || e.key === 'G') {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (overviewOpen()) closeOverview(); else openOverview();
      return;
    }
    // While the overview is up it owns the keyboard: Esc closes it, and
    // slide navigation stays put behind it.
    if (overviewOpen()) {
      if (e.key === 'Escape') { e.preventDefault(); closeOverview(); }
      return;
    }
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': case 'Spacebar':
        e.preventDefault(); go(current + 1); break;
      case 'ArrowLeft': case 'PageUp':
        e.preventDefault(); go(current - 1); break;
      case 'Home': e.preventDefault(); go(0); break;
      case 'End': e.preventDefault(); go(slides.length - 1); break;
      case 'Escape':
        e.preventDefault();
        if (mode === 'cs') back(); else close();
        break;
    }
  }

  // Public toggle: nav button, ?present, or the P key.
  function toggle() {
    if (deck && !deck.hidden) close(); else openHome(0);
  }
  window.HWDeck = { open: openHome, openCaseStudy: openCaseStudy, close: close, toggle: toggle };

  // Nav trigger
  var trigger = $('[data-present]');
  if (trigger) trigger.addEventListener('click', function (e) {
    e.preventDefault(); openHome(0);
  });

  // Press "P" to present (ignore while typing in a field).
  document.addEventListener('keydown', function (e) {
    if (deck && !deck.hidden) return; // in-deck keys handled by onKey
    if (e.key !== 'p' && e.key !== 'P') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName))) return;
    e.preventDefault();
    openHome(0);
  });

  // Cover titles get a px size from the fitter, so re-fit on resize.
  var refitTimer = null;
  window.addEventListener('resize', function () {
    if (mode !== 'cs' || !deck || deck.hidden || !slides.length) return;
    clearTimeout(refitTimer);
    refitTimer = setTimeout(function () {
      var a = slides[current];
      if (a && a.classList.contains('deck-slide--cs-title')) fitCoverTitle(a);
    }, 120);
  });

  // Preview scale is measured, so it has to be re-measured on resize.
  var ovResizeTimer = null;
  window.addEventListener('resize', function () {
    if (!overviewOpen()) return;
    clearTimeout(ovResizeTimer);
    ovResizeTimer = setTimeout(sizeOverview, 120);
  });

  // Deep link / refresh restore: reopen the deck at the saved position.
  //   #present=cs.<key>.<n> → that case study, slide n
  //   #present=<n>          → home deck, slide n
  //   ?present or bare #present → home deck, slide 1
  (function restoreFromUrl() {
    var m = location.hash.match(/^#present=(.+)$/);
    if (m) {
      var cs = m[1].match(/^cs\.([a-z0-9-]+)\.(\d+)$/i);
      if (cs) { openCaseStudy(cs[1], parseInt(cs[2], 10)); return; }
      if (/^\d+$/.test(m[1])) { openHome(parseInt(m[1], 10)); return; }
    }
    if (/[?&]present\b/.test(location.search) || /^#present/.test(location.hash)) {
      openHome(0);
    }
  })();
})();
