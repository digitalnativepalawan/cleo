import React from 'react';
import { CashIcon } from './icons/CashIcon';
import { HomeIcon } from './icons/HomeIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { HandshakeIcon } from './icons/HandshakeIcon';
import { OfficeBuildingIcon } from './icons/OfficeBuildingIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import type { Currency } from '../src/types/index.ts';

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
}


const InvestmentTierCard = ({ icon, title, amount, benefit }: { icon: React.ReactNode, title: string, amount: string, benefit: string }) => (
    <div className="bg-[var(--bg-primary)] p-8 rounded-lg shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        <div className="flex items-center mb-4">
            <span className="text-[var(--accent-primary)] mr-4">{icon}</span>
            <h3 className="font-sans text-xl font-semibold text-gray-800 tracking-tight leading-tight">{title}</h3>
        </div>
        <div className="flex-grow">
            <p className="text-2xl font-semibold text-[var(--text-primary)] tabular-nums">{amount}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{benefit}</p>
        </div>
    </div>
);

interface FundingInvestmentProps {
    currency: Currency;
    weeklyTotals: { paid: number; unpaid: number; };
}

const FundingInvestment: React.FC<FundingInvestmentProps> = ({ currency, weeklyTotals }) => {
    const investmentTiers = [
        {
            icon: <UsersGroupIcon />,
            title: "Community & Angel",
            amount: formatCurrencyRange(500000, 2500000, currency),
            benefit: "Profit participation certificate."
        },
        {
            icon: <HandshakeIcon />,
            title: "SIRV & Partner",
            amount: `> ${formatCurrencyValue(4350000, currency)}`,
            benefit: "Visa-linked investment, preferred equity."
        },
        {
            icon: <OfficeBuildingIcon />,
            title: "Corporate & Institutional",
            amount: formatCurrencyRange(25000000, 50000000, currency),
            benefit: "Board representation, custom tranches."
        },
    ];

    const useOfFunds = [
        { item: "Villa Construction & Development", percentage: "50%" },
        { item: "Land Acquisition & Titling", percentage: "20%" },
        { item: "Infrastructure & Utilities", percentage: "15%" },
        { item: "Working Capital & Operations", percentage: "10%" },
        { item: "Contingency Fund", percentage: "5%" },
    ];

    return (
        <section id="funding" className="bg-[var(--bg-secondary)]/50 py-20 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">Funding & Investment Opportunity</h2>
                    <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto leading-relaxed">Seeking strategic partners to accelerate growth and capitalize on a proven, de-risked model.</p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Investment Tiers */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-sans text-2xl font-semibold text-gray-800 mb-6 tracking-tight leading-tight">Investment Tiers</h3>
                            <div className="grid grid-cols-1 gap-8">
                                {investmentTiers.map(tier => <InvestmentTierCard key={tier.title} {...tier} />)}
                            </div>
                        </div>
                        
                        <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-md border border-gray-100">
                             <h3 className="font-sans text-lg font-semibold text-gray-800 mb-4 flex items-center tracking-tight leading-tight">
                                <RefreshIcon />
                                <span className="ml-2">Returns & Exit Strategy</span>
                            </h3>
                             <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                Projected 18-20% IRR with exit opportunities via strategic sale or IPO within a 7-10 year horizon. Continuous cash flow from operations provides ongoing investor returns.
                             </p>
                        </div>
                    </div>

                    {/* Right: Use of Funds */}
                    <div className="bg-[var(--bg-primary)] p-8 rounded-lg shadow-lg border border-gray-100 flex flex-col">
                        <h3 className="font-sans text-2xl font-semibold text-gray-800 mb-6 tracking-tight leading-tight">Use of Funds</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
                            Capital will be deployed across critical growth areas to scale operations, expand assets, and enhance profitability.
                        </p>
                        <div className="space-y-4 flex-grow">
                            {useOfFunds.map(fund => (
                                <div key={fund.item}>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span className="font-medium text-gray-700">{fund.item}</span>
                                        <span className="font-semibold text-[var(--accent-primary)] tabular-nums">{fund.percentage}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-[var(--accent-primary)] h-2.5 rounded-full" style={{ width: fund.percentage }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <div className="mt-8 pt-6 border-t border-dashed">
                             <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 text-[var(--accent-primary)] pt-1"><CashIcon className="h-6 w-6" /></div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Total Capital Raise (Phase 1)</h4>
                                    <p className="text-3xl font-semibold text-[var(--text-primary)] mt-1 tabular-nums">{formatCurrencyValue(150000000, currency)}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">To fund development through 2026.</p>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FundingInvestment;