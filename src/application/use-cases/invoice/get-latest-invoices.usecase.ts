import { IInvoiceRepository } from '../../repositories/invoice-repository.interface';
import { LatestInvoiceRaw } from '../../../domain/entities/invoice';

export class GetLatestInvoicesUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(): Promise<LatestInvoiceRaw[]> {
    const LIMIT = 5;
    return this.invoiceRepository.findLatest(LIMIT);
  }
}
