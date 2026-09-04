import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigate } = useApp();
  const [login, setLogin] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!login.trim()) {
      setErrorMessage('Loginni kiriting');
      return;
    }
    if (!password) {
      setErrorMessage('Parolni kiriting');
      return;
    }

    setIsLoading(true);
    const success = await loginAdmin(login, password);
    setIsLoading(false);

    if (success) {
      navigate('/admin');
    } else {
      setErrorMessage('Login yoki parol noto‘g‘ri');
    }
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 sm:p-6 font-sans antialiased"
      style={{
        background: 'radial-gradient(ellipse at 50% 45%, #FF721E 0%, #FF5E14 45%, #DE4200 100%)',
      }}
    >
      {/* Repeating vertical ribbed/striped texture across full screen */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.16) 0px,
            rgba(255, 255, 255, 0.16) 32px,
            rgba(0, 0, 0, 0.12) 32px,
            rgba(0, 0, 0, 0.12) 64px
          )`,
        }}
      />

      {/* Ambient Lighting & Glow Accents */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-black/25 blur-3xl pointer-events-none" />

      {/* Center White Login Card */}
      <div className="relative z-10 w-full max-w-[390px] bg-white rounded-[28px] p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-white/80">
        {/* Brand Logo replacing the house icon */}
        <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
          <img
            src="/logo-icon.png"
            alt="SNABTASH"
            className="w-14 h-14 object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-[22px] font-black text-[#FF5E14] tracking-tight">
            Tizimga kirish
          </h1>
          <p className="text-[11px] sm:text-xs text-[#94A3B8] mt-1 font-medium">
            SNABTASH boshqaruv paneliga xush kelibsiz
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 text-center animate-shake">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Login */}
          <div className="text-left">
            <label className="block text-xs font-bold text-[#334155] mb-1.5">
              Login
            </label>
            <input
              id="input-admin-login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Login"
              autoComplete="username"
              className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5E14] focus:bg-white text-xs sm:text-sm text-[#0F172A] font-medium transition-all focus:outline-none"
            />
          </div>

          {/* Parol */}
          <div className="text-left">
            <label className="block text-xs font-bold text-[#334155] mb-1.5">
              Parol
            </label>
            <div className="relative">
              <input
                id="input-admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full h-11 px-4 pr-11 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#FF5E14] focus:bg-white text-xs sm:text-sm text-[#0F172A] font-medium transition-all focus:outline-none"
              />
              <button
                type="button"
                id="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] p-1 cursor-pointer transition-colors"
                title={showPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="btn-admin-submit-login"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#FF5E14] hover:bg-[#E54A00] shadow-md shadow-[#FF5E14]/30 transition-all cursor-pointer active:scale-98 disabled:opacity-75 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Tizimga kirish</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
