import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
        isFirstLogin: boolean;
    };
    forceUpdateToken?: boolean; // If true, user must change password/email
}

export const sessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string || "complex_password_at_least_32_characters_long",
    cookieName: "mdl_alumni_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    return getIronSession<SessionData>(cookieStore, sessionOptions);
}
