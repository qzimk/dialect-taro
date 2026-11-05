import type { ReactNode } from 'react'
import { Text, type TextProps } from '@tarojs/components'

import { cn } from './utils'

// htmlFor 是 Web 的 label/input 关联，小程序没有这层语义，仅吸收调用点写法。
export function Label({
  className,
  children,
  htmlFor: _htmlFor,
  ...rest
}: TextProps & { children?: ReactNode; htmlFor?: string }) {
  return (
    <Text className={cn('block text-sm font-medium leading-none', className)} {...rest}>
      {children}
    </Text>
  )
}
