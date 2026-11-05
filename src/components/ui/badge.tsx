import type { ReactNode } from 'react'
import { View, type ViewProps } from '@tarojs/components'

import { cn } from './utils'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-white',
  outline: 'text-foreground',
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...rest
}: ViewProps & { variant?: BadgeVariant; children?: ReactNode }) {
  return (
    <View
      className={cn(
        'inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs font-medium whitespace-nowrap shrink-0',
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </View>
  )
}
