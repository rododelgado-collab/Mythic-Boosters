import { Link, useNavigate } from 'react-router-dom'
import { Package, Store, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '../components/Button'
import { Pack } from '../components/Pack'
import { Card } from '../components/Card'
import { useApp } from '../context/AppContext'

export function Feed() {
  const { user, balance, unopenedPacks, collection } = useApp()
  const navigate = useNavigate()

  const recentCards = collection.slice(-6).reverse()

  return (
    <div className="px-5 md:px-16 py-8 md:py-12 bg-radial-gold min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div>
          <span className="eyebrow">✦ BIENVENIDO DE VUELTA</span>
          <h1 className="title-display text-3xl md:text-5xl mt-2">
            Hola, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-400 mt-2">Tu portal al multiverso te espera</p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-6">
          <StatBox label="SALDO" value={`$${balance.toLocaleString('es-CL')}`} accent="text-gold-200" />
          <StatBox label="SOBRES SIN ABRIR" value={unopenedPacks.length} accent="text-rarity-mythic" />
          <StatBox label="CARTAS EN COLECCIÓN" value={collection.length} accent="text-rarity-rare" to="/coleccion" />
        </div>

        {unopenedPacks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="title-display text-2xl md:text-3xl">Sobres sin abrir</h2>
              <span className="badge badge-gold">{unopenedPacks.length} pendientes</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {unopenedPacks.map((pack) => (
                <div key={pack.id} className="flex flex-col items-center gap-3">
                  <Pack
                    size="lg"
                    set={pack.set}
                    price={pack.price}
                    onClick={() => navigate(`/abrir/${pack.id}`)}
                  />
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
          <section className="card p-10 md:p-16 bg-gradient-to-br from-night to-void text-center flex flex-col items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gold-400/15 border-2 border-gold-400/40 flex items-center justify-center text-gold-300">
              <Package size={32} />
            </div>
            <h2 className="title-display text-2xl md:text-3xl">
              Aún no tienes sobres
            </h2>
            <p className="text-slate-400 max-w-md">
              Visita la tienda para comprar tu primer sobre y empezar tu colección.
            </p>
            <Link to="/tienda">
              <Button variant="primary" size="lg" icon={<Store size={16} />}>
                Ir a la tienda
              </Button>
            </Link>
          </section>
        )}

        {recentCards.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="title-display text-2xl md:text-3xl">Agregadas recientemente</h2>
              <Link to="/coleccion" className="flex items-center gap-1 text-sm text-gold-300 hover:text-gold-200">
                Ver colección <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {recentCards.map((card) => (
                <Card
                  key={card.instanceId}
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
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value, accent = 'text-slate-100', to }) {
  const content = (
    <div className={`card p-4 md:p-6 flex flex-col gap-2 ${to ? 'hover:border-gold-400/40 transition-colors cursor-pointer' : ''}`}>
      <span className="font-mono text-[10px] text-slate-500 tracking-wider">{label}</span>
      <span className={`font-display font-bold text-xl md:text-3xl ${accent}`}>{value}</span>
    </div>
  )
  if (to) return <Link to={to}>{content}</Link>
  return content
}