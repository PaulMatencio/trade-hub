import { prisma } from './prisma';

import {
  SellerField,
  SellersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  LatestInvoice,
  User,
  Income,
  FormattedSellersTable,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
/**
 * Fetches income data from the database.
 * @returns {Promise<Income[]>} A promise that resolves to an array of income data.
 */
export async function fetchIncome(): Promise<Income[]> {
  noStore();
  try {
    const data = await prisma.$queryRaw<Income[]>`SELECT * FROM income`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch income data.');
  }
}

/**
 * Fetches the latest invoices from the database.
 * @returns {Promise<LatestInvoice[]>} A promise that resolves to an array of the latest invoices.
 */
export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
  noStore();
  try {
    const data = await prisma.$queryRaw<LatestInvoiceRaw[]>`
      SELECT invoices.amount, sellers.name, sellers.image_url, sellers.email, invoices.id
      FROM invoices
      JOIN sellers ON invoices.seller_id = sellers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice: LatestInvoiceRaw) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

/**
 * Fetches card data summarizing invoices and sellers from the database.
 * @returns {Promise<object>} A promise that resolves to an object containing card data.
 */
export async function fetchCardData(): Promise<{
  numberOfSellers: number;
  numberOfInvoices: number;
  totalFulfilledInvoices: string;
  totalAwaitingInvoices: string;
}> {
  noStore();
  try {
    const invoiceCountPromise = prisma.$queryRaw<Array<{ count: string | number }>>`SELECT COUNT(*) FROM invoices`;
    const sellerCountPromise = prisma.$queryRaw<Array<{ count: string | number }>>`SELECT COUNT(*) FROM sellers`;
    const invoiceStatusPromise = prisma.$queryRaw<Array<{ fulfilled: number | null; awaiting: number | null }>>`SELECT
         SUM(CASE WHEN status = 'fulfilled' THEN amount ELSE 0 END) AS "fulfilled",
         SUM(CASE WHEN status = 'awaiting' THEN amount ELSE 0 END) AS "awaiting"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      sellerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0]?.count ?? '0');
    const numberOfSellers = Number(data[1][0]?.count ?? '0');
    const totalFulfilledInvoices = formatCurrency(
      Number(data[2][0]?.fulfilled ?? 0),
    );
    const totalAwaitingInvoices = formatCurrency(
      Number(data[2][0]?.awaiting ?? 0),
    );

    return {
      numberOfSellers,
      numberOfInvoices,
      totalFulfilledInvoices,
      totalAwaitingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

/**
 * Fetches a paginated list of filtered invoices based on a search query.
 * @param {string} query - The search query.
 * @param {number} currentPage - The current page number for pagination.
 * @returns {Promise<InvoicesTable[]>} A promise that resolves to an array of filtered invoices.
 */
const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<InvoicesTable[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
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
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

/**
 * Fetches the total number of pages for paginating filtered invoices.
 * @param {string} query - The search query.
 * @returns {Promise<number>} A promise that resolves to the total number of pages.
 */
export async function fetchInvoicesPages(query: string): Promise<number> {
  noStore();
  try {
    const count = await prisma.$queryRaw<Array<{ count: string | number }>>`SELECT COUNT(*)
    FROM invoices
    JOIN sellers ON invoices.seller_id = sellers.id
    WHERE
      sellers.name ILIKE ${`%${query}%`} OR
      sellers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count[0]?.count ?? '0') / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

/**
 * Fetches a specific invoice by its ID from the database.
 * @param {string} id - The ID of the invoice.
 * @returns {Promise<InvoiceForm>} A promise that resolves to the details of the specified invoice.
 */
export async function fetchInvoiceById(id: string): Promise<InvoiceForm> {
  noStore();
  try {
    const data = await prisma.$queryRaw<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.seller_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id}::uuid;
    `;

    const invoice = data.map((invoice: InvoiceForm) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

/**
 * Fetches a list of sellers from the database.
 * @returns {Promise<SellerField[]>} A promise that resolves to an array of seller data.
 */
export async function fetchSellers(): Promise<SellerField[]> {
  noStore();
  try {
    const data = await prisma.$queryRaw<SellerField[]>`
      SELECT
        id,
        name
      FROM sellers
      ORDER BY name ASC
    `;

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all sellers.');
  }
}

/**
 * Fetches a paginated and filtered list of sellers based on a search query.
 * @param {string} query - The search query.
 * @returns {Promise<FormattedSellersTable[]>} A promise that resolves to an array of formatted seller data.
 */
export async function fetchFilteredSellers(query: string): Promise<FormattedSellersTable[]> {
  noStore();
  try {
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

    const sellers = data.map((seller: SellersTableType) => ({
      ...seller,
      total_invoices: Number(seller.total_invoices),
      total_awaiting: formatCurrency(Number(seller.total_awaiting)),
      total_fulfilled: formatCurrency(Number(seller.total_fulfilled)),
    }));

    return sellers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch seller table.');
  }
}

/**
 * Fetches a user from the database based on their email.
 * @param {string} email - The email address of the user.
 * @returns {Promise<User | undefined>} A promise that resolves to the user details.
 */
export async function getUser(email: string): Promise<User | undefined> {
  noStore();
  try {
    const user = await prisma.$queryRaw<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
