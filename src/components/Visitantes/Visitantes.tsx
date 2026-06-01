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
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  const [visitantes, setVisitantes] = useState<Visitante[]>([])
  const [extendModalOpen, setExtendModalOpen] = useState(false)
  const [extendingVisitantId, setExtendingVisitantId] = useState<number | null>(null)
  const [horasExtension, setHorasExtension] = useState(2)

  const parseDateTime = (fecha?: unknown, hora?: unknown) => {
    const fechaStr = String(fecha || '').trim()
    const horaStr = String(hora || '').trim()
    if (!fechaStr || !horaStr) {
      return null
    }
    const iso = `${fechaStr}T${horaStr.length === 5 ? `${horaStr}:00` : horaStr}`
    const dt = new Date(iso)
    return Number.isNaN(dt.getTime()) ? null : dt
  }

  const getEstadoYTiempo = (fecha?: unknown, hora?: unknown) => {
    const inicio = parseDateTime(fecha, hora)
    if (!inicio) {
      return {
        estado: 'Vencido' as const,
        tiempoRestante: 'Sin hora',
      }
    }

    const vencimiento = new Date(inicio.getTime() + 2 * 60 * 60 * 1000)
    const restanteMs = vencimiento.getTime() - Date.now()
    if (restanteMs <= 0) {
      return {
        estado: 'Vencido' as const,
        tiempoRestante: '0h 0m',
      }
    }

    const horas = Math.floor(restanteMs / (60 * 60 * 1000))
    const minutos = Math.floor((restanteMs % (60 * 60 * 1000)) / (60 * 1000))
    return {
      estado: 'Activo' as const,
      tiempoRestante: `${horas}h ${minutos}m`,
    }
  }

  const cargarVisitantes = async () => {
    setIsLoading(true)
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
        const horaVisita = String(v.hora_visita || '')
        const { estado, tiempoRestante } = getEstadoYTiempo(fechaVisita, horaVisita)
        const idDepartamento = Number(v.iddepartamento)
        return {
          id: Number(v.idvisitante),
          nombre: `${String(v.nombre || '')} ${String(v.apellido || '')}`.trim(),
          visitaA: depMap.get(idDepartamento) || `ID ${idDepartamento}`,
          horaEntrada: String(v.hora_visita || '-').slice(0, 5),
          tiempoRestante,
          estado,
          registro: fechaVisita ? new Date(fechaVisita).toLocaleDateString('es-PE') : '-',
        }
      })

      setVisitantes(mapped)
      setFeedback(null)
    } catch {
      setVisitantes([])
      setFeedback('No se pudieron cargar visitantes desde backend.')
    } finally {
      setIsLoading(false)
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
    const nombreCompletoLimpio = nombreCompleto.trim()
    const dniLimpio = dni.trim()
    const visitaALimpio = visitaA.trim().toUpperCase()

    if (!nombreCompletoLimpio || !dniLimpio || !visitaALimpio) {
      setFeedback('Por favor complete todos los campos requeridos.')
      return
    }

    if (!/^\d{8}$/.test(dniLimpio)) {
      setFeedback('El DNI debe contener exactamente 8 digitos.')
      return
    }

    const registrar = async () => {
      setIsSubmitting(true)
      try {
        const now = new Date()
        const nombreParts = nombreCompletoLimpio.split(/\s+/)
        const nombre = nombreParts.shift() || ''
        const apellido = nombreParts.join(' ') || '-'

        await ApiService.createVisitante({
          nombre,
          apellido,
          dni: dniLimpio,
          motivo: 'Registro rápido desde dashboard',
          fecha_visita: now.toISOString().slice(0, 10),
          hora_visita: now.toTimeString().slice(0, 8),
          depart_visita: visitaALimpio,
          acepta_foto: false,
        })

        setFeedback('Ingreso autorizado y guardado en backend.')
        setNombreCompleto('')
        setDni('')
        setVisitaA('')
        await cargarVisitantes()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido al registrar visitante.'
        setFeedback(`No se pudo registrar: ${message}`)
      } finally {
        setIsSubmitting(false)
      }
    }

    void registrar()
  }

  const handleExtender = (id: number) => {
    setExtendingVisitantId(id)
    setHorasExtension(2)
    setExtendModalOpen(true)
  }

  const handleConfirmExtend = async () => {
    if (!extendingVisitantId) {
      return
    }

    setActionLoadingId(extendingVisitantId)
    try {
      const visitante = await ApiService.getVisitantes()
      const actual = visitante.find((v) => Number(v.idvisitante) === extendingVisitantId)
      if (!actual) {
        setFeedback('No se encontro el visitante seleccionado.')
        return
      }

      const inicioActual = parseDateTime(actual.fecha_visita, actual.hora_visita)
      const base = inicioActual && inicioActual.getTime() > Date.now() ? inicioActual : new Date()
      const nuevaHora = new Date(base.getTime() + horasExtension * 60 * 60 * 1000)

      await ApiService.updateVisitante(extendingVisitantId, {
        fecha_visita: nuevaHora.toISOString().slice(0, 10),
        hora_visita: nuevaHora.toTimeString().slice(0, 8),
      })

      setFeedback(`Visita extendida por ${horasExtension} horas y guardada en backend.`)
      setExtendModalOpen(false)
      setExtendingVisitantId(null)
      await cargarVisitantes()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al extender visita.'
      setFeedback(`No se pudo extender la visita: ${message}`)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleFinalizar = async (id: number) => {
    setActionLoadingId(id)
    try {
      await ApiService.finalizarVisitante(id)
      setFeedback(`Visita ${id} finalizada correctamente.`)
      await cargarVisitantes()
      // notify other components (e.g. Historial) to refresh
      try {
        window.dispatchEvent(new CustomEvent('visitanteFinalizado', { detail: { id } }))
      } catch {
        // ignore if CustomEvent is not supported in some environments
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al finalizar visita.'
      setFeedback(`No se pudo finalizar visita: ${message}`)
    } finally {
      setActionLoadingId(null)
    }
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
              {isSubmitting ? 'Autorizando...' : 'Autorizar Ingreso'}
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
            {isLoading && (
              <tr>
                <td colSpan={7}>Cargando visitantes...</td>
              </tr>
            )}
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
                      disabled={actionLoadingId === visitante.id}
                    >
                      {actionLoadingId === visitante.id ? 'Procesando...' : 'Extender'}
                    </button>
                    <button 
                      onClick={() => void handleFinalizar(visitante.id)}
                      className="action-btn finalize-btn"
                      disabled={actionLoadingId === visitante.id}
                    >
                      {actionLoadingId === visitante.id ? 'Procesando...' : 'Finalizar'}
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
                onClick={() => void handleConfirmExtend()}
                disabled={extendingVisitantId !== null && actionLoadingId === extendingVisitantId}
              >
                {extendingVisitantId !== null && actionLoadingId === extendingVisitantId
                  ? 'Guardando...'
                  : `Extender ${horasExtension}h`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}