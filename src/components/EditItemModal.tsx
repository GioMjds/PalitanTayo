'use client';

import { FC, useState, useEffect } from "react";
import { PUT } from "@/utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCircleNotch, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { QueryClient, useMutation } from "@tanstack/react-query";
import Image from "next/image";

interface EditItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    queryClient: QueryClient;
    userId: string;
    onSuccess: () => void;
}

type FormValues = {
    item_name: string;
    description: string;
    item_condition: string;
    swap_demand: string;
    photos: FileList;
};

const EditItemModal: FC<EditItemModalProps> = ({ isOpen, onClose, item , queryClient, userId, onSuccess }) => {
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormValues>();

    useEffect(() => {
        if (item) {
            setValue('item_name', item.item_name);
            setValue('description', item.description || '');
            setValue('item_condition', item.item_condition || '');
            setValue('swap_demand', item.swap_demand);
            setPreviewImages(item.photos || []);
        }
    }, [item, setValue]);

    const editItemMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await PUT({
                url: `/item/${item.id}`,
                data: formData,
                config: {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userDetails', userId] });
            onSuccess();
            reset();
            setPreviewImages([]);
        },
        onError: (error) => {
            console.error(`Error updating item: ${error}`);
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newPreviewUrls = files.map(file => URL.createObjectURL(file));
            setPreviewImages(newPreviewUrls.slice(0, 5));
        }
    };

    const removeImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FormValues) => {
        const formData = new FormData();

        formData.append('item_name', data.item_name);
        formData.append('description', data.description || '');
        formData.append('item_condition', data.item_condition || '');
        formData.append('swap_demand', data.swap_demand);

        if (data.photos && data.photos.length > 0) {
            Array.from(data.photos).forEach((file) => {
                formData.append('photos', file);
            });
        }

        editItemMutation.mutate(formData);
    };

    const handleClose = () => {
        reset();
        setPreviewImages([]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                        className="bg-surface-primary rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-accent-dark">
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faEdit} className="text-secondary w-5 h-5" />
                                <h2 className="text-2xl font-bold text-primary">Edit Item</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-text-secondary hover:text-primary transition-colors"
                                disabled={editItemMutation.isPending}
                            >
                                <FontAwesomeIcon icon={faX} className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                            <div>
                                <label htmlFor="item_name" className="block text-sm font-medium text-text-secondary mb-1">
                                    Item Name *
                                </label>
                                <input
                                    id="item_name"
                                    type="text"
                                    {...register('item_name', { required: 'Item name is required' })}
                                    className="input-field w-full"
                                    placeholder="Enter item name"
                                    disabled={editItemMutation.isPending}
                                />
                                {errors.item_name && (
                                    <p className="mt-1 text-sm text-error">{errors.item_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    {...register('description')}
                                    className="input-field resize-none w-full min-h-[100px]"
                                    placeholder="Describe your item (condition, features, etc.)"
                                    disabled={editItemMutation.isPending}
                                />
                            </div>

                            <div>
                                <label htmlFor="item_condition" className="block text-sm font-medium text-text-secondary mb-1">
                                    Condition
                                </label>
                                <input
                                    id="item_condition"
                                    {...register('item_condition')}
                                    className="input-field w-full"
                                    disabled={editItemMutation.isPending}
                                />
                            </div>

                            <div>
                                <label htmlFor="swap_demand" className="block text-sm font-medium text-text-secondary mb-1">
                                    Swap Demand
                                </label>
                                <input
                                    id="swap_demand"
                                    type="text"
                                    min="1"
                                    {...register('swap_demand', {
                                        required: 'Swap demand is required',
                                    })}
                                    className="input-field w-full"
                                    disabled={editItemMutation.isPending}
                                />
                                {errors.swap_demand && (
                                    <p className="mt-1 text-sm text-error">{errors.swap_demand.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Photos
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    {...register('photos')}
                                    onChange={handleImageChange}
                                    className="input-field w-full"
                                    disabled={editItemMutation.isPending}
                                />
                                
                                {/* Current/Preview Images */}
                                {previewImages.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                        {previewImages.map((src, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={src}
                                                    alt={`Preview ${index + 1}`}
                                                    width={150}
                                                    height={150}
                                                    className="object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                    disabled={editItemMutation.isPending}
                                                >
                                                    <FontAwesomeIcon icon={faX} className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-4 pt-4 border-t border-accent-dark">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="btn btn-outline px-6 py-2"
                                    disabled={editItemMutation.isPending}
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    type="submit"
                                    className="btn btn-primary px-6 py-2 flex items-center gap-2"
                                    disabled={editItemMutation.isPending}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {editItemMutation.isPending ? (
                                        <>
                                            <FontAwesomeIcon icon={faCircleNotch} className="w-4 h-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                                            Update Item
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditItemModal;