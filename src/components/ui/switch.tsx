import { useState } from 'react'
import { View } from '@tarojs/components'

import { cn } from './utils'

// id 是 Web 的 label 关联锚点，小程序无此语义，仅吸收调用点写法。
export function Switch({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  id: _id,
}: {
  className?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
}) {
  const [inner, setInner] = useState(defaultChecked)
  const on = checked ?? inner

  return (
    <View
      className={cn(
        'inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
        on ? 'bg-primary' : 'bg-input',
        disabled && 'opacity-50',
        className,
      )}
      onClick={() => {
        if (disabled) return
        if (checked === undefined) setInner(!on)
        onCheckedChange?.(!on)
      }}
    >
      <View
        className={cn(
          'block h-5 w-5 rounded-full bg-white shadow-lg transition-transform',
          on ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </View>
  )
}
