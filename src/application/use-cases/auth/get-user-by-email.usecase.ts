import { IUserRepository } from '../../repositories/user-repository.interface';
import { User } from '../../../domain/entities/user';

export class GetUserByEmailUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
