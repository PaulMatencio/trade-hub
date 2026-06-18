# Trade Hub

Trade Hub is a modern financial dashboard and invoices management application built on Next.js 14 App Router, powered by Prisma ORM and NextAuth.js v5. It features complete authentication, user registration, role-based access control (RBAC), and dynamic dashboard invoice tracking.

---

## 🚀 Technologies

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
* **Database ORM:** [Prisma](https://www.prisma.io/) (PostgreSQL client generator)
* **Database:** PostgreSQL
* **Authentication:** [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
* **Validation:** [Zod](https://zod.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Heroicons](https://heroicons.com/)
* **Toasts:** [Sonner](https://sonner.emilkowal.ski/)

---

## ✨ Key Features

1. **Secure Authentication:**
   * Custom Credentials sign-in provider powered by NextAuth.js.
   * Secure server-side password verification using `bcrypt`.
   * Social sign-in integration with **Google** and **GitHub** OAuth providers.
2. **User Sign-Up Flow:**
   * Client-side form with real-time feedback and server-action driven registration.
   * Duplicate account protection and automatic password hashing.
3. **Role-Based Access Control (RBAC):**
   * Pre-defined user roles: `USER`, `SELLER`, and `ADMIN`.
   * Type-augmented session/JWT bindings so user roles are safely accessible in components and middleware.
4. **Invoices Management Dashboard:**
   * Full CRUD operations for invoices (Create, Update, Delete).
   * Robust database transactions using Prisma.
   * Interactive deletion protection with user confirmation.
5. **Interactive UI Notifications:**
   * Integration with Sonner for beautiful, non-intrusive toast messages.

---

## 🛠️ Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18.17.0 or higher) and a PostgreSQL database instance running.

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory based on the `.env.example` file:
```bash
cp .env.example .env
```

Configure your database and NextAuth credentials in `.env`:
```env
DATABASE_URL=your_postgresql_database_connection_string
AUTH_SECRET=your_nextauth_secret_key

# Google OAuth Keys
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# GitHub OAuth Keys
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
```

### 4. Database Setup & Sync
Generate the Prisma Client and sync your database tables with the Prisma schema:
```bash
npx prisma generate
npx prisma db push
```

### 5. Seeding Database
Populate your database with the initial placeholder data (users, sellers, invoices):
```bash
npm run seed
```

### 6. Run Development Server
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📊 Database Schema

* **User (`users`):** Stores account information and authentication credentials, alongside their `Role` (`USER`, `SELLER`, `ADMIN`).
* **Seller (`sellers`):** Stores information about sellers (name, email, profile image).
* **Invoice (`invoices`):** Tracks invoices mapped to specific sellers, containing amounts, statuses (`awaiting`/`fulfilled`), and dates.
* **Income (`income`):** Stores monthly revenue statistics for rendering charts.
