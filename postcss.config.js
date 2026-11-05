module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
    // weapp-tailwindcss v4 已没有 /postcss 导出：小程序端改由 config/index.ts 里的
    // UnifiedViteWeappTailwindcssPlugin(vitePlugins) 适配，这里只服务 h5 的 vite。
  },
}
