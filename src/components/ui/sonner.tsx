import Taro from '@tarojs/taro';

// 替代 sonner：小程序没有 DOM 挂载点，改用原生 toast。
// 保留 sonner 的调用面（toast / toast.success / toast.error），调用点无需改写。
const base = (message: string) => Taro.showToast({ title: message, icon: 'none' });

export const toast = Object.assign(base, {
  success: (message: string) => Taro.showToast({ title: message, icon: 'success' }),
  error: (message: string) => Taro.showToast({ title: message, icon: 'error' }),
  info: (message: string) => Taro.showToast({ title: message, icon: 'none' }),
  warning: (message: string) => Taro.showToast({ title: message, icon: 'none' }),
  message: (message: string) => Taro.showToast({ title: message, icon: 'none' }),
  dismiss: () => Taro.hideToast(),
});

export function Toaster() {
  return null;
}

export default toast;
