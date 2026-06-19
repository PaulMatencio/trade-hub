import { SellerField, SellersTableType } from '../../domain/entities/seller';

export interface ISellerRepository {
  findAll(): Promise<SellerField[]>;
  findFiltered(query: string): Promise<SellersTableType[]>;
}
