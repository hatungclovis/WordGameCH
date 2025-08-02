#!/bin/bash

# Fix EAS Build npm Error
# This resolves common npm issues before building

echo "🔧 Fixing npm issues for EAS build..."
echo "===================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Check the error log
echo -e "${BLUE}Step 1: Checking npm error log...${NC}"
if [ -f "/Users/emci/.npm/_logs/2025-08-02T03_55_35_041Z-debug-0.log" ]; then
    echo -e "${YELLOW}Last few lines of npm error:${NC}"
    tail -20 "/Users/emci/.npm/_logs/2025-08-02T03_55_35_041Z-debug-0.log"
    echo ""
fi

# Step 2: Clear npm cache and reinstall
echo -e "${BLUE}Step 2: Clearing npm cache and reinstalling...${NC}"
npm cache clean --force
rm -rf node_modules/
rm -f package-lock.json

echo -e "${GREEN}✅ Cache cleared${NC}"

# Step 3: Reinstall with fresh dependencies
echo -e "${BLUE}Step 3: Fresh npm install...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed, trying with --legacy-peer-deps${NC}"
    npm install --legacy-peer-deps
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 4: Update Expo CLI to latest
echo -e "${BLUE}Step 4: Updating Expo CLI...${NC}"
npm install -g @expo/cli@latest

# Step 5: Verify Expo setup
echo -e "${BLUE}Step 5: Verifying Expo setup...${NC}"
npx expo --version
npx expo whoami

# Step 6: Try EAS build again
echo -e "${BLUE}Step 6: Attempting EAS build again...${NC}"
echo -e "${YELLOW}Building Word Game CH in the cloud...${NC}"

npx eas build --platform android --profile production --clear-cache

BUILD_RESULT=$?

if [ $BUILD_RESULT -eq 0 ]; then
    echo -e "${GREEN}🎉 EAS BUILD STARTED SUCCESSFULLY!${NC}"
    echo ""
    echo -e "${BLUE}Your build is now running in Expo's cloud servers${NC}"
    echo -e "${YELLOW}⏱  Expected time: 10-20 minutes${NC}"
    echo -e "${YELLOW}📧 You'll receive email updates${NC}"
    echo -e "${YELLOW}🔗 Track progress: https://expo.dev${NC}"
    
else
    echo -e "${RED}❌ EAS build still failing${NC}"
    echo ""
    echo -e "${YELLOW}🆘 Alternative: Try building APK instead of AAB${NC}"
    echo -e "${BLUE}Run this command:${NC}"
    echo -e "${YELLOW}npx eas build --platform android --profile preview${NC}"
    echo ""
    echo -e "${YELLOW}💡 Or we can try a different approach:${NC}"
    echo -e "${BLUE}1. Manual Android Studio build${NC}"
    echo -e "${BLUE}2. Use React Native CLI${NC}"
    echo -e "${BLUE}3. GitHub Actions build${NC}"
fi

echo ""
echo -e "${GREEN}🔧 npm fix completed!${NC}"