module.exports = {
    collectCoverage: true,
    coverageReporters: ['text', 'cobertura'],
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy',
        
      },
      transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': 'jest-transform-stub',
      },
      testEnvironment: 'jsdom',
      
}
