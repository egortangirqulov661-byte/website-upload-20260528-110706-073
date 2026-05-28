(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            menuButton.classList.toggle("is-open");
            mobileNav.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var activeSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === activeSlide);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === activeSlide);
        });
    }

    dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
            showSlide(dotIndex);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5600);
    }

    var filterRoot = document.querySelector("[data-filter-root]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var emptyState = document.querySelector("[data-empty-state]");

    if (filterRoot && cards.length) {
        var queryInput = filterRoot.querySelector("[data-filter-query]");
        var categorySelect = filterRoot.querySelector("[data-filter-category]");
        var regionInput = filterRoot.querySelector("[data-filter-region]");
        var yearInput = filterRoot.querySelector("[data-filter-year]");
        var clearButton = filterRoot.querySelector("[data-filter-clear]");
        var state = filterRoot.querySelector("[data-filter-state]");
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";

        if (queryInput && initialQuery) {
            queryInput.value = initialQuery;
        }

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function applyFilters() {
            var query = normalize(queryInput ? queryInput.value : "");
            var category = categorySelect ? categorySelect.value : "all";
            var region = normalize(regionInput ? regionInput.value : "");
            var year = normalize(yearInput ? yearInput.value : "");
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var matchesQuery = !query || text.indexOf(query) !== -1;
                var matchesCategory = category === "all" || card.getAttribute("data-category") === category;
                var matchesRegion = !region || normalize(card.getAttribute("data-region")).indexOf(region) !== -1;
                var matchesYear = !year || normalize(card.getAttribute("data-year")).indexOf(year) !== -1;
                var show = matchesQuery && matchesCategory && matchesRegion && matchesYear;

                card.style.display = show ? "" : "none";

                if (show) {
                    visible += 1;
                }
            });

            if (state) {
                state.textContent = visible > 0 ? "正在显示匹配影片" : "暂无匹配影片";
            }

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visible === 0);
            }
        }

        [queryInput, categorySelect, regionInput, yearInput].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });

        if (clearButton) {
            clearButton.addEventListener("click", function () {
                if (queryInput) {
                    queryInput.value = "";
                }

                if (categorySelect) {
                    categorySelect.value = "all";
                }

                if (regionInput) {
                    regionInput.value = "";
                }

                if (yearInput) {
                    yearInput.value = "";
                }

                applyFilters();
            });
        }

        applyFilters();
    }
})();
