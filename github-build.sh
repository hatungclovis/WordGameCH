#!/bin/bash

# GitHub Actions Build Setup
# This builds your app on GitHub's servers, often works when local builds fail

echo "🐙 GitHub Actions Build - Build in the Cloud"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}This will build your app on GitHub's servers${NC}"
echo -e "${YELLOW}✅ No local Java/Node issues${NC}"
echo -e "${YELLOW}✅ Professional build environment${NC}"
echo -e "${YELLOW}✅ Free with GitHub account${NC}"
echo ""

# Step 1: Create GitHub workflow
echo -e "${BLUE}Step 1: Creating GitHub Actions workflow...${NC}"

mkdir -p .github/workflows

cat > .github/workflows/build-android.yml << 'EOF'
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Setup JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Setup Expo
      uses: expo/expo-github-action@v8
      with:
        expo-version: latest
        token: ${{ secrets.EXPO_TOKEN }}
        
    - name: Generate Android project
      run: npx expo prebuild --platform android --clear
      
    - name: Build Android APK
      run: |
        cd android
        chmod +x gradlew
        ./gradlew assembleRelease
        
    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: word-game-ch-apk
        path: android/app/build/outputs/apk/release/app-release.apk
        retention-days: 30
EOF

echo -e "${GREEN}✅ GitHub Actions workflow created${NC}"

# Step 2: Create .gitignore if needed
if [ ! -f ".gitignore" ]; then
    echo -e "${BLUE}Step 2: Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Expo
.expo/
dist/
web-build/

# Native
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

# Android
android/app/build/
android/build/
android/.gradle/
android/local.properties

# iOS
ios/build/
ios/Pods/
ios/*.xcworkspace/xcuserdata
ios/*.xcodeproj/xcuserdata
ios/*.xcodeproj/project.xcworkspace/xcuserdata
EOF
    echo -e "${GREEN}✅ .gitignore created${NC}"
fi

# Step 3: Initialize git if needed
if [ ! -d ".git" ]; then
    echo -e "${BLUE}Step 3: Initializing git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Word Game CH ready for deployment"
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${BLUE}Step 3: Adding files to git...${NC}"
    git add .
    git commit -m "Add GitHub Actions build workflow"
    echo -e "${GREEN}✅ Files committed${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Next Steps:${NC}"
echo -e "${GREEN}===============${NC}"
echo ""
echo -e "${BLUE}1. Create GitHub repository:${NC}"
echo -e "${YELLOW}   • Go to https://github.com/new${NC}"
echo -e "${YELLOW}   • Name: wordgamech${NC}"
echo -e "${YELLOW}   • Make it public or private${NC}"
echo -e "${YELLOW}   • Create repository${NC}"
echo ""
echo -e "${BLUE}2. Push your code:${NC}"
echo -e "${YELLOW}   git remote add origin https://github.com/YOURUSERNAME/wordgamech.git${NC}"
echo -e "${YELLOW}   git branch -M main${NC}"
echo -e "${YELLOW}   git push -u origin main${NC}"
echo ""
echo -e "${BLUE}3. Watch the build:${NC}"
echo -e "${YELLOW}   • Go to your repo on GitHub${NC}"
echo -e "${YELLOW}   • Click 'Actions' tab${NC}"
echo -e "${YELLOW}   • Watch 'Build Android APK' workflow${NC}"
echo ""
echo -e "${BLUE}4. Download APK when done:${NC}"
echo -e "${YELLOW}   • Build completes in ~10 minutes${NC}"
echo -e "${YELLOW}   • Download artifact 'word-game-ch-apk'${NC}"
echo -e "${YELLOW}   • Upload to Google Play Store${NC}"

echo ""
echo -e "${GREEN}💡 Why GitHub Actions often works:${NC}"
echo -e "${GREEN}• Clean Ubuntu environment${NC}"
echo -e "${GREEN}• Proper Java/Node setup${NC}"
echo -e "${GREEN}• No local conflicts${NC}"
echo -e "${GREEN}• Professional CI/CD pipeline${NC}"

echo ""
echo -e "${GREEN}🎯 Ready to push to GitHub? This usually works! 🚀${NC}"