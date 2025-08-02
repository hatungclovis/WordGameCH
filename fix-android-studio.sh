#!/bin/bash

# Fix Android Studio Node.js Path Issues
# This script configures Android Studio to find Node.js correctly

echo "🔧 Fixing Android Studio Node.js PATH issues..."
echo "=============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Find Node.js location
echo -e "${BLUE}Step 1: Locating Node.js...${NC}"

NODE_PATH=$(which node)
NPM_PATH=$(which npm)

if [ -z "$NODE_PATH" ]; then
    echo -e "${RED}❌ Node.js not found in PATH${NC}"
    echo -e "${YELLOW}Installing Node.js via Homebrew...${NC}"
    brew install node
    NODE_PATH=$(which node)
    NPM_PATH=$(which npm)
fi

echo -e "${GREEN}✅ Node.js found at: $NODE_PATH${NC}"
echo -e "${GREEN}✅ npm found at: $NPM_PATH${NC}"

# Step 2: Create local.properties with correct paths
echo -e "${BLUE}Step 2: Configuring Android Studio paths...${NC}"

cd android

# Create/update local.properties
cat > local.properties << EOF
# Node.js configuration for Android Studio
nodejs.dir=$NODE_PATH
npm.dir=$NPM_PATH

# SDK paths
sdk.dir=$ANDROID_HOME
ndk.dir=$ANDROID_HOME/ndk/26.1.10909125
EOF

echo -e "${GREEN}✅ local.properties updated${NC}"

# Step 3: Update gradle.properties with Node paths
echo -e "${BLUE}Step 3: Adding Node.js paths to gradle.properties...${NC}"

# Add Node.js paths to gradle.properties
cat >> gradle.properties << EOF

# Node.js paths for build
org.gradle.project.nodejs.dir=$NODE_PATH
org.gradle.project.npm.dir=$NPM_PATH
EOF

echo -e "${GREEN}✅ gradle.properties updated${NC}"

# Step 4: Create wrapper script for Node.js
echo -e "${BLUE}Step 4: Creating Node.js wrapper...${NC}"

mkdir -p app/src/main/assets

# Create a simple node wrapper script
cat > node-wrapper.sh << EOF
#!/bin/bash
export PATH="/opt/homebrew/bin:/usr/local/bin:\$PATH"
$NODE_PATH "\$@"
EOF

chmod +x node-wrapper.sh

echo -e "${GREEN}✅ Node wrapper created${NC}"

cd ..

# Step 5: Instructions for Android Studio
echo ""
echo -e "${YELLOW}📋 Android Studio Configuration Steps:${NC}"
echo -e "${YELLOW}======================================${NC}"
echo ""
echo -e "${BLUE}1. Close Android Studio completely${NC}"
echo ""
echo -e "${BLUE}2. Reopen Android Studio and open the android/ folder${NC}"
echo ""
echo -e "${BLUE}3. Go to File > Settings (or Android Studio > Preferences on Mac)${NC}"
echo ""
echo -e "${BLUE}4. Navigate to: Build, Execution, Deployment > Build Tools > Gradle${NC}"
echo ""
echo -e "${BLUE}5. Set 'Gradle JDK' to Java 17:${NC}"
echo -e "${YELLOW}   $(/usr/libexec/java_home -v 17)${NC}"
echo ""
echo -e "${BLUE}6. Apply and OK${NC}"
echo ""
echo -e "${BLUE}7. Try building again: Build > Clean Project, then Build > Rebuild Project${NC}"

echo ""
echo -e "${GREEN}🎯 Alternative: Use Terminal Build from Android Studio${NC}"
echo -e "${GREEN}====================================================${NC}"
echo ""
echo -e "${BLUE}In Android Studio terminal (bottom panel):${NC}"
echo -e "${YELLOW}export PATH=\"/opt/homebrew/bin:/usr/local/bin:\$PATH\"${NC}"
echo -e "${YELLOW}export JAVA_HOME=\$(/usr/libexec/java_home -v 17)${NC}"
echo -e "${YELLOW}./gradlew clean${NC}"
echo -e "${YELLOW}./gradlew bundleRelease${NC}"

echo ""
echo -e "${GREEN}🔧 Configuration completed!${NC}"