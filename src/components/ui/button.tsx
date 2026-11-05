import type { ReactNode } from 'react'
import { View, type ViewProps } from '@tarojs/components'

import { cn } from './utils'

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

const VARIANTS: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-input bg-background text-foreground',
  ghost: 'bg-transparent text-foreground',
  destructive: 'bg-destructive text-white',
  link: 'bg-transparent text-primary',
}

const SIZES: Record<ButtonSize, string> = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 px-3',
  lg: 'h-10 px-6',
  icon: 'h-9 w-9',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap shrink-0'

export interface ButtonProps extends ViewProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  children?: ReactNode
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <View
      className={cn(BASE, VARIANTS[variant], SIZES[size], disabled && 'opacity-50', className)}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {children}
    </View>
  )
}

export function buttonVariants({ variant = 'default', size = 'default' }: { variant?: ButtonVariant; size?: ButtonSize } = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size])
}

export default Button
