const { withBuildProperties } = require('expo-build-properties');

const config = {
  name: "Word Game CH",
  slug: "wordgamech",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.hatungclovis.wordgamech",
    buildNumber: "1"
  },
  android: {
    package: "com.hatungclovis.wordgamech",
    versionCode: 1,
    permissions: ["VIBRATE"],
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.hatungclovis.wordgamech"
  },
  web: {
    bundler: "metro"
  },
  owner: "hatungclovis",
  description: "Enhanced Wordle-style word guessing game with multiple difficulty levels, customizable word lengths, and comprehensive statistics tracking.",
  githubUrl: "https://github.com/hatungclovis/WordGameCH",
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          kotlinVersion: "1.9.25",
          suppressKotlinVersionCompatibilityCheck: true
        }
      }
    ]
  ]
};

module.exports = config;
