import { apiClient } from '@/lib/api-client';
import {
  Driver,
  CreateDriverRequest,
  UpdateDriverRequest,
  QueryParams,
  PaginatedResponse,
  ApiResponse,
  LoginRequest,
  LoginResponse,
} from '@/types/api';

class DriversService {
  // Login de motorista (mobile)
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.login('/api/drivers/login', credentials);
  }

  // Obter motorista autenticado
  async getMe(): Promise<Driver> {
    return apiClient.get('/api/drivers/me');
  }

  // Logout de motorista
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/drivers/logout');
    } finally {
      apiClient.removeToken();
    }
  }

  // Listar todos os motoristas (secretaria)
  async getAll(params?: QueryParams): Promise<PaginatedResponse<Driver>> {
    return apiClient.get('/api/drivers', params);
  }

  // Obter motorista por ID
  async getById(id: number): Promise<Driver> {
    return apiClient.get(`/api/drivers/${id}`);
  }

  // Criar novo motorista
  async create(data: CreateDriverRequest): Promise<ApiResponse<Driver>> {
    return apiClient.post('/api/drivers', data);
  }

  // Atualizar motorista
  async update(
    id: number,
    data: UpdateDriverRequest
  ): Promise<ApiResponse<Driver>> {
    return apiClient.put(`/api/drivers/${id}`, data);
  }

  // Deletar motorista
  async delete(id: number): Promise<ApiResponse> {
    return apiClient.delete(`/api/drivers/${id}`);
  }
}

export const driversService = new DriversService();
