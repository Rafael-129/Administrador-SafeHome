import { useState } from 'react'
import './Visitantes.css'

interface Visitante {
  id: number
  nombre: string
  visitaA: string
  horaEntrada: string
  tiempoRestante: string
  estado: 'Activo' | 'Vencido'
  registro: string
}

interface VisitantesProps {
  onBack: () => void
}

export default function Visitantes({ }: VisitantesProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [dni, setDni] = useState('')
  const [visitaA, setVisitaA] = useState('')

  const [visitantes] = useState<Visitante[]>([
    {
      id: 1,
      nombre: 'Juan Perez Soto',
      visitaA: 'María García - A-501',
      horaEntrada: '14:30',
      tiempoRestante: '1 día',
      estado: 'Activo',
      registro: '25/09/2025'
    },
    {
      id: 2,
      nombre: 'Carlos Rodriguez',
      visitaA: 'Ana Sofía Ruiz - C-105',
      horaEntrada: '15:15',
      tiempoRestante: '4 horas',
      estado: 'Activo',
      registro: '25/09/2025'
    },
    {
      id: 3,
      nombre: 'María Fernández',
      visitaA: 'Luis Torres - A-302',
      horaEntrada: '16:45',
      tiempoRestante: '6 horas',
      estado: 'Activo',
      registro: '25/09/2025'
    },
    {
      id: 4,
      nombre: 'Roberto Silva',
      visitaA: 'Sofía López - B-501',
      horaEntrada: '10:20',
      tiempoRestante: '2 horas',
      estado: 'Activo',
      registro: '25/09/2025'
    }
  ])

  const estadisticas = {
    visitantesActivos: 4,
    enEspera: 3,
    vencidos: 2,
    totalHoy: 15
  }

  const filteredVisitantes = visitantes.filter(visitante =>
    visitante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitante.visitaA.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAutorizarIngreso = () => {
    if (nombreCompleto && dni && visitaA) {
      console.log('Autorizar ingreso:', { nombreCompleto, dni, visitaA })
      // Aquí iría la lógica para autorizar el ingreso
      alert('Ingreso autorizado exitosamente')
      // Limpiar formulario
      setNombreCompleto('')
      setDni('')
      setVisitaA('')
    } else {
      alert('Por favor complete todos los campos')
    }
  }

  const handleExtender = (id: number) => {
    console.log('Extender visita:', id)
    // Aquí iría la lógica para extender la visita
  }

  const handleFinalizar = (id: number) => {
    console.log('Finalizar visita:', id)
    // Aquí iría la lógica para finalizar la visita
  }

  return (
    <div className="visitantes-container">
      {/* Header */}
      <div className="visitantes-header">
        <div className="header-content">
          <h1>Gestión de Visitantes</h1>
          <p>Registra y controla el acceso de visitantes al condominio</p>
        </div>
      </div>

      {/* Registro Rápido */}
      <div className="registro-rapido">
        <div className="registro-header">
          <div className="registro-icon">✅</div>
          <div>
            <h3>Registro Rápido de Visitante</h3>
            <p>Completa los datos básicos para autorizar el ingreso</p>
          </div>
        </div>
        
        <div className="registro-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Ej: Juan Diego Pérez López"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>DNI</label>
              <input
                type="text"
                placeholder="12345678"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Visita a</label>
              <input
                type="text"
                placeholder="Escribir nombre del residente..."
                value={visitaA}
                onChange={(e) => setVisitaA(e.target.value)}
                className="form-input"
              />
            </div>
            
            <button onClick={handleAutorizarIngreso} className="autorizar-btn">
              Autorizar Ingreso
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{estadisticas.visitantesActivos}</div>
          <div className="stat-label">Visitantes Activos</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{estadisticas.enEspera}</div>
          <div className="stat-label">En Espera</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{estadisticas.vencidos}</div>
          <div className="stat-label">Vencidos</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{estadisticas.totalHoy}</div>
          <div className="stat-label">Total Hoy</div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, residente, hora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabla de Visitantes Activos */}
      <div className="visitantes-table-container">
        <div className="table-header">
          <h3>Visitantes Activos</h3>
        </div>
        
        <table className="visitantes-table">
          <thead>
            <tr>
              <th>VISITANTE</th>
              <th>VISITA A</th>
              <th>HORA DE ENTRADA</th>
              <th>TIEMPO RESTANTE</th>
              <th>ESTADO</th>
              <th>REGISTRO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitantes.map((visitante) => (
              <tr key={visitante.id}>
                <td className="visitante-name">{visitante.nombre}</td>
                <td className="visita-a">{visitante.visitaA}</td>
                <td>{visitante.horaEntrada}</td>
                <td>{visitante.tiempoRestante}</td>
                <td>
                  <span className={`status-badge ${visitante.estado.toLowerCase()}`}>
                    {visitante.estado}
                  </span>
                </td>
                <td>{visitante.registro}</td>
                <td>
                  <div className="actions-container">
                    <button 
                      onClick={() => handleExtender(visitante.id)}
                      className="action-btn extend-btn"
                    >
                      Extender
                    </button>
                    <button 
                      onClick={() => handleFinalizar(visitante.id)}
                      className="action-btn finalize-btn"
                    >
                      Finalizar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredVisitantes.length === 0 && (
        <div className="no-results">
          <p>No se encontraron visitantes que coincidan con la búsqueda.</p>
        </div>
      )}
    </div>
  )
}