import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Ip,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientsDto } from './dto/query-clients.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { Client } from './entities/client.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
  };
}

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
    type: Client,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  create(
    @Body() createClientDto: CreateClientDto,
    @Req() req: RequestWithUser,
    @Ip() ip: string
  ): Promise<Client> {
    const userId = req.user?.id;
    const userAgent = req.headers['user-agent'];
    return this.clientsService.create(createClientDto, userId, ip, userAgent);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Obter métricas do dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Métricas retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        totalClients: {
          type: 'number',
          example: 150,
        },
        clientsToday: {
          type: 'number',
          example: 5,
        },
        mostViewedCount: {
          type: 'number',
          example: 42,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  getMetrics(): Promise<{
    totalClients: number;
    clientsToday: number;
    mostViewedCount: number;
  }> {
    return this.clientsService.getMetrics();
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes com paginação e filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso',
    type: ClientResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  findAll(@Query() queryDto: QueryClientsDto): Promise<ClientResponseDto> {
    return this.clientsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar cliente por ID',
    description: 'Retorna os dados do cliente sem incrementar visualizações',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado',
    type: Client,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  findOne(@Param('id') id: string): Promise<Client> {
    return this.clientsService.findOne(id, false);
  }

  @Post(':id/view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Registrar visualização do cliente',
    description: 'Incrementa o contador de visualizações do cliente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Visualização registrada',
    type: Client,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  recordView(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Ip() ip: string
  ): Promise<Client> {
    const userId = req.user?.id;
    const userAgent = req.headers['user-agent'];
    return this.clientsService.findOne(id, true, userId, ip, userAgent);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso',
    type: Client,
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Req() req: RequestWithUser,
    @Ip() ip: string
  ): Promise<Client> {
    const userId = req.user?.id;
    const userAgent = req.headers['user-agent'];
    return this.clientsService.update(
      id,
      updateClientDto,
      userId,
      ip,
      userAgent
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Excluir cliente (soft delete)',
    description: 'Realiza exclusão lógica do cliente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do cliente (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente excluído com sucesso',
    schema: {
      type: 'object',
      properties: {
        deleted: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Ip() ip: string
  ): Promise<{ deleted: boolean }> {
    const userId = req.user?.id;
    const userAgent = req.headers['user-agent'];
    return this.clientsService.remove(id, userId, ip, userAgent);
  }
}
