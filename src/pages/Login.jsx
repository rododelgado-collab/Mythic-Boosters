import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useApp } from '../context/AppContext'

export function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useApp()

  if (isAuthenticated) return <Navigate to="/perfil" replace />
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    setTimeout(() => {
      login(email)
      navigate('/perfil')
    }, 500)
  }

  return (
    <div className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-72px)] grid md:grid-cols-2">
      <div className="hidden md:flex bg-gradient-to-br from-[#1a0b2e] via-[#3d1f4f] to-void items-center justify-center p-16 bg-radial-gold">
        <div className="flex flex-col items-center gap-8">
          <span className="eyebrow">✦ MYTHIC BOOSTERS</span>
          <h1 className="title-display text-5xl lg:text-6xl text-center leading-tight">
            Tu colección<br />te espera
          </h1>
          <div className="w-48 h-64 rounded-2xl bg-gradient-pack border-2 border-gold-500 shadow-glow-gold-lg flex flex-col items-center justify-center p-5 gap-4">
            <span className="font-display font-bold text-gold-300 tracking-wider text-xs">ARCANA</span>
            <div className="w-14 h-14 rounded-full border-2 border-gold-400 flex items-center justify-center text-gold-300 text-2xl font-display font-bold shadow-glow-gold">✦</div>
            <span className="font-mono text-[10px] text-slate-300 tracking-widest">15 · 1 RARE+</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h2 className="title-display text-3xl md:text-4xl">Bienvenido</h2>
            <p className="text-slate-400">Ingresa a tu cuenta para continuar</p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="CORREO ELECTRÓNICO"
              type="email"
              placeholder="invocador@mythic.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="CONTRASEÑA"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              error={error}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded bg-void border border-gold-400/50 accent-gold-400" />
              Recordarme
            </label>
            <Link to="/recuperar" className="text-gold-300 hover:text-gold-200 font-medium">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
            icon={loading ? null : <Sparkles size={16} />}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gold-400/20" />
            <span className="font-mono text-[10px] text-slate-500 tracking-widest">O CONTINÚA CON</span>
            <div className="flex-1 h-px bg-gold-400/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="h-11 rounded-lg bg-abyss border border-gold-400/30 text-slate-100 hover:border-gold-400/60 transition-colors font-semibold text-sm">
              G Google
            </button>
            <button type="button" className="h-11 rounded-lg bg-abyss border border-gold-400/30 text-slate-100 hover:border-gold-400/60 transition-colors font-semibold text-sm">
              ◆ Discord
            </button>
          </div>

          <p className="text-center text-sm text-slate-400">
            ¿Primera vez aquí?{' '}
            <Link to="/signup" className="text-gold-300 hover:text-gold-200 font-medium">
              Crear cuenta →
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}