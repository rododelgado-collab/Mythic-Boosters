import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Sparkles, X, Check, Package, Banknote, ZoomIn } from 'lucide-react'
import { Card } from '../components/Card'
import { CardZoom } from '../components/CardZoom'
import { Button } from '../components/Button'
import { useApp } from '../context/AppContext'
import { generatePackContents } from '../lib/mockData'
import { generatePack } from '../lib/scryfall'

export function Apertura() {
  const { packId } = useParams()
  const navigate = useNavigate()
  const { unopenedPacks, removePack, addCards, loadSetCards } = useApp()

  const [pack] = useState(() => unopenedPacks.find((p) => p.id === packId) ?? null)
  const [phase, setPhase] = useState('intro')
  const [cards, setCards] = useState([])
  const [revealedCount, setRevealedCount] = useState(0)
  const [selectedCards, setSelectedCards] = useState([])
  const [zoomedCard, setZoomedCard] = useState(null)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const actionBarRef = useRef(null)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    if (!pack) navigate('/perfil')
  }, [pack, navigate])

  if (!pack) return null

  const allRevealed = revealedCount === cards.length && cards.length > 0
  const allSelected = selectedCards.length === cards.length && cards.length > 0
  const selectedCardsData = cards.filter((c) => selectedCards.includes(c.instanceId))
  const totalValue = selectedCardsData.reduce((sum, c) => sum + c.marketPrice, 0)

  const handleOpen = async () => {
    setPhase('ripping')

    // La animación (1200ms) y la descarga de cartas corren en paralelo
    const [poolCards] = await Promise.all([
      pack.set_code ? loadSetCards(pack.set_code) : Promise.resolve(null),
      new Promise((r) => setTimeout(r, 1200)),
    ])

    const newCards = poolCards?.length
      ? generatePack(poolCards)
      : generatePackContents() // fallback si falla la API

    setCards(newCards)
    setPhase('revealing')
  }

  const handleRevealAll = () => setRevealedCount(cards.length)

  const handleReveal = (index) => {
    if (index === revealedCount) setRevealedCount((n) => n + 1)
  }

  const toggleCard = (instanceId) => {
    setSelectedCards((prev) =>
      prev.includes(instanceId)
        ? prev.filter((id) => id !== instanceId)
        : [...prev, instanceId]
    )
  }

  const toggleAll = () => {
    setSelectedCards(allSelected ? [] : cards.map((c) => c.instanceId))
  }

  const handleGuardar = () => {
    removePack(packId)
    addCards(cards)
    navigate('/perfil', { state: { tab: 'coleccion' } })
  }

  const handleCanjear = () => {
    if (selectedCards.length === 0) return
    removePack(packId)
    addCards(cards)
    navigate('/canjear', { state: { selectedCards: selectedCardsData } })
  }

  const handleVender = () => {
    if (selectedCards.length === 0) return
    removePack(packId)
    addCards(cards)
    navigate('/vender', { state: { selectedCards: selectedCardsData } })
  }

  // FASE 1: INTRO
  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 z-50 bg-void bg-radial-gold flex flex-col items-center justify-center p-5">
        <button
          onClick={() => navigate('/perfil')}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-abyss border border-gold-400/20 text-slate-300 flex items-center justify-center hover:text-gold-300 transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center gap-8 animate-pulse-gold p-8 rounded-3xl">
          <div className="w-64 h-80 md:w-80 md:h-[28rem] rounded-2xl bg-gradient-pack border-2 border-gold-500 shadow-glow-gold-lg flex flex-col items-center justify-center p-6 gap-6">
            <span className="font-display font-bold text-gold-300 tracking-[0.3em] text-sm md:text-base">
              {pack.set}
            </span>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-gold-400 flex items-center justify-center text-gold-300 text-4xl md:text-5xl font-display font-bold shadow-glow-gold">
              ✦
            </div>
            <span className="font-mono text-[10px] md:text-xs text-slate-300 tracking-widest">
              15 CARTAS · 1 RARE+
            </span>
          </div>

          <div className="text-center">
            <h1 className="title-display text-3xl md:text-5xl mb-2">¿Listo para revelar?</h1>
            <p className="text-slate-400">Tu destino aguarda en este sobre</p>
          </div>

          <Button variant="primary" size="lg" icon={<Sparkles size={18} />} onClick={handleOpen}>
            Abrir sobre
          </Button>
        </div>
      </div>
    )
  }

  // FASE 2: RIPPING
  if (phase === 'ripping') {
    return (
      <div className="fixed inset-0 z-50 bg-void flex items-center justify-center">
        <div className="relative">
          <div className="w-64 h-80 md:w-80 md:h-[28rem] rounded-2xl bg-gradient-pack border-2 border-gold-500 shadow-glow-gold-lg animate-shake flex items-center justify-center">
            <div className="text-6xl md:text-8xl text-gold-300 font-display font-bold animate-pulse">✦</div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-96 h-96 rounded-full bg-gold-400/20 blur-3xl animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  // FASE 3: REVEALING
  if (phase === 'revealing') {
    return (
      <div className="fixed inset-0 z-50 bg-void bg-radial-gold overflow-y-auto">
        <div className="min-h-screen p-5 md:p-10 pb-24 md:pb-10 flex flex-col gap-6">

          {/* Cabecera + barra de acciones */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="eyebrow">✦ {pack.set}</span>
                <h2 className="title-display text-xl md:text-2xl mt-1">
                  {allRevealed ? 'Tu destino se ha revelado' : `${revealedCount} de ${cards.length} reveladas`}
                </h2>
              </div>
              {!allRevealed && (
                <Button variant="ghost" size="sm" onClick={handleRevealAll}>
                  Revelar todas
                </Button>
              )}
            </div>

            {allRevealed && (
              <div ref={actionBarRef} className="card p-3 md:p-4 bg-abyss flex flex-col gap-3">
                {/* Fila 1: selección + contador */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={toggleAll}
                    className="font-mono text-[11px] tracking-wider uppercase text-gold-300 hover:text-gold-200 transition-colors"
                  >
                    {allSelected ? 'Deseleccionar todas' : 'Seleccionar todas'}
                  </button>
                  {selectedCards.length > 0 && (
                    <span className="text-xs text-slate-500">
                      {selectedCards.length} carta{selectedCards.length > 1 ? 's' : ''}
                      {' · '}
                      <span className="text-gold-300">${totalValue.toLocaleString('es-CL')}</span>
                    </span>
                  )}
                </div>
                {/* Fila 2: botones */}
                <div className="grid grid-cols-2 md:flex gap-2">
                  <Button variant="ghost" onClick={handleGuardar} className="col-span-2 md:col-span-1">
                    Guardar para después
                  </Button>
                  <Button
                    variant="secondary"
                    icon={<Package size={14} />}
                    onClick={handleCanjear}
                    disabled={selectedCards.length === 0}
                  >
                    Canjear físico
                  </Button>
                  <Button
                    variant="primary"
                    icon={<Banknote size={14} />}
                    onClick={handleVender}
                    disabled={selectedCards.length === 0}
                  >
                    Vender crédito
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Grid de cartas */}
          <div className="flex-1 grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 place-items-center">
            {cards.map((card, index) => {
              const isRevealed = index < revealedCount
              const isSelected = selectedCards.includes(card.instanceId)
              const cardSize = isMobile ? 'xs' : 'sm'
              return (
                <div
                  key={card.instanceId}
                  className={`flex flex-col items-center ${isRevealed ? 'animate-reveal' : ''}`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* Nombre + lupa (solo cuando está revelada) */}
                  {isRevealed && (
                    <div className="flex items-center gap-0.5 mb-1 w-[90px] justify-center">
                      <span className="font-display text-[9px] text-slate-300 truncate">{card.name}</span>
                      <button
                        onClick={() => setZoomedCard(card)}
                        className="flex-shrink-0 text-slate-500 hover:text-gold-300 transition-colors"
                        aria-label="Expandir carta"
                      >
                        <ZoomIn size={10} />
                      </button>
                    </div>
                  )}

                  {/* Carta + ring de selección */}
                  <div className="relative w-fit">
                    <div
                      onClick={
                        allRevealed
                          ? () => toggleCard(card.instanceId)
                          : !isRevealed && index === revealedCount
                          ? () => handleReveal(index)
                          : undefined
                      }
                      className={`transition-all ${allRevealed ? 'cursor-pointer' : ''} ${
                        isSelected ? 'ring-4 ring-gold-400 rounded-xl' : ''
                      }`}
                    >
                      <Card
                        size={cardSize}
                        rarity={card.rarity}
                        name={card.name}
                        type={card.type}
                        cost={card.cost}
                        power={card.power}
                        toughness={card.toughness}
                        rulesText={card.rulesText}
                        art={card.art}
                        imageUri={card.imageUri}
                        isRevealed={isRevealed}
                        onClick={!allRevealed && !isRevealed && index === revealedCount ? () => handleReveal(index) : undefined}
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold-400 flex items-center justify-center">
                        <Check size={14} className="text-void" />
                      </div>
                    )}
                  </div>

                  {/* Precio (solo cuando todas reveladas) */}
                  {allRevealed && (
                    <div className="mt-1.5 text-center">
                      <span className="font-mono text-[10px] text-gold-300">
                        ${card.marketPrice.toLocaleString('es-CL')}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <CardZoom card={zoomedCard} onClose={() => setZoomedCard(null)} />

        </div>
      </div>
    )
  }

  return null
}
