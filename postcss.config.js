module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 多端分流：只有小程序环境才调用适配插件
    ...(process.env.TARO_ENV !== 'h5' ? { 'weapp-tailwindcss/postcss': {} } : {})
  },
}
