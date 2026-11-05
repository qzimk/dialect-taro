import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';

export type Viewport = { width: number; height: number };

export function readViewport(): Viewport {
  const info = Taro.getSystemInfoSync();
  return { width: info.windowWidth || 375, height: info.windowHeight || 812 };
}

// 应用本质是响应式、要支持横屏，所以分档只看宽度、不看高宽比：
// 500 宽的窄窗口无论多扁都放不下一整排按钮，844 宽的横屏手机反而放得下。
export type DeviceTier = 'narrow' | 'wide';

export const WIDE_MIN_WIDTH = 700;

export function tierOf(width: number): DeviceTier {
  return width >= WIDE_MIN_WIDTH ? 'wide' : 'narrow';
}

export function tierMetrics(vp: Viewport) {
  const compact = vp.width < WIDE_MIN_WIDTH;
  return {
    compact,
    // 360 以下总标题栏的三块（头像/居中标签/记录本）会互相压线，标签字号与间距再降一档
    ultra: vp.width < 360,
    // 分板起手高度跟视口高度成比例并钳制，横屏矮窗也留得下两板
    boardSplitHeight: Math.max(160, Math.min(300, Math.round(vp.height * 0.3))),
    headerHeight: compact ? 'h-12' : 'h-14',
    historyPanelWidth: compact ? 'w-40' : 'w-64',
  };
}

export type DeviceLayout = Viewport & {
  tier: DeviceTier;
  metrics: ReturnType<typeof tierMetrics>;
};

export function useDeviceLayout(): DeviceLayout {
  const [vp, setVp] = useState<Viewport>(readViewport);

  useEffect(() => {
    const sync = () => setVp(readViewport());
    let detach: (() => void) | undefined;
    if (typeof Taro.onWindowResize === 'function') {
      Taro.onWindowResize(sync);
      detach = () => Taro.offWindowResize?.(sync);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', sync);
      detach = () => window.removeEventListener('resize', sync);
    }
    // 首帧读数可能早于布局定型，挂载后再校一次
    sync();
    return () => detach?.();
  }, []);

  return { ...vp, tier: tierOf(vp.width), metrics: tierMetrics(vp) };
}
