'use client';

import { AnimatePresence, motion } from "framer-motion";
import { FC, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCircleExclamation,
    faTriangleExclamation,
    faCircleInfo,
    faXmark
} from "@fortawesome/free-solid-svg-icons";

enum ToastType {
    success = "success",
    error = "error",
    warning = "warning",
    info = "info"
}

interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number; // Duration in milliseconds
    onClose?: () => void;
}

const Toast: FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const toastConfig = {
        success: {
            icon: faCircleCheck,
            bg: 'bg-success',
            text: 'text-text-inverted',
            border: 'border-success/50',
        },
        error: {
            icon: faCircleExclamation,
            bg: 'bg-error',
            text: 'text-text-inverted',
            border: 'border-error/50',
        },
        warning: {
            icon: faTriangleExclamation,
            bg: 'bg-warning',
            text: 'text-primary',
            border: 'border-warning/50',
        },
        info: {
            icon: faCircleInfo,
            bg: 'bg-secondary',
            text: 'text-primary',
            border: 'border-secondary/50',
        },
    };

    const { icon, bg, text, border } = toastConfig[type];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`fixed bottom-6 right-6 z-50 min-w-64 max-w-sm p-4 rounded-lg shadow-lg border ${bg} ${text} ${border}`}
                >
                    <div className="flex items-start gap-3">
                        <FontAwesomeIcon
                            icon={icon}
                            className={`text-xl mt-0.5 ${text}`}
                        />
                        <div className="flex-1">
                            <p className="font-medium">{message}</p>
                        </div>
                        <button
                            onClick={() => {
                                setIsVisible(false);
                                onClose?.();
                            }}
                            className={`p-1 rounded-full hover:bg-black/10 ${text}`}
                            aria-label="Close toast"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    {duration > 0 && (
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: duration / 1000, ease: 'linear' }}
                            className="h-1 bg-black/10 mt-2 rounded-full"
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Toast