
export default function Footer() {
    return (
        <footer className="bg-primary text-text-inverted py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold">Palitan Tayo!</h3>
                        <p className="text-secondary-light">A Online Community Barter System</p>
                    </div>

                    <div className="flex space-x-6">
                        <a href="#" className="text-link inverted">Terms</a>
                        <a href="#" className="text-link inverted">Privacy</a>
                        <a href="#" className="text-link inverted">Contact</a>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-primary-light text-center text-sm text-secondary">
                    <p>© {new Date().getFullYear()} Palitan Tayo! All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}