'use client';

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FC, ReactNode, memo, useCallback, useEffect, useRef, useState } from "react";

interface DropdownItem {
    label: string;
    onClick?: () => void;
    icon?: ReactNode;
}

interface DropdownProps {
    userDetails?: {
        name: string;
        email: string;
        username: string;
        profileImage?: string | null;
    }
    options: DropdownItem[];
    position?: "top" | "bottom" | "left" | "right";
    children?: ReactNode;
}

const Dropdown: FC<DropdownProps> = ({ options, userDetails, position = "bottom", children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const optionClick = useCallback((onClick?: () => void) => {
        if (onClick) onClick();
        setIsOpen(false);
    }, []);

    useEffect(() => {
        const clickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", clickOutside);
        return () => document.removeEventListener("mousedown", clickOutside);
    }, []);

    let dropdownClasses: string;

    switch (position) {
        case "top":
            dropdownClasses = "absolute left-0 bottom-full mb-2";
            break;
        case "left":
            dropdownClasses = "absolute right-full mr-2 top-0";
            break;
        case "right":
            dropdownClasses = "absolute left-full ml-2 top-0";
            break;
        case "bottom":
        default:
            dropdownClasses = "absolute right-2 mt-2";
            break;
    }

    return (
        <section className="relative inline-block" ref={dropdownRef}>
            <div onClick={toggle} className="cursor-pointer">
                {children}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.2 }}
                        className={`${dropdownClasses} bg-surface-primary rounded-lg shadow-lg z-50 overflow-hidden w-56`}
                    >
                        {/* User profile section */}
                        {userDetails && (
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-accent-dark bg-surface-secondary">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-secondary">
                                    {userDetails.profileImage ? (
                                        <Image
                                            src={userDetails.profileImage}
                                            alt={userDetails.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                                            <span className="text-primary font-bold">
                                                {userDetails.name?.charAt(0).toUpperCase() ||
                                                    userDetails.email?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-semibold text-primary truncate">
                                        {userDetails.name || userDetails.username}
                                    </span>
                                    <span className="text-sm text-text-secondary truncate">
                                        {userDetails.email}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Dropdown options */}
                        <ul className="py-1">
                            {options.map((option, index) => (
                                <li key={`${option.label}-${index}`}>
                                    <button
                                        className="flex w-full items-center px-4 py-2 text-md cursor-pointer font-medium hover:bg-surface-secondary text-left transition-colors"
                                        onClick={() => optionClick(option.onClick)}
                                    >
                                        {option.icon && (
                                            <span className="mr-2 text-secondary">{option.icon}</span>
                                        )}
                                        <span className="text-primary">{option.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default memo(Dropdown);