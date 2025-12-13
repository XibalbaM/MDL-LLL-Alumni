'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isAdmin }: { isAdmin?: boolean }) {
    const pathname = usePathname();

    const links = [
        { name: 'Tableau de bord', href: '/dashboard', icon: '🏠' },
        { name: 'Annuaire', href: '/directory', icon: '👥' },
        { name: 'Mon Réseau', href: '/network', icon: '🔗' },
        { name: 'Mon Profil', href: '/profile', icon: '👤' },
    ];

    if (isAdmin) {
        links.push({ name: 'Administration', href: '/admin/dashboard', icon: '⚙️' });
    }

    return (
        <aside className="w-64 bg-card border-r border-border h-screen flex flex-col sticky top-0">
            <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Anciens MDL
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                }`}
                        >
                            <span className="text-xl">{link.icon}</span>
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="px-4 py-2 text-xs text-muted-foreground">
                    Connecté
                </div>
                <form action="/api/logout" method="post">
                    <button type="submit" className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded transition-colors flex items-center gap-2">
                        <span>🚪</span> Déconnexion
                    </button>
                </form>
            </div>
        </aside>
    );
}
