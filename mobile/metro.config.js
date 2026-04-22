const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Force Metro to resolve expo-crypto from the project root
// instead of the nested version inside expo-auth-session
config.resolver.extraNodeModules = {
  "expo-crypto": path.resolve(__dirname, "node_modules/expo-crypto"),
};

module.exports = config;
