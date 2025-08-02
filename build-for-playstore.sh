#!/bin/bash

# Word Game CH - Android Build Script for Google Play Store
# This script builds a signed AAB for Google Play Store deployment

set -e

echo "🎮 Building Word Game CH for Android Play Store..."
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

echo -e "${BLUE}📍 Project root: $PROJECT_ROOT${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Make sure you're in the project root directory.${NC}"
    exit 1
fi

# Check if Android directory exists
if [ ! -d "android" ]; then
    echo -e "${RED}❌ Error: android directory not found. Run 'npx expo prebuild' first.${NC}"
    exit 1
fi

# Check if keystore exists
if [ ! -f "android/app/wordgamech-upload-key.keystore" ]; then
    echo -e "${RED}❌ Error: Keystore file not found at android/app/wordgamech-upload-key.keystore${NC}"
    echo -e "${YELLOW}💡 Make sure your keystore file is in the correct location.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed or not in PATH${NC}"
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Error: Java is not installed or not in PATH${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-flight checks passed${NC}"
echo ""

# Step 1: Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Clean previous builds
echo -e "${BLUE}🧹 Cleaning previous builds...${NC}"
cd android
./gradlew clean
cd ..
echo -e "${GREEN}✅ Clean completed${NC}"
echo ""

# Step 3: Build the release AAB
echo -e "${BLUE}🔨 Building release AAB...${NC}"
cd android
./gradlew bundleRelease
BUILD_EXIT_CODE=$?
cd ..

if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}❌ Build failed with exit code $BUILD_EXIT_CODE${NC}"
    exit $BUILD_EXIT_CODE
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""

# Step 4: Check build outputs
AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"
if [ -f "$AAB_PATH" ]; then
    AAB_SIZE=$(du -h "$AAB_PATH" | cut -f1)
    echo -e "${GREEN}🎉 Success! Your AAB file is ready:${NC}"
    echo -e "${BLUE}📁 Location: $AAB_PATH${NC}"
    echo -e "${BLUE}📏 Size: $AAB_SIZE${NC}"
    echo ""
    
    # Show file info
    echo -e "${BLUE}📋 File details:${NC}"
    ls -la "$AAB_PATH"
    echo ""
    
    echo -e "${GREEN}🚀 Next steps:${NC}"
    echo -e "${YELLOW}1. Upload the AAB file to Google Play Console${NC}"
    echo -e "${YELLOW}2. Complete your store listing (screenshots, description, etc.)${NC}"
    echo -e "${YELLOW}3. Submit for review${NC}"
    echo ""
    echo -e "${GREEN}🎮 Your Word Game CH is ready for the Play Store!${NC}"
else
    echo -e "${RED}❌ Error: AAB file not found at expected location${NC}"
    echo -e "${YELLOW}💡 Check the build logs above for errors${NC}"
    exit 1
fi

# Optional: Also build APK for testing
echo -e "${BLUE}🔧 Building APK for testing (optional)...${NC}"
cd android
./gradlew assembleRelease
cd ..

APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo -e "${GREEN}✅ Test APK also created:${NC}"
    echo -e "${BLUE}📁 Location: $APK_PATH${NC}"
    echo -e "${BLUE}📏 Size: $APK_SIZE${NC}"
    echo ""
    echo -e "${YELLOW}💡 You can install this APK for testing: adb install $APK_PATH${NC}"
fi

echo ""
echo -e "${GREEN}🎉 All done! Your Word Game CH is ready for deployment!${NC}"