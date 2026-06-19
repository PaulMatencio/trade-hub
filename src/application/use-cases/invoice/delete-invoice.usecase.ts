import { IInvoiceRepository } from '../../repositories/invoice-repository.interface';

export class DeleteInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Invoice ID is required for deletion.');
    }
    await this.invoiceRepository.delete(id);
  }
}
