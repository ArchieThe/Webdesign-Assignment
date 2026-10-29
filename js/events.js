/* ==========================================================================
   events.js — the campus events directory
   --------------------------------------------------------------------------
   Stage 3: display, search, filter and sort events, and create new ones
   through a validated form.

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

  const form        = document.getElementById('event-form');
  const statusBox   = document.getElementById('form-status');

  if (!listEl || !form) return;   // not on the events page

  /* The fields the form collects, with the rules each must satisfy. Keeping
     the rules as data rather than a long if/else chain means adding a field
     later is a one-line change. */
  const FIELDS = [
    { name: 'title',       label: 'Event title',       required: true,  minLength: 3 },
    { name: 'course',      label: 'Course or program', required: false },
    { name: 'category',    label: 'Category',          required: true },
    { name: 'date',        label: 'Date',              required: true,  type: 'date' },
    { name: 'time',        label: 'Start time',        required: true,  type: 'time' },
    { name: 'mode',        label: 'Mode',              required: true },
    { name: 'location',    label: 'Location',          required: true,  minLength: 3 },
    { name: 'description', label: 'Description',       required: true,  minLength: 10 },
    { name: 'notes',       label: 'Additional notes',  required: false }
  ];

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

  /** Write the current list back to localStorage. */
  function saveEvents() {
    storageSet(localStorage, STORAGE_KEY, events);
  }

  /** Produce an id no existing event is using. */
  function nextId() {
    return 'evt-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  /* ----------------------------------------------------------------------
     VALIDATION
     ---------------------------------------------------------------------- */

  /**
   * Is this a real calendar date in YYYY-MM-DD form?
   *
   * The regular expression only checks the SHAPE of the text. "2026-02-30"
   * has the right shape and does not exist, and JavaScript silently rolls it
   * forward to 2 March rather than rejecting it. So the real test is to build
   * the date and check the day, month and year came back unchanged.
   */
  function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const parts = value.split('-');
    const year  = Number(parts[0]);
    const month = Number(parts[1]);
    const day   = Number(parts[2]);

    if (year < 1900 || year > 2200) return false;

    const probe = new Date(year, month - 1, day);   // months are 0-based
    return probe.getFullYear() === year
        && probe.getMonth() === month - 1
        && probe.getDate() === day;
  }

  /** Is this a 24-hour time between 00:00 and 23:59? */
  function isValidTime(value) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  }

  /**
   * Is this date close enough to today to be a real campus event?
   * isValidDate rejects dates that do not exist; this rejects dates that
   * exist but cannot be what the user meant - usually a mistyped year.
   */
  const YEARS_ALLOWED = 5;

  function isWithinAllowedRange(value) {
    const parts = value.split('-');
    const entered = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

    const earliest = new Date();
    earliest.setFullYear(earliest.getFullYear() - YEARS_ALLOWED);

    const latest = new Date();
    latest.setFullYear(latest.getFullYear() + YEARS_ALLOWED);

    return entered >= earliest && entered <= latest;
  }

  /**
   * Check every field and collect the problems.
   * @returns {Object} field name -> error message. Empty object means valid.
   */
  function validate(values) {
    const errors = {};

    for (let i = 0; i < FIELDS.length; i++) {
      const field = FIELDS[i];
      const value = values[field.name];

      if (field.required && value === '') {
        errors[field.name] = field.label + ' is required.';
        continue;
      }

      if (value !== '' && field.minLength && value.length < field.minLength) {
        errors[field.name] = field.label + ' must be at least ' +
                             field.minLength + ' characters.';
        continue;
      }

      if (field.type === 'date' && value !== '') {
        if (!isValidDate(value)) {
          errors[field.name] = 'Enter a real date in the format YYYY-MM-DD. ' +
                               'Dates such as 30 February do not exist.';
          continue;
        }
        if (!isWithinAllowedRange(value)) {
          errors[field.name] = 'That date is more than ' + YEARS_ALLOWED +
                               ' years away. Please check the year.';
          continue;
        }
      }

      if (field.type === 'time' && value !== '' && !isValidTime(value)) {
        errors[field.name] = 'Enter a valid 24-hour time, for example 14:30.';
      }
    }

    return errors;
  }

  /** Read every field out of the form and trim stray spaces. */
  function readForm() {
    const values = {};
    for (let i = 0; i < FIELDS.length; i++) {
      const input = document.getElementById('field-' + FIELDS[i].name);
      values[FIELDS[i].name] = input ? input.value.trim() : '';
    }
    return values;
  }

  /** Put the error messages on screen beside the fields that failed. */
  function showErrors(errors) {
    let firstBadField = null;

    for (let i = 0; i < FIELDS.length; i++) {
      const field   = FIELDS[i];
      const input   = document.getElementById('field-' + field.name);
      const slot    = document.getElementById('error-' + field.name);
      const message = errors[field.name];

      if (message) {
        input.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');   // announced by screen readers
        slot.textContent = message;
        if (!firstBadField) firstBadField = input;
      } else {
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
        slot.textContent = '';
      }
    }

    if (firstBadField) firstBadField.focus();
  }

  /** Show a success or failure message above the form. */
  function showStatus(message, kind) {
    statusBox.textContent = message;
    statusBox.className = 'status status-' + kind;
    statusBox.hidden = false;
  }

  /* ----------------------------------------------------------------------
     CREATE
     ---------------------------------------------------------------------- */

  form.addEventListener('submit', function (event) {
    /* A form's default action is to submit to its `action` address and load
       the result. This form has no action, so the browser would reload this
       page and throw away everything the script just did. preventDefault
       cancels that, and it is FIRST deliberately - after the validation check
       an early return would skip it. */
    event.preventDefault();

    const values = readForm();
    const errors = validate(values);

    // Object.keys turns {title: "..."} into ["title"], so its length counts
    // how many fields failed.
    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      showStatus('Please correct the ' + Object.keys(errors).length +
                 ' highlighted field(s) below.', 'error');
      return;
    }

    showErrors({});   // clear messages left from a previous attempt

    values.id = nextId();
    events.push(values);
    showStatus('Event "' + values.title + '" was added.', 'success');

    saveEvents();
    form.reset();
    render();
  });

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
    document.getElementById('field-category').appendChild(new Option(name, name));
  }

  for (let i = 0; i < EVENT_MODES.length; i++) {
    const name = EVENT_MODES[i];
    document.getElementById('field-mode').appendChild(new Option(name, name));
  }

  loadEvents();
  render();
})();
