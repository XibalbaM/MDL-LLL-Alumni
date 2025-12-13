import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await request.formData();
        const requestId = formData.get("requestId") as string;

        await prisma.connectionRequest.update({
            where: { id: requestId },
            data: { status: 'ACCEPTED' }
        });

        // Send email to notify sender?

        return NextResponse.redirect(new URL("/network", request.url));

    } catch (error) {
        return NextResponse.json({ error: "Error accepting request" }, { status: 500 });
    }
}
