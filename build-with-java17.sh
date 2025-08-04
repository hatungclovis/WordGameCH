#!/bin/bash

# Make this script executable: chmod +x build-with-java17.sh

echo "🔧 Building React Native project with Java 17..."

# Navigate to project directory
cd "$(dirname "$0")"

# Force Java 17
echo "Setting Java 17..."
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"

# Fallback if Homebrew path doesn't exist
if [ ! -d "$JAVA_HOME" ]; then
    echo "Homebrew Java 17 not found, trying system installation..."
    export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)
fi

# Check if Java 17 is available
if [ -z "$JAVA_HOME" ] || [ ! -d "$JAVA_HOME" ]; then
    echo "❌ Java 17 not found!"
    echo "Please install Java 17 first:"
    echo "brew install openjdk@17"
    echo "sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk"
    exit 1
fi

echo "✅ Using JAVA_HOME: $JAVA_HOME"
echo "Java version:"
"$JAVA_HOME/bin/java" -version

echo ""
echo "🧹 Cleaning project..."
cd android

# Kill any existing Gradle daemons
./gradlew --stop

# Clean the project
./gradlew clean --no-daemon

echo ""
echo "🔨 Building debug APK..."
./gradlew assembleDebug --no-daemon --stacktrace

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "APK location: android/app/build/outputs/apk/debug/"
else
    echo ""
    echo "❌ Build failed. Check the output above for errors."
fi