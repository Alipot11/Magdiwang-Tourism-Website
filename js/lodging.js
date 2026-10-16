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
      // The row is a div so the heart button is not inside a link.
      // The name link is stretched over the row with CSS, so the whole row still opens it.
      const row = document.createElement("div");
      row.className = "lodging__row";

      const photo = document.createElement("div");
      photo.className = "lodging__photo";
      if (l.image) photo.style.backgroundImage = "url('../" + l.image + "')";

      const text = document.createElement("div");
      const name = document.createElement("div");
      name.className = "lodging__name";
      const link = document.createElement("a");
      link.href = l.page || "coming-soon.html"; // + encodeURIComponent(l.id); --> add if there is a content page made
      link.textContent = l.name;
      name.appendChild(link);
      const meta = document.createElement("div");
      meta.className = "lodging__meta";
      meta.textContent = l.barangay + " \u00B7 " + l.type;
      text.append(name, meta);

      const go = document.createElement("span");
      go.className = "lodging__go";
      go.setAttribute("aria-hidden", "true");
      go.textContent = "\u2192";

      row.append(photo, text, go);
      if (window.Trip) row.appendChild(window.Trip.button(l.id, l.name));
      list.appendChild(row);
    });
  }

  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.toggle("on", x === t));
    render(t.dataset.type);
  }));
  render("All");
})();