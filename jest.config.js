module.exports = {
  preset: '@react-native/jest-preset',
   moduleNameMapper: {
        '\\.svg$': '<rootDir>/__mocks__/svgMocks.js',
    },
    transform: {
        ...tsjPreset.transform,
        '\\.tsx?$': 'ts-jest',
        '\\.svg$': require.resolve('react-native-svg-transformer'),
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|react-native|react-native-keychain|react-native-button))',
    ],
    globals: {
        'ts-jest': {
            babelConfig: true,
        },
    },
    setupFiles: [
        './node_modules/react-native-gesture-handler/jestSetup.js',
        './jest.mock.js',
    ],
    // This is the only part which you can keep
    // from the above linked tutorial's config:
    cacheDirectory: '.jest/cache',
};
