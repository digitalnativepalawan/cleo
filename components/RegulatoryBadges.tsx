import React from 'react';

const Badge = ({ text }: { text: string }) => (
    <div 
        className="flex items-center justify-center bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold rounded-lg"
        style={{ width: '80px', height: '36px' }}
    >
        {text}
    </div>
);

export const RegulatoryBadges: React.FC = () => {
    return (
        <div className="flex flex-wrap gap-2 justify-center items-center">
            <Badge text="SEC" />
            <Badge text="ECC" />
            <Badge text="TIEZA" />
            <Badge text="SIRV" />
        </div>
    );
};