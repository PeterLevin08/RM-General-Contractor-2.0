/* RM General Contractor Inc — interactions
   Sticky header · mobile nav · scrollspy · reveal-on-scroll ·
   project filters · estimate questionnaire · mobile call bar  */
(function () {
  'use strict';

  function init() {
  var d = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header ---------- */
  var header = d.getElementById('siteHeader');
  var lastY = 0;
  var ticking = false;

  function onScroll() {
    lastY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-stuck', lastY > 24);
        updateCallbar(lastY);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var burger = d.getElementById('burger');
  var navLinks = d.getElementById('navLinks');
  var scrim = d.getElementById('navScrim');

  function setNav(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('is-open', open);
    scrim.hidden = !open;
    // allow transition after unhide
    window.requestAnimationFrame(function () {
      scrim.classList.toggle('is-open', open);
    });
    d.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', function () {
    setNav(burger.getAttribute('aria-expanded') !== 'true');
  });
  scrim.addEventListener('click', function () { setNav(false); });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
      setNav(false);
      burger.focus();
    }
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });

  /* ---------- Scrollspy ---------- */
  var spyLinks = Array.prototype.slice.call(d.querySelectorAll('.nav__link'));
  var sections = spyLinks
    .map(function (a) { return d.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        spyLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = d.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- Project filters ---------- */
  var filterBtns = d.querySelectorAll('.filter');
  var projects = d.querySelectorAll('.proj');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      projects.forEach(function (p) {
        var show = f === 'all' || p.getAttribute('data-cat') === f;
        p.classList.toggle('is-hidden', !show);
        if (show) p.classList.add('is-in'); // don't re-hide revealed cards
      });
    });
  });

  /* ---------- Hero estimate questionnaire ---------- */
  var quiz = d.getElementById('quizForm');
  if (quiz) {
    var qSteps = Array.prototype.slice.call(quiz.querySelectorAll('.quiz__step'));
    var qBar = d.getElementById('quizBar');
    var qCount = d.getElementById('quizCount');
    var qErr = d.getElementById('quizErr');
    var qStatus = d.getElementById('quizStatus');
    var qPrev = d.getElementById('quizPrev');
    var qFwd = d.getElementById('quizFwd');
    var qNext = d.getElementById('quizNext');
    var qCur = 0;

    function qShow(i) {
      qSteps.forEach(function (s, idx) {
        s.hidden = idx !== i;
        s.classList.toggle('is-active', idx === i);
      });
      qBar.style.width = ((i + 1) / qSteps.length * 100) + '%';
      qCount.textContent = 'Step ' + (i + 1) + ' of ' + qSteps.length;
      qPrev.disabled = i === 0;
      qNext.textContent = i === qSteps.length - 1 ? 'Get my estimate' : 'Next';
      qErr.hidden = true;
      qCur = i;
    }

    function qFail(msg) {
      qErr.textContent = msg;
      qErr.hidden = false;
      return false;
    }

    function qValidate(i) {
      var step = qSteps[i];
      var checks = step.querySelectorAll('input[type="checkbox"]');
      if (checks.length) {
        var any = Array.prototype.some.call(checks, function (c) { return c.checked; });
        return any || qFail('Please select at least one option.');
      }
      var name = step.querySelector('#quizName');
      if (name) {
        return name.value.trim().length >= 2 || qFail('Please enter your name.');
      }
      var email = step.querySelector('#quizEmail');
      if (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) || qFail('Please enter a valid email address.');
      }
      var phone = step.querySelector('#quizPhone');
      if (phone) {
        var digits = phone.value.replace(/\D/g, '');
        return (digits.length >= 10 && digits.length <= 11) || qFail('Please enter a valid phone number.');
      }
      return true; // notes step is optional
    }

    function qAdvance() {
      if (!qValidate(qCur)) return;
      if (qCur < qSteps.length - 1) {
        qShow(qCur + 1);
        var focusable = qSteps[qCur].querySelector('input,textarea');
        if (focusable) focusable.focus();
      } else {
        qFinish();
      }
    }

    function qVals(nm) {
      return Array.prototype.filter.call(quiz.elements[nm] || [], function (c) { return c.checked; })
        .map(function (c) { return c.value; }).join(', ') || '—';
    }

    function qFinish() {
      var name = quiz.querySelector('#quizName').value.trim();
      var subject = 'Estimate request — ' + qVals('spaces') + ' — ' + name;
      var body =
        'Spaces: ' + qVals('spaces') + '\n' +
        'Approximate size: ' + qVals('size') + '\n' +
        'Timeline: ' + qVals('timeline') + '\n\n' +
        'Name: ' + name + '\n' +
        'Email: ' + quiz.querySelector('#quizEmail').value.trim() + '\n' +
        'Phone: ' + quiz.querySelector('#quizPhone').value.trim() + '\n\n' +
        'Details:\n' + (quiz.querySelector('#quizNotes').value.trim() || '—');
      window.location.href = 'mailto:info@rmgeneralcontractor.ca' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      var phoneNode = d.querySelector('[data-phone-text]');
      var phone = phoneNode ? phoneNode.textContent : '(647) 865-8009';
      qStatus.textContent = 'Thanks, ' + name.split(' ')[0] + '! Opening your email app — or call ' + phone + '.';
      qStatus.classList.add('is-ok');
    }

    qNext.addEventListener('click', function (e) { e.preventDefault(); qAdvance(); });
    qFwd.addEventListener('click', qAdvance);
    qPrev.addEventListener('click', function () { if (qCur > 0) qShow(qCur - 1); });
    quiz.addEventListener('submit', function (e) { e.preventDefault(); qAdvance(); });
    // Enter inside text inputs advances
    quiz.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        qAdvance();
      }
    });
    qShow(0);
  }

  /* ---------- Mobile call bar ---------- */
  var callbar = d.getElementById('callbar');
  var hero = d.getElementById('home');
  var contact = d.getElementById('contact');

  function updateCallbar(y) {
    if (!callbar) return;
    var pastHero = y > (hero ? hero.offsetHeight * 0.6 : 400);
    var beforeContact = contact
      ? y + window.innerHeight < contact.offsetTop + contact.offsetHeight * 0.5
      : true;
    callbar.classList.toggle('is-visible', pastHero && beforeContact);
  }

  /* ---------- Footer year ---------- */
  var yr = d.getElementById('year');
  if (yr) yr.textContent = String(new Date().getFullYear());
  }

  var contentReady = window.siteContentReady;
  if (contentReady && typeof contentReady.then === 'function') {
    contentReady.then(init, init);
  } else {
    init();
  }
}());
