'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faUser, faBox, faHandshake, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { GET } from '@/utils/axios';
import { SearchResults } from '@/types/response/SearchTypes';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'users' | 'items' | 'demands'>('all');
    const searchRef = useRef<HTMLDivElement>(null);

    const [debouncedQuery, setDebouncedQuery] = useState<string>('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Search query
    const { data: searchResults, isLoading } = useQuery<SearchResults>({
        queryKey: ['search', debouncedQuery, selectedFilter],
        queryFn: async () => {
            if (debouncedQuery.trim().length < 2) return { users: [], items: [], demands: [] };

            return await GET<SearchResults>({
                url: `/search`,
                config: {
                    params: {
                        q: debouncedQuery,
                        type: selectedFilter === 'all' ? undefined : selectedFilter
                    }
                }
            });
        },
        enabled: debouncedQuery.trim().length >= 2
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setIsOpen(true);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setDebouncedQuery('');
        setIsOpen(false);
    };

    const hasResults = searchResults && (
        searchResults.users.length > 0 ||
        searchResults.items.length > 0 ||
        searchResults.demands.length > 0
    );

    const filters = [
        { key: 'all', label: 'All', icon: faSearch },
        { key: 'users', label: 'Users', icon: faUser },
        { key: 'items', label: 'Items', icon: faBox },
        { key: 'demands', label: 'Demands', icon: faHandshake }
    ] as const;

    return (
        <section className="relative w-full max-w-4xl mx-auto" ref={searchRef}>
            <div className="relative flex items-center">
                <input
                    type="text"
                    placeholder="Search for users, items, or swap demands"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    className="input-field w-full pl-12 pr-10 py-3 text-text-primary"
                />
                <div className="absolute left-4 text-text-secondary">
                    {isLoading ? (
                        <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
                    ) : (
                        <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                    )}
                </div>
                {searchQuery && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={clearSearch}
                        className="absolute right-4 text-text-secondary hover:text-primary transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                    </motion.button>
                )}
            </div>

            {/* Search Filters */}
            {isOpen && searchQuery && (
                <div className="absolute z-20 w-full mt-2 bg-surface-primary rounded-lg shadow-lg border border-accent-dark overflow-hidden">
                    <div className="flex border-b border-accent-dark p-2">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setSelectedFilter(filter.key)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedFilter === filter.key
                                        ? 'bg-primary text-text-inverted'
                                        : 'text-text-secondary hover:bg-surface-secondary'
                                    }`}
                            >
                                <FontAwesomeIcon icon={filter.icon} className="w-4 h-4" />
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Results */}
                    <div className="max-h-96 overflow-y-auto">
                        <AnimatePresence>
                            {debouncedQuery.trim().length < 2 ? (
                                <div className="p-4 text-center text-text-secondary">
                                    Type at least 2 characters to search
                                </div>
                            ) : isLoading ? (
                                <div className="p-4 text-center text-text-secondary">
                                    <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin mr-2" />
                                    Searching...
                                </div>
                            ) : !hasResults ? (
                                <div className="p-4 text-center text-text-secondary">
                                    No results found for "{debouncedQuery}"
                                </div>
                            ) : (
                                <div>
                                    {/* Users Results */}
                                    {searchResults?.users && searchResults.users.length > 0 && (selectedFilter === 'all' || selectedFilter === 'users') && (
                                        <div className="border-b border-accent-dark">
                                            <div className="px-4 py-2 bg-surface-secondary text-sm font-medium text-text-secondary">
                                                Users ({searchResults.users.length})
                                            </div>
                                            {searchResults.users.map((user) => (
                                                <Link
                                                    key={user.id}
                                                    href={`/profile/${user.id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 p-3 hover:bg-surface-secondary transition-colors"
                                                >
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-accent-dark">
                                                        <Image
                                                            src={user.profileImage || '/default-avatar.png'}
                                                            alt={user.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-primary">{user.name}</div>
                                                        <div className="text-sm text-text-secondary">@{user.username}</div>
                                                        {user.location && (
                                                            <div className="text-xs text-text-secondary">{user.location}</div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-text-secondary">
                                                        {user._count.items} items
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Items Results */}
                                    {searchResults?.items && searchResults.items.length > 0 && (selectedFilter === 'all' || selectedFilter === 'items') && (
                                        <div className="border-b border-accent-dark">
                                            <div className="px-4 py-2 bg-surface-secondary text-sm font-medium text-text-secondary">
                                                Items ({searchResults.items.length})
                                            </div>
                                            {searchResults.items.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={`/profile/item/${item.id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 p-3 hover:bg-surface-secondary transition-colors"
                                                >
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-accent-dark">
                                                        <Image
                                                            src={item.images[0]?.url || '/default-item.png'}
                                                            alt={item.item_name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-primary">{item.item_name}</div>
                                                        <div className="text-sm text-text-secondary">
                                                            by @{item.user.username}
                                                        </div>
                                                        {item.item_condition && (
                                                            <div className="text-xs text-text-secondary">
                                                                Condition: {item.item_condition}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Swap Demands Results */}
                                    {searchResults?.demands && searchResults.demands.length > 0 && (selectedFilter === 'all' || selectedFilter === 'demands') && (
                                        <div>
                                            <div className="px-4 py-2 bg-surface-secondary text-sm font-medium text-text-secondary">
                                                Swap Demands ({searchResults.demands.length})
                                            </div>
                                            {searchResults.demands.map((demand) => (
                                                <Link
                                                    key={demand.id}
                                                    href={`/profile/item/${demand.id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 p-3 hover:bg-surface-secondary transition-colors"
                                                >
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-accent-dark">
                                                        <Image
                                                            src={demand.images[0]?.url || '/default-item.png'}
                                                            alt={demand.item_name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-primary">{demand.item_name}</div>
                                                        <div className="text-sm text-warning">
                                                            Wants: {demand.swap_demand}
                                                        </div>
                                                        <div className="text-xs text-text-secondary">
                                                            by @{demand.user.username}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </section>
    );
}