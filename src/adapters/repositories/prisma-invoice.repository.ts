import { IInvoiceRepository } from '../../application/repositories/invoice-repository.interface';
import { InvoicesTable, LatestInvoiceRaw, InvoiceForm, InvoiceStatus } from '../../domain/entities/invoice';
import { prisma } from '../../../app/lib/prisma';

export class PrismaInvoiceRepository implements IInvoiceRepository {
  async create(invoice: { sellerId: string; amount: number; status: InvoiceStatus; date: Date }): Promise<void> {
    await prisma.invoice.create({
      data: {
        seller_id: invoice.sellerId,
        amount: invoice.amount,
        status: invoice.status,
        date: invoice.date,
      },
    });
  }

  async update(id: string, invoice: { sellerId: string; amount: number; status: InvoiceStatus }): Promise<void> {
    await prisma.invoice.update({
      where: { id },
      data: {
        seller_id: invoice.sellerId,
        amount: invoice.amount,
        status: invoice.status,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.invoice.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<InvoiceForm | null> {
    const data = await prisma.$queryRaw<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.seller_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id}::uuid;
    `;

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  }

  async findFiltered(query: string, limit: number, offset: number): Promise<InvoicesTable[]> {
    const invoices = await prisma.$queryRaw<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        sellers.name,
        sellers.email,
        sellers.image_url
      FROM invoices
      JOIN sellers ON invoices.seller_id = sellers.id
      WHERE
        sellers.name ILIKE ${`%${query}%`} OR
        sellers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return invoices;
  }

  async countFiltered(query: string): Promise<number> {
    const data = await prisma.$queryRaw<Array<{ count: string | number }>>`
      SELECT COUNT(*)
      FROM invoices
      JOIN sellers ON invoices.seller_id = sellers.id
      WHERE
        sellers.name ILIKE ${`%${query}%`} OR
        sellers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;

    return Number(data[0]?.count ?? '0');
  }

  async findLatest(limit: number): Promise<LatestInvoiceRaw[]> {
    const data = await prisma.$queryRaw<LatestInvoiceRaw[]>`
      SELECT invoices.amount, sellers.name, sellers.image_url, sellers.email, invoices.id
      FROM invoices
      JOIN sellers ON invoices.seller_id = sellers.id
      ORDER BY invoices.date DESC
      LIMIT ${limit}
    `;

    return data;
  }

  async getCardDataSummary(): Promise<{
    numberOfSellers: number;
    numberOfInvoices: number;
    totalFulfilledInvoices: number;
    totalAwaitingInvoices: number;
  }> {
    const invoiceCountPromise = prisma.$queryRaw<Array<{ count: string | number }>>`SELECT COUNT(*) FROM invoices`;
    const sellerCountPromise = prisma.$queryRaw<Array<{ count: string | number }>>`SELECT COUNT(*) FROM sellers`;
    const invoiceStatusPromise = prisma.$queryRaw<Array<{ fulfilled: number | null; awaiting: number | null }>>`
      SELECT
        SUM(CASE WHEN status = 'fulfilled' THEN amount ELSE 0 END) AS "fulfilled",
        SUM(CASE WHEN status = 'awaiting' THEN amount ELSE 0 END) AS "awaiting"
      FROM invoices
    `;

    const data = await Promise.all([
      invoiceCountPromise,
      sellerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0]?.count ?? '0');
    const numberOfSellers = Number(data[1][0]?.count ?? '0');
    const totalFulfilledInvoices = Number(data[2][0]?.fulfilled ?? 0);
    const totalAwaitingInvoices = Number(data[2][0]?.awaiting ?? 0);

    return {
      numberOfSellers,
      numberOfInvoices,
      totalFulfilledInvoices,
      totalAwaitingInvoices,
    };
  }
}
