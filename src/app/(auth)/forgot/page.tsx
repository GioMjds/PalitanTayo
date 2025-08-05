import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your password",
}

export const dynamic = "force-dynamic";

export default function ForgotPassword() {
    return (
        <h1>Forgot Password</h1>
    )
}