# Adelaide Campus Events

- GITHUB LINK (github classroom did not work): https://github.com/ArchieThe/Webdesign-Assignment.git

A campus events directory built for **INFO 1012 Information Technology Systems**,
Assignment 3 (Web Page Development), Adelaide University.

Hand-written HTML, CSS and JavaScript. No frameworks and no libraries.

## Pages

- `index.html` - home page
- `events.html` - the campus events directory
- `blog.html` - troubleshooting blog and project plan
- `ethics.html` - ethics and privacy reflection

## How to run it
 
THere is No server, no build step and no installation. Download or clone the repository,
then open `index.html` in a web browser. Every page works when opened directly
from the file system.

## Sign-in details

The **Events Directory** page is behind a login. The create, update, delete and
recommend controls are only available once signed in.

| | |
|---|---|
| **Username** | `admin` |
| **Password** | `INFO1012` |

The session is held in `sessionStorage`, so it ends when the browser tab is
closed. There is also a **Sign out** button on the page.

> These credentials are written in `js/auth.js`, which the browser downloads in
> full, so anyone can read them. This is a client-side application with no
> server, so the login restricts access but is not real security. This is
> discussed in full on the Ethics & Privacy page.

## What each file does

**Pages**

- `index.html` - home page: image gallery, About the App, About Me, three featured events
- `events.html` - the events directory: login, search, filter, sort, create, update, delete, recommend
- `blog.html` - troubleshooting blog: the Agile research, the sprint plan, and two documented errors
- `ethics.html` - the ethics and privacy reflection

**Styles**

- `css/style.css` - the single stylesheet shared by all four pages

**Scripts**

- `js/storage.js` - a small wrapper around `localStorage` and `sessionStorage` that
  fails gracefully instead of throwing when storage is unavailable
- `js/data.js` - the seed events the directory starts with
- `js/clock.js` - the live date and time in the footer of every page
- `js/home.js` - the image gallery on the home page
- `js/auth.js` - the login gate on the events directory
- `js/events.js` - the directory itself: rendering, search, filter, sort, validation and CRUD

**Images**

- `images/*.svg` - the four event illustrations, hand-written SVG
- `images/screenshots/` - the before and after screenshots used in the troubleshooting blog

## How the data behaves

The first time `events.html` is opened, the directory is seeded from
`js/data.js`. After that, every change is saved to the browser's `localStorage`
under the key `ace-events`, so events added, edited or deleted are still there
after a refresh or after closing the browser.

The data is stored per browser and per device. Nothing is sent anywhere: there
is no server, no database and no network request.

**To reset the directory to its original seed data**, open the browser console
on `events.html` (F12) and run:

```javascript
localStorage.removeItem('ace-events');
```

Then refresh the page.

## Notes

- Mainly tested in Chrome, at desktop.
- User-entered text is placed on the page with `textContent` rather than
  `innerHTML`, so text that looks like markup is displayed as text and never
  executed.

---

INFO 1012 Information Technology Systems - Assignment 3, Web Page Development.
