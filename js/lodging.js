(function () {
  // ----- Sliding hero (horizontal) -----
  const track = document.getElementById("slides");
  const dotBox = document.getElementById("dots");
  const hero = track.parentElement;
  const count = track.children.length;
  const DELAY = 5000;
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
  function start() { stop(); timer = setInterval(() => go(index + 1), DELAY); }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function restart() { if (!reduce.matches) start(); }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  go(0);
  if (!reduce.matches) start();
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", restart);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", restart);

  // ----- Lodging list (plain rows) -----
  const list = document.getElementById("list");
  const tabs = document.querySelectorAll("#tabs button");
  const items = window.LODGING || [];

  function render(type) {
    list.textContent = "";
    const shown = items.filter(l => type === "All" || l.type === type);
    if (!shown.length) {
      const p = document.createElement("p");
      p.className = "lodging__empty";
      p.textContent = "No places listed yet.";
      list.appendChild(p);
      return;
    }
    shown.forEach(l => {
      const a = document.createElement("a");
      a.className = "lodging__row";
      a.href = "lodging-detail.html?id=" + encodeURIComponent(l.id);

      const photo = document.createElement("div");
      photo.className = "lodging__photo";
      if (l.image) photo.style.backgroundImage = "url('../" + l.image + "')";

      const text = document.createElement("div");
      const name = document.createElement("div");
      name.className = "lodging__name";
      name.textContent = l.name;
      const meta = document.createElement("div");
      meta.className = "lodging__meta";
      meta.textContent = l.barangay + " \u00B7 " + l.type;
      text.append(name, meta);

      const go = document.createElement("span");
      go.className = "lodging__go";
      go.setAttribute("aria-hidden", "true");
      go.textContent = "\u2192";

      a.append(photo, text, go);
      list.appendChild(a);
    });
  }

  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.toggle("on", x === t));
    render(t.dataset.type);
  }));
  render("All");
})();