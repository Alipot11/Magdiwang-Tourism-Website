// ===== EDIT THIS FILE to change the Festivals & Events page =====
// Put photos in assets/ (a grey box shows if an image is empty or missing).
// "barangay" should be one of the nine Magdiwang barangays.

// FEATURED: the big festival at the top
window.FEATURED = {
  name: "Kasadyahan Festival",
  when: "Every May",
  where: "Poblacion",
  highlight: "[Street dancing, food stalls, ...]",
  image: "assets/events-featured.webp",
  desc: "[Insert 3 to 4 lines: what the festival celebrates, what visitors see, and how to join in.]"
};

// EVENTS: alternating photo rows. date is a short label such as "Jun 12".
window.EVENTS = [
  { id: "e1", name: "[Sample] Event 1", date: "Jun 12", barangay: "Poblacion", type: "Fiesta",  blurb: "[One or two lines about the event.]", image: "" },
  { id: "e2", name: "[Sample] Event 2", date: "Aug 3",  barangay: "Silum",     type: "Harvest", blurb: "[One or two lines about the event.]", image: "" },
  { id: "e3", name: "[Sample] Event 3", date: "Dec 8",  barangay: "Tampayan",  type: "Religious", blurb: "[One or two lines about the event.]", image: "" }
];

// MOMENTS: photos only. Each group of 3 makes one slide: the 1st is the wide photo, the other two are tall.
window.MOMENTS = [
  { name: "[Sample] Parade",  image: "" }, { name: "[Sample] Dancers", image: "" }, { name: "[Sample] Feast", image: "" },
  { name: "[Sample] Crowd",   image: "" }, { name: "[Sample] Costumes", image: "" }, { name: "[Sample] Music", image: "" }
];

// CALENDAR: one line per event, in month order
window.CALENDAR = [
  { month: "January",     name: "[Insert Event Name]",     barangay: "[Barangay]" },
  { month: "February",     name: "[Insert Event Name]",     barangay: "[Barangay]" },
  { month: "March",     name: "[Insert Event Name]",     barangay: "[Barangay]" },
  { month: "April",     name: "[Insert Event Name]",     barangay: "[Barangay]" },
  { month: "May",     name: "Kasadyahan Festival",     barangay: "Poblacion" },
  { month: "June",     name: "[Insert Event Name]",     barangay: "[Barangay]" },
  { month: "July",     name: "[Insert Event Name]",     barangay: "[Barangay]" },
  { month: "August",     name: "[Insert Event Name]",     barangay: "[Barangay]" },
  { month: "September",     name: "[Insert Event Name]",     barangay: "[Barangay]" },
  { month: "October",     name: "[Insert Event Name]",     barangay: "[Barangay]" },
  { month: "November",     name: "[Insert Event Name]",     barangay: "[Barangay]" },
  { month: "December",     name: "[Insert Event Name]",     barangay: "[Barangay]" }
];