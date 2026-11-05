import type { ReactNode } from 'react'
import { ScrollView, type ScrollViewProps } from '@tarojs/components'

import { cn } from './utils'

export function ScrollArea({ className, children, ...rest }: ScrollViewProps & { children?: ReactNode }) {
  return (
    <ScrollView scrollY className={cn('h-full w-full', className)} {...rest}>
      {children}
    </ScrollView>
  )
}
