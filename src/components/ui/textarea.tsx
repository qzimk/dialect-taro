import { Textarea as TaroTextarea, type TextareaProps as TaroTextareaProps } from '@tarojs/components'

import { cn } from './utils'

export interface TextareaProps extends Omit<TaroTextareaProps, 'onChange'> {
  onChange?: (event: { target: { value: string }; detail: { value: string } }) => void
  rows?: number
  className?: string
}

const LINE_HEIGHT = 22

function Textarea({ className, onChange, rows = 4, style, ...rest }: TextareaProps) {
  return (
    <TaroTextarea
      placeholderStyle="color:#9ca3af"
      className={cn(
        'border border-input rounded-md bg-input-background px-3 py-2 w-full text-sm',
        className,
      )}
      // TextareaProps['style'] 允许字符串，字符串形式无法参与合并，只在对象时展开
      style={{ minHeight: `${rows * LINE_HEIGHT + 16}px`, ...(typeof style === 'object' && style !== null ? style : {}) }}
      onInput={(event) => {
        const value = event.detail.value
        onChange?.({ target: { value }, detail: { value } })
      }}
      {...rest}
    />
  )
}

export { Textarea }
