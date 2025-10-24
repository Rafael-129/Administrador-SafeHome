import { useState } from 'react'
import './styles/globals.css'
import Login from './components/Auth/Login'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  // Si está logueado, mostrar el dashboard
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />
  }

  // Si no está logueado, mostrar el login
  return <Login onLogin={handleLogin} />
}

export default App
