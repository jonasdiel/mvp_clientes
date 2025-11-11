import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, IsNull } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientsDto } from './dto/query-clients.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { AuditsService } from '../../audits/audits.service';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly auditsService: AuditsService,
    private readonly metricsService: MetricsService
  ) {}

  async create(
    createClientDto: CreateClientDto,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Client> {
    try {
      const client = this.clientRepository.create(createClientDto);
      const savedClient = await this.clientRepository.save(client);

      this.logger.log({
        message: 'Client created',
        clientId: savedClient.id,
        name: savedClient.name,
      });

      // Incrementa métrica de clientes criados
      this.metricsService.incrementClientsCreated();

      // Registra auditoria
      try {
        await this.auditsService.logCreate(
          userId,
          'clients',
          savedClient.id,
          savedClient as unknown as Record<string, unknown>,
          ipAddress,
          userAgent
        );
      } catch (auditError) {
        this.logger.error('Error logging create audit:', auditError);
      }

      return savedClient;
    } catch (error) {
      this.logger.error({
        message: 'Error creating client',
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Erro ao criar cliente');
    }
  }

  async findAll(queryDto: QueryClientsDto): Promise<ClientResponseDto> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        orderBy = 'createdAt',
        order = 'DESC',
      } = queryDto;
      const skip = (page - 1) * limit;

      const queryBuilder = this.clientRepository
        .createQueryBuilder('client')
        .where('client.deletedAt IS NULL');

      if (search) {
        queryBuilder.andWhere('client.name ILIKE :search', {
          search: `%${search}%`,
        });
      }

      queryBuilder.orderBy(`client.${orderBy}`, order).skip(skip).take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      const totalPages = Math.ceil(total / limit);

      this.logger.log({
        message: 'Clients listed',
        total,
        page,
        limit,
        search,
      });

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error listing clients',
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Erro ao listar clientes');
    }
  }

  async findOne(
    id: string,
    incrementView: boolean = false,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Client> {
    try {
      const client = await this.clientRepository.findOne({
        where: { id },
      });

      if (!client) {
        this.logger.warn({
          message: 'Client not found',
          clientId: id,
        });
        throw new NotFoundException('Cliente não encontrado');
      }

      // Incrementa o contador de visualizações apenas se solicitado
      if (incrementView) {
        client.viewCount += 1;
        await this.clientRepository.save(client);

        this.logger.log({
          message: 'Client view recorded',
          clientId: id,
          viewCount: client.viewCount,
        });

        // Registra auditoria de leitura
        try {
          await this.auditsService.logRead(
            userId,
            'clients',
            id,
            ipAddress,
            userAgent
          );
        } catch (auditError) {
          this.logger.error('Error logging read audit:', auditError);
        }
      }

      return client;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error({
        message: 'Error finding client',
        clientId: id,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Erro ao buscar cliente');
    }
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Client> {
    try {
      const client = await this.clientRepository.findOne({
        where: { id },
      });

      if (!client) {
        this.logger.warn({
          message: 'Client not found for update',
          clientId: id,
        });
        throw new NotFoundException('Cliente não encontrado');
      }

      // Salva dados anteriores para auditoria
      const previousData = { ...client };

      Object.assign(client, updateClientDto);
      const updatedClient = await this.clientRepository.save(client);

      this.logger.log({
        message: 'Client updated',
        clientId: id,
      });

      // Registra auditoria
      try {
        await this.auditsService.logUpdate(
          userId,
          'clients',
          id,
          previousData,
          updatedClient as unknown as Record<string, unknown>,
          ipAddress,
          userAgent
        );
      } catch (auditError) {
        this.logger.error('Error logging update audit:', auditError);
      }

      return updatedClient;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error({
        message: 'Error updating client',
        clientId: id,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Erro ao atualizar cliente');
    }
  }

  async remove(
    id: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ deleted: boolean }> {
    try {
      const client = await this.clientRepository.findOne({
        where: { id },
      });

      if (!client) {
        this.logger.warn({
          message: 'Client not found for deletion',
          clientId: id,
        });
        throw new NotFoundException('Cliente não encontrado');
      }

      // Salva dados anteriores para auditoria
      const previousData = { ...client };

      // Soft delete
      await this.clientRepository.softDelete(id);

      this.logger.log({
        message: 'Client soft deleted',
        clientId: id,
      });

      // Incrementa métrica de clientes deletados
      this.metricsService.incrementClientsDeleted();

      // Registra auditoria
      try {
        await this.auditsService.logDelete(
          userId,
          'clients',
          id,
          previousData,
          ipAddress,
          userAgent
        );
      } catch (auditError) {
        this.logger.error('Error logging delete audit:', auditError);
      }

      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error({
        message: 'Error deleting client',
        clientId: id,
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Erro ao excluir cliente');
    }
  }

  async getMetrics(): Promise<{
    totalClients: number;
    clientsToday: number;
    mostViewedCount: number;
  }> {
    try {
      // Total de clientes (não deletados)
      const totalClients = await this.clientRepository.count({
        where: { deletedAt: IsNull() },
      });

      // Clientes cadastrados hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const clientsToday = await this.clientRepository.count({
        where: {
          deletedAt: IsNull(),
          createdAt: MoreThanOrEqual(today),
        },
      });

      // Cliente mais visualizado (pega o maior viewCount)
      const mostViewedClient = await this.clientRepository.findOne({
        where: { deletedAt: IsNull() },
        order: { viewCount: 'DESC' },
      });

      const mostViewedCount = mostViewedClient?.viewCount ?? 0;

      this.logger.log({
        message: 'Metrics calculated',
        totalClients,
        clientsToday,
        mostViewedCount,
      });

      return {
        totalClients,
        clientsToday,
        mostViewedCount,
      };
    } catch (error) {
      this.logger.error({
        message: 'Error calculating metrics',
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException('Erro ao calcular métricas');
    }
  }
}
