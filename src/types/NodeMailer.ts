export interface SendOTPEmailOptions {
    email: string;
    otp: string;
    type?: 'register' | 'reset';
}