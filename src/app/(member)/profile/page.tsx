import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from 'next/image';

export default async function ProfilePage() {
    const session = await getSession();
    if (!session.user) redirect("/");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Mon Profil</h1>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <div className="flex gap-8 items-start">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-muted relative border-4 border-background shadow-md">
                            {user.profilePictureUrl ? (
                                <Image
                                    src={user.profilePictureUrl}
                                    alt="Profil"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                                    {user.firstName[0]}{user.lastName[0]}
                                </div>
                            )}
                        </div>
                        {/* Simple Upload Form Placeholder - ideally a client component */}
                        <form action="/api/upload" method="post" encType="multipart/form-data" className="text-sm">
                            <input type="file" name="file" accept="image/*" className="block w-full text-xs text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-xs file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90
                    "/>
                            <button type="submit" className="mt-2 text-xs text-primary hover:underline">Importer</button>
                        </form>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Prénom</label>
                                <div className="text-lg">{user.firstName}</div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Nom</label>
                                <div className="text-lg">{user.lastName}</div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Promo</label>
                                <div className="text-lg">{user.promoYear}</div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <div className="text-lg">{user.email}</div>
                            </div>
                        </div>

                        <div className="border-t border-border my-4 pt-4">
                            <h2 className="text-lg font-semibold mb-4">Situation Actuelle</h2>
                            <form action="/api/profile/update" method="post" className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Poste Actuel</label>
                                    <input name="jobTitle" defaultValue={user.jobTitle || ''} className="w-full bg-input border border-border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Entreprise / Établissement</label>
                                    <input name="company" defaultValue={user.company || ''} className="w-full bg-input border border-border rounded p-2" />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:brightness-110 text-sm font-semibold">
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
