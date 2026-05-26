// theybuild.io — homepage behaviour
// Dismissible announcement bar, scroll-blur nav, scroll reveals, hero count-ups.
// All DOM updates use textContent — no innerHTML, no eval.

(function () {
  'use strict';

  // Announcement bar dismiss (persisted)
  var bar = document.getElementById('announce');
  var closeBtn = document.getElementById('announceClose');
  if (bar && closeBtn) {
    try {
      if (localStorage.getItem('tb_announce_dismissed') === '1') {
        bar.hidden = true;
      }
    } catch (e) {}
    closeBtn.addEventListener('click', function () {
      bar.classList.add('is-dismissed');
      setTimeout(function () { bar.hidden = true; }, 400);
      try { localStorage.setItem('tb_announce_dismissed', '1'); } catch (e) {}
    });
  }

  // Nav scroll-blur state
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            revealIO.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -80px 0px', threshold: 0.05 });
      revealEls.forEach(function (el) { revealIO.observe(el); });
    }
  }

  // Number count-ups in hero stats
  var nums = document.querySelectorAll('[data-count]');
  if (nums.length && 'IntersectionObserver' in window) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      var animate = function (el) {
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var duration = 1200;
        var start = performance.now();
        var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
        var tick = function (now) {
          var t = Math.min(1, (now - start) / duration);
          var v = target * ease(t);
          el.textContent = (target >= 10 ? Math.round(v) : v.toFixed(1)) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      var countIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animate(e.target);
            countIO.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      nums.forEach(function (el) { countIO.observe(el); });
    }
  }

})();
