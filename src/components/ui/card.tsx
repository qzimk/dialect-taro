import type { ReactNode } from 'react'
import { View, type ViewProps } from '@tarojs/components'

import { cn } from './utils'

export function Card({ className, children, ...rest }: ViewProps & { children?: ReactNode }) {
  return (
    <View className={cn('bg-card text-card-foreground flex flex-col rounded-xl border', className)} {...rest}>
      {children}
    </View>
  )
}

export function CardContent({ className, children, ...rest }: ViewProps & { children?: ReactNode }) {
  return (
    <View className={cn('px-6 pb-6', className)} {...rest}>
      {children}
    </View>
  )
}
