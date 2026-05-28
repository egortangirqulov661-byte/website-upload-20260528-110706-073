(function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var links = document.querySelector("[data-nav-links]");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-hero-carousel]").forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dots] button"));
    var index = 0;

    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  });

  function getYearGroup(value) {
    var year = parseInt(value, 10);
    if (!year) {
      return "";
    }
    if (year >= 2026) {
      return "2026";
    }
    if (year >= 2025) {
      return "2025";
    }
    if (year >= 2024) {
      return "2024";
    }
    if (year >= 2020) {
      return "2020";
    }
    if (year >= 2010) {
      return "2010";
    }
    if (year >= 2000) {
      return "2000";
    }
    return "1990";
  }

  document.querySelectorAll("[data-filter-form]").forEach(function (form) {
    var input = form.querySelector("[data-filter-input]");
    var yearSelect = form.querySelector("select[name='year']");
    var typeSelect = form.querySelector("select[name='type']");
    var categorySelect = form.querySelector("select[name='category']");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var params = new URLSearchParams(window.location.search);
    var incoming = params.get("q");

    if (incoming && input) {
      input.value = incoming;
    }

    function applyFilters() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var year = yearSelect ? yearSelect.value : "";
      var type = typeSelect ? typeSelect.value : "";
      var category = categorySelect ? categorySelect.value : "";

      cards.forEach(function (card) {
        var haystack = (card.getAttribute("data-search") || "").toLowerCase();
        var cardYear = getYearGroup(card.getAttribute("data-year") || "");
        var cardType = card.getAttribute("data-type") || "";
        var cardCategory = card.getAttribute("data-category") || "";
        var matched = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (type && cardType !== type) {
          matched = false;
        }
        if (category && cardCategory !== category) {
          matched = false;
        }

        card.classList.toggle("is-hidden", !matched);
      });
    }

    [input, yearSelect, typeSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilters();
    });

    applyFilters();
  });
})();
