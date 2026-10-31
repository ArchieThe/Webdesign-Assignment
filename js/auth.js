/*
   auth.js — the login gate on the campus events directory page
   --------------------------------------------------------------------------
*/

(function () {
  /* The accepted account. Documented in README.md so the marker can log in. */
  const VALID_USERNAME = 'admin';
  const VALID_PASSWORD = 'INFO1012';

  /* sessionStorage, not localStorage so a session ends when the browser tab is
     closed, so the login does not persist */
  const SESSION_KEY = 'ace-logged-in';

  const loginPanel = document.getElementById('login-panel');
  const appPanel   = document.getElementById('app-panel');
  const loginForm  = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn  = document.getElementById('logout-btn');
  const userLabel  = document.getElementById('session-user');

  if (!loginForm || !loginPanel || !appPanel) return;   // not on this page

  /** Show the application and hide the login form. */
  function showApp(username) {
    loginPanel.hidden = true;
    appPanel.hidden = false;
    if (userLabel) userLabel.textContent = username;
  }

  /** Show the login form and hide the application. */
  function showLogin() {
    loginPanel.hidden = false;
    appPanel.hidden = true;
  }

  /* On page load, continue an existing session if there is one. */
  const session = storageGet(sessionStorage, SESSION_KEY, null);
  if (session && session.username) {
    showApp(session.username);
  } else {
    showLogin();
  }

  loginForm.addEventListener('submit', function (event) {
    // Stop the browser reloading the page, which is a form's default action.
    event.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      /* Only the username is stored. The password is never written to
         storage, so it cannot be recovered from the browser afterwards. */
      storageSet(sessionStorage, SESSION_KEY, { username: username });
      loginError.hidden = true;
      loginForm.reset();
      showApp(username);
    } else {
      /* One message for both a wrong username and a wrong password.
         Saying "no such user" would confirm which usernames exist, which
         helps an attacker guess accounts. */
      loginError.textContent = 'Incorrect username or password. Please try again.';
      loginError.hidden = false;
      document.getElementById('login-password').value = '';
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      storageRemove(sessionStorage, SESSION_KEY);
      showLogin();
    });
  }
})();
