(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ----- Anchor bar highlight -----
  const links = [...document.querySelectorAll(".nsub__in a[href^='#']")];
  const secs = links.map(a => document.querySelector(a.getAttribute("href")));
  function mark() {
    let on = 0;
    secs.forEach((s, n) => { if (s && s.getBoundingClientRect().top < 160) on = n; });
    links.forEach((a, n) => a.classList.toggle("on", n === on));
  }
  window.addEventListener("scroll", mark, { passive: true });
  mark();

  // ----- Waterfalls slider (manual: arrows, dots, swipe, keyboard) -----
  const PER = 3;
  const fTrack = document.getElementById("ftrack");
  const fView = document.getElementById("fview");
  const fDots = document.getElementById("fdots");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const falls = window.FALLS || [];
  const slides = Math.max(1, Math.ceil(falls.length / PER));
  let cur = 0;
  const sDots = [];

  for (let s = 0; s < slides; s++) {
    const slide = document.createElement("div");
    slide.className = "falls__slide";
    for (let k = 0; k < PER; k++) {
      const f = falls[s * PER + k];
      const tile = document.createElement("div");
      tile.className = "falls__tile";
      if (f && f.image) {
        tile.style.backgroundImage = "url('../" + f.image + "')";
        tile.setAttribute("role", "img");
        tile.setAttribute("aria-label", f.name || "Waterfall");
      }
      if (f && f.name) {
        const cap = document.createElement("span");
        cap.textContent = f.name;
        tile.appendChild(cap);
      }
      slide.appendChild(tile);
    }
    fTrack.appendChild(slide);

    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Slide " + (s + 1));
    b.addEventListener("click", () => show(s));
    fDots.appendChild(b);
    sDots.push(b);
  }
  function show(i) {
    cur = Math.min(slides - 1, Math.max(0, i));
    fTrack.style.transform = "translateX(-" + cur * 100 + "%)";
    sDots.forEach((d, n) => d.setAttribute("aria-current", String(n === cur)));
    prev.disabled = cur === 0;
    next.disabled = cur === slides - 1;
  }
  prev.addEventListener("click", () => show(cur - 1));
  next.addEventListener("click", () => show(cur + 1));
  fView.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  let x0 = null;
  fView.addEventListener("pointerdown", e => { x0 = e.clientX; });
  fView.addEventListener("pointerup", e => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  });
  fView.addEventListener("pointercancel", () => { x0 = null; });
  if (slides < 2) { prev.hidden = true; next.hidden = true; fDots.hidden = true; }
  show(0);

  // ----- Wildlife cards -----
  function make(tag, cls, text) {
    const e = document.createElement(tag);
    e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  const grid = document.getElementById("wgrid");
  (window.WILDLIFE || []).forEach(w => {
    const card = make("article", "sp");
    const photo = make("div", "sp__photo");
    if (w.image) {
      photo.style.backgroundImage = "url('../" + w.image + "')";
      photo.setAttribute("role", "img");
      photo.setAttribute("aria-label", w.name, w.conservation);
    }
    const tags = make("div", "sp__tags");
    tags.append(make("span", "sp__tag", w.tag));
    if (w.endemic) tags.append(make("span", "sp__tag sp__endemic", "Endemic"));
    if (w.scientific) tags.append(make("span", "sp__tag sp__sci", w.scientific));
    const status = w.status ? make("p", "sp__status") : null;
    if (status) {
      status.append(make("span", "sp__status-label", "Conservation status: "), document.createTextNode(w.status));
    }
    const local = w.local ? make("p", "sp__local") : null;
    if (local) {
      local.append(make("span", "sp__local-label", "Filipino name: "), document.createTextNode(w.local));
    }
    let credit = null;
    if (w.credit) {
      credit = make("p", "sp__credit");
      credit.append(document.createTextNode("Photo: "));
      if (w.creditUrl) {
        const a = make("a", "", w.credit);
        a.href = w.creditUrl;
        a.target = "_blank";
        a.rel = "noopener";
        credit.appendChild(a);
      } else {
        credit.appendChild(document.createTextNode(w.credit));
      }
    }
    card.appendChild(photo);
    if (credit) card.appendChild(credit);
    card.append(tags, make("h3", "sp__name", w.name));
    if (local) card.appendChild(local);
    card.appendChild(make("p", "sp__note", w.note || ""));
    if (status) card.appendChild(status);
    grid.appendChild(card);
  });

  // ----- Coast (alternating rows) -----
  const list = document.getElementById("clist");
  const coast = window.COAST || [];
  if (!coast.length) list.appendChild(make("p", "coast__empty", "No places listed yet."));
  coast.forEach(c => {
    const row = make("div", "coast__row");
    const pics = c.images && c.images.length ? c.images : [c.image || ""];
    const total = Math.ceil(pics.length / 3);
    let at = 0;

    const media = make("div", "coast__media");
    const view = make("div", "coast__view");
    view.tabIndex = 0;
    view.setAttribute("aria-label", c.name + " photos, use the arrows to slide");
    const track = make("div", "coast__track");
    for (let s = 0; s < total; s++) {
      const group = pics.slice(s * 3, s * 3 + 3);
      const slide = make("div", "coast__photos coast__photos--" + group.length);
      group.forEach((u, n) => {
        const d = make("div", "coast__photo");
        if (u) d.style.backgroundImage = "url('../" + u + "')";
        d.setAttribute("role", "img");
        d.setAttribute("aria-label", c.name + " photo " + (s * 3 + n + 1));
        slide.appendChild(d);
      });
      track.appendChild(slide);
    }
    view.appendChild(track);
    media.appendChild(view);

    if (total > 1) {
      const prevB = make("button", "coast__btn coast__btn--prev", "\u2190");
      const nextB = make("button", "coast__btn coast__btn--next", "\u2192");
      prevB.type = nextB.type = "button";
      prevB.setAttribute("aria-label", "Previous photos");
      nextB.setAttribute("aria-label", "Next photos");
      const dotBox = make("div", "coast__dots");
      const dotList = [];
      for (let s = 0; s < total; s++) {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Slide " + (s + 1));
        b.addEventListener("click", () => go(s));
        dotBox.appendChild(b);
        dotList.push(b);
      }
      function go(i) {
        at = Math.min(total - 1, Math.max(0, i));
        track.style.transform = "translateX(-" + at * 100 + "%)";
        dotList.forEach((d, n) => d.setAttribute("aria-current", String(n === at)));
        prevB.disabled = at === 0;
        nextB.disabled = at === total - 1;
      }
      prevB.addEventListener("click", () => go(at - 1));
      nextB.addEventListener("click", () => go(at + 1));
      view.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") go(at - 1);
        if (e.key === "ArrowRight") go(at + 1);
      });
      let x0 = null;
      view.addEventListener("pointerdown", e => { x0 = e.clientX; });
      view.addEventListener("pointerup", e => {
        if (x0 === null) return;
        const dx = e.clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) go(at + (dx < 0 ? 1 : -1));
      });
      view.addEventListener("pointercancel", () => { x0 = null; });
      media.append(prevB, nextB, dotBox);
      go(0);
    }

    const body = make("div", "coast__body");
    body.append(make("div", "coast__tag", c.barangay), make("div", "coast__name", c.name), make("p", "coast__blurb", c.blurb || ""));
    row.append(media, body);
    list.appendChild(row);
  });
})();