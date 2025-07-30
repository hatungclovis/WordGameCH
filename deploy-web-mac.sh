#!/bin/bash

# Web Deployment Script for Older Macs
# This bypasses all mobile build issues

echo "🌐 Deploying Word Game CH to Web..."

# Check if we can run basic expo commands
if command -v npx &> /dev/null; then
    echo "✅ npx available - using npx method"
    
    # Build for web using npx (no global install needed)
    echo "📦 Building web version..."
    npx @expo/cli export --platform web
    
    echo "🎉 Web build complete!"
    echo "📁 Built files are in the 'dist' folder"
    echo ""
    echo "🚀 Deploy options:"
    echo "1. Upload 'dist' folder to netlify.com (drag & drop)"
    echo "2. Upload to vercel.com"  
    echo "3. Use GitHub Pages"
    echo ""
    echo "🌐 Your game will be live and shareable!"
    
else
    echo "❌ npx not available"
    echo "💡 Try installing Node.js from nodejs.org"
    echo "   Or use the manual deployment method below"
fi

echo ""
echo "📋 Manual Deployment Steps:"
echo "1. Copy your project to a cloud IDE (like CodeSandbox)"
echo "2. Run build commands in the cloud"
echo "3. Download and deploy the built files"
echo ""
echo "🎯 Result: Working web version of your game!"
