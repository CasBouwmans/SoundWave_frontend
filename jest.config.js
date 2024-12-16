module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest'],
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
      '^@/(.*)$': '<rootDir>/src/$1',
      '^next/image$': '<rootDir>/__mocks__/next/image.js',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  };