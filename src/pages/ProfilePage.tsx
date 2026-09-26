import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, Building2, FileText, Heart, ShoppingBag, Save, LogOut, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, requests, favorites, cartCount, navigate, t, showToast } = useApp();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [company, setCompany] = useState(profile.company);
  const [inn, setInn] = useState(profile.inn);
  const [email, setEmail] = useState(profile.email);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, company, inn, email });
    showToast(t.profilePage.savedSuccess, 'success');
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 pb-4 border-b border-[#E5EAF2]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E73] tracking-tight">
          {t.profilePage.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          {t.profilePage.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Summary Stats & Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E5EAF2] p-6 shadow-xs text-center">
            <div className="w-20 h-20 rounded-full bg-[#0B2E73] text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-lg font-bold text-[#14213D]">{profile.name}</h2>
            <p className="text-xs text-[#667085]">{profile.company || t.profilePage.b2bClient}</p>
            <p className="text-xs font-semibold text-[#0B2E73] mt-1">{profile.phone}</p>

            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-[#E5EAF2]">
              <button
                onClick={() => navigate('/requests')}
                className="p-2.5 rounded-xl bg-[#F7F9FC] hover:bg-[#FFF1E8] text-center transition-colors cursor-pointer group"
              >
                <FileText className="w-5 h-5 text-[#0B2E73] group-hover:text-[#FF5A00] mx-auto mb-1" />
                <span className="block text-xs font-bold text-[#14213D]">{requests.length}</span>
                <span className="text-[10px] text-[#667085]">{t.profilePage.requests}</span>
              </button>

              <button
                onClick={() => navigate('/favorites')}
                className="p-2.5 rounded-xl bg-[#F7F9FC] hover:bg-[#FFF1E8] text-center transition-colors cursor-pointer group"
              >
                <Heart className="w-5 h-5 text-[#0B2E73] group-hover:text-[#FF5A00] mx-auto mb-1" />
                <span className="block text-xs font-bold text-[#14213D]">{favorites.length}</span>
                <span className="text-[10px] text-[#667085]">{t.profilePage.favorites}</span>
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="p-2.5 rounded-xl bg-[#F7F9FC] hover:bg-[#FFF1E8] text-center transition-colors cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5 text-[#0B2E73] group-hover:text-[#FF5A00] mx-auto mb-1" />
                <span className="block text-xs font-bold text-[#14213D]">{cartCount}</span>
                <span className="text-[10px] text-[#667085]">{t.profilePage.inCart}</span>
              </button>
            </div>

            {/* Admin Management Shortcut */}
            <div className="mt-5 pt-5 border-t border-[#E5EAF2]">
              <button
                id="btn-profile-admin"
                onClick={() => navigate('/admin')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#081B4B] hover:bg-[#051336] text-white text-xs font-bold transition-all shadow-md shadow-[#081B4B]/20 cursor-pointer group"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF5A00] group-hover:scale-110 transition-transform" />
                <span>{t.profilePage.adminPanel}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Personal & Company Edit Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5EAF2] p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-[#0B2E73] pb-3 border-b border-[#E5EAF2] mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-[#FF5A00]" />
            <span>{t.profilePage.personalInfo}</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  {t.profilePage.fullName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#F7F9FC] text-sm text-[#14213D] border border-[#E5EAF2] focus:outline-none focus:border-[#0B2E73] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  {t.profilePage.phone}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#F7F9FC] text-sm text-[#14213D] border border-[#E5EAF2] focus:outline-none focus:border-[#0B2E73] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  {t.profilePage.company}
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#F7F9FC] text-sm text-[#14213D] border border-[#E5EAF2] focus:outline-none focus:border-[#0B2E73] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  {t.profilePage.inn}
                </label>
                <input
                  type="text"
                  value={inn}
                  onChange={(e) => setInn(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#F7F9FC] text-sm text-[#14213D] border border-[#E5EAF2] focus:outline-none focus:border-[#0B2E73] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                {t.profilePage.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#F7F9FC] text-sm text-[#14213D] border border-[#E5EAF2] focus:outline-none focus:border-[#0B2E73] focus:bg-white"
              />
            </div>

            <div className="pt-3 flex gap-3">
              <button
                id="btn-save-profile"
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0B2E73] hover:bg-[#08245A] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{t.profilePage.saveChanges}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
