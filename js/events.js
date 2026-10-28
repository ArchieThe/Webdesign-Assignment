/* ==========================================================================
   events.js — the campus events directory
   --------------------------------------------------------------------------
   Stage 2: display the events, and let the user search, filter and sort them.

   Wrapped in an IIFE (Immediately Invoked Function Expression) so that the
   names declared inside stay private to this file instead of becoming global
   variables shared with every other script on the page.
   ========================================================================== */

(function () {

  const STORAGE_KEY = 'ace-events';

  /** The working list of events, held in memory while the page is open. */
  let events = [];

  const listEl         = document.getElementById('event-list');
  const countEl        = document.getElementById('result-count');
  const emptyEl        = document.getElementById('empty-state');
  const searchInput    = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-filter');
  const sortSelect     = document.getElementById('sort-order');

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
      // Copy each seed event so editing one later cannot change the
      // original SEED_EVENTS array. Objects are held by reference, so
      // without the copy both lists would point at the same objects.
      events = [];
      for (let i = 0; i < SEED_EVENTS.length; i++) {
        events.push(Object.assign({}, SEED_EVENTS[i]));
      }
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

  /* ----------------------------------------------------------------------
     SEARCH, FILTER AND SORT
     ---------------------------------------------------------------------- */

  /** The events matching the current search box and category dropdown. */
  function getVisibleEvents() {
    const term     = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;

    // Build a NEW array of matching events rather than removing from
    // `events`, so a search never alters the full list.
    const result = [];

    for (let i = 0; i < events.length; i++) {
      const e = events[i];

      // "all" matches every category; otherwise it must match exactly.
      const categoryMatches = (category === 'all') || (e.category === category);

      // An empty search box matches everything. Otherwise look for the term
      // in the fields a student would reasonably search by.
      const haystack = (e.title + ' ' + e.description + ' ' + e.course + ' ' +
                        e.location + ' ' + e.notes).toLowerCase();
      const keywordMatches = (term === '') || haystack.indexOf(term) !== -1;

      if (categoryMatches && keywordMatches) {
        result.push(e);
      }
    }

    const order = sortSelect.value;
    result.sort(function (a, b) {
      // localeCompare returns negative, zero or positive - exactly what
      // .sort() needs - and orders letters the way a reader expects.
      if (order === 'title') return a.title.localeCompare(b.title);

      // Dates are stored as YYYY-MM-DD, a format where sorting the text
      // alphabetically gives the same answer as sorting by date, because the
      // most significant part comes first and every part is zero-padded.
      const left  = a.date + 'T' + a.time;
      const right = b.date + 'T' + b.time;
      return (order === 'latest') ? right.localeCompare(left)
                                  : left.localeCompare(right);
    });

    return result;
  }

  /** Redraw the list from the current state. */
  function render() {
    const visible = getVisibleEvents();

    // Setting textContent to an empty string removes every child element,
    // which clears the list before it is drawn again.
    listEl.textContent = '';
    for (let i = 0; i < visible.length; i++) {
      listEl.appendChild(buildEventNode(visible[i]));
    }

    countEl.textContent = 'Showing ' + visible.length + ' of ' + events.length +
                          ' event' + (events.length === 1 ? '' : 's') + '.';
    emptyEl.hidden = (visible.length > 0);
  }

  /* ----------------------------------------------------------------------
     WIRING UP AND STARTING
     ---------------------------------------------------------------------- */

  // 'input' fires on every keystroke, so the list filters as you type.
  searchInput.addEventListener('input', render);
  categorySelect.addEventListener('change', render);
  sortSelect.addEventListener('change', render);

  /* Fill the category dropdown from the single list in data.js, so the
     filter can never disagree with the categories the data actually uses. */
  for (let i = 0; i < EVENT_CATEGORIES.length; i++) {
    const name = EVENT_CATEGORIES[i];
    categorySelect.appendChild(new Option(name, name));
  }

  loadEvents();
  render();
})();
