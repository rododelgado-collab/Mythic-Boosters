export function Pack({
  size = 'md',
  state = 'available',
  set = 'ARCANA',
  price,
  onClick,
  className = '',
}) {
  const sizes = {
    sm: { w: 120, h: 170 },
    md: { w: 180, h: 240 },
    lg: { w: 240, h: 320 },
    xl: { w: 300, h: 420 },
  }
  const s = sizes[size]
  const isSoldOut = state === 'soldOut'
  const isOwned = state === 'owned'

  return (
    <div
      onClick={isSoldOut ? undefined : onClick}
      style={{ width: s.w, height: s.h }}
      className={`
        relative p-4 flex flex-col items-center justify-between
        rounded-2xl bg-gradient-pack border-2 border-gold-500
        transition-all duration-200
        ${isSoldOut ? 'opacity-40 cursor-not-allowed' : 'shadow-glow-gold cursor-pointer hover:scale-[1.03] hover:shadow-glow-gold-lg'}
        ${className}
      `}
    >
      <span
        className="font-display font-bold text-gold-300 tracking-[0.25em]"
        style={{ fontSize: s.w * 0.065 }}
      >
        {set}
      </span>

      <div
        className="rounded-full border-2 border-gold-400 flex items-center justify-center"
        style={{
          width: s.w * 0.3,
          height: s.w * 0.3,
          fontSize: s.w * 0.15,
          boxShadow: '0 0 20px rgba(224, 176, 58, 0.4)',
        }}
      >
        <span className="font-display font-bold text-gold-300">✦</span>
      </div>

      <span
        className={`font-mono tracking-[0.2em] ${isOwned ? 'text-green-500' : 'text-gold-200'}`}
        style={{ fontSize: s.w * 0.065 }}
      >
        {isOwned ? 'ABIERTO' : price != null ? `$${price.toLocaleString('es-CL')}` : ''}
      </span>

      {isSoldOut && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="badge badge-danger">AGOTADO</span>
        </div>
      )}
    </div>
  )
}