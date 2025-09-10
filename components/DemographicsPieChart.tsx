import React from 'react';

export const DemographicsPieChart: React.FC = () => {
    const segments = [
        { color: '#0A84FF', percentage: 35, name: 'China' },
        { color: '#3B82F6', percentage: 25, name: 'S. Korea' },
        { color: '#60A5FA', percentage: 20, name: 'Europe' },
        { color: '#93C5FD', percentage: 15, name: 'N. America' },
        { color: '#BFDBFE', percentage: 5, name: 'Other' },
    ];
    
    const radius = 23;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;
    const gapPercentage = 1.5;

    return (
        <div className="bg-white p-4 rounded-lg h-full flex flex-col justify-center">
             <h4 className="text-center font-medium text-xs text-[#5B6470] mb-2">Illustrative HNWI Nationality Mix</h4>
            <div className="flex items-center justify-center gap-4">
                <div className="relative w-28 h-28 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 60 60">
                        {segments.map((segment, index) => {
                            const arcPercentage = segment.percentage - gapPercentage;
                            const strokeDashoffset = circumference - (circumference * Math.max(0, arcPercentage) / 100);
                            
                            // Each segment is rotated from the top. Half a gap is added to center the arc.
                            const rotation = accumulatedPercentage * 3.6 + (gapPercentage * 3.6 / 2);
                            accumulatedPercentage += segment.percentage;

                            return (
                                <circle 
                                    key={index} 
                                    cx="30" cy="30" r={radius}
                                    fill="transparent" 
                                    stroke={segment.color} 
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    transform={`rotate(${rotation - 90} 30 30)`}
                                />
                            );
                        })}
                    </svg>
                </div>
                <ul className="space-y-1.5 text-xs">
                    {segments.map(s => (
                         <li key={s.name} className="flex items-center justify-between w-32">
                            <div className="flex items-center overflow-hidden">
                                <span className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: s.color }}></span>
                                <span className="font-medium text-[#121212] truncate">{s.name}</span>
                            </div>
                            <span className="font-normal text-[#5B6470]">{s.percentage}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};