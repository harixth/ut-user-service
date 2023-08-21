import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRole } from './entities/user.entity';
import { HttpException, Logger } from '@nestjs/common';

// Mocking the uuidv4 function
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'), // Provide a fixed value for UUID
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create, retrieve, update and delete users', () => {
    const createUserDto = { email: 'test@example.com', name: 'Test User' };

    it('should create a user', () => {
      const createdUser = {
        id: 'mocked-uuid', // Mocked UUID
        ...createUserDto,
        role: UserRole.USER,
      };
      const loggerSpy = jest.spyOn(Logger.prototype, 'debug');
      const result = userService.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(loggerSpy).toHaveBeenCalledWith(
        'Created user:' + JSON.stringify(createdUser),
      );
    });

    it('should throw ConflictException if user already exists', () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      expect(() => userService.create(createUserDto)).toThrow(HttpException);
      expect(loggerSpy).toHaveBeenCalledWith(
        'Failed to create user:User already exists',
      );
    });

    it('should find all users', () => {
      const mockUsers = [
        {
          id: 'mocked-uuid',
          email: 'test@example.com',
          name: 'Test User',
          role: 1,
        },
      ];
      const result = userService.findAll();
      expect(result).toEqual(mockUsers);
    });

    it('should find a user', () => {
      const mockUser = {
        id: 'mocked-uuid',
        email: 'test@example.com',
        name: 'Test User',
        role: 1,
      };
      const result = userService.findOne('mocked-uuid');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user does not exists', () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      expect(() => userService.findOne('uuid-not-found')).toThrow(
        HttpException,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Failed to find user uuid-not-found: User uuid-not-found not found',
      );
    });

    it('should update user with age', () => {
      const mockUser = {
        id: 'mocked-uuid',
        email: 'test@example.com',
        name: 'Test User',
        role: 1,
        age: 20,
      };
      const result = userService.update('mocked-uuid', { age: 20 });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user does not exists', () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      expect(() => userService.update('uuid-not-found', { age: 20 })).toThrow(
        HttpException,
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Failed to update user uuid-not-found: User uuid-not-found not found',
      );
    });

    it('should remove user', () => {
      userService.remove('mocked-uuid');
      expect(global.userStore).toEqual([]);
    });
  });
});
