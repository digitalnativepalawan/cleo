import React from 'react';
import { PlaneIcon } from './icons/PlaneIcon';
import { RoadIcon } from './icons/RoadIcon';
import { DropletsIcon } from './icons/DropletsIcon';
import { HardHatIcon } from './icons/HardHatIcon';

export const InfrastructureTimeline: React.FC = () => {
    const milestones = [
        { icon: <PlaneIcon className="w-5 h-5" />, label: "Airport Ready", position: '10%' },
        { icon: <DropletsIcon className="w-5 h-5" />, label: "Water Ready", position: '20%' },
        { icon: <RoadIcon className="w-5 h-5" />, label: "Roads Upgraded", position: '45%' },
        { icon: <HardHatIcon className="w-5 h-5" />, label: "New Units & Infra", position: '65%' },
    ];

    const years = [
        { year: '2025', position: '5%' },
        { year: '2026', position: '45%' },
        { year: '2028', position: '95%' },
    ];

    return (
        <div className="bg-white p-4 rounded-lg h-full flex flex-col justify-center">
            <h4 className="text-center font-medium text-xs text-[#5B6470] mb-6">Corridor Upgrade Timeline</h4>
            <div className="w-full">
                <div className="relative pt-10 pb-10"> {/* Provide vertical space */}
                    {/* Timeline Bar */}
                    <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-gray-200 rounded-full">
                        <div className="h-1 bg-gradient-to-r from-blue-300 to-[#0A84FF] rounded-full"></div>
                    </div>

                    {/* Milestones */}
                    {milestones.map((m, index) => {
                        const isAbove = index % 2 === 0;
                        return (
                            <div
                                key={m.label}
                                className={`absolute flex items-center z-10 text-center ${isAbove ? 'flex-col-reverse bottom-1/2 mb-2' : 'flex-col top-1/2 mt-2'}`}
                                style={{ left: m.position, transform: 'translateX(-50%)' }}
                            >
                                <div className="h-8 w-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[#0A84FF] flex-shrink-0">
                                    {m.icon}
                                </div>
                                <span className="text-[10px] font-semibold text-[#121212] mt-1.5 whitespace-nowrap">{m.label}</span>
                            </div>
                        );
                    })}

                    {/* Year Markers - consistently below the line */}
                    {years.map(y => (
                        <div
                            key={y.year}
                            className="absolute top-1/2 mt-4" // Positioned below the timeline bar
                            style={{ left: y.position, transform: 'translateX(-50%)' }}
                        >
                            <span className="text-xs text-[#94A3B8] font-medium">{y.year}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
