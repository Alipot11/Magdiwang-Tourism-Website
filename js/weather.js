(function () {
  const root = document.getElementById("weather");
  if (!root) return;
  const cfg = window.WEATHER || {};
  const B = window.BARANGAYS || [];
  const places = (cfg.places || ["poblacion"]).map(id => B.find(b => b.id === id)).filter(Boolean);
  if (!places.length) { root.hidden = true; return; }

  const $ = id => document.getElementById(id);
  function make(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // ----- Icons (line drawings, colored by CSS) -----
  const PATHS = {
    sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    part: '<circle cx="8" cy="8" r="3"/><path d="M8 1.5v1.5M2.5 8H1M3.4 3.4l1 1M12.6 3.4l-1 1"/><path d="M8 20h9a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4 1.5A3.3 3.3 0 0 0 8 20z"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4 1.5A3.3 3.3 0 0 0 7 18z"/>',
    rain: '<path d="M7 15h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4 1.5A3.3 3.3 0 0 0 7 15z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/>',
    storm: '<path d="M7 15h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.4 1.5A3.3 3.3 0 0 0 7 15z"/><path d="M12 15l-2 3h3l-2 3"/>',
    fog: '<path d="M4 8h16M6 12h12M4 16h16M8 20h8"/>'
  };
  function icon(kind, size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + PATHS[kind] + "</svg>";
  }
  // WMO weather codes used by Open-Meteo -> [icon, label]
  function describe(code) {
    if (code === 0) return ["sun", "Clear"];
    if (code === 1 || code === 2) return ["part", "Partly cloudy"];
    if (code === 3) return ["cloud", "Cloudy"];
    if (code === 45 || code === 48) return ["fog", "Foggy"];
    if (code >= 51 && code <= 57) return ["rain", "Drizzle"];
    if (code >= 61 && code <= 67) return ["rain", "Rain"];
    if (code >= 80 && code <= 82) return ["rain", "Rain showers"];
    if (code >= 95) return ["storm", "Thunderstorm"];
    return ["cloud", "Cloudy"];
  }

  // ----- Formatting -----
  const deg = n => Math.round(n) + "\u00B0";
  function clock(iso) { // "2026-10-16T17:42" -> "5:42 PM"
    const h = Number(iso.slice(11, 13)), m = iso.slice(14, 16);
    return ((h % 12) || 12) + ":" + m + (h < 12 ? " AM" : " PM");
  }
  function weekday(dateStr) { // "2026-10-17" -> "Sat"
    return new Date(dateStr + "T12:00:00").toLocaleDateString("en-PH", { weekday: "short" });
  }
  function stamp(t) {
    return new Date(t).toLocaleString("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  }

  // ----- Page parts -----
  const now = $("wx-now"), days = $("wx-days"), status = $("wx-status"), pillBox = $("wx-places");
  const FRESH = 30 * 60 * 1000; // reuse a saved forecast for 30 minutes
  let current = places[0];

  // Background photo for the Now card: the barangay's own image, else the shared one, else plain navy
  function setPhoto(p) {
    const src = (cfg.images && cfg.images[p.id]) || cfg.image || "";
    now.style.backgroundImage = "";
    if (!src) return;
    const im = new Image();
    im.onload = () => {
      if (current !== p) return; // visitor already switched to another barangay
      now.style.backgroundImage = "linear-gradient(rgba(15,23,42,.5), rgba(15,23,42,.82)), url('" + src + "')";
    };
    im.src = src;
  }
  if (cfg.ferryNote) {
    const f = $("wx-ferry");
    f.append(make("b", "", cfg.ferryTitle || ""), document.createTextNode(" " + cfg.ferryNote));
    f.hidden = false;
  }

  const pills = places.map(p => {
    const b = make("button", "wx__place", p.name);
    b.type = "button";
    b.addEventListener("click", () => choose(p));
    pillBox.appendChild(b);
    return b;
  });
  if (places.length < 2) pillBox.hidden = true;

  function choose(p) {
    current = p;
    setPhoto(p);
    pills.forEach((b, n) => b.setAttribute("aria-pressed", String(places[n] === p)));
    load(p);
  }

  // ----- Data -----
  const key = p => "magdiwangWeather:" + p.id;
  function readCache(p) {
    try {
      const v = JSON.parse(localStorage.getItem(key(p)));
      return v && v.data && v.data.current && v.data.daily ? v : null;
    } catch (e) { return null; }
  }
  function url(p) {
    return "https://api.open-meteo.com/v1/forecast?latitude=" + p.lat + "&longitude=" + p.lng +
      "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunset" +
      "&timezone=Asia%2FManila&forecast_days=5";
  }

  function show(p, data, t, old) {
    const c = data.current, d = data.daily, w = describe(c.weather_code);
    $("wx-label").textContent = "NOW \u00B7 " + p.name.toUpperCase();
    $("wx-icon").innerHTML = icon(w[0], 64);
    $("wx-temp").textContent = deg(c.temperature_2m);
    $("wx-cond").textContent = w[1];
    $("wx-feels").textContent = deg(c.apparent_temperature);
    $("wx-hum").textContent = Math.round(c.relative_humidity_2m) + "%";
    $("wx-wind").textContent = Math.round(c.wind_speed_10m) + " km/h";
    $("wx-sunset").textContent = d.sunset && d.sunset[0] ? clock(d.sunset[0]) : "\u2013";

    days.replaceChildren();
    d.time.forEach((day, n) => {
      const dw = describe(d.weather_code[n]);
      const card = make("div", "wx__day");
      const ic = make("div", "wx__dayicon");
      ic.innerHTML = icon(dw[0], 36);
      ic.setAttribute("role", "img");
      ic.setAttribute("aria-label", dw[1]);
      card.append(
        make("div", "wx__dayname", n === 0 ? "Today" : weekday(day)),
        ic,
        make("div", "wx__hi", deg(d.temperature_2m_max[n])),
        make("div", "wx__lo", deg(d.temperature_2m_min[n])),
        make("div", "wx__rain", "Rain " + Math.round(d.precipitation_probability_max[n] || 0) + "%")
      );
      days.appendChild(card);
    });
    status.textContent = old
      ? "No connection. Showing the forecast saved on " + stamp(t) + "."
      : "Updated " + stamp(t) + ".";
  }

  function failed() {
    $("wx-label").textContent = "NOW \u00B7 " + current.name.toUpperCase();
    $("wx-icon").textContent = "";
    ["wx-temp", "wx-feels", "wx-hum", "wx-wind", "wx-sunset"].forEach(id => { $(id).textContent = "\u2013"; });
    $("wx-cond").textContent = "Forecast unavailable";
    days.replaceChildren();
    status.textContent = "Check again when you are online.";
  }

  async function load(p) {
    const cached = readCache(p);
    if (cached) show(p, cached.data, cached.t, false);
    else status.textContent = "Loading forecast...";
    if (cached && Date.now() - cached.t < FRESH) return;
    try {
      const r = await fetch(url(p));
      if (!r.ok) throw new Error("bad response");
      const data = await r.json();
      if (!data.current || !data.daily) throw new Error("bad data");
      const t = Date.now();
      try { localStorage.setItem(key(p), JSON.stringify({ t, data })); } catch (e) {}
      if (current === p) show(p, data, t, false);
    } catch (e) {
      if (current !== p) return;
      if (cached) show(p, cached.data, cached.t, true);
      else failed();
    }
  }

  choose(places[0]);
})();