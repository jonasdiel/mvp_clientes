import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva',
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser um texto' })
  name: string;

  @ApiProperty({
    description: 'Salário do cliente em centavos (R$ 5.000,00 = 500000)',
    example: 500000,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'O salário é obrigatório' })
  @IsNumber({}, { message: 'O salário deve ser um número' })
  @Min(0, { message: 'O salário deve ser maior ou igual a zero' })
  salary: number;

  @ApiProperty({
    description: 'Valor da empresa em centavos (R$ 100.000,00 = 10000000)',
    example: 10000000,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'O valor da empresa é obrigatório' })
  @IsNumber({}, { message: 'O valor da empresa deve ser um número' })
  @Min(0, { message: 'O valor da empresa deve ser maior ou igual a zero' })
  companyValue: number;
}
