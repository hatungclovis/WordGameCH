const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimize for Expo SDK 51
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config;
