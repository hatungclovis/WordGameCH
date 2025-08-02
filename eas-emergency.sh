#!/bin/bash

# Emergency EAS Build - Cloud Build Solution
# This builds your app in the cloud, avoiding all local Java issues

echo "☁️  Emergency EAS Build - Cloud Solution..."
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}This will build your app in Expo's cloud, avoiding Java issues${NC}"
echo ""

# Check if user wants to proceed
read -p "Continue with EAS cloud build? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Build cancelled."
    exit 1
fi

# Step 1: Install EAS CLI
echo -e "${BLUE}Step 1: Installing EAS CLI...${NC}"
npm install -g @expo/cli@latest

# Step 2: Login to Expo
echo -e "${BLUE}Step 2: Login to Expo account...${NC}"
echo -e "${YELLOW}If you don't have an Expo account, create one at https://expo.dev${NC}"
npx expo login

# Step 3: Configure EAS
echo -e "${BLUE}Step 3: Configuring EAS build...${NC}"

# Create eas.json if it doesn't exist
cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOF

echo -e "${GREEN}✅ EAS configuration created${NC}"

# Step 4: Build for production
echo -e "${BLUE}Step 4: Starting cloud build (this may take 10-20 minutes)...${NC}"
echo -e "${YELLOW}☁️  Your app will be built on Expo's servers${NC}"
echo -e "${YELLOW}📱 You'll get a download link when it's ready${NC}"

npx eas build --platform android --profile production

BUILD_RESULT=$?

if [ $BUILD_RESULT -eq 0 ]; then
    echo -e "${GREEN}🎉 EAS BUILD SUCCESSFUL!${NC}"
    echo ""
    echo -e "${GREEN}✅ Your AAB file has been built in the cloud${NC}"
    echo -e "${GREEN}📥 Download link provided above${NC}"
    echo -e "${GREEN}🚀 Ready for Google Play Store upload${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "${BLUE}1. Download the AAB file from the link${NC}"
    echo -e "${BLUE}2. Upload to Google Play Console${NC}"
    echo -e "${BLUE}3. Complete your store listing${NC}"
    
else
    echo -e "${RED}❌ EAS build failed${NC}"
    echo -e "${YELLOW}💡 Try building APK instead of AAB:${NC}"
    echo "npx eas build --platform android --profile preview"
fi

echo ""
echo -e "${GREEN}☁️  EAS Build completed!${NC}"