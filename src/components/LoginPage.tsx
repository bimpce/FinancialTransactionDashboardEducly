import React, { useState } from 'react';
import {
  Wallet,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  KeyRound,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-purple-900 selection:text-white">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-purple-600 items-center justify-center text-white shadow-xl shadow-purple-950/70 border border-purple-400/30 mb-4">
            <Wallet className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Sign in to access your transaction records and analytics
          </p>
        </div>

        {/* Configuration Notice if Supabase environment variables are missing */}
/*
        {!isConfigured && (
          <div className="mb-6 p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs text-purple-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span className="font-semibold block text-white">Supabase Auth Setup</span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                To connect your live Supabase project, provide <span className="font-mono text-purple-300">VITE_SUPABASE_URL</span> and <span className="font-mono text-purple-300">VITE_SUPABASE_ANON_KEY</span> in Settings.
              </p>
              <p className="text-zinc-400 text-[11px]">
                * Preview mode is enabled: you can enter any test email & password to sign in and explore the dashboard immediately.
              </p>
            </div>
          </div>
        )}
*/
        {/* Login Box */}
        <div className="rounded-2xl bg-zinc-900/90 border border-purple-900/40 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800/80">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" />
              Sign In
            </h2>
            <span className="text-[11px] font-medium text-purple-300/80 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-800/40">
              Supabase Protected
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              id="login-error-alert"
              className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="sign-in-button"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-950/60 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>

          {/* Access Note (No Public Registration) */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
            <p className="text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Private Access &bull; Accounts are provisioned manually</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
