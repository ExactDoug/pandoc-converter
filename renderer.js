const dropZone = document.getElementById('dropZone');
const browseBtn = document.getElementById('browseBtn');
const fileList = document.getElementById('fileList');
const actions = document.getElementById('actions');
const convertAllBtn = document.getElementById('convertAllBtn');
const clearBtn = document.getElementById('clearBtn');
const logSection = document.getElementById('logSection');
const logContent = document.getElementById('logContent');
const pandocStatus = document.getElementById('pandocStatus');

let selectedFiles = [];

// Check Pandoc installation on startup
async function checkPandocInstallation() {
    const result = await window.electronAPI.checkPandoc();
    if (result.installed) {
        pandocStatus.innerHTML = `✅ Pandoc ${result.version} detected`;
        pandocStatus.className = 'pandoc-status success';
    } else {
        pandocStatus.innerHTML = '⚠️ Pandoc not found in PATH. Please install Pandoc first.';
        pandocStatus.className = 'pandoc-status warning';
    }
}

checkPandocInstallation();

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop zone
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('drag-over');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('drag-over');
    }, false);
});

// Handle dropped files using webUtils.getPathForFile()
dropZone.addEventListener('drop', async (e) => {
    const files = Array.from(e.dataTransfer.files).filter(file =>
        file.name.toLowerCase().endsWith('.docx')
    );

    if (files.length > 0) {
        // Use webUtils.getPathForFile() via the preload bridge
        const filePaths = [];
        
        for (const file of files) {
            const filePath = window.electronAPI.getFilePath(file);
            if (filePath) {
                console.log('Got file path:', filePath);
                filePaths.push(filePath);
            } else {
                console.error('Could not get path for file:', file.name);
            }
        }
        
        if (filePaths.length > 0) {
            addFiles(filePaths);
        } else {
            alert('Could not access file paths. Please use the Browse button instead.');
        }
    } else {
        alert('Please drop only DOCX files');
    }
});

// Browse button click
browseBtn.addEventListener('click', async () => {
    const filePaths = await window.electronAPI.selectFiles();
    if (filePaths.length > 0) {
        addFiles(filePaths);
    }
});

// Click on drop zone
dropZone.addEventListener('click', async (e) => {
    if (e.target === browseBtn) return;
    const filePaths = await window.electronAPI.selectFiles();
    if (filePaths.length > 0) {
        addFiles(filePaths);
    }
});

function addFiles(filePaths) {
    filePaths.forEach(filePath => {
        if (!selectedFiles.some(f => f.path === filePath)) {
            selectedFiles.push({
                path: filePath,
                name: filePath.split(/[\\/]/).pop(),
                status: 'pending'
            });
        }
    });

    updateFileList();
    if (selectedFiles.length > 0) {
        actions.style.display = 'flex';
    }
}

function sanitizeFilename(filename) {
    let base = filename.replace(/\.docx$/i, '');
    base = base.replace(/[–—]/g, '_');
    base = base.replace(/[^\w\s.-]/g, '_');
    base = base.replace(/\s+/g, '_');
    base = base.replace(/_+/g, '_');
    return base.toLowerCase() + '.md';
}

function updateFileList() {
    fileList.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.index = index;

        const outputName = sanitizeFilename(file.name);

        let statusClass = '';
        let statusText = '';

        switch (file.status) {
            case 'pending':
                statusText = `→ ${outputName}`;
                break;
            case 'processing':
                statusClass = 'processing';
                statusText = '⏳ Converting...';
                break;
            case 'success':
                statusClass = 'success';
                statusText = `✅ Converted to ${outputName}`;
                break;
            case 'error':
                statusClass = 'error';
                statusText = `❌ Conversion failed`;
                break;
        }

        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-status ${statusClass}">${statusText}</div>
            </div>
            <button class="btn-convert" data-index="${index}" 
                    ${file.status === 'processing' ? 'disabled' : ''}>
                ${file.status === 'success' ? 'Convert Again' : 'Convert'}
            </button>
        `;

        fileList.appendChild(fileItem);
    });

    // Add event listeners to convert buttons
    document.querySelectorAll('.btn-convert').forEach(button => {
        button.addEventListener('click', async () => {
            const index = parseInt(button.dataset.index);
            await convertSingleFile(index);
        });
    });
}

// Show collision dialog when output file exists
function showCollisionDialog(fileName, outputPath) {
    return new Promise((resolve) => {
        const outputName = outputPath.split(/[\\/]/).pop();
        
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'collision-dialog';
        
        dialog.innerHTML = `
            <h3>⚠️ File Already Exists</h3>
            <p>The output file already exists:</p>
            <p class="file-path">${outputName}</p>
            <p>What would you like to do?</p>
            <div class="dialog-buttons">
                <button class="dialog-btn btn-overwrite" data-choice="overwrite">
                    Overwrite
                </button>
                <button class="dialog-btn btn-rename" data-choice="rename">
                    Rename (add counter)
                </button>
                <button class="dialog-btn btn-cancel" data-choice="cancel">
                    Cancel
                </button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Handle button clicks
        dialog.querySelectorAll('.dialog-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.dataset.choice;
                document.body.removeChild(overlay);
                resolve(choice);
            });
        });
    });
}

async function convertSingleFile(index) {
    const file = selectedFiles[index];
    let outputPath = file.path.replace(/\.docx$/i, '.md');

    // Check if output file already exists
    const fileExists = await window.electronAPI.checkFileExists(outputPath);
    
    if (fileExists) {
        const choice = await showCollisionDialog(file.name, outputPath);
        
        if (choice === 'cancel') {
            logMessage(`⏭️ Skipped: ${file.name} (file already exists)`, 'info');
            return;
        } else if (choice === 'rename') {
            outputPath = await window.electronAPI.getUniqueFilename(outputPath);
            const newName = outputPath.split(/[\\/]/).pop();
            logMessage(`📝 Renaming output to: ${newName}`, 'info');
        }
        // If 'overwrite', just proceed with original outputPath
    }

    file.status = 'processing';
    updateFileList();

    try {
        const result = await window.electronAPI.convertFile(file.path, outputPath);
        if (result.success) {
            file.status = 'success';
            const outputName = outputPath.split(/[\\/]/).pop();
            logMessage(`✅ Converted: ${file.name} → ${outputName}`, 'success');
            logMessage(`   Command: ${result.command}`, 'info');
        } else {
            file.status = 'error';
            logMessage(`❌ Failed: ${file.name} - ${result.error}`, 'error');
        }
    } catch (error) {
        file.status = 'error';
        logMessage(`❌ Failed: ${file.name} - ${error.message}`, 'error');
    }

    updateFileList();
}

// Convert all files
convertAllBtn.addEventListener('click', async () => {
    logSection.style.display = 'block';
    logContent.innerHTML = '';

    for (let i = 0; i < selectedFiles.length; i++) {
        if (selectedFiles[i].status !== 'success') {
            await convertSingleFile(i);
        }
    }

    logMessage('🎉 Batch conversion complete!', 'success');
});

// Clear all files
clearBtn.addEventListener('click', () => {
    selectedFiles = [];
    fileList.innerHTML = '';
    actions.style.display = 'none';
    logSection.style.display = 'none';
});

function logMessage(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.textContent = message;
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
}