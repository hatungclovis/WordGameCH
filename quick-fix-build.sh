#!/bin/bash

# Quick Fix for Java Version Issue - Word Game CH

echo "🚀 Quick Fix: Setting correct Java version and rebuilding..."

# Set JAVA_HOME to Java 17 if available
if /usr/libexec/java_home -v 17 &> /dev/null; then
    export JAVA_HOME=$(/usr/libexec/java_home -v 17)
    echo "✅ Set JAVA_HOME to Java 17: $JAVA_HOME"
elif /usr/libexec/java_home -v 11 &> /dev/null; then
    export JAVA_HOME=$(/usr/libexec/java_home -v 11)
    echo "✅ Set JAVA_HOME to Java 11: $JAVA_HOME"
else
    echo "❌ No compatible Java version found. Installing Java 17..."
    brew install --cask zulu17
    export JAVA_HOME=$(/usr/libexec/java_home -v 17)
fi

# Verify Java version
echo "📋 Using Java version:"
java -version

# Clean and rebuild
echo "🧹 Cleaning previous build..."
cd android
./gradlew clean

echo "🔨 Building release AAB..."
./gradlew bundleRelease

if [ $? -eq 0 ]; then
    echo "🎉 Build successful!"
    echo "📁 Your AAB file is ready at: android/app/build/outputs/bundle/release/app-release.aab"
else
    echo "❌ Build failed. Check the error messages above."
fi