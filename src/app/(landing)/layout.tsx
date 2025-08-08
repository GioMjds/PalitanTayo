import "../globals.css";
import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import Providers from "@/providers/TanstackQueryProviders";
import Footer from "@/layouts/Footer";
import { getCurrentUser, getSession } from "@/lib/auth";
import Navbar from "@/layouts/Navbar";

const leagueSpartan = League_Spartan({
    variable: "--font-league-spartan",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Palitan Tayo!",
    description: "A Online Community Barter System",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let user: null | object = null;
    const session = await getSession();

    if (session) {
        const currentUser = await getCurrentUser();
        user = {
            id: currentUser?.id,
            name: currentUser?.name,
            username: currentUser?.username,
            email: currentUser?.email,
            location: currentUser?.location,
            profileImage: currentUser?.profileImage,
        }
    }

    return (
        <html lang="en">
            <body className={`${leagueSpartan.variable} ${leagueSpartan.className} antialiased min-h-screen flex flex-col`}>
                <Providers>
                    <Navbar userDetails={user} />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
