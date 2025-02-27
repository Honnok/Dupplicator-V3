document.getElementById('select-folder').addEventListener('click', async () => {
    const folderPath = await window.electronAPI.openFolderDialog();
    if (folderPath) {
        localStorage.setItem('savedFolder', folderPath);
        alert(`Dossier sélectionné : ${folderPath}`);
    }
});

document.getElementById('scan-duplicates').addEventListener('click', () => {
    const folderPath = localStorage.getItem('savedFolder');
    if (folderPath) {
        const duplicates = findDuplicates(folderPath);
        displayDuplicates(duplicates);
    } else {
        alert('Veuillez d\'abord sélectionner un dossier.');
    }
});

document.getElementById('delete-duplicates').addEventListener('click', () => {
    const duplicates = JSON.parse(localStorage.getItem('duplicates'));
    if (duplicates && duplicates.length > 0) {
        deleteDuplicates(duplicates);
    } else {
        alert('Aucun doublon à supprimer.');
    }
});

function findDuplicates(folderPath) {
    // Implémente la détection des doublons ici
    // Retourne un tableau d'objets { filePath, duplicateOf }
    return [];
}

function displayDuplicates(duplicates) {
    const tableBody = document.querySelector('#duplicates-table tbody');
    tableBody.innerHTML = '';

    duplicates.forEach((duplicate) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${duplicate.filePath}</td>
            <td>${duplicate.duplicateOf}</td>
            <td><button onclick="window.electronAPI.showItemInFolder('${duplicate.filePath}')">Ouvrir</button></td>
        `;
        tableBody.appendChild(row);
    });

    localStorage.setItem('duplicates', JSON.stringify(duplicates));
}

function deleteDuplicates(duplicates) {
    duplicates.forEach((duplicate) => {
        window.electronAPI.deleteFile(duplicate.filePath);
    });
    alert('Doublons supprimés !');
    displayDuplicates([]); // Vide le tableau
}