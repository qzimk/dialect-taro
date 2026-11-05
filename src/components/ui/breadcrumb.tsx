import type { ReactNode } from 'react'
import { View, Text, type ViewProps } from '@tarojs/components'

import { useNavigate } from '../../utils/router'
import { cn } from './utils'

type WithChildren = ViewProps & { children?: ReactNode }

export function Breadcrumb({ className, children, ...rest }: WithChildren) {
  return (
    <View className={cn(className)} {...rest}>
      {children}
    </View>
  )
}

export function BreadcrumbList({ className, children, ...rest }: WithChildren) {
  return (
    <View
      className={cn('flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground', className)}
      {...rest}
    >
      {children}
    </View>
  )
}

export function BreadcrumbItem({ className, children, ...rest }: WithChildren) {
  return (
    <View className={cn('inline-flex items-center gap-1.5', className)} {...rest}>
      {children}
    </View>
  )
}

export function BreadcrumbLink({ className, children, href, ...rest }: WithChildren & { href?: string }) {
  const navigate = useNavigate()
  return (
    <View
      className={cn('hover:text-foreground', className)}
      onClick={() => href && navigate(href)}
      {...rest}
    >
      {children}
    </View>
  )
}

export function BreadcrumbPage({ className, children, ...rest }: WithChildren) {
  return (
    <Text className={cn('block font-normal text-foreground', className)} {...rest}>
      {children}
    </Text>
  )
}

export function BreadcrumbSeparator({ className, children, ...rest }: WithChildren) {
  return (
    <Text className={cn('block text-muted-foreground', className)} {...rest}>
      {children ?? '/'}
    </Text>
  )
}
