import { JWTPayload, SignJWT, jwtVerify } from "jose";
import prisma from "./prisma";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionData extends JWTPayload {
    userId: string;
    email: string;
}

export async function encrypt(payload: Record<string, unknown>) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(encodedKey);
};

export async function decrypt(token: string) {
    const { payload } = await jwtVerify(token, encodedKey, {
        algorithms: ["HS256"]
    });
    return payload;
}

export async function createSession(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        if (!user) throw new Error("User not found");

        const sessionData: SessionData = {
            userId,
            email: user.email!
        };

        const accessToken = await new SignJWT(sessionData)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(encodedKey);

        const refreshToken = await new SignJWT(sessionData)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(encodedKey);

        return { sessionData, accessToken, refreshToken };
    } catch (error) {
        console.error(`Error creating session: ${error}`);
        throw error;
    }
};

export async function verifyToken(token: string) {
    return jwtVerify(token, encodedKey);
}

export async function getCookiesToDelete() {
    return [
        'access_token',
        'refresh_token',
    ]
};

export async function getSession() {
    try {
        const token = (await cookies()).get('access_token')?.value;

        if (token) {
            try {
                const verified = await jwtVerify(token, encodedKey);
                return verified.payload as SessionData;
            } catch (error) {
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error(`Error getting session: ${error}`);
        return null;
    }
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                location: true,
                profileImage: true
            }
        });
        return user;
    } catch (error) {
        console.error(`Error getting current user: ${error}`);
        return null;
    }
}