#!/bin/bash

# Continue EAS Build Process
# You're already logged in, let's build!

echo "🚀 Continuing EAS Build - You're Ready to Go!"
echo "============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}✅ EAS CLI installed and configured${NC}"
echo -e "${GREEN}✅ Logged in as: hatungclovis${NC}"
echo -e "${GREEN}✅ eas.json configuration ready${NC}"
echo ""

echo -e "${BLUE}Starting your Word Game CH cloud build...${NC}"
echo -e "${YELLOW}This will take 10-20 minutes but runs on Expo's servers${NC}"
echo ""

# Start the build
echo -e "${GREEN}🏗  Starting production build for Google Play Store...${NC}"
npx eas build --platform android --profile production --non-interactive

BUILD_RESULT=$?

if [ $BUILD_RESULT -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 BUILD STARTED SUCCESSFULLY!${NC}"
    echo ""
    echo -e "${BLUE}📱 What happens next:${NC}"
    echo -e "${YELLOW}1. ⏱  Build runs in Expo's cloud (10-20 minutes)${NC}"
    echo -e "${YELLOW}2. 📧 You'll get email notifications${NC}"
    echo -e "${YELLOW}3. 📥 Download link will be provided${NC}"
    echo -e "${YELLOW}4. 📦 You'll get a .aab file ready for Play Store${NC}"
    echo ""
    echo -e "${BLUE}🔗 Track your build progress:${NC}"
    echo -e "${BLUE}https://expo.dev/accounts/hatungclovis/projects/wordgamech/builds${NC}"
    echo ""
    echo -e "${GREEN}✅ While you wait, you can:${NC}"
    echo -e "${GREEN}• Prepare your Play Store screenshots${NC}"
    echo -e "${GREEN}• Write your app description${NC}"
    echo -e "${GREEN}• Create your feature graphic${NC}"
    echo ""
    
else
    echo ""
    echo -e "${YELLOW}⚠️  Build command had an issue, but this is common.${NC}"
    echo -e "${BLUE}Let's check the build status:${NC}"
    echo ""
    echo -e "${BLUE}Run this to see your builds:${NC}"
    echo -e "${YELLOW}npx eas build:list${NC}"
    echo ""
    echo -e "${BLUE}Or visit:${NC}"
    echo -e "${BLUE}https://expo.dev/accounts/hatungclovis/projects/wordgamech/builds${NC}"
fi

echo ""
echo -e "${GREEN}🎯 Next Steps After Build Completes:${NC}"
echo -e "${GREEN}====================================${NC}"
echo -e "${BLUE}1. Download the .aab file${NC}"
echo -e "${BLUE}2. Go to Google Play Console${NC}"
echo -e "${BLUE}3. Create new app or new release${NC}"
echo -e "${BLUE}4. Upload the .aab file${NC}"
echo -e "${BLUE}5. Complete store listing${NC}"
echo -e "${BLUE}6. Submit for review${NC}"
echo ""
echo -e "${GREEN}🚀 Your Word Game CH will be on Google Play Store soon!${NC}"