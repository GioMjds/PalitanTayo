"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { POST } from "@/utils/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface LoginForm {
    identifier: string; // Can be email or username
    password: string;
}

const blobVariants = {
    initial: {
        opacity: 0,
        scale: 0.8
    },
    animate: {
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear" as const,
            repeatType: "loop" as const
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            when: "beforeChildren"
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5
        }
    }
};

export default function Login() {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginForm>({
        mode: "onBlur",
    });

    const mutation = useMutation({
        mutationFn: async (data: LoginForm) => {
            const response = await POST({
                url: "/auth?action=login",
                data: {
                    identifier: data.identifier,
                    password: data.password,
                },
                config: {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            });
            return response.data;
        },
        onSuccess: () => {
            router.push("/");
        },
        onError: (error: any) => {
            setError("root", {
                type: "manual",
                message: error.response?.data?.error,
            });
        },
    });

    const onSubmit: SubmitHandler<LoginForm> = (data) => mutation.mutate(data);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative"
            >
                {/* Animated Blobs Background */}
                <motion.div
                    className="blob blob-1"
                    variants={blobVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                />
                <motion.div
                    className="blob blob-2"
                    variants={blobVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                />

                <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
                    {/* Logo Section with Curvaceous Design */}
                    <motion.div
                        className="hidden md:flex flex-1 justify-center relative"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="max-w-lg relative">
                            <Image
                                src="/palitantayo-logo.png"
                                alt="Palitan Tayo Logo"
                                width={500}
                                height={500}
                                className="object-contain z-10 relative"
                            />
                            <motion.div
                                className="absolute -z-10 w-full h-full top-0 left-0"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.3 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            >
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill="var(--color-secondary)"
                                        d="M45.2,-58.2C58.2,-46.2,68.1,-30.7,70.7,-14.3C73.3,2.1,68.6,19.4,56.9,32.5C45.2,45.6,26.5,54.5,6.9,51.9C-12.7,49.3,-32.3,35.1,-44.7,18.6C-57.1,2.1,-62.4,-16.7,-55.7,-31.8C-49,-46.9,-31.4,-58.3,-14.3,-65.2C2.8,-72.1,19.8,-74.5,32.2,-67.1C44.6,-59.7,52.3,-42.5,45.2,-58.2Z"
                                        transform="translate(100 100)"
                                    />
                                </svg>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Form Section with Curvaceous Divider */}
                    <motion.div
                        className="flex-1 max-w-lg w-full"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="card relative overflow-hidden">
                            <motion.div variants={itemVariants} className="text-center mb-8">
                                <h1 className="text-4xl font-bold text-primary mb-2">Welcome Back</h1>
                                <p className="text-lg text-text-secondary">Login to your Palitan Tayo account</p>
                            </motion.div>

                            {errors.root && (
                                <motion.div
                                    variants={itemVariants}
                                    className="mb-4 p-3 bg-error/10 text-error rounded-lg text-sm"
                                >
                                    {errors.root.message}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="identifier" className="block text-lg font-medium text-text-secondary mb-1">
                                        Email or Username
                                    </label>
                                    <input
                                        id="text"
                                        className="input-field"
                                        placeholder="Enter your email or username"
                                        {...register("identifier", {
                                            required: "Email or username is required",
                                        })}
                                    />
                                    {errors.identifier && (
                                        <p className="mt-1 text-sm text-error">{errors.identifier.message}</p>
                                    )}
                                </motion.div>

                                <motion.div variants={itemVariants} className="relative">
                                    <label htmlFor="password" className="block text-lg font-medium text-text-secondary mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="input-field"
                                        placeholder="Enter your password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters",
                                            },
                                        })}
                                    />
                                    <motion.button
                                        type="button"
                                        className="absolute cursor-pointer right-3 top-2/3 transform -translate-y-1/3 text-text-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="xl" />
                                    </motion.button>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-error">{errors.password.message}</p>
                                    )}
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-primary focus:ring-primary border-border-default rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-lg text-text-secondary">
                                            Remember me
                                        </label>
                                    </div>
                                    <Link href="/forgot" className="text-lg text-link">
                                        Forgot password?
                                    </Link>
                                </motion.div>

                                <motion.button
                                    variants={itemVariants}
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={mutation.isPending}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FontAwesomeIcon icon={faDoorOpen} className="mr-2" />
                                    {mutation.isPending ? "Logging in..." : "Login"}
                                </motion.button>
                            </form>

                            <motion.div variants={itemVariants} className="mt-6 text-center text-lg text-text-secondary">
                                Don't have an account?{" "}
                                <Link href="/register" className="text-link font-medium">
                                    Register here
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}