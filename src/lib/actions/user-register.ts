"use server";

import { POST } from "@/utils/axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function sendOTPAction(formData: {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
}) {
    try {
        const response = await POST({
            url: "/auth?action=send_register_otp",
            data: formData
        });
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.error || "Failed to send OTP" };
    }
}

export async function verifyOTPAction(formData: {
    email: string;
    username: string;
    otp: string;
}) {
    try {
        const response = await POST({
            url: "/auth?action=verify_otp",
            data: formData
        });
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.error || "OTP verification failed" };
    }
}