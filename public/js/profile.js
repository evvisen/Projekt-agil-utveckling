const $ = (sel) => document.querySelector(sel);

function loadSettings() {
  const notiser = localStorage.getItem("settings:notiser");
  const ljud = localStorage.getItem("settings:ljud");

  if (notiser !== null) $("#toggleNotiser").checked = notiser === "1";
  if (ljud !== null) $("#toggleLjud").checked = ljud === "1";
}

function bindSettings() {
  $("#toggleNotiser").addEventListener("change", (e) => {
    localStorage.setItem("settings:notiser", e.target.checked ? "1" : "0");
  });

  $("#toggleLjud").addEventListener("change", (e) => {
    localStorage.setItem("settings:ljud", e.target.checked ? "1" : "0");
  });

  $("#logoutLink").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  bindSettings();
});
