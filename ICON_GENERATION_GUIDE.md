# Icon Generation Guide

## 🎨 New Icon Designs (v2) - Optimized for Small Sizes

**Problem Solved:** The original icon was too detailed and became an unreadable blob at taskbar sizes (16x16, 32x32 px).

**New Approach:** Two simple, bold designs that remain clear and recognizable even at tiny sizes.

### Design 1: Bold "PC" Letters ✅
**File:** `icon-pc-letters.svg` / `icon-pc-letters.png`

- **Style:** Minimalist text-based
- **Visual:** Large white "PC" letters on purple gradient
- **Best for:** Maximum readability, professional look
- **Scales well:** Letters remain clear even at 16x16px

### Design 2: Document Arrow Symbol ✅  
**File:** `icon-document-arrow.svg` / `icon-document-arrow.png`

- **Style:** Visual/symbolic
- **Visual:** Document → Large Arrow → "M" (Markdown)
- **Best for:** Communicates function visually
- **Scales well:** Bold shapes and high contrast

## 🔍 Preview Files Generated

For each design, preview files have been created:
- `*-32.png` - Shows exactly how the icon looks in taskbar
- `*.png` - Full 512x512 version for conversion

**Open these files to choose your preferred design!**

---

## Required Icon Files

The Pandoc Converter app needs the following icon files:

1. **icon.png** (512x512) - Base icon for all platforms
2. **icon.ico** (multi-resolution) - For Windows
3. **icon.icns** (multi-resolution) - For macOS

## Design Specifications

**Theme:** Document conversion (DOCX → Markdown)
**Colors:** Purple gradient (#667eea to #764ba2) - matches app theme
**Style:** Bold, simple shapes optimized for small sizes
**Key Principle:** Must be recognizable at 16x16 pixels

---

## 🚀 Quick Icon Generation (Choose Your Design First!)

### Step 1: Choose Your Design
1. Open `build/icons/icon-pc-letters-32.png` and `build/icons/icon-document-arrow-32.png`
2. See which one you prefer at taskbar size
3. Decide on your favorite

### Step 2: Generate All Required Formats

#### Option A: Using ImageMagick (Recommended - Already Installed)

```bash
# After choosing your design, replace "YOUR-CHOICE" with either:
# - build/icons/icon-pc-letters.png  OR
# - build/icons/icon-document-arrow.png

cd C:\dev\projects\github\pandoc-converter

# Create the main icon.png (copy your choice)
copy build\icons\YOUR-CHOICE.png icon.png

# Generate Windows .ico (multi-resolution)
magick icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico

# Generate macOS .icns (requires additional tools or online converter)
# See Option B for online conversion
```

#### Option B: Online Conversion (For macOS .icns)

1. Go to https://cloudconvert.com/png-to-icns
2. Upload your chosen `icon.png` (512x512)
3. Convert and download `icon.icns`
4. Place in project root

#### Option C: Electron Icon Builder (All-in-One)

```bash
# Install globally (one-time)
npm install -g electron-icon-builder

# Generate all formats from your chosen PNG
electron-icon-builder --input=./icon.png --output=./
```

This creates:
- `icon.ico` (Windows - all sizes)
- `icon.icns` (macOS - all sizes)
- `icon.png` (optimized if needed)

---

## 📁 File Organization

Following standard Electron project structure:
```
pandoc-converter/
├── build/                  # Build assets (standard location)
│   └── icons/             # Icon source files
│       ├── icon-pc-letters.svg
│       ├── icon-pc-letters.png
│       ├── icon-pc-letters-32.png
│       ├── icon-document-arrow.svg
│       ├── icon-document-arrow.png
│       ├── icon-document-arrow-32.png
│       └── icon-source.svg (original)
├── icon.png               # Production icon (root)
├── icon.ico               # Windows icon (root)
└── icon.icns              # macOS icon (root)
```

**Standard Practice:** Keep source/design files in `build/icons/`, production files in root.

## 📋 Implementation Checklist

### Current Status:
- [x] Design 1 created: `build/icons/icon-pc-letters.*`
- [x] Design 2 created: `build/icons/icon-document-arrow.*`
- [x] 32px previews generated for both
- [x] Files organized in standard structure
- [ ] **Choose preferred design**
- [ ] Copy chosen design to `icon.png`
- [ ] Generate `icon.ico` (Windows)
- [ ] Generate `icon.icns` (macOS)
- [ ] Test app with new icons: `npm start`
- [ ] Verify icons in taskbar/dock
- [ ] Test builds (optional): `npm run build-win`

---

## References in Code

- `main.js:19` - `icon: path.join(__dirname, 'icon.png')`
- `package.json:30` - Windows build: `"icon": "icon.ico"`
- `package.json:34` - macOS build: `"icon": "icon.icns"`
- `package.json:38` - Linux build: `"icon": "icon.png"`

---

## 🎯 Next Steps

1. **Open the 32px preview files** to compare designs at actual taskbar size
2. **Choose your favorite design**
3. **Run the generation commands** to create icon.ico and icon.icns
4. **Test the app** to see your new icon in action!

---

## Original Design Archive

The original detailed icon (`icon-source.svg`) has been preserved but is not recommended due to poor readability at small sizes. The new designs prioritize clarity and recognition at all scales.
