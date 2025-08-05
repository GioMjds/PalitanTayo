"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { POST } from "@/utils/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    const sendOtpMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await POST({
                url: "/auth?action=send_register_otp",
                data,
            });
            return response;
        },
        onSuccess: (data) => {
            router.push(`/verify-otp?email=${data.email}`);
        },
        onError: (error: any) => {
            setError("root", {
                type: "manual",
                message: error.response?.data?.error || "Registration failed",
            });
        },
    });

    const onSubmit = handleSubmit((data) => {
        sendOtpMutation.mutate(data);
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="card">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
                        <p className="text-text-secondary">Join Palitan Tayo today</p>
                    </div>

                    {errors.root && (
                        <div className="mb-4 p-3 bg-error/10 text-error rounded-lg text-sm">
                            {errors.root.message}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
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
                            </div>

                            <div>
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
                            </div>
                        </div>

                        <div>
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
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
                                Username
                            </label>
                            <input
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
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="input-field"
                                placeholder="Create a password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-error">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="input-field"
                                placeholder="Confirm your password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === watch("password") || "Passwords do not match",
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={sendOtpMutation.isPending}
                        >
                            {sendOtpMutation.isPending ? "Sending OTP..." : "Register"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Already have an account?{" "}
                        <Link href="/login" className="text-link font-medium">
                            Login here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}