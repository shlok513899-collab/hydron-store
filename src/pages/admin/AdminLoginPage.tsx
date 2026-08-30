import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, AlertTriangle, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onReturnHome: () => void;
  onNavigateToCustomerAuth?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onReturnHome,
  onNavigateToCustomerAuth,
}) => {
  const { loginAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMessage('Please enter both administrator email and password.');
      return;
    }

    setLoading(true);

    try {
      await loginAdmin(cleanEmail, cleanPass);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(
        err.message ||
        'Warning: Invalid Administrator Credentials. Access is restricted to authorized personnel only.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden select-none">
      
      {/* Background Accent Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Return to Storefront button */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <button
          onClick={onReturnHome}
          className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO STOREFRONT</span>
        </button>

        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          SECURE PORTAL
        </span>
      </div>

      {/* Main Admin Login Card */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 shadow-2xl rounded-none overflow-hidden text-left z-10">
        
        {/* Header Branding */}
        <div className="bg-black p-8 text-center space-y-3 border-b border-zinc-800">
          <div className="flex justify-center">
            <Logo variant="light" size="lg" showText={true} />
          </div>
          <div className="pt-2">
            <h1 className="text-sm font-black tracking-[0.25em] text-white uppercase font-heading">
              ADMIN LOGIN
            </h1>
            <p className="text-[11px] text-zinc-400 font-mono tracking-wider mt-1 uppercase">
              INTERNAL STORE MANAGEMENT & CMS
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Warning / Error Alert for Invalid Credentials */}
          {errorMessage && (
            <div className="p-4 bg-red-950/70 border border-red-800/80 text-red-200 text-xs flex items-start gap-3 animate-in fade-in">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-red-300 uppercase tracking-wide font-mono text-[11px]">
                  AUTHENTICATION FAILED
                </p>
                <p className="leading-relaxed text-[11px] text-red-200">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Standard Security Notice */}
          <div className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-400 text-[11px] flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Restricted management console. Unauthorized login attempts are strictly prohibited and monitored.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 font-heading">
                Administrator Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@hydron.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full text-xs bg-black border border-zinc-800 text-white placeholder:text-zinc-600 p-3 pl-10 focus:outline-hidden focus:border-white font-mono"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Admin Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 font-heading">
                Security Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full text-xs bg-black border border-zinc-800 text-white placeholder:text-zinc-600 p-3 pl-10 pr-10 focus:outline-hidden focus:border-white font-mono"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-3.5 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer font-heading shadow-lg"
            >
              <span>{loading ? 'VERIFYING CREDENTIALS...' : 'LOGIN TO ADMIN CONSOLE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Customer Redirect Option */}
          {onNavigateToCustomerAuth && (
            <div className="pt-4 border-t border-zinc-800 text-center">
              <p className="text-xs text-zinc-500">
                Are you a customer?{' '}
                <button
                  onClick={onNavigateToCustomerAuth}
                  className="text-white hover:underline font-bold transition-colors cursor-pointer"
                >
                  Go to Customer Sign In
                </button>
              </p>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-4 bg-black border-t border-zinc-800 text-[11px] font-mono text-zinc-500 text-center">
          Hydron Admin Gateway • Strict Role-Based Access Control
        </div>
      </div>
    </div>
  );
};
