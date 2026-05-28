(function () {
  document.querySelectorAll(".player-shell").forEach(function (shell) {
    var video = shell.querySelector("video");
    var button = shell.querySelector(".player-cover");
    var stream = shell.getAttribute("data-stream");
    var started = false;
    var hlsInstance = null;

    function attachStream() {
      if (!video || !stream) {
        return;
      }
      if (!started) {
        started = true;
        shell.classList.add("is-playing");
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        } else {
          video.src = stream;
        }
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", attachStream);
    }
    if (video) {
      video.addEventListener("click", function () {
        if (!started) {
          attachStream();
        }
      });
      video.addEventListener("error", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
    }
  });
})();
