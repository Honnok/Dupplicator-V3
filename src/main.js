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

// Calcule le hash d'un fichier
ipcMain.handle('hash-file', async (event, filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
});