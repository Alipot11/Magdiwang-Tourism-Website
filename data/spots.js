// ===== EDIT THIS FILE to add barangays and tourist spots =====
// Get lat/lng by right-clicking a place in Google Maps and clicking the coordinates.

window.BARANGAYS = [
  // All 9 barangays of Magdiwang. Coordinates are approximate center points
  // (from Philatlas), not boundaries. Adjust any pin that looks off on the map.
  { id: "agsao",     name: "Agsao",     lat: 12.4795, lng: 122.4524 },
  { id: "agutay",    name: "Agutay",    lat: 12.4642, lng: 122.4400 },
  { id: "ambulong",  name: "Ambulong",  lat: 12.4941, lng: 122.4902 },
  { id: "dulangan",  name: "Dulangan",  lat: 12.4779, lng: 122.4928 },
  { id: "ipil",      name: "Ipil",      lat: 12.4860, lng: 122.4691 },
  { id: "jao-asan",  name: "Jao-asan",  lat: 12.4751, lng: 122.5207 },
  { id: "poblacion", name: "Poblacion", lat: 12.4929, lng: 122.5114 },
  { id: "silum",     name: "Silum",     lat: 12.4908, lng: 122.5934 },
  { id: "tampayan",  name: "Tampayan",  lat: 12.4906, lng: 122.5266 }
];

// category must be one of: Nature, Foods, Lodging, Activities, Events
// image: put the photo in assets/ (optional, a plain card shows if missing)
window.SPOTS = [
  { id: "s1", name: "[Sample] Waterfall",  barangay: "poblacion", category: "Nature",     lat: 12.4990, lng: 122.5050, desc: "[Insert description]", image: "assets/spots/spot-1.webp" },
  { id: "s2", name: "[Sample] Beach Cove", barangay: "poblacion", category: "Activities", lat: 12.4950, lng: 122.5180, desc: "[Insert description]", image: "assets/spots/spot-2.webp" },
  { id: "s3", name: "[Sample] Local Eatery", barangay: "tampayan", category: "Foods",     lat: 12.4880, lng: 122.5300, desc: "[Insert description]", image: "assets/spots/spot-3.webp" },
  { id: "s4", name: "[Sample] Island Lodge", barangay: "agutay",   category: "Lodging",   lat: 12.4680, lng: 122.4450, desc: "[Insert description]", image: "assets/spots/spot-4.webp" },
  { id: "s5", name: "[Sample] Fiesta Grounds", barangay: "silum",  category: "Events",    lat: 12.4930, lng: 122.5900, desc: "[Insert description]", image: "assets/spots/spot-5.webp" }
];