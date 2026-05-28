(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      var shell = img.closest('.poster-shell, .detail-poster, .related-thumb, .rank-thumb');
      if (shell) {
        shell.classList.add('image-empty');
      }
      img.style.opacity = '0';
    }, { once: true });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }
    stopHero();
    timer = setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  function stopHero() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  if (slides.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        startHero();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startHero();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startHero();
      });
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopHero();
      } else {
        startHero();
      }
    });
    showSlide(0);
    startHero();
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-chip]'));
  var emptyState = document.querySelector('[data-empty-state]');
  var activeFilters = {};

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }
    var query = normalize(searchInputs.map(function (input) {
      return input.value;
    }).filter(Boolean).join(' '));
    var visible = 0;
    cards.forEach(function (card) {
      var search = normalize(card.getAttribute('data-search'));
      var ok = !query || search.indexOf(query) !== -1;
      Object.keys(activeFilters).forEach(function (key) {
        var value = activeFilters[key];
        if (value && card.getAttribute('data-' + key) !== value) {
          ok = false;
        }
      });
      card.style.display = ok ? '' : 'none';
      if (ok) {
        visible += 1;
      }
    });
    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      searchInputs.forEach(function (other) {
        if (other !== input) {
          other.value = input.value;
        }
      });
      applyFilters();
    });
  });

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var key = chip.getAttribute('data-filter-key');
      var value = chip.getAttribute('data-filter-value');
      var group = chips.filter(function (item) {
        return item.getAttribute('data-filter-key') === key;
      });
      group.forEach(function (item) {
        item.classList.remove('is-active');
      });
      chip.classList.add('is-active');
      if (value === 'all') {
        delete activeFilters[key];
      } else {
        activeFilters[key] = value;
      }
      applyFilters();
    });
  });

  document.querySelectorAll('[data-search-submit]').forEach(function (button) {
    button.addEventListener('click', function () {
      var target = document.querySelector(button.getAttribute('data-search-submit'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      applyFilters();
    });
  });

  var backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('is-visible', window.scrollY > 500);
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
