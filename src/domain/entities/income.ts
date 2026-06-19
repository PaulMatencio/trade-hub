export class Income {
  constructor(
    public readonly month: string,
    public readonly income: number // in cents
  ) {
    this.validate();
  }

  private validate() {
    if (!this.month || this.month.length !== 4) {
      throw new Error('Month must be a 4-character string (e.g. Jan, Feb).');
    }
    if (this.income < 0) {
      throw new Error('Income cannot be negative.');
    }
  }
}
