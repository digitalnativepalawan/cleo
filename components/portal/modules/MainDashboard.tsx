import React from 'react';
import { INITIAL_PROJECTS } from '../../../data/mockData';

const MainDashboard: React.FC<{
    onProjectSelect: (projectId: string) => void;
}> = ({ onProjectSelect }) => {
     return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Dashboard</h2>
            <p className="mb-6 text-gray-600">Select a project from the sidebar to manage tasks, budgets, and other resources.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INITIAL_PROJECTS.map(project => (
                    <button 
                        key={project.id} 
                        onClick={() => onProjectSelect(project.id)}
                        className="p-4 border rounded-lg text-left hover:bg-gray-50 hover:border-blue-500 transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">{project.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Click to view details</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MainDashboard;
