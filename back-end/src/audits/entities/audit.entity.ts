import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../app/entities/user.entity';

export enum AuditAction {
  LOGIN = 'LOGIN',
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  tableName: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ type: 'uuid', nullable: true })
  recordId: string;

  @Column({ type: 'jsonb', nullable: true })
  previousData: any;

  @Column({ type: 'jsonb', nullable: true })
  newData: any;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
