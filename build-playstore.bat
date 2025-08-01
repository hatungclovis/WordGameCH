@echo off
REM Word Game CH - Google Play Store Build Script (Windows)
REM This script will build your app for Google Play Store deployment

echo 🎮 Building Word Game CH for Google Play Store...
echo ================================================

REM Check if we're in the right directory
if not exist "app.json" (
    echo ❌ Error: Please run this script from your project root directory
    pause
    exit /b 1
)

echo 📋 Step 1: Cleaning previous builds...
call npm run prebuild:clean

echo 🔧 Step 2: Generating native Android project...
call npm run prebuild

echo 📦 Step 3: Building Android App Bundle AAB...
cd android
call gradlew bundleRelease
cd ..

echo ✅ Build completed!
echo.
echo 📱 Your Android App Bundle is ready at:
echo    android\app\build\outputs\bundle\release\app-release.aab
echo.
echo 🚀 Next steps:
echo    1. Upload the AAB file to Google Play Console
echo    2. Complete your store listing
echo    3. Submit for review
echo.
echo 📚 For detailed instructions, see:
echo    GOOGLE_PLAY_DEPLOYMENT.md

pause
