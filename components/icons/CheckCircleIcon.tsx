import React from 'react';
import type { Currency } from '../../App';

export const CheckCircleIcon: React.FC = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
};

// New component for weekly totals display
const EXCHANGE_RATES_WEEKLY: Record<Currency, number> = { PHP: 1, USD: 1 / 58, EUR: 1 / 63 };
const CURRENCY_SYMBOLS_WEEKLY: Record<Currency, string> = { PHP: '₱', USD: '$', EUR: '€' };

export const WeeklyTotalsDisplay: React.FC<{ paid: number; unpaid: number; currency: Currency; }> = ({ paid, unpaid, currency }) => {
    const formatValue = (phpValue: number) => {
        const rate = EXCHANGE_RATES_WEEKLY[currency];
        const value = phpValue * rate;
        return `${CURRENCY_SYMBOLS_WEEKLY[currency]}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="mt-6 flex justify-center items-center gap-4 text-sm text-gray-500 border-t border-b border-dashed border-gray-200 py-3 max-w-md mx-auto">
            <div className="text-center">
                <span className="block text-xs uppercase tracking-wider">This Week Paid</span>
                <span className="block font-semibold text-green-600 text-base">{formatValue(paid)}</span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-center">
                <span className="block text-xs uppercase tracking-wider">This Week Unpaid</span>
                <span className="block font-semibold text-red-600 text-base">{formatValue(unpaid)}</span>
            </div>
        </div>
    );
};
