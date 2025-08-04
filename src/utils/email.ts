import nodemailer from 'nodemailer';

export async function sendOTPEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    });

    const htmlTemplate = `
    
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Palitan Tayo Verification Code | Register your Palitan Tayo Account!",
        html: htmlTemplate,
        text: `
        
        `,
    }

    await transporter.sendMail(mailOptions);
}