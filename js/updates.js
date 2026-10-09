(function () {
  const track = document.getElementById("utrack");
  const view = document.getElementById("uview");
  const dotBox = document.getElementById("udots");
  const prev = document.getElementById("uprev");
  const next = document.getElementById("unext");
  if (!track || !view) return;

  const DELAY = 5000;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const items = window.UPDATES || [];
  const count = items.length;
  let cur = 0, timer = null;
  const dots = [];

  function make(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  if (!count) {
    track.appendChild(make("p", "updates__empty", "No updates yet."));
    prev.hidden = next.hidden = dotBox.hidden = true;
    return;
  }

  items.forEach((u, n) => {
    const slide = make("article", "updates__slide");
    const photo = make("div", "updates__photo");
    if (u.image) photo.style.backgroundImage = "url('" + u.image + "')";
    photo.setAttribute("role", "img");
    photo.setAttribute("aria-label", u.title || "Update photo");
    const body = make("div", "updates__body");
    body.append(
      make("span", "updates__date", u.date || ""),
      make("h3", "updates__title", u.title || ""),
      make("p", "updates__desc", u.desc || "")
    );
    slide.append(photo, body);
    track.appendChild(slide);

    const b = make("button");
    b.type = "button";
    b.setAttribute("aria-label", "Update " + (n + 1));
    b.addEventListener("click", () => { show(n); restart(); });
    dotBox.appendChild(b);
    dots.push(b);
  });

  function show(i) {
    cur = (i + count) % count;
    track.style.transform = "translateX(-" + cur * 100 + "%)";
    dots.forEach((d, n) => d.setAttribute("aria-current", String(n === cur)));
    [...track.children].forEach((s, n) => s.setAttribute("aria-hidden", String(n !== cur)));
  }
  function start() { stop(); if (count > 1) timer = setInterval(() => show(cur + 1), DELAY); }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function restart() { if (!reduce.matches) start(); }

  prev.addEventListener("click", () => { show(cur - 1); restart(); });
  next.addEventListener("click", () => { show(cur + 1); restart(); });
  view.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { show(cur - 1); restart(); }
    if (e.key === "ArrowRight") { show(cur + 1); restart(); }
  });

  // Swipe
  let x0 = null;
  view.addEventListener("pointerdown", e => { x0 = e.clientX; stop(); });
  view.addEventListener("pointerup", e => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    restart();
  });
  view.addEventListener("pointercancel", () => { x0 = null; restart(); });

  // Pause on hover or keyboard focus
  const sec = view.closest(".updates");
  sec.addEventListener("mouseenter", stop);
  sec.addEventListener("mouseleave", restart);
  sec.addEventListener("focusin", stop);
  sec.addEventListener("focusout", restart);

  if (count < 2) { prev.hidden = next.hidden = dotBox.hidden = true; }
  show(0);
  restart();
})();