import React from 'react';

export const TaxCutIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 16l-4-4" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <circle cx="15.5" cy="15.5" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 5L5 19" />
    </svg>
);