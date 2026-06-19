import { PrismaUserRepository } from '../../adapters/repositories/prisma-user.repository';
import { PrismaInvoiceRepository } from '../../adapters/repositories/prisma-invoice.repository';
import { PrismaSellerRepository } from '../../adapters/repositories/prisma-seller.repository';
import { PrismaIncomeRepository } from '../../adapters/repositories/prisma-income.repository';
import { BcryptPasswordHasher } from '../../adapters/services/bcrypt-password-hasher';

import { GetIncomeUseCase } from '../../application/use-cases/income/get-income.usecase';
import { CreateInvoiceUseCase } from '../../application/use-cases/invoice/create-invoice.usecase';
import { UpdateInvoiceUseCase } from '../../application/use-cases/invoice/update-invoice.usecase';
import { DeleteInvoiceUseCase } from '../../application/use-cases/invoice/delete-invoice.usecase';
import { GetInvoiceByIdUseCase } from '../../application/use-cases/invoice/get-invoice-by-id.usecase';
import { GetFilteredInvoicesUseCase } from '../../application/use-cases/invoice/get-filtered-invoices.usecase';
import { GetInvoicesPagesUseCase } from '../../application/use-cases/invoice/get-invoices-pages.usecase';
import { GetLatestInvoicesUseCase } from '../../application/use-cases/invoice/get-latest-invoices.usecase';
import { GetCardDataUseCase } from '../../application/use-cases/dashboard/get-card-data.usecase';
import { GetSellersUseCase } from '../../application/use-cases/seller/get-sellers.usecase';
import { GetFilteredSellersUseCase } from '../../application/use-cases/seller/get-filtered-sellers.usecase';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.usecase';
import { AuthenticateUserUseCase } from '../../application/use-cases/auth/authenticate-user.usecase';
import { GetUserByEmailUseCase } from '../../application/use-cases/auth/get-user-by-email.usecase';

// 1. Instantiate Repositories and Services (Singletons)
const userRepository = new PrismaUserRepository();
const invoiceRepository = new PrismaInvoiceRepository();
const sellerRepository = new PrismaSellerRepository();
const incomeRepository = new PrismaIncomeRepository();
const passwordHasher = new BcryptPasswordHasher();

// 2. Instantiate and Export Use Cases
export const getIncomeUseCase = new GetIncomeUseCase(incomeRepository);
export const createInvoiceUseCase = new CreateInvoiceUseCase(invoiceRepository);
export const updateInvoiceUseCase = new UpdateInvoiceUseCase(invoiceRepository);
export const deleteInvoiceUseCase = new DeleteInvoiceUseCase(invoiceRepository);
export const getInvoiceByIdUseCase = new GetInvoiceByIdUseCase(invoiceRepository);
export const getFilteredInvoicesUseCase = new GetFilteredInvoicesUseCase(invoiceRepository);
export const getInvoicesPagesUseCase = new GetInvoicesPagesUseCase(invoiceRepository);
export const getLatestInvoicesUseCase = new GetLatestInvoicesUseCase(invoiceRepository);
export const getCardDataUseCase = new GetCardDataUseCase(invoiceRepository);
export const getSellersUseCase = new GetSellersUseCase(sellerRepository);
export const getFilteredSellersUseCase = new GetFilteredSellersUseCase(sellerRepository);
export const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
export const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, passwordHasher);
export const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
