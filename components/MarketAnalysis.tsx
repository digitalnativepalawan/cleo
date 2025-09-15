import React from 'react';
import { ActivityIcon } from './icons/ActivityIcon';
import { UsersIcon } from './icons/UsersIcon';
import { Building2Icon } from './icons/Building2Icon';
import { TrophyIcon } from './icons/TrophyIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { TouristGrowthGraph } from './TouristGrowthGraph';
import { DemographicsUsersIcon } from './icons/DemographicsUsersIcon';
import { InfrastructureTimeline } from './InfrastructureTimeline';
import { RegulatoryBadges } from './RegulatoryBadges';
import { PassportIcon } from './icons/PassportIcon';
import { TaxCutIcon } from './icons/TaxCutIcon';
import type { Currency } from '../src/types/index.ts';

const Card = ({ icon, title, children, iconTooltip }: { icon: React.ReactNode, title: string, children: React.ReactNode, iconTooltip?: string }) => (
    <div className="bg-[var(--bg-primary)] p-6 rounded-2xl shadow-sm border border-[var(--border-primary)] flex flex-col space-y-3">
        <div className="flex items-center space-x-3 h-14 flex-shrink-0">
            <div className="relative group text-[var(--accent-primary)] h-6 w-6">
                {icon}
                {iconTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        {iconTooltip}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                )}
            </div>
            <h3 className="font-sans text-xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">{title}</h3>
        </div>
        <div className="flex-grow flex flex-col space-y-3 text-sm text-[var(--text-secondary)]">
            {children}
        </div>
    </div>
);

const ComparisonTable = () => {
    const data = [
        { feature: 'Visa-linked integration', bbb: 'Yes', typical: 'No', positive: true },
        { feature: 'Land authority & SEC', bbb: 'Strong', typical: 'Limited' },
        { feature: 'ECC/TIEZA compliance', bbb: 'Secured', typical: 'Partial', positive: true },
        { feature: 'Vertical synergies', bbb: 'Multi-vertical', typical: 'Single' },
    ];
    return (
        <div className="flex-grow flex flex-col">
            {/* Desktop Table */}
            <div className="hidden lg:block flex-grow overflow-x-auto">
                <table className="min-w-full text-xs">
                    <thead className="bg-[var(--bg-secondary)]">
                        <tr>
                            <th scope="col" className="py-3 px-3 text-left font-semibold text-gray-700">Feature</th>
                            <th scope="col" className="py-3 px-3 text-center font-semibold text-gray-700">BBB + Cleopatra</th>
                            <th scope="col" className="py-3 px-3 text-center font-semibold text-gray-700">Typical Resort</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-primary)] bg-[var(--bg-primary)] text-gray-700">
                        {data.map((row) => (
                            <tr key={row.feature} className="hover:bg-[var(--bg-secondary)]">
                                <td className="py-3 px-3 font-medium text-[var(--text-primary)]">{row.feature}</td>
                                <td className={`py-3 px-3 text-center font-semibold ${row.positive ? 'text-green-600' : ''}`}>{row.bbb}</td>
                                <td className="py-3 px-3 text-center">{row.typical}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 text-sm">
                {data.map(row => (
                    <div key={row.feature} className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-sm">
                        <h4 className="font-semibold text-[var(--text-primary)] mb-2">{row.feature}</h4>
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">BBB + Cleopatra:</span>
                                <span className={`font-semibold ${row.positive ? 'text-green-600' : 'text-gray-800'}`}>{row.bbb}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500">Typical Resort:</span>
                                <span className="text-gray-800">{row.typical}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TargetDemographics: React.FC = () => {
    const demographicsData = [
        { segment: 'HNWI (CN/KR/EU/US)', color: '#0A84FF', share: '35%', why: 'Yield, lifestyle villas', hook: 'Secure premium ADR' },
        { segment: 'SIRV Retirees', color: '#0A84FF', share: '20%', why: 'Visa-linked investment', hook: 'Residency + wallet perks' },
        { segment: 'ESG / Sustainability Investors', color: '#60A5FA', share: '15%', why: 'Decarbonized ops, transparency', hook: 'ESG reporting drives premium ADR' },
        { segment: 'Web3 / Crypto Nomads', color: '#93C5FD', share: '15%', why: 'Long-stay, USD earnings, off-grid luxury', hook: 'Wallet-ready, KYC/AML compliant' },
        { segment: 'OFW / Filipino Diaspora', color: '#BFDBFE', share: '15%', why: 'Land-anchored ownership, family use', hook: 'Referral-driven, low CAC' },
    ];

    return (
        <article className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-sm p-6 flex flex-col">
            <header className="mb-4">
                <div className="flex items-start gap-3">
                    <div className="relative group">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 flex-shrink-0">
                            <DemographicsUsersIcon />
                        </span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                            Illustrates the diverse mix of investors and end-users for the project.
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-sans text-xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">Target Demographics</h3>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">Illustrative segment mix of investors and users by 2030.</p>
                    </div>
                </div>
            </header>
            
            <div className="flex-grow flex items-center justify-center my-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full">
                    {demographicsData.map((item) => (
                        <div key={item.segment} className="flex items-center">
                            <span 
                                className="w-3 h-3 rounded-full mr-3 flex-shrink-0" 
                                style={{ backgroundColor: item.color }}
                                aria-hidden="true"
                            ></span>
                            <span 
                                className="font-semibold text-sm text-gray-800"
                            >
                                {item.segment}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="mt-auto pt-4">
                     <div className="flex flex-wrap gap-2 text-[11px] md:text-xs">
                        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">High LTV / Low CAC via referral</span>
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">ESG reporting drives premium ADR</span>
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">Wallet-ready, KYC/AML compliant</span>
                    </div>
                    <p className="mt-3 text-[11px] text-gray-500">
                        Shares are illustrative for planning; refine with OTA data, referral partner funnels, and pre-launch A/B tests.
                    </p>
                </footer>
        </article>
    )
};

interface MarketAnalysisProps {
    currency: Currency;
    weeklyTotals: { paid: number; unpaid: number; };
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ weeklyTotals, currency }) => {
    return (
        <section id="market" className="bg-[var(--bg-secondary)]/50 py-20 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">Market Analysis</h2>
                    <p className="text-lg sm:text-xl text-[var(--text-secondary)] mt-2 max-w-3xl mx-auto leading-relaxed">Strong demand, underserved market, proven regulatory moat.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {/* Card 1: Tourism Growth */}
                    <Card icon={<ActivityIcon />} title="Tourism Growth" iconTooltip="Represents the strong and growing tourism demand in Palawan.">
                        <ul className="space-y-1.5 list-disc list-inside leading-relaxed">
                            <li>8.2M+ visitors in 2024; projected 12% CAGR to 2030.</li>
                            <li>DOT target: 15M foreign arrivals by 2030.</li>
                        </ul>
                        <div className="flex-grow mt-auto">
                           <TouristGrowthGraph />
                        </div>
                    </Card>

                    {/* Card 2: Target Demographics */}
                    <TargetDemographics />

                    {/* Card 3: Infrastructure Boom */}
                    <Card icon={<Building2Icon />} title="Infrastructure Boom" iconTooltip="Symbolizes significant investment in regional infrastructure like airports and roads.">
                        <ul className="space-y-1.5 list-disc list-inside leading-relaxed">
                            <li>Leverages newly expanded airport and water infrastructure.</li>
                            <li>Road improvements and new unit construction are scheduled for mid-2026.</li>
                        </ul>
                        <div className="flex-grow mt-auto">
                           <InfrastructureTimeline />
                        </div>
                    </Card>

                    {/* Card 4: Competitive Landscape */}
                    <Card icon={<TrophyIcon />} title="Competitive Landscape" iconTooltip="Highlights the project's unique competitive advantages in a fragmented market.">
                        <ul className="space-y-1.5 list-disc list-inside leading-relaxed">
                             <li>Fragmented boutique resorts; few visa-linked integrated assets.</li>
                             <li>Limited ECC/TIEZA compliance among peers.</li>
                        </ul>
                        <div className="flex-grow mt-auto flex">
                          <ComparisonTable />
                        </div>
                    </Card>

                    {/* Card 5: Regulatory Advantage */}
                    <Card icon={<ShieldCheckIcon />} title="Regulatory Advantage" iconTooltip="Signifies robust legal and regulatory compliance, a key de-risking factor.">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="relative group flex-shrink-0 text-blue-500 pt-0.5">
                                    <ShieldCheckIcon className="w-5 h-5" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                        Full legal authority via SEC, ECC & TIEZA permits.
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--text-primary)]">SEC, ECC & TIEZA Compliance</h4>
                                    <ul className="text-xs text-gray-600 mt-1 space-y-1 list-disc list-inside pl-1">
                                        <li>Full land, environmental, and tax zone authority.</li>
                                        <li>Guarantees lower regulatory risk and faster project execution.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="relative group flex-shrink-0 text-green-500 pt-0.5">
                                    <TaxCutIcon className="w-5 h-5" />
                                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                        Fiscal benefits like tax holidays under TIEZA.
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--text-primary)]">TIEZA Investment Incentives</h4>
                                    <ul className="text-xs text-gray-600 mt-1 space-y-1 list-disc list-inside pl-1">
                                        <li>5–10 years income tax holiday.</li>
                                        <li>Duty-free importation of capital equipment.</li>
                                        <li>VAT zero-rating on eligible transactions.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="relative group flex-shrink-0 text-gray-500 pt-0.5">
                                    <PassportIcon className="w-5 h-5" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                        Pathway for foreign investors to gain residency via SIRV.
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--text-primary)]">SIRV-Linked Residency Investment</h4>
                                    <ul className="text-xs text-gray-600 mt-1 space-y-1 list-disc list-inside pl-1">
                                        <li>Taps into 10,000+ annual foreign visa applicants.</li>
                                        <li>Pathway for residency tied to project participation.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="relative group flex-shrink-0 text-gray-500 pt-0.5">
                                    <UsersIcon className="w-5 h-5" />
                                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                        Tailored benefits for international and domestic investors.
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--text-primary)]">Foreign & Filipino Benefits</h4>
                                    <ul className="text-xs text-gray-600 mt-1 space-y-1 list-disc list-inside pl-1">
                                        <li>Foreigners: Residency + tax holidays via SIRV/TIEZA.</li>
                                        <li>Filipinos: Profit participation, land appreciation, tax zone benefits.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow mt-auto flex flex-col items-center pt-2">
                           <RegulatoryBadges />
                           <p className="text-xs text-center text-gray-500 pt-3 max-w-sm">
                                Government-backed compliance + incentives = higher ROI, lower risk.
                           </p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default MarketAnalysis;