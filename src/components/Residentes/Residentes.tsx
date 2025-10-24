import { useState } from 'react'
import './Residentes.css'
import type { Residente, ComponentProps } from '../../types'

export default function Residentes({}: ComponentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos los estados')
  const [pisoFilter, setPisoFilter] = useState('Todos los Pisos')

  const [residentes] = useState<Residente[]>([
    {
      id: 1,
      nombre: 'María García López',
      departamento: 'A-501',
      dni: '12345678',
      telefono: '+51 999 888 777',
      estado: 'Activo',
      registro: '15/03/2025'
    },
    {
      id: 2,
      nombre: 'Carlos Mendoza Rivera',
      departamento: 'B-302',
      dni: '87654321',
      telefono: '+51 999 777 888',
      estado: 'Activo',
      registro: '10/03/2025'
    },
    {
      id: 3,
      nombre: 'Ana Sofía Ruiz',
      departamento: 'C-105',
      dni: '11223344',
      telefono: '+51 999 666 555',
      estado: 'Inactivo',
      registro: '05/03/2025'
    }
  ])

  const filteredResidentes = residentes.filter(residente => {
    const matchesSearch = residente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         residente.dni.includes(searchTerm) ||
                         residente.departamento.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = estadoFilter === 'Todos los estados' || residente.estado === estadoFilter
    
    return matchesSearch && matchesEstado
  })

  const handleEdit = (id: number) => {
    console.log('Editar residente:', id)
    // Aquí iría la lógica para editar
  }

  const handleView = (id: number) => {
    console.log('Ver residente:', id)
    // Aquí iría la lógica para ver detalles
  }

  const handleNewResident = () => {
    console.log('Nuevo residente')
    // Aquí iría la lógica para crear nuevo residente
  }

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
            <option>Piso A</option>
            <option>Piso B</option>
            <option>Piso C</option>
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
                <td className="resident-name">{residente.nombre}</td>
                <td>{residente.departamento}</td>
                <td>{residente.dni}</td>
                <td>{residente.telefono}</td>
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

      {filteredResidentes.length === 0 && (
        <div className="no-results">
          <p>No se encontraron residentes que coincidan con los criterios de búsqueda.</p>
        </div>
      )}
    </div>
  )
}