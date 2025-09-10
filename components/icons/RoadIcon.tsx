import React from 'react';
export const RoadIcon: React.FC<{className?: string}> = ({className = "h-8 w-8"}) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10"/>
        <path d="M14 2h3.5A2.5 2.5 0 0 1 20 4.5v15"/>
        <path d="M12 2v20"/>
    </svg>
);