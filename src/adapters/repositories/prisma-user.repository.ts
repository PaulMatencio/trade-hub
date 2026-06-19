import { IUserRepository } from '../../application/repositories/user-repository.interface';
import { User, UserRole } from '../../domain/entities/user';
import { prisma } from '../../../app/lib/prisma';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) {
      return null;
    }

    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.password,
      prismaUser.role as UserRole
    );
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!prismaUser) {
      return null;
    }

    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.password,
      prismaUser.role as UserRole
    );
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const prismaUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.passwordHash,
        role: user.role,
      },
    });

    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.password,
      prismaUser.role as UserRole
    );
  }
}
