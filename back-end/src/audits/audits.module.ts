import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { AuditsService } from './audits.service';
import { AuditsController } from './audits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Audit])],
  providers: [AuditsService],
  controllers: [AuditsController],
  exports: [AuditsService],
})
export class AuditsModule {}
