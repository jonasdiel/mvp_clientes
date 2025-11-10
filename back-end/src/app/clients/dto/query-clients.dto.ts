import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryClientsDto {
  @ApiPropertyOptional({
    description: 'Número da página',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'A página deve ser um número' })
  @Min(1, { message: 'A página deve ser maior ou igual a 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Limite de itens por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'O limite deve ser um número' })
  @Min(1, { message: 'O limite deve ser maior ou igual a 1' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Termo de busca (pesquisa no nome)',
    example: 'João',
  })
  @IsOptional()
  @IsString({ message: 'O termo de busca deve ser um texto' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    example: 'createdAt',
    enum: [
      'name',
      'salary',
      'companyValue',
      'viewCount',
      'createdAt',
      'updatedAt',
    ],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  @IsIn([
    'name',
    'salary',
    'companyValue',
    'viewCount',
    'createdAt',
    'updatedAt',
  ])
  orderBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';
}
