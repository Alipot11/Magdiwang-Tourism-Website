(function () {
  const root = document.getElementById("hotlines-list");
  if (!root) return;
  const items = window.HOTLINES || [];
  if (!items.length) { root.closest(".hotlines").hidden = true; return; }

  function make(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  items.forEach(h => {
    const item = make("div", "hot");
    item.appendChild(make("div", "hot__name", h.name || ""));

    const digits = String(h.number || "").replace(/[^\d+]/g, "");
    if (digits) {
      // Tap to call on a phone
      const a = make("a", "hot__num", h.number);
      a.href = "tel:" + digits;
      a.setAttribute("aria-label", "Call " + (h.name || "") + " at " + h.number);
      item.appendChild(a);
    } else {
      item.appendChild(make("span", "hot__num hot__num--soon", "Number coming soon"));
    }

    // Hide the placeholder notes until you replace them
    if (h.note && !/^\[Insert/.test(h.note)) item.appendChild(make("p", "hot__note", h.note));
    root.appendChild(item);
  });
})();