import Image from "next/image";
import Link from "next/link";
import palitanTayoImg from "@/../public/palitantayo-logo.png";

export default function Page() {
    return (
        <div className="relative overflow-hidden">
            {/* Background blobs */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            {/* Hero Section */}
            <section className="relative section-padding">
                <div className="container mx-auto px-2">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                                Trade What You Have, <span className="text-secondary">Get What You Need</span>
                            </h1>
                            <p className="text-text-secondary text-lg mb-8">
                                Join our community barter system where you can exchange goods and services without cash.
                                It's simple, sustainable, and connects you with your neighbors.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/signup" className="btn btn-primary">
                                    Get Started
                                </Link>
                                <Link href="/how-it-works" className="btn btn-outline">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="card p-2">
                                <Image
                                    src={palitanTayoImg}
                                    alt="People trading items"
                                    width={600}
                                    height={400}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
                    <Link href="/signup" className="btn btn-secondary">
                        Sign Up Now
                    </Link>
                </div>
            </section>
        </div>
    );
}