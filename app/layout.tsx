// app/layout.tsx
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import AuthProvider from "@/components/AuthProvider";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full">
			<body className={`${inter.className} h-full`}>
				<Providers>
					<AuthProvider>
						<div className="flex h-screen bg-gray-100">
							<Sidebar />
							<main className="flex-1 overflow-y-auto p-8">{children}</main>
							<ToastContainer />
						</div>
					</AuthProvider>
				</Providers>
			</body>
		</html>
	);
}
