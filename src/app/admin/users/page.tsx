import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function AdminUsersPage() {
    const session = await getSession();
    if (!session.user || session.user.role !== 'ADMIN') redirect("/");

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
    });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow">
                <table className="w-full text-sm">
                    <thead className="bg-muted">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Promo</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-t border-border hover:bg-muted/50">
                                <td className="p-3">{u.firstName} {u.lastName}</td>
                                <td className="p-3">{u.email}</td>
                                <td className="p-3">{u.promoYear}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-3 text-blue-600 hover:underline cursor-pointer">Edit</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
