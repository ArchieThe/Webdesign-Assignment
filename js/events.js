/* ==========================================================================
   events.js — the campus events directory
   --------------------------------------------------------------------------
   Stage 1: load the events and display them.

   Wrapped in an IIFE (Immediately Invoked Function Expression) so that the
   names declared inside stay private to this file instead of becoming global
   variables shared with every other script on the page.
   ========================================================================== */

(function () {

  const STORAGE_KEY = 'ace-events';

  /** The working list of events, held in memory while the page is open. */
  let events = [];

  const listEl = document.getElementById('event-list');

  if (!listEl) return;   // not on the events page

  /**
   * Load the events. Anything saved previously is kept in localStorage; if
   * there is nothing stored, the seed list from data.js is used instead.
   */
  function loadEvents() {
    const stored = storageGet(localStorage, STORAGE_KEY, null);

    if (Array.isArray(stored) && stored.length > 0) {
      events = stored;
    } else {
      // Object.assign copies each seed event, so editing one later cannot
      // change the original SEED_EVENTS array.
      events = SEED_EVENTS.map(function (e) { return Object.assign({}, e); });
    }
  }

  /** Turn "2026-10-07" and "10:00" into "Wednesday, 7 October 2026 at 10:00 am". */
  function formatWhen(dateText, timeText) {
    const parts = dateText.split('-');
    const hhmm  = timeText.split(':');
    const when  = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]),
                           Number(hhmm[0]), Number(hhmm[1]));

    return new Intl.DateTimeFormat('en-AU', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).format(when);
  }

  /**
   * Make an element with text already inside it.
   *
   * textContent is used rather than innerHTML throughout this file. innerHTML
   * would parse the string as HTML, so an event title containing a tag would
   * become a real element and any script inside it would run. textContent
   * writes the string as literal characters, which is the standard defence
   * against cross-site scripting (XSS).
   */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /** Build the list item for one event. */
  function buildEventNode(ev) {
    const item = el('li', 'event');

    const head = el('div', 'event-head');
    const titleWrap = el('div');
    titleWrap.appendChild(el('h3', 'event-title', ev.title));
    if (ev.course) titleWrap.appendChild(el('span', 'event-course', ev.course));
    head.appendChild(titleWrap);

    const badges = el('div');
    badges.appendChild(el('span', 'badge badge-category', ev.category));
    badges.appendChild(document.createTextNode(' '));
    badges.appendChild(el('span', 'badge badge-mode', ev.mode));
    head.appendChild(badges);
    item.appendChild(head);

    const meta = el('ul', 'event-meta');
    const when = el('li');
    when.appendChild(el('strong', null, 'When: '));
    when.appendChild(document.createTextNode(formatWhen(ev.date, ev.time)));
    meta.appendChild(when);

    const where = el('li');
    where.appendChild(el('strong', null, 'Where: '));
    where.appendChild(document.createTextNode(ev.location));
    meta.appendChild(where);
    item.appendChild(meta);

    item.appendChild(el('p', 'event-desc', ev.description));
    if (ev.notes) item.appendChild(el('p', 'event-notes', 'Notes: ' + ev.notes));

    return item;
  }

  /** Redraw the list from the current state. */
  function render() {
    // Setting textContent to an empty string removes every child element,
    // which clears the list before it is drawn again.
    listEl.textContent = '';
    events.forEach(function (ev) { listEl.appendChild(buildEventNode(ev)); });
  }

  loadEvents();
  render();
})();
