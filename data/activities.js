// ===== EDIT THIS FILE to change the Activities page =====
// Put photos in assets/. A grey box shows if an image is empty or missing.
// "barangay" should be one of the nine Magdiwang barangays.

window.HIKING = {
  title: "[Insert trail name]",
  barangay: "Poblacion",
  image: "assets/activities/hiking.webp",
  desc: "Lush forest, drifting clouds, and a path that leads deeper into the wild."
};

window.KAYAKING = {
  title: "Sanctuary Garden Resort",
  barangay: "Tampayan",
  desc: "Glide across the calm waters of Tampayan Dam, with the green hills of Sibuyan all around you. It's a gentle paddle throught the Nailog River that rewards you with quiet scenery and a slower pace.",
  launch: "Dam",
  bestTime: "Summer and sunny seasons",
  duration: "N/A",
  images: ["assets/activities/kayaking.webp", "assets/activities/kayaking-2.webp", "assets/activities/kayaking-3.webp"], // 1st is the large photo
  spot: "s7"
};

window.SWIMMING = {
  intro: "[Insert one line about swimming in Magdiwang.]",
  safety: "Check the weather and water conditions before you swim, never let children swim alone, and never swim with the influence of alcohol.",
  spots: [
    { name: "Rance's Haven", barangay: "Tampayan", type: "Pool & Resort", image: "assets/activities/swim.webp" },
    { name: "Dalipi River", barangay: "Tampayan",    type: "River", image: "assets/activities/swim-2.webp" },
    { name: "Dam", barangay: "Tampayan", type: "River", image: "assets/activities/swim-4.webp" }
  ]
};