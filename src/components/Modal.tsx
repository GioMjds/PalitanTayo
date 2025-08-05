'use client';

import { AnimatePresence, motion } from "framer-motion";
import { FC, MouseEvent, ReactNode, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ModalProps {
    icon?: string | ReactNode | IconProp;
    title: string;
    description?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    cancelText?: string;
    confirmText?: string;
    className?: string;
    isOpen: boolean;
    loading: boolean;
    loadingText?: string;
}

const Modal: FC<ModalProps> = ({
    icon,
    title,
    description,
    onCancel,
    onConfirm,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    className = '',
    isOpen,
    loading,
    loadingText = 'Loading...',
}) => {
    const cancel = useCallback(() => {
        onCancel?.();
    }, [onCancel]);

    const confirm = useCallback(() => {
        onConfirm?.();
    }, [onConfirm]);

    const backdropClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget) cancel();
    };

    useEffect(() => {
        const keyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") cancel();
        };

        if (isOpen) window.addEventListener("keydown", keyDown);
        return () => window.removeEventListener("keydown", keyDown);
    }, [isOpen, cancel]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={backdropClick}
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                        className={`bg-surface-primary rounded-xl shadow-xl max-w-md w-full overflow-hidden ${className}`}
                    >
                        {/* Header */}
                        <div className="p-6 pb-4">
                            <div className="flex items-start gap-4">
                                {icon && (
                                    <div className="text-secondary mt-1">
                                        {typeof icon === 'object' ? (
                                            <FontAwesomeIcon icon={icon as IconProp} className="w-5 h-5" />
                                        ) : (
                                            icon
                                        )}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-primary">{title}</h3>
                                    {description && (
                                        <p className="mt-2 text-text-secondary">{description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="px-6 pb-6 flex items-center gap-3 text-secondary">
                                <FontAwesomeIcon
                                    icon={faCircleNotch}
                                    className="w-4 h-4 animate-spin"
                                />
                                <span>{loadingText}</span>
                            </div>
                        )}

                        {/* Footer */}
                        {!loading && (
                            <div className="bg-surface-secondary px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={cancel}
                                    className="btn btn-outline px-4 py-2 text-sm"
                                    disabled={loading}
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={confirm}
                                    className="btn btn-primary px-4 py-2 text-sm"
                                    disabled={loading}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;