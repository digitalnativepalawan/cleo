import React from 'react';
import type { Currency } from '../src/types/index.ts';
import { LandDeedIcon } from './icons/LandDeedIcon';
import { ComplianceStampIcon } from './icons/ComplianceStampIcon';
import { OfficeBuildingIcon } from './icons/OfficeBuildingIcon';
import { SolarPanelIcon } from './icons/SolarPanelIcon';
import { IntegratedVerticalsIcon } from './icons/IntegratedVerticalsIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { HomeIcon } from './icons/HomeIcon';
import { LeafIcon } from './icons/LeafIcon';


const EXCHANGE_RATES: Record<Currency, number> = { PHP: 1, USD: 1 / 58, EUR: 1 / 63 };
const CURRENCY_SYMBOLS: Record<Currency, string> = { PHP: '₱', USD: '$', EUR: '€' };

const formatCurrencyValue = (phpValue: number, currency: Currency): string => {
    const rate = EXCHANGE_RATES[currency];
    const value = phpValue * rate;

    const isMillion = value >= 1_000_000;
    const isThousand = value >= 1000 && value < 1_000_000;

    let displayValue = value;
    let suffix = '';

    if (isMillion) {
        displayValue = value / 1_000_000;
        suffix = 'M';
    } else if (isThousand) {
        displayValue = value / 1000;
        suffix = 'k';
    }
    
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: isThousand || isMillion ? 1 : 0,
        maximumFractionDigits: isThousand || isMillion ? 1 : 0,
    });

    return `${CURRENCY_SYMBOLS[currency]}${formatter.format(displayValue)}${suffix}`;
};

interface ExecutiveSummaryProps {
    currency: Currency;
    weeklyTotals: { paid: number; unpaid: number; };
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ currency, weeklyTotals }) => {
    const missionVisionPoints = [
        { title: "Establish Palawan’s Flagship Destination", description: "Not just a resort—a replicable ecosystem blending tourism, agriculture, and infrastructure." },
        { title: "Inclusive Growth & ESG Commitment", description: "Partnering with local communities and cooperatives to build supply chains (farm-to-table produce, construction hardware)." },
        { title: "Resilient Business Model", description: "Diversified streams—eco-villas, agri sales, hardware depots, and digital securities—reducing risk exposure to single-market downturns." },
        { title: "Scalable & Replicable", description: "The Lumambong Beach model becomes the template for future expansions in Bohol, Siargao, and beyond." }
    ];

    const proofPoints = [
        {
            icon: <LandDeedIcon className="h-8 w-8" />,
            title: `${formatCurrencyValue(75000000, currency)} in Titled Land Assets`,
            description: "Fully-owned, 5,282 sqm mother title beachfront parcel in Lumambong.",
            details: "Estimated valuation with natural appreciation in a high-demand corridor.",
            visual: <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 ml-4 flex items-center justify-center border text-gray-400" title="Placeholder for land title scan"><DocumentIcon className="h-6 w-6"/></div>
        },
        {
            icon: <ComplianceStampIcon className="h-8 w-8" />,
            title: "ECC & TIEZA Permits",
            description: "Rare compliance already secured: Environmental Compliance Certificate and TIEZA registration.",
            details: "These permits de-risk timelines and significantly enhance investor credibility.",
            visual: <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 ml-4 flex items-center justify-center border text-xs font-bold text-gray-400" title="Placeholder for TIEZA/ECC logos">TIEZA</div>
        },
        {
            icon: <OfficeBuildingIcon className="h-8 w-8" />,
            title: "SEC Corporate Authority",
            description: "Dual-entity structure: Binga Beach Brothers (BBB) and Cleopatra SIRV Holdings.",
            details: "BBB: Own/sell land, operate resorts. Cleopatra: Hold assets, manage enterprises, structure visa-linked investments.",
            visual: <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 ml-4 flex items-center justify-center border text-xs font-bold text-gray-400" title="Placeholder for SEC logos">SEC</div>
        },
        {
            icon: <SolarPanelIcon className="h-8 w-8" />,
            title: "10kVA Solar-Powered Resort",
            description: "Operational pilot resort with off-grid infrastructure, certified by “Retiree Philippines”.",
            details: "Proof of execution and commitment to sustainability, not just projections.",
            visual: <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 ml-4 flex items-center justify-center border text-gray-400" title="Placeholder for resort photo"><HomeIcon className="h-6 w-6" /></div>
        },
        {
            icon: <IntegratedVerticalsIcon className="h-8 w-8" />,
            title: "Beyond a Resort: Integrated Verticals",
            description: "Farming & Hardware verticals reduce input costs and secure supply chains.",
            details: "Creates new revenue streams that competitors in the region lack, enhancing business resilience.",
            visual: <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 ml-4 flex items-center justify-center border text-gray-400" title="Placeholder for farm/hardware photo"><LeafIcon className="h-6 w-6" /></div>
        },
    ];

    return (
        <section id="summary" className="bg-[var(--bg-secondary)]/50 py-20 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">Executive Summary</h2>
                    <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto leading-relaxed">A high-level overview of our strategic direction and foundational strengths.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* Left Column: Mission & Vision */}
                    <div className="bg-[var(--bg-primary)] rounded-lg shadow-lg border border-gray-100 flex flex-col">
                        <div className="bg-blue-50 border-b border-blue-200 p-4 rounded-t-lg">
                            <h3 className="font-sans text-lg sm:text-xl font-semibold text-blue-800 text-center tracking-tight leading-tight">Mission & Vision</h3>
                        </div>
                        <ul className="p-8 space-y-5">
                            {missionVisionPoints.map((point, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-[var(--accent-primary)] mr-4 mt-1 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{point.title}</h4>
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{point.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column: Proof Points */}
                    <div className="bg-[var(--bg-primary)] rounded-lg shadow-lg border border-gray-100 flex flex-col">
                        <div className="bg-green-50 border-b border-green-200 p-4 rounded-t-lg">
                            <h3 className="font-sans text-lg sm:text-xl font-semibold text-green-800 text-center tracking-tight leading-tight">Core Proof Points</h3>
                        </div>
                        <ul className="p-8 space-y-6">
                            {proofPoints.map((point, index) => (
                                <li key={index} className="flex items-start">
                                    <div className="relative group text-[var(--accent-primary)] mr-4 mt-1 flex-shrink-0">
                                        {point.icon}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                            {point.details}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-gray-800 tabular-nums">{point.title}</h4>
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{point.description}</p>
                                    </div>
                                    {point.visual}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExecutiveSummary;