import SearchBar from '@/components/SearchBar';

export default async function Search() {
    return (
        <div className="container min-h-screen mx-auto px-4 py-8 mt-20">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary mb-4">Search</h1>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Find users, items, and swap demands in your community. 
                    Start typing to see instant results.
                </p>
            </div>
            
            <div className="mb-12">
                <SearchBar />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="card">
                    <h3 className="font-bold text-lg mb-2 text-primary">Find Users</h3>
                    <p className="text-text-secondary">
                        Search by name, username, or location to find other community members.
                    </p>
                </div>
                <div className="card">
                    <h3 className="font-bold text-lg mb-2 text-primary">Discover Items</h3>
                    <p className="text-text-secondary">
                        Browse available items by name, description, or condition.
                    </p>
                </div>
                <div className="card">
                    <h3 className="font-bold text-lg mb-2 text-primary">Match Demands</h3>
                    <p className="text-text-secondary">
                        Find what others are looking for and see if you have what they need.
                    </p>
                </div>
            </div>
        </div>
    );
}