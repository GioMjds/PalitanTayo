import { Metadata } from "next";
import LoginPage from "./login";

export const metadata: Metadata = {
    title: "Login - Palitan Tayo!",
    description: "Login to your account",
}

export default function Login() {
    return <LoginPage />;
}