"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { POST } from "@/utils/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            email: "",
            username: "",
            password: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await POST({
                url: "/auth?action=login",
                data,
            });
            return response;
        },
        onSuccess: () => {
            router.push("/");
        },
        onError: (error: any) => {
            setError("root", {
                type: "manual",
                message: error.response?.data?.error || "Login failed",
            });
        },
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="card">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
                        <p className="text-text-secondary">Login to your Palitan Tayo account</p>
                    </div>

                    {errors.root && (
                        <div className="mb-4 p-3 bg-error/10 text-error rounded-lg text-sm">
                            {errors.root.message}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                                Email or Username
                            </label>
                            <input
                                id="email"
                                className="input-field"
                                placeholder="Enter your email or username"
                                {...register("email", {
                                    required: "Email or username is required",
                                })}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-error">{errors.email.message}</p>
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
                                placeholder="Enter your password"
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-border-default rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                                    Remember me
                                </label>
                            </div>
                            <Link href="/forgot-password" className="text-sm text-link">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-link font-medium">
                            Register here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}