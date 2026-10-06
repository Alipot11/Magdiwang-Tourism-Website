// ===== EDIT THIS FILE to change the Activities page =====
// Put photos in assets/. A grey box shows if an image is empty or missing.
// "barangay" should be one of the nine Magdiwang barangays.

window.HIKING = {
  title: "[Sample] Trail name",
  barangay: "Poblacion",
  image: "assets/hiking-1.webp",
  desc: "[Insert one or two sentences: what the trail is like and where it starts.]"
};

window.KAYAKING = {
  title: "Sanctuary Garden Resort",
  barangay: "Tampayan",
  desc: "[Insert one or two sentences about the paddle and what you will see.]",
  launch: "[Where to launch]",
  bestTime: "[Best time of day or year]",
  duration: "[About how long]",
  images: ["assets/activities/kayaking.webp", "assets/activities/kayaking-2.webp", "assets/activities/kayaking-3.webp"] // 1st is the large photo
};

window.SWIMMING = {
  intro: "[Insert one line about swimming in Magdiwang.]",
  safety: "Check the weather and water conditions before you swim, and never swim alone.",
  spots: [
    { name: "[Sample] Swim spot 1", barangay: "Poblacion", type: "Beach", image: "assets/swim-1.webp" },
    { name: "[Sample] Swim spot 2", barangay: "Agutay",    type: "River", image: "assets/swim-2.webp" },
    { name: "[Sample] Swim spot 3", barangay: "Silum",     type: "Falls", image: "assets/swim-3.webp" }
  ]
};