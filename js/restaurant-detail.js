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

  // ----- Find the restaurant from ?id=... -----
  const id = new URLSearchParams(location.search).get("id");
  const r = (window.RESTAURANTS || []).find(x => x.id === id);
  if (!r) { $("rpage").hidden = true; $("rmissing").hidden = false; return; }

  document.title = r.name + " | Magdiwang Tourism Office";
  $("r-name").textContent = r.name;
  $("r-meta").textContent = [r.barangay, r.cuisine].filter(Boolean).join(" \u00B7 ");

  // ----- Hero (slides horizontally if there is more than one photo) -----
  const track = $("slides");
  const heroPics = r.heroImages && r.heroImages.length ? r.heroImages : [r.image || ""];
  heroPics.forEach(u => {
    const s = make("div", "rhero__slide");
    if (u) s.style.backgroundImage = img(u);
    track.appendChild(s);
  });
  if (heroPics.length > 1 && !reduce.matches) {
    let at = 0;
    setInterval(() => {
      at = (at + 1) % heroPics.length;
      track.style.transform = "translateX(-" + at * 100 + "%)";
    }, 5000);
  }

  // ----- About + facts -----
  $("r-about").textContent = r.about || r.blurb || "";
  const aboutEl = $("about");
  if (r.aboutImage) {
    const t = new Image();
    t.onload = () => {
      aboutEl.style.backgroundImage = img(r.aboutImage);
      aboutEl.classList.add("has-img");
    };
    t.src = "../" + r.aboutImage;
  }
  const facts = $("r-facts");
  if (r.hours) {
    const row = document.createElement("div");
    row.append(make("dt", "", "Hours"), make("dd", "", r.hours));
    facts.appendChild(row);
  }
  facts.hidden = !facts.children.length;

  // ----- Signature dish -----
  const sig = r.signature;
  if (sig) {
    if (sig.image) $("r-sig-photo").style.backgroundImage = img(sig.image);
    $("r-sig-photo").setAttribute("aria-label", sig.name || "Signature dish");
    $("r-sig-name").textContent = sig.name || "";
    $("r-sig-desc").textContent = sig.desc || "";
  } else {
    $("r-sig").hidden = true;
  }

  // ----- Dishes: desktop slider (5 per slide) -----
  const dishes = r.dishes || [];
  if (!dishes.length) $("r-dishes").hidden = true;
  if (!sig && !dishes.length) $("kitchen").hidden = true;

  const PER = 5;
  const dTrack = $("dtrack"), dView = $("dview"), dDots = $("ddots");
  const prev = $("dprev"), next = $("dnext");
  const slides = Math.max(1, Math.ceil(dishes.length / PER));
  const sDots = [];
  let cur = 0;

  for (let s = 0; s < slides; s++) {
    const slide = make("div", "rdish__slide");
    for (let k = 0; k < PER; k++) {
      const d = dishes[s * PER + k];
      const tile = make("div", "rdish__tile");
      if (d && d.image) tile.style.backgroundImage = img(d.image);
      if (d) {
        tile.setAttribute("role", "img");
        tile.setAttribute("aria-label", d.name || "Dish");
        if (d.name) tile.appendChild(make("span", "", d.name));
      }
      slide.appendChild(tile);
    }
    dTrack.appendChild(slide);

    const b = make("button");
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

  // ----- Dishes: phone strip (swipe, one dish at a time, dots) -----
  const strip = $("mstrip"), mDots = $("mdots");
  const cards = dishes.map((d, n) => {
    const c = make("div", "rdish__card");
    if (d.image) c.style.backgroundImage = img(d.image);
    c.setAttribute("role", "img");
    c.setAttribute("aria-label", d.name || "Dish " + (n + 1));
    if (d.name) c.appendChild(make("span", "", d.name));
    strip.appendChild(c);
    return c;
  });
  const mdots = cards.map((c, n) => {
    const b = make("button");
    b.type = "button";
    b.setAttribute("aria-label", "Dish " + (n + 1));
    b.addEventListener("click", () =>
      strip.scrollTo({ left: c.offsetLeft - cards[0].offsetLeft, behavior: "smooth" }));
    mDots.appendChild(b);
    return b;
  });
  if (cards.length < 2) mDots.hidden = true;
  function mark() {
    if (!cards.length) return;
    let on = 0, best = Infinity;
    cards.forEach((c, n) => {
      const d = Math.abs(c.offsetLeft - cards[0].offsetLeft - strip.scrollLeft);
      if (d < best) { best = d; on = n; }
    });
    const max = strip.scrollWidth - strip.clientWidth;
    if (max > 1 && strip.scrollLeft >= max - 1) on = cards.length - 1;
    mdots.forEach((d, n) => d.setAttribute("aria-current", String(n === on)));
  }
  strip.addEventListener("scroll", mark, { passive: true });
  window.addEventListener("resize", mark);
  mark();

  // ----- Find us -----
    // ----- Contact links and mini map (same setup as the lodging pages) -----
  const cl = $("r-contact");
  const bare = u => u.replace(/^https?:\/\//, "");
  function row(label, node) {
    const li = make("li");
    li.append(make("span", "", label + ":"), node);
    cl.appendChild(li);
  }
  function link(text, href, external) {
    const a = make("a", "", text);
    a.href = href;
    if (external) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  if (r.phone) { // several numbers can be written as "0912 345 6789 / 0998 765 4321"
    const frag = document.createDocumentFragment();
    r.phone.split("/").map(s => s.trim()).filter(Boolean).forEach((p, n) => {
      if (n) frag.append(document.createTextNode(" / "));
      frag.append(link(p, "tel:" + p.replace(/[^\d+]/g, "")));
    });
    row("Phone", frag);
  }
  if (r.gmail) row("Email", link(r.gmail, "mailto:" + r.gmail));
  if (r.facebook) row("Facebook", link(bare(r.facebook), r.facebook, true));
  if (r.website) row("Website", link(bare(r.website), r.website, true));
  if (r.location) row("Location", document.createTextNode(r.location));

  const spot = r.spot ? (window.SPOTS || []).find(s => s.id === r.spot) : null;
    $("r-map-link").href = "../index.html?" + (spot ? "spot=" + encodeURIComponent(r.spot) : "cat=Foods") + "#map-section";

  if (spot && typeof L !== "undefined") {
    const mapBox = $("minimap");
    mapBox.hidden = false;
    const map = L.map(mapBox, { zoomControl: false, scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.setView([spot.lat, spot.lng], 15);
    L.circleMarker([spot.lat, spot.lng], { radius: 9, color: "#0f172a", weight: 3, fillColor: "#f59e0b", fillOpacity: 1 }).addTo(map);
  }

    // ----- Section bar: only sections that are shown -----
  const bar = $("subnav");
  const mapLink = $("r-map-link");
  [["about", "About"], ["kitchen", "Dishes"], ["contact-info", "Contact"]].forEach(s => {
    const el = $(s[0]);
    if (!el || el.hidden) return;
    const a = make("a", "", s[1]);
    a.href = "#" + s[0];
    bar.insertBefore(a, mapLink);
  });
  const barLinks = [...bar.querySelectorAll("a[href^='#']")];
  if (barLinks[0]) barLinks[0].classList.add("on");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) barLinks.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    barLinks.forEach(a => { const s = document.querySelector(a.getAttribute("href")); if (s) io.observe(s); });
  }
})();