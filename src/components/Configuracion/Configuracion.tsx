import { useEffect, useRef, useState } from 'react'
import './Configuracion.css'

interface ConfiguracionProps {
  onBack: () => void
}

export default function Configuracion({ }: ConfiguracionProps) {
  const STORAGE_KEY = 'safehome-dashboard-config'
  const [activeTab, setActiveTab] = useState('perfil')
  const [nombre, setNombre] = useState('Admin SafeHome')
  const [email, setEmail] = useState('admin@safehome.com')
  const [telefono, setTelefono] = useState('+51 999 888 777')
  const [idioma, setIdioma] = useState('Español')
  const [tema, setTema] = useState('Claro')
  const [notificacionesEmail, setNotificacionesEmail] = useState(true)
  const [notificacionesMovil, setNotificacionesMovil] = useState(true)
  const [autenticacionDosFactor, setAutenticacionDosFactor] = useState(false)
  const [tiempoSesion, setTiempoSesion] = useState('8')
  const [intervaloCamaras, setIntervaloCamaras] = useState('30')
  const [retencionLogs, setRetencionLogs] = useState('90')
  const [feedback, setFeedback] = useState<string | null>(null)
  const importFileRef = useRef<HTMLInputElement | null>(null)

  const tabs = [
    { id: 'perfil', name: 'Perfil', icon: '👤' },
    { id: 'seguridad', name: 'Seguridad', icon: '🔒' },
    { id: 'sistema', name: 'Sistema', icon: '⚙️' },
    { id: 'notificaciones', name: 'Notificaciones', icon: '🔔' },
    { id: 'respaldo', name: 'Respaldo', icon: '💾' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return
    }

    try {
      const parsed = JSON.parse(saved)
      setNombre(parsed.nombre ?? 'Admin SafeHome')
      setEmail(parsed.email ?? 'admin@safehome.com')
      setTelefono(parsed.telefono ?? '+51 999 888 777')
      setIdioma(parsed.idioma ?? 'Español')
      setTema(parsed.tema ?? 'Claro')
      setNotificacionesEmail(parsed.notificacionesEmail ?? true)
      setNotificacionesMovil(parsed.notificacionesMovil ?? true)
      setAutenticacionDosFactor(parsed.autenticacionDosFactor ?? false)
      setTiempoSesion(parsed.tiempoSesion ?? '8')
      setIntervaloCamaras(parsed.intervaloCamaras ?? '30')
      setRetencionLogs(parsed.retencionLogs ?? '90')
    } catch {
      setFeedback('No se pudo cargar la configuración guardada.')
    }
  }, [])

  const buildConfigData = () => ({
    nombre,
    email,
    telefono,
    idioma,
    tema,
    notificacionesEmail,
    notificacionesMovil,
    autenticacionDosFactor,
    tiempoSesion,
    intervaloCamaras,
    retencionLogs,
  })

  const handleGuardarCambios = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildConfigData()))
    setFeedback('Configuración guardada localmente.')
  }

  const handleRestaurarDefecto = () => {
    if (confirm('¿Estás seguro de restaurar la configuración por defecto?')) {
      setNombre('Admin SafeHome')
      setEmail('admin@safehome.com')
      setTelefono('+51 999 888 777')
      setIdioma('Español')
      setTema('Claro')
      setNotificacionesEmail(true)
      setNotificacionesMovil(true)
      setAutenticacionDosFactor(false)
      setTiempoSesion('8')
      setIntervaloCamaras('30')
      setRetencionLogs('90')
      localStorage.removeItem(STORAGE_KEY)
      setFeedback('Configuración restaurada a valores por defecto.')
    }
  }

  const handleExportarConfiguracion = () => {
    const payload = JSON.stringify(buildConfigData(), null, 2)
    const blob = new Blob([payload], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'safehome-dashboard-config.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setFeedback('Configuración exportada correctamente.')
  }

  const handleImportarConfiguracion = () => {
    importFileRef.current?.click()
  }

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      setNombre(parsed.nombre ?? nombre)
      setEmail(parsed.email ?? email)
      setTelefono(parsed.telefono ?? telefono)
      setIdioma(parsed.idioma ?? idioma)
      setTema(parsed.tema ?? tema)
      setNotificacionesEmail(parsed.notificacionesEmail ?? notificacionesEmail)
      setNotificacionesMovil(parsed.notificacionesMovil ?? notificacionesMovil)
      setAutenticacionDosFactor(parsed.autenticacionDosFactor ?? autenticacionDosFactor)
      setTiempoSesion(parsed.tiempoSesion ?? tiempoSesion)
      setIntervaloCamaras(parsed.intervaloCamaras ?? intervaloCamaras)
      setRetencionLogs(parsed.retencionLogs ?? retencionLogs)
      setFeedback('Configuración importada. Guarda para persistirla.')
    } catch {
      setFeedback('El archivo no es válido. Usa un JSON exportado del sistema.')
    }
    event.target.value = ''
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="tab-content">
            <h3>Información Personal</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Idioma</label>
                <select
                  value={idioma}
                  onChange={(e) => setIdioma(e.target.value)}
                  className="form-select"
                >
                  <option>Español</option>
                  <option>English</option>
                  <option>Português</option>
                </select>
              </div>
            </div>
            
            <h3>Preferencias de Interfaz</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Tema</label>
                <select
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  className="form-select"
                >
                  <option>Claro</option>
                  <option>Oscuro</option>
                  <option>Automático</option>
                </select>
              </div>
            </div>

            <div className="profile-avatar-section">
              <h3>Foto de Perfil</h3>
              <div className="avatar-container">
                <div className="current-avatar">👤</div>
                <div className="avatar-actions">
                  <button className="btn-secondary">Cambiar Foto</button>
                  <button className="btn-tertiary">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'seguridad':
        return (
          <div className="tab-content">
            <h3>Configuración de Seguridad</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  placeholder="Ingresa nueva contraseña"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input
                  type="password"
                  placeholder="Confirma la contraseña"
                  className="form-input"
                />
              </div>
            </div>

            <div className="security-options">
              <div className="option-item">
                <div className="option-info">
                  <h4>Autenticación de Dos Factores</h4>
                  <p>Agrega una capa extra de seguridad a tu cuenta</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={autenticacionDosFactor}
                    onChange={(e) => setAutenticacionDosFactor(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="form-group">
                <label>Tiempo de Sesión (horas)</label>
                <select
                  value={tiempoSesion}
                  onChange={(e) => setTiempoSesion(e.target.value)}
                  className="form-select"
                >
                  <option value="1">1 hora</option>
                  <option value="4">4 horas</option>
                  <option value="8">8 horas</option>
                  <option value="24">24 horas</option>
                </select>
              </div>
            </div>

            <div className="security-actions">
              <button className="btn-danger">Cerrar Todas las Sesiones</button>
              <button className="btn-secondary">Ver Actividad de Login</button>
            </div>
          </div>
        )

      case 'sistema':
        return (
          <div className="tab-content">
            <h3>Configuración del Sistema</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Intervalo de Actualización de Cámaras (segundos)</label>
                <select
                  value={intervaloCamaras}
                  onChange={(e) => setIntervaloCamaras(e.target.value)}
                  className="form-select"
                >
                  <option value="15">15 segundos</option>
                  <option value="30">30 segundos</option>
                  <option value="60">1 minuto</option>
                  <option value="120">2 minutos</option>
                </select>
              </div>
              <div className="form-group">
                <label>Retención de Logs (días)</label>
                <select
                  value={retencionLogs}
                  onChange={(e) => setRetencionLogs(e.target.value)}
                  className="form-select"
                >
                  <option value="30">30 días</option>
                  <option value="60">60 días</option>
                  <option value="90">90 días</option>
                  <option value="180">180 días</option>
                </select>
              </div>
            </div>

            <div className="system-info">
              <h3>Información del Sistema</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Versión</span>
                  <span className="info-value">SafeHome v1.0.0</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Última Actualización</span>
                  <span className="info-value">23 Oct 2025</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Base de Datos</span>
                  <span className="info-value">Conectada</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Estado del Sistema</span>
                  <span className="info-value status-online">Operativo</span>
                </div>
              </div>
            </div>

            <div className="system-actions">
              <button className="btn-secondary">Verificar Actualizaciones</button>
              <button className="btn-secondary">Diagnosticar Sistema</button>
            </div>
          </div>
        )

      case 'notificaciones':
        return (
          <div className="tab-content">
            <h3>Preferencias de Notificaciones</h3>
            
            <div className="notification-options">
              <div className="option-item">
                <div className="option-info">
                  <h4>Notificaciones por Email</h4>
                  <p>Recibe alertas y reportes por correo electrónico</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notificacionesEmail}
                    onChange={(e) => setNotificacionesEmail(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="option-item">
                <div className="option-info">
                  <h4>Notificaciones Móviles</h4>
                  <p>Recibe notificaciones push en tu dispositivo móvil</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notificacionesMovil}
                    onChange={(e) => setNotificacionesMovil(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <h3>Tipos de Notificaciones</h3>
            <div className="notification-types">
              <div className="notification-type">
                <input type="checkbox" id="accesos" defaultChecked />
                <label htmlFor="accesos">Accesos y Salidas</label>
              </div>
              <div className="notification-type">
                <input type="checkbox" id="incidentes" defaultChecked />
                <label htmlFor="incidentes">Incidentes de Seguridad</label>
              </div>
              <div className="notification-type">
                <input type="checkbox" id="visitantes" defaultChecked />
                <label htmlFor="visitantes">Nuevos Visitantes</label>
              </div>
              <div className="notification-type">
                <input type="checkbox" id="sistema" />
                <label htmlFor="sistema">Actualizaciones del Sistema</label>
              </div>
              <div className="notification-type">
                <input type="checkbox" id="mantenimiento" />
                <label htmlFor="mantenimiento">Mantenimiento Programado</label>
              </div>
            </div>
          </div>
        )

      case 'respaldo':
        return (
          <div className="tab-content">
            <h3>Respaldo y Restauración</h3>
            
            <div className="backup-options">
              <input
                ref={importFileRef}
                type="file"
                accept="application/json"
                onChange={handleFileImport}
                style={{ display: 'none' }}
              />
              <div className="backup-card">
                <div className="backup-icon">💾</div>
                <div className="backup-info">
                  <h4>Respaldo Automático</h4>
                  <p>Se realizan respaldos automáticos cada 24 horas</p>
                  <span className="last-backup">Último respaldo: Hoy 02:00 AM</span>
                </div>
                <button className="btn-primary">Configurar</button>
              </div>

              <div className="backup-card">
                <div className="backup-icon">📤</div>
                <div className="backup-info">
                  <h4>Exportar Configuración</h4>
                  <p>Descarga tu configuración actual</p>
                </div>
                <button className="btn-secondary" onClick={handleExportarConfiguracion}>
                  Exportar
                </button>
              </div>

              <div className="backup-card">
                <div className="backup-icon">📥</div>
                <div className="backup-info">
                  <h4>Importar Configuración</h4>
                  <p>Restaura configuración desde archivo</p>
                </div>
                <button className="btn-secondary" onClick={handleImportarConfiguracion}>
                  Importar
                </button>
              </div>
            </div>

            <div className="backup-history">
              <h3>Historial de Respaldos</h3>
              <div className="backup-list">
                <div className="backup-item">
                  <span className="backup-date">23 Oct 2025 - 02:00 AM</span>
                  <span className="backup-size">2.4 MB</span>
                  <button className="btn-tertiary">Restaurar</button>
                </div>
                <div className="backup-item">
                  <span className="backup-date">22 Oct 2025 - 02:00 AM</span>
                  <span className="backup-size">2.4 MB</span>
                  <button className="btn-tertiary">Restaurar</button>
                </div>
                <div className="backup-item">
                  <span className="backup-date">21 Oct 2025 - 02:00 AM</span>
                  <span className="backup-size">2.3 MB</span>
                  <button className="btn-tertiary">Restaurar</button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="configuracion-container">
      {/* Header */}
      <div className="configuracion-header">
        <div className="header-content">
          <h1>Configuración del Sistema</h1>
          <p>Personaliza y ajusta la configuración de tu dashboard SafeHome</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="configuracion-main">
        {/* Sidebar Tabs */}
        <div className="config-sidebar">
          <div className="config-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`config-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-name">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="config-content">
          {renderTabContent()}

          {feedback && (
            <div className="backup-history" style={{ marginBottom: '1rem' }}>
              <h3>Estado</h3>
              <div className="backup-list">
                <div className="backup-item">
                  <span className="backup-date">{feedback}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="config-actions">
            <button className="btn-primary" onClick={handleGuardarCambios}>
              💾 Guardar Cambios
            </button>
            <button className="btn-secondary" onClick={handleRestaurarDefecto}>
              🔄 Restaurar por Defecto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}