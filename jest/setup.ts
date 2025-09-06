import '@testing-library/jest-native/extend-expect';

// Silence React Native/Expo noisy logs during tests
jest.spyOn(global.console, 'warn').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});

