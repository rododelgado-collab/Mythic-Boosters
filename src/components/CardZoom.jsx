import { X } from 'lucide-react'
import { Card } from './Card'

export function CardZoom({ card, onClose }) {
  if (!card) return null

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-abyss border border-gold-400/30 text-slate-300 flex items-center justify-center hover:text-gold-300 transition-colors"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        {card.imageUri ? (
          <img
            src={card.imageUri}
            alt={card.name}
            className="rounded-2xl shadow-2xl"
            style={{ maxHeight: '78vh', maxWidth: 'min(340px, calc(100vw - 40px))', width: '100%' }}
          />
        ) : (
          <Card
            size="lg"
            rarity={card.rarity}
            name={card.name}
            type={card.type}
            cost={card.cost}
            power={card.power}
            toughness={card.toughness}
            rulesText={card.rulesText}
            art={card.art}
            imageUri={card.imageUri}
          />
        )}

        <div className="text-center">
          <p className="font-display font-bold text-gold-200 text-lg">{card.name}</p>
          <p className="font-mono text-[11px] text-slate-400 mt-0.5">{card.type}</p>
        </div>
      </div>
    </div>
  )
}
