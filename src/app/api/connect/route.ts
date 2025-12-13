import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await request.formData();
        const toUserId = formData.get("toUserId") as string;

        if (!toUserId) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

        // Check existing
        const existing = await prisma.connectionRequest.findFirst({
            where: {
                OR: [
                    { fromUserId: session.user.id, toUserId },
                    { fromUserId: toUserId, toUserId: session.user.id }
                ]
            }
        });

        if (existing) {
            return NextResponse.json({ error: "Request already exists" }, { status: 400 });
        }

        await prisma.connectionRequest.create({
            data: {
                fromUserId: session.user.id,
                toUserId,
                status: 'PENDING'
            }
        });

        // In a real app, send email here!
        console.log(`[EMAIL] Sending connection request email to user ${toUserId}`);

        return NextResponse.redirect(new URL(`/profile/${toUserId}`, request.url));

    } catch (error) {
        console.error("Connection error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
