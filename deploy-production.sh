#!/bin/bash

# 🚀 Word Game CH - Production Deployment Script
# This script handles the complete app store deployment process

echo "🎮 Word Game CH - App Store Deployment"
echo "======================================="

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."
    
    if ! command -v expo &> /dev/null; then
        echo "❌ Expo CLI not found. Installing..."
        npm install -g @expo/cli
    fi
    
    if ! command -v eas &> /dev/null; then
        echo "❌ EAS CLI not found. Installing..."
        npm install -g eas-cli
    fi
    
    echo "✅ Requirements check complete"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
}

# Generate app icons and assets
generate_assets() {
    echo "🎨 Generating app assets..."
    
    # Create required directories
    mkdir -p assets/icons
    mkdir -p assets/images
    
    # Note: In production, you would use tools like:
    # - expo-icon-generator
    # - imagemagick for resizing
    # - figma-export for automated asset generation
    
    echo "⚠️  Manual step required: Generate app icons from assets/icons/app-icon.svg"
    echo "   Use tools like: https://appicon.co or Figma export"
    echo "   Required sizes: 1024x1024 (App Store), 512x512 (Play Store)"
    
    echo "✅ Asset generation setup complete"
}

# Configure EAS build
setup_eas() {
    echo "⚙️  Setting up EAS build..."
    
    if [ ! -f "eas.json" ]; then
        echo "❌ eas.json not found"
        exit 1
    fi
    
    # Login to Expo (if not already logged in)
    echo "🔐 Please login to your Expo account:"
    eas login
    
    # Initialize EAS project
    eas build:configure
    
    echo "✅ EAS setup complete"
}

# Build for production
build_production() {
    echo "🏗️  Building production apps..."
    
    echo "Building iOS app..."
    eas build --platform ios --profile production
    
    echo "Building Android APK..."
    eas build --platform android --profile production
    
    echo "Building Android AAB for Play Store..."
    eas build --platform android --profile production-aab
    
    echo "✅ Production builds complete"
}

# Submit to app stores
submit_apps() {
    echo "📤 Submitting to app stores..."
    
    echo "⚠️  Manual steps required:"
    echo "1. Configure Apple Developer account in eas.json"
    echo "2. Configure Google Play Console service account"
    echo "3. Run: eas submit --platform ios"
    echo "4. Run: eas submit --platform android"
    
    echo "✅ Submission setup complete"
}

# Main deployment flow
main() {
    echo "Starting deployment process..."
    
    check_requirements
    install_dependencies
    generate_assets
    setup_eas
    
    echo ""
    echo "🎉 Deployment setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Generate app icons from the SVG template"
    echo "2. Create App Store Connect and Play Console accounts"
    echo "3. Run: eas build --platform ios --profile production"
    echo "4. Run: eas build --platform android --profile production"
    echo "5. Submit builds to app stores"
    echo ""
    echo "💰 Revenue potential: $50-500+ monthly with good ASO"
    echo "📈 Launch timeline: 2-3 weeks to live apps"
}

# Run main function
main
