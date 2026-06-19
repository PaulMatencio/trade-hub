import { describe, it, expect, vi } from 'vitest';
import { CreateInvoiceUseCase } from '../../../src/application/use-cases/invoice/create-invoice.usecase';
import { IInvoiceRepository } from '../../../src/application/repositories/invoice-repository.interface';

describe('CreateInvoiceUseCase', () => {
  it('should successfully create an invoice', async () => {
    // Mock Repository
    const mockRepo: IInvoiceRepository = {
      create: vi.fn().mockResolvedValue(undefined),
      update: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findFiltered: vi.fn(),
      countFiltered: vi.fn(),
      findLatest: vi.fn(),
      getCardDataSummary: vi.fn(),
    };

    const useCase = new CreateInvoiceUseCase(mockRepo);
    
    // Execute use case with dollar amount (e.g. 99.99)
    await useCase.execute({
      sellerId: 'seller-id-123',
      amount: 99.99,
      status: 'awaiting',
    });

    // Check repository was called with correct values (amount converted to cents: 9999)
    expect(mockRepo.create).toHaveBeenCalledOnce();
    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        sellerId: 'seller-id-123',
        amount: 9999,
        status: 'awaiting',
        date: expect.any(Date),
      })
    );
  });

  it('should throw an error if amount validation fails', async () => {
    const mockRepo: IInvoiceRepository = {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findFiltered: vi.fn(),
      countFiltered: vi.fn(),
      findLatest: vi.fn(),
      getCardDataSummary: vi.fn(),
    };

    const useCase = new CreateInvoiceUseCase(mockRepo);

    // Negative amount
    await expect(
      useCase.execute({
        sellerId: 'seller-id-123',
        amount: -15.50,
        status: 'fulfilled',
      })
    ).rejects.toThrow('Invoice amount cannot be negative.');

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
