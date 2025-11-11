import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientsDto } from './dto/query-clients.dto';
import { Client } from './entities/client.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

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

  const mockClientsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const createClientDto: CreateClientDto = {
        name: 'João Silva',
        salary: 500000,
        companyValue: 10000000,
      };

      const mockReq = {
        user: { id: 'user-id', email: 'test@example.com' },
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockIp = '127.0.0.1';

      mockClientsService.create.mockResolvedValue(mockClient);

      const result = await controller.create(createClientDto, mockReq, mockIp);

      expect(result).toEqual(mockClient);
      expect(service.create).toHaveBeenCalledWith(
        createClientDto,
        'user-id',
        mockIp,
        'test-agent'
      );
      expect(service.create).toHaveBeenCalledTimes(1);
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

      const expectedResponse = {
        data: [mockClient],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockClientsService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(expectedResponse);
      expect(service.findAll).toHaveBeenCalledWith(queryDto);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return filtered clients by search', async () => {
      const queryDto: QueryClientsDto = {
        page: 1,
        limit: 10,
        search: 'João',
        orderBy: 'createdAt',
        order: 'DESC',
      };

      const expectedResponse = {
        data: [mockClient],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockClientsService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(expectedResponse);
      expect(service.findAll).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';
      const clientWithIncrementedView = { ...mockClient, viewCount: 1 };

      mockClientsService.findOne.mockResolvedValue(clientWithIncrementedView);

      const result = await controller.findOne(clientId);

      expect(result).toEqual(clientWithIncrementedView);
      expect(result.viewCount).toBe(1);
      expect(service.findOne).toHaveBeenCalledWith(clientId, false);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';
      const updateClientDto: UpdateClientDto = {
        name: 'João Silva Updated',
        salary: 600000,
      };

      const mockReq = {
        user: { id: 'user-id', email: 'test@example.com' },
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockIp = '127.0.0.1';

      const updatedClient = { ...mockClient, ...updateClientDto };

      mockClientsService.update.mockResolvedValue(updatedClient);

      const result = await controller.update(
        clientId,
        updateClientDto,
        mockReq,
        mockIp
      );

      expect(result).toEqual(updatedClient);
      expect(result.name).toBe('João Silva Updated');
      expect(result.salary).toBe(600000);
      expect(service.update).toHaveBeenCalledWith(
        clientId,
        updateClientDto,
        'user-id',
        mockIp,
        'test-agent'
      );
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should update partial client data', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';
      const updateClientDto: UpdateClientDto = {
        name: 'João Silva Updated',
      };

      const mockReq = {
        user: { id: 'user-id', email: 'test@example.com' },
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockIp = '127.0.0.1';

      const updatedClient = { ...mockClient, name: 'João Silva Updated' };

      mockClientsService.update.mockResolvedValue(updatedClient);

      const result = await controller.update(
        clientId,
        updateClientDto,
        mockReq,
        mockIp
      );

      expect(result.name).toBe('João Silva Updated');
      expect(result.salary).toBe(mockClient.salary);
      expect(service.update).toHaveBeenCalledWith(
        clientId,
        updateClientDto,
        'user-id',
        mockIp,
        'test-agent'
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a client', async () => {
      const clientId = '550e8400-e29b-41d4-a716-446655440000';
      const expectedResponse = { deleted: true };

      const mockReq = {
        user: { id: 'user-id', email: 'test@example.com' },
        headers: { 'user-agent': 'test-agent' },
      } as any;

      const mockIp = '127.0.0.1';

      mockClientsService.remove.mockResolvedValue(expectedResponse);

      const result = await controller.remove(clientId, mockReq, mockIp);

      expect(result).toEqual(expectedResponse);
      expect(service.remove).toHaveBeenCalledWith(
        clientId,
        'user-id',
        mockIp,
        'test-agent'
      );
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
