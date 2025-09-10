import React from 'react';

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 18v3m-3-3h6"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v3m4.243 1.757l-2.122 2.121M3.757 8.757l2.122 2.121m12.364 0l-2.121-2.121M3.757 15.243l2.121-2.121"
      />
    </svg>
);