/* ==========================================================================
   storage.js — a safe wrapper around the browser's storage
   --------------------------------------------------------------------------
   Browser storage can throw instead of returning a value: private browsing
   mode, a browser set to block site data, or a page opened straight from disk
   can all make localStorage unavailable. If that happened and we had not
   planned for it, the whole page would stop running on the first line that
   touched storage.

   Every read and write therefore goes through these two functions, which
   catch the error and let the application carry on with its in-memory data.
   ========================================================================== */

/**
 * Read a JSON value previously written by storageSet.
 * @param {Storage} store    window.localStorage or window.sessionStorage
 * @param {string}  key      the name the value was saved under
 * @param {*}       fallback what to return if nothing is stored or it fails
 * @returns {*} the stored value, or fallback
 */
function storageGet(store, key, fallback) {
  try {
    const raw = store.getItem(key);
    if (raw === null) return fallback;      // nothing saved yet
    return JSON.parse(raw);
  } catch (err) {
    // Storage blocked, or the stored text was not valid JSON.
    console.warn('Could not read "' + key + '" from storage:', err.message);
    return fallback;
  }
}

/**
 * Write a value as JSON.
 * @returns {boolean} true if it was saved, false if storage was unavailable
 */
function storageSet(store, key, value) {
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn('Could not save "' + key + '" to storage:', err.message);
    return false;
  }
}

/** Remove a key, ignoring any error. */
function storageRemove(store, key) {
  try {
    store.removeItem(key);
  } catch (err) {
    console.warn('Could not clear "' + key + '" from storage:', err.message);
  }
}
