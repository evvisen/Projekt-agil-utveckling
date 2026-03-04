const API_URL = "http://localhost:3000/api/modules";

const userNameElement = document.querySelector("[data-user-name]");
const userMetaElement = document.querySelector("[data-user-meta]");
const firstNameElement = document.querySelector("[data-first-name]");
const streakElement = document.querySelector("[data-streak]");
const totalPointsElement = document.querySelector("[data-total-points]");
const levelElement = document.querySelector("[data-level]");

const profileFullnameElement = document.querySelector("[data-profile-fullname]");
const profileEmailElement = document.querySelector("[data-profile-email]");

const modulesRailElement = document.getElementById("modulesRail");

const toggleNotiserButton = document.getElementById("toggleNotiser");
const toggleLjudButton = document.getElementById("toggleLjud");
const logoutLink = document.getElementById("logoutLink");

function updatePageUI(data) {
  if (firstNameElement) firstNameElement.textContent = data.firstName || "—";
  if (userNameElement) userNameElement.textContent = data.userName || "—";
  if (userMetaElement) userMetaElement.textContent = data.userMeta || "—";
  if (streakElement) streakElement.textContent = data.streakText || "—";

  if (totalPointsElement) totalPointsElement.textContent = String(data.totalPoints || 0);
  if (levelElement) levelElement.textContent = String(data.level || 0);

  if (profileFullnameElement) profileFullnameElement.textContent = data.fullName || "—";
  if (profileEmailElement) profileEmailElement.textContent = data.email || "—";
}

async function fetchModules() {
  if (!modulesRailElement) return;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.success && Array.isArray(data.modules)) {
      renderModulesRail(data.modules);
    } else {
      console.log("Backend error:", data.message);
    }
  } catch (error) {
    console.log("Fetch failed:", error);
  }
}

function getIconFileName(moduleName) {
  const nameLower = String(moduleName || "").toLowerCase();

  if (nameLower.includes("juridik")) return "juridik.svg";
  if (nameLower.includes("privatekonomi")) return "privatekonomi.svg";
  if (nameLower.includes("hushåll")) return "hus.svg";
  if (nameLower.includes("mat")) return "food.svg";

  return "lock.svg";
}

function renderModulesRail(modules) {
  if (!modulesRailElement) return;

  modulesRailElement.innerHTML = "";

  modules.forEach((m) => {
    const iconPath = `images/${getIconFileName(m.name)}`;

    const railItem = document.createElement("div");
    railItem.className = "card moditem";
    railItem.style.cursor = "pointer";

    railItem.innerHTML = `
      <div class="moditem__left">
        <div class="moditem__icon">
          <img src="${iconPath}" alt="${m.name}">
        </div>
        <div class="moditem__text">
          <div class="moditem__name">${m.name}</div>
          <div class="moditem__sub">${m.description || ""}</div>
        </div>
      </div>
      <div class="moditem__right">›</div>
    `;

    railItem.addEventListener("click", () => {
      window.location.href = `quiz.html?id=${m.module_id}`;
    });

    modulesRailElement.appendChild(railItem);
  });
}

function loadSettings() {
  const notiser = localStorage.getItem("settings:notiser");
  const ljud = localStorage.getItem("settings:ljud");

  if (toggleNotiserButton) {
    if (notiser === "1") toggleNotiserButton.classList.add("is-on");
    if (notiser === "0") toggleNotiserButton.classList.remove("is-on");
  }

  if (toggleLjudButton) {
    if (ljud === "1") toggleLjudButton.classList.add("is-on");
    if (ljud === "0") toggleLjudButton.classList.remove("is-on");
  }
}

function bindSettings() {
  if (toggleNotiserButton) {
    toggleNotiserButton.addEventListener("click", () => {
      const isOn = toggleNotiserButton.classList.toggle("is-on");
      localStorage.setItem("settings:notiser", isOn ? "1" : "0");
    });
  }

  if (toggleLjudButton) {
    toggleLjudButton.addEventListener("click", () => {
      const isOn = toggleLjudButton.classList.toggle("is-on");
      localStorage.setItem("settings:ljud", isOn ? "1" : "0");
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
    // Demo (replace when backend user endpoint exists)
  updatePageUI({
    firstName: "Oskar",
    userName: "Oskar O.",
    userMeta: "Nivå 4 • Grundare",
    streakText: "3 dagar i rad",
    totalPoints: 420,
    level: 4,
    fullName: "Oskar Oskarsson",
    email: "oskar.oskarsson@gmail.se",
  });

  loadSettings();
  bindSettings();
  fetchModules();
});
