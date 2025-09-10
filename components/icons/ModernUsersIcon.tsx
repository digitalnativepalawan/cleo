import React from 'react';
export const ModernUsersIcon: React.FC<{className?: string}> = ({className = "h-10 w-10"}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="usersGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#0A84FF" />
            </linearGradient>
        </defs>
        <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="url(#usersGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="url(#usersGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21V19C22.9992 16.872 21.3235 15.2132 19.222 15.03" stroke="url(#usersGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13C16.5262 3.047 17.0683 3 17.618 3C19.4754 3 21.1415 4.10372 22 5.66" stroke="url(#usersGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);