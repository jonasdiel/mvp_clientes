import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'development') {
      await this.seedAdminUser();
    }
  }

  private async seedAdminUser() {
    try {
      const adminEmail = 'admin@example.com';
      const adminPassword = 'password123';

      // Delete existing admin if present
      await this.userRepository.delete({ email: adminEmail });

      // Create new admin with fresh password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = this.userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
      });

      await this.userRepository.save(admin);
      this.logger.log(
        `✅ Admin user created successfully (email: ${adminEmail}, password: ${adminPassword})`
      );
    } catch (error) {
      this.logger.error('Failed to seed admin user', error);
    }
  }
}
