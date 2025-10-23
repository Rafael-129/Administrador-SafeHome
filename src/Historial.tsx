import { useState } from 'react'
import './Historial.css'

interface RegistroAcceso {
  id: number
  persona: string
  tipo: 'Residente' | 'Visitante' | 'No Identificado'
  accion: string
  hora: string
  fecha: string
  ubicacion: string
  estado: 'Exitoso' | 'Denegado'
}

interface IncidenteEvento {
  id: number
  tipo: string
  descripcion: string
  hora: string
  fecha: string
  ubicacion: string
  estado: string
}

interface HistorialProps {
  onBack: () => void
}

export default function Historial({ }: HistorialProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState('Todos los tipos')
  const [fechaFilter, setFechaFilter] = useState('Hoy')
  const [activeTab, setActiveTab] = useState('accesos')

  const registrosAcceso: RegistroAcceso[] = [
    {
      id: 1,
      persona: 'María García López',
      tipo: 'Residente',
      accion: 'Acceso Exitoso',
      hora: '08:30:15',
      fecha: '25/09/2025',
      ubicacion: 'Entrada Principal',
      estado: 'Exitoso'
    },
    {
      id: 2,
      persona: 'Juan Perez Soto',
      tipo: 'Visitante',
      accion: 'Acceso Autorizado',
      hora: '14:30:22',
      fecha: '25/09/2025',
      ubicacion: 'Entrada Principal',
      estado: 'Exitoso'
    },
    {
      id: 3,
      persona: 'Desconocido',
      tipo: 'No Identificado',
      accion: 'Acceso Denegado',
      hora: '22:15:33',
      fecha: '24/09/2025',
      ubicacion: 'Entrada Principal',
      estado: 'Denegado'
    },
    {
      id: 4,
      persona: 'Carlos Mendoza Rivera',
      tipo: 'Residente',
      accion: 'Salida Registrada',
      hora: '07:45:12',
      fecha: '25/09/2025',
      ubicacion: 'Entrada Principal',
      estado: 'Exitoso'
    },
    {
      id: 5,
      persona: 'Ana Sofía Ruiz',
      tipo: 'Residente',
      accion: 'Acceso Exitoso',
      hora: '19:20:08',
      fecha: '24/09/2025',
      ubicacion: 'Entrada Principal',
      estado: 'Exitoso'
    }
  ]

  const incidentes: IncidenteEvento[] = [
    {
      id: 1,
      tipo: 'Intento de acceso',
      descripcion: 'Intento de acceso no autorizado detectado',
      hora: '22:15:33',
      fecha: '24/09/2025',
      ubicacion: 'Entrada Principal',
      estado: 'Resuelto'
    },
    {
      id: 2,
      tipo: 'Falla de sistema',
      descripcion: 'Pérdida temporal de conexión con cámara 3',
      hora: '15:30:00',
      fecha: '24/09/2025',
      ubicacion: 'Piso 2',
      estado: 'Resuelto'
    }
  ]

  const eventosSistema: IncidenteEvento[] = [
    {
      id: 1,
      tipo: 'Mantenimiento',
      descripcion: 'Backup automático completado exitosamente',
      hora: '02:00:00',
      fecha: '25/09/2025',
      ubicacion: 'Servidor',
      estado: 'Completado'
    },
    {
      id: 2,
      tipo: 'Actualización',
      descripcion: 'Sistema de reconocimiento facial actualizado',
      hora: '01:30:00',
      fecha: '24/09/2025',
      ubicacion: 'Sistema',
      estado: 'Completado'
    }
  ]

  const filteredRegistros = registrosAcceso.filter(registro => {
    const matchesSearch = registro.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registro.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registro.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTipo = tipoFilter === 'Todos los tipos' || registro.tipo === tipoFilter
    
    return matchesSearch && matchesTipo
  })

  const handleExportar = () => {
    console.log('Exportar historial')
    alert('Exportando historial...')
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