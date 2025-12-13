import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function NetworkPage() {
    const session = await getSession();
    if (!session.user) redirect("/");

    const receivedRequests = await prisma.connectionRequest.findMany({
        where: {
            toUserId: session.user.id,
            status: 'PENDING'
        },
        include: { fromUser: true }
    });

    const sentRequests = await prisma.connectionRequest.findMany({
        where: {
            fromUserId: session.user.id,
            status: 'PENDING'
        },
        include: { toUser: true }
    });

    const connections = await prisma.connectionRequest.findMany({
        where: {
            OR: [
                { fromUserId: session.user.id, status: 'ACCEPTED' },
                { toUserId: session.user.id, status: 'ACCEPTED' }
            ]
        },
        include: { fromUser: true, toUser: true }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Mon Réseau</h1>

            {/* Received Requests */}
            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    Demandes Reçues
                    {receivedRequests.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{receivedRequests.length}</span>}
                </h2>

                {receivedRequests.length === 0 ? (
                    <p className="text-muted-foreground italic">Aucune demande en attente.</p>
                ) : (
                    <div className="grid gap-4">
                        {receivedRequests.map(req => (
                            <div key={req.id} className="bg-card border border-border p-4 rounded-lg flex justify-between items-center shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                                        {req.fromUser.firstName[0]}{req.fromUser.lastName[0]}
                                    </div>
                                    <div>
                                        <div className="font-medium">{req.fromUser.firstName} {req.fromUser.lastName}</div>
                                        <div className="text-xs text-muted-foreground">{req.fromUser.jobTitle || 'Étudiant'}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <form action="/api/connect/accept" method="post">
                                        <input type="hidden" name="requestId" value={req.id} />
                                        <button type="submit" className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:brightness-110">Accepter</button>
                                    </form>
                                    {/* Reject could go here */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Sent Requests */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Demandes Envoyées</h2>
                <div className="grid gap-2">
                    {sentRequests.map(req => (
                        <div key={req.id} className="text-sm text-muted-foreground border-b border-border pb-2 flex justify-between">
                            <span>Pour : <b>{req.toUser.firstName} {req.toUser.lastName}</b></span>
                            <span>En attente...</span>
                        </div>
                    ))}
                    {sentRequests.length === 0 && <p className="text-muted-foreground italic">Aucune demande envoyée.</p>}
                </div>
            </section>
        </div>
    );
}
