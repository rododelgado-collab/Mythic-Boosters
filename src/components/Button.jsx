export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...rest
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-display font-bold uppercase tracking-[0.1em] transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-gradient-gold text-void shadow-glow-gold hover:shadow-glow-gold-lg hover:scale-[1.02]',
    secondary: 'bg-transparent text-gold-300 border border-gold-400/40 hover:border-gold-400 hover:bg-gold-400/5',
    ghost: 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizes = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-7 py-3.5 text-[13px]',
    lg: 'px-8 py-4 text-[15px]',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}