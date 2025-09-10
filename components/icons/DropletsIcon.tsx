import React from 'react';
export const DropletsIcon: React.FC<{className?: string}> = ({className = "h-8 w-8"}) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a9.7 9.7 0 006.5-16.5A9.7 9.7 0 005.5 5.5 9.7 9.7 0 0012 22z" />
    </svg>
);