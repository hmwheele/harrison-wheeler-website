/* =====================================================================
   story.js — "My story" timeline page
   1) Reveal elements (fade IN on enter, fade OUT on leave) on scroll
   2) Scroll-driven Mapbox globe lighting up places visited in Asia
   Loaded after main.js (which handles nav, mobile menu, footer year).
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Small / touch screens: the pinned (position:sticky) scroll-driven WebGL globe
  // stalls rAF during momentum scroll on mobile (iOS especially), so the globe
  // appears to freeze. On these devices we skip the scroll journey and show the
  // lightweight auto-rotating globe in normal page flow instead.
  var isMobile = !!(window.matchMedia &&
    (window.matchMedia('(max-width: 860px)').matches ||
     window.matchMedia('(hover: none) and (pointer: coarse)').matches));

  /* ── 1. Fade in / fade out on scroll ─────────────────────────── */
  (function () {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    // No IntersectionObserver, or reduced motion → just show everything.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    // Reveal each row's photo + text (and year) together. Observing the whole
    // row instead of each element keeps them in sync — important on mobile, where
    // the row is stacked and per-element timing looks disjointed against the scroll.
    function setIn(target, on) {
      if (target.hasAttribute('data-reveal')) target.classList.toggle('in', on);
      target.querySelectorAll('[data-reveal]').forEach(function (r) { r.classList.toggle('in', on); });
    }

    // Fade IN once a row is meaningfully in view; fade OUT only after it has
    // fully left the viewport. In between (partly visible, under the threshold)
    // nothing changes — so a row still on screen is never faded out. Scrolling
    // back up therefore only fades the row you've actually scrolled away from,
    // not the ones still in view.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && en.intersectionRatio >= 0.12) {
          setIn(en.target, true);
        } else if (!en.isIntersecting) {
          setIn(en.target, false);
        }
      });
    }, { threshold: [0, 0.12, 0.6] });

    var observed = [];
    els.forEach(function (el) {
      var target = el.closest('.tl-row') || el;   // group reveals by their row
      if (observed.indexOf(target) === -1) { observed.push(target); io.observe(target); }
    });
  })();

  /* ── 1b. Blurred image behind each card: duplicate + parallax ── */
  (function () {
    var rows = document.querySelectorAll('.tl-row');
    if (!rows.length) return;

    var cards = [];
    rows.forEach(function (row) {
      var card = row.querySelector('.tl-card');
      if (!card) return;
      cards.push(card);

      // Mirror the row's own photo as the blurred backdrop once it loads.
      // If the image is missing/404s, leave the CSS gradient placeholder.
      var img = row.querySelector('.tl-media img');
      if (!img) return;
      var media = img.closest('.tl-media');
      var apply = function () {
        if (img.naturalWidth > 0) {
          card.style.setProperty('--tl-card-img', 'url("' + (img.currentSrc || img.src) + '")');
          if (media) {
            media.classList.add('has-photo');            // conform well to the photo
            if (img.naturalHeight > img.naturalWidth) {  // cap width on tall/portrait photos
              media.classList.add('is-portrait');
            }
          }
        }
      };
      if (img.complete) apply(); else img.addEventListener('load', apply);
    });

    if (reduceMotion) return;

    var PARALLAX = 60; // total travel range in px
    var ticking = false;
    function update() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      cards.forEach(function (card) {
        var r = card.getBoundingClientRect();
        // -0.5 (below viewport) → +0.5 (above); 0 at vertical centre
        var rel = (vh / 2 - (r.top + r.height / 2)) / vh;
        card.style.setProperty('--tl-parallax', (rel * PARALLAX).toFixed(1) + 'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  /* ── 1c. Fade the hero intro as it scrolls up out of view ────── */
  (function () {
    if (reduceMotion) return;
    var els = Array.prototype.slice.call(
      document.querySelectorAll('.story-head-text > h1, .story-head-text > .story-tagline, .story-head-text > .story-intro'));
    if (!els.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var start = 80;                          // fully visible until its top passes 80px from the top
        if (r.top >= start) { if (el.style.opacity) el.style.opacity = ''; return; }
        var o = (r.top + r.height) / (start + r.height);   // 1 at the threshold → 0 once above the top
        el.style.opacity = (o < 0 ? 0 : o > 1 ? 1 : o).toFixed(3);
      });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  /* ── 2. Asia globe ───────────────────────────────────────────── */
  // Places that light up. Edit freely — lat/lng in decimal degrees.
  // (Seeded defaults — swap in your real itinerary.)
  var PLACES = [
    { city: 'Tokyo',           country: 'Japan',       lat:  35.6762, lng: 139.6503 },
    { city: 'Kyoto',           country: 'Japan',       lat:  35.0116, lng: 135.7681 },
    { city: 'Busan',           country: 'South Korea', lat:  35.1796, lng: 129.0756 },
    { city: 'Seoul',           country: 'South Korea', lat:  37.5665, lng: 126.9780 },
    { city: 'Jeju',            country: 'South Korea', lat:  33.4996, lng: 126.5312 },
    { city: 'Shanghai',        country: 'China',       lat:  31.2304, lng: 121.4737 },
    { city: 'Chengdu',         country: 'China',       lat:  30.5728, lng: 104.0668 },
    { city: 'Chongqing',       country: 'China',       lat:  29.4316, lng: 106.9123 },
    { city: 'Hong Kong',       country: 'China',       lat:  22.3193, lng: 114.1694 },
    { city: 'Taipei',          country: 'Taiwan',      lat:  25.0330, lng: 121.5654 },
    { city: 'Kaohsiung',       country: 'Taiwan',      lat:  22.6273, lng: 120.3014 },
    { city: 'Hanoi',           country: 'Vietnam',     lat:  21.0278, lng: 105.8342 },
    { city: 'Da Nang',         country: 'Vietnam',     lat:  16.0544, lng: 108.2022 },
    { city: 'Bangkok',         country: 'Thailand',    lat:  13.7563, lng: 100.5018 },
    { city: 'Ho Chi Minh City',country: 'Vietnam',     lat:  10.8231, lng: 106.6297 },
    { city: 'Singapore',       country: 'Singapore',   lat:   1.3521, lng: 103.8198 },
    { city: 'Bali',            country: 'Indonesia',   lat:  -8.4095, lng: 115.1889 },
    { city: 'Sydney',          country: 'Australia',   lat: -33.8688, lng: 151.2093 }
  ];

  // Home base — the trip starts here. Shown on the globe as its own marker/label,
  // but kept out of PLACES so it isn't treated as a journey stop.
  var HOME = { city: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194 };
  // Everything that gets a dot + label on the globe: home base, then every stop.
  var MARKERS = [HOME].concat(PLACES);

  var wrap = document.getElementById('globe-wrap');
  var mount = document.getElementById('globe');
  if (!wrap || !mount) return;

  // Build the starfield once (spread across the stage). Opacity stays 0 until
  // the globe docks — see apply() / the static fallback below.
  var starsEl = document.querySelector('[data-globe-stars]');
  (function makeStars() {
    if (!starsEl || starsEl.childElementCount) return;
    for (var i = 0; i < 90; i++) {
      var st = document.createElement('span');
      st.className = 'globe-star';
      var size = Math.random() < 0.16 ? 2 : 1;
      st.style.left = (Math.random() * 100).toFixed(2) + '%';
      st.style.top = (Math.random() * 100).toFixed(2) + '%';
      st.style.width = size + 'px';
      st.style.height = size + 'px';
      st.style.opacity = (0.25 + Math.random() * 0.7).toFixed(2);
      starsEl.appendChild(st);
    }
  })();

  function showFallback() {
    wrap.classList.add('no-webgl');
    var sec = document.getElementById('globe-scrolly');
    if (sec) sec.classList.add('is-static');
  }

  // Bail to the text fallback if WebGL isn't available. Mapbox GL v3 needs
  // WebGL2; where only WebGL1 exists (older iOS Safari, Lockdown Mode) we
  // load the v2 line instead, which still supports the globe projection.
  var hasWebGL2 = false;
  try {
    var test = document.createElement('canvas');
    hasWebGL2 = !!(window.WebGL2RenderingContext && test.getContext('webgl2'));
    var hasWebGL1 = !!(window.WebGLRenderingContext &&
          (test.getContext('webgl') || test.getContext('experimental-webgl')));
    if (!hasWebGL2 && !hasWebGL1) {
      console.warn('[globe] no WebGL context available — showing text fallback');
      showFallback();
      return;
    }
  } catch (e) { console.warn('[globe] WebGL probe threw — text fallback', e); showFallback(); return; }

  /* ── Config ─────────────────────────────────────────────────────
     Mapbox public access token (starts with "pk."). Get one from
     https://account.mapbox.com/access-tokens/ and restrict it to your
     site's domain(s) in the Mapbox dashboard before shipping. Until a
     real token is wired in, the globe degrades to the text city list. */
  var MAPBOX_TOKEN = 'pk.eyJ1IjoiaG13aGVlbGUiLCJhIjoiY21yZXpzMzk3MHQ4NDJ3b282YmQzZzFoYyJ9.eMJQn_b6U2Fl3uD4IOEJnw';
  var MAP_STYLE    = 'mapbox://styles/mapbox/dark-v11';
  var ACCENT       = '#d0bcff';
  // v3 requires WebGL2 — fall back to the v2 line on WebGL1-only browsers.
  var GL_VER       = hasWebGL2 ? 'v3.9.3' : 'v2.15.0';

  // Load Mapbox GL JS (+ its CSS) from CDN, then init.
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://api.mapbox.com/mapbox-gl-js/' + GL_VER + '/mapbox-gl.css';
  document.head.appendChild(link);

  var s = document.createElement('script');
  s.src = 'https://api.mapbox.com/mapbox-gl-js/' + GL_VER + '/mapbox-gl.js';
  s.async = true;
  s.onerror = function () {
    console.warn('[globe] Mapbox GL JS failed to load from CDN (blocked or offline?) — text fallback');
    showFallback();
  };
  s.onload = initGlobe;
  document.head.appendChild(s);

  function initGlobe() {
    var mapboxgl = window.mapboxgl;
    if (!mapboxgl || (mapboxgl.supported && !mapboxgl.supported())) { showFallback(); return; }
    // No real token yet → show the text fallback rather than a blank/erroring map.
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN.indexOf('pk.') !== 0) { showFallback(); return; }
    mapboxgl.accessToken = MAPBOX_TOKEN;

    var SF = HOME;                          // home base — globe starts here (also a marker)
    var ASIA = { lat: 18, lng: 110 };

    // Camera as Mapbox zoom levels (center + zoom, not orbit altitude).
    // Higher = closer. Tuned so the whole globe fits below the header (FAR),
    // the Asia region spans the width during the journey (NEAR), and the
    // docked dome sits comfortably at the bottom (DOCK_ALT).
    var FAR      = 1.35;   // zoomed-out whole globe
    var NEAR     = 3.30;   // zoomed-in region (the journey)
    var DOCK_ALT = 2.15;   // docked half-globe at the bottom

    var map;
    try {
      map = new mapboxgl.Map({
        container: mount,
        style: MAP_STYLE,
        projection: 'globe',
        center: [SF.lng, SF.lat],
        zoom: FAR,
        bearing: 0,
        pitch: 0,
        interactive: false,                // scroll fully drives the camera
        antialias: true,
        fadeDuration: 0,                   // no cross-fade flicker as tiles swap
        renderWorldCopies: false,
        dragRotate: false
      });
    } catch (err) {
      console.warn('[globe] Mapbox Map construction failed (WebGL context?) — text fallback', err);
      showFallback(); return;
    }

    map.on('error', function () {});       // swallow transient tile/style hiccups

    map.on('load', function () {
      // If decoration/journey setup trips partway (e.g. terrain on a
      // memory-constrained mobile GPU), keep the globe we already have —
      // don't demote a working globe to the text fallback.
      try { onReady(mapboxgl, map, SF, ASIA, FAR, NEAR, DOCK_ALT); }
      catch (err) { console.warn('[globe] post-load setup failed — continuing with plain globe', err); }
    });
  }

  function onReady(mapboxgl, map, SF, ASIA, FAR, NEAR, DOCK_ALT) {
    // Transparent space + dark low fog so the globe floats over the page (the
    // blackout/finale background) instead of sitting on a filled rectangle.
    try {
      map.setFog({
        color: 'rgba(12,14,22,0.9)',
        'high-color': 'rgba(32,36,60,0.5)',
        'horizon-blend': 0.02,
        'space-color': 'rgba(0,0,0,0)',        // transparent → the earth floats over the page
        'star-intensity': 0
      });
    } catch (e) {}
    try { map.setPaintProperty('background', 'background-color', 'rgba(0,0,0,0)'); } catch (e) {}

    // Hide only the base style's own place labels (country / city / water names)
    // — the country / state border lines stay on to give geographic context.
    // The only labels on the globe should be our custom stop markers.
    try {
      map.getStyle().layers.forEach(function (l) {
        if (l.type === 'symbol') { try { map.setLayoutProperty(l.id, 'visibility', 'none'); } catch (e) {} }
      });
    } catch (e) {}

    // 3D topography: displace the globe surface from a terrain DEM and shade it,
    // so mountain ranges read as real relief on the grayscale globe (the camera
    // also pitches during the journey — see apply() — so the 3D is visible).
    try {
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512, maxzoom: 14
        });
      }
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.25 });
      map.addLayer({
        id: 'hillshade', type: 'hillshade', source: 'mapbox-dem',
        paint: {
          'hillshade-exaggeration': 0.6,
          'hillshade-shadow-color': '#000000',
          'hillshade-highlight-color': '#464b57',
          'hillshade-accent-color': '#0a0b10'
        }
      });
    } catch (e) {}

    // ── Flight-path arcs: a curved line source drawn leg-by-leg ──
    function emptyFC() { return { type: 'FeatureCollection', features: [] }; }
    function lineFeat(coords) { return { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } }; }
    var GC_STEPS = 48;
    var ARC_BASE_OPACITY = 0.85;
    // Curved flight-hop arc between two points. A quadratic bezier whose control
    // point bows perpendicular to the leg, so lines lift off like flight-map
    // routes instead of hugging the surface. Longitudes are unwrapped to the
    // shortest way round, so e.g. Tokyo → San Francisco hops across the Pacific
    // rather than sweeping over the pole. Bow scales with leg length (subtle for
    // short hops, more pronounced for long hauls), capped so it stays elegant.
    function flightArc(a, b, n) {
      var lng0 = a[0], lat0 = a[1];
      var dLng = ((b[0] - lng0 + 540) % 360) - 180;   // shortest way (handles antimeridian)
      var lng1 = lng0 + dLng, lat1 = b[1];
      var dx = lng1 - lng0, dy = lat1 - lat0;
      var chord = Math.sqrt(dx * dx + dy * dy);
      if (chord < 1e-6) return [[lng0, lat0], [lng1, lat1]];
      var nx = -dy / chord, ny = dx / chord;          // perpendicular unit vector…
      if (ny < 0) { nx = -nx; ny = -ny; }             // …flipped so the arc bows "up" on the map
      var bow = chord * Math.min(0.22, 0.10 + chord * 0.004);
      var cx = (lng0 + lng1) / 2 + nx * bow;          // bezier control point
      var cy = (lat0 + lat1) / 2 + ny * bow;
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var t = i / n, u = 1 - t;
        pts.push([u * u * lng0 + 2 * u * t * cx + t * t * lng1,
                  u * u * lat0 + 2 * u * t * cy + t * t * lat1]);
      }
      return pts;
    }

    map.addSource('route', { type: 'geojson', data: emptyFC() });
    // Dark casing under the white line so it stays legible over bright satellite
    // terrain (deserts, snow) as well as dark ocean.
    map.addLayer({
      id: 'route-casing', type: 'line', source: 'route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': 'rgba(0,0,0,0.55)', 'line-width': 3.6, 'line-blur': 0.8, 'line-opacity': ARC_BASE_OPACITY }
    });
    map.addLayer({
      id: 'route-line', type: 'line', source: 'route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#ffffff', 'line-width': 1.6, 'line-opacity': ARC_BASE_OPACITY, 'line-blur': 0.2 }
    });
    var routeSrc = map.getSource('route');

    // ── City points: soft accent glow + a bright core ──
    map.addSource('markers', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: MARKERS.map(function (d) {
        return { type: 'Feature', geometry: { type: 'Point', coordinates: [d.lng, d.lat] }, properties: {} };
      }) }
    });
    map.addLayer({
      id: 'marker-glow', type: 'circle', source: 'markers',
      paint: { 'circle-radius': 11, 'circle-color': ACCENT, 'circle-blur': 1, 'circle-opacity': 0.5 }
    });
    map.addLayer({
      id: 'marker-core', type: 'circle', source: 'markers',
      paint: {
        'circle-radius': 3.4, 'circle-color': ACCENT, 'circle-opacity': 1,
        'circle-stroke-width': 1.2, 'circle-stroke-color': 'rgba(255,255,255,0.9)'
      }
    });

    // ── City labels: HTML markers so we keep the site font (GT America) ──
    // Reuse the same .globe-label markup the CSS already styles. Mapbox fades
    // markers on the far side of the globe out (opacityWhenCovered).
    var labelEls = [];
    MARKERS.forEach(function (d, i) {
      var anchor = document.createElement('div');
      anchor.className = 'globe-label-anchor';
      anchor.dataset.idx = i - 1;             // which leg must finish first (home base = -1)
      var el = document.createElement('div');
      el.className = 'globe-label';
      el.textContent = d.city;
      anchor.appendChild(el);
      new mapboxgl.Marker({ element: anchor, anchor: 'center', opacityWhenCovered: '0' })
        .setLngLat([d.lng, d.lat]).addTo(map);
      labelEls.push(anchor);
    });

    function setMarkersVisible(v) {
      var vis = v ? 'visible' : 'none';
      try {
        map.setLayoutProperty('marker-glow', 'visibility', vis);
        map.setLayoutProperty('marker-core', 'visibility', vis);
      } catch (e) {}
      for (var i = 0; i < labelEls.length; i++) labelEls[i].style.display = v ? '' : 'none';
    }
    function setArcOpacity(a) {
      var o = +(ARC_BASE_OPACITY * a).toFixed(3);
      try { map.setPaintProperty('route-line', 'line-opacity', o); } catch (e) {}
      try { map.setPaintProperty('route-casing', 'line-opacity', o); } catch (e) {}
    }

    // Camera: Mapbox is center+zoom(+pitch), so lat/lng/zoom/pitch drives it directly.
    function setCam(lat, lng, zoom, pitch) { map.jumpTo({ center: [lng, lat], zoom: zoom, pitch: pitch || 0 }); }
    function resize() { try { map.resize(); } catch (e) {} }
    window.addEventListener('resize', resize, { passive: true });

    var section  = document.getElementById('globe-scrolly');
    var blackout = document.querySelector('[data-globe-blackout]');
    var intro    = document.querySelector('[data-globe-intro]');
    var placeEl  = document.querySelector('[data-globe-place]');
    var ctaEl    = document.querySelector('[data-globe-cta]');
    var yearEl     = document.querySelector('.globe-cta .cta-year');
    var yearLineEl = document.querySelector('.globe-cta .cta-tl-line');
    // "Let's work together" title, subtext + buttons — faded in with the 2026.
    // Opacity is set on each element (never the .globe-cta wrapper) so the wrapper
    // stays free of a stacking context and the title can still sit behind the globe.
    var ctaHeadEl    = document.querySelector('.globe-cta .section-head');
    var ctaSubEl     = document.querySelector('.globe-cta .head-sub');
    var ctaActionsEl = document.querySelector('.globe-cta .cta-actions');

    // The paragraph + buttons appear on a timed beat — half a second AFTER the
    // "Let's work together" title has fully revealed — rather than tracking scroll
    // position. Scrolling back up before the title lands cancels the pending reveal.
    var CTA_BODY_DELAY = 500;
    var ctaBodyShown = false, ctaBodyTimer = null;
    function setCtaBody(on) {
      if (ctaSubEl) ctaSubEl.style.opacity = on ? '1' : '0';
      if (ctaActionsEl) { ctaActionsEl.style.opacity = on ? '1' : '0'; ctaActionsEl.style.pointerEvents = on ? '' : 'none'; }
    }
    function revealCtaBody(titleFull) {
      if (titleFull) {
        if (!ctaBodyShown && ctaBodyTimer === null) {
          ctaBodyTimer = setTimeout(function () { ctaBodyTimer = null; ctaBodyShown = true; setCtaBody(true); }, CTA_BODY_DELAY);
        }
      } else {
        if (ctaBodyTimer !== null) { clearTimeout(ctaBodyTimer); ctaBodyTimer = null; }
        ctaBodyShown = false;
        setCtaBody(false);
      }
    }

    // ── Static fallback: reduced motion or no scrolly section ──
    // (Mobile gets the full scroll journey too — modern iOS Safari keeps
    // dispatching scroll events through momentum scrolling, so the old
    // "rAF stalls on mobile" concern no longer applies.)
    if (reduceMotion || !section) {
      if (section) section.classList.add('is-static');
      if (starsEl) starsEl.style.opacity = '1';   // globe is shown in place → stars on
      resize();
      requestAnimationFrame(resize);
      routeSrc.setData({ type: 'FeatureCollection', features: (function () {
        var f = [];
        for (var i = 0; i < PLACES.length; i++) {
          var a = i === 0 ? SF : PLACES[i - 1];
          f.push(lineFeat(flightArc([a.lng, a.lat], [PLACES[i].lng, PLACES[i].lat], GC_STEPS)));
        }
        return f;
      })() });
      map.jumpTo({ center: [ASIA.lng, ASIA.lat], zoom: isMobile ? 1.7 : FAR });
      if (!reduceMotion) {
        var lastT = null, spinRAF;
        (function spin(ts) {
          if (!document.hidden) {
            if (lastT === null) lastT = ts;
            var dt = Math.min(80, ts - lastT); lastT = ts;
            var c = map.getCenter();
            map.jumpTo({ center: [c.lng - (isMobile ? 4 : 6) * dt / 1000, c.lat], zoom: map.getZoom() });
          } else { lastT = null; }
          spinRAF = requestAnimationFrame(spin);
        })();
        void spinRAF;
      }
      return;
    }

    // ── Scroll-driven journey (damped easing + smooth spline path) ───
    setCam(SF.lat, SF.lng, FAR);

    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function smooth(t) { return t * t * (3 - 2 * t); }
    // Smootherstep (Perlin): eases in AND out with zero velocity at both ends, so
    // the camera glides between cities but gently slows to a rest on each one
    // before moving on — no hard snap/jolt.
    function restEase(f) { return f * f * f * (f * (f * 6 - 15) + 10); }
    function at(i) { return PLACES[Math.max(0, Math.min(PLACES.length - 1, i))]; }
    // Interpolate longitude along the shortest way around the globe.
    function lerpLng(a, b, t) { return a + (((b - a + 540) % 360) - 180) * t; }
    // Catmull-Rom: a smooth curve through the city points (no hard corners).
    function spline(k, sel, t) {
      var p0 = at(k - 1)[sel], p1 = at(k)[sel], p2 = at(k + 1)[sel], p3 = at(k + 2)[sel];
      var t2 = t * t, t3 = t2 * t;
      return 0.5 * ((2 * p1) + (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
    }

    var ZIN = 0.12, ZOUT = 0.72;           // zoom-in ends / journey ends (then dock + CTA)
    var DOCK_END = 0.84;                    // globe finishes docking to the bottom by here
    var FREE_START = 0.93;                  // past here (→ footer) the earth spins freely + draggable
    var DOCK_SHIFT = 0.5;                   // drop the docked globe so its centre is at the bottom edge
    var SHIFT_VH = 0.18;                    // drop the zoomed-out globe below the header
    var DAMP = 0.08;                        // camera easing — lower = smoother / heavier
    var SPIN_DPS = 6;                       // intro idle rotation speed (deg/sec)
    var PITCH_MAX = 32;                     // camera tilt during the journey so 3D terrain reads (deg)
    var spin = 0, lastCity = -1;

    // Flight-path route: starts in San Francisco, then through every city.
    var ROUTE = [SF].concat(PLACES);
    var LEGS = ROUTE.length - 1;
    // Draw every leg, including leg 0 (San Francisco → first city). The flight
    // arc bows it across the Pacific like a real flight hop rather than sweeping
    // a flat line over the pole, so it reads as intentional.
    var DRAW_FROM = 0;
    var lastArcKey = '';
    var arcAlpha = 1, arcFading = false, arcFadeT = 0, ARC_FADE_MS = 700;
    var arcDir = -1, arcFadeMs = ARC_FADE_MS;   // fade direction (-1 out / +1 in) and duration

    function fullRouteFC() {
      var f = [];
      for (var i = DRAW_FROM; i < LEGS; i++) {
        f.push(lineFeat(flightArc([ROUTE[i].lng, ROUTE[i].lat], [ROUTE[i + 1].lng, ROUTE[i + 1].lat], GC_STEPS)));
      }
      return { type: 'FeatureCollection', features: f };
    }
    // Draw the route up to `rp` legs — the current (fractional) leg is drawn
    // partway, so the line extends as the user scrolls instead of snapping in.
    function setRouteArcs(rp) {
      rp = Math.max(0, Math.min(LEGS, rp));
      var full = Math.floor(rp);
      var frac = Math.round((rp - full) * 40) / 40;   // quantize to limit rebuilds
      var key = full + ':' + frac;
      if (key === lastArcKey) return;
      lastArcKey = key;
      var feats = [], i;
      for (i = DRAW_FROM; i < full; i++) {             // completed legs (full arcs); leg 0 (SF→) skipped
        feats.push(lineFeat(flightArc([ROUTE[i].lng, ROUTE[i].lat], [ROUTE[i + 1].lng, ROUTE[i + 1].lat], GC_STEPS)));
      }
      if (full >= DRAW_FROM && full < LEGS && frac > 0.001) {   // current leg, drawn partway (not the SF leg)
        var gc = flightArc([ROUTE[full].lng, ROUTE[full].lat], [ROUTE[full + 1].lng, ROUTE[full + 1].lat], GC_STEPS);
        var take = Math.max(2, Math.round((gc.length - 1) * frac) + 1);
        feats.push(lineFeat(gc.slice(0, take)));
      }
      routeSrc.setData({ type: 'FeatureCollection', features: feats });
    }

    // Show each city's label once its flight line is ≥80% of the way there.
    function updateLabels(rp, active) {
      for (var i = 0; i < labelEls.length; i++) {
        var idx = parseInt(labelEls[i].dataset.idx, 10) || 0;
        labelEls[i].classList.toggle('show', active && rp >= idx + 0.8);
      }
    }

    // Free mode (at the footer): fade out markers + lines, slow auto-spin, draggable.
    var freeMode = false, freeLat = 0, freeLng = 0, dragging = false, lastX = 0, lastY = 0;
    var FREE_SPIN = 5;                       // free-mode auto-rotation (deg/sec)
    var exitT = 0, EXIT_MS = 450;            // smooth glide-back when scrolling out of free mode
    function enterFree() {
      var c = map.getCenter();
      freeLat = c.lat; freeLng = c.lng;
      setMarkersVisible(false);              // markers fade out
      routeSrc.setData(fullRouteFC());
      arcFading = true; arcDir = -1; arcFadeMs = ARC_FADE_MS;   // flight lines fade out (not abrupt)
      arcFadeT = (1 - arcAlpha) * ARC_FADE_MS;
      lastArcKey = '__free__';
    }
    function exitFree(toLat, toLng, toZoom) {
      // Glide the camera from the free spin back to the docked orientation.
      map.easeTo({ center: [toLng, toLat], zoom: toZoom, pitch: 0, duration: EXIT_MS });
      exitT = EXIT_MS;
      setMarkersVisible(true);               // markers return (incl. home base)
      routeSrc.setData(fullRouteFC());
      arcFading = true; arcDir = 1; arcFadeMs = EXIT_MS;        // flight lines fade back in
      arcFadeT = arcAlpha * EXIT_MS;         // continue from the current (faded) alpha
      lastArcKey = '__exit__';
    }
    // Drag to rotate (only while the earth is free at the footer).
    mount.addEventListener('pointerdown', function (e) {
      if (!freeMode) return;
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      try { mount.setPointerCapture(e.pointerId); } catch (er) {}
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      freeLng -= (e.clientX - lastX) * 0.3;
      freeLat = Math.max(-85, Math.min(85, freeLat + (e.clientY - lastY) * 0.3));
      lastX = e.clientX; lastY = e.clientY;
    }, { passive: true });
    window.addEventListener('pointerup', function () { dragging = false; });

    function progress() {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var total = rect.height - vh;
      return clamp01(total > 0 ? (-rect.top) / total : 0);
    }

    function apply(p) {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var lat, lng, zoom, pitch = 0, dark, introOp, shift, showPlace = false, cityIdx = 0, rp = 0, ctaUp = 1, freeWanted = false;
      var down = vh * SHIFT_VH + 128;   // extra 128px of breathing room above the globe

      if (p < ZIN) {                        // arrive → slow spin over SF, then sweep into the first city
        var t = smooth(p / ZIN);
        dark = t; introOp = 1 - (p / ZIN);
        lat = lerp(SF.lat, PLACES[0].lat, t);
        lng = lerpLng(SF.lng + spin, PLACES[0].lng, t);
        zoom = lerp(FAR, NEAR, t); shift = lerp(down, 0, t);
        pitch = PITCH_MAX * t;             // tilt in as we zoom toward the first city
        rp = t;                            // draw the SF → first-city leg as we zoom in
      } else if (p > ZOUT) {                // journey done → dock half-globe to the bottom, raise CTA
        introOp = 0; rp = LEGS;            // full route stays drawn
        var last = PLACES[PLACES.length - 1];
        if (p < DOCK_END) {                // settle the globe into a bottom dome + restore the bg
          var u = smooth((p - ZOUT) / (DOCK_END - ZOUT));
          dark = 1 - u;
          lat = lerp(last.lat, ASIA.lat, u);
          lng = lerp(last.lng, ASIA.lng, u);
          zoom = lerp(NEAR, DOCK_ALT, u);
          pitch = PITCH_MAX * (1 - u);      // tilt back to flat as the globe docks
          shift = u * vh * DOCK_SHIFT;
        } else if (p < FREE_START) {       // hold the dome at the bottom, pull the CTA up over it
          var w = smooth((p - DOCK_END) / (FREE_START - DOCK_END));
          dark = 0;
          lat = ASIA.lat; lng = ASIA.lng;
          zoom = DOCK_ALT; shift = vh * DOCK_SHIFT;
          ctaUp = 1 - w;
        } else {                           // → footer: clean earth, spinning + draggable
          dark = 0; zoom = DOCK_ALT; shift = vh * DOCK_SHIFT; ctaUp = 0;
          freeWanted = true;
        }
      } else {                              // journey → glide continuously along the path
        dark = 1; introOp = 0; zoom = NEAR; shift = 0; pitch = PITCH_MAX; showPlace = true;
        var jp = (p - ZIN) / (ZOUT - ZIN);
        // Reach the final city by HOLD of the journey, then dwell on it so the
        // last stop gets real screen time instead of flashing at the boundary.
        var HOLD = 0.92;
        var sp = jp < HOLD ? (jp / HOLD) : 1;
        var seg = sp * (PLACES.length - 1);
        var k = Math.floor(seg), f = restEase(seg - k);   // glide, easing to a rest on each city
        var segEased = k + f;
        lat = spline(k, 'lat', f);
        lng = spline(k, 'lng', f);
        cityIdx = Math.round(segEased);
        rp = 1 + segEased;                 // SF leg done; the line dwells with the camera, then extends
      }

      if (freeWanted) {                  // footer: let the auto-spin + drag drive
        if (!freeMode) { enterFree(); freeMode = true; }
      } else {
        if (freeMode) { exitFree(lat, lng, zoom); freeMode = false; }
        if (exitT <= 0) {                // not mid glide-back → drive the camera directly
          setCam(lat, lng, zoom, pitch);
          if (!arcFading) setRouteArcs(rp);
        }
      }
      wrap.style.setProperty('--globe-shift', Math.round(shift) + 'px');
      // A city label fades in once its flight line is ≥80% of the way there.
      updateLabels(rp, p < ZOUT);
      if (ctaEl) ctaEl.style.setProperty('--cta-up', clamp01(ctaUp).toFixed(3));
      // The 2026 + its bar fade in only AFTER the globe has finished tracing the
      // journey — the fade runs as the CTA docks and rises (past DOCK_END), never
      // during the tracing itself.
      var headRaw = (p - DOCK_END) / (FREE_START - DOCK_END);   // 0→1 across the dock
      var yearOp = clamp01(headRaw * 1.4);                      // 2026, line + title: full by ~0.71
      var yearOpStr = yearOp.toFixed(3);
      if (yearEl) yearEl.style.opacity = yearOpStr;
      // The connector draws itself (scaleY 0→1) rather than fading, carrying the
      // timeline spine's draw-on-scroll motif into the 2026 finale.
      if (yearLineEl) { yearLineEl.style.opacity = '1'; yearLineEl.style.setProperty('--cta-line-draw', yearOpStr); }
      if (ctaHeadEl) ctaHeadEl.style.opacity = yearOpStr;
      // Paragraph + buttons: revealed 500ms after the title fully lands.
      revealCtaBody(yearOp >= 0.999);
      // Stars fade in as the globe finishes the journey and docks into place.
      if (starsEl) starsEl.style.opacity = (p <= ZOUT ? 0 : clamp01((p - ZOUT) / (DOCK_END - ZOUT))).toFixed(3);
      if (blackout) blackout.style.opacity = dark.toFixed(3);
      if (intro) {
        intro.style.opacity = clamp01(introOp).toFixed(3);
        intro.style.pointerEvents = introOp < 0.05 ? 'none' : '';
      }
      if (placeEl) {
        if (showPlace) {
          if (cityIdx !== lastCity) {
            placeEl.textContent = PLACES[cityIdx].city + ' · ' + PLACES[cityIdx].country;
            lastCity = cityIdx;
          }
          placeEl.classList.add('show');
        } else {
          placeEl.classList.remove('show');
        }
      }
    }

    // Continuously ease the current progress toward the scroll target so the
    // camera glides (inertia) instead of snapping frame-to-frame.
    var targetP = progress(), curP = targetP, lastTs = null;
    function tick(ts) {
      if (lastTs === null) lastTs = ts;
      var dt = Math.min(80, ts - lastTs); lastTs = ts;
      targetP = progress();
      curP += (targetP - curP) * DAMP;
      if (Math.abs(targetP - curP) < 0.0002) curP = targetP;
      // Idle: keep the globe slowly rotating over SF until the journey begins.
      if (curP < 0.02) { spin -= SPIN_DPS * dt / 1000; if (spin <= -360) spin += 360; }
      apply(curP);
      // Fade the flight lines out (entering free) or back in (scrolling out of free).
      if (arcFading) {
        arcFadeT += dt;
        var fk = Math.min(1, arcFadeT / arcFadeMs);
        arcAlpha = arcDir < 0 ? (1 - fk) : fk;
        setArcOpacity(arcAlpha);
        if (fk >= 1) {
          arcFading = false;
          if (arcDir < 0) { arcAlpha = 0; setArcOpacity(0); routeSrc.setData(emptyFC()); }
          else { arcAlpha = 1; setArcOpacity(1); lastArcKey = ''; }   // hand the route back to setRouteArcs
        }
      }
      if (exitT > 0) exitT -= dt;          // let the glide-back tween finish
      if (freeMode) {                      // footer: slow auto-spin unless the user is dragging
        if (!dragging) freeLng -= FREE_SPIN * dt / 1000;
        setCam(freeLat, freeLng, DOCK_ALT);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
