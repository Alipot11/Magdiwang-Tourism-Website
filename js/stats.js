(function () {
  const root = document.getElementById("stats");
  if (!root) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Counted from the data files, so they update when you add entries.
  // If a count comes back 0, the number written in the HTML stays.
  const live = {
    barangays: (window.BARANGAYS || []).length,
    falls: (window.FALLS || []).filter(f => /falls/i.test(f.name)).length,
    endemic: (window.WILDLIFE || []).filter(w => w.endemic).length
  };

  const items = [...root.querySelectorAll("[data-count]")].map(el => {
    const fromData = live[el.dataset.key];
    const target = fromData > 0 ? fromData : Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const text = n => Math.round(n).toLocaleString("en-US") + suffix;
    el.textContent = text(target); // final value first, so nothing is blank
    return { el, target, text };
  });

  function run({ el, target, text }) {
    const t0 = performance.now(), DUR = 1200;
    (function step(now) {
      const p = Math.min(1, (now - t0) / DUR);
      el.textContent = text(target * (1 - Math.pow(1 - p, 3))); // ease out
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  if (reduce.matches || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      items.forEach(run);
    });
  }, { threshold: 0.4 });
  io.observe(root);
})();