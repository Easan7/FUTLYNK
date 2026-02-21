/**
 * Login Page - Cyberpunk Athleticism Design
 * First page users see, simple login without credentials
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { LogIn, Zap } from "lucide-react";
import wallpaperImage from "@/assets/images/wallpaper.jpg";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      localStorage.setItem("futlynk_authenticated", "true");
      window.location.href = "/";
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Hero Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={wallpaperImage}
          alt="Futsal court"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        {/* Logo & Branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#39ff14]/10 border-2 border-[#39ff14] mb-4">
            <Zap className="w-12 h-12 text-[#39ff14]" />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Fut<span className="text-[#39ff14]">Lynk</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-sm mx-auto">
            Connect. Play. Compete.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#39ff14]" />
              <span>Skill-Balanced</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-700" />
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>AI Matching</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 text-center space-y-2">
            <div className="text-3xl font-bold text-[#39ff14]">10K+</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Players</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 text-center space-y-2">
            <div className="text-3xl font-bold text-cyan-400">500+</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Games</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 text-center space-y-2">
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Active</div>
          </div>
        </div>

        {/* Login Button */}
        <div className="w-full max-w-md space-y-4">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-4 bg-[#39ff14] text-black rounded-lg font-bold text-lg hover:bg-[#2de00f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                <span>Enter FutLynk</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-600">
            No credentials required • Instant access
          </p>
        </div>

        {/* Diagonal Accent */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-tr from-[#39ff14]/5 to-transparent pointer-events-none" 
             style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 50%, 0 100%)" }} 
        />
      </div>
    </div>
  );
}
