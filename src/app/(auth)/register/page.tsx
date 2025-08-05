import { Metadata } from "next";
import RegisterPage from "./register";

export const metadata: Metadata = {
    title: "Register - Palitan Tayo!",
    description: "Create your new account in Palitan Tayo!",
}

export const dynamic = "force-dynamic";

export default function Register() {
    return <RegisterPage />
}