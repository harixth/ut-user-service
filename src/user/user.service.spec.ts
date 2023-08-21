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

  describe('create', () => {
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
      expect(() => userService.create(createUserDto)).toThrow(HttpException);
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

    it('should remove user', () => {
      userService.remove('mocked-uuid');
      expect(global.userStore).toEqual([]);
    });
  });
});
