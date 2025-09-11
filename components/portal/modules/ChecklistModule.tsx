import React from 'react';
import type { UserRole } from '../../Portal';

const ChecklistModule: React.FC<{
    project: { id: string; name: string };
    role: UserRole;
    showToast: (msg: string) => void;
}> = ({ project, role, showToast }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80 min-h-[300px] flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{project.name}</h2>
        <p className="text-gray-500">The checklist module is under construction.</p>
         <p className="text-sm text-gray-400 mt-1">Compliance items and statuses will be displayed here.</p>
    </div>
);

export default ChecklistModule;
