import React, { useState, useEffect, useRef, ReactNode, useCallback, useMemo } from 'react';
import type { UserRole } from './Portal';
import type { BlogPost } from '../App';

import {
    PlusIcon, UploadIcon, DownloadIcon, PencilIcon, TrashIcon, SearchIcon, FilterIcon, CalendarIcon, DotsVerticalIcon,
    ArchiveIcon, EyeIcon, ChevronDownIcon, CheckCircleIcon, ClockIcon, BanIcon, DocumentTextIcon, FolderIcon,
    UserCircleIcon, CogIcon, LogoutIcon, ChevronRightIcon, TableIcon, ViewGridIcon, XIcon, DotsHorizontalIcon, ChevronUpIcon,
    ImageIcon, DriveIcon
} from './portal/PortalIcons';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import BlogManagementModule from './BlogManagementModule';


// --- DATA TYPES & MOCK DATA ---

type ProjectStatus = 'Active' | 'Planned' | 'On Hold' | 'Completed';
type PropertyTenure = 'Titled' | 'Tax Dec' | 'Leasehold';
type ChecklistStatus = 'Pending' | 'In Progress' | 'Submitted' | 'Approved' | 'Rejected';
export type Attachment = { type: 'image' | 'drive'; value: string; name?: string; };

type TaskStatus = 'Pending' | 'Backlog' | 'In Progress' | 'Blocked' | 'Review' | 'Done';
type TaskType = 'Design' | 'Site Prep' | 'Foundation' | 'Structure' | 'MEP' | 'Finish' | 'Inspection';
type LaborRateType = 'Daily' | 'Hourly' | 'Contract';
type MaterialCategory = 'Aggregates' | 'Timber' | 'Steel' | 'Electrical' | 'Plumbing' | 'Finishes' | 'Fixtures' | 'Other';
type MaterialUnit = 'pc' | 'box' | 'm' | 'sqm' | 'kg' | 'ton';

interface BaseItem {
    id: string;
    projectId: string;
    attachment?: Attachment;
    notes: string;
    paid: boolean;
}

interface Task extends BaseItem {
    name: string;
    type: TaskType;
    status: TaskStatus;
    owner: string;
    startDate: string;
    dueDate: string;
    estHours: number;
    actualHours?: number;
    cost: number;
    tags: string[];
    order: number;
}

interface Labor extends BaseItem {
    crewRole: string;
    workers: string;
    rateType: LaborRateType;
    rate: number;
    qty: number;
    cost: number; // Calculated
    supplier: string;
    startDate: string;
    endDate: string;
}

interface Material extends BaseItem {
    item: string;
    category: MaterialCategory;
    unit: MaterialUnit;
    qty: number;
    unitCost: number;
    totalCost: number; // Calculated
    supplier: string;
    leadTimeDays: number;
    deliveryEta: string;
    received: boolean;
    location: 'Site' | 'Warehouse';
}

type ProjectItem = Task | Labor | Material;

const MOCK_PROJECT_ID = 'project-vincente';

const mockTasks: Omit<Task, 'id'>[] = [
    { projectId: MOCK_PROJECT_ID, name: 'install hardiflex then paint white', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 0, notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, name: 'install metal furring after paint', type: 'Structure', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 1, notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, name: 'cover ceiling gaps', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 2, notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, name: 'run wire in ground', type: 'MEP', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 3, notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, name: 'paint hardiflex', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 4, notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, name: 'paint walls', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 5, notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, name: 'paint metal furrings', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 6, notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, name: 'trim coco trees', type: 'Site Prep', status: 'Done', owner: '', startDate: '', dueDate: '2025-09-01', estHours: 0, cost: 0, tags: [], order: 7, notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, name: 'fix leak in roof', type: 'Structure', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-30', estHours: 0, cost: 0, tags: [], order: 8, notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, name: 'clear clean front property', type: 'Site Prep', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-30', estHours: 0, cost: 0, tags: [], order: 9, notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, name: 'door sealant', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-29', estHours: 0, cost: 0, tags: [], order: 10, notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, name: 'door sealant', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-29', estHours: 0, cost: 0, tags: [], order: 11, notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, name: 'paint/sand metal', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-28', estHours: 0, cost: 0, tags: [], order: 12, notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, name: 'clean metal ceiling', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-28', estHours: 0, cost: 0, tags: [], order: 13, notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, name: 'door padding', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-26', estHours: 0, cost: 0, tags: [], order: 14, notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, name: 'door padding', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-26', estHours: 0, cost: 0, tags: [], order: 15, notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, name: 'window seal', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-25', estHours: 0, cost: 0, tags: [], order: 16, notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, name: 'window seal', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-25', estHours: 0, cost: 0, tags: [], order: 17, notes: '', paid: true },
];

const mockLabor: Omit<Labor, 'id'>[] = [
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-25', endDate: '2025-08-25', notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-25', endDate: '2025-08-25', notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-26', endDate: '2025-08-26', notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-26', endDate: '2025-08-26', notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-28', endDate: '2025-08-28', notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-28', endDate: '2025-08-28', notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-29', endDate: '2025-08-29', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-29', endDate: '2025-08-29', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-30', endDate: '2025-08-30', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-30', endDate: '2025-08-30', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 4, cost: 250, supplier: 'Local', startDate: '2025-09-01', endDate: '2025-09-01', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 0, cost: 0, supplier: 'Local', startDate: '2025-09-01', endDate: '2025-09-01', notes: '', paid: true },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-02', endDate: '2025-09-02', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-02', endDate: '2025-09-02', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-03', endDate: '2025-09-03', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-03', endDate: '2025-09-03', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-04', endDate: '2025-09-04', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-04', endDate: '2025-09-04', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-05', endDate: '2025-09-05', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-05', endDate: '2025-09-05', notes: '', paid: false },
];

const mockMaterials: Omit<Material, 'id'>[] = [
    { projectId: MOCK_PROJECT_ID, item: 'Primer Epoxy Paint set', category: 'Finishes', unit: 'pc', qty: 2, unitCost: 450, totalCost: 900, supplier: 'Local Hardware', leadTimeDays: 1, deliveryEta: '2025-09-01', received: false, location: 'Site', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, item: 'Roll Brush #2', category: 'Finishes', unit: 'pc', qty: 6, unitCost: 55, totalCost: 330, supplier: 'Local Hardware', leadTimeDays: 1, deliveryEta: '2025-09-01', received: false, location: 'Site', notes: '', paid: false },
    { projectId: MOCK_PROJECT_ID, item: 'White Wall Paint', category: 'Finishes', unit: 'pc', qty: 1, unitCost: 700, totalCost: 700, supplier: 'Local Hardware', leadTimeDays: 1, deliveryEta: '2025-09-01', received: false, location: 'Site', notes: '', paid: false },
];


const INITIAL_PROJECTS = [
    { id: 'project-vincente', name: 'Vincente House' },
    { id: 'project-elnido', name: 'El Nido' },
    { id: 'project-farm', name: 'Lumambong Farm' },
    { id: 'project-properties', name: 'Properties' },
    { id: 'project-sec', name: 'SEC Checklist' },
    { id: 'project-bir', name: 'BIR Checklist' },
    { id: 'project-blog', name: 'Blog Management' },
];

// --- MODULE CONFIGURATIONS ---

const TASK_COLUMNS = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'owner', label: 'Owner', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { key: 'cost', label: 'Cost', sortable: true, format: (c: number) => `₱${(c || 0).toLocaleString()}` },
];

const LABOR_COLUMNS = [
    { key: 'workers', label: 'Name', sortable: true },
    { key: 'startDate', label: 'Date', sortable: true },
    { key: 'qty', label: 'Hours', sortable: true },
    { key: 'rate', label: 'Rate (₱/h)', sortable: true, format: (r: number) => `₱${(r || 0).toFixed(2)}` },
    { key: 'cost', label: 'Total (₱)', sortable: true, format: (c: number) => `₱${(c || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
];

const MATERIAL_COLUMNS = [
    { key: 'item', label: 'Item', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'supplier', label: 'Supplier', sortable: true },
    { key: 'received', label: 'Received', sortable: true, format: (r: boolean) => r ? <CheckCircleIcon className="text-green-500"/> : <ClockIcon className="text-gray-400"/> },
    { key: 'totalCost', label: 'Total Cost', sortable: true, format: (c: number) => `₱${(c || 0).toLocaleString()}` },
];

// --- HELPER & UI COMPONENTS ---

const Pill: React.FC<{ text: string; colorClass: string; }> = ({ text, colorClass }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {text}
    </span>
);

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
    const colorMap: Record<string, string> = {
        'Backlog': 'bg-gray-100 text-gray-800', 'In Progress': 'bg-blue-100 text-blue-800', 'Blocked': 'bg-orange-100 text-orange-800', 'Review': 'bg-purple-100 text-purple-800', 'Done': 'bg-green-100 text-green-800',
        'Active': 'bg-blue-100 text-blue-800', 'Planned': 'bg-gray-100 text-gray-800', 'Pending': 'bg-gray-100 text-gray-800', 'On Hold': 'bg-yellow-100 text-yellow-800', 'Submitted': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800', 'Approved': 'bg-green-100 text-green-800', 'Available': 'bg-green-100 text-green-800', 'Rejected': 'bg-red-100 text-red-800', 'Sold': 'bg-red-100 text-red-800', 'Reserved': 'bg-purple-100 text-purple-800',
    };
    return <Pill text={status} colorClass={colorMap[status] || 'bg-gray-100 text-gray-800'} />;
};

const Modal: React.FC<{ children: ReactNode; onClose: () => void; size?: 'md' | 'lg' | 'xl' | '2xl' }> = ({ children, onClose, size = 'lg' }) => {
    const sizeMap = { md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl' };
    return (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose} aria-modal="true" role="dialog">
            <div className={`bg-white rounded-xl shadow-xl w-full ${sizeMap[size]} m-auto`} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

const Toast: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);
    return (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up">
            {message}
        </div>
    );
};

const ProjectToolbar: React.FC<{
    role: UserRole;
    onAdd: () => void;
    itemNoun: string;
    activeModule: 'tasks' | 'labor' | 'materials';
}> = ({ role, onAdd, itemNoun }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
                {/* Placeholder for title or breadcrumbs if needed */}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white focus:border-blue-500" />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <FilterIcon className="h-4 w-4" />
                    <span>Filter</span>
                </button>
                <button 
                    onClick={onAdd} 
                    disabled={role !== 'admin'}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <PlusIcon />
                    <span>Add {itemNoun}</span>
                </button>
            </div>
        </div>
    );
};

const SidePanel: React.FC<{
    project: { id: string; name: string };
    role: UserRole;
    isDataEmpty: boolean;
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

const ItemFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Partial<ProjectItem>) => void;
    item: Partial<ProjectItem> | null;
    moduleType: 'tasks' | 'labor' | 'materials';
}> = ({ isOpen, onClose, onSave, item, moduleType }) => {
    const [formData, setFormData] = useState<Partial<ProjectItem> | null>(item);

    useEffect(() => {
        setFormData(item);
    }, [item]);

    if (!isOpen || !formData) return null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checked = (