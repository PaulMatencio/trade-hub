import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
const { Pool } = pg;

import {
  invoices,
  sellers,
  income,
  users,
} from '../app/lib/placeholder-data.js';
import bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedUsers() {
  const insertedUsers = [];
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const u = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });
    insertedUsers.push(u);
  }
  console.log(`Seeded ${insertedUsers.length} users`);
}

async function seedSellers() {
  const insertedSellers = [];
  for (const seller of sellers) {
    const s = await prisma.seller.upsert({
      where: { id: seller.id },
      update: {},
      create: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        image_url: seller.image_url,
      },
    });
    insertedSellers.push(s);
  }
  console.log(`Seeded ${insertedSellers.length} sellers`);
}

async function seedInvoices() {
  const insertedInvoices = [];
  // Clean invoices first to avoid duplicate seeds if run multiple times
  await prisma.invoice.deleteMany();
  for (const invoice of invoices) {
    const inv = await prisma.invoice.create({
      data: {
        seller_id: invoice.seller_id,
        amount: invoice.amount,
        status: invoice.status,
        date: new Date(invoice.date),
      },
    });
    insertedInvoices.push(inv);
  }
  console.log(`Seeded ${insertedInvoices.length} invoices`);
}

async function seedIncome() {
  const insertedIncome = [];
  for (const item of income) {
    const inc = await prisma.income.upsert({
      where: { month: item.month },
      update: {},
      create: {
        month: item.month,
        income: item.income,
      },
    });
    insertedIncome.push(inc);
  }
  console.log(`Seeded ${insertedIncome.length} income`);
}

async function main() {
  try {
    await seedUsers();
    await seedSellers();
    await seedInvoices();
    await seedIncome();
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
