import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/session";

export default async function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const isAdmin = session.user?.role === 'ADMIN';

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar isAdmin={isAdmin} />
            <main className="flex-1 overflow-auto p-8">
                <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
