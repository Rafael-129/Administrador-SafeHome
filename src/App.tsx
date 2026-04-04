import { useEffect, useState } from 'react'
import './styles/globals.css'
import Login from './components/Auth/Login'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Restaurar sesión desde localStorage al cargar la app
  useEffect(() => {
    const savedSession = localStorage.getItem('safehome-dashboard-session')
    if (savedSession === 'true') {
      setIsLoggedIn(true)
    }
    setIsHydrated(true)
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
    localStorage.setItem('safehome-dashboard-session', 'true')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('safehome-dashboard-session')
  }

  // Evitar parpadeo de login mientras se restaura sesión
  if (!isHydrated) {
    return <div style={{ display: 'none' }} />
  }

  // Si está logueado, mostrar el dashboard
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />
  }

  // Si no está logueado, mostrar el login
  return <Login onLogin={handleLogin} />
}

export default App
