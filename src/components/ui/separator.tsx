import { View, type ViewProps } from '@tarojs/components'

import { cn } from './utils'

export function Separator({
  className,
  orientation = 'horizontal',
  ...rest
}: ViewProps & { orientation?: 'horizontal' | 'vertical'; decorative?: boolean }) {
  return (
    <View
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...rest}
    />
  )
}
