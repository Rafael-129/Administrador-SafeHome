import { useState } from 'react'
import './Dashboard.css'
import type { DashboardProps } from '../../types'
import Navigation from './Navigation'
import DashboardContent from './DashboardContent'
import Residentes from '../Residentes/Residentes'
import Visitantes from '../Visitantes/Visitantes'
import Historial from '../Historial/Historial'
import Camaras from '../Camaras/Camaras'
import Reportes from '../Reportes/Reportes'

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard')

  return (
    <div className="dashboard-container">
      <Navigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={onLogout}
      />
      
      <div className="main-content">
        {activeSection === 'dashboard' && <DashboardContent />}
        {activeSection === 'residentes' && <Residentes onBack={() => setActiveSection('dashboard')} />}
        {activeSection === 'visitantes' && <Visitantes onBack={() => setActiveSection('dashboard')} />}
        {activeSection === 'historial' && <Historial onBack={() => setActiveSection('dashboard')} />}
        {activeSection === 'camaras' && <Camaras onBack={() => setActiveSection('dashboard')} />}
        {activeSection === 'reportes' && <Reportes onBack={() => setActiveSection('dashboard')} />}
      </div>
    </div>
  )
}