
import React, { useState, useEffect, useRef } from 'react';
import type { Currency } from '../types/index.ts';
import { ChevronDownIcon } from '../../components/icons/ChevronDownIcon.tsx';
import { MenuIcon } from '../../components/icons/MenuIcon.tsx';
import { XIcon } from '../../components/icons/XIcon.tsx';
import SocialLinks from '../../components/SocialLinksBar.tsx';
import { KeyIcon } from '../../components/icons/KeyIcon.tsx';
import { NewspaperIcon } from '../../components/icons/NewspaperIcon.tsx';
import { GitHubIcon } from '../../components/icons/GitHubIcon.tsx';

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

    return (
        <div 
            className={`fixed inset-0 z-[60] bg-white/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
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
                             <li>
                                <button 
                                    onClick={() => { onBlogClick(); onClose(); }} 
                                    className="flex items-center w-full text-lg font-medium text-gray-700 hover:bg-gray-100 p-3 rounded-md transition-colors"
                                >
                                    <NewspaperIcon className="h-6 w-6 text-gray-500" />
                                    <span className="ml-3">Blog</span>
                                </button>
                            </li>
                             <li>
                                <button 
                                    onClick={() => { onPortalClick(); onClose(); }} 
                                    className="flex items-center w-full text-lg font-medium text-gray-700 hover:bg-gray-100 p-3 rounded-md transition-colors"
                                >
                                    <KeyIcon className="h-6 w-6 text-gray-500" />
                                    <span className="ml-3">Investor Portal</span>
                                </button>
                            </li>
                            <li>
                                <a 
                                    href="https://github.com/digitalnativepalawan/palawan-tourism-ecosystem"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={onClose}
                                    className="flex items-center w-full text-lg font-medium text-gray-700 hover:bg-gray-100 p-3 rounded-md transition-colors"
                                >
                                    <GitHubIcon className="h-6 w-6 text-gray-500" />
                                    <span className="ml-3">GitHub</span>
                                </a>
                            </li>
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
    onBlogButtonClick: () => void,
    onHomeButtonClick: () => void,
}> = ({ selectedCurrency, setSelectedCurrency, onPortalButtonClick, onBlogButtonClick, onHomeButtonClick }) => {
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
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }, [isMenuOpen]);

    useEffect(() => {
        const timerId = setInterval(() => setCurrentDateTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

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
    const [timePart, ampmPart] = timeString.replace(/\u202f/g, ' ').split(' ');
    const [displayHours, displayMinutes] = timePart.split(':');
    const ampm = ampmPart;

    return (
        <>
            {/* Top Fixed Clock Bar */}
            <div className="fixed top-0 left-0 right-0 h-10 bg-gray-50/95 backdrop-blur-sm z-50 flex items-center justify-center border-b border-gray-200/80">
                <div className="flex items-center space-x-4">
                    <div className="font-sans tabular-nums tracking-tight text-lg font-semibold text-gray-900 flex items-baseline" aria-live="polite">
                        <span>{displayHours}</span>
                        <span className="blinking-colon mx-0.5 text-base relative top-[-1px]">:</span>
                        <span>{displayMinutes}</span>
                        <span className="text-xs ml-1.5 font-sans font-medium">{ampm}</span>
                    </div>
                    <div className="hidden sm:block font-sans text-[11px] font-medium text-gray-600" aria-label={`Date is ${formattedDate}`}>
                        {formattedDate}
                    </div>
                </div>
            </div>
            
            <header role="banner" className={`sticky z-40 bg-white/95 backdrop-blur-lg transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : 'border-b border-gray-200'}`} style={{ top: '2.5rem' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20">
                    <div className="flex items-center justify-between h-full">
                        {/* Left: Brand Name */}
                        <div className="flex-shrink-0">
                            <button onClick={onHomeButtonClick} className="text-lg font-semibold text-gray-800 hover:text-gray-900 transition-colors">
                               Cleopatra × Binga
                            </button>
                        </div>

                        {/* Right Controls */}
                        <div className="flex justify-end items-center space-x-2 sm:space-x-4">
                            {/* Desktop Controls */}
                            <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
                                <button 
                                    onClick={onBlogButtonClick} 
                                    aria-label="Blog"
                                    className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-100 px-3 py-1.5 text-base font-medium text-gray-700 rounded-full transition-all duration-200"
                                >
                                    <NewspaperIcon className="h-4 w-4 text-gray-500" />
                                    <span>Blog</span>
                                </button>
                                <button 
                                    onClick={onPortalButtonClick} 
                                    aria-label="Investor Portal"
                                    className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-100 px-3 py-1.5 text-base font-medium text-gray-700 rounded-full transition-all duration-200"
                                >
                                    <KeyIcon className="h-4 w-4 text-gray-500" />
                                    <span>Portal</span>
                                </button>
                                <a
                                    href="https://github.com/digitalnativepalawan/palawan-tourism-ecosystem"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="View source on GitHub"
                                    className="flex items-center justify-center w-9 h-9 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-full transition-all duration-200"
                                >
                                    <GitHubIcon className="h-4 w-4 text-gray-500" />
                                </a>
                                <div ref={dropdownRef}>
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
