import { Metadata } from "next";
import Link from "next/link";
import { League_Spartan } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const leagueSpartan = League_Spartan({
    variable: "--font-league-spartan",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Palitan Tayo - Global Not Found",
    description: "Page not found",
};

export default function GlobalNotFound() {
    return (
        <html lang="en">
            <body className={`${leagueSpartan.variable} ${leagueSpartan.className} antialiased`}>
                
            </body>
        </html>
    )
}