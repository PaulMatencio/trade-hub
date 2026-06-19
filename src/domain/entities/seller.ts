export class Seller {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly imageUrl: string
  ) {
    this.validate();
  }

  private validate() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Seller name cannot be empty.');
    }
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Invalid seller email address.');
    }
  }
}

export interface SellerField {
  id: string;
  name: string;
}

export interface SellersTableType {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_awaiting: number; // in cents
  total_fulfilled: number; // in cents
}
