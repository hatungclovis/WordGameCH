#!/bin/bash

# Simple EAS APK Build - Alternative to AAB
# APKs are easier to build and also accepted by Play Store

echo "📱 Simple APK Build via EAS Cloud"
echo "================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Building APK instead of AAB (often more reliable)${NC}"
echo -e "${YELLOW}✅ APK files are accepted by Google Play Store${NC}"
echo -e "${YELLOW}✅ Easier build process${NC}"
echo -e "${YELLOW}✅ Same final result${NC}"
echo ""

# Update eas.json for APK build
echo -e "${BLUE}Updating EAS configuration for APK...${NC}"

cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
EOF

echo -e "${GREEN}✅ EAS configuration updated for APK build${NC}"

# Clear any build cache
echo -e "${BLUE}Clearing build cache...${NC}"
npm cache clean --force

# Build APK
echo -e "${BLUE}Starting APK build in the cloud...${NC}"
echo -e "${YELLOW}This should be more reliable than AAB build${NC}"

npx eas build --platform android --profile preview --clear-cache

BUILD_RESULT=$?

if [ $BUILD_RESULT -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 APK BUILD STARTED!${NC}"
    echo ""
    echo -e "${BLUE}📱 What you'll get:${NC}"
    echo -e "${YELLOW}• .apk file ready for Play Store${NC}"
    echo -e "${YELLOW}• Google Play accepts APK files${NC}"
    echo -e "${YELLOW}• Same app, different format${NC}"
    echo ""
    echo -e "${BLUE}⏱  Build time: 10-15 minutes${NC}"
    echo -e "${BLUE}🔗 Track at: https://expo.dev${NC}"
    
else
    echo ""
    echo -e "${RED}❌ APK build also failed${NC}"
    echo ""
    echo -e "${YELLOW}🆘 Let's try the most basic approach:${NC}"
    echo ""
    echo -e "${BLUE}Option 1: Try without cache clearing${NC}"
    echo -e "${YELLOW}npx eas build --platform android --profile preview${NC}"
    echo ""
    echo -e "${BLUE}Option 2: Build locally with simplified config${NC}"
    echo -e "${YELLOW}We can create a minimal Android build${NC}"
    echo ""
    echo -e "${BLUE}Option 3: Use different build service${NC}"
    echo -e "${YELLOW}Try Bitrise, GitHub Actions, or Codemagic${NC}"
fi

echo ""
echo -e "${GREEN}📱 APK build attempt completed!${NC}"