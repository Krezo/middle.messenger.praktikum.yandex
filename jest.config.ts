import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  setupFiles: ['./jestSetup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
  },
}

export default config
