import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await request.formData();
        const jobTitle = formData.get('jobTitle') as string;
        const company = formData.get('company') as string;

        // Optional: Validation

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                jobTitle: jobTitle || null,
                company: company || null,
            }
        });

        // Update session if we stored jobTitle there (we didn't, restricted session is minimal)

        return NextResponse.redirect(new URL("/profile", request.url));
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
