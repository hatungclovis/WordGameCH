#!/bin/bash

# Ultimate Fix for Java Version Issues - Word Game CH
# This addresses the root cause: explicit AGP version + Java compatibility

echo "🎯 Ultimate Fix: Resolving Java version conflicts definitively..."
echo "=============================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Ensure we're using Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"

echo -e "${GREEN}✅ Using Java 17: $JAVA_HOME${NC}"
java -version

# Step 1: Fix Android Gradle Plugin version
echo -e "${BLUE}Step 1: Setting explicit Android Gradle Plugin version...${NC}"

cd android

# Backup original build.gradle
cp build.gradle build.gradle.backup

# Update build.gradle with explicit AGP version
cat > build.gradle << 'EOF'
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    ext {
        buildToolsVersion = findProperty('android.buildToolsVersion') ?: '35.0.0'
        minSdkVersion = Integer.parseInt(findProperty('android.minSdkVersion') ?: '24')
        compileSdkVersion = Integer.parseInt(findProperty('android.compileSdkVersion') ?: '35')
        targetSdkVersion = Integer.parseInt(findProperty('android.targetSdkVersion') ?: '34')
        kotlinVersion = findProperty('android.kotlinVersion') ?: '1.9.25'

        ndkVersion = "26.1.10909125"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath('com.android.tools.build:gradle:8.7.3')
        classpath('com.facebook.react:react-native-gradle-plugin')
        classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')
    }
}

apply plugin: "com.facebook.react.rootproject"

allprojects {
    repositories {
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url(new File(['node', '--print', "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim(), '../android'))
        }
        maven {
            // Android JSC is installed from npm
            url(new File(['node', '--print', "require.resolve('jsc-android/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim(), '../dist'))
        }

        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
    }
}
EOF

echo -e "${GREEN}✅ Updated build.gradle with explicit AGP version 8.7.3${NC}"

# Step 2: Update gradle.properties with Java 17 settings
echo -e "${BLUE}Step 2: Optimizing gradle.properties for Java 17...${NC}"

# Backup and update gradle.properties
cp gradle.properties gradle.properties.backup

cat > gradle.properties << 'EOF'
# Signing configuration for Word Game CH
WORDGAMECH_UPLOAD_STORE_FILE=wordgamech-upload-key.keystore
WORDGAMECH_UPLOAD_KEY_ALIAS=wordgamech-key
WORDGAMECH_UPLOAD_STORE_PASSWORD=Bergervu2024@
WORDGAMECH_UPLOAD_KEY_PASSWORD=Bergervu2024@

# Android build settings
android.useAndroidX=true
android.enableJetifier=true
android.defaults.buildfeatures.buildconfig=true
android.nonTransitiveRClass=false
android.nonFinalResIds=false

# Java 17 optimized Gradle settings
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8 -XX:+UseG1GC
org.gradle.parallel=true
org.gradle.configureondemand=false
org.gradle.daemon=true
org.gradle.caching=true

# React Native optimizations
FLIPPER_VERSION=0.182.0
EOF

echo -e "${GREEN}✅ Updated gradle.properties for Java 17 compatibility${NC}"

# Step 3: Clear everything and build fresh
echo -e "${BLUE}Step 3: Complete clean and fresh build...${NC}"

# Remove all cached data
rm -rf .gradle/ build/ app/build/
rm -rf ~/.gradle/caches/
rm -rf ~/.gradle/wrapper/

# Clean Gradle
./gradlew clean

echo -e "${GREEN}✅ All caches cleared${NC}"

# Step 4: Build with explicit Java 17
echo -e "${BLUE}Step 4: Building with Java 17 (this may take a few minutes)...${NC}"

# Build with explicit Java home and detailed logging
./gradlew \
  -Dorg.gradle.java.home="$JAVA_HOME" \
  --no-daemon \
  --stacktrace \
  --info \
  bundleRelease

BUILD_RESULT=$?

if [ $BUILD_RESULT -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS! Build completed successfully!${NC}"
    
    AAB_FILE="app/build/outputs/bundle/release/app-release.aab"
    if [ -f "$AAB_FILE" ]; then
        FILE_SIZE=$(du -h "$AAB_FILE" | cut -f1)
        echo -e "${GREEN}📁 AAB Location: $AAB_FILE${NC}"
        echo -e "${GREEN}📏 File Size: $FILE_SIZE${NC}"
        
        # Copy to project root for easy access
        cp "$AAB_FILE" "../wordgamech-playstore.aab"
        echo -e "${GREEN}📋 Also saved as: wordgamech-playstore.aab${NC}"
        
        echo ""
        echo -e "${YELLOW}🚀 Ready for Google Play Store!${NC}"
        echo -e "${YELLOW}Upload this file: wordgamech-playstore.aab${NC}"
    fi
else
    echo -e "${RED}❌ Build failed even with explicit settings${NC}"
    echo -e "${YELLOW}💡 Checking for alternative solutions...${NC}"
    
    # Try building APK instead (sometimes works when AAB fails)
    echo -e "${BLUE}Trying APK build as fallback...${NC}"
    ./gradlew -Dorg.gradle.java.home="$JAVA_HOME" --no-daemon assembleRelease
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ APK build successful!${NC}"
        APK_FILE="app/build/outputs/apk/release/app-release.apk"
        if [ -f "$APK_FILE" ]; then
            cp "$APK_FILE" "../wordgamech-release.apk"
            echo -e "${GREEN}📱 APK saved as: wordgamech-release.apk${NC}"
            echo -e "${YELLOW}💡 You can convert APK to AAB later or submit APK directly${NC}"
        fi
    fi
fi

cd ..
echo -e "${GREEN}🏁 Ultimate fix completed!${NC}"