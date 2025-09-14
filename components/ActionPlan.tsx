import React from 'react';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { CashIcon } from './icons/CashIcon';
import { HardHatIcon } from './icons/HardHatIcon';
import { HomeIcon } from './icons/HomeIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import type { Currency } from '../src/types/index.ts';

const EXCHANGE_RATES: Record<Currency, number> = { PHP: 1, USD: 1 / 58, EUR: 1 / 63 };
const CURRENCY_SYMBOLS: Record<Currency, string> = { PHP: '₱', USD: '$', EUR: '€' };

const formatCurrencyRange = (phpMin: number, phpMax: number, currency: Currency): string => {
    const rate = EXCHANGE_RATES[currency];
    const min = phpMin * rate;
    const max = phpMax * rate;

    const isMillion = min >= 1_000_000;
    const isThousand = min >= 1000 && min < 1_000_000;
    
    let displayMin = min;
    let displayMax = max;
    let suffix = '';

    if (isMillion) {
        displayMin = min / 1_000_000;
        displayMax = max / 1_000_000;
        suffix = 'M';
    } else if (isThousand) {
        displayMin = min / 1000;
        displayMax = max / 1000;
        suffix = 'k';
    }
    
    const options = {
        minimumFractionDigits: (isThousand || isMillion) ? 1 : 0,
        maximumFractionDigits: (isThousand || isMillion) ? 1 : 0,
    };

    const minFormatted = new Intl.NumberFormat('en-US', options).format(displayMin);
    const maxFormatted = new Intl.NumberFormat('en-US', options).format(displayMax);

    return `${CURRENCY_SYMBOLS[currency]}${minFormatted}–${maxFormatted}${suffix}`;
}


const WavePattern = () => (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <svg className="w-full h-full text-gray-50/60" fill="none" preserveAspectRatio="none">
            <path d="M-100,120 C150,180 300,60 550,120 S800,180 1100,120" stroke="currentColor" strokeWidth="200" strokeLinecap="round"/>
            <path d="M-50,250 C200,310 350,190 600,250 S850,310 1150,250" stroke="currentColor" strokeWidth="200" strokeLinecap="round"/>
        </svg>
    </div>
);

interface ActionPlanProps {
    currency: Currency;
    weeklyTotals: { paid: number; unpaid: number; };
}

const ActionPlan: React.FC<ActionPlanProps> = ({ currency, weeklyTotals }) => {
    const milestones = [
        {
            icon: <ClipboardCheckIcon />,
            period: "Q4 2024",
            title: "Board Approvals & Final Plan",
            description: "Finalization of business plan and securing board-level commitment."
        },
        {
            icon: <CashIcon />,
            period: "Q1-Q2 2025",
            title: <span className="tabular-nums">Pilot Raise ({formatCurrencyRange(25000000, 37500000, currency)})</span>,
            description: "Secure initial funding for pilot phase."
        },
        {
            icon: <HardHatIcon />,
            period: "2026",
            title: "First 5 Villas & Depot",
            description: "Villas operational, hardware depot launched, and initial farm plots cultivated."
        },
        {
            icon: <TrendingUpIcon />,
            period: "2028",
            title: "25+ Villas & Maturity",
            description: "Full operation, achieving a self-sustaining, integrated ecosystem."
        },
    ];

    // Simplified milestones for horizontal view
    const horizontalMilestones = [
        { icon: <ClipboardCheckIcon />, period: "Q4 2024", title: "Approvals" },
        { icon: <CashIcon />, period: "Q1-Q2 2025", title: "Pilot Raise" },
        { icon: <HardHatIcon />, period: "2026", title: "Phase 1 Launch" },
        { icon: <HomeIcon className="h-8 w-8"/>, period: "2027", title: "Phase 2 (10+)" },
        { icon: <TrendingUpIcon />, period: "2028", title: "Maturity (25+)" },
    ]

    return (
        <section id="action-plan" className="relative bg-[var(--bg-primary)] py-20 sm:py-24 overflow-hidden">
            <WavePattern />
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">Action Plan & Timeline</h2>
                    <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto leading-relaxed">Our strategic roadmap from inception to full-scale operation.</p>
                </div>

                {/* Desktop Horizontal Timeline */}
                <div className="hidden md:block">
                    <div className="relative max-w-5xl mx-auto mt-12 mb-8">
                        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200"></div>
                        <div className="absolute top-5 left-0 w-full flex justify-between">
                            {horizontalMilestones.map((_, index) => (
                                <div key={index} className="w-5 h-5 bg-[var(--bg-primary)] border-2 border-[var(--accent-primary)] rounded-full"></div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between max-w-5xl mx-auto">
                        {horizontalMilestones.map((milestone, index) => (
                            <div key={index} className="text-center w-1/5 px-2">
                                <div className="text-[var(--accent-primary)] mx-auto mb-2 w-10 h-10 flex items-center justify-center">
                                    {React.cloneElement(milestone.icon, { className: "h-8 w-8" })}
                                </div>
                                <p className="font-sans font-semibold text-gray-800 text-sm leading-tight">{milestone.title}</p>
                                <p className="text-xs text-[var(--accent-primary)] font-medium mt-1">{milestone.period}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Vertical Timeline */}
                <div className="md:hidden max-w-md mx-auto">
                    <div className="relative wrap overflow-hidden h-full">
                        <div className="absolute h-full border border-dashed border-opacity-20 border-[var(--accent-primary)]" style={{ left: '1.5rem' }}></div>
                        {milestones.map((milestone, index) => (
                             <div key={index} className="mb-8 flex items-center w-full">
                                <div className="z-20 flex-shrink-0 flex items-center justify-center bg-[var(--accent-primary)] shadow-xl w-12 h-12 rounded-full text-white">
                                    {React.cloneElement(milestone.icon, { className: "h-6 w-6" })}
                                </div>
                                <div className="bg-[var(--bg-primary)] rounded-lg shadow-md w-full ml-4 p-4 border border-gray-100">
                                    <p className="mb-1 text-sm font-medium text-[var(--accent-primary)]">{milestone.period}</p>
                                    <h3 className="font-sans font-semibold text-gray-800 text-base">{milestone.title}</h3>
                                    {milestone.description && <p className="text-xs leading-relaxed tracking-wide text-[var(--text-secondary)] mt-1">{milestone.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ActionPlan;