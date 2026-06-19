import { ISellerRepository } from '../../repositories/seller-repository.interface';
import { SellerField } from '../../../domain/entities/seller';

export class GetSellersUseCase {
  constructor(private sellerRepository: ISellerRepository) {}

  async execute(): Promise<SellerField[]> {
    return this.sellerRepository.findAll();
  }
}
