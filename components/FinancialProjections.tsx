import React from 'react';
import type { Currency } from '../src/types/index.ts';
import { GrowthIcon } from './icons/GrowthIcon';

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

const KpiCard = ({ value, label, sublabel, icon }: { value: string, label: string, sublabel: string, icon?: React.ReactNode }) => (
    <div className="bg-[var(--bg-primary)] p-6 rounded-xl shadow-md border border-gray-100 text-center flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {icon && <div className="text-[#28A745] mb-2">{icon}</div>}
        <p className="text-2xl md:text-3xl font-semibold text-[var(--accent-primary)] tabular-nums">{value}</p>
        <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{label}</p>
        <p className="text-xs text-gray-500 font-medium">{sublabel}</p>
    </div>
);


const revenueData = [
    { year: 2026, hospitality: 17000000, hardware: 8000000, farming: 1500000, other: 1000000, total: 27500000 },
    { year: 2027, hospitality: 54000000, hardware: 20000000, farming: 4000000, other: 2000000, total: 80000000 },
    { year: 2028, hospitality: 98000000, hardware: 37000000, farming: 8000000, other: 5500000, total: 148500000 },
    { year: 2029, hospitality: 125000000, hardware: 48000000, farming: 10000000, other: 7000000, total: 190000000 },
    { year: 2030, hospitality: 145000000, hardware: 55000000, farming: 12000000, other: 8000000, total: 220000000 },
];

const RevenueGrowthTable: React.FC<{currency: Currency}> = ({ currency }) => {
    return (
        <section className="bg-[var(--bg-primary)] border border-[var(--border-primary)]/80 rounded-2xl p-5 shadow-lg flex flex-col" aria-labelledby="rev-title">
            <h3 id="rev-title" className="font-sans font-semibold text-base mb-2 tracking-tight leading-tight">Projected Revenue Growth</h3>
            <p className="text-gray-500 text-xs mb-4 leading-normal">Illustrative base case. Figures exclude VAT; rounded.</p>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--bg-secondary)] text-gray-700">
                    <tr>
                      <th scope="col" className="py-3 px-3 text-left font-semibold">Year</th>
                      <th scope="col" className="py-3 px-3 text-right font-semibold">Hospitality</th>
                      <th scope="col" className="py-3 px-3 text-right font-semibold">Hardware</th>
                      <th scope="col" className="py-3 px-3 text-right font-semibold">Farming</th>
                      <th scope="col" className="py-3 px-3 text-right font-semibold">Other</th>
                      <th scope="col" className="py-3 px-3 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-primary)] text-gray-700">
                    {revenueData.map(row => (
                      <tr key={row.year} className="hover:bg-[var(--bg-secondary)]">
                        <td className="py-3 px-3 font-medium text-[var(--text-primary)] tabular-nums">{row.year}</td>
                        <td className="py-3 px-3 text-right tabular-nums">{formatCurrencyValue(row.hospitality, currency)}</td>
                        <td className="py-3 px-3 text-right tabular-nums">{formatCurrencyValue(row.hardware, currency)}</td>
                        <td className="py-3 px-3 text-right tabular-nums">{formatCurrencyValue(row.farming, currency)}</td>
                        <td className="py-3 px-3 text-right tabular-nums">{formatCurrencyValue(row.other, currency)}</td>
                        <td className="py-3 px-3 text-right tabular-nums font-semibold text-[var(--text-primary)]">{formatCurrencyValue(row.total, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
            
            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
                {revenueData.map(row => (
                    <div key={row.year} className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50">
                        <h4 className="font-bold text-gray-800 mb-2 tabular-nums">Year: {row.year}</h4>
                        <dl className="space-y-1.5 text-xs">
                            <div className="flex justify-between tabular-nums"><dt className="text-gray-600">Hospitality</dt><dd>{formatCurrencyValue(row.hospitality, currency)}</dd></div>
                            <div className="flex justify-between tabular-nums"><dt className="text-gray-600">Hardware</dt><dd>{formatCurrencyValue(row.hardware, currency)}</dd></div>
                            <div className="flex justify-between tabular-nums"><dt className="text-gray-600">Farming</dt><dd>{formatCurrencyValue(row.farming, currency)}</dd></div>
                            <div className="flex justify-between tabular-nums"><dt className="text-gray-600">Other</dt><dd>{formatCurrencyValue(row.other, currency)}</dd></div>
                            <div className="flex justify-between font-semibold pt-1 border-t border-dashed tabular-nums"><dt>Total</dt><dd>{formatCurrencyValue(row.total, currency)}</dd></div>
                        </dl>
                    </div>
                ))}
            </div>

            <div className="mt-auto flex justify-between items-center gap-3 pt-3 border-t border-dashed border-[var(--border-primary)] text-gray-500 text-xs">
              <span className="inline-block py-1.5 px-2.5 rounded-full font-medium bg-blue-50 text-blue-800 border border-blue-200">Revenue CAGR (’26–’30)</span>
              <span className="text-green-600 font-semibold tabular-nums">≈ 15–20%</span>
            </div>
        </section>
    );
};

const villaData = [
    { year: 2026, cumulative: 5, new: 5, occupancy: '60%', adr: 12000 },
    { year: 2027, cumulative: 20, new: 15, occupancy: '66%', adr: 12600 },
    { year: 2028, cumulative: 35, new: 15, occupancy: '70%', adr: 13230 },
    { year: 2029, cumulative: 50, new: 15, occupancy: '70%', adr: 13890 },
    { year: 2030, cumulative: 65, new: 15, occupancy: '72%', adr: 14585 },
];

const VillaExpansionTable: React.FC<{currency: Currency}> = ({ currency }) => {
    return (
        <section className="bg-[var(--bg-primary)] border border-[var(--border-primary)]/80 rounded-2xl p-5 shadow-lg flex flex-col" aria-labelledby="villa-title">
            <h3 id="villa-title" className="font-sans font-semibold text-base mb-2 tracking-tight leading-tight">Eco-Villa Expansion Plan</h3>
            <p className="text-gray-500 text-xs mb-4 leading-normal">Cumulative units developed and annual adds.</p>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-xs">
                    <thead className="bg-[var(--bg-secondary)] text-gray-700">
                        <tr>
                            <th scope="col" className="py-3 px-3 text-left font-semibold">Year</th>
                            <th scope="col" className="py-3 px-3 text-right font-semibold">Cumulative Villas</th>
                            <th scope="col" className="py-3 px-3 text-right font-semibold">New Units</th>
                            <th scope="col" className="py-3 px-3 text-right font-semibold">Stabilized Occ.</th>
                            <th scope="col" className="py-3 px-3 text-right font-semibold">ADR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-primary)] text-gray-700">
                        {villaData.map(row => (
                            <tr key={row.year} className="hover:bg-[var(--bg-secondary)]">
                                <td className="py-3 px-3 font-medium text-[var(--text-primary)] tabular-nums">{row.year}</td>
                                <td className="py-3 px-3 text-right tabular-nums font-semibold text-[var(--text-primary)]">{row.cumulative}</td>
                                <td className="py-3 px-3 text-right tabular-nums">{row.new}</td>
                                <td className="py-3 px-3 text-right tabular-nums">{row.occupancy}</td>
                                <td className="py-3 px-3 text-right tabular-nums">{formatCurrencyValue(row.adr, currency)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
                {villaData.map(row => (
                    <div key={row.year} className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50">
                        <h4 className="font-bold text-gray-800 mb-2 tabular-nums">Year: {row.year}</h4>
                        <dl className="space-y-1.5 text-xs">
                            <div className="flex justify-between font-semibold tabular-nums"><dt>Cumulative Villas</dt><dd>{row.cumulative}</dd></div>
                            <div className="flex justify-between tabular-nums"><dt className="text-gray-600">New Units</dt><dd>{row.new}</dd></div>
                            <div className="flex justify-between tabular-nums"><dt className="text-gray-600">Stabilized Occ.</dt><dd>{row.occupancy}</dd></div>
                            <div className="flex justify-between tabular-nums"><dt className="text-gray-600">ADR</dt><dd>{formatCurrencyValue(row.adr, currency)}</dd></div>
                        </dl>
                    </div>
                ))}
            </div>

            <div className="mt-auto flex justify-between items-center gap-3 pt-3 border-t border-dashed border-[var(--border-primary)] text-gray-500 text-xs">
              <span className="inline-block py-1.5 px-2.5 rounded-full font-medium bg-blue-50 text-blue-800 border border-blue-200">Unit Economics</span>
              <span className="text-green-600 font-semibold tabular-nums">EBITDA/villa ≈ {formatCurrencyValue(10000000, currency)} at maturity</span>
            </div>
        </section>
    );
};

interface FinancialProjectionsProps {
    currency: Currency;
    weeklyTotals: { paid: number; unpaid: number; };
}

const FinancialProjections: React.FC<FinancialProjectionsProps> = ({ currency, weeklyTotals }) => {
    const kpis = [
        { value: "70%", label: "Target Occupancy", sublabel: "Year 3 Average" },
        { value: formatCurrencyValue(12000, currency), label: "Average Daily Rate", sublabel: "Peak Season Estimate" },
        { value: "30-35%", label: "EBITDA Margin", sublabel: "Projected at Maturity" },
        { value: "18-20%", label: "Investor IRR", sublabel: "Illustrative Base Case", icon: <GrowthIcon className="h-6 w-6"/> },
    ];

    return (
        <section id="financials" className="bg-[var(--bg-secondary)]/50 py-20 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">Financial Projections</h2>
                    <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto leading-relaxed">Scalable, resilient growth model with strong underlying assets.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
                    {kpis.map(kpi => <KpiCard key={kpi.label} {...kpi} />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-7xl mx-auto">
                    <RevenueGrowthTable currency={currency} />
                    <VillaExpansionTable currency={currency} />
                </div>
            </div>
        </section>
    );
};

export default FinancialProjections;