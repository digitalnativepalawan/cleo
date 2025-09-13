import React from 'react';
import { ScaleIcon } from './icons/ScaleIcon';
import { CraneIcon } from './icons/CraneIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { CurrencyIcon } from './icons/CurrencyIcon';
import { WeeklyTotalsDisplay } from './icons/CheckCircleIcon';
import type { Currency } from '../App';

const RiskCard = ({ icon, title, mitigation }: { icon: React.ReactNode, title: string, mitigation: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 h-full">
        <div className="flex items-center mb-4">
            <span className="text-[#0A84FF] mr-3">{icon}</span>
            <h4 className="font-serif text-lg font-normal text-[#121212]">{title}</h4>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{mitigation}</p>
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
        <section id="risks" className="bg-white py-20 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#121212]">Risk Assessment & Mitigation</h2>
                    <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">A proactive approach to identifying and managing potential challenges.</p>
                    <WeeklyTotalsDisplay paid={weeklyTotals.paid} unpaid={weeklyTotals.unpaid} currency={currency} />
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