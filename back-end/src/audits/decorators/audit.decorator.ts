import { SetMetadata } from '@nestjs/common';
import { AuditAction } from '../entities/audit.entity';

export const AUDIT_KEY = 'audit';

export interface AuditMetadata {
  action: AuditAction;
  tableName: string;
}

export const Audit = (action: AuditAction, tableName: string) =>
  SetMetadata(AUDIT_KEY, { action, tableName } as AuditMetadata);
