const API_URL = 'http://localhost:3000/api/modules';

document.addEventListener('DOMContentLoaded', () => {
    fetchModules();
});

async function fetchModules() {
    const gridContainer = document.getElementById('modulesGrid');

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.success && data.modules) {
            renderModules(data.modules);
        } else {
            console.error("Backend error:", data.message);
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

function renderModules(modules) {
    const gridContainer = document.getElementById('modulesGrid');
    const railContainer = document.getElementById('modulesRail');

    gridContainer.innerHTML = '';
    railContainer.innerHTML = '';

    modules.forEach(module => {
        let iconName = 'placeholder.svg';

        const nameLower = module.name.toLowerCase();
        if (nameLower.includes('juridik')) {
            iconName = 'juridik.svg';
        } else if (nameLower.includes('privatekonomi')) {
            iconName = 'privatekonomi.svg';
        }

        const iconPath = `images/${iconName}`;

        const cardHtml = `
            <article class="moduleCard">
                <div class="cardTop">
                    <div class="iconTile" style="background: rgba(124, 58, 237, 0.1);">
                        <img src="${iconPath}" alt="${module.name}" style="width: 34px; height: 34px;">
                    </div>
                    <div>
                        <h3 class="cardTitle">${module.name}</h3>
                        <p class="cardDesc">${module.description}</p>
                    </div>
                </div>
                <div class="cardMeta">
                    <div class="levelCount">
                        <strong>1</strong><span>/10</span>
                    </div>
                    <div class="progressTrack">
                        <div class="progressFill" style="width: 20%;"></div>
                    </div>
                </div>
                <button class="cardBtn" onclick="window.location.href='quiz.html?id=${module.module_id}'">
                    Fortsätt kurs
                </button>
            </article>
        `;
        gridContainer.insertAdjacentHTML('beforeend', cardHtml);

        const railHtml = `
            <div class="railItem">
                <div class="railIcon" style="background: #F8FAFC;">
                    <img src="${iconPath}" alt="" style="width: 24px; height: 24px;">
                </div>
                <div>
                    <div class="railName">${module.name}</div>
                    <div class="railDesc">${module.description.substring(0, 25)}...</div>
                </div>
                <div class="railMeta">›</div>
            </div>
        `;
        railContainer.insertAdjacentHTML('beforeend', railHtml);
    });
}
