const { getDefaultConfig } = require('@react-native/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

const { assetExts, sourceExts } = config.resolver

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
}

config.resolver = {
  ...config.resolver,
  assetExts: assetExts.filter((ext) => ext !== 'svg'),  // ← destructure first, then filter
  sourceExts: [...sourceExts, 'svg'],

  extraNodeModules: {
    hooks:  path.resolve(__dirname, 'src/hooks'),
    models: path.resolve(__dirname, 'src/models'),
    repo:   path.resolve(__dirname, 'src/repo'),
    routes: path.resolve(__dirname, 'src/routes'),
    stores: path.resolve(__dirname, 'src/stores'),
    ui:     path.resolve(__dirname, 'src/ui'),
    utils:  path.resolve(__dirname, 'src/utils'),
    assets: path.resolve(__dirname, 'src/assets'),
    config: path.resolve(__dirname, 'src/config'),
  },
}

module.exports = config