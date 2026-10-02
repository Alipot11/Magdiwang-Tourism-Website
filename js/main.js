// Mobile menu toggle
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");
 
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});
 
// Close the menu after tapping a link
menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);
 
// Footer year
document.getElementById("year").textContent = new Date().getFullYear();