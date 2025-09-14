import React from 'react';
import { OfficeBuildingIcon } from './icons/OfficeBuildingIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { HomeIcon } from './icons/HomeIcon';
import type { Currency } from '../src/types/index.ts';

const PillarCard = ({ icon, title, points, highlight = false }: { icon: React.ReactNode, title: string, points: string[], highlight?: boolean }) => (
    <div className={`flex-1 ${highlight ? 'bg-blue-50/60' : 'bg-[var(--bg-primary)]'} p-8 rounded-xl shadow-md hover:shadow-lg border border-gray-200/50 transition-all duration-300 flex flex-col h-full`}>
        <div className="flex items-center mb-5">
            <span className="text-[var(--accent-primary)] mr-4">{icon}</span>
            <h3 className="font-sans text-lg sm:text-xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">{title}</h3>
        </div>
        <ul className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
            {points.map((point, i) => (
                <li key={i} className="flex items-start">
                    <span className="text-[var(--accent-primary)] mr-3 mt-1 flex-shrink-0">
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

interface BusinessModelProps {
    currency: Currency;
    weeklyTotals: { paid: number; unpaid: number; };
}

const BusinessModel: React.FC<BusinessModelProps> = ({ weeklyTotals, currency }) => {
    return (
        <section id="model" className="bg-[var(--bg-primary)] py-20 sm:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[var(--text-primary)] tracking-tight leading-tight">Business Model & Revenue Streams</h2>
                    <p className="text-lg text-[var(--text-secondary)] mt-2 max-w-4xl mx-auto leading-relaxed">A balanced alliance combining proven land authority, operational excellence, and vertical expansion.</p>
                </div>
                
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-2">
                       <PillarCard 
                            icon={<OfficeBuildingIcon className="h-8 w-8" />} 
                            title="Cleopatra SIRV Holdings"
                            points={[
                                "Beyond a holding company: leads farming integration and hardware depots supporting Palawan’s construction wave.",
                                "Expands SIRV product development, corporate finance, and brand strategy.",
                                "Builds supply resilience through agri/hardware verticals."
                            ]} 
                        />
                       <div className="text-4xl font-light text-gray-300 mx-2 my-4 md:my-0 flex items-center justify-center">+</div>
                       <PillarCard 
                            icon={<TrendingUpIcon className="h-8 w-8" />} 
                            title="Shared Growth Engines"
                            points={[
                                "Resort & eco-villa operations with proven occupancy and guest satisfaction.",
                                "Revenue from F&B, tours, and premium experiences.",
                                "Expansion into digital transparency (investor dashboards, ESG reporting)."
                            ]}
                            highlight 
                        />
                       <div className="text-4xl font-light text-gray-300 mx-2 my-4 md:my-0 flex items-center justify-center">+</div>
                       <PillarCard 
                            icon={<HomeIcon className="h-8 w-8" />} 
                            title="Binga Beach Brothers Inc."
                            points={[
                                "More than a developer: owns 5,282 sqm titled beachfront land (₱75M) with ECC & TIEZA permits.",
                                "Operator of a proven boutique resort with 10 kVA solar, first “Retiree Philippines” in Palawan.",
                                "Expanding into modular villas for sale with full compliance and rental pool management."
                            ]}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default BusinessModel;