import { createContext, useContext, type ReactNode } from 'react'
import { View, type ViewProps } from '@tarojs/components'

import { cn } from './utils'

const PopoverContext = createContext<{ open: boolean; setOpen: (open: boolean) => void }>({
  open: false,
  setOpen: () => {},
})

export function Popover({
  open = false,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}) {
  return (
    <PopoverContext.Provider value={{ open, setOpen: (next) => onOpenChange?.(next) }}>
      <View className="relative inline-block">{children}</View>
    </PopoverContext.Provider>
  )
}

// Radix 的 asChild 是把 props 透传给子元素；这里子元素本就是 View 基元，包一层即可，
// 该 prop 只用于吸收调用点的写法。
export function PopoverTrigger({ asChild: _asChild, children }: { asChild?: boolean; children?: ReactNode }) {
  const { open, setOpen } = useContext(PopoverContext)
  return (
    <View className="inline-flex" onClick={() => setOpen(!open)}>
      {children}
    </View>
  )
}

// 基类不带宽高与内边距：cn 只去重不做 tailwind-merge，冲突类会由样式表顺序决定，
// 交给调用点的 className（如 w-80 p-0）单独决定更可靠。
export function PopoverContent({
  className,
  align = 'center',
  children,
  ...rest
}: ViewProps & { align?: 'start' | 'center' | 'end'; children?: ReactNode }) {
  const { open } = useContext(PopoverContext)
  if (!open) return null
  return (
    <View
      className={cn(
        'absolute top-full z-50 mt-1 rounded-md border bg-white shadow-md',
        align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2',
        className,
      )}
      {...rest}
    >
      {children}
    </View>
  )
}
