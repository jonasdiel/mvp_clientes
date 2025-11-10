import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('clients')
export class Client {
  @ApiProperty({
    description: 'ID único do cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'Salário do cliente em centavos',
    example: 500000,
  })
  @Column({ type: 'bigint' })
  salary: number;

  @ApiProperty({
    description: 'Valor da empresa em centavos',
    example: 10000000,
  })
  @Column({ type: 'bigint', name: 'company_value' })
  companyValue: number;

  @ApiProperty({
    description: 'Contador de visualizações',
    example: 5,
  })
  @Column({ type: 'int', default: 0, name: 'view_count' })
  viewCount: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-01-09T10:30:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2025-01-09T10:30:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Data de exclusão (soft delete)',
    example: null,
    nullable: true,
  })
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
