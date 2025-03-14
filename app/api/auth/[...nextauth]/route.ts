// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Missing email or password");
				}
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
				if (!user) {
					throw new Error("User not found");
				}
				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!isPasswordValid) {
					throw new Error("Invalid password");
				}
				return { id: user.id, email: user.email, role: user.role };
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.role = token.role;
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
