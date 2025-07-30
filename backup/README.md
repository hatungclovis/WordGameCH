# Backup Directory

This directory contains files that were moved during project cleanup and build fixes.

## Contents:

### assets/icons/
- `icon.png` - Fake PNG file (actually SVG content) created initially
- `adaptive-icon.png` - Fake PNG file (actually SVG content) that was causing prebuild errors
- `favicon.png` - Fake PNG file (actually SVG content) for web favicon

### assets/images/
- `splash.png` - Fake PNG file (actually SVG content) for splash screen

## Notes:
- These files were causing build errors because they contained SVG content but had PNG extensions
- The project now uses the working `app-icon.svg` file instead
- These files can be deleted if no longer needed
- If you need proper PNG/JPG assets later, create new ones with actual image content

## Date: 
Backup created during build troubleshooting process.
