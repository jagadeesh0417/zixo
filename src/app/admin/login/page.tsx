"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiLock, FiUser, FiShield, FiEye, FiEyeOff, FiBox } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem("admin_token", data.token);
        }
        toast.success("Welcome back, Admin!");
        router.push("/admin");
      } else {
        toast.error(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("[LOGIN] Network error:", err);
      toast.error("Connection error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="w-full max-w-md"
      >
        <div className="bg-[#120A07] backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-2xl border border-[#D4AF37]/20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/20 mb-4">
              <FiBox className="text-[#D4AF37] text-3xl" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-[#D4AF37] tracking-wide">
              ZIXO
            </h1>
            <p className="text-[#D4AF37]/80 text-sm mt-1 font-medium tracking-widest uppercase">
              Admin Panel
            </p>
          </motion.div>

          <h2 className="text-[#F8F4EE] text-xl font-semibold mb-2 text-center">
            Admin Login
          </h2>
          <p className="text-[#D4AF37]/60 text-xs text-center mb-6">
            Demo: <span className="text-[#D4AF37]">zixocookies@gmail.com</span> / <span className="text-[#D4AF37]">123456</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#F8F4EE]/80 text-sm font-medium mb-1.5">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F8F4EE]/40 text-lg" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  placeholder="zixocookies@gmail.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#0A0503] border border-[#D4AF37]/20 rounded-xl text-[#F8F4EE] placeholder:text-[#F8F4EE]/30 focus:outline-none focus:border-[#D4AF37] focus:bg-[#120A07] transition-all"
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-[#F8F4EE]/80 text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F8F4EE]/40 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3 bg-[#0A0503] border border-[#D4AF37]/20 rounded-xl text-[#F8F4EE] placeholder:text-[#F8F4EE]/30 focus:outline-none focus:border-[#D4AF37] focus:bg-[#120A07] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F8F4EE]/40 hover:text-[#F8F4EE]/70 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D4AF37]/20 bg-[#0A0503] accent-[#D4AF37] cursor-pointer"
                />
                <span className="text-[#F8F4EE]/60 text-sm group-hover:text-[#F8F4EE]/80 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => toast("Contact super admin", { icon: "🔒" })}
                className="text-[#D4AF37]/70 hover:text-[#D4AF37] text-sm transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-3 rounded-xl font-semibold text-[#0A0503] text-base transition-all flex items-center justify-center gap-2 ${
                loading
                  ? "bg-[#D4AF37]/60 cursor-not-allowed"
                  : "bg-[#D4AF37] hover:bg-[#D4AF37]/90 hover:shadow-lg hover:shadow-[#D4AF37]/25"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <FiShield size={18} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#D4AF37]/10 text-center">
            <Link
              href="/"
              className="text-[#F8F4EE]/50 hover:text-[#F8F4EE]/80 text-sm transition-colors"
            >
              &larr; Back to website
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
