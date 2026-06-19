import { describe, it, expect } from 'vitest';
import { Seller } from '../../src/domain/entities/seller';

describe('Seller Domain Entity', () => {
  it('should create a valid Seller instance', () => {
    const seller = new Seller('1', 'Bob Corp', 'bob@example.com', '/bob.png');
    expect(seller.id).toBe('1');
    expect(seller.name).toBe('Bob Corp');
    expect(seller.email).toBe('bob@example.com');
    expect(seller.imageUrl).toBe('/bob.png');
  });

  it('should throw an error for empty seller name', () => {
    expect(() => {
      new Seller('1', '', 'bob@example.com', '/bob.png');
    }).toThrow('Seller name cannot be empty.');
  });

  it('should throw an error for invalid seller email', () => {
    expect(() => {
      new Seller('1', 'Bob Corp', 'invalidemail', '/bob.png');
    }).toThrow('Invalid seller email address.');
  });
});
