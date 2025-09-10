import React from 'react';

export const PassportIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <circle cx="12" cy="10" r="3" />
        <path strokeLinecap="round" d="M8 16h8" />
    </svg>
);