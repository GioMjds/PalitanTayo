'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-accent p-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full"
            >
                <div className="relative">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                    <div className="relative z-20 card p-8 md:p-12">
                        <div className="bg-error/10 p-4 rounded-lg mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                            Swap Interrupted
                        </h2>
                        <p className="text-text-secondary mb-2">
                            We encountered an issue while processing your request:
                        </p>
                        <p className="text-error mb-6 font-medium">
                            {error.message}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={reset}
                                className="btn btn-secondary px-6 py-3"
                            >
                                Try Again
                            </motion.button>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/"
                                    prefetch
                                    className="btn btn-outline px-6 py-3"
                                >
                                    Go Home
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}