import { useEffect, useState } from "react";
import {
	getSession,
	SessionProvider as AuthSessionProvider,
} from "next-auth/react";
import type { Session } from "next-auth";
import Sidebar from "@/components/Sidebar";

export default function SessionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [session, setSession] = useState<Session | null | undefined>(null);

	useEffect(() => {
		const fetchSession = async () => {
			const sessionData = await getSession();
			setSession(sessionData);
		};
		fetchSession();
	}, []);

	return (
		<AuthSessionProvider session={session}>
			<div className="flex h-screen bg-gray-100">
				{<Sidebar />}
				{/* {session && <Sidebar />} */}
				<main className="flex-1 overflow-y-auto p-8">{children}</main>
			</div>
		</AuthSessionProvider>
	);
}
