
/* clock.js — the live date and time shown in the page footer*/

(function () {
  const clock = document.getElementById('live-clock');

  // leaving early avoids an error.
  if (!clock) return;

  /* Intl.DateTimeFormat produces a date format */
  const formatter = new Intl.DateTimeFormat('en-AU', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
    second:  '2-digit',
    hour12:  true
  });

  function tick() {
    const now = new Date();
    clock.textContent = formatter.format(now);
    // datetime holds a machine-readable copy for screen readers and search engines
    clock.setAttribute('datetime', now.toISOString());
  }

  tick();
  setInterval(tick, 1000); // then update once per second
})();
