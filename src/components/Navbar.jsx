import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Home, Store, User, LogIn, Layers, ClipboardList, MapPin, LogOut, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function Navbar() {
  const { user, balance, isAuthenticated, logout } = useApp()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  const goToTab = (tab) => {
    setDropdownOpen(false)
    navigate('/perfil', { state: { tab } })
  }

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex fixed top-0 inset-x-0 z-40 h-[72px] items-center justify-between px-8 lg:px-16 bg-void border-b border-gold-400/10">
        <Link to="/" className="font-display font-bold text-gold-300 tracking-[0.2em] text-lg">
          MYTHIC BOOSTERS
        </Link>

        <div className="flex items-center gap-8">
          {isAuthenticated ? (
            <>
              <NavItem to="/" end label="Inicio" />
              <NavItem to="/tienda" label="Tienda" />
              <NavItem to="/perfil" label="Mi Perfil" />
            </>
          ) : (
            <>
              <NavItem to="/" end label="Inicio" />
              <NavItem to="/tienda" label="Tienda" />
              <ComoFuncionaBtn navigate={navigate} />
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-baseline gap-2 px-4 py-2 rounded-lg bg-abyss border border-gold-400/25">
                <span className="font-mono text-[10px] text-gold-400 tracking-wider">SALDO</span>
                <span className="font-display font-bold text-gold-200 text-base">
                  ${balance.toLocaleString('es-CL')}
                </span>
              </div>

              {/* Avatar + dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-gold text-void font-display font-bold text-sm flex items-center justify-center">
                    {user.initials}
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-abyss border border-gold-400/20 shadow-2xl overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gold-400/10">
                      <p className="font-display font-bold text-slate-100 text-sm truncate">{user.name}</p>
                      <p className="font-mono text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <DropdownItem icon={<User size={14} />}       label="Mi Perfil"           onClick={() => goToTab('perfil')} />
                      <DropdownItem icon={<Layers size={14} />}     label="Mi Colección"        onClick={() => goToTab('coleccion')} />
                      <DropdownItem icon={<ClipboardList size={14} />} label="Mis Pedidos"      onClick={() => goToTab('pedidos')} />
                      <DropdownItem icon={<MapPin size={14} />}     label="Dirección de envío"  onClick={() => goToTab('direccion')} />
                    </div>

                    <div className="border-t border-gold-400/10 py-1">
                      <DropdownItem icon={<LogOut size={14} />} label="Cerrar sesión" onClick={handleLogout} danger />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Ingresar</Link>
              <Link to="/signup" className="btn-primary !px-5 !py-2.5 !text-xs">Crear cuenta</Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-5 bg-void border-b border-gold-400/10">
        <Link to="/" className="font-display font-bold text-gold-300 tracking-[0.2em] text-base">
          MYTHIC
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-abyss border border-gold-400/25">
              <span className="font-mono text-[9px] text-gold-400">SALDO</span>
              <span className="font-display font-bold text-gold-200 text-xs">
                ${balance.toLocaleString('es-CL')}
              </span>
            </div>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-1.5 text-gold-300 text-sm">
            <LogIn size={16} />
            Ingresar
          </Link>
        )}
      </nav>

      {/* Mobile bottom tabs */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 flex items-center justify-around bg-void border-t border-gold-400/20">
          <TabItem to="/" end icon={<Home size={20} />} label="Inicio" />
          <TabItem to="/tienda" icon={<Store size={20} />} label="Tienda" />
          <TabItem to="/perfil" icon={<User size={20} />} label="Mi Perfil" />
        </nav>
      )}
    </>
  )
}

function ComoFuncionaBtn({ navigate }) {
  const handleClick = () => {
    if (window.location.pathname === '/') {
      document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: 'como-funciona' } })
    }
  }
  return (
    <button
      onClick={handleClick}
      className="font-mono text-[11px] tracking-wider uppercase transition-colors text-slate-300 hover:text-gold-300"
    >
      Cómo funciona
    </button>
  )
}

function NavItem({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `font-mono text-[11px] tracking-wider uppercase transition-colors ${
          isActive ? 'text-gold-300' : 'text-slate-300 hover:text-gold-300'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

function TabItem({ to, icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
          isActive ? 'text-gold-300' : 'text-slate-500'
        }`
      }
    >
      {icon}
      <span className="font-mono text-[9px] tracking-wider uppercase">{label}</span>
    </NavLink>
  )
}

function DropdownItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
        danger
          ? 'text-red-400 hover:bg-red-400/10'
          : 'text-slate-300 hover:bg-gold-400/8 hover:text-gold-200'
      }`}
    >
      <span className={danger ? 'text-red-400' : 'text-slate-500'}>{icon}</span>
      <span className="font-mono text-[11px] tracking-wider uppercase">{label}</span>
    </button>
  )
}
