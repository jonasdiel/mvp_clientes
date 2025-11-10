import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditsService } from '../audits.service';
import { AUDIT_KEY, AuditMetadata } from '../decorators/audit.decorator';
import { AuditAction } from '../entities/audit.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditsService: AuditsService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditMetadata = this.reflector.get<AuditMetadata>(
      AUDIT_KEY,
      context.getHandler()
    );

    if (!auditMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { user, ip, headers } = request;
    const userAgent = headers['user-agent'];

    return next.handle().pipe(
      tap(async (response) => {
        try {
          const { action, tableName } = auditMetadata;
          const userId = user?.id;

          // Extrai o ID do registro da resposta
          let recordId: string = null;
          let previousData: any = null;
          let newData: any = null;

          // Para operações READ, UPDATE, DELETE, o ID pode estar nos parâmetros
          if (request.params?.id) {
            recordId = request.params.id;
          }

          // Para CREATE, o ID está na resposta
          if (action === AuditAction.CREATE && response?.id) {
            recordId = response.id;
            newData = this.sanitizeData(response);
          }

          // Para UPDATE, precisamos dos dados anteriores e novos
          if (action === AuditAction.UPDATE) {
            // O previousData deve ser passado pelo controller
            previousData = request.previousData || null;
            newData = this.sanitizeData(response);
          }

          // Para DELETE, salvamos os dados anteriores
          if (action === AuditAction.DELETE) {
            previousData = request.previousData || null;
          }

          await this.auditsService.create({
            userId,
            tableName,
            action,
            recordId,
            previousData,
            newData,
            ipAddress: ip,
            userAgent,
          });
        } catch (error) {
          // Log error but don't fail the request
          console.error('Error logging audit:', error);
        }
      })
    );
  }

  /**
   * Remove campos sensíveis dos dados antes de salvar no audit
   */
  private sanitizeData(data: any): any {
    if (!data) return null;

    const sanitized = { ...data };
    const sensitiveFields = ['password', 'token', 'secret'];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    });

    return sanitized;
  }
}
