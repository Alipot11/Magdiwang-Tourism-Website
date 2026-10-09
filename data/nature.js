// ===== EDIT THIS FILE to add or change nature photos and wildlife =====
// Put photos in assets/ (a grey box shows if image is empty or missing).

// WATERFALLS: each group of 3 makes one slide. "name" shows as the caption on the photo.
window.FALLS = [
  { name: "Cataja Falls", image: "assets/nature/cataja.webp" }, { name: "Nailog River", image: "assets/nature/river.webp" }, { name: "Dalipi River", image: "assets/nature/river-2.webp" },
  { name: "Luy-a Luy-a Falls", image: "assets/nature/falls-2.webp" }, { name: "Lambingan Falls", image: "assets/nature/falls-4.webp" },{ name: "Dam", image: "assets/nature/river-3.webp" }
];

// WILDLIFE: tag is a short label such as Endemic, Bird, Mammal, Plant. image example "assets/wildlife-1.webp"
window.WILDLIFE = [
  { name: "Malayan Civet", tag: "Mammalia", scientific: "Viverra tangalunga", note: "The Malayan civet is a medium-sized, mainly terrestrial mammal belonging to the civet family, Viverridae. Malayan civets are primarily nocturnal, spending the daytime concealed in dense vegetation and becoming active at night.", image: "assets/nature/species.webp", credit: "James Eaton via iNaturalist.org"},
  { name: "Sibuyan Pitcher Plant", tag: "Plantae", scientific: "Nepenthes sibuyanensis", endemic: true, note: "Nepenthes sibuyanensis is a carnivorous tropical pitcher plant that grows as a terrestrial shrub or weak climber. It produces modified leaves called pitchers, which function as traps for insects and other small organisms.", status: "Vulnerable (VU)", image: "assets/nature/plant.webp" },
  { name: "Miniature Forest Frog", tag: "Amphibia",  scientific:"Platymantis guiting", endemic: true, note: "Platymantis guiting is a very small forest-dwelling frog belonging to the genus Platymantis. Adults average only about 14 mm in body length, making it one of the smallest frogs known from the Philippines.", status: "Endangered (EN)", image: "assets/nature/species-2.webp", credit: "DENR Mimaropa"},
  { name: "Philippine Tube-nosed Fruit Bat", tag: "Mammalia", scientific:"Nyctimene rabori",  endemic: true, note: "The Philippine tube-nosed fruit bat is a medium-sized fruit-eating bat with a particularly unusual appearance. These features are especially visible in your photograph. It is a nocturnal, fruit-eating (frugivorous) bat that lives in forest environments.", status: "Endangered (EN)", image: "assets/nature/species-3.webp", credit: "Tolga Bat Hospital" },
  { name: "Marbled Crested Lizard", tag: "Reptilia", scientific:"Bronchocela marmorata",  endemic: true, note: "The Marbled Crested Lizard is a slender, arboreal reptile commonly seen among trees and shrubs. It has a bright green body, a pointed snout, long slender limbs, a very long tapering tail, and a row of raised scales forming a crest along the neck and back.", image: "assets/nature/species-4.webp" },
  { name: "Philippine Duck", local: "Pato Del Mar",tag: "Aves", scientific: "Anas luzonica", endemic: true, note: "The Philippine Duck is a medium-to-large waterbird commonly associated with freshwater wetlands, marshes, lakes, rivers, rice fields, and some coastal habitats. It has a cinnamon or rusty-brown head and neck, a dark crown and stripe through the eye, a brownish-gray body, and a bluish-gray bill. Its wings have a distinctive metallic green patch.", status: "Vulnerable (VU)", image: "assets/nature/species-5.webp"},
  { name: "Lolot Pepper", tag: "Plantae", scientific: "Piper sarmentosum Roxb", note: "Lolot pepper is a low-growing, creeping or scrambling tropical plant. It has glossy, green, heart-shaped leaves with several prominent veins. Its small flowers grow on upright, cylindrical spikes, which develop into dense clusters of fruits as they mature. The leaves are used as a culinary ingredient in several Southeast Asian cuisines, including Vietnamese cuisine, where they are known as lá lốt.", image: "assets/nature/plant-2.webp"},
  { name: "Cerulean Flax Lily", tag: "Plantae", scientific: "Dianella ensifolia", note: "Dianella ensifolia is a perennial herb with long, narrow, sword-shaped leaves and branching flower stalks. Its small star-shaped flowers range from blue to violet and have prominent yellow stamens. The flowers can develop into shiny, rounded blue fruits.", image: "assets/nature/plant-3.webp"}
];

// COAST: image example "assets/coast-1.webp"
window.COAST = [
  { name: "Puyo Rock Formations", barangay: "Sitio Puyo, Ipil", blurb: "[One or two lines about the place.]", images: [
    "assets/nature/coast.webp", "assets/nature/coast-2.webp", "assets/nature/coast-3.webp", "assets/nature/coast-4.webp", "assets/nature/coast-5.webp", "assets/nature/coast-6.webp"
  ]}
];