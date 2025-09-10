import React from 'react';
export const ModernPlaneIcon: React.FC<{className?: string}> = ({className = "h-10 w-10"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="planeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#0A84FF" />
            </linearGradient>
        </defs>
        <path d="M12 19L9 22L10.5 15L4 10L20 4L14 20L8.5 13.5L12 19Z" stroke="url(#planeGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);