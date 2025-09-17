import React, { useState, useMemo } from 'react';
import type { UserRole } from './Portal';

import {
    FolderIcon, UserCircleIcon, LogoutIcon, ChevronRightIcon,
    DownloadIcon, ArchiveIcon, XIcon, MenuIcon, CloudDownloadIcon
} from './portal/PortalIcons';

import { 
    INITIAL_PROJECTS, 
    calculateWeeklyTotals, 
    calculateAllProjectsWeeklyTotals,
    calculateLifetimeTotals,
    calculateAllProjectsLifetimeTotals
} from '../src/lib/data';
import MainDashboard from './portal/modules/MainDashboard';
import ProjectModule from './portal/modules/VincenteHouseModule'; // ✅ Correct path
import BlogManagementModule from './BlogManagementModule';
import type { BlogPost } from '../src/types';
import type { ProjectData } from '../src/types/portal';

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

// --- SIDE PANEL ---

interface SidePanelProps {
    project: { id: string; name: string };
    role: UserRole;
    projectData: ProjectData | null;
}

const SidePanel: React.FC<SidePanelProps> = ({ project, role, projectData }) => {
    const totalCost = 1_250_000;
    const progress = 65;
    const teamMembers = ['David', 'John', 'JR', 'Leo'];
    
    // CSV Export Helpers
    const convertToCSV = (data: any[]) => {
        if (!data || data.length === 0) return '';
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        for (const row of data) {
            const values = headers.map(header => {
                const rawValue = row[header];
                let cell = rawValue === null || rawValue === undefined ? '' : rawValue;
                if (typeof cell === 'object') cell = JSON.stringify(cell);
                cell = String(cell).replace(/"/g, '""');
                if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
                return cell;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    };

    const downloadCSV = (csvContent: string, fileName: string) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleExportData = () => {
        if (!projectData) return;
        const { tasks, labor, materials } = projectData;
        const projectName = project.id.replace('project-', '');
        if (tasks.length > 0) downloadCSV(convertToCSV(tasks), `${projectName}-tasks.csv`);
        if (labor.length > 0) downloadCSV(convertToCSV(labor), `${projectName}-labor.csv`);
        if (materials.length > 0) downloadCSV(convertToCSV(materials), `${projectName}-materials.csv`);
    };

    return (
        <div className="space-y-6">
            <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-[var(--border-primary)]">
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
                        <span className="font-medium text-gray-800 tabular-nums">₱{totalCost.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Progress</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-right text-xs text-gray-500 mt-1 tabular-nums">{progress}% Complete</p>
                    </div>
                </div>
            </div>
            <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-[var(--border-primary)]">
                <h3 className="font-semibold text-gray-800 mb-4">Team</h3>
                <div className="flex flex-wrap gap-2">
                    {teamMembers.map(member => (
                        <span key={member} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{member}</span>
                    ))}
                </div>
            </div>
            {role === 'admin' && (
                <div className="bg-[var(--bg-primary)] p-5 rounded-xl border border-[var(--border-primary)]">
                    <h3 className="font-semibold text-gray-800 mb-4">Admin Actions</h3>
                    <div className="space-y-2">
                        <button onClick={handleExportData} className="w-full text-left flex items-center gap-2 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <DownloadIcon className="h-4 w-4"/> Export Project Data
                        </button>
                        <a 
                            href="https://drive.google.com/drive/folders/1r2Ip6-Sna_F1IIRmaakiWC1Pcru4z_RM?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-left flex items-center gap-2 text-sm text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <CloudDownloadIcon className="h-4 w-4"/> Download Project CVs
                        </a>
                        <button className="w-full text-left flex items-center gap-2 text-sm text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                            <ArchiveIcon className="h-4 w-4"/> Archive Project
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN WORKSPACE ---

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

    const lifetimeTotals = useMemo(() => {
        if (!activeProjectId) return calculateAllProjectsLifetimeTotals(projectsData);
        if (projectsData[activeProjectId] && activeProjectId !== 'project-blog') {
            return calculateLifetimeTotals(projectsData[activeProjectId]);
        }
        return { paid: 0, unpaid: 0 };
    }, [activeProjectId, projectsData]);

    const isFinancialView = !activeProjectId || (activeProject && activeProject.id !== 'project-blog');

    const formatHeaderTotal = (value: number): string => {
        const formatter = (val: number) => val.toLocaleString('en-US', { maximumFractionDigits: 1 });
        if (Math.abs(value) >= 1_000_000) return `₱${formatter(value / 1_000_000)}M`;
        if (Math.abs(value) >= 1_000) return `₱${formatter(value / 1_000)}k`;
        return `₱${value.toLocaleString('en-US')}`;
    };

    const showToast = (msg: string) => console.log(`TOAST: ${msg}`);

    const handleUpdateProjectData = (updatedData: ProjectData) => {
        if (activeProjectId) {
            setProjectsData(prev => ({ ...prev, [activeProjectId]: updatedData }));
        }
    };

    const renderModule = () => {
        if (!activeProject || !activeProjectData) return <MainDashboard onProjectSelect={setActiveProjectId} />;
        if (activeProject.id === 'project-blog') {
            return <BlogManagementModule role={role} showToast={showToast} posts={blogPosts} setPosts={setBlogPosts} />;
        }
        return <ProjectModule project={activeProject} role={role} showToast={showToast} projectData={activeProjectData} onUpdateProjectData={handleUpdateProjectData} />;
    };

    return (
        <div className="h-full bg-[var(--bg-secondary)] flex flex-col">
            {/* Header */}
            <header className="h-16 flex-shrink-0 px-4 sm:px-6 grid grid-cols-3 items-center border-b bg-[var(--bg-primary)] z-20">
                <div className="flex items-center justify-start">
                    <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-500 hover:text-gray-800" aria-label="Open projects menu">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex items-center justify-center gap-4 sm:gap-6 text-center">
                    {isFinancialView && (
                        <>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Paid</div>
                                <div className="text-base sm:text-lg font-semibold text-green-600 tabular-nums">
                                    {formatHeaderTotal(lifetimeTotals.paid)}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Unpaid</div>
                                <div className="text-base sm:text-lg font-semibold text-red-600 tabular-nums">
                                    {formatHeaderTotal(lifetimeTotals.unpaid)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex justify-end"></div>
            </header>

            {/* Body */}
            <div className="flex flex-1 md:grid md:grid-cols-[256px_1fr] min-h-0 relative">
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
                )}
                <aside className={`absolute top-0 left-0 h-full w-64 bg-[var(--bg-primary)] border-r border-[var(--border-primary)] flex flex-col transform transition-transform duration-300 ease-in-out z-40 md:relative ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="h-16 px-4 flex items-center justify-between border-b">
                        <div className="flex items-center">
                            <FolderIcon className="h-6 w-6 text-[var(--accent-primary)]" />
                            <span className="ml-2 font-semibold text-lg text-gray-800">Projects</span>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-gray-500 hover:text-gray-800" aria-label="Close menu">
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
                                    activeProjectId === project.id ? 'bg-blue-50 text-[var(--accent-primary)]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <ChevronRightIcon className={`h-4 w-4 mr-2 transform transition-transform ${activeProjectId === project.id ? 'rotate-90' : ''}`} />
                                {project.name}
                            </button>
                        ))}
                    </nav>
                    <div className="p-4 border-t">
                        <div className="flex items-center mb-4">
                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800 capitalize">{role}</p>
                                <p className="text-xs text-gray-500">Logged In</p>
                            </div>
                        </div>
                        <button onClick={onSignOut} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <LogoutIcon />
                            Sign Out
                        </button>
                    </div>
                </aside>
                <main className="flex-1 overflow-y-auto min-h-0 md:col-start-2">
                    {activeProject ? (
                        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            <div className="lg:col-span-2">{renderModule()}</div>
                            <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-6">
                                <SidePanel project={activeProject} role={role} projectData={activeProjectData} />
                            </aside>
                        </div>
                    ) : (
                        <div className="p-4 sm:p-6">{renderModule()}</div>
                    )}
                </main>
            </div>
        </div>
    );
};
