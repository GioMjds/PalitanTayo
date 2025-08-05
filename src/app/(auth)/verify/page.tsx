import { Metadata } from "next";
import VerifyOTPPage from "./verify-otp";

export const metadata: Metadata = {
    title: "Verify your OTP to continue",
    description: "Verify your OTP code",
}

export const dynamic = "force-dynamic";

export default function VerifyOTP() {
    return <VerifyOTPPage />
}