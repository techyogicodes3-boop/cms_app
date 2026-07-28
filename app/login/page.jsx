"use client";

import { useState } from "react";
import { Eye, EyeOff, Heart, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, getApiUrl } from "../../constants/api";
import AuthGuard from "../../components/auth/AuthGuard";
import ChocotraillAuthShell from "../../components/auth/ChocotraillAuthShell";
import { getRoleRedirectPath, persistAuthSession } from "../../utils/authStorage";
import api from "../../utils/axios";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await api.post(getApiUrl(API_ENDPOINTS.LOGIN), { email: email.trim(), password });
            const json = res.data || {};

            if (!json.success) {
                setError(json?.message || json?.error || "Login failed. Please check your credentials.");
                return;
            }

            const { data } = json;
            if (data?.user?.role !== "admin") {
                setError("This login is only for admin accounts.");
                return;
            }

            if (!persistAuthSession({ token: data?.token, user: data?.user })) {
                setError("Login failed because the account role is invalid. Please contact support.");
                return;
            }

            window.dispatchEvent(new Event("token-changed"));
            router.replace(getRoleRedirectPath(data.user.role));
        } catch (err) {
            setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const inputBase =
        "h-12 w-full rounded-lg border bg-[#FFFCF8] pl-11 text-sm text-[#2E1A14] outline-none transition placeholder:text-[#9B837B] focus:ring-4";
    const emailBorder = error
        ? "border-[#D95C5C] focus:border-[#D95C5C] focus:ring-[#D95C5C]/15"
        : email.trim()
            ? "border-[#6D9B72] focus:border-[#6D9B72] focus:ring-[#6D9B72]/15"
            : "border-[#E8D8CC] focus:border-[#D85C6B] focus:ring-[#E9B8B0]/35";
    const passwordBorder = error
        ? "border-[#D95C5C] focus:border-[#D95C5C] focus:ring-[#D95C5C]/15"
        : password
            ? "border-[#6D9B72] focus:border-[#6D9B72] focus:ring-[#6D9B72]/15"
            : "border-[#E8D8CC] focus:border-[#D85C6B] focus:ring-[#E9B8B0]/35";

    return (
        <AuthGuard guestOnly>
        <ChocotraillAuthShell active="login">
                <div className="mb-5">
                    <h1 className="brand-serif flex items-center gap-2 text-3xl font-bold leading-none text-[#2E1A14]">
                        Welcome back
                        <Heart className="h-5 w-5 fill-[#D85C6B] text-[#D85C6B]" aria-hidden="true" />
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-[#7A625A]">Login to access your account!</p>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg border border-[#D95C5C]/30 bg-[#FFF0F0] px-4 py-3 text-sm font-medium text-[#D95C5C]" role="alert">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#2E1A14]">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A625A]" aria-hidden="true" />
                            <input
                                id="email"
                                name="email"
                                type="text"
                                required
                                autoComplete="username"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-invalid={!!error}
                                className={`${inputBase} ${emailBorder} pr-4`}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-semibold text-[#2E1A14]">
                            Password
                        </label>
                            
                        </div>
                        <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A625A]" aria-hidden="true" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-invalid={!!error}
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#D85C6B] px-4 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_28px_rgba(216,92,107,0.28)] transition hover:bg-[#4A2318] hover:shadow-[0_14px_34px_rgba(74,35,24,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D85C6B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <span>{loading ? "Logging in..." : "Login"}</span>
                    </button>

                </form>

                <p className="mt-5 text-center text-sm text-[#2E1A14]">
                    New admin?{" "}
                    <Link href="/register" className="font-semibold text-[#D85C6B] transition hover:text-[#4A2318]">
                        Create an account
                    </Link>
                </p>
        </ChocotraillAuthShell>
        </AuthGuard>
    );
}
