/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'], 
  moduleNameMapper: {
    '^@categories$': '<rootDir>/src/categories',
    '^@categories/(.*)$': '<rootDir>/src/categories/$1',

    '^@utils$': '<rootDir>/src/utils',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',

    '^@middlewares$': '<rootDir>/src/middlewares',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',

    '^@products$': '<rootDir>/src/products',
    '^@products/(.*)$': '<rootDir>/src/products/$1',

    '^src/(.*)$': '<rootDir>/src/$1',
  },
};