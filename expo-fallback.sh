#!/bin/bash

# Fallback Solution: Use Expo Build Service (Local)
# This bypasses Gradle Java version issues entirely

echo "🔄 Fallback Solution: Using Expo's local build system..."
echo "====================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}This approach uses Expo's build tools instead of direct Gradle${NC}"
echo ""

# Step 1: Ensure Expo CLI is up to date
echo -e "${BLUE}Step 1: Updating Expo CLI...${NC}"
npm install -g @expo/cli@latest

# Step 2: Use Expo's local build command
echo -e "${BLUE}Step 2: Building with Expo local build...${NC}"
npx expo run:android --variant release

BUILD_RESULT=$?

if [ $BUILD_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Expo build successful!${NC}"
    
    # Find the generated APK
    APK_PATH=$(find android -name "*.apk" -path "*/outputs/apk/release/*" | head -1)
    
    if [ -n "$APK_PATH" ] && [ -f "$APK_PATH" ]; then
        cp "$APK_PATH" "wordgamech-expo-build.apk"
        echo -e "${GREEN}📱 APK created: wordgamech-expo-build.apk${NC}"
        
        # Try to generate AAB from the built project
        echo -e "${BLUE}Attempting to generate AAB from Expo build...${NC}"
        cd android
        ./gradlew bundleRelease
        
        if [ $? -eq 0 ] && [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
            cp "app/build/outputs/bundle/release/app-release.aab" "../wordgamech-expo.aab"
            echo -e "${GREEN}📦 AAB created: wordgamech-expo.aab${NC}"
        fi
        cd ..
    fi
else
    echo -e "${RED}❌ Expo build also failed${NC}"
    echo -e "${YELLOW}💡 Last resort: Manual APK to AAB conversion${NC}"
    
    # Check if there's any APK we can work with
    APK_FILES=$(find . -name "*.apk" -type f 2>/dev/null)
    if [ -n "$APK_FILES" ]; then
        echo -e "${BLUE}Found existing APK files:${NC}"
        echo "$APK_FILES"
        echo -e "${YELLOW}You can upload APK directly to Play Store (though AAB is preferred)${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎯 Summary of available files:${NC}"
ls -la *.aab *.apk 2>/dev/null || echo "No build files found"

echo ""
echo -e "${YELLOW}💡 If you have an APK, you can:${NC}"
echo -e "${YELLOW}1. Upload APK directly to Play Store (works but not optimal)${NC}"
echo -e "${YELLOW}2. Use Android Studio to convert APK to AAB${NC}"
echo -e "${YELLOW}3. Use bundletool: bundletool build-bundle --modules=app.apk --output=app.aab${NC}"