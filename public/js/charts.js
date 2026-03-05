

const PROGRESS_URL = "http://localhost:3000/api/progress";


function createDoughnut(canvasId, done, total) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const safeTotal = Math.max(Number(total || 0), 0);
  const safeDone = Math.min(Math.max(Number(done || 0), 0), safeTotal);
  const left = Math.max(safeTotal - safeDone, 0);


  const data = safeTotal > 0 ? [safeDone, left] : [0, 1];


  return new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Klar", "Kvar"],
      datasets: [
        {
          data,

          backgroundColor: ["#7C3AED", "#E5E7EB"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: false,
      cutout: "70%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed}`,
          },
        },
      },
    },
  });
}


function setProgressText(textId, done, total) {
  const el = document.getElementById(textId);
  if (!el) return;
  el.textContent = `${done} / ${total} nivåer`;
}

async function fetchProgress() {
  const res = await fetch(PROGRESS_URL);
  if (!res.ok) throw new Error("Progress endpoint svarade inte OK");
  return await res.json();
}


function getModuleProgress(progressJson, moduleName) {
  const modules = progressJson?.modules;
  if (!Array.isArray(modules)) return null;

  const found = modules.find((m) =>
    String(m.name || "").toLowerCase().includes(moduleName.toLowerCase())
  );

  if (!found) return null;

  return {
    done: Number(found.levelsDone || 0),
    total: Number(found.levelsTotal || 0),
  };
}

document.addEventListener("DOMContentLoaded", async () => {

  let juridik = { done: 2, total: 5 };
  let privatekonomi = { done: 1, total: 5 };


  try {
    const progressJson = await fetchProgress();

    const j = getModuleProgress(progressJson, "Juridik");
    const p = getModuleProgress(progressJson, "Privatekonomi");

    if (j) juridik = j;
    if (p) privatekonomi = p;
  } catch (err) {

    console.log("Kunde inte hämta progress från backend, kör demo:", err);
  }


  createDoughnut("chartJuridik", juridik.done, juridik.total);
  setProgressText("textJuridik", juridik.done, juridik.total);

  createDoughnut("chartPrivatekonomi", privatekonomi.done, privatekonomi.total);
  setProgressText("textPrivatekonomi", privatekonomi.done, privatekonomi.total);
});