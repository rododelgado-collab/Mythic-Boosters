import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Banknote, Check, Layers, ZoomIn } from 'lucide-react'
import { Card } from '../components/Card'
import { CardZoom } from '../components/CardZoom'
import { Button } from '../components/Button'
import { useApp } from '../context/AppContext'

export function Coleccion() {
  const { collection } = useApp()
  const navigate = useNavigate()
  const [selectedCards, setSelectedCards] = useState([])

  const allSelected = collection.length > 0 && selectedCards.length === collection.length
  const [zoomedCard, setZoomedCard] = useState(null)

  const toggleCard = (instanceId) => {
    setSelectedCards((prev) =>
      prev.includes(instanceId)
        ? prev.filter((id) => id !== instanceId)
        : [...prev, instanceId]
    )
  }

  const toggleAll = () => {
    if (allSelected) {
      setSelectedCards([])
    } else {
      setSelectedCards(collection.map((c) => c.instanceId))
    }
  }

  const selectedCardsData = collection.filter((c) => selectedCards.includes(c.instanceId))
  const totalValue = selectedCardsData.reduce((sum, c) => sum + c.marketPrice, 0)

  const handleCanjear = () => {
    if (selectedCards.length === 0) return
    navigate('/canjear', { state: { selectedCards: selectedCardsData } })
  }

  const handleVender = () => {
    if (selectedCards.length === 0) return
    navigate('/vender', { state: { selectedCards: selectedCardsData } })
  }

  if (collection.length === 0) {
    return (
      <div className="px-5 md:px-16 py-8 md:py-12 min-h-screen bg-radial-gold">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <span className="eyebrow">✦ MI COLECCIÓN</span>
            <h1 className="title-display text-3xl md:text-5xl mt-2">Mis cartas</h1>
          </div>
          <div className="card p-10 md:p-16 bg-gradient-to-br from-night to-void text-center flex flex-col items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gold-400/15 border-2 border-gold-400/40 flex items-center justify-center text-gold-300">
              <Layers size={32} />
            </div>
            <h2 className="title-display text-2xl md:text-3xl">Tu colección está vacía</h2>
            <p className="text-slate-400 max-w-md">
              Abre sobres y guarda tus cartas para verlas aquí.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/tienda')}>
              Ir a la tienda
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 md:px-16 py-8 md:py-12 min-h-screen bg-radial-gold">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        <div>
          <span className="eyebrow">✦ MI COLECCIÓN</span>
          <h1 className="title-display text-3xl md:text-5xl mt-2">Mis cartas</h1>
          <p className="text-slate-400 mt-2">
            {collection.length} carta{collection.length !== 1 ? 's' : ''} en tu colección
          </p>
        </div>

        {/* Barra de acciones */}
        <div className="card p-4 md:p-5 bg-abyss flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleAll}
              className="font-mono text-[11px] tracking-wider uppercase text-gold-300 hover:text-gold-200 transition-colors"
            >
              {allSelected ? 'Deseleccionar todas' : 'Seleccionar todas'}
            </button>
            {selectedCards.length > 0 && (
              <span className="text-sm text-slate-500">
                {selectedCards.length} seleccionada{selectedCards.length > 1 ? 's' : ''}
                {' · '}
                <span className="text-gold-300">${totalValue.toLocaleString('es-CL')}</span>
              </span>
            )}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="secondary"
              icon={<Package size={16} />}
              onClick={handleCanjear}
              disabled={selectedCards.length === 0}
              className="flex-1 md:flex-none"
            >
              Canjear físico
            </Button>
            <Button
              variant="primary"
              icon={<Banknote size={16} />}
              onClick={handleVender}
              disabled={selectedCards.length === 0}
              className="flex-1 md:flex-none"
            >
              Vender por crédito
            </Button>
          </div>
        </div>

        {/* Grid de cartas */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {collection.map((card) => {
            const isSelected = selectedCards.includes(card.instanceId)
            return (
              <div key={card.instanceId} className="flex flex-col items-center">
                {/* Nombre + lupa */}
                <div className="flex items-center gap-1 mb-1.5 w-[140px] justify-center">
                  <span className="font-display text-[10px] text-slate-300 truncate">{card.name}</span>
                  <button
                    onClick={() => setZoomedCard(card)}
                    className="flex-shrink-0 text-slate-500 hover:text-gold-300 transition-colors"
                    aria-label="Expandir carta"
                  >
                    <ZoomIn size={11} />
                  </button>
                </div>

                {/* Carta + ring */}
                <div className="relative w-fit">
                  <div
                    onClick={() => toggleCard(card.instanceId)}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'ring-4 ring-gold-400 rounded-xl' : ''
                    }`}
                  >
                    <Card
                      size="sm"
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
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold-400 flex items-center justify-center">
                      <Check size={14} className="text-void" />
                    </div>
                  )}
                </div>

                <div className="mt-1.5 text-center">
                  <span className="font-mono text-[10px] text-gold-300">
                    ${card.marketPrice.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      <CardZoom card={zoomedCard} onClose={() => setZoomedCard(null)} />
    </div>
  )
}
