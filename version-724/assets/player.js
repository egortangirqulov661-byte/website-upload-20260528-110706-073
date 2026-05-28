(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function setMessage(button, text) {
    if (!button) {
      return;
    }
    var strong = button.querySelector("strong");
    if (strong) {
      strong.textContent = text;
    }
  }

  function playVideo(video, button) {
    if (!video) {
      return;
    }
    var source = video.getAttribute("data-video-src");
    if (!source) {
      setMessage(button, "暂无播放源");
      return;
    }

    function startPlayback() {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          setMessage(button, "再次点击播放");
        });
      }
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      if (video.src !== source) {
        video.src = source;
      }
      video.load();
      startPlayback();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video.__hlsInstance) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        video.__hlsInstance = hls;
      }
      startPlayback();
      return;
    }

    video.src = source;
    video.load();
    startPlayback();
  }

  ready(function () {
    var video = document.getElementById("moviePlayer");
    var button = document.querySelector("[data-play-button]");
    if (!video || !button) {
      return;
    }

    button.addEventListener("click", function () {
      button.classList.add("is-hidden");
      playVideo(video, button);
    });

    video.addEventListener("play", function () {
      button.classList.add("is-hidden");
    });

    video.addEventListener("pause", function () {
      if (!video.ended) {
        button.classList.remove("is-hidden");
        setMessage(button, "继续播放");
      }
    });

    video.addEventListener("ended", function () {
      button.classList.remove("is-hidden");
      setMessage(button, "重新播放");
    });
  });
})();
