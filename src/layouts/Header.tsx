import Navbar from "./Navbar";

export default function Header() {
    return (
        <header className="bg-primary text-text-inverted shadow-md">
            <div className="container mx-auto p-2">
                <Navbar />
            </div>
        </header>
    );
}