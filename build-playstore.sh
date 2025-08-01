#!/bin/bash

# Word Game CH - Google Play Store Build Script
# This script will build your app for Google Play Store deployment

echo "🎮 Building Word Game CH for Google Play Store..."
echo "================================================"

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from your project root directory"
    exit 1
fi

echo "📋 Step 1: Cleaning previous builds..."
npm run prebuild:clean

echo "🔧 Step 2: Generating native Android project..."
npm run prebuild

echo "📦 Step 3: Building Android App Bundle (AAB)..."
cd android
./gradlew bundleRelease
cd ..

echo "✅ Build completed!"
echo ""
echo "📱 Your Android App Bundle is ready at:"
echo "   android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "🚀 Next steps:"
echo "   1. Upload the AAB file to Google Play Console"
echo "   2. Complete your store listing"
echo "   3. Submit for review"
echo ""
echo "📚 For detailed instructions, see:"
echo "   GOOGLE_PLAY_DEPLOYMENT.md"
