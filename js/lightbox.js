// Photo lightbox: tap a photo to see it large, then move through the rest of its gallery.
// Load this LAST on a page (after the page's own script). It finds the photo tiles by the
// class names listed in GROUPS below, so the page scripts don't need to change.
(function () {
  const src = document.currentScript && document.currentScript.src;
  if (src) { // load the stylesheet that sits next to js/
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("../style/lightbox.css", src).href;
    document.head.appendChild(link);
  }

  const text = e => (e ? e.textContent.trim() : "");
  // One entry per kind of gallery. sel = the photo tiles. scope = photos only group with the
  // others inside the same ancestor (for example one coast place, or one cafe).
  const GROUPS = [
    { sel: ".mom__tile",   info: el => ({ caption: text(el.querySelector("span")) }) },
    { sel: ".falls__tile", info: el => ({ caption: text(el.querySelector("span")) }) },
    { sel: ".coast__photo", scope: ".coast__row", info: el => ({ caption: text(el.closest(".coast__row").querySelector(".coast__name")) }) },
    { sel: ".dishes__tile", info: el => ({ caption: el.dataset.lbLabel === "Local dish" ? "" : el.dataset.lbLabel || "" }) },
    { sel: ".cafe__photo", scope: ".cafe", info: el => ({ caption: text(el.closest(".cafe").querySelector(".cafe__name")) }) },
    { sel: ".kayak__photos div", info: () => ({ caption: text(document.getElementById("kayak-title")) }) },
    { sel: ".swim__photo", info: el => ({ caption: el.dataset.lbLabel || "" }) },
    { sel: ".sp__photo", info: el => {
        const card = el.closest(".sp");
        return { caption: text(card.querySelector(".sp__name")), credit: text(card.querySelector(".sp__credit")) };
      } }
  ];
  const SCROLLERS = ".falls__view, .mom__view, .coast__view, .cafe__strip";

  function urlOf(el) {
    const m = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(el).backgroundImage);
    return m ? m[1] : "";
  }
  const hasImage = el => getComputedStyle(el).backgroundImage !== "none";
  const groupOf = el => GROUPS.find(g => el.matches(g.sel));

  // ----- Make the photo tiles clickable and keyboard friendly -----
  const observers = new Map();
  function watch(tile, root) {
    // Tiles in a slider that are off-screen must not be tabbable, or Tab would scroll the slider.
    let o = observers.get(root);
    if (!o && "IntersectionObserver" in window) {
      o = new IntersectionObserver(list => list.forEach(e => { e.target.tabIndex = e.isIntersecting ? 0 : -1; }),
        { root, threshold: 0.5 });
      observers.set(root, o);
    }
    tile.tabIndex = o ? -1 : 0;
    if (o) o.observe(tile);
  }
  GROUPS.forEach(g => {
    document.querySelectorAll(g.sel).forEach(el => {
      if (!hasImage(el)) return; // grey placeholder boxes stay plain
      el.dataset.lbLabel = el.getAttribute("aria-label") || "";
      el.classList.add("lb-tile");
      el.setAttribute("role", "button");
      const cap = g.info(el).caption;
      el.setAttribute("aria-label", "Open photo" + (cap ? ": " + cap : ""));
      const root = el.closest(SCROLLERS);
      if (root) watch(el, root); else el.tabIndex = 0;
    });
  });

  // ----- The viewer -----
  let box, stage, img, textEl, creditEl, countEl, prevB, nextB, closeB;
  let entries = [], at = 0, opener = null;

  function build() {
    box = document.createElement("div");
    box.className = "lb";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    function btn(cls, label, glyph) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lb__btn " + cls;
      b.setAttribute("aria-label", label);
      b.textContent = glyph;
      return b;
    }
    closeB = btn("lb__close", "Close photo viewer", "\u00D7");
    prevB = btn("lb__prev", "Previous photo", "\u2190");
    nextB = btn("lb__next", "Next photo", "\u2192");
    stage = document.createElement("figure");
    stage.className = "lb__fig";
    img = document.createElement("img");
    img.className = "lb__img";
    const cap = document.createElement("figcaption");
    cap.className = "lb__cap";
    textEl = document.createElement("span"); textEl.className = "lb__text";
    creditEl = document.createElement("span"); creditEl.className = "lb__credit";
    countEl = document.createElement("span"); countEl.className = "lb__count";
    cap.append(textEl, creditEl, countEl);
    stage.append(img, cap);
    box.append(closeB, prevB, stage, nextB);
    document.body.appendChild(box);

    closeB.addEventListener("click", close);
    prevB.addEventListener("click", () => show(at - 1));
    nextB.addEventListener("click", () => show(at + 1));
    box.addEventListener("click", e => { if (e.target === box || e.target === stage) close(); });
    img.addEventListener("error", () => { textEl.textContent = "This photo could not be loaded."; });

    // Swipe left or right on a phone
    let x0 = null;
    box.addEventListener("pointerdown", e => { x0 = e.target.closest("button") ? null : e.clientX; });
    box.addEventListener("pointerup", e => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
    });
    box.addEventListener("pointercancel", () => { x0 = null; });

    document.addEventListener("keydown", e => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(at - 1);
      else if (e.key === "ArrowRight") show(at + 1);
      else if (e.key === "Tab") { // keep focus inside the viewer
        const f = [closeB, prevB, nextB].filter(b => !b.hidden);
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
  }

  function show(i) {
    const n = entries.length;
    at = (i + n) % n;
    const e = entries[at];
    img.alt = e.caption || "Photo";
    img.src = e.src;
    textEl.textContent = e.caption;
    creditEl.textContent = e.credit;
    countEl.textContent = n > 1 ? (at + 1) + " / " + n : "";
    [1, -1].forEach(d => { if (n > 1) new Image().src = entries[(at + d + n) % n].src; }); // preload neighbours
  }

  function open(tile) {
    const g = groupOf(tile);
    if (!g) return;
    const scope = g.scope ? tile.closest(g.scope) : document;
    const tiles = [...scope.querySelectorAll(g.sel)].filter(hasImage);
    entries = tiles.map(t => { const i = g.info(t); return { src: urlOf(t), caption: i.caption || "", credit: i.credit || "" }; });
    if (!box) build();
    opener = tile;
    prevB.hidden = nextB.hidden = entries.length < 2;
    box.hidden = false;
    document.body.style.overflow = "hidden";
    show(tiles.indexOf(tile));
    closeB.focus();
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = "";
    img.removeAttribute("src");
    if (opener) opener.focus();
  }

  // Open on click (but not at the end of a swipe in a slider) or Enter / Space
  let down = null, dragged = false;
  document.addEventListener("pointerdown", e => { down = { x: e.clientX, y: e.clientY }; dragged = false; }, true);
  document.addEventListener("pointermove", e => {
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) dragged = true;
  }, true);
  document.addEventListener("click", e => {
    const t = e.target.closest && e.target.closest(".lb-tile");
    if (!t || dragged) return;
    open(t);
  });
  document.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const t = e.target.classList && e.target.classList.contains("lb-tile") ? e.target : null;
    if (!t) return;
    e.preventDefault();
    open(t);
  });
})();