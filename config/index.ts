import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite'
import devConfig from './dev'
import prodConfig from './prod'

const isApp = process.env.TARO_ENV !== 'h5'

//
// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge) => {
  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'dialect-taro',
    date: '2026-1-16',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [
      "@tarojs/plugin-generator"
    ],
    defineConstants: {
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: 'react',
    compiler: 'vite',
    mini: {
      // 在 mini 节点下新增 vitePlugins
      // @ts-ignore
      vitePlugins: isApp ? [uvwt()] : [],

      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        // mini 端必须显式开启 tailwindcss：Taro 的 vite 管线用这里的配置覆盖根 postcss.config.js，
        // 缺了这一项时 @tailwind/@apply 会原样落进 wxss，小程序拿到的样式表里一条工具类都没有。
        tailwindcss: {
          enable: true
        },
        autoprefixer: {
          enable: true,
          config: {}
        },
        // 显式开启 postcss-import 或 url 处理，确保 Tailwind 指令生效
        url: {
          enable: true,
          config: {
            limit: 1024 // 设定 inline 图片的大小限制
          }
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        tailwindcss: {
          enable: true
        },
        autoprefixer: {
          enable: true,
          config: {}
        },
        pxtransform: {
          enable: true,
          // html/body/#app 上的 min/max-width 是「支持的视口边界」，写的是真实像素，
          // 不能被 750 设计稿折半（1280 会变 640）。
          // @ts-expect-error Taro 运行时接受 'px'，但 postcss-pxtransform 的类型联合只列了 rpx/vw/rem
          config: { targetUnit: 'px', selectorBlackList: ['html', 'body', '#app'] }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }


  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
