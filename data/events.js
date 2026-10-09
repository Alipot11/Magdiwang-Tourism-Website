// ===== EDIT THIS FILE to change the Festivals & Events page =====
// Put photos in assets/ (a grey box shows if an image is empty or missing).
// "barangay" should be one of the nine Magdiwang barangays.

// FEATURED: the big festival at the top
window.FEATURED = {
  name: "Kasadyahan Festival",
  when: "Every May",
  where: "Magdiwang, Poblacion",
  highlight: "Street dancing",
  image: "assets/events/featured.webp",
  desc: "The Kasadyahan Festival fills Magdiwang with a week of celebration. On parade day, the streets of Poblacion come alive as each barangay sends its own float, followed by street dancers moving to the beat of drums and the lyre, while crowds line the sidewalks to cheer them on. On other days, the festivities continue with gatherings and many more events for locals and visitors to enjoy."
};

// EVENTS: alternating photo rows. date is a short label such as "Jun 12".
window.EVENTS = [
  { id: "e1", name: "Pahayag", date: "December", barangay: "Poblacion", type: "Event",  blurb: "See the town of Poblacion get lit with christmas lights including displays from other barangay", image: "assets/events/upcoming.webp" },
  { id: "e2", name: "Kasadyahan Festival", date: "May",  barangay: "Poblacion",     type: "Fiesta", blurb: "Join in to Magdiwang's biggest festival", image: "assets/events/upcoming-2.webp" }
];

// MOMENTS: photos only. Each group of 3 makes one slide: the 1st is the wide photo, the other two are tall.
window.MOMENTS = [
  { name: "",  image: "assets/events/moment.webp" }, { name: "", image: "assets/events/moment-2.webp" }, { name: "", image: "assets/events/moment-3.webp" },
  { name: "",   image: "assets/events/moment-4.webp" }, { name: "", image: "assets/events/moment-5.webp" }, { name: "", image: "assets/events/moment-6.webp" },
  { name: "",   image: "assets/events/moment-7.webp" }, { name: "", image: "assets/events/moment-8.webp" }, { name: "", image: "assets/events/moment-9.webp" },
  { name: "",   image: "assets/events/moment-10.webp" }, { name: "", image: "assets/events/moment-11.webp" }, { name: "", image: "assets/events/moment-12.webp" },
  { name: "",   image: "assets/events/moment-13.webp" }, { name: "", image: "assets/events/moment-14.webp" }, { name: "", image: "assets/events/moment-15.webp" }
];

// CALENDAR: one line per event, in month order
window.CALENDAR = [
  { month: "January",     name: "Ipil Fiesta",     barangay: "Ipil" },
  { month: "February",     name: "",     barangay: "" },
  { month: "March",     name: "Ambulong Fiesta",     barangay: "Ambulong" },
  { month: "April",     name: "Agnonoc Fiesta",     barangay: "Tampayan" },
  { month: "May",     name: "Kasadyahan Festival",     barangay: "Poblacion" },
  { month: "May",     name: "Kasanyogan Festival",     barangay: "Agutay" },
  { month: "June",     name: "San Juan Festival",     barangay: "" },
  { month: "July",     name: "",     barangay: "" },
  { month: "August",     name: "Gulayan Festival",     barangay: "Agsao" },
  { month: "September",     name: "",     barangay: "" },
  { month: "October",     name: "Duyang Fiesta",     barangay: "Dulangan" },
  { month: "October",     name: "Hinugyaw Fiesta",     barangay: "Poblacion" },
  { month: "November",     name: "Tampayan Fiesta",     barangay: "Tampayan" },
  { month: "December",     name: "Pahayag",     barangay: "Poblacion" },
  { month: "December",     name: "Silum Fiesta",     barangay: "Silum" }
];