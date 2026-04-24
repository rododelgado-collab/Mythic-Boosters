import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, Package, Repeat, ArrowRight } from 'lucide-react'
import { Pack } from '../components/Pack'
import { Button } from '../components/Button'

export function Home() {
  const location = useLocation()

  // Scroll a la sección si se navegó aquí desde otra página
  useEffect(() => {
    if (location.state?.scrollTo === 'como-funciona') {
      setTimeout(() => {
        document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location.state])

  const scrollToComoFunciona = () => {
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-radial-gold">
      <section className="px-5 md:px-16 py-12 md:py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="flex flex-col gap-6">
            <span className="eyebrow">✦ EDICIÓN ARCANA · YA DISPONIBLE</span>

            <h1 className="title-display text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
              Abre tu<br />destino
            </h1>

            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-lg">
              Sobres digitales de Magic: The Gathering. Revela tus cartas, canjéalas
              por envío físico o conviértelas en saldo al instante.
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <Link to="/tienda">
                <Button variant="primary" size="lg" icon={<Sparkles size={16} />}>
                  Ver sobres
                </Button>
              </Link>
              <Button variant="secondary" size="lg" onClick={scrollToComoFunciona}>
                Cómo funciona
              </Button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <Pack size="lg" set="ARCANA" price={4990} className="md:hidden" />
            <Pack size="xl" set="ARCANA" price={4990} className="hidden md:block" />
          </div>
        </div>
      </section>

      <section id="como-funciona" className="bg-night/40 px-5 md:px-16 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="title-display text-3xl md:text-4xl mb-2">Cómo funciona</h2>
            <p className="text-slate-500">Tres pasos para revelar tu próxima carta</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Step n="1" icon={<Package size={20} />} title="Elige tu sobre"
              desc="Navega las ediciones disponibles y encuentra tu set favorito." />
            <Step n="2" icon={<Sparkles size={20} />} title="Revela tus cartas"
              desc="Cada sobre contiene 15 cartas con al menos una rara o superior." />
            <Step n="3" icon={<Repeat size={20} />} title="Canjea o vende"
              desc="Recibe las cartas físicas en tu casa o conviértelas en saldo." />
          </div>
        </div>
      </section>

      <section className="px-5 md:px-16 py-20 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h2 className="title-display text-3xl md:text-5xl">
            Tu primer sobre<br />
            <span className="text-rarity-mythic">es nuestro regalo</span>
          </h2>
          <p className="text-slate-300 text-lg">
            Regístrate y recibe tu primera edición Arcana al instante.
          </p>
          <Link to="/signup">
            <Button variant="primary" size="lg" icon={<ArrowRight size={16} />}>
              Crear mi cuenta
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

function Step({ n, icon, title, desc }) {
  return (
    <div className="card p-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-300 flex items-center justify-center">
          {icon}
        </div>
        <span className="eyebrow">PASO {n}</span>
      </div>
      <h3 className="font-display font-bold text-xl text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}
