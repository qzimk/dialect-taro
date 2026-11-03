import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    // min-h-screen: 撑满全屏, bg-slate-50: 浅灰背景
    <View className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">

      {/* 一个精致的卡片 */}
      <View className="w-full max-w-sm bg-white rounded-[40rpx] p-8 shadow-xl border border-slate-100">

        <View className="h-2 w-16 bg-blue-500 rounded-full mb-6" />

        <Text className="text-4xl font-black text-slate-900 block mb-4">
          Hello!
        </Text>

        <Text className="text-slate-500 text-base leading-relaxed mb-8 block">
          如果这段文字变灰、背景变白且带有阴影，说明你的 TailwindCSS 已经跨端配置成功了。
        </Text>

        {/* 按钮：测试渐变色和微信端圆角适配 */}
        <View className="bg-gradient-to-r from-blue-600 to-indigo-500 py-4 rounded-2xl flex items-center justify-center active:opacity-80 transition-opacity">
          <Text className="text-white font-bold text-lg">点击探索</Text>
        </View>

      </View>

      {/* 底部当前端展示 */}
      <Text className="mt-10 text-slate-400 text-xs tracking-widest uppercase">
        Platform: {process.env.TARO_ENV}
      </Text>
    </View>
  )
}
