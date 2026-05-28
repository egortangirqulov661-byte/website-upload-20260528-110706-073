(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function initHero() {
        var sliders = document.querySelectorAll("[data-hero-slider]");
        sliders.forEach(function (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
            var prev = slider.querySelector("[data-hero-prev]");
            var next = slider.querySelector("[data-hero-next]");
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function restart() {
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5600);
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(Number(dot.getAttribute("data-hero-dot")) || 0);
                    restart();
                });
            });

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    restart();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    restart();
                });
            }

            show(0);
            restart();
        });
    }

    function initFilters() {
        var forms = document.querySelectorAll("[data-filter-form]");
        forms.forEach(function (form) {
            var scope = form.parentElement;
            var list = scope ? scope.querySelector("[data-filter-list]") : null;
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

            function apply() {
                var data = new FormData(form);
                var keyword = normalize(data.get("keyword"));
                var year = normalize(data.get("year"));
                var region = normalize(data.get("region"));
                var type = normalize(data.get("type"));

                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-genre"),
                        card.textContent
                    ].join(" "));
                    var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchYear = !year || normalize(card.getAttribute("data-year")) === year;
                    var matchRegion = !region || normalize(card.getAttribute("data-region")) === region;
                    var matchType = !type || normalize(card.getAttribute("data-type")) === type;
                    card.style.display = matchKeyword && matchYear && matchRegion && matchType ? "" : "none";
                });
            }

            form.addEventListener("input", apply);
            form.addEventListener("change", apply);
        });
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function cardTemplate(item) {
        var title = escapeHtml(item.title);
        var year = escapeHtml(item.year);
        var region = escapeHtml(item.region);
        var type = escapeHtml(item.type);
        var genre = escapeHtml(item.genre);
        var oneLine = escapeHtml(item.oneLine);
        var image = escapeHtml(item.image);
        var file = escapeHtml(item.file);
        var rating = escapeHtml(item.rating);
        return [
            '<article class="movie-card">',
            '<a class="poster-link" href="' + file + '" aria-label="观看' + title + '">',
            '<img src="' + image + '" alt="' + title + '" loading="lazy">',
            '<span class="card-score">' + rating + '</span>',
            '</a>',
            '<div class="card-body">',
            '<div class="card-meta"><span>' + year + '</span><span>' + region + '</span><span>' + type + '</span></div>',
            '<h3><a href="' + file + '">' + title + '</a></h3>',
            '<p>' + oneLine + '</p>',
            '<div class="tag-row"><span>' + genre + '</span></div>',
            '</div>',
            '</article>'
        ].join("");
    }

    function initSearchPage() {
        var form = document.querySelector("[data-search-page-form]");
        var results = document.querySelector("[data-search-results]");
        if (!form || !results || !window.SEARCH_DATA) {
            return;
        }
        var input = form.querySelector("input[name='q']");
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        input.value = initial;

        function render() {
            var q = normalize(input.value);
            var pool = window.SEARCH_DATA;
            var matches = q ? pool.filter(function (item) {
                return normalize([
                    item.title,
                    item.region,
                    item.type,
                    item.genre,
                    item.tags,
                    item.year,
                    item.oneLine
                ].join(" ")).indexOf(q) !== -1;
            }) : pool.slice(0, 24);
            matches = matches.slice(0, 120);
            if (!matches.length) {
                results.innerHTML = '<div class="empty-result">没有找到匹配影片</div>';
                return;
            }
            results.innerHTML = matches.map(cardTemplate).join("");
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var q = input.value.trim();
            var nextUrl = q ? "./search.html?q=" + encodeURIComponent(q) : "./search.html";
            history.replaceState(null, "", nextUrl);
            render();
        });
        input.addEventListener("input", render);
        render();
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initSearchPage();
    });
})();
