const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Gère la boîte de dialogue de sélection de dossier
ipcMain.handle('open-folder-dialog', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    return result.filePaths[0]; // Retourne le chemin du dossier sélectionné
});

// Ouvre le dossier dans l'explorateur de fichiers
ipcMain.on('show-item-in-folder', (event, path) => {
    shell.showItemInFolder(path);
});

// Supprime un fichier
ipcMain.on('delete-file', (event, path) => {
    fs.unlinkSync(path);
});

// Lit le contenu d'un dossier
ipcMain.handle('read-directory', async (event, folderPath) => {
    return fs.readdirSync(folderPath);
});

// Fonction pour trouver les fichiers .package
ipcMain.handle('findPackages', async (event, folderPath) => {
    const packageFiles = new Map();

    function findFiles(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                findFiles(filePath);
            } else if (filePath.endsWith('.package')) {
                const fileName = path.basename(filePath);

                packageFiles.set(fileName, (packageFiles.get(fileName) || 0) + 1);
            }
        });
    }

    findFiles(folderPath);
    
    // Filtre les fichiers en double
    const duplicateFiles = Array.from(packageFiles.entries())
        .filter(([_, count]) => count > 1)
        .map(([fileName]) => fileName);

    return duplicateFiles;
});