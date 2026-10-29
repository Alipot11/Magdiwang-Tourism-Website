(function () {
  const $ = id => document.getElementById(id);
  const img = u => "url('../" + u + "')";
  const make = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  // Find the lodging from ?id=...  Unknown or missing id goes to the coming soon page.
  const id = new URLSearchParams(location.search).get("id");
  const lod = (window.LODGING || []).find(x => x.id === id);
  if (!lod) { location.replace("coming-soon.html"); return; }

  // ----- Hero -----
  document.title = lod.name + " | Magdiwang Tourism Office";
  $("l-type").textContent = lod.type || "Where to stay";
  $("l-name").textContent = lod.name;
  $("l-place").textContent = lod.barangay ? "Barangay " + lod.barangay : "";
  const heroPic = lod.hero || lod.image;
  if (heroPic) $("l-hero").style.backgroundImage = img(heroPic);

  // ----- Show on map: opens this lodging's spot if it has one -----
  const spot = lod.spot ? (window.SPOTS || []).find(s => s.id === lod.spot) : null;
  $("l-map-link").href = lod.spot
    ? "../index.html?spot=" + encodeURIComponent(lod.spot) + "#map-section"
    : "../index.html?cat=Lodging#map-section";

  // ----- About (photo background if aboutImage loads, otherwise default colour) -----
  const about = $("about");
  if (lod.desc) $("l-desc").textContent = lod.desc; else $("l-desc").hidden = true;
  if (lod.aboutImage) {
    const t = new Image();
    t.onload = () => {
      about.style.backgroundImage = img(lod.aboutImage);
      about.classList.add("has-img");
    };
    t.src = "../" + lod.aboutImage;
  }
  const facts = $("l-facts");
  const times = lod.checkIn || lod.checkOut ? (lod.checkIn || "?") + " / " + (lod.checkOut || "?") : "";
  [["Type", lod.type], ["Barangay", lod.barangay], ["Check-in / out", times]].forEach(f => {
    if (!f[1]) return;
    const row = document.createElement("div");
    row.append(make("dt", "", f[0]), make("dd", "", f[1]));
    facts.appendChild(row);
  });

  // ----- Rooms (plain rows) and amenities -----
  const unitsTitle = lod.unitsTitle || "Rooms";
  $("rooms-title").textContent = unitsTitle;
  const rooms = lod.rooms || [];
  const amen = lod.amenities || [];
  if (rooms.length || amen.length) {
    $("rooms").hidden = false;
    const rl = $("l-rooms");
    rooms.forEach(r => {
      const row = make("div", "ldrooms__row");
      const photo = make("div", "ldrooms__photo");
      if (r.image) photo.style.backgroundImage = img(r.image);
      const body = make("div");
      body.append(make("div", "ldrooms__name", r.name));
      const meta = [
        r.bedrooms ? r.bedrooms + (r.bedrooms === 1 ? " bedroom" : " bedrooms") : "",
        r.sleeps ? "Sleeps " + r.sleeps : "",
        r.note || ""
      ].filter(Boolean).join(" \u00B7 ");
      if (meta) body.append(make("div", "ldrooms__meta", meta));
      row.append(photo, body);
      rl.appendChild(row);
    });
    amen.forEach(a => $("l-amen").appendChild(make("li", "", a)));
  }

  // ----- Photos slider (manual: arrows, dots, swipe, keyboard) -----
  const pics = lod.images || [];
  if (pics.length) {
    $("photos").hidden = false;
    const PER = 3;
    const pTrack = $("ptrack"), pView = $("pview"), pDots = $("pdots");
    const prev = $("prev"), next = $("next");
    const slides = Math.ceil(pics.length / PER);
    let cur = 0;
    const sDots = [];
    // ----- Photo viewer (opens when a photo is clicked) -----
    const box = make("div", "ldbox");
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", lod.name + " photo gallery");
    const fig = make("figure", "ldbox__fig");
    const big = document.createElement("img");
    big.className = "ldbox__img";
    const cap = make("figcaption", "ldbox__cap");
    fig.append(big, cap);
    const closeB = make("button", "ldbox__btn ldbox__close", "\u00D7");
    const prevB = make("button", "ldbox__btn ldbox__prev", "\u2190");
    const nextB = make("button", "ldbox__btn ldbox__next", "\u2192");
    closeB.type = prevB.type = nextB.type = "button";
    closeB.setAttribute("aria-label", "Close gallery");
    prevB.setAttribute("aria-label", "Previous photo");
    nextB.setAttribute("aria-label", "Next photo");
    box.append(closeB, prevB, fig, nextB);
    document.body.appendChild(box);
    if (pics.length < 2) { prevB.hidden = true; nextB.hidden = true; }

    let at = 0, opener = null;
    function view(i) {
      at = (i + pics.length) % pics.length;
      const p = pics[at];
      big.src = "../" + p.image;
      big.alt = p.name || lod.name + " photo " + (at + 1);
      cap.textContent = (p.name ? p.name + " \u00B7 " : "") + (at + 1) + " / " + pics.length;
    }
    function openBox(i, from) {
      opener = from || null;
      view(i);
      box.hidden = false;
      document.body.style.overflow = "hidden";
      closeB.focus();
    }
    function closeBox() {
      box.hidden = true;
      document.body.style.overflow = "";
      show(Math.floor(at / PER));            // slider moves to the photo you ended on
      if (opener) opener.focus();
    }
    closeB.addEventListener("click", closeBox);
    prevB.addEventListener("click", () => view(at - 1));
    nextB.addEventListener("click", () => view(at + 1));
    box.addEventListener("click", e => { if (e.target === box || e.target === fig) closeBox(); });
    document.addEventListener("keydown", e => {
      if (box.hidden) return;
      if (e.key === "Escape") closeBox();
      if (e.key === "ArrowLeft") view(at - 1);
      if (e.key === "ArrowRight") view(at + 1);
      if (e.key === "Tab") {                  // keep focus inside the viewer
        const f = [closeB, prevB, nextB].filter(b => !b.hidden);
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    let bx = null;                            // swipe inside the viewer
    box.addEventListener("pointerdown", e => { bx = e.clientX; });
    box.addEventListener("pointerup", e => {
      if (bx === null) return;
      const dx = e.clientX - bx; bx = null;
      if (Math.abs(dx) > 50) view(at + (dx < 0 ? 1 : -1));
    });
    for (let s = 0; s < slides; s++) {
      const slide = make("div", "ldph__slide");
      for (let k = 0; k < PER; k++) {
        const idx = s * PER + k;
        const p = pics[idx];
        const tile = make("div", "ldph__tile");
        if (p) {
          tile.style.backgroundImage = img(p.image);
          tile.setAttribute("role", "button");
          tile.tabIndex = 0;
          tile.setAttribute("aria-label", "View photo: " + (p.name || lod.name + " photo " + (idx + 1)));
          tile.addEventListener("click", () => { if (!dragged) openBox(idx, tile); });
          tile.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBox(idx, tile); }
          });
          if (p.name) tile.appendChild(make("span", "", p.name));
        }
        slide.appendChild(tile);
      }
      pTrack.appendChild(slide);
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Slide " + (s + 1));
      b.addEventListener("click", () => show(s));
      pDots.appendChild(b);
      sDots.push(b);
    }
    function show(i) {
      cur = Math.min(slides - 1, Math.max(0, i));
      pTrack.style.transform = "translateX(-" + cur * 100 + "%)";
      sDots.forEach((d, n) => d.setAttribute("aria-current", String(n === cur)));
      prev.disabled = cur === 0;
      next.disabled = cur === slides - 1;
    }
    prev.addEventListener("click", () => show(cur - 1));
    next.addEventListener("click", () => show(cur + 1));
    pView.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
    let x0 = null, dragged = false;
    pView.addEventListener("pointerdown", e => { x0 = e.clientX; dragged = false; });
    pView.addEventListener("pointerup", e => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      dragged = Math.abs(dx) > 10;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    });
    pView.addEventListener("pointercancel", () => { x0 = null; });
    if (slides < 2) { prev.hidden = true; next.hidden = true; pDots.hidden = true; }
    show(0);
  }

  // ----- Contact and mini map -----
  const cl = $("l-contact");
  if (lod.phone) {
    const li = make("li");
    const a = make("a", "", lod.phone);
    a.href = "tel:" + lod.phone.replace(/[^\d+]/g, "");
    li.append(make("span", "", "Phone:"), a);
    cl.appendChild(li);
  }
  if (lod.gmail) {
    const li = make("li");
    const a = lod.gmail.replace(/^https?:\/\//, "");
    a.href = lod.gmail; a.target = "_blank"; a.rel = "noopener";
    li.append(make("span", "", "Gmail:"), a);
    cl.appendChild(li);
  }
  if (lod.facebook) {
    const li = make("li");
    const a = make("a", "", lod.facebook.replace(/^https?:\/\//, ""));
    a.href = lod.facebook; a.target = "_blank"; a.rel = "noopener";
    li.append(make("span", "", "Facebook:"), a);
    cl.appendChild(li);
  }
  if (lod.website) {
    const li = make("li");
    const a = make("a", "", lod.website.replace(/^https?:\/\//, ""));
    a.href = lod.website; a.target = "_blank"; a.rel = "noopener";
    li.append(make("span", "", "Website:"), a);
    cl.appendChild(li);
  }

  if (!cl.children.length) cl.appendChild(make("li", "", "Contact details coming soon."));

  if (spot && typeof L !== "undefined") {
    const box = $("minimap");
    box.hidden = false;
    const map = L.map(box, { zoomControl: false, scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.setView([spot.lat, spot.lng], 15);
    L.circleMarker([spot.lat, spot.lng], { radius: 9, color: "#0f172a", weight: 3, fillColor: "#f59e0b", fillOpacity: 1 }).addTo(map);
  }

  // ----- Section bar: only sections that are shown -----
  const bar = $("subnav");
  const mapLink = $("l-map-link");
  [["about", "About"], ["rooms", "Rooms"], ["photos", "Photos"], ["contact-info", "Contact"]].forEach((s, n) => {
    const el = $(s[0]);
    if (!el || el.hidden) return;
    const a = make("a", "", s[1]);
    a.href = "#" + s[0];
    bar.insertBefore(a, mapLink);
  });
  const links = [...bar.querySelectorAll("a[href^='#']")];
  if (links[0]) links[0].classList.add("on");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    links.forEach(a => { const s = document.querySelector(a.getAttribute("href")); if (s) io.observe(s); });
  }
})();