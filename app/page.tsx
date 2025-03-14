import { redirect } from "next/navigation";

export default function Home() {
	redirect("/dashboard"); // ✅ No need to manually render `DashboardPage`
	return null;
}
