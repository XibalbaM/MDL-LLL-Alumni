import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DirectoryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; promo?: string }>;
}) {
    const session = await getSession();
    if (!session.user) redirect("/");

    const resolvedParams = await searchParams; // Await the promise
    const query = resolvedParams.q || "";
    const promo = resolvedParams.promo ? parseInt(resolvedParams.promo) : undefined;

    const users = await prisma.user.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { firstName: { contains: query } }, // Case insensitive usually depends on DB, SQLite is insensitive for ASCII
                        { lastName: { contains: query } },
                        { jobTitle: { contains: query } },
                    ],
                },
                (typeof promo === 'number' && !Number.isNaN(promo)) ? { promoYear: promo } : {},
            ],
            // Exclude self? Maybe not needed.
            NOT: { id: session.user.id },
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            promoYear: true,
            jobTitle: true,
            company: true,
            profilePictureUrl: true,
        },
        take: 50,
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Annuaire des Anciens</h1>
            </div>

            {/* Search Bar */}
            <form className="flex gap-4 p-4 bg-card border border-border rounded-lg shadow-sm">
                <input
                    name="q"
                    placeholder="Nom, emploi..."
                    defaultValue={query}
                    className="flex-1 bg-input border border-border rounded px-4 py-2"
                />
                <input
                    name="promo"
                    type="number"
                    placeholder="Année"
                    defaultValue={promo || ''}
                    className="w-24 bg-input border border-border rounded px-4 py-2"
                />
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded font-medium hover:brightness-110">
                    Rechercher
                </button>
            </form>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user: any) => (
                    <div key={user.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold overflow-hidden">
                                {user.profilePictureUrl ? (
                                    <img src={user.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user.firstName[0]}{user.lastName[0]}</span>
                                )}
                            </div>
                            <div>
                                <div className="font-semibold text-lg">{user.firstName} {user.lastName}</div>
                                <div className="text-sm text-muted-foreground">Promo {user.promoYear}</div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="text-sm font-medium">{user.jobTitle || "Poste non renseigné"}</div>
                            <div className="text-sm text-muted-foreground">{user.company}</div>
                        </div>

                        <Link
                            href={`/profile/${user.id}`} // We need to create this "Public Profile" route
                            className="w-full text-center py-2 border border-border rounded hover:bg-accent transition-colors text-sm font-medium"
                        >
                            Voir le Profil
                        </Link>
                    </div>
                ))}

                {users.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                        Aucun ancien élève ne correspond à votre recherche.
                    </div>
                )}
            </div>
        </div>
    );
}
