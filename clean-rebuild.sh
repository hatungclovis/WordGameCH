#!/bin/bash

# Make this script executable: chmod +x clean-rebuild.sh

echo "🧹 Cleaning React Native Expo project..."

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Clearing npm cache..."
npm cache clean --force

echo "🗑️ Removing node_modules and lock files..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

echo "🗑️ Removing build directories..."
rm -rf android
rm -rf ios
rm -rf .expo

echo "📥 Installing dependencies..."
npm install

echo "🔧 Running Expo prebuild for Android..."
npx expo prebuild --platform android --clean

echo "🔧 Setting up Android configuration..."
cd android

# Make gradlew executable
chmod +x gradlew

# Clean any existing builds
./gradlew clean

echo "✅ Project cleaned and prebuilt successfully!"
echo ""
echo "Now you can run:"
echo "  npx expo run:android"
echo ""
echo "If you still have issues, try:"
echo "  cd android && ./gradlew assembleDebug"