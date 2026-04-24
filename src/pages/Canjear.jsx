import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Package, MapPin, Check, X, Plus } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { useApp } from '../context/AppContext'

export function Canjear() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addresses, activeAddressId, selectAddress, addAddress, removeCards, addOrder } = useApp()
  const selectedCards = location.state?.selectedCards || []

  const [selectedAddressId, setSelectedAddressId] = useState(() => activeAddressId)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newAddress, setNewAddress] = useState({ street: '', commune: '', city: '', region: '' })
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (selectedCards.length === 0) navigate('/perfil')
  }, [selectedCards.length, navigate])

  if (selectedCards.length === 0) return null

  const addressToUse = showNewForm
    ? newAddress
    : addresses.find((a) => a.id === selectedAddressId)

  const handleConfirm = () => {
    let finalAddress = addressToUse
    if (showNewForm && newAddress.street) {
      const saved = addAddress(newAddress)
      selectAddress(saved.id)
      finalAddress = newAddress
    } else if (selectedAddressId) {
      selectAddress(selectedAddressId)
    }
    addOrder({
      cards: selectedCards,
      address: finalAddress,
      status: 'pending',
    })
    const cardIds = selectedCards.map((c) => c.instanceId)
    removeCards(cardIds)
    setConfirmed(true)
    setTimeout(() => navigate('/perfil', { state: { tab: 'pedidos' } }), 2000)
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-void bg-radial-gold flex items-center justify-center p-5">
        <div className="card max-w-md w-full p-8 text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center text-green-400">
            <Check size={36} />
          </div>
          <div>
            <h2 className="title-display text-2xl md:text-3xl">¡Pedido confirmado!</h2>
            <p className="text-slate-400 mt-2">
              {selectedCards.length} carta{selectedCards.length > 1 ? 's' : ''} en camino a tu dirección
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Recibirás un email con el tracking de Chilexpress
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void bg-radial-gold p-5 md:p-10 pb-24 md:pb-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div>
          <span className="eyebrow">✦ CANJEAR POR FÍSICO</span>
          <h1 className="title-display text-3xl md:text-5xl mt-2">Confirma tu pedido</h1>
          <p className="text-slate-400 mt-2">Envío gratis · Entrega en 3-5 días hábiles</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Cartas seleccionadas */}
          <div className="flex flex-col gap-4">
            <h2 className="title-display text-xl">Cartas a canjear ({selectedCards.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedCards.map((card) => (
                <Card
                  key={card.instanceId}
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
              ))}
            </div>
          </div>

          {/* Right: Dirección */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="title-display text-xl">Dirección de envío</h2>
                <button
                  onClick={() => setShowNewForm((v) => !v)}
                  className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-gold-300 hover:text-gold-200 transition-colors"
                >
                  {showNewForm ? <X size={11} /> : <Plus size={11} />}
                  {showNewForm ? 'Cancelar' : 'Nueva'}
                </button>
              </div>

              {/* Formulario nueva dirección */}
              {showNewForm && (
                <div className="card p-4 bg-void flex flex-col gap-3">
                  <Input label="CALLE Y NÚMERO" placeholder="Av. Providencia 1234, Depto 501"
                    value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="COMUNA" placeholder="Providencia"
                      value={newAddress.commune} onChange={(e) => setNewAddress({ ...newAddress, commune: e.target.value })} />
                    <Input label="CIUDAD" placeholder="Santiago"
                      value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                  </div>
                  <Input label="REGIÓN" placeholder="Región Metropolitana"
                    value={newAddress.region} onChange={(e) => setNewAddress({ ...newAddress, region: e.target.value })} />
                </div>
              )}

              {/* Direcciones guardadas */}
              {!showNewForm && addresses.length > 0 && addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`card p-4 flex items-start gap-3 cursor-pointer transition-all ${
                    selectedAddressId === addr.id ? 'border-gold-400/60 bg-gold-400/5' : 'hover:border-gold-400/30'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedAddressId === addr.id ? 'border-gold-400 bg-gold-400' : 'border-slate-600'
                  }`}>
                    {selectedAddressId === addr.id && <Check size={9} className="text-void" />}
                  </div>
                  <div>
                    <p className="text-slate-100 text-sm">{addr.street}</p>
                    <p className="text-slate-400 text-sm">{addr.commune}, {addr.city}</p>
                    <p className="text-slate-400 text-sm">{addr.region}</p>
                  </div>
                </div>
              ))}

              {/* Sin direcciones */}
              {!showNewForm && addresses.length === 0 && (
                <div className="card p-4 bg-void text-center">
                  <p className="text-slate-500 text-sm">No tienes direcciones guardadas.</p>
                  <button onClick={() => setShowNewForm(true)}
                    className="font-mono text-[10px] tracking-wider uppercase text-gold-300 hover:text-gold-200 mt-2">
                    + Agregar dirección
                  </button>
                </div>
              )}
            </div>

            <div className="card p-4 bg-void space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Cartas</span>
                <span className="text-slate-100">{selectedCards.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Envío</span>
                <span className="text-green-500">Gratis</span>
              </div>
              <div className="border-t border-gold-400/10 pt-2 flex justify-between">
                <span className="font-display text-slate-100">Total</span>
                <span className="font-display font-bold text-gold-200">$0</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="lg"
                icon={<Package size={18} />}
                onClick={handleConfirm}
                disabled={showNewForm ? (!newAddress.street || !newAddress.commune || !newAddress.city || !newAddress.region) : !selectedAddressId}
                className="w-full"
              >
                Confirmar pedido
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