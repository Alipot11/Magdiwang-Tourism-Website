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
  
    // ----- Cafes (portrait photo strip per cafe) -----
  const cafeList = document.getElementById("cafelist");
  const cafes = window.CAFES || [];
  if (cafeList) {
    if (!cafes.length) {
      const p = document.createElement("p");
      p.className = "cafes__empty";
      p.textContent = "No cafes listed yet.";
      cafeList.appendChild(p);
    }
    cafes.forEach(c => {
      const card = document.createElement("article");
      card.className = "cafe";

      const head = document.createElement("div");
      head.className = "cafe__head";
      const info = document.createElement("div");
      const tag = document.createElement("div");
      tag.className = "cafe__tag"; tag.textContent = "CAFE";
      const name = document.createElement("div");
      name.className = "cafe__name"; name.textContent = c.name;
      const meta = document.createElement("div");
      meta.className = "cafe__meta"; meta.textContent = c.barangay + " \u00B7 " + c.specialty;
      const blurb = document.createElement("p");
      blurb.className = "cafe__blurb"; blurb.textContent = c.blurb || "";
      info.append(tag, name, meta, blurb);

      const nav = document.createElement("div");
      nav.className = "cafe__nav";
      const prevB = document.createElement("button");
      const nextB = document.createElement("button");
      prevB.type = nextB.type = "button";
      prevB.className = nextB.className = "cafe__btn";
      prevB.textContent = "\u2190"; nextB.textContent = "\u2192";
      prevB.setAttribute("aria-label", "Previous photos of " + c.name);
      nextB.setAttribute("aria-label", "Next photos of " + c.name);
      nav.append(prevB, nextB);
      head.append(info, nav);

      const strip = document.createElement("div");
      strip.className = "cafe__strip";
      strip.tabIndex = 0;
      strip.setAttribute("aria-label", c.name + " photos, use the arrows to slide");
      const pics = c.images && c.images.length ? c.images : [""];
      pics.forEach((u, n) => {
        const d = document.createElement("div");
        d.className = "cafe__photo";
        if (u) d.style.backgroundImage = "url('../" + u + "')";
        d.setAttribute("role", "img");
        d.setAttribute("aria-label", c.name + " photo " + (n + 1));
        strip.appendChild(d);
      });

      function update() {
        const max = strip.scrollWidth - strip.clientWidth;
        nav.hidden = max <= 1;
        prevB.disabled = strip.scrollLeft <= 1;
        nextB.disabled = strip.scrollLeft >= max - 1;
      }
      prevB.addEventListener("click", () => strip.scrollBy({ left: -strip.clientWidth, behavior: "smooth" }));
      nextB.addEventListener("click", () => strip.scrollBy({ left: strip.clientWidth, behavior: "smooth" }));
      strip.addEventListener("scroll", update, { passive: true });
      strip.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") prevB.click();
        if (e.key === "ArrowRight") nextB.click();
      });
      window.addEventListener("resize", update);

      card.append(head, strip);
      cafeList.appendChild(card);
      update();
    });
  }
})();