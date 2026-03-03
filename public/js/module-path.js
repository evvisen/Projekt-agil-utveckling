//avkodar mitten-delen från base64 till ett objekt, och returnerar user_id

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.user_id;
}

//Skickar en GET till backend med userId och moduleId. Returnerar listan med nivåer
async function fetchProgress(userId, moduleId) {
  const response = await fetch(
    `http://localhost:3000/api/progress/${userId}/${moduleId}`
  );
  const data = await response.json();

  if (!data.success) return null;
  return data.levels;
}

//Tar emot ett nivå-objekt och bygger ett <a>-element med rätt CSS-klasser, text och länk + status på nivå

function createLevelNode(level, moduleId) {
  const link = document.createElement("a");
  link.classList.add("level", "levellink");

  const node = document.createElement("div");
  node.classlist.add("node");

  const label = document.createElement("div");
  label.classlist.add("label");
  label.textContent = `Nivå ${level.level_number}`;

  if (level.status === "locked") {
    link.classList.add("level--locked");
    link.href = "#locked-popup";
    link.setAttribute("aria-label", `Nivå ${level.level_number} låst`);
    node.classList.add("node--locked");
    node.textContent = "🔒";
    label.classList.add("label--locked");
  } else if (level.status === "unlocked") {
    link.classList.add("level--active");
    link.href = `./quiz.html?module_id=${moduleId}&level=${level.level_number}`;
    link.setAttribute("aria-label", `Öppna nivå ${level.level_number}`);
    node.classList.add("node--active");
    node.textContent = level.level_number;
    label.classList.add("label--active");

    const halo = document.createElement("div");
    halo.classList.add("halo");
    halo.setAttribute("aria-hidden", "true");
    link.appendChild(halo);
  } else if (level.status === "completed") {
    link.href = "#";
    link.setAttribute("aria-label", `Nivå ${level.level_number} klar`);
    node.classList.add("node--unlocked");
    node.textContent = "✓";
    label.classList.add("label--unlocked");
  }

  node.setAttribute("aria-hidden", "true");
  link.appendChild(node);
  link.appendChild(label);
  return link;
}

//Huvudfunktionen som kopplar ihop allt

async function renderModulePath() {
  const params = new URLSearchParams(window.location.search);
  const moduleId = params.get("module_id");

  const userId = getUserIdFromToken();
  if (!userId || !moduleId) return;

  try {
    const levels = await fetchProgress(userId, moduleId);
    if (!levels) return;

    const pathCard = document.querySelector(".pathCard");

    let completedCount = 0;
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].status === "completed") {
        completedCount++;
      }
    }

    const badge = document.querySelector(".progressBadge");
    if (badge) {
      badge.textContent = `${completedCount}/${levels.length}`;
    }

    for (let i = 0; i < levels.length; i++) {
      const levelNode = createLevelNode(levels[i], moduleId);
      pathCard.appendChild(levelNode);
    }
  } catch (err) {
    console.error("Kunde inte hämta progress:", err);
  }
}

renderModulePath();
