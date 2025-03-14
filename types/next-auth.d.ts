// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	/**
	 * Extend the built-in session types
	 */
	interface Session {
		user: {
			id?: string;
			role?: string;
		} & DefaultSession["user"];
		token?: string; // Add this line to include the token property
	}

	/**
	 * Extend the built-in user types
	 */
	interface User {
		role?: string;
	}
}

// For JWT strategy
declare module "next-auth/jwt" {
	interface JWT {
		role?: string;
	}
}
