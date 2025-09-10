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
{/* FIX: File was corrupted. Restored ItemFormModal and other missing components. */}
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
        setFormData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
            };
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal onClose={onClose} size="2xl">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {item && 'id' in item && item.id ? 'Edit' : 'Add'} {moduleType.slice(0, -1)}
                </h3>
                <p>Form content placeholder. This component was recovered from a corrupted file.</p>
            </div>
             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" onClick={handleSubmit} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                    Save
                </button>
                <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                    Cancel
                </button>
            </div>
        </Modal>
    );
};

// --- MODULES (Placeholders) ---

const MainDashboard: React.FC<{
    onProjectSelect: (projectId: string) => void;
}> = ({ onProjectSelect }) => {
     return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
            <p className="mb-4 text-gray-600">Select a project from the sidebar to manage tasks, budgets, and other resources.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INITIAL_PROJECTS.map(project => (
                    <button 
                        key={project.id} 
                        onClick={() => onProjectSelect(project.id)}
                        className="p-4 border rounded-lg text-left hover:bg-gray-50 hover:border-blue-500 transition-all group"
                    >
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">{project.name}</h3>
                    </button>
                ))}
            </div>
        </div>
    );
};

const GenericProjectModule: React.FC<{
    project: { id: string; name: string };
    role: UserRole;
    showToast: (msg: string) => void;
}> = ({ project, role, showToast }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">{project.name}</h2>
            <p>This is a generic project module. Content to be added.</p>
        </div>
    );
};

const ChecklistModule: React.FC<{
    project: { id: string; name: string };
    role: UserRole;
    showToast: (msg: string) => void;
}> = ({ project, role, showToast }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">{project.name} Checklist</h2>
        <p>This is the checklist module. Content to be added.</p>
    </div>
);

const PropertiesModule: React.FC<{
    role: UserRole;
    showToast: (msg: string) => void;
}> = ({ role, showToast }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Properties Management</h2>
        <p>This is the properties module. Content to be added.</p>
    </div>
);

// --- MAIN WORKSPACE COMPONENT ---

export const ProjectsWorkspace: React.FC<{
    role: UserRole;
    onSignOut: () => void;
    blogPosts: BlogPost[];
    setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}> = ({ role, onSignOut, blogPosts, setBlogPosts }) => {
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const activeProject = useMemo(() => INITIAL_PROJECTS.find(p => p.id === activeProjectId), [activeProjectId]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
    };

    const renderModule = () => {
        if (!activeProject) {
            return <MainDashboard onProjectSelect={setActiveProjectId} />;
        }
        
        switch (activeProject.id) {
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
            <main className="flex-1 overflow-y-auto">
                <div className="h-16 flex-shrink-0 px-6 flex items-center justify-between border-b bg-white">
                    <h1 className="text-xl font-semibold text-gray-900">{activeProject?.name || 'Dashboard'}</h1>
                    {/* Toolbar can go here */}
                </div>
                <div className="p-6">
                    {renderModule()}
                </div>
            </main>

            {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
        </div>
    );
};
