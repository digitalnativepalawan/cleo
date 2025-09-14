import React from 'react';
import { ScaleIcon } from './icons/ScaleIcon';
import { CraneIcon } from './icons/CraneIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { CurrencyIcon } from './icons/CurrencyIcon';
import type { Currency } from '../src/types/index.ts';

const RiskCard = ({ icon, title, mitigation }: { icon: React.ReactNode, title: string, mitigation: string }) => (
    <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 h-full">
        <div className="flex items-center mb-4">
            <span className="text-[var(--accent-primary)] mr-3">{icon}</span>
            <h4 className="font-sans text-lg font-semibold text-[var(--text-primary)] tracking-tight leading-tight">{title}</h4>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{mitigation}</p>
    </div>
);

interface RiskAssessmentProps {
    currency: Currency;
    weeklyTotals: { paid: number; unpaid: number; };
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ weeklyTotals, currency }) => {
    const risks = [
        {
            icon: <ScaleIcon />,
            title: "Regulatory & Permitting",
            mitigation: "Proactive compliance with ECC/TIEZA regulations and maintaining strong local government relations to ensure smooth operations.",
        },
        {
            icon: <CraneIcon />,
            title: "Construction & Timeline",
            mitigation: "Phased development approach to manage capital outflow. Partnering with proven local contractors to mitigate delays and ensure quality.",
        },
        {
            icon: <GlobeIcon />,
            title: "Climate & Environmental",
            mitigation: "Infrastructure designed for climate resilience. A core focus on sustainable, low-impact operations that preserve the local ecosystem.",
        },
        {
            icon: <CurrencyIcon />,
            title: "Market & FX Volatility",
            mitigation: "Diversified revenue streams (local and foreign) reduce dependency on any single market. Targeting stable international and domestic tourists.",
        },
    ];

    return (
        <section id="risks" className="bg-[var(--bg-primary)] py-20 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">Risk Assessment & Mitigation</h2>
                    <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto leading-relaxed">A proactive approach to identifying and managing potential challenges.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {risks.map(risk => (
                        <RiskCard key={risk.title} {...risk} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RiskAssessment;