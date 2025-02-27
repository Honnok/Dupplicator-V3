const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
    showItemInFolder: (path) => ipcRenderer.send('show-item-in-folder', path),
    deleteFile: (path) => ipcRenderer.send('delete-file', path),
    readDirectory: (path) => ipcRenderer.invoke('read-directory', path),
    hashFile: (path) => ipcRenderer.invoke('hash-file', path),
    findPackages: (folderPath) => ipcRenderer.invoke('findPackages', folderPath)
});