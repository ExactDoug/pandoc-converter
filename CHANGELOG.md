# Changelog

All notable changes to the Pandoc Converter project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-25

### Added
- Initial release of Pandoc Converter
- Drag-and-drop DOCX file support for easy file selection
- Browse for files functionality with multi-selection support
- Individual file conversion with real-time status updates
- Batch conversion - convert all selected files with one click
- Smart file collision handling with user dialog:
  - Overwrite existing files
  - Rename with counter suffix (e.g., `file (1).md`)
  - Cancel/skip conversion
- Pandoc version detection on startup
- Real-time conversion logging with color-coded messages
- Modern gradient UI design with smooth animations
- File sanitization for safe output filenames (converts special characters to underscores)

### Technical
- Built with Electron 28.0.0 framework
- Context isolation for enhanced security
- WebUtils.getPathForFile() for secure drag-and-drop file access
- IPC communication architecture with preload bridge
- Sandboxed renderer process (no direct Node.js access)
- Content Security Policy (CSP) headers for XSS protection
- GitHub Flavored Markdown (GFM) output format via Pandoc

### Security
- Context isolation enabled
- Node integration disabled in renderer
- Sandboxed preload script
- Strict CSP: `default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'`

### Project Structure
- Modular architecture with separated concerns
- Main process (main.js) - 151 lines
- Renderer process (renderer.js) - 291 lines
- Preload bridge (preload.js) - 19 lines
- UI markup (index.html) - 42 lines
- Styling (styles.css) - 387 lines
- Total: 890 lines of code

### Build Configuration
- Windows: NSIS installer (`.exe`)
- macOS: DMG disk image (`.dmg`)
- Linux: AppImage (`.AppImage`)
- Output directory: `dist/`

---

## [Unreleased]

### Planned Features
- Progress bar for large file conversions
- Batch rename patterns
- Output format options (GFM, CommonMark, etc.)
- Custom Pandoc arguments input
- Recent files history
- Settings persistence (remember window size, preferences)
- Dark mode theme toggle

### Known Issues
- None currently reported

---

## Development Notes

### Version 1.0.0 Development Timeline
- **Core functionality:** Drag-and-drop, browse, conversion ✅
- **Security hardening:** Context isolation, CSP ✅
- **File collision handling:** User dialog with 3 options ✅
- **Documentation:** README, LICENSE, CHANGELOG ✅

### Git Repository
- Repository: `https://github.com/ExactDoug/pandoc-converter`
- Branch: `master`
- Commits: 7 total (as of v1.0.0)

---

[1.0.0]: https://github.com/ExactDoug/pandoc-converter/releases/tag/v1.0.0
