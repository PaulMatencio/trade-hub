import { IUserRepository } from '../../repositories/user-repository.interface';
import { IPasswordHasher } from '../../services/password-hasher.interface';
import { User } from '../../../domain/entities/user';

export interface AuthenticateUserDTO {
  email: string;
  password?: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(dto: AuthenticateUserDTO): Promise<User | null> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      return null;
    }

    if (dto.password) {
      const isMatched = await this.passwordHasher.compare(dto.password, user.passwordHash);
      if (!isMatched) {
        return null;
      }
    }

    return user;
  }
}
