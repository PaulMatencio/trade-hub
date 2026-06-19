import { describe, it, expect } from 'vitest';
import { Income } from '../../src/domain/entities/income';

describe('Income Domain Entity', () => {
  it('should create a valid Income instance', () => {
    const income = new Income('Jan', 1200000);
    expect(income.month).toBe('Jan');
    expect(income.income).toBe(1200000);
  });

  it('should throw an error for invalid month format', () => {
    expect(() => {
      new Income('January', 1200000);
    }).toThrow('Month must be a 3 or 4-character string (e.g. Jan, Feb).');
  });

  it('should throw an error for negative income value', () => {
    expect(() => {
      new Income('Jan', -500);
    }).toThrow('Income cannot be negative.');
  });
});
