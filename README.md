# Pandoc Converter

A modern Electron desktop application that converts DOCX files to Markdown (GitHub Flavored Markdown) format using Pandoc.

## ✨ Features

- **Drag & Drop Support** - Simply drag DOCX files onto the app window
- **File Browser** - Browse and select multiple files at once
- **Individual Conversion** - Convert files one at a time with real-time status
- **Batch Conversion** - Convert all selected files with one click
- **Smart Collision Handling** - Choose to overwrite, rename, or cancel when output file exists
- **Pandoc Detection** - Automatically checks if Pandoc is installed on startup
- **Real-time Logging** - View conversion progress and results in the built-in log
- **Modern UI** - Clean gradient design with smooth animations

## 🔧 Prerequisites

Before using this application, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Pandoc** (must be installed and in your PATH) - [Download here](https://pandoc.org/installing.html)

### Verifying Pandoc Installation

After installing Pandoc, verify it's in your PATH by running:
```bash
pandoc --version
```

If you see version information, you're ready to go!

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ExactDoug/pandoc-converter.git
   cd pandoc-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

## 🚀 Building Executables

Build standalone executables for your platform:

- **Windows:**
  ```bash
  npm run build-win
  ```
  Output: `dist/Pandoc Converter Setup.exe`

- **macOS:**
  ```bash
  npm run build-mac
  ```
  Output: `dist/Pandoc Converter.dmg`

- **Linux:**
  ```bash
  npm run build-linux
  ```
  Output: `dist/Pandoc Converter.AppImage`

## 💡 Usage

1. **Launch the app** - Run `npm start` or launch the built executable
2. **Add files** - Either:
   - Drag & drop DOCX files onto the drop zone
   - Click "Browse Files" to select files
3. **Convert files** - Either:
   - Click individual "Convert" buttons for specific files
   - Click "Convert All Files" for batch conversion
4. **Handle collisions** - If an output file already exists, choose:
   - **Overwrite** - Replace the existing file
   - **Rename** - Add a counter suffix (e.g., `file (1).md`)
   - **Cancel** - Skip this conversion

## 📁 Project Structure

```
pandoc-converter/
├── main.js              # Electron main process & IPC handlers
├── preload.js           # Secure IPC bridge (context isolation)
├── renderer.js          # Frontend logic & UI interactions
├── index.html           # Application UI markup
├── styles.css           # Complete styling & animations
├── package.json         # Project metadata & build config
├── .gitignore          # Git ignore rules
├── icon.png            # App icon (PNG format)
├── icon.ico            # Windows icon
├── icon.icns           # macOS icon
├── README.md           # This file
├── LICENSE             # MIT License
└── CHANGELOG.md        # Version history
```

## 🛠️ Technologies

- **Electron 28.0.0** - Cross-platform desktop framework
- **Pandoc** - Document conversion engine (external dependency)
- **Node.js** - Runtime environment
- **Native Modules** - fs, child_process, path

## 🔒 Security Features

- **Context Isolation** - Renderer process runs in isolated context
- **No Node Integration** - Renderer doesn't have direct Node.js access
- **Content Security Policy** - Strict CSP headers in place
- **Sandboxed Preload** - Controlled IPC communication only

## 🐛 Troubleshooting

### "Pandoc not found in PATH"
- Ensure Pandoc is installed: [pandoc.org/installing.html](https://pandoc.org/installing.html)
- Verify installation: `pandoc --version`
- Restart your terminal/IDE after installation
- On Windows, you may need to restart your computer

### Drag & Drop Not Working
- Ensure you're dropping `.docx` files only
- Try using the "Browse Files" button instead
- Check the browser console (View > Toggle Developer Tools)

### Conversion Fails
- Check that the input file is a valid DOCX document
- Ensure you have write permissions to the output directory
- Check the conversion log for specific error messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## 👤 Author

**ExactDoug**
- GitHub: [@ExactDoug](https://github.com/ExactDoug)

## 🙏 Acknowledgments

- [Pandoc](https://pandoc.org/) - Universal document converter by John MacFarlane
- [Electron](https://www.electronjs.org/) - Framework for building cross-platform desktop apps
