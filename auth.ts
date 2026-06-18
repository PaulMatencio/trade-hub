import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { z } from 'zod';
import { prisma } from './app/lib/prisma';
import type { User } from './app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user || undefined;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}


export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
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
                    const dbUser = await prisma.user.findUnique({
                        where: { email: user.email! },
                    });
                    if (dbUser) {
                        token.role = dbUser.role;
                    } else {
                        const newUser = await prisma.user.create({
                            data: {
                                name: user.name || 'Google User',
                                email: user.email!,
                                password: '', // Passwordless
                                role: 'USER',
                            },
                        });
                        token.role = newUser.role;
                    }
                } else {
                    token.role = user.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.role) {
                session.user.role = token.role;
            }
            return session;
        },
    },
});

