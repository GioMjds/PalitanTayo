import Link from "next/link";

export default function Page() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* How It Works Section */}
            <section className="bg-surface-secondary section-padding">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-primary text-center mb-12">How It Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "List Your Items",
                                description: "Post what you have to offer and what you're looking for in exchange.",
                                icon: "📝"
                            },
                            {
                                title: "Browse Offers",
                                description: "Discover items and services from others in your community.",
                                icon: "🔍"
                            },
                            {
                                title: "Make a Trade",
                                description: "Connect with other members and arrange your exchange.",
                                icon: "🤝"
                            }
                        ].map((step, index) => (
                            <div key={index} className="card p-6 text-center">
                                <div className="text-4xl mb-4">{step.icon}</div>
                                <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                                <p className="text-text-secondary">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary text-text-inverted section-padding">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Start Trading?</h2>
                    <p className="text-secondary-light max-w-2xl mx-auto mb-8">
                        Join our growing community of traders today and discover a new way to get what you need.
                    </p>
                    <Link href="/signup" rel="noopener noreferrer" target="_blank" className="btn btn-secondary">
                        Sign Up Now
                    </Link>
                </div>
            </section>
        </main>
    );
}