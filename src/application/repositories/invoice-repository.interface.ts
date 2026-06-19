import { InvoicesTable, LatestInvoiceRaw, InvoiceForm } from '../../domain/entities/invoice';

export interface IInvoiceRepository {
  create(invoice: { sellerId: string; amount: number; status: 'awaiting' | 'fulfilled'; date: Date }): Promise<void>;
  update(id: string, invoice: { sellerId: string; amount: number; status: 'awaiting' | 'fulfilled' }): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<InvoiceForm | null>;
  findFiltered(query: string, limit: number, offset: number): Promise<InvoicesTable[]>;
  countFiltered(query: string): Promise<number>;
  findLatest(limit: number): Promise<LatestInvoiceRaw[]>;
  getCardDataSummary(): Promise<{
    numberOfSellers: number;
    numberOfInvoices: number;
    totalFulfilledInvoices: number;
    totalAwaitingInvoices: number;
  }>;
}
