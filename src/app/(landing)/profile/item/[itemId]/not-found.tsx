'use client';

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background-light p-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full"
            >
                <div className="relative">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                    <div className="relative z-20 card p-8 md:p-12">
                        <motion.h1
                            className="text-6xl md:text-8xl font-bold text-primary mb-4"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            404
                        </motion.h1>
                        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                            Item Not Found
                        </h2>
                        <p className="text-text-secondary mb-8 text-lg">
                            The item or profile you're looking for has been swapped or is no longer available.
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/"
                                prefetch
                                className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 text-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Return to Homepage
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}