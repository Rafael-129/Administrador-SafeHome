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
      let detail = `HTTP ${response.status}`
      try {
        const payload = await response.json()
        if (typeof payload === 'string') {
          detail = payload
        } else if (payload && typeof payload === 'object') {
          const firstValue = Object.values(payload)[0]
          if (Array.isArray(firstValue)) {
            detail = String(firstValue[0] || detail)
          } else if (firstValue != null) {
            detail = String(firstValue)
          }
        }
      } catch {
        const text = await response.text().catch(() => '')
        if (text) {
          detail = text
        }
      }
      throw new Error(detail)
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

  async createUsuario(payload: Record<string, unknown>) {
    return this.request<Record<string, unknown>>('/usuarios/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async updateUsuario(id: number, payload: Record<string, unknown>) {
    return this.request<Record<string, unknown>>(`/usuarios/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  }

  async deleteUsuario(id: number) {
    return this.request<null>(`/usuarios/${id}/`, {
      method: 'DELETE',
    })
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

  async updateVisitante(id: number, payload: Record<string, unknown>) {
    return this.request<Record<string, unknown>>(`/visitantes/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  }

  async deleteVisitante(id: number) {
    return this.request<null>(`/visitantes/${id}/`, {
      method: 'DELETE',
    })
  }

  async finalizarVisitante(id: number) {
    return this.request<Record<string, unknown>>(`/visitantes/${id}/finalizar/`, {
      method: 'POST',
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

  async downloadReporte(params: { tipo?: string; desde?: string; hasta?: string; formato?: string }) {
    const qs = [] as string[]
    if (params.tipo) qs.push(`tipo=${encodeURIComponent(params.tipo)}`)
    if (params.desde) qs.push(`desde=${encodeURIComponent(params.desde)}`)
    if (params.hasta) qs.push(`hasta=${encodeURIComponent(params.hasta)}`)
    if (params.formato) qs.push(`formato=${encodeURIComponent(params.formato)}`)
    const url = `${API_BASE_URL}/reportes/${qs.length ? '?' + qs.join('&') : ''}`
    const resp = await fetch(url, { method: 'GET' })
    if (!resp.ok) {
      let detail = `HTTP ${resp.status}`
      try {
        const payload = await resp.json()
        detail = JSON.stringify(payload)
      } catch {
        detail = await resp.text().catch(() => detail)
      }
      throw new Error(detail)
    }
    const blob = await resp.blob()
    return blob
  }
}

export default new ApiService()
