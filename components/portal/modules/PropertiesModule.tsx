import React from 'react';
import type { UserRole } from '../../Portal';

const PropertiesModule: React.FC<{
    role: UserRole;
    showToast: (msg: string) => void;
}> = ({ role, showToast }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80 min-h-[300px] flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Properties Management</h2>
        <p className="text-gray-500">The properties module is under construction.</p>
        <p className="text-sm text-gray-400 mt-1">A map and list of property assets will be available here.</p>
    </div>
);

export default PropertiesModule;
