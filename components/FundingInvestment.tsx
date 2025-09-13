import React from 'react';
import { CashIcon } from './icons/CashIcon';
import { HomeIcon } from './icons/HomeIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { HandshakeIcon } from './icons/HandshakeIcon';
import { OfficeBuildingIcon } from './icons/OfficeBuildingIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import type { Currency } from '../App';
import { WeeklyTotalsDisplay } from './icons/CheckCircleIcon';

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
};


const InvestmentTierCard = ({ icon, title, amount, benefit }: { icon: React.ReactNode, title: string, amount: string, benefit: string }) => (
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col text-center h-full">
        <div className="text-[#0A84FF] mx-auto mb-4">{icon}</div>
        <h3 className="font-serif text-lg sm:text-xl font-normal text-[#121212] mb-2">{title}</h3>
        <p className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">{amount}</p>
        <p className="text-gray-600 flex-grow">{benefit}</p>
        <button className="mt-6 bg-transparent border-2 border-[#0A84FF] text-[#0A84FF] font-semibold py-2 px-6 rounded-lg hover:bg-[#0A84FF] hover:text-white transition-all duration-300 transform hover:scale-105">
            Inquire
        </button>
    </div>
);

const UseOfFundsChart = () => {
    const segments = [
        { color: '#0A84FF', percentage: 60, name: 'Construction & Dev.' },
        { color: '#34D399', percentage: 20, name: 'Land & Permitting' },
        { color: '#FBBF24', percentage: 15, name: 'Operational Ramp-up' },
        { color: '#F87171', percentage: 5, name: 'Contingency' },
    ];
    const circumference = 2 * Math.PI * 40;
    let accumulatedPercentage = 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200/80 h-full flex flex-col">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#121212] mb-4 text-center">Allocation of Capital</h3>
            <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        {segments.map((segment, index) => {
                            const dashoffset = circumference - (circumference * segment.percentage) / 100;
                            const rotation = accumulatedPercentage * 3.6;
                            accumulatedPercentage += segment.percentage;
                            return (
                                <circle key={index} cx="50" cy="50" r="40" fill="transparent" stroke={segment.color} strokeWidth="20"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashoffset}
                                    transform={`rotate(${rotation - 90} 50 50)`}
                                />
                            );
                        })}
                    </svg>
                     <div className="absolute inset-0 flex items-center justify-center text-center">
                        <span className="text-xs font-semibold text-gray-600">Use of<br/>Funds</span>
                    </div>
                </div>
                <ul className="space-y-2 w-full max-w-xs">
                    {segments.map(s => (
                         <li key={s.name} className="flex items-center text-sm">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: s.color }}></span>
                            <span className="font-semibold text-gray-700">{s.name}</span>
                            <span className="ml-auto text-gray-500 font-medium">{s.percentage}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ExitStrategy = () => {
    const strategies = [
        { icon: <HandshakeIcon />, title: "Strategic Acquisition", description: "Sale to a larger hotel operator or real estate developer seeking entry into the Palawan market." },
        { icon: <OfficeBuildingIcon />, title: "REIT Conversion", description: "Opportunity to bundle stabilized assets into a publicly-traded Real Estate Investment Trust." },
        { icon: <RefreshIcon />, title: "Share Buyback Program", description: "A structured program to repurchase investor shares using operational profits at a premium." },
    ];
    return (
         <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200/80 h-full flex flex-col">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#121212] mb-4 text-center">Investor Exit Strategy</h3>
            <ul className="space-y-4">
                {strategies.map(s => (
                    <li key={s.title} className="flex items-start">
                        <span className="text-[#0A84FF] mr-4 mt-1 flex-shrink-0">{s.icon}</span>
                        <div>
                            <h4 className="font-semibold text-gray-800">{s.title}</h4>
                            <p className="text-gray-600 text-sm">{s.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface FundingInvestmentProps {
    currency: Currency;
}

const FundingInvestment: React.FC<FundingInvestmentProps> = ({ currency }) => {
    const tiers = [
        { icon: <CashIcon className="h-10 w-10"/>, title: "Pilot Investor", amount: formatCurrencyRange(2500000, 5000000, currency), benefit: "Structured as a Convertible Note or SAFE agreement, offering premium terms at the next funding stage." },
        { icon: <HomeIcon className="h-10 w-10"/>, title: "SIRV Villa Owner", amount: `${formatCurrencyValue(12500000, currency)}+`, benefit: "Acquire a titled eco-villa asset linked to the Special Investor's Resident Visa (SIRV) program." },
        { icon: <UsersGroupIcon />, title: "Equity Partner", amount: `${formatCurrencyValue(25000000, currency)}+`, benefit: "Direct equity stake in the holding company, including profit sharing, and a potential board seat." },
    ];

    const weeklyTotals = { paid: 0, unpaid: 0 };

    return (
        <section id="investment" className="bg-gray-50/50 py-20 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#121212]">Funding & Investment Opportunity</h2>
                    <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">Join us in capitalizing on Palawan's growth. We offer multiple tiers for strategic partnership.</p>
                    <WeeklyTotalsDisplay paid={weeklyTotals.paid} unpaid={weeklyTotals.unpaid} currency={currency} />
                </div>

                {/* Investment Tiers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                    {tiers.map(tier => <InvestmentTierCard key={tier.title} {...tier} />)}
                </div>

                {/* Use of Funds & Exit Strategy */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <UseOfFundsChart />
                    <ExitStrategy />
                </div>
            </div>
        </section>
    );
};

export default FundingInvestment;