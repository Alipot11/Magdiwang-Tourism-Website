(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const img = u => "url('../" + u + "')";
  function make(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // ----- Sliding hero (automatic, same as the other pages) -----
  const track = document.getElementById("slides");
  const dotBox = document.getElementById("dots");
  const hero = track.parentElement;
  const count = track.children.length;
  let index = 0, timer = null;
  const dots = [];
  for (let i = 0; i < count; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Photo " + (i + 1));
    b.addEventListener("click", () => { go(i); restart(); });
    dotBox.appendChild(b);
    dots.push(b);
  }
  function go(i) {
    index = (i + count) % count;
    track.style.transform = "translateX(-" + index * 100 + "%)";
    dots.forEach((d, n) => d.setAttribute("aria-current", String(n === index)));
  }
  function start() { stop(); timer = setInterval(() => go(index + 1), 5000); }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function restart() { if (!reduce.matches) start(); }
  go(0);
  if (!reduce.matches) start();
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", restart);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", restart);

  // ----- Anchor bar highlight -----
  const links = [...document.querySelectorAll(".csub__in a[href^='#']")];
  const secs = links.map(a => document.querySelector(a.getAttribute("href")));
  function mark() {
    let on = 0;
    secs.forEach((s, n) => { if (s && s.getBoundingClientRect().top < 170) on = n; });
    links.forEach((a, n) => a.classList.toggle("on", n === on));
  }
  window.addEventListener("scroll", mark, { passive: true });
  mark();

  // ----- Heritage sites: scroll-swap (fixed photo, scrolling text) -----
  const sites = window.SITES || [];
  const stage = document.getElementById("sstage");
  const caption = document.getElementById("scaption");
  const list = document.getElementById("slist");
  const layers = [], items = [];

  sites.forEach((s, n) => {
    const layer = make("div", "sites__layer");
    if (s.image) layer.style.backgroundImage = img(s.image);
    layer.setAttribute("role", "img");
    layer.setAttribute("aria-label", s.name);
    stage.insertBefore(layer, caption);
    layers.push(layer);

    const art = make("article", "sites__item");
    const inline = make("div", "sites__inline");
    if (s.image) inline.style.backgroundImage = img(s.image);
    inline.setAttribute("role", "img");
    inline.setAttribute("aria-label", s.name);
    art.append(
      inline,
      make("p", "sites__meta", s.barangay + (s.year ? " \u00B7 " + s.year : "")),
      make("h3", "sites__name", s.name),
      make("p", "sites__desc", s.desc || "")
    );
    list.appendChild(art);
    items.push(art);
  });

  function activate(n) {
    layers.forEach((l, i) => l.classList.toggle("on", i === n));
    items.forEach((a, i) => a.classList.toggle("on", i === n));
    if (sites[n]) caption.textContent = sites[n].name;
  }
  if (sites.length) {
    activate(0);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) activate(items.indexOf(e.target)); });
      }, { rootMargin: "-45% 0px -45% 0px" });
      items.forEach(a => io.observe(a));
    }
  } else {
    list.appendChild(make("p", "sites__empty", "No heritage sites listed yet."));
  }

  // ----- Traditions (full-width bands, alternating sides) -----
  const tl = document.getElementById("tlist");
  const trads = window.TRADITIONS || [];
  if (!trads.length) tl.appendChild(make("p", "trad__empty", "No traditions listed yet."));
  trads.forEach(t => {
    const row = make("article", "trad__row");
    const photo = make("div", "trad__photo");
    if (t.image) photo.style.backgroundImage = img(t.image);
    photo.setAttribute("role", "img");
    photo.setAttribute("aria-label", t.name);
    const panel = make("div", "trad__panel");
    panel.append(make("p", "trad__meta", t.barangay), make("h3", "trad__name", t.name), make("p", "trad__desc", t.desc || ""));
    row.append(photo, panel);
    tl.appendChild(row);
  });

  // ----- Crafts and language -----
  const cl = document.getElementById("clist");
  (window.CRAFTS || []).slice(0, 2).forEach(c => {
    const item = make("article", "craft");
    const photo = make("div", "craft__photo");
    if (c.image) photo.style.backgroundImage = img(c.image);
    photo.setAttribute("role", "img");
    photo.setAttribute("aria-label", c.name);
    item.append(photo, make("p", "craft__tag", c.tag), make("h3", "craft__name", c.name), make("p", "craft__desc", c.desc || ""));
    cl.appendChild(item);
  });
})();