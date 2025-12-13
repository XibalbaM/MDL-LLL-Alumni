import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/hash";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        // Verify session is valid and in force-update mode
        if (!session.user || !session.user.isFirstLogin || !session.forceUpdateToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { email, password, gdprConsent } = await request.json();

        if (!email || !password || gdprConsent !== true) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Update User
        const hashedPassword = await hashPassword(password);

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                email,
                passwordHash: hashedPassword,
                isFirstLogin: false,
                gdprConsent: true,
            },
        });

        // Update Session
        session.user.isFirstLogin = false;
        session.forceUpdateToken = undefined;
        await session.save();

        return NextResponse.json({ success: true, redirect: "/dashboard" });

    } catch (error) {
        console.error("First login update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
