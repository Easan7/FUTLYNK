/**
 * Login Page - Modern Split-Screen Design
 * Unique UI with gradient mesh, floating labels, and asymmetric layout
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Mail, Lock } from "lucide-react";
import wallpaperImage from "@/assets/images/wallpaper.jpg";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Accept any credentials
    setTimeout(() => {
      localStorage.setItem("futlynk_authenticated", "true");
      window.location.href = "/";
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
        <div className="absolute inset-0">
          <img
            src={wallpaperImage}
            alt="Futsal"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/20 via-transparent to-cyan-500/20" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="space-y-6">
            <div className="inline-block">
              <h1 className="text-6xl font-bold mb-2">
                Fut<span className="text-[#39ff14]">Lynk</span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-[#39ff14] to-cyan-400 rounded-full" />
            </div>
            
            <p className="text-2xl text-gray-300 max-w-md leading-relaxed">
              Connect with players. Find your game. Elevate your futsal experience.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#39ff14]">10K+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Active Players</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-cyan-400">500+</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Weekly Games</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#0a0a0a]">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#39ff14]/10 border-2 border-[#39ff14] mb-3">
              <svg className="w-8 h-8 text-[#39ff14]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Fut<span className="text-[#39ff14]">Lynk</span>
            </h1>
            <p className="text-sm text-gray-400">Welcome back</p>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Sign in</h2>
            <p className="text-sm sm:text-base text-gray-400">Enter any credentials to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#39ff14] transition-colors" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or username"
                className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border-2 border-[#2a2a2a] rounded-xl text-white placeholder:text-gray-600 focus:border-[#39ff14] focus:outline-none transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#39ff14] transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border-2 border-[#2a2a2a] rounded-xl text-white placeholder:text-gray-600 focus:border-[#39ff14] focus:outline-none transition-all"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#2a2a2a] bg-[#1a1a1a] text-[#39ff14] focus:ring-[#39ff14] focus:ring-offset-0"
                />
                Remember me
              </label>
              <button type="button" className="text-[#39ff14] hover:text-[#2de00f] transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#39ff14] to-[#2de00f] text-black rounded-xl font-bold text-base sm:text-lg hover:shadow-lg hover:shadow-[#39ff14]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a2a]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0a0a] text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="py-3 px-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white hover:bg-[#222222] hover:border-[#39ff14] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="py-3 px-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white hover:bg-[#222222] hover:border-[#39ff14] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <button type="button" className="text-[#39ff14] hover:text-[#2de00f] font-medium transition-colors">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
