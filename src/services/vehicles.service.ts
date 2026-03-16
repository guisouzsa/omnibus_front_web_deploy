import { apiClient } from '@/lib/api-client';
import {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  ApiResponse,
} from '@/types/api';

/**
 * Serviço para gerenciar veículos (ônibus)
 */
export const vehiclesService = {
  /**
   * Lista todos os veículos
   */
  async getAll(): Promise<Vehicle[]> {
    return apiClient.get<Vehicle[]>('/api/vehicles');
  },

  /**
   * Busca um veículo por ID
   */
  async getById(id: number): Promise<Vehicle> {
    return apiClient.get<Vehicle>(`/api/vehicles/${id}`);
  },

  /**
   * Cria um novo veículo
   */
  async create(data: CreateVehicleRequest): Promise<ApiResponse<Vehicle>> {
    return apiClient.post<ApiResponse<Vehicle>>('/api/vehicles', data);
  },

  /**
   * Atualiza um veículo existente
   */
  async update(id: number, data: UpdateVehicleRequest): Promise<ApiResponse<Vehicle>> {
    return apiClient.put<ApiResponse<Vehicle>>(`/api/vehicles/${id}`, data);
  },

  /**
   * Deleta um veículo
   */
  async delete(id: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/vehicles/${id}`);
  },
};
