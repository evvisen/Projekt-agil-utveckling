const API = "http://localhost:3000/api/modules";
const res = await fetch(API);

function iconForModule(name) {
  const n = String(name || "").toLowerCase();

  if (n.includes("jurid")) {
    return { src: "./images/Juridik.svg", bg: "rgba(59,130,246,.10)" };
  }
  if (n.includes("privat") || n.includes("ekonomi")) {
    return { src: "./images/privatekonomi.svg", bg: "rgba(239,68,68,.10)" };
  }
  if (n.includes("hush")) {
    return { src: "./images/hus.svg", bg: "rgba(34,197,94,.10)" };
  }
  if (n.includes("jobb") || n.includes("lön")) {
    return { src: "./images/hus.svg", bg: "rgba(245,158,11,.14)" };
  }

  return { src: "./images/hus.svg", bg: "rgba(124,58,237,.10)" };
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, String(v));
  });
  children.forEach((c) => node.appendChild(c));
  return node;
}

function renderError(gridEl) {
  gridEl.innerHTML = "";
  gridEl.appendChild(
    el("div", { class: "errorCard" }, [
      el("h3", { class: "errorTitle", text: "Kunde inte hämta moduler" }),
      el("p", { class: "errorText", text: "Starta backend och testa igen." }),
    ])
  );
}

function renderModules(modules) {
  const grid = document.getElementById("modulesGrid");
  const rail = document.getElementById("modulesRail");
  if (!grid || !rail) return;

  grid.innerHTML = "";
  rail.innerHTML = "";

  modules.forEach((m, idx) => {
    const title = m?.name ?? `Modul ${idx + 1}`;
    const desc = m?.description ?? "Beskrivning saknas";
    const levelsDone = Number(m?.levelsDone ?? m?.completedLevels ?? (idx === 0 ? 2 : idx === 1 ? 1 : 0));
    const totalLevels = Number(m?.totalLevels ?? m?.levelsTotal ?? 8);
    const nextLevel = Number(m?.nextLevel ?? Math.min(totalLevels, Math.max(1, levelsDone + 1)));
    const eta = m?.etaMin ?? (idx === 0 ? 4 : idx === 1 ? 6 : 5);

    const pct = totalLevels > 0 ? Math.max(0, Math.min(100, Math.round((levelsDone / totalLevels) * 100))) : 0;

    const icon = iconForModule(title);

    const card = el("article", { class: "moduleCard" }, [
      el("div", { class: "cardTop" }, [
        el("div", { class: "iconTile", style: `background:${icon.bg}` }, [
          el("img", { src: icon.src, alt: "" }),
        ]),
        el("div", {}, [
          el("h3", { class: "cardTitle", text: title }),
          el("p", { class: "cardDesc", text: desc }),
        ]),
      ]),

      el("div", { class: "cardMeta" }, [
        el("div", { class: "levelCount" }, [
          el("strong", { text: `${levelsDone}/${totalLevels}` }),
          el("span", { text: "nivåer" }),
        ]),
        el("div", { class: "progressTrack", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(pct) }, [
          el("div", { class: "progressFill", style: `width:${pct}%` }),
        ]),
      ]),

      el("div", { class: "cardBottom" }, [
        el("div", { class: "nextLevel", text: `Nästa: Nivå ${nextLevel}` }),
        el("div", { class: "pillSmall", text: `${eta} min` }),
      ]),

      el("button", { class: "cardBtn", type: "button" }, []),
    ]);

    card.querySelector(".cardBtn").textContent = "Öppna modul";
    card.querySelector(".cardBtn").addEventListener("click", () => {
      window.location.href = "./module-path.html";
    });

    grid.appendChild(card);

    const railItem = el("div", { class: "railItem" }, [
      el("div", { class: "railIcon", style: `background:${icon.bg}` }, [
        el("img", { src: icon.src, alt: "" }),
      ]),
      el("div", {}, [
        el("div", { class: "railName", text: title }),
        el("div", { class: "railDesc", text: desc.length > 34 ? desc.slice(0, 34) + "…" : desc }),
      ]),
      el("div", { class: "railMeta", text: `${levelsDone}/${totalLevels}` }),
    ]);

    rail.appendChild(railItem);
  });
}

async function init() {
  const grid = document.getElementById("modulesGrid");
  if (!grid) return;

  try {
    const res = await fetch(API_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("Bad response");

    const data = await res.json();

    const modules = Array.isArray(data) ? data : Array.isArray(data?.modules) ? data.modules : [];
    if (!modules.length) throw new Error("Empty modules");

    renderModules(modules);
  } catch (_) {
    renderError(grid);
    const rail = document.getElementById("modulesRail");
    if (rail) rail.innerHTML = "";
  }
}

window.addEventListener("DOMContentLoaded", init);
