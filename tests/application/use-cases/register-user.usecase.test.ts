import { describe, it, expect, vi } from 'vitest';
import { RegisterUserUseCase } from '../../../src/application/use-cases/auth/register-user.usecase';
import { IUserRepository } from '../../../src/application/repositories/user-repository.interface';
import { IPasswordHasher } from '../../../src/application/services/password-hasher.interface';
import { User } from '../../../src/domain/entities/user';

describe('RegisterUserUseCase', () => {
  it('should successfully register a user', async () => {
    const mockUser = new User('user-id', 'Alice', 'alice@example.com', 'hashed-pass', 'USER');

    const mockRepo: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      findById: vi.fn(),
      create: vi.fn().mockResolvedValue(mockUser),
    };

    const mockHasher: IPasswordHasher = {
      hash: vi.fn().mockResolvedValue('hashed-pass'),
      compare: vi.fn(),
    };

    const useCase = new RegisterUserUseCase(mockRepo, mockHasher);
    const result = await useCase.execute({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'mypassword123',
    });

    expect(mockRepo.findByEmail).toHaveBeenCalledWith('alice@example.com');
    expect(mockHasher.hash).toHaveBeenCalledWith('mypassword123');
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hashed-pass',
        role: 'USER',
      })
    );
    expect(result).toBe(mockUser);
  });

  it('should throw an error if the email already exists', async () => {
    const mockUser = new User('user-id', 'Alice', 'alice@example.com', 'hashed-pass', 'USER');

    const mockRepo: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(mockUser),
      findById: vi.fn(),
      create: vi.fn(),
    };

    const mockHasher: IPasswordHasher = {
      hash: vi.fn(),
      compare: vi.fn(),
    };

    const useCase = new RegisterUserUseCase(mockRepo, mockHasher);

    await expect(
      useCase.execute({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'mypassword123',
      })
    ).rejects.toThrow('An account with this email address already exists.');

    expect(mockRepo.create).not.toHaveBeenCalled();
    expect(mockHasher.hash).not.toHaveBeenCalled();
  });

  it('should validate domain user attributes', async () => {
    const mockRepo: IUserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      findById: vi.fn(),
      create: vi.fn(),
    };

    const mockHasher: IPasswordHasher = {
      hash: vi.fn().mockResolvedValue('hashed-pass'),
      compare: vi.fn(),
    };

    const useCase = new RegisterUserUseCase(mockRepo, mockHasher);

    // Empty name should trigger domain entity validation error
    await expect(
      useCase.execute({
        name: ' ',
        email: 'alice@example.com',
        password: 'mypassword123',
      })
    ).rejects.toThrow('Name cannot be empty.');

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
