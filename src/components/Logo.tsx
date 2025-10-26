import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-lg overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <span 
        className="text-white font-bold text-2xl"
        style={{ 
          fontSize: size * 0.5,
        }}
      >
        P
      </span>
    </div>
  );
};

export default Logo;

