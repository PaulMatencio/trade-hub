import { IInvoiceRepository } from '../../repositories/invoice-repository.interface';
import { InvoicesTable } from '../../../domain/entities/invoice';

export class GetFilteredInvoicesUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(query: string, currentPage: number): Promise<InvoicesTable[]> {
    const ITEMS_PER_PAGE = 6;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    return this.invoiceRepository.findFiltered(query, ITEMS_PER_PAGE, offset);
  }
}
