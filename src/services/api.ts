const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

type ApiResponse<T> = {
  count?: number
  next?: string | null
  previous?: string | null
  results?: T[]
} | T[]

const toArray = <T>(payload: ApiResponse<T>): T[] => {
  if (Array.isArray(payload)) {
    return payload
  }
  return payload.results || []
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => 'Error de red')
      throw new Error(detail || `HTTP ${response.status}`)
    }

    if (response.status === 204) {
      return null as T
    }

    return response.json() as Promise<T>
  }

  async getUsuarios() {
    const data = await this.request<ApiResponse<Record<string, unknown>>>('/usuarios/')
    return toArray(data)
  }

  async getVisitantes() {
    const data = await this.request<ApiResponse<Record<string, unknown>>>('/visitantes/')
    return toArray(data)
  }

  async createVisitante(payload: Record<string, unknown>) {
    return this.request<Record<string, unknown>>('/visitantes/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async getDepartamentos() {
    const data = await this.request<ApiResponse<Record<string, unknown>>>('/departamentos/')
    return toArray(data)
  }

  async getHistorial() {
    const data = await this.request<ApiResponse<Record<string, unknown>>>('/historial/')
    return toArray(data)
  }

  async getHistorialHoy() {
    return this.request<Record<string, unknown>[]>('/historial/hoy/')
  }

  async getVisitantesHoy() {
    return this.request<Record<string, unknown>[]>('/visitantes/hoy/')
  }

  async getEscaneosRecientes() {
    return this.request<Record<string, unknown>[]>('/scanner/recientes/')
  }

  async getEstadisticas(desde: string, hasta: string) {
    return this.request<Record<string, unknown>>(`/historial/estadisticas/?desde=${desde}&hasta=${hasta}`)
  }
}

export default new ApiService()
