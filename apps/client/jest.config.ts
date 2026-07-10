import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@app/lib-shared-types(.*)$": "<rootDir>/../../packages/shared-types/src$1",
  },
  testMatch: [
    "<rootDir>/**/tests/**/*.[jt]s?(x)",
    "<rootDir>/**/*.spec.[jt]s?(x)",
    "<rootDir>/**/*.test.[jt]s?(x)",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
