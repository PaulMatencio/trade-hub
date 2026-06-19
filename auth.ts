import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';
import type { User as NextAuthUser } from 'next-auth';

import {
  authenticateUserUseCase,
  getUserByEmailUseCase,
  registerUserUseCase,
} from '@/src/infrastructure/di/container';

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const domainUser = await authenticateUserUseCase.execute({ email, password });
          if (domainUser) {
            // Map User domain entity to NextAuth User format
            return {
              id: domainUser.id,
              name: domainUser.name,
              email: domainUser.email,
              role: domainUser.role,
            } as NextAuthUser;
          }
        }

        return null;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google' || account?.provider === 'github') {
          const dbUser = await getUserByEmailUseCase.execute(user.email!);
          if (dbUser) {
            token.role = dbUser.role;
          } else {
            const defaultName = account.provider === 'google' ? 'Google User' : 'GitHub User';
            const newUser = await registerUserUseCase.execute({
              name: user.name || defaultName,
              email: user.email!,
              role: 'USER',
            });
            token.role = newUser.role;
          }
        } else {
          // Credentials flow already returns mapped user with role
          token.role = (user as any).role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role as any;
      }
      return session;
    },
  },
});
