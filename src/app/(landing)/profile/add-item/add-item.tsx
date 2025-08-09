'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { POST } from "@/utils/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";

type FormValues = {
    item_name: string;
    description: string;
    item_condition: string;
    swap_demand: string;
    photos: FileList;
};

type ItemResponse = {
    item?: {
        userId?: string
    };
};

export default function AddItemPage() {
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const router = useRouter();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        mode: "onBlur"
    });

    const mutation = useMutation<ItemResponse, unknown, FormData>({
        mutationFn: async (formData: FormData) => {
            const response = await POST({
                url: '/item',
                data: formData,
                config: {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            });
            return response as ItemResponse;
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['userItems'] });
            reset();
            setPreviewImages([]);
            const userId = response?.item?.userId;
            if (userId) router.push(`/profile/${userId}`);
            else router.push('/profile');
        },
        onError: (error) => {
            console.error(`Error adding item: ${error}`);
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newPreviewUrls = files.map(file => URL.createObjectURL(file));
            setPreviewImages(prev => [...prev, ...newPreviewUrls].slice(0, 5));
        }
    };

    const removeImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        const formData = new FormData();

        formData.append('item_name', data.item_name);
        formData.append('description', data.description || '');
        formData.append('item_condition', data.item_condition || '');
        formData.append('swap_demand', data.swap_demand || '');

        // Append each photo
        if (data.photos && data.photos.length > 0) {
            Array.from(data.photos).forEach((file) => {
                formData.append(`photos`, file);
            });
        }

        try {
            await mutation.mutateAsync(formData);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container min-h-screen mx-auto px-4 py-8 mt-20">
            <h1 className="text-4xl text-center font-bold text-primary">Add New Item</h1>

            <div className="bg-surface-primary rounded-xl p-6 w-full max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        />
                    </div>

                    <div>
                        <label htmlFor="item_condition" className="block text-sm font-medium text-text-secondary mb-1">
                            Condition
                        </label>
                        <input
                            type="text"
                            id="item_condition"
                            {...register('item_condition', { required: 'Item condition is required' })}
                            className="input-field w-full"
                        />
                        {errors.item_condition && (
                            <p className="mt-1 text-sm text-error">{errors.item_condition.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="item_condition" className="block text-sm font-medium text-text-secondary mb-1">
                            Swap Demand
                        </label>
                        <input
                            type="text"
                            id="swap_demand"
                            {...register('swap_demand', { required: 'Swap demand is required' })}
                            className="input-field w-full"
                        />
                        {errors.swap_demand && (
                            <p className="mt-1 text-sm text-error">{errors.swap_demand.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Photos
                        </label>
                        <div className="flex flex-col gap-4">
                            <div className="relative border-2 border-dashed border-border-default rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    id="photos"
                                    accept="image/*"
                                    multiple
                                    {...register('photos')}
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={previewImages.length >= 5}
                                />
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <FontAwesomeIcon icon={faUpload} size="lg" />
                                    <p className="text-sm text-text-secondary">
                                        {previewImages.length > 0
                                            ? 'Add more photos (up to 5)'
                                            : 'Click to upload photos'}
                                    </p>
                                </div>
                            </div>  

                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {previewImages.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <Image
                                                src={img}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-md"
                                                width={96}
                                                height={96}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FontAwesomeIcon icon={faTrash} size="xs" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                        <motion.button
                            type="submit"
                            className={`btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2 
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? (
                                'Adding...'
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} />
                                    Add Item
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </div>
        </main>
    );
}