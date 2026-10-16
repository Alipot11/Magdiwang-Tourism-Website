// My Saves: saved places, stored on the visitor's device (localStorage).
// Loaded before main.js on pages that show hearts (index, lodging, events);
// main.js loads it by itself on every other page so the nav link still appears.
(function () {
  if (window.Trip) return;
  const KEY = "magdiwangTrip";
  const src = document.currentScript && document.currentScript.src;
  const root = src ? new URL("../", src) : new URL("./", location.href);
  const listeners = [];
  const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.4-9.5 9-9.5 9z"/></svg>';

  function read() {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(v) ? v.filter(x => typeof x === "string") : [];
    } catch (e) { return []; }
  }
  let ids = read();

  function change(next) {
    ids = next;
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) {}
    listeners.slice().forEach(f => f());
  }

  const Trip = {
    icon: ICON,
    ids: () => ids.slice(),
    has: id => ids.includes(id),
    count: () => ids.length,
    toggle: id => change(ids.includes(id) ? ids.filter(x => x !== id) : ids.concat(id)),
    removeMany: list => change(ids.filter(x => !list.includes(x))),
    onChange: f => { listeners.push(f); },

    // A heart button. floating = true puts it in the top-right corner of a photo.
    button(id, name, floating) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "heart" + (floating ? " heart--abs" : "");
      b.innerHTML = ICON;
      b.setAttribute("aria-label", "Save " + name + " to My Saves");
      function sync() {
        const on = Trip.has(id);
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", String(on));
      }
      b.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); Trip.toggle(id); });
      listeners.push(sync);
      sync();
      return b;
    }
  };
  window.Trip = Trip;

  // Another tab changed the list
  window.addEventListener("storage", e => {
    if (e.key === KEY) { ids = read(); listeners.slice().forEach(f => f()); }
  });

  // Nav link with a count
  const menu = document.getElementById("menu");
  if (menu) {
    const a = document.createElement("a");
    a.className = "nav__trip";
    a.href = new URL("html/trip.html", root).href;
    if (location.pathname.endsWith("trip.html")) a.setAttribute("aria-current", "page");
    function update() {
      const n = ids.length;
      a.textContent = n ? "My Saves \u00B7 " + n : "My Saves";
      a.setAttribute("aria-label", n ? "My Saves, " + n + " saved" : "My Saves");
    }
    listeners.push(update);
    update();
    const install = menu.querySelector('a[href$="install.html"]');
    menu.insertBefore(a, install || null);
  }
})();