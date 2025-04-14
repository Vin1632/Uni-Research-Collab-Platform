module.exports = {
    collectCoverage: true,
    coverageReporters: ['text', 'cobertura'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy'
      },
      transform: {
        '^.+\\.jsx?$': 'babel-jest',
      },
      testEnvironment: 'jsdom'
}
