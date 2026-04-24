import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { useApp } from '../context/AppContext'

export function Layout() {
  const { isAuthenticated } = useApp()

  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <main className={`pt-14 md:pt-[72px] ${isAuthenticated ? 'pb-20 md:pb-0' : ''}`}>
        <Outlet />
      </main>
    </div>
  )
}