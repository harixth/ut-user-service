import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRole } from './entities/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('create, retrieve, update and delete users', () => {
    const createUserDto = { email: 'test@example.com', name: 'Test User' };
    const userId = 'mocked-uuid';
    const createdUser = {
      id: userId,
      ...createUserDto,
      role: UserRole.USER,
    };

    it('should create a user', async () => {
      jest.spyOn(userService, 'create').mockReturnValue(createdUser);
      const result = userController.create(createUserDto);
      expect(result).toEqual(createdUser);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should get a user by Id', async () => {
      jest.spyOn(userService, 'findOne').mockReturnValue(createdUser);
      const result = userController.findOne(userId);
      expect(result).toEqual(createdUser);
      expect(userService.findOne).toHaveBeenCalledWith(userId);
    });

    it('should update a user', async () => {
      const updateUserDto = { age: 29 };
      jest.spyOn(userService, 'update').mockReturnValue({
        ...createdUser,
        ...updateUserDto,
      });
      const result = userController.update(userId, updateUserDto);
      expect(result).toEqual({ ...createdUser, ...updateUserDto });
      expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
    });

    it('should delete a user', async () => {
      jest.spyOn(userService, 'remove').mockReturnValue(undefined);
      const result = userController.remove(userId);
      expect(result).toEqual(undefined);
      expect(userService.remove).toHaveBeenCalledWith(userId);
    });
  });
});
