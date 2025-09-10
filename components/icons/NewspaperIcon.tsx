import React from 'react';

export const NewspaperIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4 12H9M7 16h6M7 12h6m0-5H9.5a1.5 1.5 0 000 3h.01" 
        />
    </svg>
);
