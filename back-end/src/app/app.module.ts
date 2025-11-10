import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ClientsModule } from './clients/clients.module';
import { AuditsModule } from '../audits/audits.module';
import { databaseConfig } from '../config/database.config';
import { loggerConfig } from '../config/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot(loggerConfig),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    DatabaseModule,
    ClientsModule,
    AuditsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
