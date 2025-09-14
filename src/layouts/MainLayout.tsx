import React, { ReactNode } from 'react';
import Header from './Header.tsx';
import Footer from './Footer.tsx';
import type { Currency } from '../types/index.ts';

interface MainLayoutProps {
    children: ReactNode;
    selectedCurrency: Currency;
    setSelectedCurrency: (currency: Currency) => void;
    onPortalButtonClick: () => void;
    onBlogButtonClick: () => void;
    onHomeButtonClick: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
    children, 
    selectedCurrency, 
    setSelectedCurrency, 
    onPortalButtonClick,
    onBlogButtonClick,
    onHomeButtonClick
}) => {
    return (
        <>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <Header 
                selectedCurrency={selectedCurrency} 
                setSelectedCurrency={setSelectedCurrency}
                onPortalButtonClick={onPortalButtonClick}
                onBlogButtonClick={onBlogButtonClick}
                onHomeButtonClick={onHomeButtonClick}
            />
            <main id="main-content" role="main">
                {children}
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;
