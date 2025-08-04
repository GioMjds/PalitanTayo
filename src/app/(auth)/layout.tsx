import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "../globals.css";
import Providers from "@/providers/TanstackQueryProviders";

const leagueSpartan = League_Spartan({
    variable: "--font-league-spartan",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: {
        default: "Palitan Tayo!",
        template: "%s",
    },
    description: "A Online Community Barter System",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${leagueSpartan.variable} ${leagueSpartan.className} antialiased`}
            >
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
