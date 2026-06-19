export type UserRole = 'USER' | 'SELLER' | 'ADMIN';

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole
  ) {
    this.validate();
  }

  private validate() {
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Invalid email address.');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Name cannot be empty.');
    }
    if (!this.role || !['USER', 'SELLER', 'ADMIN'].includes(this.role)) {
      throw new Error('Invalid user role.');
    }
  }
}
