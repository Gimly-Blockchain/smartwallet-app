module.exports = {
  setupFiles: [
    "./tests/utils/setup.ts"
  ],
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!react-native|native-base|react-navigation|react-native-fabric)"
  ],
  globals: {
    window: true,
    "ts-jest": {
      babelConfig: true,
      diagnostics: {
        warnOnly: true
      }
    }
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/assetsTransformer.js"
  },
  moduleDirectories: [
    "node_modules",
    "<rootDir>"
  ],
  preset: "react-native",
  testMatch: [
    "**/tests/**/*.test.[tj]s?(x)"
  ],
  testPathIgnorePatterns: [
    "/node_modules/.*",
    "/legacy/.*"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
}
