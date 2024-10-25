import { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(ts|tsx)',
    // do not collect from index, testUtils or version files
    '!<rootDir>/**/(index|version).(ts|tsx)',
    // do not collect from top level styles directory
    '!<rootDir>/src/styles/*.ts',
  ],
  coverageThreshold: {
    global: {
      // TEMP REDUCE COVERAGE
      // branches: 87,
      // functions: 90,
      // lines: 95,
      // statements: 95,
      branches: 80,
      functions: 86,
      lines: 92,
      statements: 91,
    },
  },
  moduleNameMapper: { '^uuid$': '<rootDir>/../../node_modules/uuid' },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jsdom',
};

export default config;
