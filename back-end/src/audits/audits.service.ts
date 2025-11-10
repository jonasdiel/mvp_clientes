import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit, AuditAction } from './entities/audit.entity';

export interface CreateAuditDto {
  userId?: string;
  tableName: string;
  action: AuditAction;
  recordId?: string;
  previousData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditQueryDto {
  page?: number;
  limit?: number;
  userId?: string;
  tableName?: string;
  action?: AuditAction;
  recordId?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class AuditsService {
  private readonly logger = new Logger(AuditsService.name);

  constructor(
    @InjectRepository(Audit)
    private auditsRepository: Repository<Audit>
  ) {}

  /**
   * Cria um novo registro de auditoria
   */
  async create(createAuditDto: CreateAuditDto): Promise<Audit> {
    try {
      this.logger.log(`Creating audit: ${JSON.stringify(createAuditDto)}`);
      const audit = this.auditsRepository.create(createAuditDto);
      const saved = await this.auditsRepository.save(audit);
      this.logger.log(`Audit created successfully: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Error creating audit: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Registra uma ação de login
   */
  async logLogin(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Audit> {
    return this.create({
      userId,
      tableName: 'users',
      action: AuditAction.LOGIN,
      recordId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Registra uma ação de criação
   */
  async logCreate(
    userId: string,
    tableName: string,
    recordId: string,
    newData: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Audit> {
    return this.create({
      userId,
      tableName,
      action: AuditAction.CREATE,
      recordId,
      newData,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Registra uma ação de leitura
   */
  async logRead(
    userId: string,
    tableName: string,
    recordId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Audit> {
    return this.create({
      userId,
      tableName,
      action: AuditAction.READ,
      recordId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Registra uma ação de atualização
   */
  async logUpdate(
    userId: string,
    tableName: string,
    recordId: string,
    previousData: Record<string, unknown>,
    newData: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Audit> {
    return this.create({
      userId,
      tableName,
      action: AuditAction.UPDATE,
      recordId,
      previousData,
      newData,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Registra uma ação de exclusão
   */
  async logDelete(
    userId: string,
    tableName: string,
    recordId: string,
    previousData: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<Audit> {
    return this.create({
      userId,
      tableName,
      action: AuditAction.DELETE,
      recordId,
      previousData,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Busca registros de auditoria com filtros
   */
  async findAll(query: AuditQueryDto): Promise<{
    data: Audit[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      userId,
      tableName,
      action,
      recordId,
      startDate,
      endDate,
    } = query;

    const queryBuilder = this.auditsRepository
      .createQueryBuilder('audit')
      .leftJoinAndSelect('audit.user', 'user');

    if (userId) {
      queryBuilder.andWhere('audit.userId = :userId', { userId });
    }

    if (tableName) {
      queryBuilder.andWhere('audit.tableName = :tableName', { tableName });
    }

    if (action) {
      queryBuilder.andWhere('audit.action = :action', { action });
    }

    if (recordId) {
      queryBuilder.andWhere('audit.recordId = :recordId', { recordId });
    }

    if (startDate) {
      queryBuilder.andWhere('audit.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('audit.createdAt <= :endDate', { endDate });
    }

    queryBuilder
      .orderBy('audit.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Busca um registro de auditoria por ID
   */
  async findOne(id: string): Promise<Audit> {
    return this.auditsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  /**
   * Busca o histórico de alterações de um registro específico
   */
  async findRecordHistory(
    tableName: string,
    recordId: string
  ): Promise<Audit[]> {
    return this.auditsRepository.find({
      where: { tableName, recordId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca todas as ações de um usuário
   */
  async findByUser(userId: string, limit = 50): Promise<Audit[]> {
    return this.auditsRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
