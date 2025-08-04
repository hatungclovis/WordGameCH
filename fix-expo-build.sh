#!/bin/bash

# Make this script executable: chmod +x fix-expo-build.sh

echo "🔧 Fixing Expo Android build issues..."

# Navigate to project directory
cd "$(dirname "$0")"

# Set Java 17
echo "Setting Java 17..."
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"

if [ ! -d "$JAVA_HOME" ]; then
    export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)
fi

if [ -z "$JAVA_HOME" ] || [ ! -d "$JAVA_HOME" ]; then
    echo "❌ Java 17 not found!"
    echo "Please install Java 17 first:"
    echo "brew install openjdk@17"
    exit 1
fi

echo "✅ Using JAVA_HOME: $JAVA_HOME"

echo ""
echo "🧹 Complete cleanup..."

# Stop all Gradle daemons
cd android
./gradlew --stop

# Remove Gradle cache and build artifacts
rm -rf ~/.gradle/caches/
rm -rf .gradle/
rm -rf build/
rm -rf app/build/

# Go back to root and clean Expo/Metro cache
cd ..
rm -rf .expo/
rm -rf node_modules/.cache/
npx expo install --fix

echo ""
echo "🔄 Regenerating Android configuration..."
npx expo prebuild --platform android --clean

echo ""
echo "🔧 Building with proper configuration..."
cd android

# Clean build
./gradlew clean --no-daemon --warning-mode all

# Build debug APK
./gradlew assembleDebug --no-daemon --warning-mode all --stacktrace

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "APK location: android/app/build/outputs/apk/debug/"
    ls -la app/build/outputs/apk/debug/
else
    echo ""
    echo "❌ Build failed. Running with more verbose output..."
    ./gradlew assembleDebug --no-daemon --info --stacktrace
fi