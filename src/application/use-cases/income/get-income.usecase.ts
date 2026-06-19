import { IIncomeRepository } from '../../repositories/income-repository.interface';
import { Income } from '../../../domain/entities/income';

export class GetIncomeUseCase {
  constructor(private incomeRepository: IIncomeRepository) {}

  async execute(): Promise<Income[]> {
    return this.incomeRepository.findAll();
  }
}
