'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative flex items-center">
                <input
                    type="text"
                    placeholder="Search for items to trade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field w-full pl-12 pr-10 py-3 text-text-primary"
                />
                <div className="absolute left-4 text-text-secondary">
                    <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                </div>
                {searchQuery && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 text-text-secondary hover:text-primary transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                    </motion.button>
                )}
            </div>

            {/* Search results dropdown would go here */}
            {searchQuery && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-2 bg-surface-primary rounded-lg shadow-lg overflow-hidden"
                >
                    <div className="p-4 text-center text-text-secondary">
                        Search results will appear here
                    </div>
                </motion.div>
            )}
        </div>
    );
}