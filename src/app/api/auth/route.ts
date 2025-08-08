import { NextResponse, type NextRequest } from "next/server";
import { createSession, getCookiesToDelete } from "@/lib/auth";
import { isValidEmail, isValidPassword } from "@/utils/regex";
import { compare, hash } from "bcrypt"
import { otpStorage } from "@/utils/otp";
import { sendOTPEmail } from "@/utils/email";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import path from "path";
import fs from "fs";
import { getCookie } from "@/utils/cookies";

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
                const { identifier, password } = await req.json();
                
                if (!identifier || !password) {
                    return NextResponse.json({
                        error: 'Please fill in all required fields.'
                    }, { status: 400 });
                }

                let user;
                
                // Either email or username can be used for login
                if (isValidEmail(identifier)) {
                    user = await prisma.user.findUnique({ where: { email: identifier } });
                } else {
                    user = await prisma.user.findUnique({ where: { username: identifier } });
                }

                if (!identifier) {
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

                response.headers.set('Authorization', `Bearer ${session.accessToken}`);

                return response;
            }
            case 'send_register_otp': { // For /register
                const { email, firstName, lastName, username, password, confirmPassword } = await req.json();

                if (!email || !firstName || !lastName || !username || !password || !confirmPassword) {
                    return NextResponse.json({
                        error: 'Please provide all required fields.'
                    }, { status: 400 });
                }

                const existingUser = await prisma.user.findUnique({
                    where: { email }
                });

                const existingUsername = await prisma.user.findUnique({
                    where: { username }
                });

                const existingName = await prisma.user.findFirst({
                    where: { name: `${firstName} ${lastName}` }
                });
                
                if (!email || !isValidEmail(email)) {
                    return NextResponse.json({
                        error: 'Email is required'
                    }, { status: 400 });
                }

                if (!username) {
                    return NextResponse.json({
                        error: 'Username is required'
                    }, { status: 400 });
                }

                if (existingUsername) {
                    return NextResponse.json({
                        error: 'Username already exists'
                    }, { status: 409 });
                }

                if (existingName) {
                    return NextResponse.json({
                        error: 'Name already exists'
                    }, { status: 409 });
                }

                if (!isValidPassword(password)) {
                    return NextResponse.json({
                        error: 'Current password does not meet the requirements yet.'
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

                otpStorage.set(firstName, lastName, email, otp, hashedPassword, username);

                await sendOTPEmail({
                    email: email,
                    otp: otp,
                    type: 'register'
                });

                return NextResponse.json({
                    message: 'OTP sent successfully',
                    email: email
                }, { status: 200 });
            }
            case 'verify_otp': { // For /verify-otp if /register is used
                const { email, otp } = await req.json();

                const validation = otpStorage.validate(email, otp);
                
                if (!validation.valid) {
                    return NextResponse.json({
                        error: validation.error || 'Invalid OTP'
                    }, { status: 400 });
                }

                const hashedPassword = validation.data?.hashedPassword;
                const firstName = validation.data?.firstName;
                const lastName = validation.data?.lastName;
                const username = validation.data?.username;

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
                        username: username as string,
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
                const { firstName, lastName, email } = await req.json();

                if (!email) {
                    return NextResponse.json({
                        error: 'Email is required'
                    }, { status: 400 });
                }

                const otpData = otpStorage.get(email);

                if (!otpData) {
                    return NextResponse.json({
                        error: 'No OTP found for this email. Please register first.'
                    }, { status: 404 });
                }

                const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

                otpStorage.set(firstName, lastName, email, newOtp, otpData.hashedPassword, otpData.username);

                await sendOTPEmail({
                    email: email,
                    otp: newOtp,
                    type: 'reset'
                });

                return NextResponse.json({
                    message: 'OTP resent successfully',
                    email: email,
                }, { status: 200 });
            }
            case 'forgot_password_send_otp': { // For /forgot-password sending OTP for password reset
                const { email } = await req.json();

                if (!email) {
                    return NextResponse.json({
                        error: 'Email is required'
                    }, { status: 500 });
                }

                const user = await prisma.user.findUnique({
                    where: { email }
                });

                if (!user) {
                    return NextResponse.json({
                        error: 'User not found with this email'
                    }, { status: 404 });
                }

                const otp = Math.floor(100000 + Math.random() * 900000).toString();

                otpStorage.set("", "", email, otp, user.password!, user.username);

                await sendOTPEmail({
                    email: email,
                    otp: otp,
                    type: 'reset'
                });

                return NextResponse.json({
                    message: 'OTP sent successfully',
                }, { status: 200 });
            }
            case 'forgot_password_verify_otp': { // For /forgot-password verifying the OTP for password reset
                const { email, otp } = await req.json();

                if (!email || !otp) {
                    return NextResponse.json({
                        error: 'Email and OTP are required'
                    }, { status: 400 });
                }

                const validation = otpStorage.validate(email, otp);

                if (!validation.valid) {
                    return NextResponse.json({
                        error: validation.error
                    }, { status: 400 });
                }

                return NextResponse.json({
                    message: 'OTP verified successfully',
                }, { status: 200 });
            }
            case 'forgot_password_reset': { // For /forgot-password resetting the password after Forgot Password OTP verification
                const { email, otp, newPassword } = await req.json();

                if (!email || !otp || !newPassword) {
                    return NextResponse.json({
                        error: 'Email, OTP, and new password are required'
                    }, { status: 400 });
                }

                const validation = otpStorage.validate(email, otp);

                if (!validation.valid) {
                    return NextResponse.json({
                        error: validation.error
                    }, { status: 400 });
                }

                const currentPassword = await prisma.user.findUnique({
                    where: { email },
                    select: { password: true }
                });

                if (currentPassword?.password && await compare(newPassword, currentPassword.password)) {
                    return NextResponse.json({
                        error: 'New password must be different from the current password'
                    }, { status: 400 });
                }

                const hashedPassword = await hash(newPassword, 12);

                await prisma.user.update({
                    where: { email },
                    data: { password: hashedPassword }
                });

                otpStorage.delete(email);

                return NextResponse.json({
                    message: 'Password reset successfully',
                }, { status: 200 });
            }
            default: {
                return NextResponse.json({
                    error: `Invalid action: ${action}`
                }, { status: 400 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `/auth/[action] POST error: ${error}`
        }, { status: 500 });
    }
}