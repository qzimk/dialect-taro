import { Input as TaroInput, type InputProps as TaroInputProps } from '@tarojs/components'

import { cn } from './utils'

// 调用点写的是 Web 习惯（onChange 取 e.target.value、onKeyDown 判 Enter），
// 小程序里输入事件在 e.detail.value、回车走 onConfirm，这里做一次归一。
export interface InputProps extends Omit<TaroInputProps, 'onChange' | 'type'> {
  onChange?: (event: { target: { value: string }; detail: { value: string } }) => void
  onKeyDown?: (event: { key: string }) => void
  type?: string
  className?: string
}

const TYPES = ['text', 'number', 'idcard', 'digit', 'safe-password', 'nickname']

function Input({ className, onChange, onKeyDown, type = 'text', ...rest }: InputProps) {
  return (
    <TaroInput
      type={(TYPES as string[]).includes(type) ? (type as keyof TaroInputProps.Type) : 'text'}
      placeholderStyle="color:#9ca3af"
      className={cn(
        'border border-input rounded-md bg-input-background px-3 py-1 h-9 w-full text-sm',
        className,
      )}
      onInput={(event) => {
        const value = event.detail.value
        onChange?.({ target: { value }, detail: { value } })
      }}
      onConfirm={() => onKeyDown?.({ key: 'Enter' })}
      {...rest}
    />
  )
}

export { Input }
