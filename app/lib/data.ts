import {
  SellerField,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  Income,
  FormattedSellersTable,
  User,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

import {
  getIncomeUseCase,
  getLatestInvoicesUseCase,
  getCardDataUseCase,
  getFilteredInvoicesUseCase,
  getInvoicesPagesUseCase,
  getInvoiceByIdUseCase,
  getSellersUseCase,
  getFilteredSellersUseCase,
  getUserByEmailUseCase,
} from '@/src/infrastructure/di/container';

/**
 * Fetches income data from the database.
 * @returns {Promise<Income[]>} A promise that resolves to an array of income data.
 */
export async function fetchIncome(): Promise<Income[]> {
  noStore();
  try {
    const incomeEntities = await getIncomeUseCase.execute();
    return incomeEntities.map((ent) => ({
      month: ent.month,
      income: ent.income,
    }));
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
    const latestRaw = await getLatestInvoicesUseCase.execute();
    return latestRaw.map((invoice) => ({
      id: invoice.id,
      name: invoice.name,
      image_url: invoice.image_url,
      email: invoice.email,
      amount: formatCurrency(invoice.amount),
    }));
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
    const data = await getCardDataUseCase.execute();
    return {
      numberOfSellers: data.numberOfSellers,
      numberOfInvoices: data.numberOfInvoices,
      totalFulfilledInvoices: formatCurrency(data.totalFulfilledInvoices),
      totalAwaitingInvoices: formatCurrency(data.totalAwaitingInvoices),
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
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<InvoicesTable[]> {
  try {
    const invoices = await getFilteredInvoicesUseCase.execute(query, currentPage);
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
    const totalPages = await getInvoicesPagesUseCase.execute(query);
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
    const invoice = await getInvoiceByIdUseCase.execute(id);
    if (!invoice) {
      throw new Error('Invoice not found.');
    }
    return {
      id: invoice.id,
      seller_id: invoice.seller_id,
      amount: invoice.amount / 100, // Convert amount from cents to dollars
      status: invoice.status,
    };
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
    const sellers = await getSellersUseCase.execute();
    return sellers;
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
    const sellers = await getFilteredSellersUseCase.execute(query);
    return sellers.map((seller) => ({
      id: seller.id,
      name: seller.name,
      email: seller.email,
      image_url: seller.image_url,
      total_invoices: Number(seller.total_invoices),
      total_awaiting: formatCurrency(Number(seller.total_awaiting)),
      total_fulfilled: formatCurrency(Number(seller.total_fulfilled)),
    }));
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
    const user = await getUserByEmailUseCase.execute(email);
    if (!user) {
      return undefined;
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.passwordHash,
      role: user.role,
    };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
