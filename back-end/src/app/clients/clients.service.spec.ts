import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientsDto } from './dto/query-clients.dto';

describe('ClientsService', () => {
  let service: ClientsService;
  let repository: Repository<Client>;

  const mockClient: Client = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'João Silva',
    salary: 500000,
    companyValue: 10000000,
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get<Repository<Client>>(getRepositoryToken(Client));

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a client successfully', async () => {
      const createClientDto: CreateClientDto = {
        name: 'João Silva',
        salary: 500000,
        companyValue: 10000000,
      };

      mockRepository.create.mockReturnValue(mockClient);
      mockRepository.save.mockResolvedValue(mockClient);

      const result = await service.create(createClientDto);

      expect(result).toEqual(mockClient);
      expect(mockRepository.create).toHaveBeenCalledWith(createClientDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockClient);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const createClientDto: CreateClientDto = {
        name: 'João Silva',
        salary: 500000,
        companyValue: 10000000,
      };

      mockRepository.create.mockReturnValue(mockClient);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createClientDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated clients', async () => {
      const queryDto: QueryClientsDto = {
        page: 1,
        limit: 10,
        orderBy: 'createdAt',
        order: 'DESC',
      };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockClient], 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: [mockClient],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('client.deletedAt IS NULL');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('client.createdAt', 'DESC');
    });

    it('should filter clients by search term', async () => {
      const queryDto: QueryClientsDto = {
        page: 1,
        limit: 10,
        search: 'João',
        orderBy: 'createdAt',
        order: 'DESC',
      };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockClient], 1]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('client.name ILIKE :search', {
        search: '%João%',
      });
      expect(result.data).toEqual([mockClient]);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const queryDto: QueryClientsDto = {
        page: 1,
        limit: 10,
      };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.findAll(queryDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a client and increment view count', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';
      const clientBeforeView = { ...mockClient, viewCount: 5 };
      const clientAfterView = { ...mockClient, viewCount: 6 };

      mockRepository.findOne.mockResolvedValue(clientBeforeView);
      mockRepository.save.mockResolvedValue(clientAfterView);

      const result = await service.findOne(clientId);

      expect(result.viewCount).toBe(6);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: clientId } });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when client not found', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(clientId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';

      mockRepository.findOne.mockResolvedValue(mockClient);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne(clientId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a client successfully', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';
      const updateClientDto: UpdateClientDto = {
        name: 'João Silva Updated',
        salary: 600000,
      };

      const updatedClient = { ...mockClient, ...updateClientDto };

      mockRepository.findOne.mockResolvedValue(mockClient);
      mockRepository.save.mockResolvedValue(updatedClient);

      const result = await service.update(clientId, updateClientDto);

      expect(result.name).toBe('João Silva Updated');
      expect(result.salary).toBe(600000);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: clientId } });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when client not found', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';
      const updateClientDto: UpdateClientDto = { name: 'João Silva Updated' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(clientId, updateClientDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';
      const updateClientDto: UpdateClientDto = { name: 'João Silva Updated' };

      mockRepository.findOne.mockResolvedValue(mockClient);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.update(clientId, updateClientDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a client successfully', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';

      mockRepository.findOne.mockResolvedValue(mockClient);
      mockRepository.softDelete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.remove(clientId);

      expect(result).toEqual({ deleted: true });
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: clientId } });
      expect(mockRepository.softDelete).toHaveBeenCalledWith(clientId);
    });

    it('should throw NotFoundException when client not found', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(clientId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';

      mockRepository.findOne.mockResolvedValue(mockClient);
      mockRepository.softDelete.mockRejectedValue(new Error('Database error'));

      await expect(service.remove(clientId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
