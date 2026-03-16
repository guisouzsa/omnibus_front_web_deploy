import { useState, useEffect, useCallback } from 'react';
import { vehiclesService } from '@/services/vehicles.service';
import { Vehicle, CreateVehicleRequest, UpdateVehicleRequest } from '@/types/api';

/**
 * Hook para gerenciar veículos (ônibus)
 */
export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca todos os veículos
   */
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehiclesService.getAll();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar veículos');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca um veículo específico por ID
   */
  const getVehicle = useCallback(async (id: number): Promise<Vehicle | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehiclesService.getById(id);
      return data;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar veículo');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cria um novo veículo
   */
  const createVehicle = useCallback(async (data: CreateVehicleRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await vehiclesService.create(data);
      await fetchVehicles();
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar veículo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchVehicles]);

  /**
   * Atualiza um veículo existente
   */
  const updateVehicle = useCallback(async (id: number, data: UpdateVehicleRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await vehiclesService.update(id, data);
      await fetchVehicles();
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar veículo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchVehicles]);

  /**
   * Deleta um veículo
   */
  const deleteVehicle = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await vehiclesService.delete(id);
      await fetchVehicles();
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar veículo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchVehicles]);

  /**
   * Carrega veículos ao montar o componente
   */
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
}
