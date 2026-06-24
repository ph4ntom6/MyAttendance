module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          hooks:   './src/hooks',
          models:  './src/models',
          repo:    './src/repo',
          routes:  './src/routes',
          stores:  './src/stores',
          ui:      './src/ui',
          utils:   './src/utils',
          assets:  './src/assets',   // ← only once, correct path
          config:  './src/config',
        },
      },
    ],
  ],
}