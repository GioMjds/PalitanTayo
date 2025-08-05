import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "../globals.css";
import Providers from "@/providers/TanstackQueryProviders";
import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";

const leagueSpartan = League_Spartan({
    variable: "--font-league-spartan",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Palitan Tayo!",
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
                className={`${leagueSpartan.variable} ${leagueSpartan.className} antialiased min-h-screen flex flex-col`}
            >
                <Providers>
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
