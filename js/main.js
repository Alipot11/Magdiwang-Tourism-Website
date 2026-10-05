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