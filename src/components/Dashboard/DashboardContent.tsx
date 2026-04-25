import { useEffect, useState } from 'react'
import type { ActivityData } from '../../types'
import ApiService from '../../services/api'

interface DashboardContentProps {
  onQuickNavigate: (section: 'visitantes' | 'residentes' | 'reportes') => void
}

export default function DashboardContent({ onQuickNavigate }: DashboardContentProps) {
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [stats, setStats] = useState({
    residentesActivos: 0,
    ingresosHoy: 0,
    visitantesActivos: 0,
  })

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const [usuarios, historialHoy, visitantesHoy] = await Promise.all([
          ApiService.getUsuarios(),
          ApiService.getHistorialHoy(),
          ApiService.getVisitantesHoy(),
        ])

        setStats({
          residentesActivos: usuarios.length,
          ingresosHoy: historialHoy.length,
          visitantesActivos: visitantesHoy.length,
        })

        const mapped = historialHoy.slice(0, 6).map((registro) => {
          const usuarioInfo = registro.usuario_info as Record<string, unknown> | null
          const visitanteInfo = registro.visitante_info as Record<string, unknown> | null
          const persona = usuarioInfo
            ? `${String(usuarioInfo.nombre || '')} ${String(usuarioInfo.apellido || '')}`.trim()
            : visitanteInfo
              ? `${String(visitanteInfo.nombre || '')} ${String(visitanteInfo.apellido || '')}`.trim()
              : 'Desconocido'

          const permitido = String(registro.estado) === 'Permitido'
          return {
            id: Number(registro.idhistorial || Date.now()),
            type: permitido ? 'ingreso' : 'incidente',
            name: persona,
            description: permitido ? 'Acceso autorizado' : 'Acceso denegado',
            time: String(registro.hora_entrada || '-'),
            color: permitido ? '#10b981' : '#ef4444',
          }
        })
        setActivityData(mapped)
      } catch {
        setStats({
          residentesActivos: 0,
          ingresosHoy: 0,
          visitantesActivos: 0,
        })
        setActivityData([])
      }
    }

    cargarDashboard()
  }, [])

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
          <div className="stat-number">{stats.residentesActivos}</div>
          <div className="stat-label">Residentes Activos</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-indicator blue"></div>
          <div className="stat-number">{stats.ingresosHoy}</div>
          <div className="stat-label">Ingresos Hoy</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-indicator purple"></div>
          <div className="stat-number">{stats.visitantesActivos}</div>
          <div className="stat-label">Visitantes Activos</div>
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
            {activityData.length === 0 && (
              <div className="activity-item">
                <div className="activity-content">
                  <div className="activity-title">Sin actividad reciente</div>
                  <div className="activity-description">No hay registros disponibles desde backend.</div>
                </div>
              </div>
            )}
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
              <div className="alert-description">Sistema de accesos - 2:00 AM</div>
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
        <button className="action-btn primary" onClick={() => onQuickNavigate('visitantes')}>Registrar Visitante</button>
        <button className="action-btn secondary" onClick={() => onQuickNavigate('residentes')}>Buscar Residente</button>
        <button className="action-btn tertiary" onClick={() => onQuickNavigate('reportes')}>Exportar Reporte</button>
      </div>
    </>
  )
}