import React from 'react';

export const SolarPanelIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
);