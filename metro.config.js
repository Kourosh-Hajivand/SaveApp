const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

const nativeWindConfig = withNativeWind(config, { input: './src/global.css' });

// Apply SVG transformer after NativeWind so it is not overwritten.
const { transformer, resolver } = nativeWindConfig;

nativeWindConfig.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

nativeWindConfig.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...new Set([...resolver.sourceExts, 'svg'])],
};

module.exports = nativeWindConfig;
