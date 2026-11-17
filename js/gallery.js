(function () {
  const root = document.getElementById("gal");
  if (!root) return;
  const items = window.GALLERY || [];
  if (!items.length) { root.closest(".gallery").hidden = true; return; }

  function make(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  items.forEach(g => {
    const tile = make("div", "gal__tile");
    if (g.image) {
      tile.style.backgroundImage = "url('" + g.image + "')";
      // Match the tile to the photo's real proportions (4:3 until it loads)
      const im = new Image();
      im.onload = () => {
        if (im.naturalWidth && im.naturalHeight) {
          tile.style.aspectRatio = im.naturalWidth + " / " + im.naturalHeight;
        }
      };
      im.src = g.image;
    }
    tile.setAttribute("role", "img");
    tile.setAttribute("aria-label", g.title || "Photo of Magdiwang");

    const cap = make("div", "gal__cap");
    cap.appendChild(make("div", "gal__title", g.title || ""));
    if (g.desc) cap.appendChild(make("p", "gal__desc", g.desc));
    if (g.barangay) cap.appendChild(make("span", "gal__where", g.barangay));
    tile.appendChild(cap);
    root.appendChild(tile);
  });
})();