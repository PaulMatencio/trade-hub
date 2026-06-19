import { IIncomeRepository } from '../../application/repositories/income-repository.interface';
import { Income } from '../../domain/entities/income';
import { prisma } from '../../../app/lib/prisma';

export class PrismaIncomeRepository implements IIncomeRepository {
  async findAll(): Promise<Income[]> {
    const data = await prisma.$queryRaw<any[]>`SELECT * FROM income`;
    
    return data.map(item => new Income(item.month, item.income));
  }
}
