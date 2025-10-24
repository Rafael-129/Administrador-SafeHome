import { useState } from 'react'
import { validateCredentials } from '../../utils/helpers'
import './Auth.css'
import type { LoginProps } from '../../types'

export default function Login({ onLogin }: LoginProps) {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateCredentials(usuario, contrasena)) {
      onLogin()
    } else {
      alert('Credenciales incorrectas')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="lock-icon">🔒</div>
          <h2>Panel de Administrador</h2>
          <p>Ingresa tus credenciales para acceder</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="usuario"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="contrasena"
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <div className="credentials-info">
          <p><strong>Credenciales de prueba:</strong></p>
          <p>Usuario: admin</p>
          <p>Contraseña: admin123</p>
        </div>
      </div>
    </div>
  )
}