import { describe, it, expect } from 'vitest';
import { Invoice } from '../../src/domain/entities/invoice';

describe('Invoice Domain Entity', () => {
  it('should create a valid Invoice instance', () => {
    const date = new Date();
    const invoice = new Invoice('1', 'seller-uuid', 5000, date, 'awaiting');
    expect(invoice.id).toBe('1');
    expect(invoice.sellerId).toBe('seller-uuid');
    expect(invoice.amount).toBe(5000);
    expect(invoice.status).toBe('awaiting');
  });

  it('should throw an error for negative amount', () => {
    expect(() => {
      new Invoice('1', 'seller-uuid', -100, new Date(), 'awaiting');
    }).toThrow('Invoice amount cannot be negative.');
  });

  it('should throw an error for missing sellerId', () => {
    expect(() => {
      new Invoice('1', '', 5000, new Date(), 'fulfilled');
    }).toThrow('Invoice must be linked to a seller.');
  });

  it('should throw an error for invalid status', () => {
    expect(() => {
      new Invoice('1', 'seller-uuid', 5000, new Date(), 'completed' as any);
    }).toThrow('Invalid invoice status.');
  });
});
