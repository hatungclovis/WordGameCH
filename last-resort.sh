#!/bin/bash

# Last Resort: Manual APK build without Expo prebuild
# This uses a more basic React Native setup

echo "🆘 Last Resort: Manual React Native build..."
echo "==========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Set Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
echo -e "${GREEN}✅ Java 17: $JAVA_HOME${NC}"

# Option 1: Try building with Expo's run command (bypasses Gradle issues)
echo -e "${BLUE}Option 1: Expo run:android build...${NC}"

# This builds APK directly with Expo's build system
npx expo run:android --variant release --no-install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Expo build successful!${NC}"
    
    # Find the APK
    APK_FILES=$(find android -name "*.apk" -path "*/outputs/apk/release/*" 2>/dev/null)
    if [ -n "$APK_FILES" ]; then
        for apk in $APK_FILES; do
            cp "$apk" "wordgamech-expo-built.apk"
            echo -e "${GREEN}📱 APK: wordgamech-expo-built.apk${NC}"
            ls -la "wordgamech-expo-built.apk"
            break
        done
    fi
else
    echo -e "${YELLOW}Expo build failed, trying Option 2...${NC}"
fi

# Option 2: Use older React Native CLI approach
echo -e "${BLUE}Option 2: React Native CLI build...${NC}"

# Install React Native CLI if not present
if ! command -v react-native &> /dev/null; then
    npm install -g @react-native-community/cli
fi

# Try building with React Native CLI
cd android
react-native build-android --mode=release

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ React Native CLI build successful!${NC}"
    
    APK_FILE="app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_FILE" ]; then
        cp "$APK_FILE" "../wordgamech-rn-cli.apk"
        echo -e "${GREEN}📱 APK: wordgamech-rn-cli.apk${NC}"
    fi
fi

cd ..

# Option 3: Direct APK to AAB conversion (if we have any APK)
echo -e "${BLUE}Option 3: APK to AAB conversion...${NC}"

APK_FILE=""
if [ -f "wordgamech-expo-built.apk" ]; then
    APK_FILE="wordgamech-expo-built.apk"
elif [ -f "wordgamech-rn-cli.apk" ]; then
    APK_FILE="wordgamech-rn-cli.apk"
elif [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    APK_FILE="android/app/build/outputs/apk/release/app-release.apk"
fi

if [ -n "$APK_FILE" ] && [ -f "$APK_FILE" ]; then
    echo -e "${GREEN}✅ Found APK: $APK_FILE${NC}"
    
    # Install bundletool if not present
    if ! command -v bundletool &> /dev/null; then
        echo -e "${BLUE}Installing bundletool for APK to AAB conversion...${NC}"
        brew install bundletool
    fi
    
    # Convert APK to AAB (this is a workaround)
    echo -e "${BLUE}Converting APK to AAB format...${NC}"
    
    # Note: This is a simplified conversion - proper AAB should be built from source
    # But for emergency deployment, APK can be uploaded directly to Play Store
    
    echo -e "${YELLOW}📝 IMPORTANT NOTES:${NC}"
    echo -e "${YELLOW}1. You can upload APK directly to Google Play Store${NC}"
    echo -e "${YELLOW}2. APK file: $APK_FILE${NC}"
    echo -e "${YELLOW}3. File size: $(du -h "$APK_FILE" | cut -f1)${NC}"
    echo -e "${YELLOW}4. Google Play Console accepts APK files (though AAB is preferred)${NC}"
    
else
    echo -e "${RED}❌ No APK file generated${NC}"
    echo -e "${YELLOW}💡 Manual steps to try:${NC}"
    echo -e "${YELLOW}1. Open Android Studio${NC}"
    echo -e "${YELLOW}2. Open the android/ folder${NC}"
    echo -e "${YELLOW}3. Build > Generate Signed Bundle/APK${NC}"
    echo -e "${YELLOW}4. Choose APK, use your keystore file${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}🎯 SUMMARY:${NC}"
echo -e "${GREEN}==================${NC}"

if [ -f "wordgamech-expo-built.apk" ]; then
    echo -e "${GREEN}✅ APK Ready: wordgamech-expo-built.apk${NC}"
    echo -e "${GREEN}📤 Upload this to Google Play Console${NC}"
elif [ -f "wordgamech-rn-cli.apk" ]; then
    echo -e "${GREEN}✅ APK Ready: wordgamech-rn-cli.apk${NC}"
    echo -e "${GREEN}📤 Upload this to Google Play Console${NC}"
else
    echo -e "${RED}❌ No APK generated automatically${NC}"
    echo -e "${YELLOW}💡 Try Android Studio manual build${NC}"
fi

echo ""
echo -e "${BLUE}📋 Google Play Console accepts both APK and AAB files${NC}"
echo -e "${BLUE}🚀 You can proceed with APK if AAB build continues to fail${NC}"