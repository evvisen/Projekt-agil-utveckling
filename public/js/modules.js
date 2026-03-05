const API_URL = "http://localhost:3000/api/modules";

const userNameElement = document.querySelector("[data-user-name]");
const userMetaElement = document.querySelector("[data-user-meta]");
const firstNameElement = document.querySelector("[data-first-name]");
const streakElement = document.querySelector("[data-streak]");
const totalPointsElement = document.querySelector("[data-total-points]");
const levelElement = document.querySelector("[data-level]");

const modulesGridElement = document.getElementById("modulesGrid");
const modulesRailElement = document.getElementById("modulesRail");

function updatePageUI(data) {
  if (firstNameElement) firstNameElement.textContent = data.firstName || "—";
  if (userNameElement) userNameElement.textContent = data.userName || "—";
  if (userMetaElement) userMetaElement.textContent = data.userMeta || "—";
  if (streakElement) streakElement.textContent = data.streakText || "—";

  if (totalPointsElement)
    totalPointsElement.textContent = String(data.totalPoints || 0);
  if (levelElement) levelElement.textContent = String(data.level || 0);
}

async function fetchModules() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.success && Array.isArray(data.modules)) {
      renderModulesGrid(data.modules);
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

function renderModulesGrid(modules) {
  if (!modulesGridElement) return;

  modulesGridElement.innerHTML = "";

  modules.forEach((m) => {
    const iconPath = `images/${getIconFileName(m.name)}`;

    const card = document.createElement("article");
    card.className = "module-card";

    card.innerHTML = `
      <div class="module-card__top">
        <div class="module-card__icon-tile">
          <img src="${iconPath}" alt="${m.name}">
        </div>
        <div>
          <h3 class="module-card__title">${m.name}</h3>
          <p class="module-card__desc">${m.description || ""}</p>
        </div>
      </div>

      <div class="progress-track">
        <div class="progress-fill" style="width: 20%;"></div>
      </div>

      <button class="module-card__btn" type="button">Fortsätt kurs</button>
    `;

    const btn = card.querySelector(".module-card__btn");
    btn.addEventListener("click", () => {
      window.location.href = `module-path.html?id=${m.module_id}`;
    });

    modulesGridElement.appendChild(card);
  });
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
      window.location.href = `module-path.html?id=${m.module_id}`;
    });

    modulesRailElement.appendChild(railItem);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Demo (replace when backend user endpoint exists)
  updatePageUI({
    firstName: "Oskar",
    userName: "Oskar O.",
    userMeta: "Nivå 4 • Grundare",
    streakText: "2 dagar i rad",
    totalPoints: 420,
    level: 4,
  });

  fetchModules();
});
