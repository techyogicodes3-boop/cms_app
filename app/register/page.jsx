"use client";

import { useState } from "react";
import { Check, CheckCircle2, Eye, EyeOff, Heart, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API_ENDPOINTS, getApiUrl } from "../../constants/api";
import AuthGuard from "../../components/auth/AuthGuard";
import ChocotraillAuthShell from "../../components/auth/ChocotraillAuthShell";
import { getRoleRedirectPath, persistAuthSession } from "../../utils/authStorage";
import api from "../../utils/axios";

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkPasswordStrength = (pwd) => {
        if (!pwd) {
            return { strength: "none", score: 0, color: "bg-slate-200", text: "" };
        }

        let score = 0;
        if (pwd.length >= 8) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[a-z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[!@#$%^&*]/.test(pwd)) score += 1;

        if (score <= 2) {
            return { strength: "weak", score, color: "bg-red-500", text: "Weak" };
        }

        if (score <= 4) {
            return { strength: "medium", score, color: "bg-amber-500", text: "Medium" };
        }

        return { strength: "strong", score, color: "bg-emerald-500", text: "Strong" };
    };

    const strengthWidthClass = {
        0: "w-0",
        1: "w-1/5",
        2: "w-2/5",
        3: "w-3/5",
        4: "w-4/5",
        5: "w-full",
    };

    const passwordStrength = checkPasswordStrength(password);
    const passwordMatch = confirmPassword && password === confirmPassword;
    const passwordMismatch = confirmPassword && password !== confirmPassword;
    const emailInvalid = email && !email.includes("@");
    const nameBorder = fullName.trim()
        ? "border-[#6D9B72] focus:border-[#6D9B72] focus:ring-[#6D9B72]/15"
        : "border-[#E8D8CC] focus:border-[#D85C6B] focus:ring-[#E9B8B0]/35";
    const emailBorder = emailInvalid
        ? "border-[#D95C5C] focus:border-[#D95C5C] focus:ring-[#D95C5C]/15"
        : email.trim()
            ? "border-[#6D9B72] focus:border-[#6D9B72] focus:ring-[#6D9B72]/15"
            : "border-[#E8D8CC] focus:border-[#D85C6B] focus:ring-[#E9B8B0]/35";
    const passwordBorder = password && passwordStrength.strength !== "weak" && passwordStrength.strength !== "none"
        ? "border-[#6D9B72] focus:border-[#6D9B72] focus:ring-[#6D9B72]/15"
        : password
            ? "border-[#D95C5C] focus:border-[#D95C5C] focus:ring-[#D95C5C]/15"
            : "border-[#E8D8CC] focus:border-[#D85C6B] focus:ring-[#E9B8B0]/35";
    const confirmBorder = passwordMismatch
        ? "border-[#D95C5C] focus:border-[#D95C5C] focus:ring-[#D95C5C]/15"
        : passwordMatch
            ? "border-[#6D9B72] focus:border-[#6D9B72] focus:ring-[#6D9B72]/15"
            : "border-[#E8D8CC] focus:border-[#D85C6B] focus:ring-[#E9B8B0]/35";
    const inputBase =
        "h-12 w-full rounded-lg border bg-[#FFFCF8] pl-11 text-sm text-[#2E1A14] outline-none transition placeholder:text-[#9B837B] focus:ring-4";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        if (!fullName.trim()) {
            toast.error("Please enter your full name");
            return;
        }

        if (!email.trim() || !email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (passwordStrength.strength === "weak" || passwordStrength.strength === "none") {
            toast.error("Please create a stronger password with at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match. Please check and try again");
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading("Creating your account...");

        try {
            const response = await api.post(
                getApiUrl(API_ENDPOINTS.REGISTER),
                {
                    name: fullName.trim(),
                    email: email.trim(),
                    password,
                }
            );

            const data = response.data;

            if ((response.status === 200 || response.status === 201) && data.success) {
                if (!persistAuthSession({ token: data?.data?.token, user: data?.data?.user })) {
                    toast.dismiss(loadingToast);
                    toast.error("Account created, but login failed because the account role is invalid.");
                    return;
                }

                toast.dismiss(loadingToast);
                toast.success("Account created successfully");
                window.dispatchEvent(new Event("token-changed"));

                setTimeout(() => {
                    router.replace(getRoleRedirectPath(data.data.user.role));
                }, 1200);
            } else {
                toast.dismiss(loadingToast);
                toast.error(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            toast.dismiss(loadingToast);

            if (error.response) {
                const errorData = error.response.data;
                const message = errorData?.message || "Registration failed. Please try again.";

                if (error.response.status === 400 && message.toLowerCase().includes("email") && message.toLowerCase().includes("exist")) {
                    toast.error("This email is already registered.");
                } else if (error.response.status === 422) {
                    toast.error("Please check your input fields and try again.");
                } else {
                    toast.error(message);
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection and try again.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthGuard guestOnly>
        <ChocotraillAuthShell active="register">
                <div className="mb-5">
                    <h1 className="brand-serif flex items-center gap-2 text-3xl font-bold leading-none text-[#2E1A14]">
                        Create your account
                        <Heart className="h-5 w-5 fill-[#D85C6B] text-[#D85C6B]" aria-hidden="true" />
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-[#7A625A]">Sign up to save addresses!</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-[#2E1A14]">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A625A]" aria-hidden="true" />
                            <input
                                id="fullName"
                                type="text"
                                required
                                autoComplete="name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className={`${inputBase} ${nameBorder} pr-4`}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#2E1A14]">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A625A]" aria-hidden="true" />
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                aria-invalid={!!emailInvalid}
                                className={`${inputBase} ${emailBorder} pr-4`}
                            />
                        </div>
                        {emailInvalid && <p className="mt-1.5 text-xs font-medium text-[#D95C5C]">Enter a valid email address.</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#2E1A14]">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A625A]" aria-hidden="true" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a strong password"
                                aria-invalid={passwordStrength.strength === "weak"}
                                className={`${inputBase} ${passwordBorder} pr-12`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#7A625A] transition hover:bg-[#F6ECDD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D85C6B]"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                            </button>
                        </div>

                        {password && (
                            <div className="mt-3">
                                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-[#7A625A]">
                                    <span>Password strength</span>
                                    <span className={passwordStrength.strength === "weak" ? "text-[#D95C5C]" : passwordStrength.strength === "strong" ? "text-[#6D9B72]" : "text-[#C89A4B]"}>
                                        {passwordStrength.text}
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-[#F6ECDD]">
                                    <div className={`h-full rounded-full ${passwordStrength.color} ${strengthWidthClass[passwordStrength.score]} transition-all`} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-[#2E1A14]">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A625A]" aria-hidden="true" />
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your password"
                                aria-invalid={!!passwordMismatch}
                                className={`${inputBase} ${confirmBorder} pr-12`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-[#7A625A] transition hover:bg-[#F6ECDD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D85C6B]"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                            </button>
                        </div>

                        {passwordMatch && (
                            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#6D9B72]">
                                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                Passwords match
                            </p>
                        )}
                        {passwordMismatch && <p className="mt-2 text-xs font-medium text-[#D95C5C]">Passwords do not match</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#D85C6B] px-4 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_28px_rgba(216,92,107,0.28)] transition hover:bg-[#4A2318] hover:shadow-[0_14px_34px_rgba(74,35,24,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D85C6B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <span>{isLoading ? "Creating account..." : "Register"}</span>
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[#2E1A14]">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-[#D85C6B] transition hover:text-[#4A2318]">
                        Login
                    </Link>
                </p>
        </ChocotraillAuthShell>
        </AuthGuard>
    );
}
