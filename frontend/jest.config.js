module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["cobertura", "text"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
