import { NextResponse, type NextRequest } from "next/server";
import { createSession, getCookiesToDelete } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { compare, hash } from "bcrypt"
import { otpStorage } from "@/utils/otp";
import { sendOTPEmail } from "@/utils/email";
import path from "path";
import fs from "fs";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');

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

                const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                
                if ((!email && !username) || !password) {
                    return NextResponse.json({
                        error: 'Please fill in all required fields.'
                    }, { status: 400 });
                }

                if (email && !emailRegex.test(email)) {
                    return NextResponse.json({
                        error: 'Invalid email format'
                    }, { status: 400 });
                }

                let user;

                if (email) {
                    user = await prisma.user.findUnique({ where: { email } });
                } else if (username) {
                    user = await prisma.user.findUnique({ where: { username } });
                }

                if (!email && !username) {
                    return NextResponse.json({
                        error: 'Email or username is required'
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
                    path: "/",
                });

                return response;
            }
            case 'send_register_otp': { // For /register
                const { email, firstName, lastName, username, password, confirmPassword } = await req.json();

                const existingUser = await prisma.user.findUnique({
                    where: { email }
                });

                if (!email || !firstName || !lastName || !username || !password || !confirmPassword) {
                    return NextResponse.json({
                        error: 'Please provide all required fields.'
                    }, { status: 400 });
                }

                if (!email) {
                    return NextResponse.json({
                        error: 'Email is required'
                    }, { status: 400 });
                }

                if (!username) {
                    return NextResponse.json({
                        error: 'Username is required'
                    }, { status: 400 });
                }

                if (password !== confirmPassword) {
                    return NextResponse.json({
                        error: 'Passwords do not match'
                    }, { status: 400 });
                }

                if (existingUser) {
                    return NextResponse.json({
                        error: 'User already exists with this email'
                    }, { status: 409 });
                }

                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const hashedPassword = await hash(password, 12);

                otpStorage.set(firstName, lastName, email, otp, hashedPassword);

                await sendOTPEmail({
                    email: email,
                    otp: otp,
                    type: 'register'
                });

                return NextResponse.json({
                    message: 'OTP sent successfully',
                    email: email,
                    otp: otp // For testing purposes, remove in production
                }, { status: 200 });
            }
            case 'verify_otp': { // For /verify-otp if /register is used
                const { email, username, otp } = await req.json();

                const validation = otpStorage.validate(email, otp, username);
                
                if (!validation.valid) {
                    return NextResponse.json({
                        error: validation.error || 'Invalid OTP'
                    }, { status: 400 });
                }

                const hashedPassword = validation.data?.hashedPassword;
                const firstName = validation.data?.firstName;
                const lastName = validation.data?.lastName;

                if (!hashedPassword) {
                    return NextResponse.json({
                        error: 'No hashed password found for this OTP'
                    }, { status: 400 });
                    
                }

                let profileImageUrl;
                
                try {
                    const defaultImagePath = path.join(
                        process.cwd(),
                        "public",
                        "Default_pfp.jpg"
                    );
                    const imageBuffer = fs.readFileSync(defaultImagePath);
                    const base64Items = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

                    const uploadResponse = await cloudinary.uploader.upload(
                        base64Items,
                        {
                            folder: "palitantayo/profiles",
                            public_id: `profile_${email}`,
                            overwrite: true,
                            resource_type: "image",
                        },
                    );
                    
                    profileImageUrl = uploadResponse.secure_url;
                } catch (error) {
                    console.error(`Error uploading profile image: ${error}`);
                };

                const newUser = await prisma.user.create({
                    data: {
                        id: crypto.randomUUID(),
                        name: `${firstName} ${lastName}`,
                        email: email,
                        password: hashedPassword,
                        username: username,
                        profileImage: profileImageUrl,
                    }
                });

                otpStorage.delete(email);

                const session = await createSession(newUser.id);

                if (!session) {
                    return NextResponse.json({
                        error: 'No current session found'
                    }, { status: 500 });
                }

                const response = NextResponse.json({
                    message: `${newUser.username} registered successfully`,
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        username: newUser.username
                    }
                }, { status: 200 });
                
                response.cookies.set({
                    name: 'access_token',
                    value: session.accessToken,
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24, // 1 day
                });

                response.cookies.set({
                    name: 'refresh_token',
                    value: session.refreshToken,
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                })

                return response;
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