# HTML to Image Converter

A modern web application for converting HTML and CSS code to PNG or JPG images. Perfect for converting banners and designs for social media posts.

## Features

- ✅ Convert HTML/CSS code to PNG or JPG images
- ✅ Fixed canvas size: 1080 × 1350px (4:5 aspect ratio, portrait)
- ✅ Full support for modern CSS (Flexbox, Grid, animations, etc.)
- ✅ High-quality image output (2x device pixel ratio)
- ✅ Simple, clean interface
- ✅ Perfect for local development

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code
- **TailwindCSS** - Modern styling
- **Puppeteer** - Headless Chrome browser for rendering HTML/CSS with full CSS support

## Why Puppeteer?

Puppeteer uses a real Chrome browser engine, which means it supports:
- All modern CSS features (Grid, Flexbox, Custom Properties, etc.)
- CSS animations and transitions
- External fonts and resources
- Complex layouts and styling
- Media queries
- And much more!

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Paste your HTML and CSS code into the textarea (you can include inline styles or `<style>` tags)
2. Click "Export as PNG" or "Export as JPG"
3. Your image will download automatically

## Example HTML/CSS Code

```html
<div style="width: 800px; height: 400px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; border-radius: 20px;">
  <h1 style="color: white; font-size: 48px; font-family: Arial, sans-serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
    Hello World!
  </h1>
</div>
```

## Notes

- The converter uses a fixed canvas size of **1080 × 1350 pixels** (4:5 portrait aspect ratio)
- Design your HTML/CSS code for this exact size for best results
- External resources (images, fonts) will be loaded if accessible
- The output uses 2x pixel ratio for high-quality images
- **Designed for local use** - Requires Chrome/Chromium to be installed

## Production Build

```bash
npm run build
npm start
```

## License

MIT
