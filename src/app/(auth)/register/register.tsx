"use client";

import PasswordTooltip from "@/components/PasswordTooltip";
import { PasswordValidation } from "@/types/CustomerAuth";
import { POST } from "@/utils/axios";
import { isValidPassword, validatePassword } from "@/utils/regex";
import { faCheckCircle, faEye, faEyeSlash, faTimesCircle, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface RegisterResponse {
    email?: string;
    message?: string;
    error?: string;
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

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [showPasswordTooltip, setShowPasswordTooltip] = useState<boolean>(false);
    const [showConfirmPasswordTooltip, setShowConfirmPasswordTooltip] = useState<boolean>(false);
    const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
        isValid: false,
        hasLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
    } = useForm<RegisterForm>();

    const passwordValue = watch("password");
    const confirmPasswordValue = watch("confirmPassword");

    const sendOtpMutation = useMutation({
        mutationFn: async (data: RegisterForm) => {
            const response = await POST({
                url: "/auth?action=send_register_otp",
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    username: data.username,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                },
                config: {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            });
            return response as RegisterResponse;
        },
        onSuccess: (response: RegisterResponse) => {
            if (response?.email) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("registerData", response.email);
                }
                router.push('/verify');
            }
        },
        onError: (error: any) => {
            setError("root", {
                type: "manual",
                message: error.response?.data?.error || "Registration failed",
            });
        },
    });

    const onSubmit: SubmitHandler<RegisterForm> = (data) => sendOtpMutation.mutate(data);

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
                    animate="animate"
                />
                <motion.div
                    className="blob blob-2"
                    variants={blobVariants}
                    animate="animate"
                />

                <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
                    <motion.div
                        className="flex-1 max-w-lg w-full"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="card relative overflow-hidden">
                            <motion.div variants={itemVariants} className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
                                <p className="text-text-secondary">Join Palitan Tayo today</p>
                            </motion.div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-text-secondary mb-1">
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            className="input-field"
                                            placeholder="First name"
                                            {...register("firstName", {
                                                required: "First name is required",
                                            })}
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-error">{errors.firstName.message}</p>
                                        )}
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-text-secondary mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            className="input-field"
                                            placeholder="Last name"
                                            {...register("lastName", {
                                                required: "Last name is required",
                                            })}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-error">{errors.lastName.message}</p>
                                        )}
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants}>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="input-field"
                                        placeholder="Enter your email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-error">{errors.email.message}</p>
                                    )}
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="input-field"
                                        placeholder="Choose a username"
                                        {...register("username", {
                                            required: "Username is required",
                                            minLength: {
                                                value: 3,
                                                message: "Username must be at least 3 characters",
                                            },
                                        })}
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-error">{errors.username.message}</p>
                                    )}
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    className="relative"
                                >
                                    <label
                                        htmlFor="password"
                                        className="flex items-center justify-between text-sm font-medium text-text-secondary mb-1"
                                        onMouseEnter={() => setShowPasswordTooltip(true)}
                                        onMouseLeave={() => setShowPasswordTooltip(false)}
                                    >
                                        <span>Password</span>
                                        {passwordValidation.isValid ? (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-success"
                                            >
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-error"
                                            >
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </motion.span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="input-field pr-10"
                                            placeholder="Create a password"
                                            {...register("password", {
                                                required: "Password is required",
                                                validate: (value) => isValidPassword(value) || "Password must be at least 10 characters and include uppercase, lowercase, number, and special character",
                                                onChange: (e) => setPasswordValidation(validatePassword(e.target.value))
                                            })}
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="xl" />
                                        </motion.button>
                                    </div>
                                    {showPasswordTooltip && (
                                        <PasswordTooltip validation={passwordValidation} />
                                    )}
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    className="relative"
                                >
                                    <label
                                        htmlFor="confirmPassword"
                                        className="flex items-center justify-between text-sm font-medium text-text-secondary mb-1"
                                        onMouseEnter={() => setShowConfirmPasswordTooltip(true)}
                                        onMouseLeave={() => setShowConfirmPasswordTooltip(false)}
                                    >
                                        <span>Confirm Password</span>
                                        {confirmPasswordValue && confirmPasswordValue === passwordValue ? (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-success"
                                            >
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-error"
                                            >
                                                <FontAwesomeIcon icon={faTimesCircle} />
                                            </motion.span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="input-field pr-10"
                                            placeholder="Confirm your password"
                                            {...register("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: (value) =>
                                                    value === watch("password") || "Passwords do not match",
                                            })}
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} size="xl" />
                                        </motion.button>
                                    </div>
                                    {showConfirmPasswordTooltip && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute z-10 mt-2 w-64 p-3 bg-surface-primary rounded-lg shadow-lg border border-accent-dark"
                                        >
                                            <div className="tooltip-arrow"></div>
                                            <h4 className="text-sm font-medium text-primary mb-2">Confirm Password:</h4>
                                            <p className={`text-sm ${confirmPasswordValue && confirmPasswordValue === passwordValue ? 'text-success' : 'text-error'}`}>
                                                {confirmPasswordValue && confirmPasswordValue === passwordValue
                                                    ? '✓ Passwords match'
                                                    : '✗ Passwords do not match'}
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>

                                <motion.button
                                    variants={itemVariants}
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={sendOtpMutation.isPending}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                                    {sendOtpMutation.isPending ? "Sending OTP..." : "Create Account"}
                                </motion.button>
                            </form>

                            <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-text-secondary">
                                Already have an account?{" "}
                                <Link href="/login" className="text-link font-medium">
                                    Login here
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                    {/* Logo Section with Curvaceous Design */}
                    <motion.div
                        className="hidden md:flex flex-1 justify-center relative"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="max-w-lg relative">
                            <Image
                                src="/palitantayo-logo.png"
                                alt="Palitan Tayo Logo"
                                width={500}
                                height={500}
                                className="object-cover z-10 relative"
                            />
                            <motion.div
                                className="absolute -z-10 w-full h-full top-0 left-0"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.3 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            >
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill="var(--color-primary)"
                                        d="M45.2,-58.2C58.2,-46.2,68.1,-30.7,70.7,-14.3C73.3,2.1,68.6,19.4,56.9,32.5C45.2,45.6,26.5,54.5,6.9,51.9C-12.7,49.3,-32.3,35.1,-44.7,18.6C-57.1,2.1,-62.4,-16.7,-55.7,-31.8C-49,-46.9,-31.4,-58.3,-14.3,-65.2C2.8,-72.1,19.8,-74.5,32.2,-67.1C44.6,-59.7,52.3,-42.5,45.2,-58.2Z"
                                        transform="translate(100 100)"
                                    />
                                </svg>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}