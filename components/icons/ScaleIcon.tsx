import React from 'react';

export const ScaleIcon: React.FC = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-8" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-6 4h12l-6-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7l-4 2v1h8V9l-4-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7l4 2v1h-8V9l4-2z" />
    </svg>
);