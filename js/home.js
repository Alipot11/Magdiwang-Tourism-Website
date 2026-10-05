(function () {
  const track = document.getElementById("slides");
  const dotBox = document.getElementById("dots");
  if (!track || !dotBox) return;
  const hero = track.parentElement;
  const count = track.children.length;
  const DELAY = 5000;
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
    [...track.children].forEach((s, n) => s.classList.toggle("on", n === index));
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
})();