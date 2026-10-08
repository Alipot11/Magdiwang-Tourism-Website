(function () {
  // ----- Local dishes slider (manual only: arrows, dots, swipe, keyboard) -----
  const PER_SLIDE = 5;
  const dTrack = document.getElementById("dtrack");
  const dView = document.getElementById("dview");
  const dDots = document.getElementById("ddots");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const dishes = window.DISHES || [];
  const slides = Math.max(1, Math.ceil(dishes.length / PER_SLIDE));
  let cur = 0;
  const sDots = [];

  for (let s = 0; s < slides; s++) {
    const slide = document.createElement("div");
    slide.className = "dishes__slide";
    for (let k = 0; k < PER_SLIDE; k++) {
      const d = dishes[s * PER_SLIDE + k];
      const tile = document.createElement("div");
      tile.className = "dishes__tile";
      if (d && d.image) {
        tile.style.backgroundImage = "url('../" + d.image + "')";
        tile.setAttribute("role", "img");
        tile.setAttribute("aria-label", d.name || "Local dish");
      }
      slide.appendChild(tile);
    }
    dTrack.appendChild(slide);

    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Slide " + (s + 1));
    b.addEventListener("click", () => show(s));
    dDots.appendChild(b);
    sDots.push(b);
  }
  function show(i) {
    cur = Math.min(slides - 1, Math.max(0, i));
    dTrack.style.transform = "translateX(-" + cur * 100 + "%)";
    sDots.forEach((d, n) => d.setAttribute("aria-current", String(n === cur)));
    prev.disabled = cur === 0;
    next.disabled = cur === slides - 1;
  }
  prev.addEventListener("click", () => show(cur - 1));
  next.addEventListener("click", () => show(cur + 1));
  dView.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  let x0 = null;
  dView.addEventListener("pointerdown", e => { x0 = e.clientX; });
  dView.addEventListener("pointerup", e => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  });
  dView.addEventListener("pointercancel", () => { x0 = null; });
  if (slides < 2) { prev.hidden = true; next.hidden = true; dDots.hidden = true; }
  show(0);

  // ----- Restaurants (alternating rows) -----
  const list = document.getElementById("rlist");
  const items = window.RESTAURANTS || [];
  if (!items.length) {
    const p = document.createElement("p");
    p.className = "rest__empty";
    p.textContent = "No restaurants listed yet.";
    list.appendChild(p);
  }
  items.forEach(r => {
    const a = document.createElement("a");
    a.className = "rest__row";
    a.href = "restaurant-detail.html?id=" + encodeURIComponent(r.id);

    const photo = document.createElement("div");
    photo.className = "rest__photo";
    if (r.image) photo.style.backgroundImage = "url('../" + r.image + "')";

    const body = document.createElement("div");
    body.className = "rest__body";
    const tag = document.createElement("div");
    tag.className = "rest__tag"; tag.textContent = "RESTAURANT";
    const name = document.createElement("div");
    name.className = "rest__name"; name.textContent = r.name;
    const meta = document.createElement("div");
    meta.className = "rest__meta"; meta.textContent = r.barangay + " \u00B7 " + r.cuisine;
    const blurb = document.createElement("p");
    blurb.className = "rest__blurb"; blurb.textContent = r.blurb || "";
    const go = document.createElement("span");
    go.className = "rest__go"; go.textContent = "View details \u2192";
    body.append(tag, name, meta, blurb, go);

    a.append(photo, body);
    list.appendChild(a);
  });
})();