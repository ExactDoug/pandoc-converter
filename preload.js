const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFiles: () => ipcRenderer.invoke('select-files'),
    convertFile: (inputPath, outputPath) => ipcRenderer.invoke('convert-file', inputPath, outputPath),
    checkPandoc: () => ipcRenderer.invoke('check-pandoc'),
    saveFileDialog: (defaultPath) => ipcRenderer.invoke('save-file-dialog', defaultPath),
    checkFileExists: (filePath) => ipcRenderer.invoke('check-file-exists', filePath),
    getUniqueFilename: (filePath) => ipcRenderer.invoke('get-unique-filename', filePath),
    // Get file path from File object using webUtils
    getFilePath: (file) => {
        try {
            return webUtils.getPathForFile(file);
        } catch (error) {
            console.error('Error getting file path:', error);
            return null;
        }
    }
});