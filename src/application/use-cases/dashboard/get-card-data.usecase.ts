import { IInvoiceRepository } from '../../repositories/invoice-repository.interface';

export interface CardDataSummary {
  numberOfSellers: number;
  numberOfInvoices: number;
  totalFulfilledInvoices: number; // in cents
  totalAwaitingInvoices: number; // in cents
}

export class GetCardDataUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(): Promise<CardDataSummary> {
    return this.invoiceRepository.getCardDataSummary();
  }
}
