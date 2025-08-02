#!/bin/bash

# Word Game CH - Quick Test Script
# This script builds and installs the debug APK for testing

set -e

echo "🧪 Building and installing Word Game CH for testing..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo -e "${RED}❌ Error: adb is not installed or not in PATH${NC}"
    echo -e "${YELLOW}💡 Make sure Android SDK platform-tools are installed and in your PATH${NC}"
    exit 1
fi

# Check for connected devices
DEVICE_COUNT=$(adb devices | grep -v "List of devices" | grep -c "device$" || true)
if [ $DEVICE_COUNT -eq 0 ]; then
    echo -e "${RED}❌ Error: No Android device connected${NC}"
    echo -e "${YELLOW}💡 Connect an Android device with USB debugging enabled, or start an emulator${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found $DEVICE_COUNT connected device(s)${NC}"

# Build debug APK
echo -e "${BLUE}🔨 Building debug APK...${NC}"
cd android
./gradlew assembleDebug
cd ..

# Check if APK was created
DEBUG_APK="android/app/build/outputs/apk/debug/app-debug.apk"
if [ ! -f "$DEBUG_APK" ]; then
    echo -e "${RED}❌ Error: Debug APK not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Debug APK built successfully${NC}"

# Install APK
echo -e "${BLUE}📱 Installing APK on device...${NC}"
adb install -r "$DEBUG_APK"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ APK installed successfully!${NC}"
    echo -e "${BLUE}🎮 You can now test Word Game CH on your device${NC}"
    echo -e "${YELLOW}💡 Look for 'Word Game CH' in your app drawer${NC}"
else
    echo -e "${RED}❌ Failed to install APK${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Testing setup complete!${NC}"