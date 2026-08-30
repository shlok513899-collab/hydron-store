import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'dark', 
  showText = false, 
  size = 'md',
  className = '' 
}) => {
  const isLight = variant === 'light';
  
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg tracking-widest',
    md: 'text-xl tracking-widest',
    lg: 'text-2xl tracking-[0.2em]',
    xl: 'text-3xl tracking-[0.25em]'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Iconic Geometric Hydron "H" Mark as shown in reference */}
      <svg 
        viewBox="0 0 100 100" 
        className={`${iconSizes[size]} transition-transform duration-300 hover:scale-105`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100" height="100" rx="4" fill={isLight ? '#FFFFFF' : '#000000'} />
        {/* Geometric Left Pillar */}
        <path 
          d="M22 20H38V80H22V20Z" 
          fill={isLight ? '#000000' : '#FFFFFF'} 
        />
        {/* Geometric Right Pillar */}
        <path 
          d="M62 20H78V80H62V20Z" 
          fill={isLight ? '#000000' : '#FFFFFF'} 
        />
        {/* Dynamic Architectural Stepped Bridge */}
        <path 
          d="M38 42H62V58H38V42Z" 
          fill={isLight ? '#000000' : '#FFFFFF'} 
        />
        {/* Inverted cut detail */}
        <polygon 
          points="46,42 54,42 50,48" 
          fill={isLight ? '#FFFFFF' : '#000000'} 
        />
        <polygon 
          points="46,58 54,58 50,52" 
          fill={isLight ? '#FFFFFF' : '#000000'} 
        />
      </svg>

      {showText && (
        <span className={`font-extrabold uppercase font-heading ${textSizes[size]} ${isLight ? 'text-white' : 'text-black'}`}>
          HYDRON
        </span>
      )}
    </div>
  );
};
