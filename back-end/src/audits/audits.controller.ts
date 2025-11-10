import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuditsService, AuditQueryDto } from './audits.service';
import { Audit, AuditAction } from './entities/audit.entity';
import { JwtAuthGuard } from '../app/auth/guards/jwt-auth.guard';

@ApiTags('audits')
@ApiBearerAuth()
@Controller('api/audits')
@UseGuards(JwtAuthGuard)
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os registros de auditoria' })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de auditoria retornada com sucesso',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
    @Query('tableName') tableName?: string,
    @Query('action') action?: AuditAction,
    @Query('recordId') recordId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<{
    data: Audit[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query: AuditQueryDto = {
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      userId,
      tableName,
      action,
      recordId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.auditsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um registro de auditoria por ID' })
  @ApiResponse({
    status: 200,
    description: 'Registro de auditoria encontrado',
  })
  @ApiResponse({ status: 404, description: 'Registro não encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Audit> {
    return this.auditsService.findOne(id);
  }

  @Get('record/:tableName/:recordId')
  @ApiOperation({ summary: 'Buscar histórico de um registro específico' })
  @ApiResponse({
    status: 200,
    description: 'Histórico do registro retornado com sucesso',
  })
  async findRecordHistory(
    @Param('tableName') tableName: string,
    @Param('recordId', ParseUUIDPipe) recordId: string
  ): Promise<Audit[]> {
    return this.auditsService.findRecordHistory(tableName, recordId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Buscar todas as ações de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Ações do usuário retornadas com sucesso',
  })
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('limit') limit?: number
  ): Promise<Audit[]> {
    return this.auditsService.findByUser(userId, limit ? +limit : 50);
  }
}
