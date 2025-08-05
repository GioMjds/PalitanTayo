import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold hover:text-secondary-light transition-colors">
                Palitan Tayo!
            </Link>

            <div className="hidden md:flex items-center space-x-6">
                <Link href="/about" className="text-link inverted">
                    About
                </Link>
                <Link href="/how-it-works" className="text-link inverted">
                    How It Works
                </Link>
                <Link href="/community" className="text-link inverted">
                    Community
                </Link>
                <Link href="/login" className="btn btn-secondary">
                    Sign In
                </Link>
            </div>

            {/* Mobile menu button would go here */}
            <button className="md:hidden text-text-inverted">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </nav>
    );
}