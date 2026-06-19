import { ISellerRepository } from '../../application/repositories/seller-repository.interface';
import { SellerField, SellersTableType } from '../../domain/entities/seller';
import { prisma } from '../../../app/lib/prisma';

export class PrismaSellerRepository implements ISellerRepository {
  async findAll(): Promise<SellerField[]> {
    const data = await prisma.$queryRaw<SellerField[]>`
      SELECT
        id,
        name
      FROM sellers
      ORDER BY name ASC
    `;

    return data;
  }

  async findFiltered(query: string): Promise<SellersTableType[]> {
    const data = await prisma.$queryRaw<SellersTableType[]>`
      SELECT
        sellers.id,
        sellers.name,
        sellers.email,
        sellers.image_url,
        COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'awaiting' THEN invoices.amount ELSE 0 END) AS total_awaiting,
        SUM(CASE WHEN invoices.status = 'fulfilled' THEN invoices.amount ELSE 0 END) AS total_fulfilled
      FROM sellers
      LEFT JOIN invoices ON sellers.id = invoices.seller_id
      WHERE
        sellers.name ILIKE ${`%${query}%`} OR
        sellers.email ILIKE ${`%${query}%`}
      GROUP BY sellers.id, sellers.name, sellers.email, sellers.image_url
      ORDER BY sellers.name ASC
    `;

    return data;
  }
}
