function initMoviePlayer(config) {
    var video = document.getElementById(config.videoId);
    var button = document.getElementById(config.buttonId);
    var source = config.source;
    var started = false;
    var hls = null;

    function load() {
        if (started || !video || !source) {
            return;
        }
        started = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function play() {
        load();
        if (button) {
            button.classList.add("hidden");
        }
        var playRequest = video.play();
        if (playRequest && typeof playRequest.catch === "function") {
            playRequest.catch(function () {
                if (button) {
                    button.classList.remove("hidden");
                }
            });
        }
    }

    if (button) {
        button.addEventListener("click", play);
    }

    if (video) {
        video.addEventListener("click", function () {
            if (!started || video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            if (button) {
                button.classList.add("hidden");
            }
        });
        video.addEventListener("pause", function () {
            if (button && video.currentTime === 0) {
                button.classList.remove("hidden");
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }
}
