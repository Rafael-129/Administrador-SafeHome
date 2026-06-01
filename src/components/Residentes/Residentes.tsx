import { useEffect, useState } from 'react'
import './Residentes.css'
import type { Residente, ComponentProps } from '../../types'
import ApiService from '../../services/api'

interface DepartamentoOption {
  id: number
  codigo: string
}

type ResidenteRow = Residente & {
  idDepartamento: number
}

type NewResidenteForm = {
  nombreCompleto: string
  dni: string
  correo: string
  departamento: string
}

export default function Residentes({}: ComponentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos los estados')
  const [pisoFilter, setPisoFilter] = useState('Todos los Pisos')
  const [selectedResidenteId, setSelectedResidenteId] = useState<number | null>(null)
  const [editingResidenteId, setEditingResidenteId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [departamentos, setDepartamentos] = useState<DepartamentoOption[]>([])

  const [newResidente, setNewResidente] = useState<NewResidenteForm>({
    nombreCompleto: '',
    dni: '',
    correo: '',
    departamento: '',
  })

  const [residentes, setResidentes] = useState<ResidenteRow[]>([])

  const resetNewResidente = () => {
    setNewResidente({
      nombreCompleto: '',
      dni: '',
      correo: '',
      departamento: '',
    })
  }

  const splitNombreCompleto = (fullName: string) => {
    const partes = fullName.trim().split(/\s+/).filter(Boolean)
    const nombre = partes.shift() || ''
    const apellido = partes.join(' ') || '-'
    return { nombre, apellido }
  }

  const findDepartamentoIdByCode = (codigo: string) => {
    const objetivo = codigo.trim().toUpperCase()
    const match = departamentos.find((dep) => dep.codigo.toUpperCase() === objetivo)
    return match ? match.id : null
  }

  const cargarResidentes = async () => {
    setIsLoading(true)
    try {
      const [usuarios, departamentosRows] = await Promise.all([
        ApiService.getUsuarios(),
        ApiService.getDepartamentos(),
      ])

      const options = departamentosRows
        .map((dep) => {
          const id = Number(dep.iddepartamento)
          if (Number.isNaN(id)) {
            return null
          }
          return {
            id,
            codigo: String(dep.codigo || `ID ${id}`),
          }
        })
        .filter((dep): dep is DepartamentoOption => dep !== null)

      const depMap = new Map<number, string>()
      options.forEach((dep) => depMap.set(dep.id, dep.codigo))

      const mapped = usuarios.reduce<ResidenteRow[]>((acc, usuario) => {
        const id = Number(usuario.idusuario)
        const idDepartamento = Number(usuario.iddepartamento)
        if (Number.isNaN(id) || Number.isNaN(idDepartamento)) {
          return acc
        }

        acc.push({
          id,
          idDepartamento,
          nombre: `${String(usuario.nombre || '')} ${String(usuario.apellido || '')}`.trim(),
          departamento: depMap.get(idDepartamento) || `ID ${idDepartamento}`,
          dni: String(usuario.dni || ''),
          telefono: String(usuario.correo || ''),
          estado: 'Activo',
          registro: '-',
        })
        return acc
      }, [])

      setDepartamentos(options)
      setResidentes(mapped)
      setFeedback(null)
    } catch {
      setFeedback('No se pudieron cargar residentes desde el backend.')
      setResidentes([])
      setDepartamentos([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void cargarResidentes()
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
    setIsCreateOpen((prev) => !prev)
    setFeedback(null)
  }

  const handleFieldChange = (id: number, field: keyof Residente, value: string) => {
    setResidentes((prev) =>
      prev.map((residente) =>
        residente.id === id ? { ...residente, [field]: value } : residente
      )
    )
  }

  const handleCreateResident = async () => {
    const nombreCompleto = newResidente.nombreCompleto.trim()
    const dni = newResidente.dni.trim()
    const correo = newResidente.correo.trim()
    const codigoDepartamento = newResidente.departamento.trim().toUpperCase()

    if (!nombreCompleto || !dni || !codigoDepartamento) {
      setFeedback('Nombre completo, DNI y departamento son obligatorios.')
      return
    }

    if (!/^\d{8}$/.test(dni)) {
      setFeedback('El DNI debe contener exactamente 8 digitos.')
      return
    }

    const idDepartamento = findDepartamentoIdByCode(codigoDepartamento)
    if (!idDepartamento) {
      setFeedback('El codigo de departamento no existe. Usa uno valido, por ejemplo A-101.')
      return
    }

    const { nombre, apellido } = splitNombreCompleto(nombreCompleto)
    if (!nombre) {
      setFeedback('Ingresa un nombre valido para el residente.')
      return
    }

    setIsSaving(true)
    try {
      await ApiService.createUsuario({
        nombre,
        apellido,
        dni,
        correo: correo || null,
        iddepartamento: idDepartamento,
      })

      setFeedback('Residente creado y guardado en backend.')
      setIsCreateOpen(false)
      resetNewResidente()
      await cargarResidentes()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al crear residente.'
      setFeedback(`No se pudo crear residente: ${message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = async (id: number) => {
    const residente = residentes.find((item) => item.id === id)
    if (!residente) {
      setFeedback('No se encontro el residente a guardar.')
      return
    }

    const nombreCompleto = residente.nombre.trim()
    const dni = residente.dni.trim()
    if (!nombreCompleto || !/^\d{8}$/.test(dni)) {
      setFeedback('Verifica nombre y DNI (8 digitos) antes de guardar.')
      return
    }

    const idDepartamento = findDepartamentoIdByCode(residente.departamento)
    if (!idDepartamento) {
      setFeedback('El departamento editado no existe. Usa un codigo valido.')
      return
    }

    const { nombre, apellido } = splitNombreCompleto(nombreCompleto)
    setIsSaving(true)
    try {
      await ApiService.updateUsuario(id, {
        nombre,
        apellido,
        dni,
        correo: residente.telefono || null,
        iddepartamento: idDepartamento,
      })

      setEditingResidenteId(null)
      setFeedback('Cambios guardados en backend correctamente.')
      await cargarResidentes()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al guardar cambios.'
      setFeedback(`No se pudieron guardar cambios: ${message}`)
    } finally {
      setIsSaving(false)
    }
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
          {isCreateOpen ? '✖ Cerrar Alta' : '➕ Nuevo Residente'}
        </button>
      </div>

      {isCreateOpen && (
        <div className="no-results" style={{ marginBottom: '1rem' }}>
          <p><strong>Alta de residente</strong></p>
          <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.75rem' }}>
            <input
              className="search-input"
              placeholder="Nombre completo"
              value={newResidente.nombreCompleto}
              onChange={(e) => setNewResidente((prev) => ({ ...prev, nombreCompleto: e.target.value }))}
            />
            <input
              className="search-input"
              placeholder="DNI (8 digitos)"
              value={newResidente.dni}
              onChange={(e) => setNewResidente((prev) => ({ ...prev, dni: e.target.value }))}
            />
            <input
              className="search-input"
              placeholder="Correo"
              value={newResidente.correo}
              onChange={(e) => setNewResidente((prev) => ({ ...prev, correo: e.target.value }))}
            />
            <input
              className="search-input"
              placeholder="Codigo de departamento (ej. A-101)"
              value={newResidente.departamento}
              onChange={(e) => setNewResidente((prev) => ({ ...prev, departamento: e.target.value.toUpperCase() }))}
            />
            <button
              className="new-resident-btn"
              onClick={() => void handleCreateResident()}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar Residente'}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="residentes-table-container">
        <table className="residentes-table">
          <thead>
            <tr>
              <th>RESIDENTES</th>
              <th>DEPARTAMENTO</th>
              <th>DNI</th>
              <th>CORREO</th>
              <th>ESTADO</th>
              <th>REGISTRO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7}>Cargando residentes...</td>
              </tr>
            )}
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
                        onClick={() => void handleSave(residente.id)}
                        className="action-btn extend-btn"
                        title="Guardar"
                        disabled={isSaving}
                      >
                        {isSaving ? '⏳ Guardando' : '💾 Guardar'}
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
            Residente seleccionado: {selectedResidente.nombre} | DNI: {selectedResidente.dni} | Depto: {selectedResidente.departamento} | Correo: {selectedResidente.telefono || '-'}
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