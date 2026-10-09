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
    { label: "Stay",    href: "html/lodging.html",    icon: '<path d="M3 6v13M3 16h18v3M21 16v-4a3 3 0 0 0-3-3h-8v7"/><circle cx="6.5" cy="11" r="1.5"/>' },
    { label: "Eat",     href: "html/coming-soon.html",      icon: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 21V3c-2 1-3 4-3 8h3"/>' },
    { label: "Do",      href: "html/activities.html", icon: '<path d="M3 20l6-11 4 7 3-4 5 8z"/>' },
    { label: "Home", href: "index.html", icon: '<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/>' }
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
     const on = clean(url.pathname) === path;
     if (on) a.setAttribute("aria-current", "page");
     else a.removeAttribute("aria-current");
   });
  }
  mark();
  document.body.appendChild(nav);
})();

// ===== Install alert (phones only) =====
// Tapping the alert opens html/install.html. After a tap or "x" it stays away for 14 days.
// It never shows on the install page, or inside the installed app.
(function () {
  const src = document.currentScript && document.currentScript.src;
  if (!src) return;
  const root = new URL("../", src);                       // project root, from js/main.js
  const PAGE = new URL("html/install.html", root).href;
  const KEY = "installPromptDismissed";
  const DAYS = 14;
  const DELAY = 4000; // ms before the alert appears

  if (location.pathname.endsWith("install.html")) return;
  if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone) return;
  if (!window.matchMedia("(max-width: 720px)").matches) return;

  function dismissedRecently() {
    try {
      const t = Number(localStorage.getItem(KEY));
      return t && Date.now() - t < DAYS * 24 * 60 * 60 * 1000;
    } catch (e) { return false; }
  }
  if (dismissedRecently()) return;

  let bar = null;
  function hide() {
    if (bar) { bar.remove(); bar = null; }
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
  }

  function show() {
    if (bar) return;
    bar = document.createElement("div");
    bar.className = "install";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Install the app");

    const link = document.createElement("a");
    link.className = "install__link";
    link.href = PAGE;
    const title = document.createElement("span");
    title.className = "install__title";
    title.textContent = "Install the Magdiwang Tourism App";
    const sub = document.createElement("span");
    sub.className = "install__sub";
    sub.textContent = "Tap to see how";
    link.append(title, sub);
    link.addEventListener("click", () => {
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    });

    const close = document.createElement("button");
    close.type = "button";
    close.className = "install__x";
    close.setAttribute("aria-label", "Dismiss");
    close.textContent = "\u00D7";
    close.addEventListener("click", hide);

    bar.append(link, close);
    document.body.appendChild(bar);
  }

  setTimeout(show, DELAY);
})();