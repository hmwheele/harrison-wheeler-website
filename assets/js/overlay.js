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

  var overlay, sheet, topbar, progressFill, lastFocus;

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
      '<button class="cs-back" aria-label="Back">← Back</button>' +
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
        var h1 = sheet.querySelector('.cs-main h1');
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

  function open(key, push) {
    if (!overlay) build();
    if (!render(key)) return;

    lastFocus = document.activeElement;
    document.body.classList.add('cs-lock');
    overlay.scrollTop = 0;
    // force reflow so the slide-up transition always plays
    void sheet.offsetHeight;
    overlay.classList.add('open');

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
    if (c) c.focus();
  }

  function close(skipHistory) {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.classList.remove('cs-lock');
    if (!skipHistory && history.state && history.state.cs) history.back();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    setTimeout(function () { if (!overlay.classList.contains('open')) sheet.innerHTML = ''; }, 450);
  }

  triggers.forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      open(el.getAttribute('data-cs'), true);
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
