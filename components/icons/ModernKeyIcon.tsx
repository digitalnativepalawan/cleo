import React from 'react';
export const ModernKeyIcon: React.FC<{className?: string}> = ({className = "h-10 w-10"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="keyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#0A84FF" />
            </linearGradient>
        </defs>
        <path d="M15.6569 8.34315C18.0001 10.6863 18.0001 14.5637 15.6569 16.9069C13.3138 19.25 9.43634 19.25 7.09318 16.9069C4.74999 14.5637 4.74999 10.6863 7.09318 8.34315C9.43634 6 13.3138 6 15.6569 8.34315Z" stroke="url(#keyGrad)" strokeWidth="1.5" />
        <path d="M11 11L5 17" stroke="url(#keyGrad)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 14L4 17L2 19" stroke="url(#keyGrad)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);