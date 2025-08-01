#!/bin/bash

# Word Game CH - Complete Setup and Build
echo "🎮 Word Game CH - Complete Setup for Google Play Store"
echo "====================================================="

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from your project root directory"
    exit 1
fi

echo "🔍 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi
echo "✅ Node.js found: $(node --version)"

# Check Java
if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install Java JDK 11 or 17."
    echo "   Download from: https://adoptium.net/"
    exit 1
fi
echo "✅ Java found: $(java -version 2>&1 | head -n 1)"

# Check if ANDROID_HOME is set
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME not set. You'll need Android Studio and SDK."
    echo "   Download from: https://developer.android.com/studio"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Android SDK found: $ANDROID_HOME"
fi

echo ""
echo "📦 Installing project dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed!"

echo ""
echo "🔑 Setting up app signing..."

# Check if keystore already exists
if [ -f "android/app/wordgamech-upload-key.keystore" ] || [ -f "wordgamech-upload-key.keystore" ]; then
    echo "✅ Keystore already exists!"
else
    echo "Creating signing keystore..."
    echo "You'll be asked to create passwords - remember them!"
    echo ""
    
    keytool -genkeypair -v -storetype PKCS12 -keystore wordgamech-upload-key.keystore -alias wordgamech-key -keyalg RSA -keysize 2048 -validity 10000
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create keystore"
        exit 1
    fi
fi

# Generate Android project if needed
if [ ! -d "android" ]; then
    echo ""
    echo "📱 Generating Android project..."
    npm run prebuild
fi

# Move keystore if needed
if [ -f "wordgamech-upload-key.keystore" ]; then
    mv wordgamech-upload-key.keystore android/app/
    echo "✅ Keystore moved to android/app/"
fi

# Setup gradle.properties
if [ ! -f "android/gradle.properties" ] || ! grep -q "WORDGAMECH_UPLOAD_STORE_FILE" android/gradle.properties; then
    echo ""
    echo "🔐 Configuring build signing..."
    echo "Enter your keystore password:"
    read -s password
    
    # Create or update gradle.properties
    cat >> android/gradle.properties << EOF

# Signing configuration for Word Game CH
WORDGAMECH_UPLOAD_STORE_FILE=wordgamech-upload-key.keystore
WORDGAMECH_UPLOAD_KEY_ALIAS=wordgamech-key
WORDGAMECH_UPLOAD_STORE_PASSWORD=$password
WORDGAMECH_UPLOAD_KEY_PASSWORD=$password

# Android build settings
android.useAndroidX=true
android.enableJetifier=true
org.gradle.jvmargs=-Xmx2048m
android.defaults.buildfeatures.buildconfig=true
android.nonTransitiveRClass=false
android.nonFinalResIds=false
EOF
    
    echo "✅ Build configuration created!"
fi

echo ""
echo "🏗️  Building AAB for Google Play Store..."
npm run build:playstore

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your app is ready for Google Play Store!"
    echo ""
    echo "📱 Your Android App Bundle (AAB) is ready at:"
    echo "   android/app/build/outputs/bundle/release/app-release.aab"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Go to https://play.google.com/console"
    echo "2. Create a new app called 'Word Game CH'"
    echo "3. Upload the AAB file"
    echo "4. Complete your store listing"
    echo "5. Submit for review"
    echo ""
    echo "📚 For detailed instructions, see: GOOGLE_PLAY_DEPLOYMENT.md"
else
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi
