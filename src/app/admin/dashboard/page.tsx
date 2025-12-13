import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    const session = await getSession();
    if (!session.user || session.user.role !== 'ADMIN') redirect('/dashboard');

    return (
        <div className="p-8 border-l-4 border-red-500 bg-red-50">
            <h1 className="text-3xl font-bold text-red-900 mb-4">Admin Dashboard</h1>
            <p className="text-red-700">Restricted access.</p>
        </div>
    );
}
