#!/bin/bash

# Word Game CH - Interactive App Signing Setup
echo "🔐 Word Game CH - App Signing Setup"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from your project root directory"
    exit 1
fi

echo "This script will help you set up app signing for Google Play Store."
echo ""

# Step 1: Check if Android project exists
if [ ! -d "android" ]; then
    echo "📦 Android project not found. Generating it now..."
    npx expo prebuild
    echo "✅ Android project generated!"
    echo ""
fi

# Step 2: Check if keystore exists
if [ ! -f "wordgamech-upload-key.keystore" ]; then
    echo "🔑 Keystore not found. Let's create it!"
    echo ""
    echo "You'll be asked to create passwords and provide some information."
    echo "IMPORTANT: Remember the passwords you create - you'll need them for app updates!"
    echo ""
    read -p "Press Enter to continue..."
    
    keytool -genkeypair -v -storetype PKCS12 -keystore wordgamech-upload-key.keystore -alias wordgamech-key -keyalg RSA -keysize 2048 -validity 10000
    
    if [ $? -eq 0 ]; then
        echo "✅ Keystore created successfully!"
    else
        echo "❌ Failed to create keystore. Please check your Java installation."
        exit 1
    fi
else
    echo "✅ Keystore already exists!"
fi

# Step 3: Move keystore to android/app
if [ -f "wordgamech-upload-key.keystore" ]; then
    mv wordgamech-upload-key.keystore android/app/
    echo "✅ Keystore moved to android/app/"
fi

# Step 4: Get password for gradle.properties
echo ""
echo "🔐 Now I need your keystore password to configure the build system."
echo "Enter the keystore password you just created:"
read -s password
echo ""

# Step 5: Create gradle.properties
cat > android/gradle.properties << EOF
# Signing configuration for Word Game CH
WORDGAMECH_UPLOAD_STORE_FILE=wordgamech-upload-key.keystore
WORDGAMECH_UPLOAD_KEY_ALIAS=wordgamech-key
WORDGAMECH_UPLOAD_STORE_PASSWORD=$password
WORDGAMECH_UPLOAD_KEY_PASSWORD=$password

# Android build settings
android.useAndroidX=true
android.enableJetifier=true

# Gradle settings
org.gradle.jvmargs=-Xmx2048m
android.defaults.buildfeatures.buildconfig=true
android.nonTransitiveRClass=false
android.nonFinalResIds=false
EOF

echo "✅ Configuration file created!"
echo ""
echo "🎉 App signing setup complete!"
echo ""
echo "📋 Summary:"
echo "✅ Android project generated"
echo "✅ Keystore created and configured"
echo "✅ Build configuration ready"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npm run build:playstore"
echo "2. Upload the AAB file to Google Play Console"
echo ""
echo "📚 For detailed instructions, see: GOOGLE_PLAY_DEPLOYMENT.md"
