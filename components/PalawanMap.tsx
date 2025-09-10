import React from 'react';

export const PalawanMap: React.FC = () => {
    return (
        <div className="bg-white rounded-lg h-full flex flex-col items-center justify-center p-2 relative overflow-hidden">
             <svg className="w-full h-full" viewBox="0 0 150 250" preserveAspectRatio="xMidYMid meet">
                {/* Palawan Island Shape (Stylized) */}
                <path
                    d="M90,245 C70,190 70,140 85,70 L90,25 L95,70 C110,140 110,190 90,245 Z"
                    fill="#F3F4F6"
                    stroke="#E5E7EB"
                    strokeWidth="1"
                />

                {/* Highlighted Corridor */}
                 <rect 
                    x="70" 
                    y="60" 
                    width="40" 
                    height="70" 
                    rx="20" 
                    ry="20" 
                    fill="#BFDBFE"
                    fillOpacity="0.7"
                />
                <text x="90" y="90" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#1E40AF" textAnchor="middle">
                    SV–Lumambong
                </text>
                 <text x="90" y="100" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#1E40AF" textAnchor="middle">
                    Corridor
                </text>

                {/* Points of Interest */}
                <g>
                    <circle cx="90" cy="210" r="4" fill="white" stroke="#374151" strokeWidth="1.5"/>
                    <text x="83" y="214" fontFamily="sans-serif" fontSize="8" fill="#121212" fontWeight="600" textAnchor="end">PPS</text>
                </g>

                <g>
                    <circle cx="90" cy="120" r="4" fill="white" stroke="#374151" strokeWidth="1.5"/>
                    <text x="97" y="115" fontFamily="sans-serif" fontSize="8" fill="#121212" fontWeight="600">SV Airport</text>
                </g>

                <g>
                    <circle cx="90" cy="50" r="4" fill="white" stroke="#374151" strokeWidth="1.5"/>
                    <text x="83" y="45" textAnchor="end" fontFamily="sans-serif" fontSize="8" fill="#121212" fontWeight="600">El Nido</text>
                </g>
            </svg>
            <div className="absolute bottom-2 left-2 right-2 flex justify-center items-center space-x-2 z-10">
                <span className="text-[10px] font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">Air Access</span>
                <span className="text-[10px] font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full border border-yellow-200">Road Links</span>
                <span className="text-[10px] font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200">Tourism Flow</span>
            </div>
        </div>
    );
};