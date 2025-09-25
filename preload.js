const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFiles: () => ipcRenderer.invoke('select-files'),
    convertFile: (inputPath, outputPath) => ipcRenderer.invoke('convert-file', inputPath, outputPath),
    checkPandoc: () => ipcRenderer.invoke('check-pandoc'),
    saveFileDialog: (defaultPath) => ipcRenderer.invoke('save-file-dialog', defaultPath)
});