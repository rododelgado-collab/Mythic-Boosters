import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Tienda } from './pages/Tienda'
import { Feed } from './pages/Feed'
import { Apertura } from './pages/Apertura'
import { Canjear } from './pages/Canjear'
import { Vender } from './pages/Vender'
import { Coleccion } from './pages/Coleccion'
import { Perfil } from './pages/Perfil'
import { useApp } from './context/AppContext'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useApp()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Rutas fullscreen sin Layout */}
      <Route path="/abrir/:packId" element={
        <PrivateRoute><Apertura /></PrivateRoute>
      } />
      <Route path="/canjear" element={
        <PrivateRoute><Canjear /></PrivateRoute>
      } />
      <Route path="/vender" element={
        <PrivateRoute><Vender /></PrivateRoute>
      } />

      {/* Rutas con Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/recuperar" element={<Login />} />
        <Route path="/como-funciona" element={<Home />} />

        <Route path="/app" element={<Navigate to="/" replace />} />
        <Route path="/coleccion" element={<PrivateRoute><Coleccion /></PrivateRoute>} />
        <Route path="/pedidos" element={<Navigate to="/perfil" replace />} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}