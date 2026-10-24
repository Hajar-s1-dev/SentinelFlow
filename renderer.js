document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scanBtn');

    if (scanBtn) {
        scanBtn.addEventListener('click', async () => {
            console.log("Lancement du scan...");
            try {
                const results = await window.electronAPI.runScan();
                renderKanban(results);
            } catch (error) {
                console.error("Erreur lors de l'exécution du scan:", error);
            }
        });
    }

    setupDragAndDrop();
});

function renderKanban(data) {
    const colATraiter = document.getElementById('col-atraiter');
    const colEnCours = document.getElementById('col-encours');
    const colVerifie = document.getElementById('col-verifie');

    // Réinitialisation des colonnes en gardant uniquement l'en-tête
    colATraiter.innerHTML = `<div class="column-header"><span>● À traiter</span><span class="column-count" id="count-atraiter">0</span></div>`;
    colEnCours.innerHTML = `<div class="column-header"><span>● En cours</span><span class="column-count" id="count-encours">0</span></div>`;
    colVerifie.innerHTML = `<div class="column-header"><span>● Vérifié ✅</span><span class="column-count" id="count-verifie">0</span></div>`;

    if (!data || data.length === 0) {
        colATraiter.innerHTML += '<div class="empty-col">Aucun risque détecté.</div>';
        updateAllCounts();
        return;
    }

    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `kanban-card ${getCardClass(item.gravite)}`;
        card.setAttribute('draggable', 'true');
        card.id = `card-${index}-${Date.now()}`;

        card.innerHTML = `
            <div class="card-title">${item.risque}</div>
            <div class="card-desc">${item.recommandation}</div>
            <span class="badge bg-${getBadgeClass(item.gravite)}">${item.gravite}</span>
        `;

        // Événements de Drag sur la carte
        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.id);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });

        let status = item.statut || 'À traiter';
        if (status === 'À traiter') colATraiter.appendChild(card);
        else if (status === 'En cours') colEnCours.appendChild(card);
        else colVerifie.appendChild(card);
    });

    updateAllCounts();
}

function setupDragAndDrop() {
    const columns = document.querySelectorAll('.kanban-column');

    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault(); // Nécessaire pour autoriser le Drop
            column.classList.add('drag-over');
        });

        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });

        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');

            const cardId = e.dataTransfer.getData('text/plain');
            const card = document.getElementById(cardId);

            if (card) {
                column.appendChild(card);
                updateAllCounts();
            }
        });
    });
}

function updateAllCounts() {
    const countATraiter = document.querySelectorAll('#col-atraiter .kanban-card').length;
    const countEnCours = document.querySelectorAll('#col-encours .kanban-card').length;
    const countVerifie = document.querySelectorAll('#col-verifie .kanban-card').length;

    if (document.getElementById('count-atraiter')) document.getElementById('count-atraiter').innerText = countATraiter;
    if (document.getElementById('count-encours')) document.getElementById('count-encours').innerText = countEnCours;
    if (document.getElementById('count-verifie')) document.getElementById('count-verifie').innerText = countVerifie;
}

function getCardClass(gravite) {
    switch (gravite) {
        case 'Critique': return 'critique';
        case 'Élevé': return 'eleve';
        case 'Moyen': return 'moyen';
        case 'Faible': return 'faible';
        default: return 'moyen';
    }
}

function getBadgeClass(gravite) {
    switch (gravite) {
        case 'Critique': return 'critique';
        case 'Élevé': return 'eleve';
        case 'Moyen': return 'moyen';
        case 'Faible': return 'faible';
        default: return 'moyen';
    }
}
