import { API_CONFIG, buildApiUrl, getDefaultHeaders } from './api-config'

interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

class ApiClient {
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    options: {
      body?: any
      params?: Record<string, string>
      headers?: Record<string, string>
    } = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = new URL(buildApiUrl(path))

      // Ajouter les paramètres de requête
      if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
          url.searchParams.set(key, value)
        })
      }

      const headers = {
        ...getDefaultHeaders(),
        ...options.headers,
      }

      const requestOptions: RequestInit = {
        method,
        headers,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      }

      if (options.body && method !== 'GET') {
        requestOptions.body = JSON.stringify(options.body)
      }

      console.log(`[${method}] ${url.toString()}`)

      const response = await fetch(url.toString(), requestOptions)
      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        return {
          error: responseData?.error || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        }
      }

      return {
        data: responseData,
        status: response.status,
      }
    } catch (error) {
      console.error(`API Error [${method} ${path}]:`, error)
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      }
    }
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request('GET', path, { params })
  }

  async post<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request('POST', path, { body })
  }

  async put<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request('PUT', path, { body })
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request('DELETE', path)
  }
}

export const apiClient = new ApiClient()