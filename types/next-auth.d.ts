import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      role: 'USER' | 'SELLER' | 'ADMIN';
    } & DefaultSession['user'];
  }

  interface User {
    role: 'USER' | 'SELLER' | 'ADMIN';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'USER' | 'SELLER' | 'ADMIN';
  }
}
