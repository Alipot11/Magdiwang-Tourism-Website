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

  // ----- Sections: two photos, then a short description -----
  const list = document.getElementById("xlist");
  const items = window.EXPLORE || [];
  if (!items.length) list.appendChild(make("p", "xsec__desc", "No sections listed yet."));
  items.forEach((s, n) => {
    const sec = make("section", "xsec");
    sec.id = s.id;
    sec.setAttribute("aria-labelledby", s.id + "-title");

    const head = make("div", "xsec__head");
    const title = make("h2", "", s.title);
    title.id = s.id + "-title";
    head.append(make("span", "xsec__num", String(n + 1).padStart(2, "0")), title);

    const imgs = make("div", "xsec__imgs");
    [[s.image1, s.alt1], [s.image2, s.alt2]].forEach(p => {
      const d = make("div", "xsec__img");
      if (p[0]) d.style.backgroundImage = img(p[0]);
      d.setAttribute("role", "img");
      d.setAttribute("aria-label", p[1] || s.title);
      imgs.appendChild(d);
    });

    const foot = make("div", "xsec__foot");
    const go = make("a", "xsec__go", "View " + s.title);
    go.href = s.href;
    foot.append(make("p", "xsec__desc", s.desc || ""), go);

    const wrap = make("div", "wrap");
    wrap.append(head, imgs, foot);
    sec.appendChild(wrap);
    list.appendChild(sec);
  });

  // ----- Anchor bar: build links, highlight the section in view -----
  const bar = document.getElementById("subnav");
  items.forEach((s, n) => {
    const a = make("a", n === 0 ? "on" : "", s.title);
    a.href = "#" + s.id;
    bar.appendChild(a);
  });
  const links = [...bar.querySelectorAll("a")];
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    items.forEach(s => { const el = document.getElementById(s.id); if (el) io.observe(el); });
  }
})();