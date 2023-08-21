import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  create(createUserDto: CreateUserDto) {
    try {
      const existingUser = global.userStore.find(
        (user: User) => user.email === createUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('User already exists');
      }
      const newUser = {
        id: uuidv4(),
        ...createUserDto,
        role: UserRole.USER,
      };
      global.userStore.push(newUser);
      this.logger.debug('Created user:' + JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      this.logger.error('Failed to create user:' + error.message);
      throw new HttpException(error.message, error.status);
    }
  }

  findAll() {
    try {
      return global.userStore;
    } catch (error) {
      this.logger.error('Failed to find users:' + error.message);
      throw new HttpException(error.message, error.status);
    }
  }

  findOne(id: string) {
    try {
      return global.userStore.find((user: User) => user.id === id);
    } catch (error) {
      this.logger.error(`Failed to find user ${id}: ${error.message}`);
      throw new HttpException(error.message, error.status);
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = global.userStore.find((user: User) => user.id === id);
      if (user) {
        const updatedUser = {
          ...user,
          ...updateUserDto,
        };
        global.userStore = global.userStore.map((user: User) =>
          user.id === id ? updatedUser : user,
        );
        this.logger.debug('Updated user:' + JSON.stringify(updatedUser));
        return updatedUser;
      } else {
        throw new NotFoundException(`User ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Failed to update user ${id}: ${error.message}`);
      throw new HttpException(error.message, error.status);
    }
  }

  remove(id: string) {
    try {
      global.userStore = global.userStore.filter(
        (user: User) => user.id !== id,
      );
      this.logger.debug('Deleted user: ' + id);
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}: ${error.message}`);
      throw new HttpException(error.message, error.status);
    }
  }
}
