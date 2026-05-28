(function() {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.mobile-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var backTop = document.querySelector('.back-to-top');
  if (backTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 360) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    });
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var active = 0;
  var timer = null;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function(slide, i) {
      slide.classList.toggle('active', i === active);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === active);
    });
  }

  function startCarousel() {
    if (slides.length < 2) {
      return;
    }
    timer = window.setInterval(function() {
      setSlide(active + 1);
    }, 5200);
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      window.clearInterval(timer);
      setSlide(Number(dot.getAttribute('data-target')) || 0);
      startCarousel();
    });
  });

  startCarousel();

  var searchInput = document.getElementById('movie-search');
  var regionFilter = document.getElementById('region-filter');
  var typeFilter = document.getElementById('type-filter');
  var yearFilter = document.getElementById('year-filter');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.search-grid .movie-card'));

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }
    var keyword = normalize(searchInput && searchInput.value);
    var region = normalize(regionFilter && regionFilter.value);
    var type = normalize(typeFilter && typeFilter.value);
    var year = normalize(yearFilter && yearFilter.value);

    cards.forEach(function(card) {
      var text = normalize(card.textContent + ' ' + card.dataset.title + ' ' + card.dataset.genre);
      var cardRegion = normalize(card.dataset.region);
      var cardType = normalize(card.dataset.type);
      var cardYear = normalize(card.dataset.year);
      var matched = (!keyword || text.indexOf(keyword) !== -1) &&
        (!region || cardRegion === region) &&
        (!type || cardType === type) &&
        (!year || cardYear === year);
      card.style.display = matched ? '' : 'none';
    });
  }

  [searchInput, regionFilter, typeFilter, yearFilter].forEach(function(control) {
    if (control) {
      control.addEventListener('input', filterCards);
      control.addEventListener('change', filterCards);
    }
  });
})();
