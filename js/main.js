// Mobile menu toggle
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");
 
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
 
// Close the menu after tapping a link
menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);
 
// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Register the offline service worker (sw.js lives in the project root)
if ("serviceWorker" in navigator && document.currentScript) {
  const root = new URL("../", document.currentScript.src);
  navigator.serviceWorker.register(new URL("sw.js", root)).catch(() => {});
}

// ===== Mobile bottom tab bar =====
// Paste at the END of js/main.js. Works on index.html and every page in html/.
// It is only visible on phones (see the matching CSS in style/index.css).
(function () {
  const src = document.currentScript && document.currentScript.src;
  if (!src) return;
  const root = new URL("../", src); // project root, from js/main.js

  // Edit this list to change the tabs (icons are 24x24 line paths)
  const TABS = [
    { label: "Explore", href: "html/explore.html",    icon: '<circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6z"/>' },
    { label: "Stay",    href: "html/lodging.html",    icon: '<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/>' },
    { label: "Eat",     href: "html/foods.html",      icon: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 21V3c-2 1-3 4-3 8h3"/>' },
    { label: "Do",      href: "html/activities.html", icon: '<path d="M3 20l6-11 4 7 3-4 5 8z"/>' },
    { label: "Map",     href: "index.html#map-section", icon: '<path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>' }
  ];

  const clean = p => (p.endsWith("/") ? p + "index.html" : p);
  const nav = document.createElement("nav");
  nav.className = "tabbar";
  nav.setAttribute("aria-label", "Quick navigation");

  const links = TABS.map(t => {
    const url = new URL(t.href, root);
    const a = document.createElement("a");
    a.href = url.href;
    a.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' + t.icon + "</svg><span>" + t.label + "</span>";
    nav.appendChild(a);
    return { a, url };
  });

  function mark() {
    const path = clean(location.pathname);
    links.forEach(({ a, url }) => {
      let on = clean(url.pathname) === path;
      if (url.hash) on = on && location.hash === url.hash;           // Map tab
      else if (clean(url.pathname) === path && path.endsWith("index.html") && location.hash === "#map-section") on = false;
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("hashchange", mark);
  mark();
  document.body.appendChild(nav);
})();

// ===== Install prompt (phones only) =====
// Android/Chrome: shows an "Install" button that opens the real install dialog.
// iPhone/iPad: Apple has no install button, so it shows "Share > Add to Home Screen".
// Hidden when the app is already installed, and after "x" it stays away for 14 days.
(function () {
  const KEY = "installPromptDismissed";
  const DAYS = 14;
  const DELAY = 4000; // ms before the banner appears

  const installed = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (installed) return;

  function dismissedRecently() {
    try {
      const t = Number(localStorage.getItem(KEY));
      return t && Date.now() - t < DAYS * 24 * 60 * 60 * 1000;
    } catch (e) { return false; }
  }
  if (dismissedRecently()) return;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let deferred = null, bar = null;

  function hide(remember) {
    if (bar) { bar.remove(); bar = null; }
    if (remember) { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
  }

  function show(text, withButton) {
    if (bar || !window.matchMedia("(max-width: 720px)").matches) return;
    bar = document.createElement("div");
    bar.className = "install";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Install the Magdiwang app");

    const msg = document.createElement("p");
    msg.textContent = text;
    bar.appendChild(msg);

    if (withButton) {
      const go = document.createElement("button");
      go.type = "button";
      go.className = "install__go";
      go.textContent = "Install";
      go.addEventListener("click", () => {
        if (!deferred) return;
        deferred.prompt();
        deferred.userChoice.then(() => { deferred = null; hide(true); });
      });
      bar.appendChild(go);
    }

    const close = document.createElement("button");
    close.type = "button";
    close.className = "install__x";
    close.setAttribute("aria-label", "Dismiss");
    close.textContent = "\u00D7";
    close.addEventListener("click", () => hide(true));
    bar.appendChild(close);

    document.body.appendChild(bar);
  }

  // Android / Chrome
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferred = e;
    setTimeout(() => show("Add Magdiwang to your home screen to use it offline.", true), DELAY);
  });
  window.addEventListener("appinstalled", () => hide(false));

  // iPhone / iPad
  if (isIOS) {
    setTimeout(() => show("Install this app: tap Share, then Add to Home Screen.", false), DELAY);
  }
})();