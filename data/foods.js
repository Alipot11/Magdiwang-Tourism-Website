// ===== EDIT THIS FILE to add or change local dishes and restaurants =====
// DISHES: big photos only (no text shown). Put photos in assets/.
//   Each group of 5 makes one slide: the 1st photo is the large horizontal one, so use a wide photo for it.
//   "name" is only used as the photo's alt text for screen readers. A grey box shows if image is empty or missing.
// window.DISHES = [
//  { name: "[Sample] Dish 1",  image: "" }, { name: "[Sample] Dish 2",  image: "" },
//  { name: "[Sample] Dish 3",  image: "" }, { name: "[Sample] Dish 4",  image: "" },
//  { name: "[Sample] Dish 5",  image: "" },
//  { name: "[Sample] Dish 6",  image: "" }, { name: "[Sample] Dish 7",  image: "" },
//  { name: "[Sample] Dish 8",  image: "" }, { name: "[Sample] Dish 9",  image: "" },
//  { name: "[Sample] Dish 10", image: "" },
//  { name: "[Sample] Dish 11", image: "" }, { name: "[Sample] Dish 12", image: "" },
//  { name: "[Sample] Dish 13", image: "" }, { name: "[Sample] Dish 14", image: "" },
//  { name: "[Sample] Dish 15", image: "" }
// ];

// RESTAURANTS: one entry per restaurant. "id" is used in the page link (restaurant-detail.html?id=r1).
// image: the photo on the Where to Eat list. heroImages (optional): photos that slide at the top of its page.
// signature: the best-known dish, with a short description. dishes: photo + name only (5 per slide).
// spot (optional): a spot id from data/spots.js so "Show on map" opens that pin.
window.RESTAURANTS = [
  { id: "r1", name: "Baldwin cafe & resto", barangay: "Poblacion", cuisine: "",
    blurb: "Try Baldwin's wide range of dishes or taste a sip with thier drinks", image: "assets/foods/baldwin/baldwin.webp",
    heroImages: [],
    about: "Enjoy a relaxing vibe of Sibuyan while eating with families and friends",
    hours: "Mon - Sat: 11am to 8pm | Sun: 11am to 7pm",
    phone: "0921 581 8670", gmail: "", facebook: "https://www.facebook.com/baldwinsbaken.brew", website: "",
    aboutImage: "assets/foods/baldwin/about.webp",   // optional photo behind the About section, e.g. "assets/foods/r1/about.webp"
    location: "Near Grandview Hotel", spot: "s25",
    signature: { name: "Barkada Fries", image: "assets/foods/baldwin/img-1.webp", desc: "Better enjoyed with family or friends" },
    dishes: [
      { name: "Crispy Bagnet", image: "assets/foods/baldwin/img-2.webp" }, { name: "BBQ Back Ribs", image: "assets/foods/baldwin/img-3.webp" }, { name: "Biscoff Latte", image: "assets/foods/baldwin/img-4.webp" },
      { name: "Chicken Popcorn", image: "assets/foods/baldwin/img-5.webp" }, { name: "Sizzling Burger Stake", image: "assets/foods/baldwin/img-6.webp" }, { name: "Biscoff Latte", image: "assets/foods/baldwin/img-7.webp" },
      { name: "Ham & Bacon Carbonara", image: "assets/foods/baldwin/img-8.webp" }, { name: "Dark Cocoa Nutella & Nutella Waffle", image: "assets/foods/baldwin/img-9.webp" }, { name: "Meaty Spaghetti", image: "assets/foods/baldwin/img-10.webp" },
      { name: "Nacho Supreme", image: "assets/foods/baldwin/img-11.webp" }, { name: "Matcha Latte", image: "assets/foods/baldwin/img-12.webp" }, { name: "Beef Shawarma", image: "assets/foods/baldwin/img-13.webp" },
      { name: "Crispy Chicken Burger", image: "assets/foods/baldwin/img-14.webp" }, { name: "Biscoff Waffle", image: "assets/foods/baldwin/img-15.webp" }, { name: "Beef Pepper Lunch", image: "assets/foods/baldwin/img-16.webp" }
    ] }
];

// CAFES: "images" is a list of PORTRAIT photos (3:4 works best). 4 photos show at once;
// with more than 4 the photos slide in groups of 4. Empty strings show grey boxes.
// image example "assets/cafe-1-a.webp"
window.CAFES = [
  { id: "c1", name: "Island Sips", barangay: "Poblacion", specialty: "coffee / snacks", blurb: "Smile in every cup", images: ["assets/foods/island-sip.webp", "assets/foods/island-sip-2.webp", "assets/foods/island-sip-3.webp", "assets/foods/island-sip-4.webp", "assets/foods/island-sip-5.webp", "assets/foods/island-sip-6.webp"] }
];