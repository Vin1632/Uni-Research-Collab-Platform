module.exports = {
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["cobertura", "text"],
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleDirectories: ["node_modules", "src"],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
      '\\.(css|less|scss)$': 'identity-obj-proxy',
      '^react-router-dom$': require.resolve('react-router-dom'),
    },    
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    }
  };