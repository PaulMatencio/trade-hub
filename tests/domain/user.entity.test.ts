import { describe, it, expect } from 'vitest';
import { User } from '../../src/domain/entities/user';

describe('User Domain Entity', () => {
  it('should create a valid User instance', () => {
    const user = new User('1', 'Alice', 'alice@example.com', 'hashedpassword', 'USER');
    expect(user.id).toBe('1');
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@example.com');
    expect(user.role).toBe('USER');
  });

  it('should throw an error for invalid email', () => {
    expect(() => {
      new User('1', 'Alice', 'invalidemail', 'hashedpassword', 'USER');
    }).toThrow('Invalid email address.');
  });

  it('should throw an error for empty name', () => {
    expect(() => {
      new User('1', '  ', 'alice@example.com', 'hashedpassword', 'USER');
    }).toThrow('Name cannot be empty.');
  });

  it('should throw an error for invalid role', () => {
    expect(() => {
      new User('1', 'Alice', 'alice@example.com', 'hashedpassword', 'SUPER_ADMIN' as any);
    }).toThrow('Invalid user role.');
  });
});
