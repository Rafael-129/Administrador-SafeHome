// Utilidades y helpers para el dashboard

/**
 * Formatea una fecha a string legible
 */
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  }
  return date.toLocaleDateString('es-ES', options)
}

/**
 * Obtiene la fecha actual formateada
 */
export const getCurrentDate = (): string => {
  return formatDate(new Date())
}

/**
 * Valida credenciales de usuario
 */
export const validateCredentials = (username: string, password: string): boolean => {
  return username === 'admin' && password === 'admin123'
}

/**
 * Genera un ID único simple
 */
export const generateId = (): number => {
  return Math.floor(Math.random() * 1000000)
}

/**
 * Capitaliza la primera letra de una cadena
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Filtra elementos por término de búsqueda
 */
export const filterBySearchTerm = <T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return items
  
  return items.filter(item =>
    searchFields.some(field =>
      String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
}

/**
 * Debounce function para optimizar búsquedas
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Convierte un color hex a rgba
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Exporta datos a CSV
 */
export const exportToCSV = (data: any[], filename: string): void => {
  if (!data.length) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}