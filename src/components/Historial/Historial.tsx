import { useEffect, useState } from 'react'
import './Historial.css'
import type { RegistroAcceso, ComponentProps } from '../../types'
import ApiService from '../../services/api'

interface IncidenteEvento {
  id: number
  tipo: string
  descripcion: string
  hora: string
  fecha: string
  ubicacion: string
  estado: string
}

export default function Historial({}: ComponentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState('Todos los tipos')
  const [fechaFilter, setFechaFilter] = useState('Hoy')
  const [activeTab, setActiveTab] = useState('accesos')
  const [feedback, setFeedback] = useState<string | null>(null)

  const parseFecha = (fecha: string) => {
    const [day, month, year] = fecha.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const applyFechaFilter = (fecha: string) => {
    const fechaRegistro = parseFecha(fecha)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    const ayer = new Date(hoy)
    ayer.setDate(ayer.getDate() - 1)

    const semana = new Date(hoy)
    semana.setDate(semana.getDate() - 7)

    const mes = new Date(hoy)
    mes.setMonth(mes.getMonth() - 1)

    if (fechaFilter === 'Hoy') {
      return fechaRegistro >= hoy
    }
    if (fechaFilter === 'Ayer') {
      return fechaRegistro >= ayer && fechaRegistro < hoy
    }
    if (fechaFilter === 'Última semana') {
      return fechaRegistro >= semana
    }
    if (fechaFilter === 'Último mes') {
      return fechaRegistro >= mes
    }
    return true
  }

  const [registrosAcceso, setRegistrosAcceso] = useState<RegistroAcceso[]>([])
  const [incidentes, setIncidentes] = useState<IncidenteEvento[]>([])
  const [eventosSistema, setEventosSistema] = useState<IncidenteEvento[]>([])

  useEffect(() => {
    const cargar = async () => {
      try {
        const [historialRows, escaneos] = await Promise.all([
          ApiService.getHistorial(),
          ApiService.getEscaneosRecientes(),
        ])

        const mapped = historialRows.map((row) => {
          const persona = row.usuario_info
            ? `${String((row.usuario_info as Record<string, unknown>).nombre || '')} ${String((row.usuario_info as Record<string, unknown>).apellido || '')}`.trim()
            : row.visitante_info
              ? `${String((row.visitante_info as Record<string, unknown>).nombre || '')} ${String((row.visitante_info as Record<string, unknown>).apellido || '')}`.trim()
              : 'Desconocido'

          const tipo: RegistroAcceso['tipo'] = row.idusuario
            ? 'Residente'
            : row.idvisitante
              ? 'Visitante'
              : 'No Identificado'

          const estado: RegistroAcceso['estado'] = String(row.estado) === 'Permitido' ? 'Exitoso' : 'Denegado'

          return {
            id: Number(row.idhistorial),
            persona,
            tipo,
            accion: estado === 'Exitoso' ? 'Acceso Autorizado' : 'Acceso Denegado',
            hora: String(row.hora_entrada || '-'),
            fecha: new Date(String(row.fecha_entrada)).toLocaleDateString('es-PE'),
            ubicacion: 'Entrada Principal',
            estado,
          }
        })

        setRegistrosAcceso(mapped)

        const denegados = mapped
          .filter((r) => r.estado === 'Denegado')
          .slice(0, 10)
          .map((r) => ({
            id: r.id,
            tipo: 'Intento de acceso',
            descripcion: `${r.persona} tuvo un intento denegado.`,
            hora: r.hora,
            fecha: r.fecha,
            ubicacion: r.ubicacion,
            estado: 'Registrado',
          }))
        setIncidentes(denegados)

        const eventos = escaneos.slice(0, 10).map((escaneo) => ({
          id: Number(escaneo.idscanner),
          tipo: 'Escaneo',
          descripcion: `Escaneo de ${String(escaneo.tipo_persona || 'desconocido')}`,
          hora: new Date(String(escaneo.fecha)).toLocaleTimeString('es-PE'),
          fecha: new Date(String(escaneo.fecha)).toLocaleDateString('es-PE'),
          ubicacion: 'Control de acceso',
          estado: 'Completado',
        }))
        setEventosSistema(eventos)

        setFeedback(null)
      } catch {
        setRegistrosAcceso([])
        setIncidentes([])
        setEventosSistema([])
        setFeedback('No se pudo cargar historial desde backend.')
      }
    }

    cargar()
  }, [])

  const filteredRegistros = registrosAcceso.filter(registro => {
    const matchesSearch = registro.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registro.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registro.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTipo = tipoFilter === 'Todos los tipos' || registro.tipo === tipoFilter
    const matchesFecha = applyFechaFilter(registro.fecha)
    
    return matchesSearch && matchesTipo && matchesFecha
  })

  const handleExportar = () => {
    const rows = filteredRegistros.map((registro) => [
      registro.persona,
      registro.tipo,
      registro.accion,
      registro.hora,
      registro.fecha,
      registro.ubicacion,
      registro.estado,
    ])

    const header = ['Persona', 'Tipo', 'Accion', 'Hora', 'Fecha', 'Ubicacion', 'Estado']
    const csv = [header, ...rows]
      .map((cols) => cols.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `historial_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setFeedback('Historial exportado en CSV.')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'accesos':
        return (
          <div className="table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  <th>PERSONA</th>
                  <th>TIPO</th>
                  <th>ACCIÓN</th>
                  <th>HORA</th>
                  <th>FECHA</th>
                  <th>UBICACIÓN</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistros.map((registro) => (
                  <tr key={registro.id}>
                    <td className="persona-name">{registro.persona}</td>
                    <td>
                      <span className={`tipo-badge ${registro.tipo.toLowerCase().replace(' ', '-')}`}>
                        {registro.tipo}
                      </span>
                    </td>
                    <td>{registro.accion}</td>
                    <td>{registro.hora}</td>
                    <td>{registro.fecha}</td>
                    <td>{registro.ubicacion}</td>
                    <td>
                      <span className={`status-badge ${registro.estado.toLowerCase()}`}>
                        {registro.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      
      case 'incidentes':
        return (
          <div className="table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  <th>TIPO</th>
                  <th>DESCRIPCIÓN</th>
                  <th>HORA</th>
                  <th>FECHA</th>
                  <th>UBICACIÓN</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {incidentes.map((incidente) => (
                  <tr key={incidente.id}>
                    <td className="tipo-incidente">{incidente.tipo}</td>
                    <td>{incidente.descripcion}</td>
                    <td>{incidente.hora}</td>
                    <td>{incidente.fecha}</td>
                    <td>{incidente.ubicacion}</td>
                    <td>
                      <span className={`status-badge ${incidente.estado.toLowerCase()}`}>
                        {incidente.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      
      case 'eventos':
        return (
          <div className="table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  <th>TIPO</th>
                  <th>DESCRIPCIÓN</th>
                  <th>HORA</th>
                  <th>FECHA</th>
                  <th>UBICACIÓN</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {eventosSistema.map((evento) => (
                  <tr key={evento.id}>
                    <td className="tipo-evento">{evento.tipo}</td>
                    <td>{evento.descripcion}</td>
                    <td>{evento.hora}</td>
                    <td>{evento.fecha}</td>
                    <td>{evento.ubicacion}</td>
                    <td>
                      <span className={`status-badge ${evento.estado.toLowerCase()}`}>
                        {evento.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="historial-container">
      {/* Header */}
      <div className="historial-header">
        <div className="header-content">
          <h1>Historial de Actividades</h1>
          <p>Consulta el registro completo de accesos, incidentes y eventos del sistema</p>
        </div>
      </div>

      {/* Controls */}
      <div className="historial-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, acción o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters-container">
          <select 
            value={tipoFilter} 
            onChange={(e) => setTipoFilter(e.target.value)}
            className="filter-select"
          >
            <option>Todos los tipos</option>
            <option>Residente</option>
            <option>Visitante</option>
            <option>No Identificado</option>
          </select>

          <select 
            value={fechaFilter} 
            onChange={(e) => setFechaFilter(e.target.value)}
            className="filter-select"
          >
            <option>Hoy</option>
            <option>Ayer</option>
            <option>Última semana</option>
            <option>Último mes</option>
          </select>

          <button className="more-filters-btn">
            🔧 Más Filtros
          </button>
        </div>

        <button onClick={handleExportar} className="export-btn">
          📥 Exportar
        </button>
      </div>

      {feedback && (
        <div className="no-results" style={{ marginBottom: '1rem' }}>
          <p>{feedback}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'accesos' ? 'active' : ''}`}
            onClick={() => setActiveTab('accesos')}
          >
            Registro de Accesos
          </button>
          <button 
            className={`tab-button ${activeTab === 'incidentes' ? 'active' : ''}`}
            onClick={() => setActiveTab('incidentes')}
          >
            Incidentes
          </button>
          <button 
            className={`tab-button ${activeTab === 'eventos' ? 'active' : ''}`}
            onClick={() => setActiveTab('eventos')}
          >
            Eventos del Sistema
          </button>
        </div>

        <div className="tab-content">
          <div className="content-header">
            <h3>
              {activeTab === 'accesos' && 'Registro de Accesos'}
              {activeTab === 'incidentes' && 'Incidentes'}
              {activeTab === 'eventos' && 'Eventos del Sistema'}
            </h3>
          </div>
          
          {renderTabContent()}
        </div>
      </div>

      {filteredRegistros.length === 0 && activeTab === 'accesos' && (
        <div className="no-results">
          <p>No se encontraron registros que coincidan con los criterios de búsqueda.</p>
        </div>
      )}
    </div>
  )
}