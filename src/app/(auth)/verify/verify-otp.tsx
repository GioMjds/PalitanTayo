"use client";

import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { POST } from "@/utils/axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function VerifyOTPPage() {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");
    const [isCooldown, setIsCooldown] = useState<boolean>(false);
    const [cooldownTime, setCooldownTime] = useState<number>(0);
    
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const registerData = localStorage.getItem("registerData");
            if (registerData) {
                setEmail(registerData);
            } else {
                router.push("/register");
            }
        }
    }, [router]);

    const verifyMutation = useMutation({
        mutationFn: async (otpCode: string) => {
            const response = await POST({
                url: "/auth?action=verify_otp",
                data: {
                    email: email,
                    otp: otpCode
                },
                config: {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            });
            return response.data;
        },
        onSuccess: () => {
            localStorage.removeItem("registerData");
            router.push("/");
        },
        onError: (error: any) => {
            setError(error.response?.data?.error || "Invalid OTP. Please try again.");
            setOtp(new Array(6).fill(""));
            inputRefs.current[0]?.focus();
        }
    });

    // Handle OTP resend mutation
    const resendMutation = useMutation({
        mutationFn: async () => {
            const response = await POST({
                url: "/auth?action=resend_otp",
                data: { email },
                config: {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            });
            return response.data;
        },
        onSuccess: () => {
            setError(null);
            setCooldownTime(60); // 1 minute cooldown
            setIsCooldown(true);
        },
        onError: (error: any) => {
            setError(error.response?.data?.error || "Failed to resend OTP. Please try again.");
        }
    });

    // Handle cooldown timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCooldown && cooldownTime > 0) {
            timer = setTimeout(() => {
                setCooldownTime(prev => prev - 1);
            }, 1000);
        } else if (cooldownTime === 0) {
            setIsCooldown(false);
        }
        return () => clearTimeout(timer);
    }, [isCooldown, cooldownTime]);

    const formatCooldownTime = () => {
        const minutes = Math.floor(cooldownTime / 60);
        const seconds = cooldownTime % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const handleChange = (index: number, value: string) => {
        if (/^[0-9]$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < 5) inputRefs.current[index + 1]?.focus();
        } else if (value === "") {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
        const newOtp = [...otp];
        pasteData.split("").forEach((char, i) => {
            if (i < 6 && /^[0-9]$/.test(char)) {
                newOtp[i] = char;
            }
        });
        setOtp(newOtp);
        const lastFilledIndex = pasteData.split("").findIndex(c => !c) - 1;
        inputRefs.current[Math.min(5, lastFilledIndex)]?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length === 6) {
            verifyMutation.mutate(otpCode);
        }
    };

    if (!email) {
        return null; // Or loading spinner
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
            {/* Back button */}
            <Link
                href="/register"
                className="absolute top-6 left-6 flex items-center text-link hover:text-primary transition-colors"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Register
            </Link>

            {/* OTP Verification Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Verify Your Email</h1>
                    <p className="text-text-secondary">
                        We've sent a 6-digit code to <span className="font-semibold">{email}</span>
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 p-3 bg-error/10 text-error rounded-lg text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-3">
                        {otp.map((value, i) => (
                            <input
                                key={i}
                                ref={el => (inputRefs.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={value}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                onPaste={handlePaste}
                                disabled={verifyMutation.isPending}
                                className="input-field w-12 h-16 text-center text-2xl font-medium"
                            />
                        ))}
                    </div>

                    <motion.button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={otp.some(digit => !digit) || verifyMutation.isPending}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {verifyMutation.isPending ? "Verifying..." : "Verify Account"}
                    </motion.button>
                </form>

                <div className="mt-6 text-center text-sm text-text-secondary">
                    Didn't receive a code?{" "}
                    {isCooldown ? (
                        <span className="text-text-secondary/70">
                            Resend available in {formatCooldownTime()}
                        </span>
                    ) : (
                        <button
                            onClick={() => resendMutation.mutate()}
                            disabled={resendMutation.isPending || isCooldown}
                            className="text-link font-medium inline-flex items-center"
                        >
                            <FontAwesomeIcon icon={faRotateRight} className="mr-1" />
                            {resendMutation.isPending ? "Sending..." : "Resend Code"}
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Background blobs */}
            <motion.div
                className="blob blob-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}
            />
            <motion.div
                className="blob blob-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.2, 1],
                    rotate: [0, -180, -360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}
            />
        </div>
    );
}