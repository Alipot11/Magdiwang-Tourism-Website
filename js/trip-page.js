(function () {
  const T = window.Trip;
  if (!T) return;
  const $ = id => document.getElementById(id);
  const img = u => "url('../" + u + "')";
  function make(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  const B = window.BARANGAYS || [], S = window.SPOTS || [], L = window.LODGING || [], E = window.EVENTS || [];
  const brgy = id => (B.find(b => b.id === id) || {}).name || id;
  const GROUPS = [["stay", "Where to stay"], ["nature", "Nature"], ["do", "Things to do"], ["eat", "Where to eat"], ["events", "Events"]];
  const CAT = { Nature: "nature", Activities: "do", Foods: "eat", Lodging: "stay", Events: "events" };

  // Turn a saved id into something we can show. Returns null if the id no longer exists.
  function find(id) {
    const l = L.find(x => x.id === id);
    if (l) {
      const pin = S.find(s => s.category === "Lodging" && s.name === l.name);
      return { id, group: "stay", name: l.name, place: l.barangay, kind: l.type, image: l.image,
               href: "../index.html" + (pin ? "?spot=" + pin.id : "?cat=Lodging") + "#map-section", cta: "Show on map", pin: true };
    }
    const s = S.find(x => x.id === id);
    if (s) {
      return { id, group: CAT[s.category] || "nature", name: s.name, place: brgy(s.barangay), kind: s.category, image: s.image,
               href: "../index.html?spot=" + s.id + "#map-section", cta: "Show on map", pin: true };
    }
    const e = E.find(x => x.id === id);
    if (e) {
      return { id, group: "events", name: e.name, place: e.barangay, kind: e.date, image: e.image,
               href: "events.html#upcoming", cta: "See event", pin: false };
    }
    return null;
  }

  // Forget ids that were removed from the data files
  const stale = T.ids().filter(id => !find(id));
  if (stale.length) T.removeMany(stale);

  const list = $("trip-list"), count = $("trip-count"), status = $("trip-status");
  const mapBtn = $("trip-map"), copyBtn = $("trip-copy");
  let items = [];

  function row(i) {
    const r = make("article", "trip__row");
    const photo = make("div", "trip__photo");
    if (i.image) photo.style.backgroundImage = img(i.image);
    photo.setAttribute("role", "img");
    photo.setAttribute("aria-label", i.name);
    const body = make("div", "trip__body");
    const go = make("a", "trip__go", i.cta + " \u2192");
    go.href = i.href;
    body.append(make("div", "trip__name", i.name), make("div", "trip__meta", i.place + " \u00B7 " + i.kind), go);
    const rm = make("button", "heart on");
    rm.type = "button";
    rm.innerHTML = T.icon;
    rm.setAttribute("aria-label", "Remove " + i.name + " from My Saves");
    rm.addEventListener("click", () => {
      T.toggle(i.id);
      status.textContent = "Removed " + i.name + " from My Saves.";
      const next = list.querySelector(".heart");
      if (next) next.focus();
    });
    r.append(photo, body, rm);
    return r;
  }

  function render() {
    items = T.ids().map(find).filter(Boolean);
    list.replaceChildren();
    const places = new Set(items.map(i => i.place)).size;
    count.textContent = items.length
      ? items.length + (items.length === 1 ? " place" : " places") + " across " + places + (places === 1 ? " barangay" : " barangays")
      : "Nothing saved yet";
    const pins = items.some(i => i.pin);
    mapBtn.setAttribute("aria-disabled", String(!pins));
    mapBtn.tabIndex = pins ? 0 : -1;
    copyBtn.disabled = !items.length;

    if (!items.length) {
      const box = make("div", "trip__empty");
      box.append(make("h2", "trip__gtitle", "Your list is empty"),
                 make("p", "", "Tap the heart on any place to save it here."));
      const a = make("a", "trip__btn trip__btn--dark", "Explore Magdiwang");
      a.href = "explore.html";
      box.appendChild(a);
      list.appendChild(box);
      return;
    }
    GROUPS.forEach(g => {
      const rows = items.filter(i => i.group === g[0]);
      if (!rows.length) return;
      const sec = make("section", "trip__group");
      sec.appendChild(make("h2", "trip__gtitle", g[1]));
      rows.forEach(i => sec.appendChild(row(i)));
      list.appendChild(sec);
    });
  }

  copyBtn.addEventListener("click", () => {
    const lines = ["My saved places in Magdiwang", ""];
    GROUPS.forEach(g => {
      const rows = items.filter(i => i.group === g[0]);
      if (!rows.length) return;
      lines.push(g[1]);
      rows.forEach(i => lines.push("- " + i.name + " (" + i.place + ")"));
      lines.push("");
    });
    lines.push("Plan your visit: " + new URL("../index.html", location.href).href);
    (navigator.clipboard ? navigator.clipboard.writeText(lines.join("\n")) : Promise.reject())
      .then(() => { status.textContent = "Copied. Paste it into a message or note."; })
      .catch(() => { status.textContent = "Couldn't copy. Try again."; });
  });

  T.onChange(render);
  render();
})();