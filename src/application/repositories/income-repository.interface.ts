import { Income } from '../../domain/entities/income';

export interface IIncomeRepository {
  findAll(): Promise<Income[]>;
}
