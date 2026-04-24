const RARITY_COLORS = {
  common:   { border: '#cbd5e1', hex: 'rgba(203,213,225,0.5)', glow: false },
  uncommon: { border: '#64748b', hex: 'rgba(100,116,139,0.5)', glow: false },
  rare:     { border: '#eab308', hex: 'rgba(234,179,8,0.5)',   glow: true },
  mythic:   { border: '#f97316', hex: 'rgba(249,115,22,0.6)',  glow: true },
}

const MANA_STYLES = {
  W: { bg: '#fefce8', color: '#020617' },
  U: { bg: '#0ea5e9', color: '#ffffff' },
  B: { bg: '#1e293b', color: '#ffffff' },
  R: { bg: '#ef4444', color: '#ffffff' },
  G: { bg: '#22c55e', color: '#ffffff' },
  C: { bg: '#94a3b8', color: '#020617' },
}

export function Card({
  rarity = 'common',
  size = 'md',
  name,
  type,
  rulesText,
  art,
  imageUri,
  cost = [],
  power,
  toughness,
  isRevealed = true,
  onClick,
  className = '',
}) {
  const sizes = {
    xs: { w: 90, h: 126, artH: 54, padding: 'p-2', gap: 'gap-1', titleSize: 'text-[9px]', typeSize: 'text-[7px]', ruleSize: 'text-[7px]', manaSize: 10, ptSize: 'text-[9px] px-1 py-0.5' },
    sm: { w: 140, h: 196, artH: 90, padding: 'p-2.5', gap: 'gap-1.5', titleSize: 'text-[11px]', typeSize: 'text-[8px]', ruleSize: 'text-[9px]', manaSize: 12, ptSize: 'text-[11px] px-1.5 py-0.5' },
    md: { w: 200, h: 280, artH: 130, padding: 'p-3', gap: 'gap-1.5', titleSize: 'text-xs', typeSize: 'text-[9px]', ruleSize: 'text-[10px]', manaSize: 14, ptSize: 'text-sm px-2 py-0.5' },
    lg: { w: 280, h: 392, artH: 180, padding: 'p-4', gap: 'gap-2', titleSize: 'text-base', typeSize: 'text-[10px]', ruleSize: 'text-xs', manaSize: 18, ptSize: 'text-base px-2.5 py-1' },
  }
  const s = sizes[size]
  const r = RARITY_COLORS[rarity]

  if (!isRevealed) {
    return (
      <div
        onClick={onClick}
        style={{ width: s.w, height: s.h }}
        className={`
          rounded-xl bg-gradient-pack border-2 border-gold-500
          flex items-center justify-center
          ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
          transition-transform ${className}
        `}
      >
        <span className="font-display font-bold text-gold-300" style={{ fontSize: s.artH * 0.5 }}>✦</span>
      </div>
    )
  }

  // Carta real con imagen de Scryfall
  if (imageUri) {
    return (
      <div
        onClick={onClick}
        style={{
          width: s.w,
          height: s.h,
          borderColor: r.border,
          borderWidth: rarity === 'mythic' ? 3 : rarity === 'rare' ? 2 : 1.5,
          boxShadow: r.glow ? `0 0 ${s.w * 0.15}px ${r.hex}` : 'none',
        }}
        className={`
          rounded-xl overflow-hidden border
          transition-all
          ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
          ${className}
        `}
      >
        <img src={imageUri} alt={name} className="w-full h-full object-cover" loading="lazy" />
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      style={{
        width: s.w,
        height: s.h,
        borderColor: r.border,
        borderWidth: rarity === 'mythic' ? 3 : rarity === 'rare' ? 2 : 1.5,
        boxShadow: r.glow ? `0 0 ${s.w * 0.15}px ${r.hex}` : 'none',
      }}
      className={`
        ${s.padding} ${s.gap} flex flex-col
        rounded-xl bg-gradient-pack border
        transition-all ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`font-display font-bold text-slate-100 ${s.titleSize} truncate`}>
          {name}
        </span>
        <div className="flex gap-0.5 flex-shrink-0">
          {cost.map((mana, i) => {
            const m = MANA_STYLES[mana] ?? MANA_STYLES['C']
            return (
              <div
                key={i}
                className="rounded-full border border-white/20 flex items-center justify-center font-display font-bold"
                style={{
                  width: s.manaSize,
                  height: s.manaSize,
                  backgroundColor: m.bg,
                  color: m.color,
                  fontSize: s.manaSize * 0.55,
                }}
              >
                {mana}
              </div>
            )
          })}
        </div>
      </div>

      <div
        className="rounded bg-gradient-rare-art flex items-center justify-center"
        style={{ height: s.artH, fontSize: s.artH * 0.5 }}
      >
        {art}
      </div>

      <span className={`font-mono text-slate-300 tracking-wider ${s.typeSize} truncate`}>
        {type}
      </span>

      {rulesText && (
        <p className={`font-body text-slate-300 leading-snug ${s.ruleSize} flex-1 overflow-hidden`}>
          {rulesText}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div
          className="rounded-full"
          style={{
            width: s.manaSize,
            height: s.manaSize,
            backgroundColor: r.border,
            boxShadow: r.glow ? `0 0 10px ${r.hex}` : 'none',
          }}
        />
        {power != null && toughness != null && (
          <div
            className={`${s.ptSize} rounded font-display font-bold text-slate-100`}
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          >
            {power}/{toughness}
          </div>
        )}
      </div>
    </div>
  )
}