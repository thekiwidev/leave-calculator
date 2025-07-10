# Icon Generation Guide

For a proper PWA, you should replace the default Vite SVG with proper app icons.

## Recommended Icon Sizes:

- 192x192 PNG (required for PWA)
- 512x512 PNG (required for PWA)
- Apple touch icon (180x180 PNG)
- Favicon (32x32 PNG)
- Favicon ICO file

## Tools for Icon Generation:

1. **PWA Builder** (Microsoft): https://www.pwabuilder.com/imageGenerator
2. **Favicon.io**: https://favicon.io/
3. **RealFaviconGenerator**: https://realfavicongenerator.net/

## Instructions:

1. Create or design a calculator icon (perhaps a calculator with a calendar)
2. Use any of the above tools to generate all required sizes
3. Replace the files in the `public/` directory
4. Update the icon paths in `vite.config.ts` manifest section

## Current Icon Setup:

The current setup uses `vite.svg` as a placeholder. For production, replace with:

- `public/icon-192.png`
- `public/icon-512.png`
- `public/apple-touch-icon.png`
- `public/favicon.ico`
