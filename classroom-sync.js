// ── Victoria Classroom Sync Engine ──
// Shared between west-lake-presentation.html (teacher) and student-app.html (student)
// Uses BroadcastChannel for real-time, same-browser tab communication

(function () {
  const CHANNEL = 'victoria_classroom_2026';
  let ch = null;
  try { ch = new BroadcastChannel(CHANNEL); } catch (e) { console.warn('[Sync] BroadcastChannel unavailable'); }

  window.victoriaSync = {
    // Called by the TEACHER presentation on every slide change
    broadcastSlide: function (slideNum) {
      const payload = { type: 'slide', n: slideNum };
      if (ch) ch.postMessage(payload);
      try { localStorage.setItem('victoria_slide', slideNum); } catch (e) {}
    },

    // Called by the STUDENT app to start listening
    onSlideChange: function (callback) {
      if (ch) {
        ch.onmessage = function (e) {
          if (e.data && e.data.type === 'slide') callback(e.data.n);
        };
      }
      // Catch up if student tab opened after teacher already started
      try {
        const saved = parseInt(localStorage.getItem('victoria_slide'));
        if (saved) setTimeout(function () { callback(saved); }, 400);
      } catch (e) {}
    }
  };
})();
