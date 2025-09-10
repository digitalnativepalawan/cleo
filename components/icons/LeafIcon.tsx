import React from 'react';

export const LeafIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.162 2.548 7.71 6.138 9.177" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m0-20c0 5.523-4.477 10-10 10" />
    </svg>
);