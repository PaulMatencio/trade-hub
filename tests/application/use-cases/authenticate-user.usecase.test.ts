import { describe, it, expect, vi } from 'vitest';
import { AuthenticateUserUseCase } from '../../../src/application/use-cases/auth/authenticate-user.usecase';
import { IUserRepository } from '../../../src/application/repositories/user-repository.interface';
import { IPasswordHasher } from '../../../src/application/services/password-hasher.interface';
import { User } from '../../../src/domain/entities/user';

describe('AuthenticateUserUseCase', () => {
  it('should authenticate successfully with correct credentials', async () => {
    const mockUser = new User('user-id', 'Alice', 'alice@example.com', 'hashed-pass', 'USER');

    const mockRepo: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(mockUser),
      findById: vi.fn(),
      create: vi.fn(),
    };

    const mockHasher: IPasswordHasher = {
      hash: vi.fn(),
      compare: vi.fn().mockResolvedValue(true),
    };

    const useCase = new AuthenticateUserUseCase(mockRepo, mockHasher);
    const result = await useCase.execute({
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(mockRepo.findByEmail).toHaveBeenCalledWith('alice@example.com');
    expect(mockHasher.compare).toHaveBeenCalledWith('password123', 'hashed-pass');
    expect(result).toBe(mockUser);
  });

  it('should fail authentication if password does not match', async () => {
    const mockUser = new User('user-id', 'Alice', 'alice@example.com', 'hashed-pass', 'USER');

    const mockRepo: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(mockUser),
      findById: vi.fn(),
      create: vi.fn(),
    };

    const mockHasher: IPasswordHasher = {
      hash: vi.fn(),
      compare: vi.fn().mockResolvedValue(false),
    };

    const useCase = new AuthenticateUserUseCase(mockRepo, mockHasher);
    const result = await useCase.execute({
      email: 'alice@example.com',
      password: 'wrongpassword',
    });

    expect(mockRepo.findByEmail).toHaveBeenCalledWith('alice@example.com');
    expect(mockHasher.compare).toHaveBeenCalledWith('wrongpassword', 'hashed-pass');
    expect(result).toBeNull();
  });

  it('should return null if user does not exist', async () => {
    const mockRepo: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      findById: vi.fn(),
      create: vi.fn(),
    };

    const mockHasher: IPasswordHasher = {
      hash: vi.fn(),
      compare: vi.fn(),
    };

    const useCase = new AuthenticateUserUseCase(mockRepo, mockHasher);
    const result = await useCase.execute({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    expect(mockRepo.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    expect(mockHasher.compare).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
