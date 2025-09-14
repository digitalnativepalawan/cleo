import React, { useState, useEffect, useRef } from 'react';
// Fix: Corrected import path for the Currency type.
import type { Currency } from '../src/types/index.ts';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';
import SocialLinks from './SocialLinksBar';
import { KeyIcon } from './icons/KeyIcon';
import { NewspaperIcon } from './icons/NewspaperIcon';
import { GitHubIcon } from './icons/GitHubIcon';

const currencies: Currency[] = ['PHP', 'USD', 'EUR'];

const MobileNav: React.FC<{ 
    isOpen: boolean, 
    onClose: () => void,
    selectedCurrency: Currency,
    setSelectedCurrency: (currency: Currency) => void,
    onPortalClick: () => void,
    onBlogClick: () => void,
}> = ({ isOpen, onClose, selectedCurrency, setSelectedCurrency, onPortalClick, onBlogClick }) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const mobileNavLinks = [
        {
            name: 'Blog',
            icon: <NewspaperIcon className="h-6 w-6 text-gray-500" />,
            action: () => { onBlogClick(); onClose(); },
            isExternal: false,
        },
        {
            name: 'Investor Portal',
            icon: <KeyIcon className="h-6 w-6 text-gray-500" />,
            action: () => { onPortalClick(); onClose(); },
            isExternal: false,
        },
        {
            name: 'GitHub',
            icon: <GitHubIcon className="h-6 w-6 text-gray-500" />,
            href: 'https://github.com/digitalnativepalawan/cleo',
            isExternal: true,
        }
    ];

    return (
        <div 
            className={`fixed inset-0 z-50 bg-white/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="font-semibold">Navigation</span>
                        <button onClick={onClose} aria-label="Close menu" className="p-2 -mr-2"><XIcon /></button>
                    </div>
                    <nav className="flex-grow p-4">
                        <ul className="space-y-2">
                             {mobileNavLinks.map((item) => (
                                <li key={item.name}>
                                    {item.isExternal && item.href ? (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={onClose}
                                            className="flex items-center w-full text-lg font-medium text-gray-700 hover:bg-gray-100 p-3 rounded-md transition-colors"
                                        >
                                            {item.icon}
                                            <span className="ml-3">{item.name}</span>
                                        </a>
                                    ) : (
                                        <button
                                            onClick={item.action}
                                            className="flex items-center w-full text-lg font-medium text-gray-700 hover:bg-gray-100 p-3 rounded-md transition-colors"
                                        >
                                            {item.icon}
                                            <span className="ml-3">{item.name}</span>
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="p-4 border-t">
                        <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Currency</h4>
                         <div className="flex space-x-2">
                            {currencies.map(currency => (
                                <button
                                    key={currency}
                                    onClick={() => setSelectedCurrency(currency)}
                                    className={`flex-1 py-2 text-base rounded-md border transition-colors ${selectedCurrency === currency ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    {currency}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t">
                        <SocialLinks />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Header: React.FC<{ 
    selectedCurrency: Currency, 
    setSelectedCurrency: (currency: Currency) => void,
    onPortalButtonClick: () => void,
    onBlogButtonClick: () => void
}> = ({ selectedCurrency, setSelectedCurrency, onPortalButtonClick, onBlogButtonClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    useEffect(() => {
        const timerId = setInterval(() => setCurrentDateTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    // Set timezone to Manila (PHT, UTC+8)
    const manilaTimeOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    const manilaDateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', manilaDateOptions).format(currentDateTime);

    const timeString = new Intl.DateTimeFormat('en-US', manilaTimeOptions).format(currentDateTime);
    const [timePart, ampmPart] = timeString.replace(/\u202f/g, ' ').split(' '); // Handle potential narrow no-break space
    const [displayHours, displayMinutes] = timePart.split(':');
    const ampm = ampmPart;

    return (
        <>
            <header role="banner" className={`sticky top-0 z-40 bg-white/95 backdrop-blur-lg transition-all duration-300 ${isScrolled ? 'shadow-lg h-20 md:h-24' : 'h-24 md:h-28 border-b border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full">
                    <div className="flex items-center justify-between h-full">
                        {/* Left Spacer */}
                        <div className="flex-1">
                            {/* Can be used for a logo in the future */}
                        </div>

                        {/* Centered Digital Clock */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="font-sans tabular-nums tracking-tight text-3xl md:text-4xl font-semibold text-gray-900 flex items-baseline" aria-live="polite">
                                <span>{displayHours}</span>
                                <span className="blinking-colon mx-1 text-2xl md:text-3xl relative top-[-2px]">:</span>
                                <span>{displayMinutes}</span>
                                <span className="text-base md:text-xl ml-2 font-sans font-medium">{ampm}</span>
                            </div>
                            <div className="font-sans text-xs md:text-sm font-medium text-gray-600 mt-1" aria-label={`Date is ${formattedDate}`}>
                                {formattedDate}
                            </div>
                        </div>

                        {/* Right Controls */}
                        <div className="flex-1 flex justify-end items-center space-x-2 sm:space-x-4">
                            {/* Desktop Blog Button */}
                            <div className="hidden md:block">
                                <button 
                                    onClick={onBlogButtonClick} 
                                    aria-label="Blog"
                                    className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-100 px-3 py-1.5 text-base font-medium text-gray-700 rounded-full transition-all duration-200"
                                >
                                    <NewspaperIcon className="h-4 w-4 text-gray-500" />
                                    <span>Blog</span>
                                </button>
                            </div>

                            {/* Desktop Portal Button */}
                            <div className="hidden md:block">
                                <button 
                                    onClick={onPortalButtonClick} 
                                    aria-label="Investor Portal"
                                    className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-100 px-3 py-1.5 text-base font-medium text-gray-700 rounded-full transition-all duration-200"
                                >
                                    <KeyIcon className="h-4 w-4 text-gray-500" />
                                    <span>Portal</span>
                                </button>
                            </div>

                            {/* Desktop GitHub Button */}
                             <div className="hidden md:block">
                                <a
                                    href="https://github.com/digitalnativepalawan/cleo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="View source on GitHub"
                                    className="flex items-center justify-center w-9 h-9 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-full transition-all duration-200"
                                >
                                    <GitHubIcon className="h-4 w-4 text-gray-500" />
                                </a>
                            </div>

                            {/* Desktop Currency Dropdown */}
                            <div className="hidden md:block" ref={dropdownRef}>
                                <div className="relative">
                                     <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-haspopup="true" aria-expanded={isDropdownOpen} className="flex items-center space-x-1 border border-gray-300 hover:bg-gray-100 px-3 py-1.5 text-base font-medium text-gray-700 rounded-full transition-all duration-200">
                                        <span>{selectedCurrency}</span>
                                        <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-28 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10" role="menu">
                                            {currencies.map(currency => (
                                                <button key={currency} onClick={() => { setSelectedCurrency(currency); setIsDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${selectedCurrency === currency ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`} role="menuitem">
                                                    {currency}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Mobile Hamburger Menu */}
                            <div className="md:hidden">
                                <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu" className="p-2"><MenuIcon /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <MobileNav 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                onPortalClick={onPortalButtonClick}
                onBlogClick={onBlogButtonClick}
            />
        </>
    );
};

export default Header;