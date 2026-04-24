import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pack } from '../components/Pack'
import { Button } from '../components/Button'
import { useApp } from '../context/AppContext'
import { ShoppingCart, RefreshCw, Wallet } from 'lucide-react'

const PACK_PRICE = 4990

export function Tienda() {
  const navigate = useNavigate()
  const { isAuthenticated, balance, deductBalance, addPack, sets, setsLoading, setsError, loadSets } = useApp()
  const [selectedSet, setSelectedSet] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSets()
  }, [loadSets])

  const handleSelectSet = (set) => {
    setSelectedSet(set)
    setError(null)
  }

  const handleBuy = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (balance < PACK_PRICE) {
      setError(`Te faltan $${(PACK_PRICE - balance).toLocaleString('es-CL')}`)
      return
    }
    deductBalance(PACK_PRICE)
    addPack({
      set_code: selectedSet.code,
      set: selectedSet.code.toUpperCase(),
      name: selectedSet.name,
      price: PACK_PRICE,
      description: `${selectedSet.card_count} cartas · 1 rara o superior garantizada`,
    })
    setSelectedSet(null)
    navigate('/perfil', { state: { tab: 'perfil' } })
  }

  return (
    <div className="px-5 md:px-16 py-8 md:py-12 bg-radial-gold min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="eyebrow">✦ TIENDA · ÚLTIMAS EDICIONES</span>
          <h1 className="title-display text-3xl md:text-5xl mt-2">Sobres disponibles</h1>
          <p className="text-slate-400 mt-2">Elige tu próximo destino</p>
        </div>

        {/* Loading */}
        {setsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-[240px] h-[320px] rounded-2xl bg-abyss border border-gold-400/10" />
                <div className="h-5 w-32 rounded bg-abyss" />
                <div className="h-4 w-24 rounded bg-abyss" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {setsError && !setsLoading && (
          <div className="card p-8 text-center flex flex-col items-center gap-4">
            <p className="text-red-400">{setsError}</p>
            <Button
              variant="ghost"
              icon={<RefreshCw size={16} />}
              onClick={() => loadSets()}
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Sets */}
        {!setsLoading && !setsError && sets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {sets.map((set) => (
              <div key={set.code} className="flex flex-col items-center gap-4">
                <Pack
                  size="lg"
                  set={set.code.toUpperCase()}
                  price={PACK_PRICE}
                  onClick={() => handleSelectSet(set)}
                />
                <div className="text-center">
                  <h3 className="font-display font-bold text-slate-100 text-lg">{set.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {set.card_count} cartas · {new Date(set.released_at).getFullYear()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de compra */}
        {selectedSet && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedSet(null)}
          >
            <div
              className="card w-full max-w-sm md:max-w-md p-5 md:p-8 bg-abyss"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <Pack size="md" set={selectedSet.code.toUpperCase()} price={PACK_PRICE} />
                <div>
                  <h2 className="title-display text-2xl">{selectedSet.name}</h2>
                  <p className="text-slate-400 mt-1">
                    {selectedSet.card_count} cartas · 1 rara o superior garantizada
                  </p>
                </div>

                <div className="w-full card bg-void p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Precio</span>
                    <span className="font-mono text-slate-100">
                      ${PACK_PRICE.toLocaleString('es-CL')}
                    </span>
                  </div>
                  {isAuthenticated && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Tu saldo</span>
                        <span className="font-mono text-gold-300">
                          ${balance.toLocaleString('es-CL')}
                        </span>
                      </div>
                      <div className="border-t border-gold-400/10 pt-2 flex justify-between">
                        <span className="font-display text-slate-100">Tras la compra</span>
                        <span className="font-display font-bold text-gold-200">
                          ${(balance - PACK_PRICE).toLocaleString('es-CL')}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {error && (
                  <div className="w-full px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between gap-3">
                    <span>{error}</span>
                    <button
                      onClick={() => { setSelectedSet(null); navigate('/perfil', { state: { tab: 'saldo' } }) }}
                      className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-gold-300 hover:text-gold-200 whitespace-nowrap transition-colors"
                    >
                      <Wallet size={12} /> Agregar saldo
                    </button>
                  </div>
                )}

                <div className="flex flex-col w-full gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<ShoppingCart size={16} />}
                    onClick={handleBuy}
                    className="w-full"
                  >
                    {isAuthenticated ? 'Comprar sobre' : 'Iniciar sesión para comprar'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedSet(null)}
                    className="w-full"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
