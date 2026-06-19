import { IUserRepository } from '../../repositories/user-repository.interface';
import { IPasswordHasher } from '../../services/password-hasher.interface';
import { User, UserRole } from '../../../domain/entities/user';

export interface RegisterUserDTO {
  name: string;
  email: string;
  password?: string; // Optional because OAuth users have no password
  role?: UserRole;
}

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(dto: RegisterUserDTO): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    let passwordHash = '';
    if (dto.password) {
      passwordHash = await this.passwordHasher.hash(dto.password);
    }

    const role = dto.role || 'USER';

    // Run domain entity validation on construction
    const tempUser = new User('', dto.name, dto.email, passwordHash, role);

    return this.userRepository.create({
      name: tempUser.name,
      email: tempUser.email,
      passwordHash: tempUser.passwordHash,
      role: tempUser.role,
    });
  }
}
