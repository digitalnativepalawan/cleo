import React from 'react';

export const CraneIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 21h16M12 21V3H4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7l8-4m-8 4l-4 2" />
        <circle cx="20" cy="7" r="2" />
    </svg>
);
// A more representative Crane Icon
export const CraneIcon2: React.FC = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-8" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4h16z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3m0 0l-3 3m3-3l3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8" />
    </svg>
);