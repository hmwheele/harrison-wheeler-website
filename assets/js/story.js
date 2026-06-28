/* =====================================================================
   story.js — "My story" timeline page
   1) Reveal elements (fade IN on enter, fade OUT on leave) on scroll
   2) Auto-rotating night-earth globe lighting up places visited in Asia
   Loaded after main.js (which handles nav, mobile menu, footer year).
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        // Toggling on AND off gives the fade-in / fade-out both directions.
        setIn(en.target, en.isIntersecting);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

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
    { city: 'Shanghai',        country: 'China',       lat:  31.2304, lng: 121.4737 },
    { city: 'Chengdu',         country: 'China',       lat:  30.5728, lng: 104.0668 },
    { city: 'Chongqing',       country: 'China',       lat:  29.4316, lng: 106.9123 },
    { city: 'Hong Kong',       country: 'China',       lat:  22.3193, lng: 114.1694 },
    { city: 'Taipei',          country: 'Taiwan',      lat:  25.0330, lng: 121.5654 },
    { city: 'Hanoi',           country: 'Vietnam',     lat:  21.0278, lng: 105.8342 },
    { city: 'Bangkok',         country: 'Thailand',    lat:  13.7563, lng: 100.5018 },
    { city: 'Ho Chi Minh City',country: 'Vietnam',     lat:  10.8231, lng: 106.6297 },
    { city: 'Singapore',       country: 'Singapore',   lat:   1.3521, lng: 103.8198 },
    { city: 'Bali',            country: 'Indonesia',   lat:  -8.4095, lng: 115.1889 },
    { city: 'Sydney',          country: 'Australia',   lat: -33.8688, lng: 151.2093 }
  ];

  var wrap = document.getElementById('globe-wrap');
  var mount = document.getElementById('globe');
  if (!wrap || !mount) return;

  function showFallback() {
    wrap.classList.add('no-webgl');
    var sec = document.getElementById('globe-scrolly');
    if (sec) sec.classList.add('is-static');
  }

  // Bail to the text fallback if WebGL isn't available.
  try {
    var test = document.createElement('canvas');
    if (!(window.WebGLRenderingContext &&
          (test.getContext('webgl') || test.getContext('experimental-webgl')))) {
      showFallback();
      return;
    }
  } catch (e) { showFallback(); return; }

  // Load globe.gl (standalone build bundles three.js) from CDN, then init.
  var s = document.createElement('script');
  s.src = 'https://unpkg.com/globe.gl';
  s.async = true;
  s.onerror = showFallback;
  s.onload = initGlobe;
  document.head.appendChild(s);

  function initGlobe() {
    if (typeof window.Globe !== 'function') { showFallback(); return; }

    var ACCENT = '#d0bcff';
    var world;
    try {
      world = window.Globe()(mount)
        .width(mount.clientWidth)
        .height(mount.clientHeight)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl('assets/textures/earth-night-3600.jpg')   // 3600×1800 NASA Black Marble (vs the 2K example texture)
        .atmosphereColor(ACCENT)
        .atmosphereAltitude(0.18)
        // Glowing points at each city
        .pointsData(PLACES)
        .pointLat('lat').pointLng('lng')
        .pointColor(function () { return ACCENT; })
        .pointAltitude(0.035)
        .pointRadius(0.32)
        .pointsMerge(false)
        .pointsTransitionDuration(700)     // markers fade/shrink when cleared at the end
        // City labels as HTML elements so we can use the IBM Plex Mono web font
        .htmlElementsData(PLACES)
        .htmlLat('lat').htmlLng('lng')
        .htmlElement(function (d) {
          var el = document.createElement('div');
          el.className = 'globe-label';
          el.textContent = d.city;
          return el;
        })
        // Flight-path arcs between visited cities (revealed as the journey traces)
        .arcStartLat(function (d) { return d.startLat; })
        .arcStartLng(function (d) { return d.startLng; })
        .arcEndLat(function (d) { return d.endLat; })
        .arcEndLng(function (d) { return d.endLng; })
        .arcColor(function () { return ['rgba(255,255,255,' + (0.25 * arcAlpha).toFixed(3) + ')', 'rgba(255,255,255,' + (0.95 * arcAlpha).toFixed(3) + ')']; })
        .arcAltitudeAutoScale(0.4)
        .arcStroke(0.55)
        .arcDashLength(1)
        .arcDashGap(0)
        .arcDashAnimateTime(0)
        .arcsTransitionDuration(0)         // no enter-animation → no flicker when the leg grows
        .arcsData([]);
    } catch (err) {
      showFallback();
      return;
    }

    var controls = world.controls();
    controls.enableZoom = false;
    // Render at 1x so the HTML label layer aligns with the WebGL points (the
    // html layer projects in CSS px; a >1 devicePixelRatio offsets the labels).
    try { world.renderer().setPixelRatio(1); } catch (e) {}

    // Keep the (large) canvas sized to its container (re-pin pixelRatio: globe.gl
    // resets it to devicePixelRatio on resize, which would offset the HTML labels).
    function resize() {
      world.width(mount.clientWidth).height(mount.clientHeight);
      try { world.renderer().setPixelRatio(1); } catch (e) {}
    }
    window.addEventListener('resize', resize, { passive: true });

    var section  = document.getElementById('globe-scrolly');
    var blackout = document.querySelector('[data-globe-blackout]');
    var intro    = document.querySelector('[data-globe-intro]');
    var placeEl  = document.querySelector('[data-globe-place]');
    var ctaEl    = document.querySelector('[data-globe-cta]');

    var FAR  = 5.0;   // zoomed-out altitude — small whole globe that fits below the header
    var NEAR = 0.62;  // zoomed-in altitude — half / region, spans the width (the journey)

    // Static fallback: reduced motion, or the scrolly section is missing.
    if (reduceMotion || !section) {
      if (section) section.classList.add('is-static');
      world.pointOfView({ lat: 18, lng: 110, altitude: FAR }, 0);
      if (!reduceMotion) { controls.autoRotate = true; controls.autoRotateSpeed = 0.5; }
      document.addEventListener('visibilitychange', function () {
        if (!reduceMotion) controls.autoRotate = !document.hidden;
      });
      return;
    }

    // ── Scroll-driven journey (damped easing + smooth spline path) ───
    controls.autoRotate = false;
    controls.enabled = false;              // scroll fully drives the camera

    var SF = { lat: 37.7749, lng: -122.4194 };   // home base — globe starts here
    world.pointOfView({ lat: SF.lat, lng: SF.lng, altitude: FAR }, 0);

    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function smooth(t) { return t * t * (3 - 2 * t); }
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

    var ASIA = { lat: 18, lng: 110 };
    var ZIN = 0.12, ZOUT = 0.72;           // zoom-in ends / journey ends (then dock + CTA)
    var DOCK_END = 0.84;                    // globe finishes docking to the bottom by here
    var FREE_START = 0.93;                  // past here (→ footer) the earth spins freely + draggable
    var DOCK_ALT = 1.5;                     // altitude of the docked half-globe
    var DOCK_SHIFT = 0.5;                   // drop the docked globe so its centre is at the bottom edge
    var SHIFT_VH = 0.18;                    // drop the zoomed-out globe below the header
    var DAMP = 0.08;                        // camera easing — lower = smoother / heavier
    var SPIN_DPS = 6;                       // intro idle rotation speed (deg/sec)
    var spin = 0, lastCity = -1;

    // Flight-path route: starts in San Francisco, then through every city.
    var ROUTE = [SF].concat(PLACES);
    var LEGS = ROUTE.length - 1;
    var lastArcKey = '';
    var arcAlpha = 1, arcFading = false, arcFadeT = 0, ARC_FADE_MS = 700;
    var arcDir = -1, arcFadeMs = ARC_FADE_MS;   // fade direction (-1 out / +1 in) and duration
    function fullRouteArcs() {
      var arcs = [];
      for (var i = 0; i < LEGS; i++) {
        arcs.push({ startLat: ROUTE[i].lat, startLng: ROUTE[i].lng,
                    endLat: ROUTE[i + 1].lat, endLng: ROUTE[i + 1].lng });
      }
      return arcs;
    }
    // Draw the route up to `rp` legs — the current (fractional) leg is drawn partway,
    // so the line extends as the user scrolls instead of snapping in complete.
    function setRouteArcs(rp) {
      rp = Math.max(0, Math.min(LEGS, rp));
      var full = Math.floor(rp);
      var frac = Math.round((rp - full) * 40) / 40;   // quantize to limit rebuilds
      var key = full + ':' + frac;
      if (key === lastArcKey) return;
      lastArcKey = key;
      var arcs = [], i;
      for (i = 0; i < full; i++) {                     // completed legs (full arcs)
        arcs.push({ startLat: ROUTE[i].lat, startLng: ROUTE[i].lng,
                    endLat: ROUTE[i + 1].lat, endLng: ROUTE[i + 1].lng });
      }
      if (full < LEGS && frac > 0.001) {               // current leg, drawn partway
        var a = ROUTE[full], b = ROUTE[full + 1];
        arcs.push({ startLat: a.lat, startLng: a.lng,
                    endLat: lerp(a.lat, b.lat, frac), endLng: lerpLng(a.lng, b.lng, frac) });
      }
      world.arcsData(arcs);
    }

    // Free mode (at the footer): fade out markers + lines, slow auto-spin, draggable.
    var freeMode = false, freeLat = 0, freeLng = 0, dragging = false, lastX = 0, lastY = 0;
    var FREE_SPIN = 5;                       // free-mode auto-rotation (deg/sec)
    var exitT = 0, EXIT_MS = 450;            // smooth glide-back when scrolling out of free mode
    function enterFree() {
      var pov = world.pointOfView();
      freeLat = pov.lat; freeLng = pov.lng;
      world.pointsData([]);                 // markers fade out
      arcFading = true; arcDir = -1; arcFadeMs = ARC_FADE_MS;   // flight lines fade out (not abrupt)
      arcFadeT = (1 - arcAlpha) * ARC_FADE_MS;
      lastArcKey = '__free__';
    }
    function exitFree(toLat, toLng, toAlt) {
      // Glide the camera from the free spin back to the docked orientation instead of snapping it.
      world.pointOfView({ lat: toLat, lng: toLng, altitude: toAlt }, EXIT_MS);
      exitT = EXIT_MS;
      world.pointsData(PLACES);             // markers return
      arcFading = true; arcDir = 1; arcFadeMs = EXIT_MS;        // flight lines fade back in
      arcFadeT = arcAlpha * EXIT_MS;        // continue from the current (faded) alpha
      world.arcsData(fullRouteArcs());
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
      var lat, lng, alt, dark, introOp, shift, showPlace = false, cityIdx = 0, rp = 0, ctaUp = 1, freeWanted = false;
      var down = vh * SHIFT_VH + 128;   // extra 128px of breathing room above the globe

      if (p < ZIN) {                        // arrive → slow spin over SF, then sweep into the first city
        var t = smooth(p / ZIN);
        dark = t; introOp = 1 - (p / ZIN);
        lat = lerp(SF.lat, PLACES[0].lat, t);
        lng = lerpLng(SF.lng + spin, PLACES[0].lng, t);
        alt = lerp(FAR, NEAR, t); shift = lerp(down, 0, t);
        rp = t;                            // draw the SF → first-city leg as we zoom in
      } else if (p > ZOUT) {                // journey done → dock half-globe to the bottom, raise CTA
        introOp = 0; rp = LEGS;            // full route stays drawn
        var last = PLACES[PLACES.length - 1];
        if (p < DOCK_END) {                // settle the globe into a bottom dome + restore the bg
          var u = smooth((p - ZOUT) / (DOCK_END - ZOUT));
          dark = 1 - u;
          lat = lerp(last.lat, ASIA.lat, u);
          lng = lerp(last.lng, ASIA.lng, u);
          alt = lerp(NEAR, DOCK_ALT, u);
          shift = u * vh * DOCK_SHIFT;
        } else if (p < FREE_START) {       // hold the dome at the bottom, pull the CTA up over it
          var w = smooth((p - DOCK_END) / (FREE_START - DOCK_END));
          dark = 0;
          lat = ASIA.lat; lng = ASIA.lng;
          alt = DOCK_ALT; shift = vh * DOCK_SHIFT;
          ctaUp = 1 - w;
        } else {                           // → footer: clean earth, spinning + draggable
          dark = 0; alt = DOCK_ALT; shift = vh * DOCK_SHIFT; ctaUp = 0;
          freeWanted = true;
        }
      } else {                              // journey → glide continuously along the path
        dark = 1; introOp = 0; alt = NEAR; shift = 0; showPlace = true;
        var jp = (p - ZIN) / (ZOUT - ZIN);
        var seg = jp * (PLACES.length - 1);
        var k = Math.floor(seg), f = seg - k;   // linear f — flows without pausing at each city
        lat = spline(k, 'lat', f);
        lng = spline(k, 'lng', f);
        cityIdx = Math.round(seg);
        rp = 1 + seg;                      // SF leg done; draw each city leg as it's flown
      }

      if (freeWanted) {                  // footer: let the controls (auto-rotate + drag) drive
        if (!freeMode) { enterFree(); freeMode = true; }
      } else {
        if (freeMode) { exitFree(lat, lng, alt); freeMode = false; }
        if (exitT <= 0) {                // not mid glide-back → drive the camera directly
          world.pointOfView({ lat: lat, lng: lng, altitude: alt }, 0);
          if (!arcFading) setRouteArcs(rp);
        }
      }
      wrap.style.setProperty('--globe-shift', Math.round(shift) + 'px');
      wrap.classList.toggle('labels-on', showPlace);   // labels only during the journey
      if (ctaEl) ctaEl.style.setProperty('--cta-up', clamp01(ctaUp).toFixed(3));
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
        if (fk >= 1) {
          arcFading = false;
          if (arcDir < 0) { arcAlpha = 0; world.arcsData([]); }
          else { arcAlpha = 1; lastArcKey = ''; }   // hand the route back to setRouteArcs
        } else {
          world.arcsData(fullRouteArcs());
        }
      }
      if (exitT > 0) exitT -= dt;          // let the glide-back tween finish
      if (freeMode) {                      // footer: slow auto-spin unless the user is dragging
        if (!dragging) freeLng -= FREE_SPIN * dt / 1000;
        world.pointOfView({ lat: freeLat, lng: freeLng, altitude: DOCK_ALT }, 0);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
