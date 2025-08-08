import "./globals.css";
import { Metadata } from "next";
import Link from "next/link";
import { League_Spartan } from "next/font/google";

const leagueSpartan = League_Spartan({
    variable: "--font-league-spartan",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Palitan Tayo - Global Not Found",
    description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
    return (
        <html lang="en">
            <body className={`${leagueSpartan.variable} ${leagueSpartan.className} antialiased bg-background-light`}>
                <main className="min-h-screen flex flex-col items-center justify-center section-padding relative overflow-hidden">
                    {/* Background blobs */}
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>

                    {/* Content container */}
                    <div className="card max-w-2xl w-full mx-4 text-center relative z-20">
                        <div className="flex flex-col items-center gap-3">
                            {/* Error number */}
                            <h1 className="text-9xl font-bold text-primary drop-shadow-md">404</h1>

                            {/* Main message */}
                            <h2 className="text-3xl md:text-4xl font-bold text-primary">
                                Oops! Page Not Found
                            </h2>

                            {/* Description */}
                            <p className="text-lg text-text-secondary">
                                The page you're looking for doesn't exist or has been moved.
                                <br />
                                Let's get you back on track.
                            </p>

                            {/* Action button */}
                            <Link prefetch href="/" className="btn btn-primary px-8 py-4 mt-4">
                                Return Home
                            </Link>
                        </div>
                    </div>

                    {/* Footer note */}
                    <p className="mt-8 text-text-secondary text-sm">
                        Need help? <Link href="/contact" className="text-link">Contact our support</Link>
                    </p>
                </main>
            </body>
        </html>
    )
}