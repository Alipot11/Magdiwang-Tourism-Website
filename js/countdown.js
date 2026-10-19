// Event countdown, by MONTH only (festival dates can move a day or two each year,
// but each one is always held in the same month). Reads window.CALENDAR and window.FEATURED
// from data/events.js. Fills #cdbar (homepage strip) and #feat-count (Events page card).
(function () {
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
                  "August", "September", "October", "November", "December"];
  const $ = id => document.getElementById(id);
  function make(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  // Month number (0-11) found in a text such as "May" or "Every May"; -1 if none
  function monthOf(text) {
    const t = String(text || "").toLowerCase();
    return MONTHS.findIndex(m => t.includes(m.toLowerCase()));
  }
  // How many months from now until month m (0 = this month)
  const ahead = m => (m - new Date().getMonth() + 12) % 12;

  // ----- Homepage strip: events this month and next month -----
  const bar = $("cdbar");
  if (bar) {
    const rows = (window.CALENDAR || [])
      .filter(c => c.name && monthOf(c.month) >= 0)
      .map(c => ({ name: c.name, barangay: c.barangay, n: ahead(monthOf(c.month)) }));
    let show = rows.filter(r => r.n <= 1).sort((a, b) => a.n - b.n);
    if (!show.length && rows.length) { // nothing soon: show the next one(s) instead
      const next = Math.min.apply(null, rows.map(r => r.n));
      show = rows.filter(r => r.n === next);
    }
    const list = $("cdbar-list");
    show.slice(0, 4).forEach(r => {
      const li = make("li");
      const tag = make("span", "cdbar__tag" + (r.n === 0 ? " is-now" : ""),
        r.n === 0 ? "This month" : r.n === 1 ? "Next month" : "In " + r.n + " months");
      li.append(tag, make("span", "cdbar__name", r.name));
      if (r.barangay) li.appendChild(make("span", "cdbar__where", r.barangay));
      list.appendChild(li);
    });
    bar.hidden = !show.length;
  }

  // ----- Events page: counter card on the featured festival -----
  const card = $("feat-count");
  const F = window.FEATURED;
  if (card && F) {
    const m = monthOf(F.month || F.when);
    if (m >= 0) {
      const n = ahead(m);
      const short = (F.short || F.name || "Festival").toUpperCase();
      const label = $("cd-label"), big = $("cd-big"), unit = $("cd-unit");
      if (n >= 2) {
        label.textContent = short + " IN";
        big.textContent = String(n);
        big.className = "cd__big";
        unit.textContent = "months to go";
      } else {
        label.textContent = short;
        big.textContent = n === 0 ? "This month" : "Next month";
        big.className = "cd__big cd__big--word";
        unit.textContent = "";
      }
      card.hidden = false;
    }
  }
})();