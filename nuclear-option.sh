#!/bin/bash

# Nuclear Option: Completely reset to working configuration
# This downgrades to proven stable versions

echo "🔥 Nuclear Option: Complete reset to stable configuration..."
echo "=========================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Ensure Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
echo -e "${GREEN}✅ Using Java 17: $JAVA_HOME${NC}"

# Step 1: Completely remove Android build
echo -e "${BLUE}Step 1: Removing existing Android configuration...${NC}"
rm -rf android/
rm -rf ~/.gradle/

# Step 2: Regenerate with clean slate
echo -e "${BLUE}Step 2: Regenerating Android project with stable settings...${NC}"
npx expo prebuild --clean --platform android

# Step 3: Downgrade to stable Gradle version
echo -e "${BLUE}Step 3: Setting stable Gradle version...${NC}"
cd android

# Set stable Gradle version (8.6)
cat > gradle/wrapper/gradle-wrapper.properties << 'EOF'
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.6-all.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
EOF

# Step 4: Set stable Android Gradle Plugin version
cat > build.gradle << 'EOF'
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    ext {
        buildToolsVersion = findProperty('android.buildToolsVersion') ?: '34.0.0'
        minSdkVersion = Integer.parseInt(findProperty('android.minSdkVersion') ?: '24')
        compileSdkVersion = Integer.parseInt(findProperty('android.compileSdkVersion') ?: '34')
        targetSdkVersion = Integer.parseInt(findProperty('android.targetSdkVersion') ?: '34')
        kotlinVersion = findProperty('android.kotlinVersion') ?: '1.9.22'

        ndkVersion = "25.1.8937393"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath('com.android.tools.build:gradle:8.2.2')
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

# Step 5: Stable gradle.properties
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

# Stable Gradle settings for Java 17
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m -Dfile.encoding=UTF-8
org.gradle.parallel=false
org.gradle.daemon=false
org.gradle.configureondemand=false
EOF

# Step 6: Copy keystore if it doesn't exist
if [ ! -f "app/wordgamech-upload-key.keystore" ]; then
    echo -e "${YELLOW}Looking for keystore file...${NC}"
    if [ -f "../backup/wordgamech-upload-key.keystore" ]; then
        cp "../backup/wordgamech-upload-key.keystore" "app/"
        echo -e "${GREEN}✅ Copied keystore from backup${NC}"
    else
        echo -e "${RED}❌ Keystore not found - you'll need to create one${NC}"
    fi
fi

# Step 7: Build with stable settings
echo -e "${BLUE}Step 7: Building with stable configuration...${NC}"

# Force wrapper download with correct Java
./gradlew --version

# Clean build
./gradlew clean

# Build release AAB
./gradlew bundleRelease

BUILD_RESULT=$?

if [ $BUILD_RESULT -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS! Nuclear option worked!${NC}"
    
    AAB_FILE="app/build/outputs/bundle/release/app-release.aab"
    if [ -f "$AAB_FILE" ]; then
        cp "$AAB_FILE" "../wordgamech-stable.aab"
        echo -e "${GREEN}📦 AAB created: wordgamech-stable.aab${NC}"
        
        FILE_SIZE=$(du -h "../wordgamech-stable.aab" | cut -f1)
        echo -e "${GREEN}📏 Size: $FILE_SIZE${NC}"
    fi
    
    # Also build APK for testing
    ./gradlew assembleRelease
    APK_FILE="app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_FILE" ]; then
        cp "$APK_FILE" "../wordgamech-stable.apk"
        echo -e "${GREEN}📱 APK created: wordgamech-stable.apk${NC}"
    fi
    
else
    echo -e "${RED}❌ Even nuclear option failed${NC}"
    echo -e "${YELLOW}💡 Last resort: Try manual APK generation${NC}"
fi

cd ..
echo -e "${GREEN}🔥 Nuclear option completed!${NC}"