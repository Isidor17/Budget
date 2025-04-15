// Sélection des éléments du DOM
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const openDepenseBtn = document.getElementById('btnd');
const openRevenuBtn = document.getElementById('btnr');
const closeModalBtn = document.querySelector('.close');
const validerBtn = document.getElementById('valider');

let currentType = '';

// Ouvrir le modal pour Dépense
openDepenseBtn.addEventListener('click', () => {
    currentType = 'depense';
    modalTitle.textContent = 'AJOUTER DÉPENSE';
    modal.style.display = 'flex';
});

// Ouvrir le modal pour Revenu
openRevenuBtn.addEventListener('click', () => {
    currentType = 'revenu';
    modalTitle.textContent = 'AJOUTER REVENU';
    modal.style.display = 'flex';
});

// Fermer le modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fermer en cliquant à l'extérieur du modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Ajouter une ligne après validation
validerBtn.addEventListener('click', () => {
    const titre = document.getElementById('titre').value;
    const montant = document.getElementById('montant').value;

    if (titre.trim() !== '' && montant.trim() !== '' && montant > 0) {
        ajouterLigne(currentType, titre, montant);
        modal.style.display = 'none';
    } else {
        alert("Veuillez remplir tous les champs avec des valeurs valides.");
    }
});

// Fonction pour ajouter une ligne au tableau
function ajouterLigne(type, titre, montant) {
    const table = document.getElementById(type);
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td>${titre}</td>
        <td>${montant} F CFA</td>
        <td><button onclick="supprimerLigne(this)" class="delete-btn">Supprimer</button></td>
    `;

    mettreAJourTotaux();
    sauvegarderDonnees();
}

// Fonction pour supprimer une ligne
function supprimerLigne(button) {
    const row = button.closest('tr');
    if (row) {
        row.remove();
    }
    mettreAJourTotaux();
    sauvegarderDonnees();
}

// Fonction pour mettre à jour les totaux
function mettreAJourTotaux() {
    let totalDepenses = calculerTotal('depense');
    let totalRevenus = calculerTotal('revenu');
    let solde = totalRevenus - totalDepenses;

    document.querySelector('.summary .card:nth-child(2) p').textContent = totalDepenses + ' F CFA';
    document.querySelector('.summary .card:nth-child(1) p').textContent = totalRevenus + ' F CFA';
    document.querySelector('.summary .card:nth-child(3) p').textContent = solde + ' F CFA';
}

// Fonction pour calculer les totaux
function calculerTotal(type) {
    const table = document.getElementById(type);
    let total = 0;

    for (let i = 1; i < table.rows.length; i++) {
        const montant = parseFloat(table.rows[i].cells[1].textContent.replace(' F CFA', '') || 0);
        total += montant;
    }
    return total;
}

// Sauvegarder les données dans le local storage
function sauvegarderDonnees() {
    const depenses = [];
    const revenus = [];

    // Collecte des dépenses
    document.querySelectorAll('#depense tr:not(:first-child)').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
            depenses.push({
                titre: cells[0].textContent,
                montant: parseFloat(cells[1].textContent)
            });
        }
    });

    // Collecte des revenus
    document.querySelectorAll('#revenu tr:not(:first-child)').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
            revenus.push({
                titre: cells[0].textContent,
                montant: parseFloat(cells[1].textContent)
            });
        }
    });

    localStorage.setItem('depenses', JSON.stringify(depenses));
    localStorage.setItem('revenus', JSON.stringify(revenus));
}

// Charger les données depuis le local storage
function chargerDonnees() {
    const depenses = JSON.parse(localStorage.getItem('depenses')) || [];
    const revenus = JSON.parse(localStorage.getItem('revenus')) || [];

    depenses.forEach(item => ajouterLigne('depense', item.titre, item.montant));
    revenus.forEach(item => ajouterLigne('revenu', item.titre, item.montant));
}

// Charger les données au chargement de la page
chargerDonnees();
