import type { Currency } from '../types/index.ts';

export const EXCHANGE_RATES: Record<Currency, number> = { PHP: 1, USD: 1 / 58, EUR: 1 / 63 };
export const CURRENCY_SYMBOLS: Record<Currency, string> = { PHP: '₱', USD: '$', EUR: '€' };

export const formatCurrencyValue = (phpValue: number, currency: Currency): string => {
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

export const formatCurrencyRange = (phpMin: number, phpMax: number, currency: Currency): string => {
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
