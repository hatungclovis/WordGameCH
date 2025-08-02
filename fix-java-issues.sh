#!/bin/bash

# Fix Java Version Issues for Word Game CH Android Build

echo "🔧 Fixing Java version compatibility issues..."
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check current Java version
echo -e "${BLUE}📋 Current Java setup:${NC}"
java -version
echo ""

# Check JAVA_HOME
if [ -n "$JAVA_HOME" ]; then
    echo -e "${BLUE}📁 JAVA_HOME: $JAVA_HOME${NC}"
else
    echo -e "${RED}❌ JAVA_HOME not set${NC}"
fi

echo ""
echo -e "${YELLOW}🔍 The issue: Gradle needs Java 17, but may be finding a different version${NC}"
echo ""

# Check for Java installations on macOS
echo -e "${BLUE}📋 Available Java installations:${NC}"
if command -v /usr/libexec/java_home &> /dev/null; then
    /usr/libexec/java_home -V 2>&1 | head -10
    echo ""
fi

# Solution 1: Install Java 17 if not present
echo -e "${BLUE}🛠  Solution 1: Install Java 17 (recommended)${NC}"
echo "If you don't have Java 17, install it with:"
echo "brew install --cask zulu17"
echo ""

# Solution 2: Set JAVA_HOME to Java 17
echo -e "${BLUE}🛠  Solution 2: Set JAVA_HOME to Java 17${NC}"
if /usr/libexec/java_home -v 17 &> /dev/null; then
    JAVA_17_HOME=$(/usr/libexec/java_home -v 17)
    echo -e "${GREEN}✅ Java 17 found at: $JAVA_17_HOME${NC}"
    echo ""
    echo "Setting JAVA_HOME for this session..."
    export JAVA_HOME="$JAVA_17_HOME"
    echo -e "${GREEN}✅ JAVA_HOME set to: $JAVA_HOME${NC}"
    
    # Add to shell profile for permanent fix
    echo ""
    echo -e "${YELLOW}💡 To make this permanent, add this to your ~/.zshrc or ~/.bash_profile:${NC}"
    echo "export JAVA_HOME=\"$JAVA_17_HOME\""
    echo "export PATH=\"\$JAVA_HOME/bin:\$PATH\""
    
    # Verify
    echo ""
    echo -e "${BLUE}🔍 Verification:${NC}"
    java -version
    
else
    echo -e "${RED}❌ Java 17 not found. Please install it first:${NC}"
    echo "brew install --cask zulu17"
    echo ""
    echo "Alternative Java 17 installation methods:"
    echo "1. Download from: https://www.azul.com/downloads/?package=jdk"
    echo "2. Or use: brew install openjdk@17"
fi

echo ""
echo -e "${BLUE}🛠  Solution 3: Clean and retry build${NC}"
echo "After fixing Java version, clean and rebuild:"
echo "cd android && ./gradlew clean && ./gradlew bundleRelease"

echo ""
echo -e "${GREEN}🎯 Quick Fix Commands:${NC}"
echo -e "${YELLOW}# Install Java 17${NC}"
echo "brew install --cask zulu17"
echo ""
echo -e "${YELLOW}# Set JAVA_HOME and rebuild${NC}"
echo "export JAVA_HOME=\$(/usr/libexec/java_home -v 17)"
echo "cd android"
echo "./gradlew clean"
echo "./gradlew bundleRelease"

echo ""
echo -e "${GREEN}💡 After running these commands, try the build script again!${NC}"