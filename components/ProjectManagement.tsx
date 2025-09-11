import React, { useState, useMemo, ReactNode } from 'react';
import type { UserRole } from './Portal';

import {
    FolderIcon, UserCircleIcon, LogoutIcon, ChevronRightIcon,
    DownloadIcon, ArchiveIcon
} from './portal/PortalIcons';

import { INITIAL_PROJECTS } from '../data/mockData';
import MainDashboard from './portal/modules/MainDashboard';
import GenericProjectModule from './portal/modules/GenericProjectModule';
import ChecklistModule from './portal/modules/ChecklistModule';
import PropertiesModule from './portal/modules/PropertiesModule';
import VincenteHouseModule from './portal/modules/VincenteHouseModule';
import BlogManagementModule from './BlogManagementModule';
import type { BlogPost } from '../App';

// --- UI COMPONENTS ---

const Pill: React.FC<{ text: string; colorClass: string; }> = ({ text, colorClass }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {text}
    </span>
);

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
    const colorMap: Record<string, string> = {
        'Active': 'bg-blue-100 text-blue-800',
        'Planned': 'bg-gray-100 text-gray-800',
        'On Hold': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800',
    };
    return <Pill text={status} colorClass={colorMap[status] || 'bg-gray-100 text-gray-800'} />;
};

const SidePanel: React.FC<{
    project: { id: string; name: string };
    role: UserRole;
}> = ({ project, role }) => {
    const totalCost = 1_250_000;
    const progress = 65;
    const teamMembers = ['David', 'John', 'JR', 'Leo'];

    return (
        <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Project Overview</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Project Name</span>
                        <span className="font-medium text-gray-800">{project.name}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <StatusPill status="Active" />
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-500">Total Budget</span>
                        <span className="font-medium text-gray-800">₱{totalCost.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Progress</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                         <p className="text-right text-xs text-gray-500 mt-1">{progress}% Complete</p>
                    </div>
                </div>
            </div>
             <div className="bg-white p-5 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Team</h3>
                <div className="flex flex-wrap gap-2">
                    {teamMembers.map(member => (
                        <span key={member} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{member}</span>
                    ))}
                </div>
            </div>
             {role === 'admin' && (
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">Admin Actions</h3>
                    <div className="space-y-2">
                         <button className="w-full text-left flex items-center gap-2 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <DownloadIcon className="h-4 w-4"/> Export Project Data
                        </button>
                         <button className="w-full text-left flex items-center gap-2 text-sm text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                            <ArchiveIcon className="h-4 w-4"/> Archive Project
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- MAIN WORKSPACE COMPONENT ---

export const ProjectsWorkspace: React.FC<{
    role: UserRole;
    onSignOut: () => void;
    blogPosts: BlogPost[];
    setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}> = ({ role, onSignOut, blogPosts, setBlogPosts }) => {
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

    const activeProject = useMemo(() => INITIAL_PROJECTS.find(p => p.id === activeProjectId), [activeProjectId]);

    const showToast = (msg: string) => {
        // In a real app, this would trigger a toast notification system.
        console.log(`TOAST: ${msg}`);
    };

    const renderModule = () => {
        if (!activeProject) {
            return <MainDashboard onProjectSelect={setActiveProjectId} />;
        }
        
        switch (activeProject.id) {
            case 'project-vincente':
                return <VincenteHouseModule project={activeProject} role={role} showToast={showToast} />;
            case 'project-blog':
                return <BlogManagementModule role={role} showToast={showToast} posts={blogPosts} setPosts={setBlogPosts} />;
            case 'project-properties':
                return <PropertiesModule role={role} showToast={showToast} />;
            case 'project-sec':
            case 'project-bir':
                return <ChecklistModule project={activeProject} role={role} showToast={showToast} />;
            default:
                return <GenericProjectModule project={activeProject} role={role} showToast={showToast} />;
        }
    };
    
    return (
        <div className="flex h-full bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
                <div className="h-16 flex-shrink-0 px-4 flex items-center border-b">
                    <FolderIcon className="h-6 w-6 text-blue-600" />
                    <span className="ml-2 font-semibold text-lg text-gray-800">Projects</span>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                    {INITIAL_PROJECTS.map(project => (
                        <button
                            key={project.id}
                            onClick={() => setActiveProjectId(project.id)}
                            className={`w-full text-left flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                activeProjectId === project.id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <ChevronRightIcon className={`h-4 w-4 mr-2 transform transition-transform ${activeProjectId === project.id ? 'rotate-90' : ''}`} />
                            {project.name}
                        </button>
                    ))}
                </nav>
                <div className="flex-shrink-0 p-4 border-t">
                    <div className="flex items-center mb-4">
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800 capitalize">{role}</p>
                            <p className="text-xs text-gray-500">Logged In</p>
                        </div>
                    </div>
                    <button
                        onClick={onSignOut}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <LogoutIcon />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="h-16 flex-shrink-0 px-6 flex items-center justify-between border-b bg-white z-10">
                    <h1 className="text-xl font-semibold text-gray-900">{activeProject?.name || 'Dashboard'}</h1>
                </header>
                <div className="flex-1 overflow-y-auto">
                    {activeProject ? (
                        <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                            <div className="xl:col-span-2">
                                {renderModule()}
                            </div>
                            <aside className="xl:col-span-1 xl:sticky xl:top-6">
                                <SidePanel project={activeProject} role={role} />
                            </aside>
                        </div>
                    ) : (
                        <div className="p-6">{renderModule()}</div>
                    )}
                </div>
            </main>
        </div>
    );
};
