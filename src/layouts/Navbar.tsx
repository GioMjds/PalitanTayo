'use client';

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { POST } from "@/utils/axios";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import logo from "@/../public/logo.png";
import Dropdown from "@/components/Dropdown";
import ProfileIcon from "@/components/ProfileIcon";
import Modal from "@/components/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faExchangeAlt, faSignOut } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
    userDetails?: {
        profileImage?: string;
        name?: string;
        email?: string;
        id?: string;
        username?: string;
    } | null;
}

export default function Navbar({ userDetails }: NavbarProps) {
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            await POST({
                url: "/auth?action=logout",
                config: {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            });
        },
        onSuccess: () => {
            router.push("/login");
            router.prefetch("/login");
            router.refresh();
            setShowLogoutModal(false);
        },
        onError: (error) => {
            console.error(`Logout failed: ${error}`);
        }
    });

    const mobileMenuVariants: Variants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            },
        },
        open: {
            opacity: 1,
            height: 'auto',
            transition: {
                duration: 0.3,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-primary text-text-inverted shadow-lg z-50">
                <div className="flex items-center justify-between w-full py-4 px-4 sm:px-6">
                    <Link prefetch href="/" className="flex items-center space-x-2">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                            <Image
                                src={logo}
                                alt="Palitan Tayo Logo"
                                fill
                                sizes="auto"
                                priority
                                className="object-cover"
                            />
                        </div>
                        <span className="text-2xl sm:text-3xl font-bold text-secondary drop-shadow-md">
                            Palitan Tayo
                        </span>
                    </Link>

                    <section className="flex-1 max-w-2xl mx-4">
                        <SearchBar />
                    </section>

                    <div className="hidden md:flex items-center space-x-6">
                        {userDetails ? (
                            <div ref={profileRef}>
                                <Dropdown
                                    userDetails={{
                                        name: userDetails.name || userDetails.username || '',
                                        email: userDetails.email || '',
                                        username: userDetails.username || '',
                                        profileImage: userDetails.profileImage || null
                                    }}
                                    options={[
                                        {
                                            label: 'Profile',
                                            onClick: () => router.push(`/profile/${userDetails.id}`),
                                            icon: <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                                        },
                                        {
                                            label: 'My Trades',
                                            onClick: () => router.push('/trades'),
                                            icon: <FontAwesomeIcon icon={faExchangeAlt} className="w-4 h-4" />
                                        },
                                        {
                                            label: 'Log Out',
                                            onClick: () => setShowLogoutModal(true),
                                            icon: <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 text-red-500" />
                                        },
                                    ]}
                                    position="bottom"
                                >
                                    <ProfileIcon profileImage={userDetails.profileImage} />
                                </Dropdown>
                            </div>
                        ) : (
                            <Link href="/login" className="btn btn-secondary">
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-text-inverted"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                <motion.div
                    variants={mobileMenuVariants}
                    initial="closed"
                    animate={isMenuOpen ? "open" : "closed"}
                    className="md:hidden bg-primary-light overflow-hidden"
                >
                    <div className="px-4 py-2 space-y-2">
                        <Link href="/about" className="block text-link inverted py-2">
                            About
                        </Link>
                        <Link href="/how-it-works" className="block text-link inverted py-2">
                            How It Works
                        </Link>
                        <Link href="/community" className="block text-link inverted py-2">
                            Community
                        </Link>

                        {userDetails ? (
                            <>
                                <Link href={`/profile/${userDetails.id}`} className="block text-link inverted py-2">
                                    Profile
                                </Link>
                                <Link href="/trades" className="block text-link inverted py-2">
                                    My Trades
                                </Link>
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="block text-link inverted py-2 text-left w-full"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="block btn btn-secondary w-full text-center">
                                Sign In
                            </Link>
                        )}
                    </div>
                </motion.div>
            </nav>

            {/* Logout Modal */}
            {showLogoutModal && (
                <AnimatePresence mode="wait">
                    <Modal
                        isOpen={showLogoutModal}
                        onCancel={() => setShowLogoutModal(false)}
                        title="Confirm Logout"
                        description="Are you sure you want to logout?"
                        confirmText="Log Out"
                        cancelText="Cancel"
                        onConfirm={mutate}
                        loading={isPending}
                        loadingText="Logging out..."
                    />
                </AnimatePresence>
            )}
        </>
    );
}