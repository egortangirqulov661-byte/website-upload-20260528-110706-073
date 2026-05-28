(function () {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let current = 0;
    let timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(current + 1);
        restart();
      });
    }

    restart();
  }

  const searchInput = document.querySelector("[data-search-input]");
  const categoryFilter = document.querySelector("[data-category-filter]");
  const grid = document.querySelector("[data-movie-grid]");

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function filterMovies() {
    if (!grid) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll(".movie-card"));
    const query = normalize(searchInput ? searchInput.value : "");
    const category = categoryFilter ? categoryFilter.value : "all";

    cards.forEach(function (card) {
      const text = normalize(card.getAttribute("data-text"));
      const cardCategory = card.getAttribute("data-category") || "";
      const matchedText = !query || text.indexOf(query) !== -1;
      const matchedCategory = category === "all" || cardCategory === category;
      card.classList.toggle("is-hidden", !(matchedText && matchedCategory));
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterMovies);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterMovies);
  }
})();
