// ===== EDIT THIS FILE to add barangays and tourist spots =====
// Get lat/lng by right-clicking a place in Google Maps and clicking the coordinates.

window.BARANGAYS = [
  // All 9 barangays of Magdiwang. Coordinates are approximate center points
  // (from Philatlas), not boundaries. Adjust any pin that looks off on the map.
  { id: "agsao",     name: "Agsao",     lat: 12.46793184099839, lng: 122.4662231752916 },
  { id: "agutay",    name: "Agutay",    lat: 12.460185153327297, lng: 122.44926260943434 },
  { id: "ambulong",  name: "Ambulong",  lat: 12.489127131554124, lng: 122.49469806599951 },
  { id: "dulangan",  name: "Dulangan",  lat: 12.464697400751211, lng: 122.48918679934214, },
  { id: "ipil",      name: "Ipil",      lat: 12.476263560678378, lng: 122.47757484382873 },
  { id: "jao-asan",  name: "Jao-asan",  lat: 12.4751, lng: 122.5207 },
  { id: "poblacion", name: "Poblacion", lat: 12.492018204430613, lng: 122.51229335735549 },
  { id: "silum",     name: "Silum",     lat: 12.481328242760222, lng: 122.57133798441079 },
  { id: "tampayan",  name: "Tampayan",  lat: 12.491715716219034, lng: 122.53159564511823 }
];

// category must be one of: Nature, Foods, Lodging, Activities, Events
// image: put the photo in assets/ (optional, a plain card shows if missing)
window.SPOTS = [
  { id: "s1", name: "Agsao Shore",  barangay: "agsao", category: "Nature", lat: 12.47751406044366, lng: 122.45263621595583, desc: "Rocky shores of Agsao with view of Romblon", image: "assets/spots/agsao/agsao-beach.webp" },
  { id: "s2", name: "Pinamang - An Br.", barangay: "agsao", category: "Nature", lat: 12.477555679184237, lng: 122.45335516647674, desc: "View of sunset from Pinamang-an bridge", image: "assets/spots/agsao/agsao-sunset.webp" },
  { id: "s3", name: "Agutay Port", barangay: "agutay", category: "Nature", lat: 12.463863485576297, lng: 122.43919184120966, desc: "Sunset from Agutay Port", image: "assets/spots/agutay/agutay-port.webp" },
  { id: "s4", name: "Puntod", barangay: "agutay",   category: "Nature", lat: 12.458648377180058, lng: 122.44084283793234, desc: "A hill at the center of brgy. Agutay", image: "assets/spots/agutay/puntod.webp" },
  { id: "s5", name: "Molobago Shore", barangay: "agutay",  category: "Nature", lat: 12.464757773629692, lng: 122.44394225903105, desc: "Shores of Agutay", image: "assets/spots/agutay/agutay-shore.webp" },
  { id: "s6", name: "Nailog River", barangay: "poblacion",  category: "Nature", lat: 12.488222748581869, lng: 122.52307540373398, desc: "", image: "assets/spots/poblacion/nailog-river.webp" },
  { id: "s7", name: "Sanctuary Garden Resort", barangay: "tampayan",  category: "Activities", lat: 12.490146209549602, lng: 122.53547294598968, desc: "Paddle through the Nailog River", image: "assets/spots/tampayan/kayaking.webp" },
  { id: "s8", name: "Sanctuary Garden Resort", barangay: "tampayan", saveAs: "l1", category: "Lodging",    lat: 12.490146209549602, lng: 122.53547294598968, desc: "Stay in a relaxing lodging", image: "assets/spots/tampayan/lodging.webp" },
  { id: "s9", name: "Cataja Falls", barangay: "jao-asan",  category: "Nature", lat: 12.461586752198, lng: 122.5050080329111, desc: "", image: "assets/spots/jao-asan/cataja.webp" },
  { id: "s10", name: "Dalipi River", barangay: "tampayan",  category: "Nature", lat: 12.484356299547196, lng: 122.53857329010299, desc: "", image: "assets/spots/tampayan/dalipi.webp" },
  { id: "s11", name: "Lambingan Falls", barangay: "silum",  category: "Nature", lat: 12.49210365252721, lng: 122.5783351415361, desc: "", image: "assets/spots/silum/lambingan.webp" },
  { id: "s12", name: "La Fortuna Hotel", barangay: "poblacion", saveAs: "l2", category: "Lodging", lat: 12.494293250338623,  lng: 122.5081806539655, desc: "", image: "assets/spots/poblacion/lodging-2.webp" },
  { id: "s13", name: "The Grandview Hotel", barangay: "poblacion", saveAs: "l3", category: "Lodging", lat: 12.493819362397742,  lng: 122.50970918320476, desc: "", image: "assets/spots/poblacion/lodging-3.webp" },
  { id: "s14", name: "Island Sips", barangay: "poblacion", category: "Foods", lat: 12.491791665616464, lng: 122.51299625650995, desc: "Smile in every cup", image: "assets/spots/poblacion/island-sips.webp" },
  { id: "s15", name: "Rance's Haven", barangay: "tampayan", saveAs: "l4", category: "Lodging", lat: 12.475708372752853,  lng: 122.53653357622457, desc: "", image: "assets/spots/tampayan/lodging-4.webp" },
  { id: "s16", name: "Rance's Haven", barangay: "tampayan", category: "Activities",    lat: 12.475708372752853,  lng: 122.53653357622457, desc: "", image: "assets/spots/tampayan/swim.webp" },
  { id: "s17", name: "Alerta Rooftop lodge", barangay: "poblacion", category: "Lodging",    lat: 12.49230395152224,  lng:  122.5131952160889, desc: "", image: "assets/spots/tampayan/swim.webp" },
  { id: "s18", name: "Bagumbayan Beach House", barangay: "poblacion", category: "Lodging",    lat: 12.493758689200169,  lng: 122.50978275008765, desc: "", image: "assets/spots/tampayan/swim.webp" },
  { id: "s19", name: "Dangkalan Beach Resort", barangay: "silum", category: "Lodging",    lat: 12.497436886520472,  lng: 122.56741263340696,  desc: "", image: "assets/spots/tampayan/swim.webp" },
  { id: "s20", name: "Muy Bien Mountain Resort", barangay: "tampayan", category: "Lodging",    lat: 12.46978515465493,  lng: 122.54022675296942, desc: "", image: "assets/spots/tampayan/swim.webp" },
  { id: "s21", name: "Nature's View Lodge", barangay: "poblacion", category: "Lodging",    lat: 12.491698213847707,  lng: 122.51515197612183, desc: "", image: "assets/spots/tampayan/swim.webp" },
  { id: "s22", name: "Paradisso Terrenal", barangay: "ambulong", category: "Lodging",    lat: 12.496225417138723,  lng: 122.49876143995691, desc: "", image: "assets/spots/tampayan/swim.webp" },
  { id: "s23", name: "Ranchers Travels and Tours", barangay: "poblacion", category: "Lodging",    lat: 12.490563106769516,  lng: 122.51472679587796, desc: "", image: "assets/spots/tampayan/swim.webp" },
  { id: "s24", name: "Vhora Resort and Restaurant", barangay: "silum", category: "Lodging",    lat: 12.489472109865885,  lng: 122.59574735964492, desc: "", image: "assets/spots/tampayan/swim.webp" }
];