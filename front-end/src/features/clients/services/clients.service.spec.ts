import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientsService } from './clients.service';
import api from '@/shared/services/api';
import {
  Client,
  CreateClientDto,
  UpdateClientDto,
} from '@/shared/types/client.types';

vi.mock('@/shared/services/api');

describe('ClientsService', () => {
  const mockClient: Client = {
    id: '123',
    name: 'João Silva',
    salary: 500000,
    companyValue: 10000000,
    viewCount: 0,
    createdAt: '2025-01-09T10:00:00Z',
    updatedAt: '2025-01-09T10:00:00Z',
    deletedAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getClients', () => {
    it('should fetch clients with params', async () => {
      const mockResponse = {
        data: [mockClient],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      vi.mocked(api.get).mockResolvedValue({ data: mockResponse });

      const params = { page: 1, limit: 10, search: 'João' };
      const result = await clientsService.getClients(params);

      expect(api.get).toHaveBeenCalledWith('/api/clients', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getClientById', () => {
    it('should fetch a single client by id', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockClient });

      const result = await clientsService.getClientById('123');

      expect(api.get).toHaveBeenCalledWith('/api/clients/123');
      expect(result).toEqual(mockClient);
    });
  });

  describe('createClient', () => {
    it('should create a new client', async () => {
      const createDto: CreateClientDto = {
        name: 'João Silva',
        salary: 500000,
        companyValue: 10000000,
      };

      vi.mocked(api.post).mockResolvedValue({ data: mockClient });

      const result = await clientsService.createClient(createDto);

      expect(api.post).toHaveBeenCalledWith('/api/clients', createDto);
      expect(result).toEqual(mockClient);
    });
  });

  describe('updateClient', () => {
    it('should update a client', async () => {
      const updateDto: UpdateClientDto = {
        name: 'João Silva Updated',
      };

      const updatedClient = { ...mockClient, ...updateDto };
      vi.mocked(api.put).mockResolvedValue({ data: updatedClient });

      const result = await clientsService.updateClient('123', updateDto);

      expect(api.put).toHaveBeenCalledWith('/api/clients/123', updateDto);
      expect(result).toEqual(updatedClient);
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', async () => {
      const mockResponse = { deleted: true };
      vi.mocked(api.delete).mockResolvedValue({ data: mockResponse });

      const result = await clientsService.deleteClient('123');

      expect(api.delete).toHaveBeenCalledWith('/api/clients/123');
      expect(result).toEqual(mockResponse);
    });
  });
});
