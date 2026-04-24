import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Package, Store, Sparkles, MapPin, Check, ZoomIn,
  Banknote, ArrowRight, Layers, User, ClipboardList, Wallet,
  CreditCard, Plus, Trash2, X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card } from '../components/Card'
import { CardZoom } from '../components/CardZoom'
import { Pack } from '../components/Pack'
import { Link } from 'react-router-dom'

const TABS = [
  { id: 'perfil',    label: 'Mi Perfil',          icon: User },
  { id: 'coleccion', label: 'Mi Colección',        icon: Layers },
  { id: 'pedidos',   label: 'Mis Pedidos',         icon: ClipboardList },
  { id: 'saldo',     label: 'Agregar Saldo',       icon: Wallet },
  { id: 'direccion', label: 'Dirección de envío',  icon: MapPin },
]

export function Perfil() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.tab ?? 'perfil')

  // Si se navega al perfil con un tab específico (desde el dropdown)
  useEffect(() => {
    if (location.state?.tab) setActiveTab(location.state.tab)
  }, [location.state])

  return (
    <div className="min-h-screen bg-radial-gold">
      <div className="max-w-7xl mx-auto px-5 md:px-16 py-8 md:py-12">

        {/* Tabs de navegación */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-1 border-b border-gold-400/15">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-mono text-[11px] tracking-wider uppercase whitespace-nowrap transition-colors ${
                activeTab === id
                  ? 'text-gold-300 border-b-2 border-gold-400 -mb-px bg-gold-400/5'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Contenido de cada tab */}
        {activeTab === 'perfil'    && <PerfilTab    onTabChange={setActiveTab} />}
        {activeTab === 'coleccion' && <ColeccionTab />}
        {activeTab === 'pedidos'   && <PedidosTab />}
        {activeTab === 'saldo'     && <SaldoTab />}
        {activeTab === 'direccion' && <DireccionTab />}

      </div>
    </div>
  )
}

/* ─── Tab: Mi Perfil ─────────────────────────────────────────────────── */
function PerfilTab({ onTabChange }) {
  const { user, balance, unopenedPacks, collection } = useApp()
  const navigate = useNavigate()
  const recentCards = collection.slice(-6).reverse()
  const [zoomedCard, setZoomedCard] = useState(null)

  return (
    <div className="flex flex-col gap-10">
      <div>
        <span className="eyebrow">✦ BIENVENIDO DE VUELTA</span>
        <h1 className="title-display text-3xl md:text-5xl mt-2">
          Hola, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-400 mt-2">Tu portal al multiverso te espera</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        <StatBox label="SALDO" value={`$${balance.toLocaleString('es-CL')}`} accent="text-gold-200" />
        <StatBox
          label="SOBRES SIN ABRIR"
          value={unopenedPacks.length}
          accent="text-rarity-mythic"
          onClick={() => navigate('/tienda')}
        />
        <StatBox
          label="CARTAS EN COLECCIÓN"
          value={collection.length}
          accent="text-rarity-rare"
          onClick={() => onTabChange('coleccion')}
        />
      </div>

      {/* Sobres sin abrir */}
      {unopenedPacks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="title-display text-2xl md:text-3xl">Sobres sin abrir</h2>
            <span className="badge badge-gold">{unopenedPacks.length} pendientes</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {unopenedPacks.map((pack) => (
              <div key={pack.id} className="flex flex-col items-center gap-3">
                <div className="relative">
                  {pack.isGift && (
                    <span className="absolute -top-2 -right-2 z-10 bg-rarity-mythic text-void font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full">
                      REGALO
                    </span>
                  )}
                  <Pack
                    size="lg"
                    set={pack.set}
                    price={pack.price}
                    onClick={() => navigate(`/abrir/${pack.id}`)}
                  />
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Sparkles size={14} />}
                  onClick={() => navigate(`/abrir/${pack.id}`)}
                >
                  Abrir ahora
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {unopenedPacks.length === 0 && (
        <section className="card p-10 bg-gradient-to-br from-night to-void text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gold-400/15 border-2 border-gold-400/40 flex items-center justify-center text-gold-300">
            <Package size={32} />
          </div>
          <h2 className="title-display text-2xl">Aún no tienes sobres</h2>
          <p className="text-slate-400 max-w-md">
            Visita la tienda para comprar tu primer sobre y empezar tu colección.
          </p>
          <Link to="/tienda">
            <Button variant="primary" size="lg" icon={<Store size={16} />}>Ir a la tienda</Button>
          </Link>
        </section>
      )}

      {/* Cartas recientes */}
      {recentCards.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="title-display text-2xl md:text-3xl">Agregadas recientemente</h2>
            <button
              onClick={() => onTabChange('coleccion')}
              className="flex items-center gap-1 text-sm text-gold-300 hover:text-gold-200"
            >
              Ver colección <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {recentCards.map((card) => (
              <div key={card.instanceId} className="flex flex-col items-center">
                <div className="flex items-center gap-1 mb-1.5 w-[90px] md:w-[140px] justify-center">
                  <span className="font-display text-[10px] text-slate-300 truncate">{card.name}</span>
                  <button
                    onClick={() => setZoomedCard(card)}
                    className="flex-shrink-0 text-slate-500 hover:text-gold-300 transition-colors"
                  >
                    <ZoomIn size={11} />
                  </button>
                </div>
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
            ))}
          </div>
          <CardZoom card={zoomedCard} onClose={() => setZoomedCard(null)} />
        </section>
      )}
    </div>
  )
}

function StatBox({ label, value, accent = 'text-slate-100', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card p-4 md:p-6 flex flex-col gap-2 ${onClick ? 'cursor-pointer hover:border-gold-400/40 transition-colors' : ''}`}
    >
      <span className="font-mono text-[10px] text-slate-500 tracking-wider">{label}</span>
      <span className={`font-display font-bold text-xl md:text-3xl ${accent}`}>{value}</span>
    </div>
  )
}

/* ─── Tab: Mi Colección ─────────────────────────────────────────────── */
function ColeccionTab() {
  const { collection } = useApp()
  const navigate = useNavigate()
  const [selectedCards, setSelectedCards] = useState([])
  const [zoomedCard, setZoomedCard] = useState(null)

  const allSelected = collection.length > 0 && selectedCards.length === collection.length
  const selectedCardsData = collection.filter((c) => selectedCards.includes(c.instanceId))
  const totalValue = selectedCardsData.reduce((sum, c) => sum + c.marketPrice, 0)

  const toggleCard = (instanceId) =>
    setSelectedCards((prev) =>
      prev.includes(instanceId) ? prev.filter((id) => id !== instanceId) : [...prev, instanceId]
    )

  const toggleAll = () =>
    setSelectedCards(allSelected ? [] : collection.map((c) => c.instanceId))

  const handleCanjear = () => {
    if (!selectedCards.length) return
    navigate('/canjear', { state: { selectedCards: selectedCardsData } })
  }

  const handleVender = () => {
    if (!selectedCards.length) return
    navigate('/vender', { state: { selectedCards: selectedCardsData } })
  }

  if (collection.length === 0) {
    return (
      <div className="card p-10 text-center flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gold-400/15 border-2 border-gold-400/40 flex items-center justify-center text-gold-300">
          <Layers size={32} />
        </div>
        <h2 className="title-display text-2xl">Tu colección está vacía</h2>
        <p className="text-slate-400">Abre sobres para empezar a coleccionar.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">✦ MI COLECCIÓN</span>
        <h1 className="title-display text-3xl mt-2">Mis cartas</h1>
        <p className="text-slate-400 mt-1">{collection.length} carta{collection.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="card p-4 bg-abyss flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleAll}
            className="font-mono text-[11px] tracking-wider uppercase text-gold-300 hover:text-gold-200 transition-colors"
          >
            {allSelected ? 'Deseleccionar todas' : 'Seleccionar todas'}
          </button>
          {selectedCards.length > 0 && (
            <span className="text-sm text-slate-500">
              {selectedCards.length} carta{selectedCards.length > 1 ? 's' : ''}{' · '}
              <span className="text-gold-300">${totalValue.toLocaleString('es-CL')}</span>
            </span>
          )}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="secondary" icon={<Package size={16} />} onClick={handleCanjear}
            disabled={!selectedCards.length} className="flex-1 md:flex-none">
            Canjear físico
          </Button>
          <Button variant="primary" icon={<Banknote size={16} />} onClick={handleVender}
            disabled={!selectedCards.length} className="flex-1 md:flex-none">
            Vender por crédito
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
        {collection.map((card) => {
          const isSelected = selectedCards.includes(card.instanceId)
          return (
            <div key={card.instanceId} className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1.5 w-[90px] md:w-[140px] justify-center">
                <span className="font-display text-[10px] text-slate-300 truncate">{card.name}</span>
                <button onClick={() => setZoomedCard(card)}
                  className="flex-shrink-0 text-slate-500 hover:text-gold-300 transition-colors">
                  <ZoomIn size={11} />
                </button>
              </div>
              <div className="relative w-fit">
                <div onClick={() => toggleCard(card.instanceId)}
                  className={`cursor-pointer transition-all ${isSelected ? 'ring-4 ring-gold-400 rounded-xl' : ''}`}>
                  <Card size="sm" rarity={card.rarity} name={card.name} type={card.type}
                    cost={card.cost} power={card.power} toughness={card.toughness}
                    rulesText={card.rulesText} art={card.art} imageUri={card.imageUri} />
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

      <CardZoom card={zoomedCard} onClose={() => setZoomedCard(null)} />
    </div>
  )
}

/* ─── Tab: Mis Pedidos ──────────────────────────────────────────────── */
const STATUS_LABEL = {
  pending:   { label: 'Procesando',  classes: 'bg-gold-400/15 text-gold-300 border-gold-400/30' },
  shipped:   { label: 'En camino',   classes: 'bg-blue-500/15 text-blue-300 border-blue-400/30' },
  delivered: { label: 'Entregado',   classes: 'bg-green-500/15 text-green-400 border-green-500/30' },
}

function PedidosTab() {
  const { orders } = useApp()
  const [openId, setOpenId] = useState(null)

  if (orders.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <span className="eyebrow">✦ MIS PEDIDOS</span>
          <h1 className="title-display text-3xl mt-2">Historial de pedidos</h1>
        </div>
        <div className="card p-10 text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gold-400/15 border-2 border-gold-400/40 flex items-center justify-center text-gold-300">
            <ClipboardList size={32} />
          </div>
          <h2 className="title-display text-2xl">Sin pedidos aún</h2>
          <p className="text-slate-400 max-w-md">
            Aquí aparecerán tus pedidos de cartas físicas una vez que canjees cartas de tu colección.
          </p>
          <Link to="/tienda">
            <Button variant="primary" icon={<Store size={16} />}>Ir a la tienda</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="eyebrow">✦ MIS PEDIDOS</span>
        <h1 className="title-display text-3xl mt-2">Historial de pedidos</h1>
        <p className="text-slate-400 mt-1">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-col gap-3">
        {orders.map((order, i) => {
          const isOpen = openId === order.id
          const status = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending
          const orderNum = String(orders.length - i).padStart(4, '0')
          const dateStr = new Date(order.date).toLocaleDateString('es-CL', {
            day: '2-digit', month: 'short', year: 'numeric',
          })

          return (
            <div key={order.id} className="card bg-abyss overflow-hidden">
              {/* Cabecera — siempre visible, clic para expandir */}
              <button
                onClick={() => setOpenId(isOpen ? null : order.id)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gold-400/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-slate-500 tracking-wider">PEDIDO #{orderNum}</span>
                    <span className="font-display font-bold text-slate-100 mt-0.5">
                      {order.cards.length} carta{order.cards.length !== 1 ? 's' : ''}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 mt-0.5">{dateStr}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full border ${status.classes}`}>
                    {status.label}
                  </span>
                  <ArrowRight
                    size={16}
                    className={`text-slate-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              {/* Detalle expandido */}
              {isOpen && (
                <div className="border-t border-gold-400/10 p-4 md:p-5 flex flex-col gap-5">

                  {/* Cartas */}
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 tracking-wider">CARTAS</span>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-3">
                      {order.cards.map((card) => (
                        <div key={card.instanceId} className="flex flex-col items-center gap-1">
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
                          <span className="font-display text-[9px] text-slate-400 truncate w-full text-center">
                            {card.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dirección */}
                  <div>
                    <span className="font-mono text-[10px] text-slate-500 tracking-wider">DIRECCIÓN DE ENVÍO</span>
                    <div className="mt-2 flex items-start gap-2">
                      <MapPin size={13} className="text-gold-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-300 leading-relaxed">
                        <p>{order.address.street}</p>
                        <p className="text-slate-400">{order.address.commune}, {order.address.city}</p>
                        <p className="text-slate-400">{order.address.region}</p>
                      </div>
                    </div>
                  </div>

                  {/* Estado + envío */}
                  <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-void">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10px] text-slate-500 tracking-wider">ESTADO</span>
                      <span className={`font-mono text-[11px] tracking-wider ${status.classes.split(' ')[1]}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-right">
                      <span className="font-mono text-[10px] text-slate-500 tracking-wider">ENVÍO</span>
                      <span className="font-mono text-[11px] text-green-400">Gratis · Chilexpress</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Tab: Agregar Saldo ────────────────────────────────────────────── */
const AMOUNTS = [5000, 10000, 20000, 50000]

function cardBrand(number) {
  const n = number.replace(/\s/g, '')
  if (/^4/.test(n)) return 'visa'
  if (/^5[1-5]/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  return null
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

function CardBrandBadge({ brand }) {
  if (brand === 'visa') return (
    <span className="font-display font-bold text-[11px] tracking-[0.15em] text-blue-300">VISA</span>
  )
  if (brand === 'mastercard') return (
    <span className="flex gap-[-4px]">
      <span className="inline-block w-4 h-4 rounded-full bg-red-500 opacity-90" />
      <span className="inline-block w-4 h-4 rounded-full bg-yellow-400 opacity-90 -ml-2" />
    </span>
  )
  if (brand === 'amex') return (
    <span className="font-display font-bold text-[11px] tracking-wider text-sky-300">AMEX</span>
  )
  return <CreditCard size={16} className="text-slate-500" />
}

function SaldoTab() {
  const { balance, addBalance } = useApp()
  const [savedCards, setSavedCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [showCardForm, setShowCardForm] = useState(false)
  const [custom, setCustom] = useState('')
  const [added, setAdded] = useState(null)
  const [confirmAmount, setConfirmAmount] = useState(null) // popup

  // Form de nueva tarjeta
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState({})

  const handleAdd = (amount) => {
    addBalance(amount)
    setAdded(amount)
    setCustom('')
    setConfirmAmount(null)
    setTimeout(() => setAdded(null), 2500)
  }

  const handleCustom = (e) => {
    e.preventDefault()
    const amount = parseInt(custom.replace(/\D/g, ''), 10)
    if (!amount || amount < 1000) return
    handleAdd(amount)
  }

  const validateCard = () => {
    const e = {}
    const digits = cardForm.number.replace(/\s/g, '')
    if (digits.length < 15) e.number = 'Número inválido'
    if (!cardForm.name.trim()) e.name = 'Ingresa el nombre'
    if (cardForm.expiry.length < 5) e.expiry = 'Fecha inválida'
    if (cardForm.cvv.length < 3) e.cvv = 'CVV inválido'
    return e
  }

  const handleSaveCard = (e) => {
    e.preventDefault()
    const errs = validateCard()
    if (Object.keys(errs).length > 0) { setCardErrors(errs); return }
    const digits = cardForm.number.replace(/\s/g, '')
    const newCard = {
      id: crypto.randomUUID(),
      last4: digits.slice(-4),
      name: cardForm.name.trim(),
      expiry: cardForm.expiry,
      brand: cardBrand(cardForm.number),
    }
    setSavedCards((prev) => [...prev, newCard])
    setSelectedCard(newCard.id)
    setCardForm({ number: '', name: '', expiry: '', cvv: '' })
    setCardErrors({})
    setShowCardForm(false)
  }

  const handleRemoveCard = (id) => {
    setSavedCards((prev) => prev.filter((c) => c.id !== id))
    if (selectedCard === id) setSelectedCard(null)
  }

  const canRecharge = savedCards.length > 0 && selectedCard

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <span className="eyebrow">✦ AGREGAR SALDO</span>
        <h1 className="title-display text-3xl mt-2">Recargar cuenta</h1>
        <p className="text-slate-400 mt-1">Selecciona una tarjeta y elige el monto a agregar</p>
      </div>

      {/* Saldo actual */}
      <div className="card p-5 bg-abyss flex items-center justify-between">
        <span className="font-mono text-[11px] text-slate-500 tracking-wider">SALDO ACTUAL</span>
        <span className="font-display font-bold text-2xl text-gold-200">
          ${balance.toLocaleString('es-CL')}
        </span>
      </div>

      {/* Tarjetas guardadas */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-slate-500 tracking-wider">MIS TARJETAS</span>
          {!showCardForm && (
            <button
              onClick={() => setShowCardForm(true)}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase text-gold-300 hover:text-gold-200 transition-colors"
            >
              <Plus size={12} /> Agregar tarjeta
            </button>
          )}
        </div>

        {savedCards.length === 0 && !showCardForm && (
          <div className="card p-6 flex flex-col items-center gap-3 text-center border-dashed">
            <CreditCard size={28} className="text-slate-600" />
            <p className="text-slate-500 text-sm">No tienes tarjetas guardadas</p>
            <button
              onClick={() => setShowCardForm(true)}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase text-gold-300 hover:text-gold-200 transition-colors"
            >
              <Plus size={12} /> Agregar tarjeta
            </button>
          </div>
        )}

        {savedCards.map((card) => (
          <div
            key={card.id}
            onClick={() => setSelectedCard(card.id)}
            className={`card p-4 flex items-center justify-between cursor-pointer transition-all ${
              selectedCard === card.id ? 'border-gold-400/60 bg-gold-400/5' : 'hover:border-gold-400/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedCard === card.id ? 'border-gold-400 bg-gold-400' : 'border-slate-600'
              }`}>
                {selectedCard === card.id && <Check size={11} className="text-void" />}
              </div>
              <CardBrandBadge brand={card.brand} />
              <div>
                <p className="font-mono text-sm text-slate-200">•••• {card.last4}</p>
                <p className="font-mono text-[10px] text-slate-500">{card.name} · {card.expiry}</p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleRemoveCard(card.id) }}
              className="text-slate-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {/* Formulario nueva tarjeta */}
        {showCardForm && (
          <form onSubmit={handleSaveCard} className="card p-5 bg-abyss flex flex-col gap-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[11px] text-slate-400 tracking-wider">NUEVA TARJETA</span>
              <button type="button" onClick={() => { setShowCardForm(false); setCardErrors({}) }}
                className="text-slate-500 hover:text-slate-300 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Número */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-slate-500 tracking-wider">NÚMERO DE TARJETA</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={cardForm.number}
                  onChange={(e) => setCardForm((f) => ({ ...f, number: formatCardNumber(e.target.value) }))}
                  className={`w-full px-4 py-2.5 rounded-lg bg-void border text-slate-100 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-gold-400/50 ${cardErrors.number ? 'border-red-500/60' : 'border-gold-400/20'}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CardBrandBadge brand={cardBrand(cardForm.number)} />
                </span>
              </div>
              {cardErrors.number && <span className="text-red-400 text-[11px]">{cardErrors.number}</span>}
            </div>

            {/* Nombre */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-slate-500 tracking-wider">NOMBRE EN LA TARJETA</label>
              <input
                type="text"
                placeholder="DIEGO CARDENAS"
                value={cardForm.name}
                onChange={(e) => setCardForm((f) => ({ ...f, name: e.target.value.toUpperCase() }))}
                className={`w-full px-4 py-2.5 rounded-lg bg-void border text-slate-100 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-gold-400/50 ${cardErrors.name ? 'border-red-500/60' : 'border-gold-400/20'}`}
              />
              {cardErrors.name && <span className="text-red-400 text-[11px]">{cardErrors.name}</span>}
            </div>

            {/* Vencimiento + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-slate-500 tracking-wider">VENCIMIENTO</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/AA"
                  value={cardForm.expiry}
                  onChange={(e) => setCardForm((f) => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                  className={`w-full px-4 py-2.5 rounded-lg bg-void border text-slate-100 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-gold-400/50 ${cardErrors.expiry ? 'border-red-500/60' : 'border-gold-400/20'}`}
                />
                {cardErrors.expiry && <span className="text-red-400 text-[11px]">{cardErrors.expiry}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] text-slate-500 tracking-wider">CVV</label>
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="•••"
                  maxLength={4}
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  className={`w-full px-4 py-2.5 rounded-lg bg-void border text-slate-100 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-gold-400/50 ${cardErrors.cvv ? 'border-red-500/60' : 'border-gold-400/20'}`}
                />
                {cardErrors.cvv && <span className="text-red-400 text-[11px]">{cardErrors.cvv}</span>}
              </div>
            </div>

            <Button type="submit" variant="primary" icon={<CreditCard size={15} />} className="w-full mt-1">
              Guardar tarjeta
            </Button>
          </form>
        )}
      </div>

      {/* Montos rápidos */}
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] text-slate-500 tracking-wider">MONTO A AGREGAR</span>
        <div className="grid grid-cols-2 gap-3">
          {AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => canRecharge && setConfirmAmount(amount)}
              disabled={!canRecharge}
              className={`card p-4 text-left transition-colors group ${canRecharge ? 'hover:border-gold-400/40 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            >
              <span className="font-display font-bold text-xl text-gold-200 group-hover:text-gold-100">
                ${amount.toLocaleString('es-CL')}
              </span>
              <p className="font-mono text-[10px] text-slate-500 mt-1 tracking-wider">AGREGAR AL SALDO</p>
            </button>
          ))}
        </div>
      </div>

      {/* Monto personalizado */}
      <form onSubmit={handleCustom} className="card p-5 bg-abyss flex flex-col gap-3">
        <span className="font-mono text-[11px] text-slate-500 tracking-wider">MONTO PERSONALIZADO</span>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej: 15.000"
              value={custom}
              disabled={!canRecharge}
              onChange={(e) => setCustom(e.target.value)}
              className="w-full pl-7 pr-4 py-2.5 rounded-lg bg-void border border-gold-400/20 text-slate-100 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-gold-400/50 disabled:opacity-40"
            />
          </div>
          <Button type="submit" variant="primary" icon={<Wallet size={15} />} disabled={!canRecharge}>
            Agregar
          </Button>
        </div>
        <p className="font-mono text-[10px] text-slate-600">
          {canRecharge ? 'Mínimo $1.000' : 'Agrega una tarjeta para continuar'}
        </p>
      </form>

      {/* Confirmación */}
      {added && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
          <Check size={16} />
          <span className="font-mono text-[11px] tracking-wider">
            +${added.toLocaleString('es-CL')} agregados correctamente
          </span>
        </div>
      )}

      {/* Popup de confirmación */}
      {confirmAmount && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setConfirmAmount(null)}
        >
          <div
            className="card w-full max-w-sm p-6 bg-abyss flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-gold-400/15 border-2 border-gold-400/40 flex items-center justify-center text-gold-300">
                <Wallet size={24} />
              </div>
              <h2 className="title-display text-xl">Confirmar recarga</h2>
              <p className="text-slate-400 text-sm">
                ¿Deseas agregar{' '}
                <span className="text-gold-200 font-bold">${confirmAmount.toLocaleString('es-CL')}</span>{' '}
                a tu saldo?
              </p>
            </div>

            {/* Detalle */}
            <div className="card bg-void p-4 space-y-2">
              {(() => {
                const card = savedCards.find((c) => c.id === selectedCard)
                return card ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Tarjeta</span>
                    <span className="font-mono text-slate-200 flex items-center gap-2">
                      <CardBrandBadge brand={card.brand} />
                      •••• {card.last4}
                    </span>
                  </div>
                ) : null
              })()}
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Monto</span>
                <span className="font-mono text-gold-300">${confirmAmount.toLocaleString('es-CL')}</span>
              </div>
              <div className="border-t border-gold-400/10 pt-2 flex items-center justify-between">
                <span className="font-display text-slate-100">Nuevo saldo</span>
                <span className="font-display font-bold text-gold-200">
                  ${(balance + confirmAmount).toLocaleString('es-CL')}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setConfirmAmount(null)}>
                Cancelar
              </Button>
              <Button variant="primary" className="flex-1" icon={<Check size={15} />} onClick={() => handleAdd(confirmAmount)}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Tab: Dirección de envío ───────────────────────────────────────── */
const EMPTY_ADDRESS = { street: '', commune: '', city: '', region: '' }

function DireccionTab() {
  const { addresses, activeAddressId, addAddress, removeAddress, selectAddress } = useApp()
  const [form, setForm] = useState(EMPTY_ADDRESS)
  const [showForm, setShowForm] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.street.trim()) return
    addAddress(form)
    setForm(EMPTY_ADDRESS)
    setShowForm(false)
  }

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  })

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <span className="eyebrow">✦ DIRECCIÓN DE ENVÍO</span>
        <h1 className="title-display text-3xl mt-2">Mis direcciones</h1>
        <p className="text-slate-400 mt-1">Selecciona cuál usar por defecto al canjear cartas</p>
      </div>

      {/* Encabezado + botón agregar */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-slate-500 tracking-wider">
          {addresses.length > 0 ? `${addresses.length} DIRECCIÓN${addresses.length > 1 ? 'ES' : ''} GUARDADA${addresses.length > 1 ? 'S' : ''}` : 'MIS DIRECCIONES'}
        </span>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase text-gold-300 hover:text-gold-200 transition-colors"
        >
          {showForm ? <X size={12} /> : <Plus size={12} />}
          {showForm ? 'Cancelar' : 'Agregar dirección'}
        </button>
      </div>

      {/* Formulario nueva dirección */}
      {showForm && (
        <form onSubmit={handleSave} className="card p-6 bg-abyss flex flex-col gap-4">
          <span className="font-mono text-[10px] text-slate-500 tracking-wider">NUEVA DIRECCIÓN</span>
          <Input label="CALLE Y NÚMERO" placeholder="Av. Providencia 1234, Depto 501" {...field('street')} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="COMUNA" placeholder="Providencia" {...field('commune')} />
            <Input label="CIUDAD" placeholder="Santiago" {...field('city')} />
          </div>
          <Input label="REGIÓN" placeholder="Región Metropolitana" {...field('region')} />
          <Button type="submit" variant="primary" icon={<MapPin size={16} />} className="w-full mt-2">
            Guardar dirección
          </Button>
        </form>
      )}

      {/* Lista de direcciones */}
      {addresses.length > 0 && (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => {
            const isActive = addr.id === activeAddressId
            return (
              <div
                key={addr.id}
                onClick={() => selectAddress(addr.id)}
                className={`card p-4 flex items-start justify-between gap-3 cursor-pointer transition-all ${
                  isActive ? 'border-gold-400/60 bg-gold-400/5' : 'hover:border-gold-400/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isActive ? 'border-gold-400 bg-gold-400' : 'border-slate-600'
                  }`}>
                    {isActive && <Check size={11} className="text-void" />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-slate-100 text-sm">{addr.street}</p>
                    <p className="text-slate-400 text-sm">{addr.commune}, {addr.city}</p>
                    <p className="text-slate-400 text-sm">{addr.region}</p>
                    {isActive && (
                      <span className="font-mono text-[10px] text-gold-300 tracking-wider mt-1">
                        ✦ DIRECCIÓN DE ENVÍO ACTIVA
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeAddress(addr.id) }}
                  className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Estado vacío */}
      {addresses.length === 0 && !showForm && (
        <div className="card p-8 text-center flex flex-col items-center gap-4">
          <MapPin size={28} className="text-slate-600" />
          <p className="text-slate-500 text-sm">No tienes direcciones guardadas</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase text-gold-300 hover:text-gold-200 transition-colors"
          >
            <Plus size={12} /> Agregar dirección
          </button>
        </div>
      )}
    </div>
  )
}
