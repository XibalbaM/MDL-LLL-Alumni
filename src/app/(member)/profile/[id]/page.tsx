import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PublicProfilePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getSession();
    if (!session.user) redirect("/");

    const resolvedParams = await params;
    const user = await prisma.user.findUnique({
        where: { id: resolvedParams.id },
    });

    if (!user) return <div>User not found</div>;

    // Check connection status
    const existingRequest = await prisma.connectionRequest.findFirst({
        where: {
            OR: [
                { fromUserId: session.user.id, toUserId: user.id },
                { fromUserId: user.id, toUserId: session.user.id }
            ]
        }
    });

    const isConnected = existingRequest?.status === 'ACCEPTED';
    const isPending = existingRequest?.status === 'PENDING';

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center text-4xl mb-4 overflow-hidden">
                    {user.profilePictureUrl ? (
                        <img src={user.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span>{user.firstName[0]}{user.lastName[0]}</span>
                    )}
                </div>
                <h1 className="text-3xl font-bold mb-1">{user.firstName} {user.lastName}</h1>
                <p className="text-muted-foreground text-lg mb-6">Promo {user.promoYear}</p>

                <div className="grid grid-cols-2 gap-4 text-left mb-8 max-w-sm mx-auto">
                    <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Job</label>
                        <div>{user.jobTitle || '-'}</div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Company</label>
                        <div>{user.company || '-'}</div>
                    </div>
                </div>

                {/* Action Buttons */}
                {isConnected ? (
                    <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
                        You are connected!
                        <div className="font-semibold text-sm mt-1">{user.email}</div>
                    </div>
                ) : (
                    <form action="/api/connect" method="post">
                        <input type="hidden" name="toUserId" value={user.id} />
                        <button
                            type="submit"
                            disabled={!!existingRequest}
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isPending ? 'Request Sent' : 'Request Connection'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
