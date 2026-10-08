(function () {
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
      a.href = l.page || "coming-soon.html"; // + encodeURIComponent(l.id); --> add if there is a content page made

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