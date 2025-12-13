import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { saveProfilePicture } from "@/lib/file-upload";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const publicPath = await saveProfilePicture(file);

        // Update User Record
        await prisma.user.update({
            where: { id: session.user.id },
            data: { profilePictureUrl: publicPath },
        });

        // In a server action we would revalidatePath. Here we just redirect or JSON.
        return NextResponse.redirect(new URL("/profile", request.url));

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
