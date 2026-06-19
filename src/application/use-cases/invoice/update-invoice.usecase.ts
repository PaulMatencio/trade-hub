import { IInvoiceRepository } from '../../repositories/invoice-repository.interface';
import { Invoice, InvoiceStatus } from '../../../domain/entities/invoice';

export interface UpdateInvoiceDTO {
  sellerId: string;
  amount: number; // in dollars/float
  status: InvoiceStatus;
}

export class UpdateInvoiceUseCase {
  constructor(private invoiceRepository: IInvoiceRepository) {}

  async execute(id: string, dto: UpdateInvoiceDTO): Promise<void> {
    const amountInCents = Math.round(dto.amount * 100);

    // instantiate temporary invoice to validate entity constraints
    new Invoice(id, dto.sellerId, amountInCents, new Date(), dto.status);

    await this.invoiceRepository.update(id, {
      sellerId: dto.sellerId,
      amount: amountInCents,
      status: dto.status,
    });
  }
}
