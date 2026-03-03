const userNameElement = document.querySelector("[data-user-name]");
const userMetaElement = document.querySelector("[data-user-meta]");
const firstNameElement = document.querySelector("[data-first-name]");
const streakElement = document.querySelector("[data-streak]");
const totalPointsElement = document.querySelector("[data-total-points]");
const levelElement = document.querySelector("[data-level]");
const timeLeftElement = document.querySelector("[data-time-left]");
const progressTextElement = document.querySelector("[data-progress]");
const progressRingElement = document.querySelector("[data-progress-ring]");

function updateDashboardUI(data) {
  if (firstNameElement) firstNameElement.textContent = data.firstName || "—";
  if (userNameElement) userNameElement.textContent = data.userName || "—";
  if (userMetaElement) userMetaElement.textContent = data.userMeta || "—";
  if (streakElement) streakElement.textContent = data.streakText || "—";

  if (totalPointsElement) totalPointsElement.textContent = String(data.totalPoints || 0);
  if (levelElement) levelElement.textContent = String(data.level || 0);
  if (timeLeftElement) timeLeftElement.textContent = data.timeLeft || "—";

  const progressPercent = Number(data.progress || 0);
  if (progressTextElement) progressTextElement.textContent = progressPercent + "%";

  if (progressRingElement) {
    progressRingElement.style.background =
      `conic-gradient(var(--purple) 0 ${progressPercent}%, #E5E7EB ${progressPercent}% 100%)`;
  }
}

// Demo (remove when backend is connected)
updateDashboardUI({
  firstName: "Oskar",
  userName: "Oskar O.",
  userMeta: "Nivå 4 • Grundare",
  streakText: "3 dagar i rad",
  totalPoints: 420,
  level: 4,
  timeLeft: "4 min kvar",
  progress: 65,
});
