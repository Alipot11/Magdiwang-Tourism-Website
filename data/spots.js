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
  { id: "s1", name: "Agsao Shore",  barangay: "agsao", category: "Nature",     lat: 12.47751406044366, lng: 122.45263621595583, desc: "Rocky shores of Agsao with view of Romblon", image: "assets/spots/agsao/agsao-beach.webp" },
  { id: "s2", name: "Pinamang - An Br.", barangay: "agsao", category: "Nature", lat: 12.477555679184237, lng: 122.45335516647674, desc: "View of sunset from Pinamang-an bridge", image: "assets/spots/agsao/agsao-sunset.webp" },
  { id: "s3", name: "Agutay Port", barangay: "agutay", category: "Nature",     lat: 12.463863485576297, lng: 122.43919184120966, desc: "Sunset from Agutay Port", image: "assets/spots/agutay/agutay-port.webp" },
  { id: "s4", name: "Puntod", barangay: "agutay",   category: "Nature",   lat: 12.458648377180058, lng: 122.44084283793234, desc: "A hill at the center of brgy. Agutay", image: "assets/spots/agutay/puntod.webp" },
  { id: "s5", name: "Molobago Shore", barangay: "agutay",  category: "Nature",    lat: 12.464757773629692, lng: 122.44394225903105, desc: "Shores of Agutay", image: "assets/spots/agutay/agutay-shore.webp" }
];