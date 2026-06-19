import { IInvoiceRepository } from '../../repositories/invoice-repository.interface';
import { InvoiceForm } from '../../../domain/entities/invoice';

export class GetInvoiceByIdUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string): Promise<InvoiceForm | null> {
    return this.invoiceRepository.findById(id);
  }
}
