(function () {
  const $ = id => document.getElementById(id);
  const img = u => "url('../" + u + "')";

  // ----- Sliding hero (automatic, same as foods and lodging) -----
  const track = $("slides"), dotBox = $("dots"), hero = track.parentElement;
  const count = track.children.length, DELAY = 5000;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
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
  go(0);
  if (!reduce.matches) start();
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", restart);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", restart);

  // ----- Hiking -----
  const H = window.HIKING || {};
  $("hike-title").textContent = H.title || "Hiking";
  $("hike-place").textContent = H.barangay ? "Barangay " + H.barangay : "";
  $("hike-desc").textContent = H.desc || "";
  if (H.image) $("hike-photo").style.backgroundImage = img(H.image);
  $("hike-photo").setAttribute("aria-label", H.title || "Hiking trail");

  // ----- Kayaking -----
  const K = window.KAYAKING || {};
  $("kayak-title").textContent = K.title || "Kayaking";
  $("kayak-place").textContent = K.barangay ? "Barangay " + K.barangay : "";
  $("kayak-desc").textContent = K.desc || "";
  const facts = $("kayak-facts");
  [["Where to launch", K.launch], ["Best time", K.bestTime], ["Duration", K.duration]].forEach(f => {
    if (!f[1]) return;
    const row = document.createElement("div");
    const dt = document.createElement("dt"); dt.textContent = f[0];
    const dd = document.createElement("dd"); dd.textContent = f[1];
    row.append(dt, dd);
    facts.appendChild(row);
  });
  const kp = $("kayak-photos");
  (K.images || []).slice(0, 3).forEach((u, n) => {
    const d = document.createElement("div");
    d.style.backgroundImage = img(u);
    d.setAttribute("role", "img");
    d.setAttribute("aria-label", (K.title || "Kayaking") + " photo " + (n + 1));
    kp.appendChild(d);
  });

  // ----- Swimming -----
  const S = window.SWIMMING || {};
  $("swim-intro").textContent = S.intro || "";
  $("swim-note").textContent = S.safety || "";
  const row = $("swim-row");
  (S.spots || []).forEach(s => {
    const item = document.createElement("div");
    const p = document.createElement("div");
    p.className = "swim__photo";
    if (s.image) p.style.backgroundImage = img(s.image);
    p.setAttribute("role", "img");
    p.setAttribute("aria-label", s.name);
    const n = document.createElement("div"); n.className = "swim__name"; n.textContent = s.name;
    const m = document.createElement("div"); m.className = "swim__meta";
    m.textContent = s.barangay + " \u00B7 " + s.type;
    item.append(p, n, m);
    row.appendChild(item);
  });

  // ----- Highlight the current section in the activity bar -----
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