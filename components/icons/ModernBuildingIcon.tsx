import React from 'react';
export const ModernBuildingIcon: React.FC<{className?: string}> = ({className = "h-10 w-10"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="buildingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#0A84FF" />
            </linearGradient>
        </defs>
        <path d="M4 21V4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V21H4Z" stroke="url(#buildingGrad)" strokeWidth="1.5"/>
        <path d="M9 16V12" stroke="url(#buildingGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 16V12" stroke="url(#buildingGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 9V7" stroke="url(#buildingGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 9V7" stroke="url(#buildingGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 21H20" stroke="url(#buildingGrad)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);