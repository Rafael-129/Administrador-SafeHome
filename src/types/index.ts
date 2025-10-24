// Interfaces para el sistema de dashboard

export interface User {
  id: number
  username: string
  role: 'admin' | 'user'
}

export interface Residente {
  id: number
  nombre: string
  departamento: string
  dni: string
  telefono: string
  estado: 'Activo' | 'Inactivo'
  registro: string
}

export interface Visitante {
  id: number
  nombre: string
  visitaA: string
  horaEntrada: string
  tiempoRestante: string
  estado: 'Activo' | 'Vencido'
  registro: string
}

export interface RegistroAcceso {
  id: number
  persona: string
  tipo: 'Residente' | 'Visitante' | 'No Identificado'
  accion: string
  hora: string
  fecha: string
  ubicacion: string
  estado: 'Exitoso' | 'Denegado'
}

export interface Camara {
  id: number
  nombre: string
  ubicacion: string
  resolucion: string
  fps: string
  estado: 'Online' | 'Offline'
}

export interface ReporteRapido {
  id: string
  titulo: string
  descripcion: string
  color: string
  icon: string
  ultimaActualizacion: string
}

export interface ReporteHistorial {
  id: number
  nombre: string
  fecha: string
  estado: 'Completado' | 'En Proceso' | 'Error'
}

export interface ActivityData {
  id: number
  type: string
  name: string
  description: string
  time: string
  color: string
}

export interface ComponentProps {
  onBack: () => void
}

export interface DashboardProps {
  onLogout: () => void
}

export interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onLogout: () => void
}

export interface LoginProps {
  onLogin: () => void
}

export type SectionId = 
  | 'dashboard' 
  | 'residentes' 
  | 'visitantes' 
  | 'historial' 
  | 'camaras' 
  | 'reportes' 
  | 'configuracion'