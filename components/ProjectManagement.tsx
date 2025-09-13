import React, { useState, useMemo, ReactNode } from 'react';
import type { UserRole } from './Portal';

import {
    FolderIcon, UserCircleIcon, LogoutIcon, ChevronRightIcon,
    DownloadIcon, ArchiveIcon, XIcon, MenuIcon
} from './portal/PortalIcons';

import { INITIAL_PROJECTS, calculateWeeklyTotals, calculateAllProjectsWeeklyTotals } from '../data/mockData';
import MainDashboard from './portal/modules/MainDashboard';
import ProjectModule from './portal/modules/VincenteHouseModule'; // Using VincenteHouseModule as the unified module
import BlogManagementModule from './BlogManagementModule';
import type { BlogPost } from '../App';
import type { ProjectData } from '../types/portal';

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
    projectsData: Record<string, ProjectData>;
    setProjectsData: React.Dispatch<React.SetStateAction<Record<string, ProjectData>>>;
}> = ({ role, onSignOut, blogPosts, setBlogPosts, projectsData, setProjectsData }) => {
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const activeProject = useMemo(() => INITIAL_PROJECTS.find(p => p.id === activeProjectId), [activeProjectId]);
    const activeProjectData = activeProjectId ? projectsData[activeProjectId] : null;

    const weeklyTotals = useMemo(() => {
        if (!activeProjectId) { // Dashboard view
            return calculateAllProjectsWeeklyTotals(projectsData);
        }
        if (projectsData[activeProjectId]) {
            return calculateWeeklyTotals(projectsData[activeProjectId]);
        }
        return { paid: 0, unpaid: 0 };
    }, [activeProjectId, projectsData]);

    const showToast = (msg: string) => {
        // In a real app, this would trigger a toast notification system.
        console.log(`TOAST: ${msg}`);
    };

    const handleUpdateProjectData = (updatedData: ProjectData) => {
        if (activeProjectId) {
            setProjectsData(prev => ({
                ...prev,
                [activeProjectId]: updatedData
            }));
        }
    };

    const renderModule = () => {
        if (!activeProject || !activeProjectData) {
            return <MainDashboard onProjectSelect={setActiveProjectId} />;
        }
        
        if (activeProject.id === 'project-blog') {
            return <BlogManagementModule role={role} showToast={showToast} posts={blogPosts} setPosts={setBlogPosts} />;
        }
        
        // All other projects use the unified ProjectModule
        return <ProjectModule
            project={activeProject}
            role={role}
            showToast={showToast}
            projectData={activeProjectData}
            onUpdateProjectData={handleUpdateProjectData}
        />;
    };
    
    return (
        <div className="h-full bg-gray-50 md:flex">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                 <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <div className="h-16 flex-shrink-0 px-4 flex items-center justify-between border-b">
                    <div className="flex items-center">
                        <FolderIcon className="h-6 w-6 text-blue-600" />
                        <span className="ml-2 font-semibold text-lg text-gray-800">Projects</span>
                    </div>
                     <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-800" aria-label="Close menu">
                        <XIcon className="h-6 w-6"/>
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                    {INITIAL_PROJECTS.map(project => (
                        <button
                            key={project.id}
                            onClick={() => {
                                setActiveProjectId(project.id);
                                setIsSidebarOpen(false);
                            }}
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
            <main className="h-full flex-1 flex flex-col overflow-hidden">
                <header className="h-16 flex-shrink-0 px-6 flex items-center justify-between border-b bg-white z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-800" aria-label="Open projects menu">
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">{activeProject?.name || 'Dashboard'}</h1>
                            <div className="flex items-center gap-4 text-xs mt-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-gray-500">Paid (wk):</span>
                                    <span className="font-semibold text-green-600">₱{weeklyTotals.paid.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-gray-500">Unpaid (wk):</span>
                                    <span className="font-semibold text-red-600">₱{weeklyTotals.unpaid.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto">
                    {activeProject ? (
                        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            <div className="lg:col-span-2">
                                {renderModule()}
                            </div>
                            <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-6">
                                <SidePanel project={activeProject} role={role} />
                            </aside>
                        </div>
                    ) : (
                        <div className="p-4 sm:p-6">{renderModule()}</div>
                    )}
                </div>
            </main>
        </div>
    );
};