(function () {
  const $ = id => document.getElementById(id);
  const img = u => "url('../" + u + "')";
  const make = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ----- Featured festival -----
  const F = window.FEATURED || {};
  $("feat-name").textContent = F.name || "Featured festival";
  $("feat-when").textContent = F.when || "";
  $("feat-where").textContent = F.where || "";
  $("feat-desc").textContent = F.desc || "";
  if (F.image) $("feat-photo").style.backgroundImage = img(F.image);
  $("feat-photo").setAttribute("aria-label", F.name || "Featured festival");
  const facts = $("feat-facts");
  [["When", F.when], ["Where", F.where], ["Don't miss", F.highlight]].forEach(f => {
    if (!f[1]) return;
    const row = document.createElement("div");
    row.append(make("dt", "", f[0]), make("dd", "", f[1]));
    facts.appendChild(row);
  });

  // ----- Upcoming events (alternating rows) -----
  const list = $("elist");
  const events = window.EVENTS || [];
  if (!events.length) list.appendChild(make("p", "up__empty", "No events listed yet."));
  events.forEach(e => {
    const row = make("article", "up__row");
    const photo = make("div", "up__photo");
    if (e.image) photo.style.backgroundImage = img(e.image);
    const body = make("div", "up__body");
    body.append(
      make("span", "up__date", e.date),
      make("div", "up__name", e.name),
      make("div", "up__meta", e.barangay + " \u00B7 " + e.type),
      make("p", "up__blurb", e.blurb || "")
    );
    row.append(photo, body);
    list.appendChild(row);
  });

  // ----- Moments slider (manual: arrows, dots, swipe, keyboard) -----
  const PER = 3;
  const mTrack = $("mtrack"), mView = $("mview"), mDots = $("mdots");
  const prev = $("prev"), next = $("next");
  const moments = window.MOMENTS || [];
  const slides = Math.max(1, Math.ceil(moments.length / PER));
  let cur = 0;
  const sDots = [];
  for (let s = 0; s < slides; s++) {
    const slide = make("div", "mom__slide");
    for (let k = 0; k < PER; k++) {
      const m = moments[s * PER + k];
      const tile = make("div", "mom__tile");
      if (m && m.image) {
        tile.style.backgroundImage = img(m.image);
        tile.setAttribute("role", "img");
        tile.setAttribute("aria-label", m.name || "Festival photo");
      }
      if (m && m.name) tile.appendChild(make("span", "", m.name));
      slide.appendChild(tile);
    }
    mTrack.appendChild(slide);
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Slide " + (s + 1));
    b.addEventListener("click", () => show(s));
    mDots.appendChild(b);
    sDots.push(b);
  }
  function show(i) {
    cur = Math.min(slides - 1, Math.max(0, i));
    mTrack.style.transform = "translateX(-" + cur * 100 + "%)";
    sDots.forEach((d, n) => d.setAttribute("aria-current", String(n === cur)));
    prev.disabled = cur === 0;
    next.disabled = cur === slides - 1;
  }
  prev.addEventListener("click", () => show(cur - 1));
  next.addEventListener("click", () => show(cur + 1));
  mView.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  let x0 = null;
  mView.addEventListener("pointerdown", e => { x0 = e.clientX; });
  mView.addEventListener("pointerup", e => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  });
  mView.addEventListener("pointercancel", () => { x0 = null; });
  if (slides < 2) { prev.hidden = true; next.hidden = true; mDots.hidden = true; }
  show(0);

  // ----- Year calendar -----
  const cal = $("clist");
  let lastMonth = "";
  (window.CALENDAR || []).forEach(c => {
    const row = make("div", "cal__row");
    row.append(
      make("span", "cal__month", c.month === lastMonth ? "" : c.month),
      make("span", "cal__name", c.name),
      make("span", "cal__where", c.barangay)
    );
    lastMonth = c.month;
    cal.appendChild(row);
  });

  // ----- Highlight current section in the anchor bar -----
  const links = document.querySelectorAll("#subnav a[href^='#']");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    links.forEach(a => { const s = document.querySelector(a.getAttribute("href")); if (s) io.observe(s); });
  }
})();