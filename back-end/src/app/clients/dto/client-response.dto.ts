import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../entities/client.entity';

export class ClientResponseDto {
  @ApiProperty({
    description: 'Lista de clientes',
    type: [Client],
  })
  data: Client[];

  @ApiProperty({
    description: 'Total de clientes (considerando filtros)',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Limite de itens por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 5,
  })
  totalPages: number;
}
