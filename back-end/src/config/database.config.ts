import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../app/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'mvp_clients',
  entities: [User],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrations: ['back-end/migrations/**/*{.ts,.js}'],
  migrationsRun: true,
};
