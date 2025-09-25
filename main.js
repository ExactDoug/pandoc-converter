const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs').promises;
const fsSync = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false // Required for webUtils.getPathForFile()
        },
        icon: path.join(__dirname, 'icon.png'),
        title: 'Pandoc Converter'
    });

    mainWindow.loadFile('index.html');

    // Open DevTools only in development
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle file selection dialog
ipcMain.handle('select-files', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Word Documents', extensions: ['docx'] }
        ]
    });

    if (!result.canceled) {
        return result.filePaths;
    }
    return [];
});

// Handle Pandoc conversion
ipcMain.handle('convert-file', async (event, inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        // Properly escape paths for command line
        const escapedInput = `"${inputPath}"`;
        const escapedOutput = `"${outputPath}"`;
        const command = `pandoc ${escapedInput} -t gfm -o ${escapedOutput}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject({ success: false, error: error.message, command });
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                reject({ success: false, error: stderr, command });
                return;
            }

            resolve({ success: true, output: outputPath, command });
        });
    });
});

// Check if Pandoc is installed
ipcMain.handle('check-pandoc', async () => {
    return new Promise((resolve) => {
        exec('pandoc --version', (error, stdout, stderr) => {
            if (error) {
                resolve({ installed: false, version: null });
            } else {
                const versionMatch = stdout.match(/pandoc\s+([\d.]+)/);
                resolve({
                    installed: true,
                    version: versionMatch ? versionMatch[1] : 'unknown'
                });
            }
        });
    });
});

// Save file dialog for output
ipcMain.handle('save-file-dialog', async (event, defaultPath) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultPath,
        filters: [
            { name: 'Markdown', extensions: ['md'] }
        ]
    });

    if (!result.canceled) {
        return result.filePath;
    }
    return null;
});

// Check if file exists
ipcMain.handle('check-file-exists', async (event, filePath) => {
    try {
        return fsSync.existsSync(filePath);
    } catch (error) {
        console.error('Error checking file existence:', error);
        return false;
    }
});

// Generate unique filename with counter suffix
ipcMain.handle('get-unique-filename', async (event, filePath) => {
    try {
        if (!fsSync.existsSync(filePath)) {
            return filePath;
        }

        const dir = path.dirname(filePath);
        const ext = path.extname(filePath);
        const nameWithoutExt = path.basename(filePath, ext);

        let counter = 1;
        let newPath = path.join(dir, `${nameWithoutExt} (${counter})${ext}`);

        while (fsSync.existsSync(newPath)) {
            counter++;
            newPath = path.join(dir, `${nameWithoutExt} (${counter})${ext}`);
        }

        return newPath;
    } catch (error) {
        console.error('Error generating unique filename:', error);
        return filePath;
    }
});