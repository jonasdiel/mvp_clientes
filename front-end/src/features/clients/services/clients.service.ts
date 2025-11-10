import api from '@/shared/services/api';
import {
  Client,
  CreateClientDto,
  UpdateClientDto,
  ClientsResponse,
  QueryClientsParams,
} from '@/shared/types/client.types';

export const clientsService = {
  /**
   * Lista clientes com paginação e filtros
   */
  async getClients(params?: QueryClientsParams): Promise<ClientsResponse> {
    const response = await api.get<ClientsResponse>('/api/clients', { params });
    return response.data;
  },

  /**
   * Busca um cliente por ID (sem incrementar visualizações)
   */
  async getClientById(id: string): Promise<Client> {
    const response = await api.get<Client>(`/api/clients/${id}`);
    return response.data;
  },

  /**
   * Registra visualização do cliente (incrementa contador)
   */
  async recordView(id: string): Promise<Client> {
    const response = await api.post<Client>(`/api/clients/${id}/view`);
    return response.data;
  },

  /**
   * Cria um novo cliente
   */
  async createClient(data: CreateClientDto): Promise<Client> {
    const response = await api.post<Client>('/api/clients', data);
    return response.data;
  },

  /**
   * Atualiza um cliente
   */
  async updateClient(id: string, data: UpdateClientDto): Promise<Client> {
    const response = await api.put<Client>(`/api/clients/${id}`, data);
    return response.data;
  },

  /**
   * Remove um cliente (soft delete)
   */
  async deleteClient(id: string): Promise<{ deleted: boolean }> {
    const response = await api.delete<{ deleted: boolean }>(`/api/clients/${id}`);
    return response.data;
  },
};
