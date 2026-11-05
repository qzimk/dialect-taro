import { Children, createContext, isValidElement, useContext, useState, type ReactNode } from 'react'
import { View, ScrollView, type ViewProps } from '@tarojs/components'

import { Icon } from './icon'
import { cn } from './utils'

interface SelectCtx {
  value: string
  open: boolean
  setOpen: (open: boolean) => void
  pick: (value: string) => void
  labelOf: (value: string) => ReactNode
}

const Ctx = createContext<SelectCtx | null>(null)

function useSelect() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Select 子组件必须在 <Select> 内使用')
  return ctx
}

// 选项只有展开时才挂载，但收起状态下 SelectValue 也要显示当前选中项，
// 所以直接从 children 元素树里收集 value→文案，不依赖挂载。
function collectLabels(node: ReactNode, acc: Record<string, ReactNode>): Record<string, ReactNode> {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return
    const props = child.props as { value?: string; children?: ReactNode }
    if (child.type === SelectItem && typeof props.value === 'string') {
      acc[props.value] = props.children
    } else {
      collectLabels(props.children, acc)
    }
  })
  return acc
}

export interface SelectProps extends Omit<ViewProps, 'children'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: ReactNode
}

export function Select({ className, value, defaultValue = '', onValueChange, children }: SelectProps) {
  const [inner, setInner] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const current = value === undefined ? inner : value
  const labels = collectLabels(children, {})

  return (
    <Ctx.Provider
      value={{
        value: current,
        open,
        setOpen,
        labelOf: (v: string) => labels[v] ?? v,
        pick: (v: string) => {
          setInner(v)
          onValueChange?.(v)
          setOpen(false)
        },
      }}
    >
      <View className={cn('relative', className)}>{children}</View>
    </Ctx.Provider>
  )
}

export function SelectTrigger({ className, children, ...rest }: ViewProps & { children?: ReactNode }) {
  const { open, setOpen } = useSelect()
  return (
    <View
      className={cn(
        // min-w-24（rem 档，不受 pxtransform 折半影响）保证至少容得下三四个汉字；
        // 调用方若用 w-[Npx] 会被折半到只够一个字，所以宽度一律交给这里兜底。
        'flex items-center justify-between gap-2 min-w-24 rounded-md border border-input bg-input-background px-3 py-2 text-sm whitespace-nowrap',
        className,
      )}
      onClick={() => setOpen(!open)}
      {...rest}
    >
      {children}
      <Icon name="ChevronDown" size={16} color="#9ca3af" className="shrink-0" />
    </View>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value, labelOf } = useSelect()
  if (!value) return <View className="min-w-0 flex-1 truncate text-muted-foreground">{placeholder}</View>
  return <View className="min-w-0 flex-1 truncate">{labelOf(value)}</View>
}

export function SelectContent({ children }: { children?: ReactNode }) {
  const { open, setOpen, value, labelOf } = useSelect()
  if (!open) return null
  return (
    // 触屏优先：不做锚定弹层（会被 overflow-hidden 祖先裁剪、随滚动容器滚走、顶出视口右缘），
    // 改成全屏遮罩 + 底部升起面板，fixed 定位脱离一切裁剪上下文。
    <View className="fixed inset-0 z-50" catchMove>
      <View
        className="absolute inset-0 bg-black/30"
        onClick={() => setOpen(false)}
      />
      <View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg flex flex-col"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <View className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
          <View className="w-8" />
          <View className="min-w-0 flex-1 text-center text-sm font-medium text-gray-900 truncate">{value ? labelOf(value) : '请选择'}</View>
          <View className="w-8 flex justify-end" onClick={() => setOpen(false)}>
            <Icon name="X" size={18} color="#6b7280" />
          </View>
        </View>
        <ScrollView scrollY className="max-h-[50vh] flex-shrink" style={{ maxHeight: '50vh' }}>
          {children}
        </ScrollView>
      </View>
    </View>
  )
}

export interface SelectItemProps extends Omit<ViewProps, 'value'> {
  value: string
  children?: ReactNode
}

export function SelectItem({ className, value, children, ...rest }: SelectItemProps) {
  const { value: current, pick } = useSelect()
  return (
    <View
      className={cn(
        'relative flex items-center justify-between gap-2 px-4 py-3 text-base active:bg-gray-100',
        current === value ? 'text-blue-600 font-medium' : 'text-gray-700',
        className,
      )}
      onClick={() => pick(value)}
      {...rest}
    >
      {children}
      {current === value && <Icon name="Check" size={16} color="#2563eb" />}
    </View>
  )
}
