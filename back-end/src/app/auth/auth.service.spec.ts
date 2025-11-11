import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuditsService } from '../../audits/audits.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: User = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@example.com',
    password: '$2b$10$hashedpassword',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockAuditsService = {
    create: jest.fn(),
    logLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuditsService,
          useValue: mockAuditsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return access token and user data on successful login', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const userWithHashedPassword = { ...mockUser, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValue(userWithHashedPassword);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
      });

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const hashedPassword = await bcrypt.hash('wrongpassword', 10);
      const userWithHashedPassword = { ...mockUser, password: hashedPassword };

      mockUserRepository.findOne.mockResolvedValue(userWithHashedPassword);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const email = 'newuser@example.com';
      const password = 'newpassword';
      const name = 'New User';

      const newUser = {
        id: 'new-user-id',
        email,
        password: 'hashed-password',
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue(newUser);

      const result = await service.createUser(email, password, name);

      expect(result).toEqual(newUser);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });

    it('should hash the password before saving', async () => {
      const email = 'newuser@example.com';
      const password = 'plainpassword';
      const name = 'New User';

      mockUserRepository.create.mockImplementation((data) => data);
      mockUserRepository.save.mockImplementation((user) => user);

      const result = await service.createUser(email, password, name);

      expect(result.password).not.toBe(password);
      expect(result.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });
  });
});
