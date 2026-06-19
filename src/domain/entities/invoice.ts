export type InvoiceStatus = 'awaiting' | 'fulfilled';

export class Invoice {
  constructor(
    public readonly id: string,
    public readonly sellerId: string,
    public readonly amount: number, // in cents
    public readonly date: Date,
    public readonly status: InvoiceStatus
  ) {
    this.validate();
  }

  private validate() {
    if (this.amount < 0) {
      throw new Error('Invoice amount cannot be negative.');
    }
    if (!this.sellerId) {
      throw new Error('Invoice must be linked to a seller.');
    }
    if (!['awaiting', 'fulfilled'].includes(this.status)) {
      throw new Error('Invalid invoice status.');
    }
  }
}

export interface LatestInvoiceRaw {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: number; // in cents
}

export interface InvoicesTable {
  id: string;
  seller_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number; // in cents
  status: InvoiceStatus;
}

export interface InvoiceForm {
  id: string;
  seller_id: string;
  amount: number; // in cents or dollars, let's keep it as retrieved
  status: InvoiceStatus;
}
