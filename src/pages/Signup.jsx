import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { GooglePicker } from '../components/GooglePicker'
import { useApp } from '../context/AppContext'

const GIFT_SETS = [
  { code: 'dsk', name: 'Duskmourn: House of Horror' },
  { code: 'blb', name: 'Bloomburrow' },
  { code: 'otj', name: 'Outlaws of Thunder Junction' },
  { code: 'mkm', name: 'Murders at Karlov Manor' },
]

export function Signup() {
  const navigate = useNavigate()
  const { signup, addPack, sets, isAuthenticated } = useApp()

  if (isAuthenticated) return <Navigate to="/perfil" replace />

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showGooglePicker, setShowGooglePicker] = useState(false)

  const addGiftPack = () => {
    const pool = sets.length > 0
      ? sets.map((s) => ({ code: s.code, name: s.name }))
      : GIFT_SETS
    const pick = pool[Math.floor(Math.random() * pool.length)]
    addPack({
      set_code: pick.code,
      set: pick.code.toUpperCase(),
      name: pick.name,
      price: 0,
      description: '¡Sobre de bienvenida! · 1 rara o superior garantizada',
      isGift: true,
    })
  }

  const handleGoogleSelect = (account) => {
    setShowGooglePicker(false)
    setLoading(true)
    setTimeout(() => {
      signup(account.email, account.name)
      addGiftPack()
      navigate('/perfil')
    }, 400)
  }

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Ingresa tu nombre'
    if (!email) e.email = 'Ingresa tu correo'
    if (password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (confirm !== password) e.confirm = 'Las contraseñas no coinciden'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    setTimeout(() => {
      signup(email, name.trim())
      addGiftPack()
      navigate('/perfil')
    }, 500)
  }

  return (
    <div className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-72px)] grid md:grid-cols-2">
      {/* Panel izquierdo decorativo */}
      <div className="hidden md:flex bg-gradient-to-br from-[#1a0b2e] via-[#3d1f4f] to-void items-center justify-center p-16 bg-radial-gold">
        <div className="flex flex-col items-center gap-8 text-center">
          <span className="eyebrow">✦ MYTHIC BOOSTERS</span>
          <h1 className="title-display text-5xl lg:text-6xl leading-tight">
            Empieza tu<br />colección hoy
          </h1>
          <div className="grid grid-cols-3 gap-3 opacity-80">
            {['ARCANA', 'BOSQUE', 'LLAMAS'].map((set) => (
              <div
                key={set}
                className="w-20 h-28 rounded-xl bg-gradient-pack border border-gold-500/60 flex flex-col items-center justify-center gap-2"
              >
                <span className="font-display font-bold text-gold-300 text-[8px] tracking-widest">{set}</span>
                <span className="font-display font-bold text-gold-300 text-lg">✦</span>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm max-w-xs">
            Abre sobres digitales, canjea cartas físicas y construye tu mazo ideal.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h2 className="title-display text-3xl md:text-4xl">Crear cuenta</h2>
            <p className="text-slate-400">Únete al multiverso de Mythic Boosters</p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="NOMBRE COMPLETO"
              type="text"
              placeholder="Ej: Diego Cárdenas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              error={errors.name}
            />
            <Input
              label="CORREO ELECTRÓNICO"
              type="email"
              placeholder="invocador@mythic.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              error={errors.email}
            />
            <Input
              label="CONTRASEÑA"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              error={errors.password}
            />
            <Input
              label="CONFIRMAR CONTRASEÑA"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              error={errors.confirm}
            />
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Al crear tu cuenta aceptas nuestros{' '}
            <span className="text-gold-400">Términos de servicio</span> y{' '}
            <span className="text-gold-400">Política de privacidad</span>.
          </p>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
            icon={loading ? null : <UserPlus size={16} />}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gold-400/20" />
            <span className="font-mono text-[10px] text-slate-500 tracking-widest">O CONTINÚA CON</span>
            <div className="flex-1 h-px bg-gold-400/20" />
          </div>

          <button
            type="button"
            onClick={() => setShowGooglePicker(true)}
            disabled={loading}
            className="w-full h-11 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-40"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            <span className="text-[13px] font-medium text-gray-700">Continuar con Google</span>
          </button>

          <p className="text-center text-sm text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-gold-300 hover:text-gold-200 font-medium">
              Ingresar →
            </Link>
          </p>
        </form>
      </div>

      {showGooglePicker && (
        <GooglePicker
          onSelect={handleGoogleSelect}
          onClose={() => setShowGooglePicker(false)}
        />
      )}
    </div>
  )
}
