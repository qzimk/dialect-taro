import { View, ViewProps } from '@tarojs/components';
import { ICON_GEOMETRY } from './icon-paths';

export type IconName = keyof typeof ICON_GEOMETRY;

// 小程序不渲染内联 <svg>，因此把 lucide 几何编成 data URI 交给 background-image；
// 描边色必须烘进 URI（background-image 拿不到 currentColor），故 color 只接受具体色值。
function toUri(geometry: string, color: string, strokeWidth: number) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}"` +
    ` stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${geometry}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export interface IconProps extends ViewProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 16, color = '#252525', strokeWidth = 2, className = '', style, ...rest }: IconProps) {
  return (
    <View
      className={`shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: toUri(ICON_GEOMETRY[name], color, strokeWidth),
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        // ViewProps['style'] 允许字符串，字符串形式无法参与合并，只在对象时展开
        ...(typeof style === 'object' && style !== null ? style : {}),
      }}
      {...rest}
    />
  );
}

export default Icon;
