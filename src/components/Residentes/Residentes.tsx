import { useEffect, useState } from 'react'
import './Residentes.css'
import type { Residente, ComponentProps } from '../../types'
import ApiService from '../../services/api'

export default function Residentes({}: ComponentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos los estados')
  const [pisoFilter, setPisoFilter] = useState('Todos los Pisos')
  const [selectedResidenteId, setSelectedResidenteId] = useState<number | null>(null)
  const [editingResidenteId, setEditingResidenteId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const [residentes, setResidentes] = useState<Residente[]>([])

  useEffect(() => {
    const cargarResidentes = async () => {
      try {
        const [usuarios, departamentos] = await Promise.all([
          ApiService.getUsuarios(),
          ApiService.getDepartamentos(),
        ])

        const depMap = new Map<number, string>()
        departamentos.forEach((dep) => {
          const id = Number(dep.iddepartamento)
          if (!Number.isNaN(id)) {
            depMap.set(id, String(dep.codigo || `ID ${id}`))
          }
        })

        const mapped = usuarios.map((usuario) => {
          const idDepartamento = Number(usuario.iddepartamento)
          return {
            id: Number(usuario.idusuario),
            nombre: `${String(usuario.nombre || '')} ${String(usuario.apellido || '')}`.trim(),
            departamento: depMap.get(idDepartamento) || `ID ${idDepartamento}`,
            dni: String(usuario.dni || ''),
            telefono: String(usuario.correo || '-'),
            estado: 'Activo' as const,
            registro: '-',
          }
        })

        setResidentes(mapped)
        setFeedback(null)
      } catch {
        setFeedback('No se pudieron cargar residentes desde el backend.')
        setResidentes([])
      }
    }

    cargarResidentes()
  }, [])

  const filteredResidentes = residentes.filter(residente => {
    const matchesSearch = residente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         residente.dni.includes(searchTerm) ||
                         residente.departamento.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = estadoFilter === 'Todos los estados' || residente.estado === estadoFilter
    const piso = residente.departamento.split('-')[0]
    const matchesPiso = pisoFilter === 'Todos los Pisos' || piso === pisoFilter
    
    return matchesSearch && matchesEstado && matchesPiso
  })

  const handleEdit = (id: number) => {
    setEditingResidenteId(id)
    setFeedback('Modo edición habilitado. Usa el botón Guardar para confirmar cambios.')
  }

  const handleView = (id: number) => {
    setSelectedResidenteId(id)
    setFeedback(null)
  }

  const handleNewResident = () => {
    setFeedback('Para crear residentes desde Dashboard falta endpoint/formulario de alta de usuarios en backend.')
  }

  const handleFieldChange = (id: number, field: keyof Residente, value: string) => {
    setResidentes((prev) =>
      prev.map((residente) =>
        residente.id === id ? { ...residente, [field]: value } : residente
      )
    )
  }

  const handleSave = () => {
    setEditingResidenteId(null)
    setFeedback('Cambios locales aplicados en la UI. Para persistir en backend falta endpoint de actualización de residentes en este módulo.')
  }

  const selectedResidente = residentes.find((r) => r.id === selectedResidenteId)

  return (
    <div className="residentes-container">
      {/* Header */}
      <div className="residentes-header">
        <div className="header-content">
          <h1>Gestión de Residentes</h1>
          <p>Administra los residentes registrados en el sistema de reconocimiento facial</p>
        </div>
      </div>

      {/* Controls */}
      <div className="residentes-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, DNI o departamento"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters-container">
          <select 
            value={estadoFilter} 
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="filter-select"
          >
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>

          <select 
            value={pisoFilter} 
            onChange={(e) => setPisoFilter(e.target.value)}
            className="filter-select"
          >
            <option>Todos los Pisos</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>

        <button onClick={handleNewResident} className="new-resident-btn">
          ➕ Nuevo Residente
        </button>
      </div>

      {/* Table */}
      <div className="residentes-table-container">
        <table className="residentes-table">
          <thead>
            <tr>
              <th>RESIDENTES</th>
              <th>DEPARTAMENTO</th>
              <th>DNI</th>
              <th>TELÉFONO</th>
              <th>ESTADO</th>
              <th>REGISTRO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidentes.map((residente) => (
              <tr key={residente.id}>
                <td className="resident-name">
                  {editingResidenteId === residente.id ? (
                    <input
                      className="search-input"
                      value={residente.nombre}
                      onChange={(e) => handleFieldChange(residente.id, 'nombre', e.target.value)}
                    />
                  ) : (
                    residente.nombre
                  )}
                </td>
                <td>
                  {editingResidenteId === residente.id ? (
                    <input
                      className="search-input"
                      value={residente.departamento}
                      onChange={(e) => handleFieldChange(residente.id, 'departamento', e.target.value.toUpperCase())}
                    />
                  ) : (
                    residente.departamento
                  )}
                </td>
                <td>{residente.dni}</td>
                <td>
                  {editingResidenteId === residente.id ? (
                    <input
                      className="search-input"
                      value={residente.telefono}
                      onChange={(e) => handleFieldChange(residente.id, 'telefono', e.target.value)}
                    />
                  ) : (
                    residente.telefono
                  )}
                </td>
                <td>
                  <span className={`status-badge ${residente.estado.toLowerCase()}`}>
                    {residente.estado}
                  </span>
                </td>
                <td>{residente.registro}</td>
                <td>
                  <div className="actions-container">
                    <button 
                      onClick={() => handleEdit(residente.id)}
                      className="action-btn edit-btn"
                      title="Editar"
                    >
                      ✏️ Editar
                    </button>
                    {editingResidenteId === residente.id && (
                      <button 
                        onClick={handleSave}
                        className="action-btn extend-btn"
                        title="Guardar"
                      >
                        💾 Guardar
                      </button>
                    )}
                    <button 
                      onClick={() => handleView(residente.id)}
                      className="action-btn view-btn"
                      title="Ver"
                    >
                      👁️ Ver
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {feedback && (
        <div className="no-results" style={{ marginTop: '1rem' }}>
          <p>{feedback}</p>
        </div>
      )}

      {selectedResidente && (
        <div className="no-results" style={{ marginTop: '1rem' }}>
          <p>
            Residente seleccionado: {selectedResidente.nombre} | DNI: {selectedResidente.dni} | Depto: {selectedResidente.departamento}
          </p>
        </div>
      )}

      {filteredResidentes.length === 0 && (
        <div className="no-results">
          <p>No se encontraron residentes que coincidan con los criterios de búsqueda.</p>
        </div>
      )}
    </div>
  )
}