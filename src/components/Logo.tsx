import React from 'react';
import { useApp } from '../context/AppContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'light' }) => {
  const { navigate } = useApp();

  const heightClass =
    size === 'lg'
      ? 'h-10 sm:h-12'
      : size === 'sm'
      ? 'h-7 sm:h-8'
      : 'h-8 sm:h-9';

  const logoSrc = variant === 'dark' ? '/logo-horizontal-white.png' : '/logo-horizontal.png';

  return (
    <button
      id="btn-header-logo"
      onClick={() => navigate('/')}
      className={`inline-flex items-center group cursor-pointer text-left focus:outline-none transition-transform active:scale-95 ${className}`}
      aria-label="SNABTASH Bosh sahifa"
    >
      <img
        src={logoSrc}
        alt="SNABTASH"
        className={`${heightClass} w-auto object-contain transition-all drop-shadow-2xs`}
      />
    </button>
  );
};
