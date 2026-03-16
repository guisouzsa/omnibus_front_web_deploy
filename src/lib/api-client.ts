import { ApiResponse, QueryParams } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  }

  public removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        this.removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      const error: any = new Error(
        data?.message || `Request failed with status ${response.status}`
      );
      error.response = data;
      error.status = response.status;
      throw error;
    }

    return data as T;
  }

  private buildQueryString(params?: QueryParams): string {
    if (!params) return '';
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  public async get<T = any>(
    endpoint: string,
    params?: QueryParams
  ): Promise<T> {
    const token = this.getToken();
    const queryString = this.buildQueryString(params);

    const response = await fetch(`${this.baseURL}${endpoint}${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  public async post<T = any>(
    endpoint: string,
    body?: any,
    options?: { isFormData?: boolean }
  ): Promise<T> {
    const token = this.getToken();
    const isFormData = options?.isFormData || body instanceof FormData;

    const headers: HeadersInit = {
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  public async put<T = any>(
    endpoint: string,
    body?: any
  ): Promise<T> {
    const token = this.getToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  public async patch<T = any>(
    endpoint: string,
    body?: any
  ): Promise<T> {
    const token = this.getToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  public async delete<T = any>(endpoint: string): Promise<T> {
    const token = this.getToken();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  // Método específico para login que salva o token
  public async login<T extends { token: string }>(
    endpoint: string,
    credentials: any
  ): Promise<T> {
    const response = await this.post<T>(endpoint, credentials);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  // Método para verificar se está autenticado
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Exportar instância singleton
export const apiClient = new ApiClient();
