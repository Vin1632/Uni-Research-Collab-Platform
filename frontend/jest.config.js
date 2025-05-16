module.exports = {
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["cobertura", "text"],
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
      '\\.(css|less|scss)$': 'identity-obj-proxy'
    },    
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    }
  };