import { ISellerRepository } from '../../repositories/seller-repository.interface';
import { SellersTableType } from '../../../domain/entities/seller';

export class GetFilteredSellersUseCase {
  constructor(private sellerRepository: ISellerRepository) {}

  async execute(query: string): Promise<SellersTableType[]> {
    return this.sellerRepository.findFiltered(query);
  }
}
