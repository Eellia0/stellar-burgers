import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '@pages/(.*)': '<rootDir>/src/pages/$1',
    '@components/(.*)': '<rootDir>/src/components/$1',
    '@ui/(.*)': '<rootDir>/src/components/ui/$1',
    '@ui-pages/(.*)': '<rootDir>/src/components/ui/pages/$1',
    '@utils-types': '<rootDir>/src/utils/types',
    '@api': '<rootDir>/src/utils/burger-api.ts',
    '@slices/(.*)': '<rootDir>/src/services/slices/$1',
    '@selectors/(.*)': '<rootDir>/src/services/selectors/$1',
  },
  setupFiles: ['jest-localstorage-mock'], 
};

export default config;
