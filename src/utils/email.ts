import { SendOTPEmailOptions } from '@/types/NodeMailer';
import nodemailer from 'nodemailer';

export async function sendOTPEmail({ email, otp, type = "register" }: SendOTPEmailOptions) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    });

    const isRegister = type === 'register';
    const subject = isRegister 
        ? "Your Palitan Tayo Verification Code | Register your Palitan Tayo Account!"
        : "Your Palitan Tayo Password Reset Code | Reset Your Password";

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Palitan Tayo - Verification Code</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #e9c46a; line-height: 1.6;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #e9c46a;">
            <tr>
                <td style="padding: 40px 20px;">
                    <!-- Email Content Container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(30, 42, 56, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #1e2a38 0%, #2d3e53 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
                                <h1 style="margin: 0; color: #f1faee; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                    🔄 Palitan Tayo
                                </h1>
                                <p style="margin: 8px 0 0 0; color: #a8dadc; font-size: 16px; font-weight: 400;">
                                    ${isRegister ? 'Welcome to our community!' : 'Password Reset Request'}
                                </p>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <div style="text-align: center; margin-bottom: 32px;">
                                    ${isRegister 
                                        ? `<h2 style="margin: 0 0 16px 0; color: #1e2a38; font-size: 24px; font-weight: 600;">
                                            Verify Your Account
                                           </h2>
                                           <p style="margin: 0; color: #5c6b80; font-size: 16px;">
                                            Thank you for joining Palitan Tayo! Please use the verification code below to complete your registration.
                                           </p>`
                                        : `<h2 style="margin: 0 0 16px 0; color: #1e2a38; font-size: 24px; font-weight: 600;">
                                            Reset Your Password
                                           </h2>
                                           <p style="margin: 0; color: #5c6b80; font-size: 16px;">
                                            We received a request to reset your password. Use the code below to create a new password.
                                           </p>`
                                    }
                                </div>

                                <!-- OTP Code Box -->
                                <div style="text-align: center; margin: 32px 0;">
                                    <div style="display: inline-block; background: linear-gradient(135deg, #a8dadc 0%, #8bc2c4 100%); padding: 24px 32px; border-radius: 12px; border: 3px dashed #1e2a38;">
                                        <p style="margin: 0 0 8px 0; color: #1e2a38; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                                            Verification Code
                                        </p>
                                        <div style="font-size: 36px; font-weight: 700; color: #1e2a38; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </div>
                                    </div>
                                </div>

                                <!-- Instructions -->
                                <div style="background-color: #f1faee; padding: 24px; border-radius: 8px; border-left: 4px solid #2a9d8f; margin: 32px 0;">
                                    <h3 style="margin: 0 0 12px 0; color: #1e2a38; font-size: 18px; font-weight: 600;">
                                        📋 Instructions:
                                    </h3>
                                    <ul style="margin: 0; padding-left: 20px; color: #5c6b80; font-size: 14px;">
                                        <li style="margin-bottom: 8px;">Enter this code in the verification field</li>
                                        <li style="margin-bottom: 8px;">This code will expire in <strong>10 minutes</strong></li>
                                        <li style="margin-bottom: 8px;">Do not share this code with anyone</li>
                                        ${!isRegister ? '<li>If you didn\'t request this, please ignore this email</li>' : ''}
                                    </ul>
                                </div>

                                <!-- Support Section -->
                                <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e3f0df;">
                                    <p style="margin: 0 0 16px 0; color: #5c6b80; font-size: 14px;">
                                        Need help? Contact our support team
                                    </p>
                                    <a href="mailto:support@palitantayo.com" style="color: #1e2a38; text-decoration: none; font-weight: 600; font-size: 14px; padding: 8px 16px; border: 2px solid #1e2a38; border-radius: 6px; display: inline-block; transition: all 0.2s;">
                                        📧 Contact Support
                                    </a>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 16px 16px; border-top: 1px solid #e3f0df;">
                                <p style="margin: 0 0 12px 0; color: #5c6b80; font-size: 14px;">
                                    This email was sent to <strong>${email}</strong>
                                </p>
                                <p style="margin: 0 0 16px 0; color: #8bc2c4; font-size: 12px;">
                                    © 2024 Palitan Tayo. All rights reserved.
                                </p>
                                <div style="margin-top: 16px;">
                                    <a href="#" style="color: #5c6b80; text-decoration: none; font-size: 12px; margin: 0 8px;">Privacy Policy</a>
                                    <span style="color: #e3f0df;">|</span>
                                    <a href="#" style="color: #5c6b80; text-decoration: none; font-size: 12px; margin: 0 8px;">Terms of Service</a>
                                    <span style="color: #e3f0df;">|</span>
                                    <a href="#" style="color: #5c6b80; text-decoration: none; font-size: 12px; margin: 0 8px;">Unsubscribe</a>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const textTemplate = `
    🔄 Palitan Tayo - ${isRegister ? 'Account Verification' : 'Password Reset'}
    
    ${isRegister 
        ? 'Welcome to Palitan Tayo! Thank you for joining our community.'
        : 'We received a request to reset your password.'
    }
    
    Your verification code is: ${otp}
    
    Instructions:
    - Enter this code in the verification field
    - This code will expire in 10 minutes
    - Do not share this code with anyone
    ${!isRegister ? '- If you didn\'t request this, please ignore this email' : ''}
    
    Need help? Contact our support team at support@palitantayo.com
    
    This email was sent to ${email}
    © ${new Date().getFullYear()} Palitan Tayo. All rights reserved.
    `;

    const mailOptions = {
        from: `"Palitan Tayo" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: htmlTemplate,
        text: textTemplate,
    };

    await transporter.sendMail(mailOptions);
}