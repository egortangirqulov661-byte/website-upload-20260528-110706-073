(function () {
  function setupPlayer(box) {
    var video = box.querySelector('video');
    var button = box.querySelector('.play-overlay');
    var status = box.querySelector('.player-status');
    var source = box.getAttribute('data-video-url');
    var hls = null;
    var attached = false;

    function setStatus(text) {
      if (status) {
        status.textContent = text || '';
      }
    }

    function attachSource() {
      if (!video || !source || attached) {
        return;
      }
      attached = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: false });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('播放加载失败，请稍后重试');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        setStatus('播放组件暂不可用');
      }
    }

    function playVideo() {
      attachSource();
      if (!video) {
        return;
      }
      var promise = video.play();
      if (promise && promise.then) {
        promise.then(function () {
          if (button) {
            button.classList.add('is-hidden');
          }
          setStatus('');
        }).catch(function () {
          setStatus('点击视频区域继续播放');
        });
      }
    }

    attachSource();
    if (button) {
      button.addEventListener('click', playVideo);
    }
    if (video) {
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });
      video.addEventListener('pause', function () {
        if (button && video.currentTime === 0) {
          button.classList.remove('is-hidden');
        }
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  document.querySelectorAll('[data-video-url]').forEach(setupPlayer);
})();
