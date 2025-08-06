import { Metadata } from "next";
import ForgotPasswordPage from "./forgot-password";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your password",
}

export const dynamic = "force-dynamic";

export default function ForgotPassword() {
    return <ForgotPasswordPage />
}