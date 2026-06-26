/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  moduleNameMapper: {
    '^@users$': '<rootDir>/src/users',
    '^@users/(.*)$': '<rootDir>/src/users/$1',

    '^@utils$': '<rootDir>/src/utils',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',

    '^@middlewares$': '<rootDir>/src/middlewares',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',

    '^@configs$': '<rootDir>/src/configs',
    '^@configs/(.*)$': '<rootDir>/src/configs/$1',

    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
