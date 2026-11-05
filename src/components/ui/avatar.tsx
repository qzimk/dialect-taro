import type { ReactNode } from 'react'
import { View, Image, Text, type ViewProps, type ImageProps } from '@tarojs/components'

import { cn } from './utils'

export function Avatar({ className, children, ...rest }: ViewProps & { children?: ReactNode }) {
  return (
    <View
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...rest}
    >
      {children}
    </View>
  )
}

export function AvatarImage({ className, src, ...rest }: ImageProps) {
  return <Image className={cn('h-full w-full', className)} src={src ?? ''} {...rest} />
}

export function AvatarFallback({ className, children, ...rest }: ViewProps & { children?: ReactNode }) {
  return (
    <View
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
      {...rest}
    >
      <Text className="text-xs">{children}</Text>
    </View>
  )
}
