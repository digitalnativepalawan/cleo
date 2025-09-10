import React from 'react';

export const UsersGroupIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={1.5}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-4.14 0-7.5 1.68-7.5 3.75v1.5h15v-1.5c0-2.07-3.36-3.75-7.5-3.75z" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15.75c0-1.035 1.283-1.95 3-2.438m10.5 2.438c1.717.488 3 1.403 3 2.438" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 8.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
);