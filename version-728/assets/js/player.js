(function () {
    function bindSource(video, source) {
        if (!video || !source || video.getAttribute("data-bound") === "true") {
            return;
        }

        video.setAttribute("data-bound", "true");

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hls.loadSource(source);
            hls.attachMedia(video);
            video.hlsInstance = hls;
            return;
        }

        video.src = source;
    }

    window.initMoviePlayer = function (videoId, source) {
        var video = document.getElementById(videoId);

        if (!video) {
            return;
        }

        var frame = video.closest(".player-frame");
        var button = frame ? frame.querySelector("[data-play-button]") : null;

        bindSource(video, source);

        function start() {
            bindSource(video, source);

            if (frame) {
                frame.classList.add("is-playing");
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    if (frame) {
                        frame.classList.remove("is-playing");
                    }
                });
            }
        }

        if (button) {
            button.addEventListener("click", start);
        }

        video.addEventListener("play", function () {
            if (frame) {
                frame.classList.add("is-playing");
            }
        });

        video.addEventListener("pause", function () {
            if (frame && video.currentTime === 0) {
                frame.classList.remove("is-playing");
            }
        });

        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
    };
})();
