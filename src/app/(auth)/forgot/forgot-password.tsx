'use client';

import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { isValidEmail, isValidPassword } from "@/utils/regex";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { POST } from "@/utils/axios";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PasswordValidation } from "@/types/CustomerAuth";
import PasswordTooltip from "@/components/PasswordTooltip";
import { validatePassword } from "@/utils/regex";
import {
    faEye,
    faEyeSlash,
    faEnvelope,
    faShieldHalved,
    faKey,
    faArrowLeft,
    faLock,
    faCircleCheck,
    faCheckCircle,
    faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

enum Step {
    email = "email",
    otp = "otp",
    newPassword = "newPassword"
}

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>(Step.email);
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [otpDigits, setOtpDigits] = useState<string[]>(new Array(6).fill(""));
    const [showNewPasswordTooltip, setShowNewPasswordTooltip] = useState<boolean>(false);
    const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
        isValid: false,
        hasLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });

    const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const router = useRouter();

    const emailForm = useForm({
        mode: "onBlur",
        defaultValues: { email: "" }
    });

    const otpForm = useForm({
        mode: "onBlur",
        defaultValues: { otp: "" }
    });

    const passwordForm = useForm({
        mode: "onBlur",
        defaultValues: { newPassword: "", confirmPassword: "" }
    });

    const handleOtpChange = (index: number, value: string) => {
        if (/^[0-9]$/.test(value)) {
            const newOtp = [...otpDigits];
            newOtp[index] = value;
            setOtpDigits(newOtp);
            if (index < 5) otpInputRefs.current[index + 1]?.focus();
        } else if (value === "") {
            const newOtp = [...otpDigits];
            newOtp[index] = "";
            setOtpDigits(newOtp);
        }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    }

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
        const newOtp = [...otpDigits];
        pasteData.split("").forEach((char, i) => {
            if (i < 6 && /^[0-9]$/.test(char)) newOtp[i] = char;
        });
        setOtpDigits(newOtp);
        const lastFilledIndex = pasteData.split("").findIndex(c => !c) - 1;
        otpInputRefs.current[Math.min(5, lastFilledIndex)]?.focus();
    }

    const sendOtpMutation = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            return await POST({
                url: "/auth?action=forgot_password_send_otp",
                data: { email },
                config: {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            })
        },
        onSuccess: () => {
            setStep(Step.otp);
            setEmail(emailForm.getValues("email"));
            setOtpSent(true);
            emailForm.reset();
        },
        onError: (error: any) => {
            emailForm.setError("email", { message: error.response.data?.error });
        }
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async ({ otp }: { otp: string }) => {
            return await POST({
                url: "/auth?action=forgot_password_verify_otp",
                data: { email, otp },
                config: {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            })
        },
        onSuccess: () => {
            setStep(Step.newPassword);
            setOtp(otpForm.getValues("otp"));
            otpForm.reset();
        },
        onError: (error: any) => {
            otpForm.setError("otp", { message: error.response.data?.error });
        }
    });

    const resetPasswordMutation = useMutation({
        mutationFn: async ({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }) => {
            return await POST({
                url: "/auth?action=forgot_password_reset",
                data: { email, otp, newPassword },
                config: {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            });
        },
        onSuccess: () => {
            router.push("/login");
        },
        onError: (error: any) => {
            passwordForm.setError("newPassword", { message: error.response.data?.error });
        }
    });

    const handleEmailSubmit = emailForm.handleSubmit((data) => {
        sendOtpMutation.mutate({ email: data.email });
    });

    const handleOtpSubmit = otpForm.handleSubmit(() => {
        const otpCode = otpDigits.join("");
        if (otpCode.length === 6) {
            verifyOtpMutation.mutate({ otp: otpCode });
        }
    });

    const handleNewPasswordSubmit = passwordForm.handleSubmit((data) => {
        if (data.newPassword !== data.confirmPassword) {
            passwordForm.setError("confirmPassword", { message: "Passwords do not match" });
            return;
        }

        if (!isValidPassword(data.newPassword)) {
            passwordForm.setError("newPassword", { message: "Password must be at least 8 characters long and include a mix of letters, numbers, and special characters." });
            return;
        }

        resetPasswordMutation.mutate({
            email,
            otp,
            newPassword: data.newPassword
        });
    });

    const resendOtp = () => {
        if (email) sendOtpMutation.mutate({ email });
    }

    const goBack = () => {
        if (step === Step.otp) {
            setStep(Step.email);
        } else if (step === Step.newPassword) {
            setStep(Step.otp);
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background blobs */}
            <motion.div
                className="blob blob-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.div
                className="blob blob-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.15 }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            />

            {/* Floating decorative elements */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-secondary opacity-30"
                animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full bg-primary opacity-30"
                animate={{
                    y: [0, 15, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
            />

            {/* Curvaceous design elements */}
            <motion.div
                className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-secondary opacity-50 blur-lg"
                initial={{ x: -100, y: 100 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.div
                className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-primary opacity-50 blur-lg"
                initial={{ x: 100, y: -100 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
            />

            <motion.div
                className="w-full max-w-md bg-surface-primary rounded-xl shadow-lg p-8 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Back button for OTP and Password steps */}
                {(step === Step.otp || step === Step.newPassword) && (
                    <button
                        onClick={goBack}
                        className="absolute top-6 left-6 text-text-secondary hover:text-primary transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                    </button>
                )}

                {/* Logo */}
                <motion.div
                    className="flex flex-col items-center mb-6"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Image
                        src="/palitantayo-logo.png"
                        alt="Palitan Tayo Logo"
                        width={250}
                        height={250}
                        priority
                        className="object-cover rounded-full mb-2"
                    />
                    <p className="text-sm text-text-secondary italic">
                        Where good neighbors become great traders!
                    </p>
                </motion.div>

                <h1 className="text-3xl font-bold text-center text-primary mb-2">
                    {step === Step.email && "Let's Find Your Account!"}
                    {step === Step.otp && "Security Check"}
                    {step === Step.newPassword && "Set a New Password"}
                </h1>

                <p className="text-center text-text-secondary mb-6 text-sm">
                    {step === Step.email && "Don't worry, we'll help you reset your password in a flash!"}
                    {step === Step.otp && "We've sent a secret code to your email to keep things secure"}
                    {step === Step.newPassword && "Make it strong, make it memorable, make it yours"}
                </p>

                {/* Step indicator */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center">
                        {/* Email Step */}
                        <div className={`flex flex-col items-center ${step === Step.email ? 'text-primary' : 'text-text-secondary'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === Step.email ? 'bg-primary text-text-inverted' : 'bg-surface-secondary'}`}>
                                {step !== Step.email && step !== Step.otp ? (
                                    <FontAwesomeIcon icon={faCircleCheck} className="text-success" />
                                ) : (
                                    <span>1</span>
                                )}
                            </div>
                            <span className="text-xs mt-1">Email</span>
                        </div>

                        <div className={`w-16 h-1 mx-1 ${step === Step.otp || step === Step.newPassword ? 'bg-primary' : 'bg-border-default'}`}></div>

                        {/* OTP Step */}
                        <div className={`flex flex-col items-center ${step === Step.otp ? 'text-primary' : step === Step.newPassword ? 'text-success' : 'text-text-secondary'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === Step.otp ? 'bg-primary text-text-inverted' : step === Step.newPassword ? 'bg-success text-text-inverted' : 'bg-surface-secondary'}`}>
                                {step === Step.newPassword ? (
                                    <FontAwesomeIcon icon={faCircleCheck} />
                                ) : (
                                    <span>2</span>
                                )}
                            </div>
                            <span className="text-xs mt-1">OTP</span>
                        </div>

                        <div className={`w-16 h-1 mx-1 ${step === Step.newPassword ? 'bg-primary' : 'bg-border-default'}`}></div>

                        {/* Password Step */}
                        <div className={`flex flex-col items-center ${step === Step.newPassword ? 'text-primary' : 'text-text-secondary'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === Step.newPassword ? 'bg-primary text-text-inverted' : 'bg-surface-secondary'}`}>
                                <span>3</span>
                            </div>
                            <span className="text-xs mt-1">Password</span>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === Step.email && (
                        <motion.form
                            key="email-step"
                            className="flex flex-col gap-4"
                            onSubmit={handleEmailSubmit}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="block text-md font-medium text-text-secondary mb-1">
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                    Where should we send the magic code?
                                </label>
                                <input
                                    type="email"
                                    className="input-field"
                                    placeholder="Enter your email"
                                    {...emailForm.register("email", {
                                        required: "Email is required",
                                        validate: (value) => isValidEmail(value) || "Invalid email format"
                                    })}
                                />
                                {emailForm.formState.errors.email && (
                                    <p className="mt-1 text-md text-error">
                                        {emailForm.formState.errors.email.message}
                                    </p>
                                )}
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="btn btn-primary mt-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={sendOtpMutation.isPending}
                            >
                                {sendOtpMutation.isPending ? "Sending your secret code..." : "Send Verification Code"}
                            </motion.button>

                            <div className="text-center mt-4 text-sm text-text-secondary">
                                So you may remember your account now?{' '}
                                <Link href="/login" className="text-link">Log in</Link>
                            </div>
                        </motion.form>
                    )}

                    {step === Step.otp && (
                        <motion.form
                            key="otp-step"
                            className="flex flex-col gap-4"
                            onSubmit={handleOtpSubmit}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    <FontAwesomeIcon icon={faShieldHalved} className="mr-2" />
                                    Enter your 6-Digit secret code we sent to your email
                                </label>
                                <p className="text-md text-text-secondary mb-2">
                                    Check your {email}&apos;s inbox or spam folder for the code.
                                </p>
                                <div className="flex justify-center gap-3 mb-4">
                                    {otpDigits.map((value, i) => (
                                        <>
                                            <input
                                                key={i}
                                                ref={el => { otpInputRefs.current[i] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={1}
                                                value={value}
                                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                onPaste={handleOtpPaste}
                                                disabled={verifyOtpMutation.isPending}
                                                className="input-field w-12 h-16 text-center text-2xl font-medium"
                                            />
                                        </>
                                    ))}
                                </div>
                                {otpForm.formState.errors.otp && (
                                    <p className="mt-1 text-sm text-error">
                                        {otpForm.formState.errors.otp.message}
                                    </p>
                                )}
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="btn btn-primary mt-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={otpDigits.some(digit => !digit) || verifyOtpMutation.isPending}
                            >
                                {verifyOtpMutation.isPending ? "Checking your code...." : "Proceed to Next Step"}
                            </motion.button>

                            <motion.div
                                className="text-center mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <button
                                    type="button"
                                    className="text-link text-sm cursor-pointer"
                                    onClick={resendOtp}
                                    disabled={sendOtpMutation.isPending}
                                >
                                    Didn't receive secret code? Resend OTP
                                </button>
                                {otpSent && (
                                    <p className="text-xs text-success mt-1">
                                        OTP has been resent to your email
                                    </p>
                                )}
                            </motion.div>
                        </motion.form>
                    )}

                    {step === Step.newPassword && (
                        <motion.form
                            key="password-step"
                            className="flex flex-col gap-4"
                            onSubmit={handleNewPasswordSubmit}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium text-text-secondary mb-1"
                                    onMouseEnter={() => setShowNewPasswordTooltip(true)}
                                    onMouseLeave={() => setShowNewPasswordTooltip(false)}
                                >
                                    <span><FontAwesomeIcon icon={faKey} className="mr-2" />New Password</span>
                                    <span className="float-right ml-2 align-middle">
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
                                    </span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        className="input-field pl-10"
                                        placeholder="Enter new password"
                                        {...passwordForm.register("newPassword", {
                                            required: "Password is required",
                                            onChange: (e) => setPasswordValidation(validatePassword(e.target.value))
                                        })}
                                    />
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                                    </button>
                                </div>
                                {showNewPasswordTooltip && (
                                    <PasswordTooltip validation={passwordValidation} />
                                )}
                                {passwordForm.formState.errors.newPassword && (
                                    <p className="mt-1 text-sm text-error">
                                        {passwordForm.formState.errors.newPassword.message}
                                    </p>
                                )}
                                <p className="text-xs text-text-secondary mt-1">
                                    Password must be at least 8 characters with letters, numbers, and special characters.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    <FontAwesomeIcon icon={faKey} className="mr-2" />
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="input-field pl-10"
                                        placeholder="Confirm new password"
                                        {...passwordForm.register("confirmPassword", {
                                            required: "Please confirm your password",
                                        })}
                                    />
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                                    </button>
                                </div>
                                {passwordForm.formState.errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-error">
                                        {passwordForm.formState.errors.confirmPassword.message}
                                    </p>
                                )}
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="btn btn-primary mt-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={resetPasswordMutation.isPending}
                            >
                                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    )
}