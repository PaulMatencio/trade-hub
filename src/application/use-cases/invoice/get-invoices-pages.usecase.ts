import { IInvoiceRepository } from '../../repositories/invoice-repository.interface';

export class GetInvoicesPagesUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(query: string): Promise<number> {
    const ITEMS_PER_PAGE = 6;
    const count = await this.invoiceRepository.countFiltered(query);
    return Math.ceil(count / ITEMS_PER_PAGE);
  }
}
