import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getSession();

    // Handled by middleware normally, but nice to have typesafe user here
    if (!session.user) redirect('/');

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Bienvenue, {session.user.firstName} !</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Feed */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">📢 Actualités Récentes</h2>
                        <div className="space-y-4">
                            <div className="border-b border-border pb-4">
                                <h3 className="font-bold text-lg">Assemblée Générale MDL 2025</h3>
                                <p className="text-muted-foreground text-sm mb-2">Publié le 12 Déc 2024</p>
                                <p>Ne manquez pas la prochaine Assemblée Générale ! Nous voterons pour les nouveaux membres du bureau. Venez partager vos idées.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Dîner de Gala des Anciens</h3>
                                <p className="text-muted-foreground text-sm mb-2">Publié le 05 Déc 2024</p>
                                <p>Les billets sont disponibles pour le Gala annuel. Des tables de networking par secteur seront organisées.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
                        <h2 className="text-lg font-semibold mb-2 text-primary">Votre Statut</h2>
                        <p className="text-sm mb-4">Profil complété : <span className="font-bold">85%</span></p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <a href="/profile" className="text-xs text-primary underline">Complétez votre profil</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
