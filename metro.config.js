const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimize bundle to reduce warnings
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

// Reduce bundle warnings
config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
  output: {
    comments: false,
  },
};

// Enable Hermes for better performance
config.transformer.hermesParser = true;

module.exports = config;
