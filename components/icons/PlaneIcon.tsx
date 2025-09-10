import React from 'react';

export const PlaneIcon: React.FC<{className?: string}> = ({className = "h-10 w-10"}) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 3L3 10.5l7.5 2.5M21 3l-8.5 18L10.5 13" />
    </svg>
);