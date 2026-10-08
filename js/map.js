(function () {
  const B = window.BARANGAYS, S = window.SPOTS;
  const CATS = ["All", "Nature", "Foods", "Lodging", "Activities", "Events"];
  let current = null, cat = "All";
  // Preselect a category from a link like index.html?cat=Lodging#map-section
  const wantedCat = new URLSearchParams(location.search).get("cat");
  if (CATS.includes(wantedCat)) cat = wantedCat;
  const markers = {}

  const map = L.map("map", { scrollWheelZoom: false });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  map.once("click", () => map.scrollWheelZoom.enable()); // avoids trapping page scroll

  const body = document.getElementById("panel-body");
  const title = document.getElementById("panel-title");
  const back = document.getElementById("panel-back");
  const chipBox = document.getElementById("chips");
  const spotLayer = L.layerGroup().addTo(map);
  const home = L.latLngBounds(B.map(b => [b.lat, b.lng])).pad(0.3);
  map.fitBounds(home);

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  const spotsOf = id => S.filter(s => s.barangay === id && (cat === "All" || s.category === cat));

  // Barangay hotspots (white circles with spot counts)
  const dots = {};
  B.forEach(b => {
    dots[b.id] = L.marker([b.lat, b.lng], { icon: L.divIcon({ className: "", html: "" }) })
      .addTo(map).on("click", () => select(b.id));
    dots[b.id].bindTooltip(b.name, { direction: "top", offset: [0, -14] });
  });
  function refreshDots() {
    B.forEach(b => {
      dots[b.id].setIcon(L.divIcon({
        className: "", iconSize: [32, 32],
        html: '<div class="dot' + (b.id === current ? " on" : "") + '">' + spotsOf(b.id).length + "</div>"
      }));
    });
  }

  function select(id) {
    current = id;
    const b = B.find(x => x.id === id);
    map.flyTo([b.lat, b.lng], 13);
    render();
  }
  function reset() { current = null; map.flyToBounds(home); render(); }
  back.addEventListener("click", reset);

  function buildChips() {
    CATS.forEach(c => {
      const btn = el("button", "chip", c);
      btn.addEventListener("click", () => { cat = c; render(); });
      chipBox.appendChild(btn);
    });
  }

  function card(s, marker) {
    const btn = el("button", "spot");
    if (s.image) {
      const img = el("img"); img.src = s.image; img.alt = s.name; img.loading = "lazy";
      img.onerror = () => img.remove(); // plain card if photo is missing
      btn.appendChild(img);
    }
    const t = el("div"); t.append(el("b", "", s.name), el("span", "", s.category));
    btn.appendChild(t);
    btn.addEventListener("click", () => { map.flyTo([s.lat, s.lng], 15); marker.openPopup(); });
    return btn;
  }

  function render() {
    body.replaceChildren(); spotLayer.clearLayers();
    chipBox.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.textContent === cat));
    back.hidden = !current;
    if (!current) {
      title.textContent = "Barangays";
      B.forEach(b => {
        const row = el("button", "brgy", b.name);
        row.appendChild(el("span", "", String(spotsOf(b.id).length)));
        row.addEventListener("click", () => select(b.id));
        body.appendChild(row);
      });
    } else {
      title.textContent = B.find(x => x.id === current).name;
      const list = spotsOf(current);
      if (!list.length) body.appendChild(el("p", "empty", "No spots in this category yet."));
      list.forEach(s => {
        const pop = el("div", "pop"); pop.append(el("b", "", s.name), el("span", "", s.desc));
        const m = L.circleMarker([s.lat, s.lng], { radius: 9, color: "#0f172a", weight: 3, fillColor: "#f59e0b", fillOpacity: 1 })
          .bindPopup(pop).addTo(spotLayer);
        markers[s.id] = m;  
        body.appendChild(card(s, m));
      });
    }
    refreshDots();
  }

 buildChips();
 render();

 // Open a spot from a link like index.html?spot=s7#map-section //
 const wanted = new URLSearchParams(location.search).get("spot");
 const target = S.find(s => s.id === wanted);
 if (target) {
  select(target.barangay);
  map.flyTo([target.lat, target.lng], 15);
  if (markers[target.id]) markers[target.id].openPopup();
}
})();