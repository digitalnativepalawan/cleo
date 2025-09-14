import React from 'react';
import { LeafIcon } from './icons/LeafIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import type { Currency } from '../src/types/index.ts';

const WavePattern = () => (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <svg className="w-full h-full text-green-50/70" fill="none" preserveAspectRatio="none">
            <path d="M-200,300 C150,50 400,400 700,150 S1000,300 1300,100" stroke="currentColor" strokeWidth="250" strokeLinecap="round"/>
            <path d="M-100,250 C200,450 500,100 800,300 S1100,50 1400,200" stroke="currentColor" strokeWidth="250" strokeLinecap="round"/>
        </svg>
    </div>
);

const ESGPillarCard = ({ icon, title, points }: { icon: React.ReactNode, title: string, points: string[] }) => (
    <div className="bg-[var(--bg-primary)] p-8 rounded-lg shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        <div className="flex items-center mb-5">
            <span className="text-[var(--accent-primary)] mr-4">{icon}</span>
            <h3 className="font-sans text-lg sm:text-xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">{title}</h3>
        </div>
        <ul className="space-y-3 text-[var(--text-secondary)] flex-grow">
            {points.map((point, i) => (
                <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <span>{point}</span>
                </li>
            ))}
        </ul>
    </div>
);

interface ESGProps {
    currency: Currency;
    weeklyTotals: { paid: number; unpaid: number; };
}

const ESG: React.FC<ESGProps> = ({ weeklyTotals, currency }) => {
    const pillars = [
        {
            icon: <LeafIcon className="h-8 w-8" />,
            title: "Environmental Sustainability",
            points: [
                "100% solar-powered resort operations to minimize carbon footprint.",
                "Comprehensive waste reduction and recycling programs.",
                "Advanced water conservation and greywater recycling systems.",
                "Commitment to preserving native flora and fauna.",
            ],
        },
        {
            icon: <UsersGroupIcon />,
            title: "Community Engagement",
            points: [
                "Prioritizing local hiring and providing skills training programs.",
                "Sourcing produce and materials from local community cooperatives.",
                "Supporting local artisans and cultural heritage projects.",
                "Contributing to local infrastructure like roads and connectivity.",
            ],
        },
        {
            icon: <ShieldCheckIcon />,
            title: "Corporate Governance",
            points: [
                "Transparent financial reporting compliant with international standards.",
                "Ethical supply chain management and fair labor practices.",
                "Robust investor protection policies and clear communication.",
                "Advisory board with diverse expertise in sustainability and finance.",
            ],
        },
    ];

    return (
        <section id="esg" className="relative bg-[var(--bg-primary)] py-20 sm:py-24 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">Environmental, Social, & Governance (ESG) Commitment</h2>
                    <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-3xl mx-auto leading-relaxed">Our framework for sustainable growth, community partnership, and responsible investment.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {pillars.map(pillar => (
                        <ESGPillarCard key={pillar.title} {...pillar} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ESG;