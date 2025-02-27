// Sélectionner un dossier
document.getElementById('select-folder').addEventListener('click', async () => {
    const folderPath = await window.electronAPI.openFolderDialog();
    if (folderPath) {
        localStorage.setItem('savedFolder', folderPath);
        document.querySelector('#selected-folder-path').textContent = folderPath;
    } else {
        document.querySelector('#selected-folder-path').textContent = 'Aucun dossier sélectionné';
    }
    });

document.getElementById('scan-duplicates').addEventListener('click', async () => {
    const folderPath = localStorage.getItem('savedFolder');
    
    if (folderPath) {
        const packageFiles = await window.electronAPI.findPackages(folderPath);
        
        const resultContainer = document.getElementById('FichierA');
        resultContainer.innerHTML = '';
        
        packageFiles.forEach(file => {
            const p = document.createElement('p');
            p.textContent = file;
            resultContainer.appendChild(p);
        });
        
        if (packageFiles.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'Aucun fichier .package trouvé';
            resultContainer.appendChild(p);
        }
    } else {
        alert('Veuillez d\'abord sélectionner un dossier.');
    }
});