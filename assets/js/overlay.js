/* =====================================================================
   overlay.js — Case-study overlay (inline, no sub-pages)
   ---------------------------------------------------------------------
   Case-study content lives in window.CASE_STUDIES (case-studies.js).
   Clicking a card with [data-cs="key"] renders that content into a
   full-width, grid-backed sheet that animates UP from the bottom,
   leaving a peek of the page behind it. The URL gets a #cs=key hash
   (shareable) but there is no separate page to navigate to.
   ===================================================================== */
(function () {
  'use strict';

  var triggers = document.querySelectorAll('[data-cs]');
  if (!triggers.length || !window.CASE_STUDIES) return;

  var overlay, sheet, topbar, progressFill, lastFocus, savedScrollY = 0;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'cs-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Case study');

    sheet = document.createElement('article');
    sheet.className = 'cs-sheet';
    overlay.appendChild(sheet);

    // Fixed mini-header: appears once the case-study title scrolls
    // past the top; the bottom edge is a reading-progress bar.
    topbar = document.createElement('div');
    topbar.className = 'cs-topbar';
    topbar.innerHTML =
      '<button class="cs-back" aria-label="Close case study">✕</button>' +
      '<span class="cs-topbar-title"></span>' +
      '<div class="cs-progress" aria-hidden="true"><span></span></div>';
    overlay.appendChild(topbar);
    progressFill = topbar.querySelector('.cs-progress span');
    topbar.querySelector('.cs-back').addEventListener('click', function () { close(); });

    var ticking = false;
    overlay.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h1 = sheet.querySelector('.cs-hero-title, .cs-main h1');
        var show = h1 ? h1.getBoundingClientRect().bottom < 0 : overlay.scrollTop > 300;
        topbar.classList.toggle('visible', show);
        var max = overlay.scrollHeight - overlay.clientHeight;
        progressFill.style.width = (max > 0 ? Math.min(100, (overlay.scrollTop / max) * 100) : 0) + '%';
        // Bottom-of-page guard: a short final section never reaches the scrollspy
        // band, so force the last TOC item active once we hit the bottom.
        var tl = sheet.querySelectorAll('.cs-toc a');
        if (tl.length && overlay.scrollTop + overlay.clientHeight >= overlay.scrollHeight - 4) {
          tl.forEach(function (a) { a.classList.remove('active'); });
          tl[tl.length - 1].classList.add('active');
        }
        ticking = false;
      });
    }, { passive: true });

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      // click in the peek/dim area above or beside the sheet closes
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
  }

  function render(key) {
    var data = window.CASE_STUDIES[key];
    if (!data) return false;

    sheet.innerHTML =
      '<button class="cs-close" aria-label="Close case study">✕</button>' +
      '<div class="cs-layout">' +
        '<nav class="cs-toc" aria-label="Sections"><ul></ul></nav>' +
        '<div class="cs-main">' + data.body + '</div>' +
      '</div>';

    // Cover section: lift the <h1> and the standfirst out of the body and
    // rebuild them as a dark, grid-backed title band, so the top of an
    // overlay reads like the cover slide of the same case study in
    // presentation mode.
    sheet.classList.remove('has-cs-hero');
    buildHero(sheet, key);

    // Build the table of contents from the section headings.
    var ul = sheet.querySelector('.cs-toc ul');
    var heads = sheet.querySelectorAll('.cs-main h2[id]');
    heads.forEach(function (h) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.scrollTo({ top: h.offsetTop - 70, behavior: 'smooth' });
      });
      li.appendChild(a);
      ul.appendChild(li);
    });

    // Close button
    sheet.querySelector('.cs-close').addEventListener('click', function (e) {
      e.preventDefault(); close();
    });

    // Reset the mini-header for the new case study
    topbar.querySelector('.cs-topbar-title').textContent = data.title || '';
    topbar.classList.remove('visible');
    progressFill.style.width = '0%';

    // Image carousels
    initCarousels(sheet);

    // Scrollspy
    var tocLinks = sheet.querySelectorAll('.cs-toc a');
    if (tocLinks.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            tocLinks.forEach(function (a) {
              a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
            });
          }
        });
      }, { root: overlay, rootMargin: '-8% 0px -80% 0px' });
      heads.forEach(function (h) { spy.observe(h); });
    }
    return true;
  }

  // Move the case study's <h1> (and its .cs-deck standfirst, when it's the
  // element right after it) into a full-bleed cover band above the reading
  // layout. Mirrors .deck-slide--cs-title in deck.css: dark surface, drifting
  // grid, Neudron title in the pink gradient, description bottom-right.
  /* ── Cover art, mirrored from the deck's title slides ─────────────
     Same source images and same fallbacks deck.js uses for a cover: a
     study's deck-only art (in the MacBook template where the deck frames
     it that way), otherwise the empty device placeholder — the MacBook for
     desktop studies, the phone mock for the phone ones. Keep these three
     in step with CS_COVER_ART / CS_COVER_IN_LAPTOP / PHONE_CASE_STUDIES
     in deck.js. */
  var CS_COVER_ART = {
    'video-recorder': 'assets/slide/dual_creator_cam/title.png',
    'leadcraft': 'assets/slide/growth/hero.jpg',
    'events': 'assets/slide/events_hero/hero.png',
    'pods': 'assets/slide/pods/hero.jpg'
  };
  var CS_COVER_IN_LAPTOP = ['leadcraft', 'pods'];
  var PHONE_CASE_STUDIES = ['video-recorder', 'events'];
  var IMG_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 15l-5-5L5 21"/></svg>';

  function heroArt(key) {
    var src = CS_COVER_ART[key];
    var phone = PHONE_CASE_STUDIES.indexOf(key) >= 0;
    var wrap = document.createElement('div');
    wrap.className = 'cs-hero-art';
    wrap.setAttribute('aria-hidden', 'true');

    if (src && CS_COVER_IN_LAPTOP.indexOf(key) >= 0) {
      wrap.classList.add('cs-hero-art--laptop');
      wrap.innerHTML =
        '<figure class="deck-laptop">' +
          '<div class="deck-laptop-screen"><img src="' + src + '" alt=""></div>' +
          '<img class="deck-laptop-art" src="assets/templates/macbookpro.png" alt="">' +
        '</figure>';
    } else if (src) {
      wrap.classList.add(phone ? 'cs-hero-art--phone' : 'cs-hero-art--free');
      wrap.innerHTML = '<img src="' + src + '" alt="">';
    } else if (phone) {
      // Empty phone placeholder, same drawn device the deck falls back to.
      wrap.classList.add('cs-hero-art--phone');
      wrap.innerHTML =
        '<div class="deck-cs-device deck-cs-device--phone"><div class="dcd-phone">' +
          '<div class="dcd-notch"></div>' +
          '<div class="dcd-screen"><span class="deck-photo-ph-icon">' + IMG_ICON +
          '</span><span class="deck-photo-ph-label">Phone</span></div>' +
        '</div></div>';
    } else {
      // Desktop studies open on the MacBook template with a "Screenshot" well.
      wrap.classList.add('cs-hero-art--laptop');
      wrap.innerHTML =
        '<figure class="deck-laptop">' +
          '<div class="deck-laptop-screen"><span class="deck-laptop-lbl">Screenshot</span></div>' +
          '<img class="deck-laptop-art" src="assets/templates/macbookpro.png" alt="">' +
        '</figure>';
    }
    return wrap;
  }

  function buildHero(scope, key) {
    var main = scope.querySelector('.cs-main');
    var layout = scope.querySelector('.cs-layout');
    var h1 = main && main.querySelector('h1');
    if (!h1 || !layout) return;

    var deck = h1.nextElementSibling;
    if (!deck || !deck.classList.contains('cs-deck')) deck = null;

    var hero = document.createElement('header');
    hero.className = 'cs-hero';
    hero.appendChild(heroArt(key));

    var inner = document.createElement('div');
    inner.className = 'cs-hero-inner';
    hero.appendChild(inner);

    var title = document.createElement('h1');
    title.className = 'cs-hero-title';
    title.textContent = h1.textContent;
    inner.appendChild(title);

    if (deck) {
      var d = document.createElement('p');
      d.className = 'cs-hero-desc';
      d.innerHTML = deck.innerHTML;
      inner.appendChild(d);
      deck.remove();
    }

    h1.remove();
    scope.insertBefore(hero, layout);
    scope.classList.add('has-cs-hero');
    fitHeroTitle();
  }

  // Grow the cover title until it fills the band's height, the way a title
  // slide does. Line count varies with the title's length, so the size can't
  // be expressed in CSS alone — the CSS clamp is the starting point and this
  // binary-searches the largest size whose stretched block still fits.
  function fitHeroTitle() {
    if (!sheet) return;
    var hero = sheet.querySelector('.cs-hero');
    var title = hero && hero.querySelector('.cs-hero-title');
    if (!title) return;

    // Below 861px the band grows with its content, so leave CSS in charge.
    if (!window.matchMedia('(min-width: 861px)').matches) {
      title.style.fontSize = '';
      return;
    }

    var cs = window.getComputedStyle(hero);
    var avail = hero.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (!(avail > 0)) return;
    // The title is scaleY(1.5)'d, so its painted height is 1.5× its layout
    // height; leave a hair of slack so a rounding error can't clip the caps.
    var budget = (avail / 1.5) * 0.98;

    var lo = 28, hi = 220, best = lo;
    for (var i = 0; i < 12; i++) {
      var mid = (lo + hi) / 2;
      title.style.fontSize = mid + 'px';
      // offsetHeight, not getBoundingClientRect: the latter reports the
      // already-stretched box, which would double-count the 1.5.
      if (title.offsetHeight <= budget) { best = mid; lo = mid; }
      else hi = mid;
    }
    title.style.fontSize = best.toFixed(2) + 'px';
  }

  // Initialize every [data-carousel] inside a scope (arrow-controlled,
  // transform-based; off-slides are clipped by the viewport's overflow).
  function initCarousels(scope) {
    scope.querySelectorAll('[data-carousel]').forEach(function (car) {
      var viewport = car.querySelector('.cs-carousel-viewport');
      var track = car.querySelector('.cs-carousel-track');
      var slides = Array.prototype.slice.call(car.querySelectorAll('.cs-slide'));
      var prev = car.querySelector('.cs-car-btn.prev');
      var next = car.querySelector('.cs-car-btn.next');
      if (!track || !slides.length) return;
      // A single slide has nothing to page through — hide the arrows.
      if (slides.length < 2) {
        if (prev) prev.style.display = 'none';
        if (next) next.style.display = 'none';
        return;
      }
      var i = 0;

      function maxScroll() { return Math.max(0, track.scrollWidth - viewport.clientWidth); }
      function go(n) {
        i = Math.max(0, Math.min(slides.length - 1, n));
        var x = Math.min(slides[i].offsetLeft, maxScroll());
        track.style.transform = 'translateX(' + (-x) + 'px)';
        if (prev) prev.disabled = x <= 0;
        if (next) next.disabled = x >= maxScroll() - 1;
      }
      if (prev) prev.addEventListener('click', function () { go(i - 1); });
      if (next) next.addEventListener('click', function () { go(i + 1); });
      car.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      });
      var onResize = function () { go(i); };
      window.addEventListener('resize', onResize, { passive: true });
      // Slide widths depend on each image/video's natural size, so the first
      // measurement can be wrong if the media hasn't loaded yet (arrows stay
      // disabled until a manual resize). Re-measure once the media loads.
      car.querySelectorAll('img').forEach(function (im) {
        if (!im.complete) im.addEventListener('load', function () { go(i); }, { once: true });
      });
      car.querySelectorAll('video').forEach(function (v) {
        v.addEventListener('loadedmetadata', function () { go(i); }, { once: true });
      });
      if (window.ResizeObserver) {
        new ResizeObserver(function () { go(i); }).observe(track);
      }
      // run after layout settles
      requestAnimationFrame(function () { go(0); });
    });
  }

  // Desktop morph: the clicked card appears to grow into the modal.
  // A fixed-position "ghost" rectangle animates from the card's rect to the
  // sheet's final frame while crossfading dark → white; the real sheet stays
  // hidden underneath and the content fades in once the ghost lands.
  var morphGhost = null;

  function canMorph(originEl) {
    return !!(originEl && originEl.getBoundingClientRect &&
      Element.prototype.animate &&
      window.matchMedia('(min-width: 861px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function morphOpen(originEl) {
    var from = originEl.getBoundingClientRect();
    overlay.classList.remove('cs-revealed');
    overlay.classList.add('cs-morph');
    overlay.classList.add('open');

    if (morphGhost) morphGhost.remove();
    morphGhost = document.createElement('div');
    morphGhost.className = 'cs-morph-ghost';
    document.body.appendChild(morphGhost);

    // Final frame matches the desktop floating sheet: 16px gap on all sides.
    var anim = morphGhost.animate([
      {
        top: from.top + 'px', left: from.left + 'px',
        width: from.width + 'px', height: from.height + 'px',
        backgroundColor: '#0d0c11', borderRadius: '24px 24px 0 0'
      },
      {
        top: '16px', left: '16px',
        width: (window.innerWidth - 32) + 'px',
        height: (window.innerHeight - 32) + 'px',
        backgroundColor: '#ffffff', borderRadius: '22px'
      }
    ], { duration: 520, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' });

    // Reveal = swap the real sheet in + fade the text up. Normally driven by
    // onfinish; the timer is a fallback because animation events only fire on
    // rendering frames (a backgrounded tab would otherwise never reveal).
    var revealed = false;
    function settle() {
      // no-op if already revealed or the overlay was closed mid-morph
      if (revealed || !overlay.classList.contains('cs-morph')) return;
      revealed = true;
      overlay.classList.add('cs-revealed');
      if (morphGhost) { morphGhost.remove(); morphGhost = null; }
    }
    anim.onfinish = settle;
    setTimeout(settle, 620);
  }

  function open(key, push, originEl) {
    if (!overlay) build();
    if (!render(key)) return;

    lastFocus = document.activeElement;
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add('cs-lock');
    overlay.scrollTop = 0;
    if (canMorph(originEl)) {
      morphOpen(originEl);
    } else {
      overlay.classList.remove('cs-morph', 'cs-revealed');
      // force reflow so the slide-up transition always plays
      void sheet.offsetHeight;
      overlay.classList.add('open');
    }

    var title = window.CASE_STUDIES[key].title + ' — Harrison Wheeler';
    if (push) history.pushState({ cs: key }, title, '#cs=' + key);
    document.title = title;

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_path: location.pathname + '#cs=' + key,
        engagement: 'case_study_overlay'
      });
    }
    var c = sheet.querySelector('.cs-close');
    if (c) c.focus({ preventScroll: true });
  }

  function close(skipHistory) {
    if (!overlay) return;
    if (morphGhost) { morphGhost.remove(); morphGhost = null; }
    // drop morph state so the sheet's slide-down transition applies again
    overlay.classList.remove('cs-morph', 'cs-revealed');
    overlay.classList.remove('open');
    document.body.classList.remove('cs-lock');
    if (!skipHistory && history.state && history.state.cs) history.back();
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    // Closing must not jump the page to the top: focusing the trigger card and
    // the history back-nav can both nudge scroll, so pin the page back to where
    // it was when the modal opened (repeated across the next frame + task to
    // beat any async scroll restoration).
    var y = savedScrollY;
    var restoreScroll = function () { window.scrollTo(0, y); };
    restoreScroll();
    requestAnimationFrame(restoreScroll);
    setTimeout(restoreScroll, 0);
    setTimeout(function () { if (!overlay.classList.contains('open')) sheet.innerHTML = ''; }, 450);
  }

  // The fit depends on the viewport and on Neudron's metrics, so redo it when
  // either changes.
  var refitTimer;
  window.addEventListener('resize', function () {
    clearTimeout(refitTimer);
    refitTimer = setTimeout(fitHeroTitle, 120);
  }, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { fitHeroTitle(); });
  }

  triggers.forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      open(el.getAttribute('data-cs'), true, el);
    });
  });

  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.cs) open(e.state.cs, false);
    else if (overlay && overlay.classList.contains('open')) close(true);
  });

  // Deep link on load: #cs=quality
  var m = (location.hash || '').match(/cs=([\w-]+)/);
  if (m) open(m[1], false);
})();
