/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'], 
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@orders$': '<rootDir>/src/orders',
    '^@orders/(.*)$': '<rootDir>/src/orders/$1',

    '^@cart$': '<rootDir>/src/cart',
    '^@cart/(.*)$': '<rootDir>/src/cart/$1',

    '^@utils$': '<rootDir>/src/utils',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',

    '^@middlewares$': '<rootDir>/src/middlewares',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',

    '^@configs$': '<rootDir>/src/configs',
    '^@configs/(.*)$': '<rootDir>/src/configs/$1',

    '^src/(.*)$': '<rootDir>/src/$1',
  },
};