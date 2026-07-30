'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Slash, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import HeroSlashPlanes from '@/components/hero/HeroSlashPlanes';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { isAuthenticated, authLoading, login, loginWithGoogle } = useAuth();
  const router = useRouter();

  // If user is already authenticated, redirect straight to /dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-In failed');
    }
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-500">Redirecting to workspace...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white flex flex-col lg:flex-row font-sans text-gray-900 selection:bg-[#635BFF]/15 selection:text-gray-900"
    >
      {/* LEFT SIDE (58% width): Reuses existing HeroSlashPlanes 3D WebGL Artwork */}
      <div className="relative lg:w-[58%] min-h-[320px] lg:min-h-screen bg-white overflow-hidden flex flex-col justify-between p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-gray-200">
        {/* Living 3D WebGL Canvas */}
        <HeroSlashPlanes />

        {/* Minimal Overlay Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center text-white shadow-xs group-hover:bg-gray-800 transition-colors">
              <Slash className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xl tracking-tight text-gray-900">
                Slash
              </span>
              <span className="text-gray-300 font-mono text-sm">/</span>
            </div>
          </Link>
        </div>

        {/* Minimal Overlay Copy */}
        <div className="relative z-10 space-y-2 my-auto max-w-md pt-8 lg:pt-0">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Welcome back.
          </h1>
          <p className="text-gray-500 text-base sm:text-lg font-normal leading-relaxed">
            Continue building beautiful links with real-time intelligence.
          </p>
        </div>

        {/* Minimal Footer Info */}
        <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-gray-400 font-medium pt-8">
          <span>© 2026 Slash SaaS Inc.</span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Operational
          </span>
        </div>
      </div>

      {/* RIGHT SIDE (42% width): Premium Authentication Panel */}
      <div className="lg:w-[42%] bg-white flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="max-w-sm w-full mx-auto my-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="text-xs text-gray-500">
              Enter your email and password below to log in.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Social Google Sign In */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-11 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-xs text-gray-400 font-medium absolute">or continue with email</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-gray-50/80 border border-gray-200 rounded-xl pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-[#635BFF] hover:underline font-semibold">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-gray-50/80 border border-gray-200 rounded-xl pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] transition-all"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#635BFF] focus:ring-[#635BFF] cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-gray-600 font-medium cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 pt-2">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-[#635BFF] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
