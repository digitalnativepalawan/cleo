import React from 'react';

export const HardHatIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 20a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.238 12.753l2.844-2.844A2 2 0 017.5 9.5h9a2 2 0 011.414.586l2.844 2.844a2 2 0 01.586 1.414V17a2 2 0 01-2 2H4a2 2 0 01-2-2v-2.833a2 2 0 01.586-1.414z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 4.5v5H9v-5z" />
    </svg>
);