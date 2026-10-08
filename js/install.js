(function () {
  const btn = document.getElementById("install-btn");
  const hint = document.getElementById("install-hint");
  const cards = document.getElementById("inst-cards");
  const done = document.getElementById("installed");
  const ios = document.getElementById("ios");

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const installed = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  let deferred = null;

  function showInstalled() {
    cards.hidden = true;
    done.hidden = false;
  }
  if (installed) { showInstalled(); return; }

  // iPhone/iPad: point to the steps
  if (isIOS) {
    hint.textContent = "On iPhone, follow the steps in the next card.";
    ios.classList.add("is-hint");
  }

  // Android / desktop Chrome and Edge
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferred = e;
    hint.textContent = "Ready to install.";
  });
  window.addEventListener("appinstalled", showInstalled);

  btn.addEventListener("click", () => {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.then(() => { deferred = null; });
      return;
    }
    if (isIOS) {
      ios.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    hint.textContent = "Open your browser menu and tap Install app.";
  });
})();