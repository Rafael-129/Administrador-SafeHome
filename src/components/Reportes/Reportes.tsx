import { useEffect, useState } from 'react'
import './Reportes.css'
import type { ReporteRapido, ReporteHistorial, ComponentProps } from '../../types'
import ApiService from '../../services/api'

export default function Reportes({}: ComponentProps) {
  const [tituloReporte, setTituloReporte] = useState('Análisis de seguridad semanal')
  const [fechaDesde, setFechaDesde] = useState('2025-09-25')
  const [fechaHasta, setFechaHasta] = useState('2025-09-30')
  const [formatoExportacion, setFormatoExportacion] = useState('PDF - Documento')
  const [filtrosAdicionales, setFiltrosAdicionales] = useState('Sin filtros adicionales')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [selectedDataTypes, setSelectedDataTypes] = useState<Record<string, boolean>>({
    accesos: true,
    visitantes: false,
    rendimiento: false,
    residentes: false,
    incidentes: false,
    camaras: false,
  })

  const reportesRapidos: ReporteRapido[] = [
    {
      id: 'diario',
      titulo: 'Reporte Diario',
      descripcion: 'Resumen completo de actividades del día: acceso, incidentes y residentes.',
      color: '#3b82f6',
      icon: '📊',
      ultimaActualizacion: 'Hoy 8:00'
    },
    {
      id: 'semanal',
      titulo: 'Reporte Semanal',
      descripcion: 'Análisis semanal de patrones de acceso, tendencias y estadísticas.',
      color: '#10b981',
      icon: '📈',
      ultimaActualizacion: 'Hoy 8:00'
    },
    {
      id: 'mensual',
      titulo: 'Reporte Mensual',
      descripcion: 'Reporte mensual detallado con métricas de rendimiento y análisis.',
      color: '#8b5cf6',
      icon: '📋',
      ultimaActualizacion: 'Hoy 8:00'
    },
    {
      id: 'seguridad',
      titulo: 'Reporte Seguridad',
      descripcion: 'Análisis de seguridad, riesgos latentes y alertas de sistema.',
      color: '#ef4444',
      icon: '🔒',
      ultimaActualizacion: 'Hoy 8:00'
    },
    {
      id: 'residentes',
      titulo: 'Reporte de Residentes',
      descripcion: 'Actividad de residentes, frecuencia de accesos y patrones.',
      color: '#f97316',
      icon: '👥',
      ultimaActualizacion: 'Hoy 8:00'
    },
    {
      id: 'visitantes',
      titulo: 'Reporte de Visitantes',
      descripcion: 'Estadísticas de visitantes, tiempos de permanencia y frecuencias.',
      color: '#06b6d4',
      icon: '🚶',
      ultimaActualizacion: 'Hoy 8:00'
    }
  ]

  const [metricas, setMetricas] = useState({
    eficienciaDelSistema: 0,
    precisionDeReconocimiento: 0,
    accesosEsteMes: 0,
    tiempoPromedioReconocimiento: 'N/A'
  })

  const [historialReportes, setHistorialReportes] = useState<ReporteHistorial[]>([
    {
      id: 1,
      nombre: 'Reporte Diario',
      fecha: 'Hoy 8:00',
      estado: 'Completado'
    },
    {
      id: 2,
      nombre: 'Análisis de Seguridad',
      fecha: 'Ayer 15:00',
      estado: 'Completado'
    },
    {
      id: 3,
      nombre: 'Reporte Visitantes',
      fecha: '22 Sep 18:45',
      estado: 'Completado'
    }
  ])

  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        const now = new Date()
        const desde = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
        const hasta = now.toISOString().slice(0, 10)
        const stats = await ApiService.getEstadisticas(desde, hasta)
        const total = Number(stats.totalAccesos || 0)
        const autorizados = Number(stats.autorizados || 0)
        const precision = total > 0 ? Math.round((autorizados / total) * 100) : 0

        setMetricas({
          eficienciaDelSistema: precision,
          precisionDeReconocimiento: precision,
          accesosEsteMes: total,
          tiempoPromedioReconocimiento: total > 0 ? '2.1s' : 'N/A'
        })
      } catch {
        setMetricas({
          eficienciaDelSistema: 0,
          precisionDeReconocimiento: 0,
          accesosEsteMes: 0,
          tiempoPromedioReconocimiento: 'N/A'
        })
      }
    }

    cargarMetricas()
  }, [])

  const tiposDeData = [
    { id: 'accesos', label: 'Accesos', checked: true },
    { id: 'visitantes', label: 'Visitantes', checked: false },
    { id: 'rendimiento', label: 'Rendimiento', checked: false },
    { id: 'residentes', label: 'Residentes', checked: false },
    { id: 'incidentes', label: 'Incidentes', checked: false },
    { id: 'camaras', label: 'Cámaras', checked: false }
  ]

  const descargarArchivo = (nombre: string, contenido: string, mime = 'text/plain;charset=utf-8') => {
    const blob = new Blob([contenido], { type: mime })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = nombre
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const agregarHistorial = (nombre: string) => {
    const fecha = new Date().toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

    setHistorialReportes((prev) => [
      {
        id: Date.now(),
        nombre,
        fecha,
        estado: 'Completado',
      },
      ...prev,
    ])
  }

  const handleGenerarReporte = (tipoReporte: string) => {
    const contenido = `Reporte: ${tipoReporte}\nGenerado: ${new Date().toISOString()}\nEstado: Completado\n`
    descargarArchivo(`${tipoReporte.replaceAll(' ', '_').toLowerCase()}.txt`, contenido)
    agregarHistorial(tipoReporte)
    setFeedback(`${tipoReporte} generado y descargado.`)
  }

  const handleGenerarPersonalizado = () => {
    const tiposActivos = Object.entries(selectedDataTypes)
      .filter(([, checked]) => checked)
      .map(([key]) => key)

    const contenido = [
      `Titulo: ${tituloReporte}`,
      `Desde: ${fechaDesde}`,
      `Hasta: ${fechaHasta}`,
      `Formato: ${formatoExportacion}`,
      `Filtros: ${filtrosAdicionales}`,
      `Datos incluidos: ${tiposActivos.join(', ') || 'ninguno'}`,
      `Generado: ${new Date().toISOString()}`,
    ].join('\n')

    const extension = formatoExportacion.includes('CSV') ? 'csv' : 'txt'
    const mime = extension === 'csv' ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8'
    descargarArchivo(`reporte_personalizado.${extension}`, contenido, mime)
    agregarHistorial(tituloReporte)
    setFeedback('Reporte personalizado generado y descargado.')
  }

  const handleDescargarReporte = (id: number) => {
    const reporte = historialReportes.find((r) => r.id === id)
    if (!reporte) {
      setFeedback('No se encontró el reporte para descargar.')
      return
    }
    const contenido = `Reporte: ${reporte.nombre}\nFecha: ${reporte.fecha}\nEstado: ${reporte.estado}\n`
    descargarArchivo(`historial_${reporte.id}.txt`, contenido)
    setFeedback('Reporte descargado.')
  }

  const handleVerHistorialCompleto = () => {
    setFeedback(`Historial disponible: ${historialReportes.length} reportes.`)
  }

  const handleTipoDataChange = (tipoId: string, checked: boolean) => {
    setSelectedDataTypes((prev) => ({
      ...prev,
      [tipoId]: checked,
    }))
  }

  return (
    <div className="reportes-container">
      {/* Header */}
      <div className="reportes-header">
        <div className="header-content">
          <h1>Reportes y Auditoría</h1>
          <p>Genera reportes detallados y analiza el rendimiento del sistema</p>
        </div>
      </div>

      {/* Reportes Rápidos */}
      <div className="reportes-rapidos-section">
        <div className="section-header">
          <div className="section-icon">📊</div>
          <div>
            <h3>Reportes Rápidos</h3>
            <p>Genera reportes</p>
          </div>
        </div>

        <div className="reportes-grid">
          {reportesRapidos.map((reporte) => (
            <div key={reporte.id} className="reporte-card">
              <div className="reporte-header" style={{ borderLeftColor: reporte.color }}>
                <div className="reporte-icon" style={{ backgroundColor: reporte.color }}>
                  {reporte.icon}
                </div>
                <h4>{reporte.titulo}</h4>
              </div>
              <p className="reporte-descripcion">{reporte.descripcion}</p>
              <div className="reporte-footer">
                <span className="ultima-actualizacion">Último: {reporte.ultimaActualizacion}</span>
                <button 
                  onClick={() => handleGenerarReporte(reporte.titulo)}
                  className="generar-btn"
                  style={{ backgroundColor: reporte.color }}
                >
                  Generar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Análisis en Tiempo Real */}
      <div className="analisis-tiempo-real">
        <div className="section-header">
          <div className="section-icon">📈</div>
          <div>
            <h3>Análisis Tiempo Real</h3>
            <p>Métricas clave de rendimiento del sistema</p>
          </div>
        </div>

        {/* Métricas */}
        <div className="metricas-grid">
          <div className="metrica-card">
            <div className="metrica-valor">{metricas.eficienciaDelSistema}%</div>
            <div className="metrica-label">Eficiencia del Sistema</div>
          </div>
          <div className="metrica-card">
            <div className="metrica-valor">{metricas.precisionDeReconocimiento}%</div>
            <div className="metrica-label">Precisión de Reconocimiento</div>
          </div>
          <div className="metrica-card">
            <div className="metrica-valor">{metricas.accesosEsteMes}</div>
            <div className="metrica-label">Accesos Este Mes</div>
          </div>
          <div className="metrica-card">
            <div className="metrica-valor">{metricas.tiempoPromedioReconocimiento}</div>
            <div className="metrica-label">Tiempo Promedio Reconocimiento</div>
          </div>
        </div>

        {/* Gráfico Placeholder */}
        <div className="grafico-section">
          <h4>Flujo de Accesos - Últimos 7 Días</h4>
          <div className="grafico-placeholder">
            <div className="grafico-icon">📊</div>
            <div>
              <p>Gráfico de accesos por día</p>
              <span>Datos actualizándose...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        {/* Generador de Reportes */}
        <div className="generador-reportes">
          <div className="section-header">
            <div className="section-icon">📝</div>
            <div>
              <h3>Generador de Reportes</h3>
              <p>Crear reportes personalizados</p>
            </div>
          </div>

          <div className="generador-form">
            <div className="form-group">
              <label>Título de Reporte</label>
              <input
                type="text"
                value={tituloReporte}
                onChange={(e) => setTituloReporte(e.target.value)}
                placeholder="Ej: Análisis de seguridad semanal"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Período</label>
                <div className="date-inputs">
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="form-input date-input"
                  />
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="form-input date-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Tipo de Datos</label>
              <div className="checkboxes-grid">
                {tiposDeData.map((tipo) => (
                  <label key={tipo.id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={selectedDataTypes[tipo.id] ?? tipo.checked}
                      onChange={(e) => handleTipoDataChange(tipo.id, e.target.checked)}
                    />
                    <span>{tipo.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Formato de Exportación</label>
              <select 
                value={formatoExportacion}
                onChange={(e) => setFormatoExportacion(e.target.value)}
                className="form-select"
              >
                <option>PDF - Documento</option>
                <option>Excel - Hoja de Cálculo</option>
                <option>CSV - Datos</option>
                <option>Word - Documento</option>
              </select>
            </div>

            <div className="form-group">
              <label>Filtros Adicionales</label>
              <select 
                value={filtrosAdicionales}
                onChange={(e) => setFiltrosAdicionales(e.target.value)}
                className="form-select"
              >
                <option>Sin filtros adicionales</option>
                <option>Solo accesos exitosos</option>
                <option>Solo incidentes</option>
                <option>Por ubicación específica</option>
              </select>
            </div>

            <button onClick={handleGenerarPersonalizado} className="generar-personalizado-btn">
              Generar Reporte Personalizado
            </button>
          </div>
        </div>

        {/* Historial de Reportes */}
        <div className="historial-reportes">
          <div className="section-header">
            <div className="section-icon">🕒</div>
            <div>
              <h3>Historial de Reportes</h3>
              <p>Reportes generados recientemente</p>
            </div>
          </div>

          <div className="historial-lista">
            {historialReportes.map((reporte) => (
              <div key={reporte.id} className="historial-item">
                <div className="historial-info">
                  <h4>{reporte.nombre}</h4>
                  <p>{reporte.fecha}</p>
                </div>
                <div className="historial-acciones">
                  <span className={`estado-badge ${reporte.estado.toLowerCase().replace(' ', '-')}`}>
                    {reporte.estado}
                  </span>
                  <button 
                    onClick={() => handleDescargarReporte(reporte.id)}
                    className="descargar-btn"
                  >
                    💾
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleVerHistorialCompleto} className="ver-historial-btn">
            Ver Historial Completo
          </button>
        </div>
      </div>

      {feedback && (
        <div className="historial-reportes" style={{ marginTop: '1rem' }}>
          <div className="section-header">
            <div className="section-icon">✅</div>
            <div>
              <h3>Estado</h3>
              <p>{feedback}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}