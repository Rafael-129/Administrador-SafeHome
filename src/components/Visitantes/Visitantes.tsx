import { useEffect, useState } from 'react'
import './Visitantes.css'
import type { Visitante, ComponentProps } from '../../types'
import ApiService from '../../services/api'

export default function Visitantes({}: ComponentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [dni, setDni] = useState('')
  const [visitaA, setVisitaA] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const [visitantes, setVisitantes] = useState<Visitante[]>([])
  const [extendModalOpen, setExtendModalOpen] = useState(false)
  const [extendingVisitantId, setExtendingVisitantId] = useState<number | null>(null)
  const [horasExtension, setHorasExtension] = useState(2)

  const cargarVisitantes = async () => {
    try {
      const [rows, departamentos] = await Promise.all([
        ApiService.getVisitantes(),
        ApiService.getDepartamentos(),
      ])

      const depMap = new Map<number, string>()
      departamentos.forEach((dep) => {
        const id = Number(dep.iddepartamento)
        if (!Number.isNaN(id)) {
          depMap.set(id, String(dep.codigo || `ID ${id}`))
        }
      })

      const mapped = rows.map((v) => {
        const fechaVisita = String(v.fecha_visita || '')
        const hoy = new Date().toISOString().slice(0, 10)
        const estado: Visitante['estado'] = fechaVisita >= hoy ? 'Activo' : 'Vencido'
        const idDepartamento = Number(v.iddepartamento)
        return {
          id: Number(v.idvisitante),
          nombre: `${String(v.nombre || '')} ${String(v.apellido || '')}`.trim(),
          visitaA: depMap.get(idDepartamento) || `ID ${idDepartamento}`,
          horaEntrada: String(v.hora_visita || '-').slice(0, 5),
          tiempoRestante: estado === 'Activo' ? 'En curso' : '0 horas',
          estado,
          registro: fechaVisita ? new Date(fechaVisita).toLocaleDateString('es-PE') : '-',
        }
      })

      setVisitantes(mapped)
      setFeedback(null)
    } catch {
      setVisitantes([])
      setFeedback('No se pudieron cargar visitantes desde backend.')
    }
  }

  useEffect(() => {
    cargarVisitantes()
  }, [])

  const estadisticas = {
    visitantesActivos: visitantes.filter((v) => v.estado === 'Activo').length,
    enEspera: 0,
    vencidos: visitantes.filter((v) => v.estado === 'Vencido').length,
    totalHoy: visitantes.length
  }

  const filteredVisitantes = visitantes.filter(visitante =>
    visitante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitante.visitaA.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAutorizarIngreso = () => {
    if (!nombreCompleto || !dni || !visitaA) {
      setFeedback('Por favor complete todos los campos requeridos.')
      return
    }

    const registrar = async () => {
      try {
        const now = new Date()
        const nombreParts = nombreCompleto.trim().split(/\s+/)
        const nombre = nombreParts.shift() || ''
        const apellido = nombreParts.join(' ') || '-'

        await ApiService.createVisitante({
          nombre,
          apellido,
          dni,
          motivo: 'Registro rápido desde dashboard',
          fecha_visita: now.toISOString().slice(0, 10),
          hora_visita: now.toTimeString().slice(0, 8),
          depart_visita: visitaA.trim().toUpperCase(),
          acepta_foto: false,
        })

        setFeedback('Ingreso autorizado y guardado en backend.')
        setNombreCompleto('')
        setDni('')
        setVisitaA('')
        await cargarVisitantes()
      } catch {
        setFeedback('No se pudo registrar. Verifica que "Visita a" sea un código real de departamento (ej. A-101).')
      }
    }

    void registrar()
  }

  const handleExtender = (id: number) => {
    setExtendingVisitantId(id)
    setHorasExtension(2)
    setExtendModalOpen(true)
  }

  const handleConfirmExtend = () => {
    if (extendingVisitantId) {
      setFeedback(`Visita extendida por ${horasExtension} horas.`)
      setExtendModalOpen(false)
      setExtendingVisitantId(null)
    }
  }

  const handleFinalizar = (id: number) => {
    setFeedback(`Finalización de visita (${id}) pendiente de endpoint dedicado en backend.`)
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
                placeholder="Código de departamento (ej. A-101)"
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

      {feedback && (
        <div className="no-results" style={{ marginBottom: '1rem' }}>
          <p>{feedback}</p>
        </div>
      )}

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

      {/* Modal de Extensión */}
      {extendModalOpen && (
        <div className="modal-overlay" onClick={() => setExtendModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Extender Visita</h2>
              <button 
                className="modal-close" 
                onClick={() => setExtendModalOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-label">Selecciona cuántas horas deseas extender la visita:</p>
              
              <div className="hours-selector">
                {[1, 2, 4, 8].map((hours) => (
                  <button
                    key={hours}
                    className={`hour-option ${horasExtension === hours ? 'active' : ''}`}
                    onClick={() => setHorasExtension(hours)}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setExtendModalOpen(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirm"
                onClick={handleConfirmExtend}
              >
                Extender {horasExtension}h
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}