import React from 'react';
export const TrophyIcon: React.FC<{className?: string}> = ({className = "h-8 w-8"}) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-3m0 3h3m-3 0H9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18c-3.314 0-6-2.686-6-6V3h12v9c0 3.314-2.686 6-6 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9H3m15 0h3" />
    </svg>
);