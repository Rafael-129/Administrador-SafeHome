import type { ActivityData } from '../../types'

export default function DashboardContent() {
  const activityData: ActivityData[] = [
    {
      id: 1,
      type: 'ingreso',
      name: 'Sandra Anchelia - Dpto. xx',
      description: 'Ingreso exitoso',
      time: 'hace 3 minutos',
      color: '#10b981'
    },
    {
      id: 2,
      type: 'salida',
      name: 'Rafael García - Dpto. xx',
      description: 'Salida Registrada',
      time: 'hace 8 minutos',
      color: '#8b5cf6'
    },
    {
      id: 3,
      type: 'sistema',
      name: 'Sistema actualizado',
      description: 'Cámara principal reconectada',
      time: 'hace 15min',
      color: '#f97316'
    },
    {
      id: 4,
      type: 'visitante',
      name: 'Nuevo visitante registrado',
      description: 'Carlos Mendoza visitó Dpto. 507',
      time: 'hace 20min',
      color: '#3b82f6'
    }
  ]

  const getCurrentDate = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return now.toLocaleDateString('es-ES', options)
  }

  return (
    <>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Principal</h1>
          <p className="date-text">{getCurrentDate()}</p>
        </div>
        <div className="admin-badge">Admin</div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-indicator green"></div>
          <div className="stat-number">150</div>
          <div className="stat-label">Residentes Activos</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-indicator blue"></div>
          <div className="stat-number">50</div>
          <div className="stat-label">Ingresos Hoy</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-indicator purple"></div>
          <div className="stat-number">10</div>
          <div className="stat-label">Visitantes Activos</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-indicator orange"></div>
          <div className="stat-number">1</div>
          <div className="stat-label">Cámaras Online</div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Activity Section */}
        <div className="content-card">
          <div className="card-header">
            <h3>Actividad Reciente</h3>
            <button className="see-all-btn">Ver todo</button>
          </div>
          <div className="activity-list">
            {activityData.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div 
                  className="activity-dot" 
                  style={{ backgroundColor: activity.color }}
                ></div>
                <div className="activity-content">
                  <div className="activity-title">{activity.name}</div>
                  <div className="activity-description">{activity.description}</div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="content-card">
          <h3>Alertas de Sistemas</h3>
          <div className="alerts-list">
            <div className="alert-item warning">
              <div className="alert-header">
                <strong>Mantenimiento programado</strong>
              </div>
              <div className="alert-description">Sistema de cámaras - 2:00 AM</div>
            </div>
            
            <div className="alert-item success">
              <div className="alert-header">
                <strong>Backup completado</strong>
              </div>
              <div className="alert-description">Base de datos - 1:30 AM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-btn primary">Registrar Visitante</button>
        <button className="action-btn secondary">Buscar Residente</button>
        <button className="action-btn tertiary">Exportar Reporte</button>
      </div>
    </>
  )
}