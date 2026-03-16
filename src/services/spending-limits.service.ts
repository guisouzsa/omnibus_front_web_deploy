import { apiClient } from '@/lib/api-client';
import {
  SpendingLimit,
  CreateSpendingLimitRequest,
  UpdateSpendingLimitRequest,
  QueryParams,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api';

class SpendingLimitsService {
  // Listar todos os limites
  async getAll(
    params?: QueryParams
  ): Promise<PaginatedResponse<SpendingLimit>> {
    return apiClient.get('/api/spending-limits', params);
  }

  // Obter limite por ID
  async getById(id: number): Promise<SpendingLimit> {
    return apiClient.get(`/api/spending-limits/${id}`);
  }

  // Criar novo limite
  async create(
    data: CreateSpendingLimitRequest
  ): Promise<ApiResponse<SpendingLimit>> {
    return apiClient.post('/api/spending-limits', data);
  }

  // Atualizar limite
  async update(
    id: number,
    data: UpdateSpendingLimitRequest
  ): Promise<ApiResponse<SpendingLimit>> {
    return apiClient.put(`/api/spending-limits/${id}`, data);
  }

  // Deletar limite
  async delete(id: number): Promise<ApiResponse> {
    return apiClient.delete(`/api/spending-limits/${id}`);
  }

  // Obter limites por usuário
  async getByUser(userId: number): Promise<SpendingLimit[]> {
    return apiClient.get(`/api/spending-limits/user/${userId}`);
  }

  // Obter limite por período
  async getByPeriod(
    userId: number,
    year: string,
    month: string
  ): Promise<SpendingLimit | null> {
    try {
      return await apiClient.get(
        `/api/spending-limits/user/${userId}/period/${year}/${month}`
      );
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Verificar se limite foi excedido
  async checkExceeded(
    userId: number,
    year: string,
    month: string
  ): Promise<{ exceeded: boolean; limit?: SpendingLimit }> {
    return apiClient.get(
      `/api/spending-limits/check/${userId}/${year}/${month}`
    );
  }
}

export const spendingLimitsService = new SpendingLimitsService();
