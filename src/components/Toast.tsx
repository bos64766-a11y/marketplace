import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium pointer-events-auto transition-all ${
          isSuccess
            ? 'bg-[#0B2E73] text-white border-[#08245A] shadow-[#0B2E73]/20'
            : isError
            ? 'bg-red-600 text-white border-red-700 shadow-red-500/20'
            : 'bg-[#14213D] text-white border-slate-700 shadow-slate-900/20'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#FF5A00] shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
