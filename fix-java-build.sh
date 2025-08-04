#!/bin/bash

# Make this script executable: chmod +x fix-java-build.sh

echo "🔧 Fixing Java version for React Native build..."

# Navigate to project directory
cd "$(dirname "$0")"

# Try to set Java 17
echo "Setting Java 17..."
export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)

if [ -z "$JAVA_HOME" ]; then
    echo "❌ Java 17 not found. Trying Java 11..."
    export JAVA_HOME=$(/usr/libexec/java_home -v 11 2>/dev/null)
fi

if [ -z "$JAVA_HOME" ]; then
    echo "❌ Neither Java 17 nor Java 11 found. Using system default..."
    export JAVA_HOME=$(/usr/libexec/java_home)
fi

echo "Using JAVA_HOME: $JAVA_HOME"
java -version

echo ""
echo "🧹 Cleaning Gradle cache..."
cd android
./gradlew clean --no-daemon

echo ""
echo "🔧 Building with proper Java version..."
./gradlew assembleDebug --no-daemon --stacktrace

echo ""
echo "If this fails, try installing Java 17:"
echo "brew install openjdk@17"