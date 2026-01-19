import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const links = [
        { name: 'Users', href: '/admin/users' },
        { name: 'Import', href: '/admin/import' },
        { name: 'Export', href: '/admin/export' },
        { name: 'Mailing', href: '/admin/mailing' },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-red-900 text-white p-4 flex justify-between items-center shadow-md">
                <div className="text-xl font-bold">MDL Admin Panel</div>
                <nav className="flex gap-4">
                    {links.map(l => (
                        <Link key={l.href} href={l.href} className="hover:text-red-200 font-medium">
                            {l.name}
                        </Link>
                    ))}
                    <Link href="/dashboard" className="bg-white text-red-900 px-3 py-1 rounded text-sm font-bold">Exit</Link>
                </nav>
            </header>
            <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
