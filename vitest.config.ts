// vitest.config.ts (新建)
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // 手动复制相同的别名配置，保持一致性
    alias: {
      '@main': resolve('src/main'),
      '@preload': resolve('src/preload'),
      '@renderer': resolve('src/renderer/src')
    }
  },
  test: {
    testTimeout: 20 * 1000,
    environment: 'node',
    globals: true
  }
})
