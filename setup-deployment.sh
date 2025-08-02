#!/bin/bash

# Word Game CH - Final Setup for Play Store Deployment
# This script makes build scripts executable and performs final checks

echo "🚀 Setting up Word Game CH for Play Store deployment..."
echo "===================================================="

# Make scripts executable
chmod +x build-for-playstore.sh
chmod +x test-on-device.sh
chmod +x android/gradlew

echo "✅ Scripts are now executable"

# Check environment
echo ""
echo "🔍 Checking environment..."

# Check Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo "✅ Java: $JAVA_VERSION"
else
    echo "❌ Java not found"
fi

# Check Node
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found"
fi

# Check Android SDK
if [ -n "$ANDROID_HOME" ]; then
    echo "✅ ANDROID_HOME: $ANDROID_HOME"
else
    echo "❌ ANDROID_HOME not set"
fi

# Check keystore
if [ -f "android/app/wordgamech-upload-key.keystore" ]; then
    echo "✅ Keystore file found"
else
    echo "❌ Keystore file not found"
fi

echo ""
echo "🎮 Word Game CH Deployment Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Run './build-for-playstore.sh' to build AAB for Play Store"
echo "2. Run './test-on-device.sh' to test on connected Android device"
echo "3. Upload the AAB to Google Play Console"
echo ""
echo "Happy deploying! 🚀"