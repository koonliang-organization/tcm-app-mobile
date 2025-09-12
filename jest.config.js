module.exports = {
  preset: 'jest-expo',
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    'app/**/*.{ts,tsx,js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/*.d.ts',
    '!**/jest/**',
    '!**/e2e/**',
    '!src/**/__tests__/**',
    '!app/**/__tests__/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    'global': {
      'statements': 30,
      'branches': 30,
      'functions': 30,
      'lines': 30
    }
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest/setup.ts'
  ],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
    '^@assets/(.*)': '<rootDir>/assets/$1'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|expo-modules-core|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)',
    '/node_modules/react-native-reanimated/plugin/'
  ]
};