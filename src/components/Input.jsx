import { useId } from 'react'

export function Input({
  label,
  error,
  helper,
  className = '',
  ...rest
}) {
  const id = useId()
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input ${hasError ? 'input-error' : ''} ${className}`}
        {...rest}
      />
      {(error || helper) && (
        <span className={`text-xs ${hasError ? 'text-red-500' : 'text-slate-500'}`}>
          {error || helper}
        </span>
      )}
    </div>
  )
}