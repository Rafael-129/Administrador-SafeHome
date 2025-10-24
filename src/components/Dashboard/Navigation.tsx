import type { NavigationProps } from '../../types'

export default function Navigation({ activeSection, onSectionChange, onLogout }: NavigationProps) {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
    { id: 'residentes', name: 'Residentes', icon: '👥' },
    { id: 'visitantes', name: 'Visitantes', icon: '🚶' },
    { id: 'historial', name: 'Historial', icon: '📋' },
    { id: 'camaras', name: 'Cámaras', icon: '📹' },
    { id: 'reportes', name: 'Reportes', icon: '📊' },
    { id: 'configuracion', name: 'Configuración', icon: '⚙️' }
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-avatar">👤</div>
      </div>
      
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </button>
        ))}
      </nav>

      <button className="logout-button" onClick={onLogout}>
        <span className="sidebar-icon">🔓</span>
        <span className="sidebar-text">Cerrar Sesión</span>
      </button>
    </div>
  )
}