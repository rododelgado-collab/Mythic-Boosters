import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Banknote, AlertTriangle, Check } from 'lucide-react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { useApp } from '../context/AppContext'

export function Vender() {
  const location = useLocation()
  const navigate = useNavigate()
  const { balance, addBalance, removeCards } = useApp()
  const selectedCards = location.state?.selectedCards || []

  const [confirmed, setConfirmed] = useState(false)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (selectedCards.length === 0) {
      navigate('/perfil')
    }
  }, [selectedCards.length, navigate])

  if (selectedCards.length === 0) return null

  const totalValue = selectedCards.reduce((sum, c) => sum + c.marketPrice, 0)
  const commission = Math.round(totalValue * 0.14)
  const finalCredit = totalValue - commission

  const handleConfirm = () => {
    if (!accepted) return
    const cardIds = selectedCards.map((c) => c.instanceId)
    removeCards(cardIds)
    addBalance(finalCredit)
    setConfirmed(true)
    setTimeout(() => {
      navigate('/perfil', { state: { tab: 'perfil' } })
    }, 2500)
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-void bg-radial-gold flex items-center justify-center p-5">
        <div className="card max-w-md w-full p-8 text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center text-green-400">
            <Check size={36} />
          </div>
          <div>
            <h2 className="title-display text-2xl md:text-3xl">¡Venta confirmada!</h2>
            <p className="text-slate-400 mt-2">
              Crédito agregado a tu cuenta
            </p>
          </div>
          <div className="card bg-void p-6 w-full">
            <span className="font-mono text-[10px] text-slate-500 tracking-wider">NUEVO SALDO</span>
            <div className="font-display font-bold text-4xl text-gold-200 mt-2">
              ${balance.toLocaleString('es-CL')}
            </div>
            <p className="text-xs text-green-500 mt-2">
              +${finalCredit.toLocaleString('es-CL')} agregados
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void bg-radial-gold p-5 md:p-10 pb-24 md:pb-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div>
          <span className="eyebrow">✦ VENDER POR CRÉDITO</span>
          <h1 className="title-display text-3xl md:text-5xl mt-2">Confirma la venta</h1>
          <p className="text-slate-400 mt-2">Conversión instantánea a crédito</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Cartas seleccionadas */}
          <div className="flex flex-col gap-4">
            <h2 className="title-display text-xl">Cartas a vender ({selectedCards.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedCards.map((card) => (
                <div key={card.instanceId} className="flex flex-col gap-2">
                  <Card
                    size="xs"
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
                  <span className="text-center font-mono text-[10px] text-gold-300">
                    ${card.marketPrice.toLocaleString('es-CL')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Resumen y confirmación */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="title-display text-xl mb-4">Resumen de venta</h2>

              <div className="card p-4 bg-void space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Valor de mercado</span>
                  <span className="font-mono text-slate-100">
                    ${totalValue.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Comisión (14%)</span>
                  <span className="font-mono text-red-400">
                    -${commission.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="border-t border-gold-400/10 pt-3 flex justify-between">
                  <span className="font-display text-slate-100">Crédito a recibir</span>
                  <span className="font-display font-bold text-2xl text-gold-200">
                    ${finalCredit.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              <div className="card p-4 bg-void mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tu saldo actual</span>
                  <span className="font-mono text-slate-100">
                    ${balance.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-400">Tras la venta</span>
                  <span className="font-mono text-green-400">
                    ${(balance + finalCredit).toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>

            {/* Advertencia */}
            <div className="card p-4 bg-red-500/5 border-red-500/30">
              <div className="flex gap-3">
                <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-display font-bold text-red-400 text-sm mb-2">
                    ACCIÓN IRREVERSIBLE
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Una vez vendidas, estas cartas ya no podrán ser canjeadas por físicas. 
                    El crédito se agregará inmediatamente a tu cuenta y podrás usarlo para 
                    comprar más sobres.
                  </p>
                </div>
              </div>
            </div>

            {/* Checkbox de confirmación */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded bg-void border-2 border-gold-400/50 accent-gold-400 cursor-pointer"
              />
              <span className="text-sm text-slate-300 leading-relaxed">
                Entiendo que esta acción es <strong className="text-slate-100">irreversible</strong> y 
                acepto vender estas cartas por el crédito indicado.
              </span>
            </label>

            <div className="flex flex-col gap-2">
              <Button
                variant="danger"
                size="lg"
                icon={<Banknote size={18} />}
                onClick={handleConfirm}
                disabled={!accepted}
                className="w-full"
              >
                Confirmar venta
              </Button>
              <Button variant="ghost" onClick={() => navigate(-1)} className="w-full">
                Volver
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}