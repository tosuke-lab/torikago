module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?': 'ts-jest'
  },
  testRegex: 'test.tsx?',
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts']
}