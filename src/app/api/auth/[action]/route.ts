import { NextResponse, type NextRequest } from "next/server";
import { createSession, getCookiesToDelete } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { compare, hash } from "bcrypt"

export async function POST(req: NextRequest) {
    try {
        const action = await req.json();

        switch (action) {
            case 'logout': {
                const sessionId = req.cookies.get('access_token')?.value;

                if (!sessionId) {
                    return NextResponse.json({
                        error: 'No session found'
                    }, { status: 401 });
                }

                const response = NextResponse.json({
                    message: 'Logged out successfully'
                }, { status: 200 });

                const cookiesToDelete = await getCookiesToDelete();

                for (const cookie of cookiesToDelete) {
                    response.cookies.delete(cookie);
                }

                return response;
            }
            case 'login': {
                const { email, username, password } = await req.json();

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            email ?? undefined,
                            username ?? undefined
                        ].filter(Boolean)
                    },
                });

                if (!email && !username || !password) {
                    return NextResponse.json({
                        error: 'Email, username, and password are required'
                    }, { status: 400 });
                }

                if (!email && !username) {
                    return NextResponse.json({
                        error: 'Either email or username is required'
                    }, { status: 400 });
                }

                if (!password) {
                    return NextResponse.json({
                        error: 'Password is required'
                    }, { status: 400 });
                }

                if (!user) {
                    return NextResponse.json({
                        error: 'User does not exist'
                    }, { status: 404 });
                }

                const isPasswordValid = await compare(password, user.password);

                if (!isPasswordValid) {
                    return NextResponse.json({
                        error: 'Invalid password'
                    }, { status: 401 });
                }

                const session = await createSession(user.id);

                if (!session) {
                    return NextResponse.json({
                        error: 'No current session found'
                    }, { status: 500 });
                }

                const response = NextResponse.json({
                    message: `${user.username} logged in successfully`,
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username
                    }
                }, { status: 200 });

                response.cookies.set({
                    name: 'access_token',
                    value: session.accessToken,
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: "/",
                });

                response.cookies.set({
                    name: 'refresh_token',
                    value: session.refreshToken,
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                });

                return response;
            }
            case 'send_register_otp': { // For /register
                const { email, username, password, confirmPassword } = await req.json();
            }
            case 'verify_otp': { // For /verify-otp if /register is used

            }
            case 'resend_otp': { // For /verify-otp resending the OTP

            }
            case 'forgot_password_send_otp': { // For /forgot-password sending OTP for password reset
                
            }
            case 'forgot_password_verify_otp': { // For /forgot-password verifying the OTP for password reset

            }
            case 'forgot_password_reset': { // For /forgot-password resetting the password after Forgot Password OTP verification

            }
            default: {
                return NextResponse.json({
                    error: `Invalid action: ${action}`
                }, { status: 500 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `/auth/[action] POST error: ${error}`
        }, { status: 500 });
    }
}