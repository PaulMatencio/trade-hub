import { IInvoiceRepository } from '../../repositories/invoice-repository.interface';
import { Invoice, InvoiceStatus } from '../../../domain/entities/invoice';

export interface CreateInvoiceDTO {
  sellerId: string;
  amount: number; // in dollars/float
  status: InvoiceStatus;
}

export class CreateInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(dto: CreateInvoiceDTO): Promise<void> {
    const amountInCents = Math.round(dto.amount * 100);
    const date = new Date();

    // instantiate to run entity validation rules
    new Invoice('', dto.sellerId, amountInCents, date, dto.status);

    await this.invoiceRepository.create({
      sellerId: dto.sellerId,
      amount: amountInCents,
      status: dto.status,
      date,
    });
  }
}
