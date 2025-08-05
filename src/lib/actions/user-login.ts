import { POST } from "@/utils/axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function loginAction(formData: { email?: string; username?: string; password: string }) {
    "use server";
    try {
        const response = await POST({
            url: "/auth?action=login",
            data: formData
        });
        redirect("/");
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.error || "Login failed" };
    }
}