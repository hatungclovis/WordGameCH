#!/bin/bash

# Advanced Fix for Persistent Java Version Issues - Word Game CH

echo "🔧 Advanced Fix: Resolving persistent Java compatibility issues..."
echo "================================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Force Java 17 for Gradle
echo -e "${BLUE}Step 1: Forcing Java 17 for Gradle...${NC}"
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"

echo "✅ JAVA_HOME set to: $JAVA_HOME"
java -version

# Step 2: Clear all caches and temporary files
echo -e "${BLUE}Step 2: Clearing all caches...${NC}"
cd android

# Clear Gradle caches
./gradlew clean
rm -rf ~/.gradle/caches/
rm -rf ~/.gradle/wrapper/
rm -rf .gradle/
rm -rf build/
rm -rf app/build/

# Clear Metro cache
cd ..
npx react-native start --reset-cache &
sleep 3
pkill -f "react-native start" || true

echo "✅ All caches cleared"

# Step 3: Regenerate Android project with correct Java
echo -e "${BLUE}Step 3: Regenerating Android project...${NC}"
npx expo prebuild --clean --platform android

# Step 4: Update Gradle JVM args for Java 17
echo -e "${BLUE}Step 4: Updating Gradle JVM arguments...${NC}"
cd android

# Create/update gradle.properties with Java 17 specific settings
cat >> gradle.properties << 'EOF'

# Java 17 compatibility settings
org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=1g -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8 -XX:+UseG1GC
org.gradle.java.home=/opt/homebrew/Cellar/openjdk/24.0.1/libexec/openjdk.jdk/Contents/Home

# Android Gradle Plugin settings
android.useAndroidX=true
android.enableJetifier=true
android.nonTransitiveRClass=false
android.nonFinalResIds=false
android.defaults.buildfeatures.buildconfig=true

# Disable Gradle daemon to force fresh start
org.gradle.daemon=false
EOF

# Step 5: Force specific Java home in build
echo -e "${BLUE}Step 5: Building with explicit Java 17...${NC}"
./gradlew -Dorg.gradle.java.home="$JAVA_HOME" --no-daemon --stacktrace bundleRelease

BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS! Build completed with Java 17${NC}"
    
    AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
    if [ -f "$AAB_PATH" ]; then
        AAB_SIZE=$(du -h "$AAB_PATH" | cut -f1)
        echo -e "${GREEN}📁 AAB file: $AAB_PATH (${AAB_SIZE})${NC}"
        
        # Copy to easier location
        cp "$AAB_PATH" "../wordgamech-release.aab"
        echo -e "${GREEN}📁 Also copied to: ../wordgamech-release.aab${NC}"
    fi
else
    echo -e "${RED}❌ Build still failed. Trying alternative approach...${NC}"
    
    # Alternative: Use Java 11 if 17 still causes issues
    if /usr/libexec/java_home -v 11 &> /dev/null; then
        echo -e "${YELLOW}🔄 Trying with Java 11...${NC}"
        export JAVA_HOME=$(/usr/libexec/java_home -v 11)
        ./gradlew -Dorg.gradle.java.home="$JAVA_HOME" --no-daemon clean bundleRelease
    fi
fi

cd ..
echo -e "${GREEN}✅ Advanced fix completed${NC}"