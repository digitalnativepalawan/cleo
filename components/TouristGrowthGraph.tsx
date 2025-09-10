import React from 'react';

export const TouristGrowthGraph: React.FC = () => {
    const data = [
        { year: 2024, value: 100 },
        { year: 2025, value: 112 },
        { year: 2026, value: 125 },
        { year: 2027, value: 140 },
        { year: 2028, value: 157 },
        { year: 2029, value: 176 },
        { year: 2030, value: 197 },
    ];

    const svgWidth = 320;
    const svgHeight = 200;
    // Inner padding for the chart area to accommodate labels
    const padding = { top: 20, right: 20, bottom: 30, left: 35 };
    
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const minYear = 2024;
    const maxYear = 2030;
    const minYValue = 90;
    const maxYValue = 205;

    const xScale = (year: number) => padding.left + ((year - minYear) / (maxYear - minYear)) * chartWidth;
    const yScale = (value: number) => (svgHeight - padding.bottom) - ((value - minYValue) / (maxYValue - minYValue)) * chartHeight;

    const polylinePoints = data.map(d => `${xScale(d.year)},${yScale(d.value)}`).join(' ');

    const yAxisLabels = [];
    for (let i = minYValue; i <= maxYValue; i += 15) {
        yAxisLabels.push(i);
    }

    return (
        <div className="bg-white p-4 rounded-lg h-full flex flex-col">
            <h4 className="text-center font-medium text-xs text-[#5B6470] mb-2">Projected Foreign Arrivals (Indexed, 2024=100)</h4>
            
            <div className="flex-grow relative">
                <div className="absolute top-2 right-2 z-10">
                    <span className="text-[12px] font-semibold bg-[#EAF2FF] text-[#0A84FF] px-2.5 py-1 rounded-full">
                        +12% CAGR
                    </span>
                </div>
                <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet" role="figure" aria-labelledby="chart-title">
                    <title id="chart-title">A line chart showing projected foreign arrivals from 2024 to 2030, indexed with 2024 as 100.</title>
                    <g aria-hidden="true">
                        {/* Grid lines and Y-Axis Labels */}
                        {yAxisLabels.map(label => (
                            <g key={label}>
                                <line
                                    x1={padding.left}
                                    y1={yScale(label)}
                                    x2={svgWidth - padding.right}
                                    y2={yScale(label)}
                                    stroke="#E5E7EB"
                                    strokeWidth="1"
                                />
                                <text
                                    x={padding.left - 8}
                                    y={yScale(label)}
                                    textAnchor="end"
                                    alignmentBaseline="middle"
                                    className="text-[11px] fill-[#94A3B8]"
                                >
                                    {label}
                                </text>
                            </g>
                        ))}

                        {/* X-Axis Labels */}
                        {data.map(d => (
                             <text
                                key={d.year}
                                x={xScale(d.year)}
                                y={svgHeight - padding.bottom + 15}
                                textAnchor="middle"
                                className="text-[11px] fill-[#94A3B8]"
                            >
                                {d.year}
                            </text>
                        ))}
                    </g>

                    {/* Main line */}
                    <polyline
                        points={polylinePoints}
                        fill="none"
                        stroke="#0A84FF"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />

                    {/* Data Points / Markers */}
                    {data.map(d => (
                         <circle
                            key={d.year}
                            cx={xScale(d.year)}
                            cy={yScale(d.value)}
                            r="3"
                            fill="#0A84FF"
                            stroke="white"
                            strokeWidth="1"
                        />
                    ))}
                </svg>
            </div>
             <p className="text-center text-[10px] text-gray-500 mt-2 px-4">
                Indexed projection for visual clarity. Source: DOT targets; internal forecast @ 12% CAGR.
            </p>
        </div>
    );
};