import React, { useState } from 'react';
import { User, Mail, Phone, Lock, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';

interface AuthPageProps {
  onSuccess: () => void;
  onNavigateToAdmin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onNavigateToAdmin }) => {
  const { login, register, error, clearError } = useAuth();
  
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLocalError('Invalid email format. Please enter a valid email address.');
      return;
    }

    if (cleanPassword.length < 6) {
      setLocalError('Invalid credentials: Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'REGISTER') {
        if (!name.trim()) {
          setLocalError('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (!mobile.trim() || mobile.trim().length < 8) {
          setLocalError('Please enter a valid mobile number for WhatsApp delivery updates.');
          setLoading(false);
          return;
        }
        await register(name.trim(), cleanEmail, mobile.trim(), cleanPassword);
      } else {
        await login(cleanEmail, cleanPassword);
      }
      onSuccess();
    } catch (err: any) {
      setLocalError(
        err.message?.includes('auth/invalid-credential') || err.message?.includes('auth/wrong-password') || err.message?.includes('auth/user-not-found')
          ? 'Warning: Invalid email or password. Please check your credentials and try again.'
          : err.message || 'Warning: Authentication failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f7f9] flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      
      {/* Container */}
      <div className="w-full max-w-md bg-white border border-zinc-300 shadow-xl overflow-hidden text-left">
        
        {/* Header Branding */}
        <div className="bg-black text-white p-6 sm:p-8 text-center space-y-3">
          <div className="flex justify-center">
            <Logo variant="light" size="lg" showText={true} />
          </div>
          <p className="text-xs text-zinc-400 font-mono tracking-widest uppercase">
            {mode === 'LOGIN' ? 'CUSTOMER ACCESS PORTAL' : 'CREATE HYDRON ACCOUNT'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 border-b border-zinc-200 text-xs font-bold uppercase tracking-wider font-heading">
          <button
            onClick={() => {
              setMode('LOGIN');
              setLocalError(null);
              clearError();
            }}
            className={`py-3.5 text-center transition-colors cursor-pointer ${
              mode === 'LOGIN'
                ? 'bg-white text-black border-b-2 border-black'
                : 'bg-zinc-50 text-zinc-400 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('REGISTER');
              setLocalError(null);
              clearError();
            }}
            className={`py-3.5 text-center transition-colors cursor-pointer ${
              mode === 'REGISTER'
                ? 'bg-white text-black border-b-2 border-black'
                : 'bg-zinc-50 text-zinc-400 hover:text-black'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Warning / Error Alert */}
          {(localError || error) && (
            <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-red-900 uppercase font-mono text-[11px]">Notice & Warning</p>
                <p className="leading-relaxed">{localError || error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'REGISTER' && (
              <>
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1 font-heading">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arjun Sharma"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (localError) setLocalError(null);
                      }}
                      className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 pl-9 focus:outline-hidden focus:border-black"
                    />
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1 font-heading">
                    Mobile Phone (WhatsApp) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        if (localError) setLocalError(null);
                      }}
                      className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 pl-9 focus:outline-hidden focus:border-black font-mono"
                    />
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1 font-heading">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@hydron.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 pl-9 focus:outline-hidden focus:border-black font-mono"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1 font-heading">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  className="w-full text-xs bg-zinc-50 border border-zinc-300 p-2.5 pl-9 focus:outline-hidden focus:border-black"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-3.5 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md font-heading"
            >
              <span>{loading ? 'VERIFYING...' : mode === 'LOGIN' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Admin Login Link */}
          <div className="pt-4 border-t border-zinc-200 text-center">
            <p className="text-xs text-zinc-500">
              Hydron Staff & Management?{' '}
              <button 
                onClick={onNavigateToAdmin} 
                className="text-black font-bold hover:underline transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Go to Admin Login</span>
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 text-[11px] font-mono text-zinc-400 text-center">
          Hydron Client ID Encryption • AES-256
        </div>
      </div>
    </div>
  );
};
