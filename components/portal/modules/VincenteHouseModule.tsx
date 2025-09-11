import React, { useState, useMemo } from 'react';
import type { UserRole } from '../../Portal';
import { mockTasks, mockLabor, mockMaterials } from '../../../data/mockData';
import type { Task, Labor, Material, ProjectItem } from '../../../types/portal';
import { PlusIcon, SearchIcon, FilterIcon, PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from '../PortalIcons';

type ActiveTab = 'tasks' | 'labor' | 'materials';

const Pill: React.FC<{ text: string; colorClass: string; }> = ({ text, colorClass }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {text}
    </span>
);

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
    const colorMap: Record<string, string> = {
        'Backlog': 'bg-gray-100 text-gray-800', 'In Progress': 'bg-blue-100 text-blue-800', 'Blocked': 'bg-orange-100 text-orange-800', 'Review': 'bg-purple-100 text-purple-800', 'Done': 'bg-green-100 text-green-800',
    };
    return <Pill text={status} colorClass={colorMap[status] || 'bg-gray-100 text-gray-800'} />;
};

const ProjectToolbar: React.FC<{
    role: UserRole;
    onAdd: () => void;
    itemNoun: string;
}> = ({ role, onAdd, itemNoun }) => {
    return (
        <div className="flex items-center gap-2 w-full">
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
                className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
            >
                <PlusIcon />
                <span>Add {itemNoun}</span>
            </button>
        </div>
    );
};

const VincenteHouseModule: React.FC<{
    project: { id: string; name: string };
    role: UserRole;
    showToast: (msg: string) => void;
}> = ({ project, role, showToast }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [labor, setLabor] = useState<Labor[]>(mockLabor);
    const [materials, setMaterials] = useState<Material[]>(mockMaterials);
    
    const [sortConfig, setSortConfig] = useState<{ key: keyof ProjectItem; direction: 'ascending' | 'descending' } | null>(null);

    const sortedData = useMemo(() => {
        let sortableItems: any[] = [];
        if (activeTab === 'tasks') sortableItems = [...tasks];
        if (activeTab === 'labor') sortableItems = [...labor];
        if (activeTab === 'materials') sortableItems = [...materials];

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [tasks, labor, materials, activeTab, sortConfig]);

    const requestSort = (key: keyof ProjectItem) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof ProjectItem) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ChevronDownIcon className="h-3 w-3 opacity-0 group-hover:opacity-50" />;
        }
        return sortConfig.direction === 'ascending' ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />;
    };

    const TABS: { id: ActiveTab; label: string; count: number }[] = [
        { id: 'tasks', label: 'Tasks', count: tasks.length },
        { id: 'labor', label: 'Labor', count: labor.length },
        { id: 'materials', label: 'Materials', count: materials.length },
    ];
    
    const TASK_COLUMNS = [ { key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }, { key: 'dueDate', label: 'Due Date' }, { key: 'cost', label: 'Cost' } ];
    const LABOR_COLUMNS = [ { key: 'workers', label: 'Name' }, { key: 'startDate', label: 'Date' }, { key: 'qty', label: 'Hours' }, { key: 'cost', label: 'Total (₱)' } ];
    const MATERIAL_COLUMNS = [ { key: 'item', label: 'Item' }, { key: 'supplier', label: 'Supplier' }, { key: 'received', label: 'Received' }, { key: 'totalCost', label: 'Total Cost' } ];
    
    const renderTable = () => {
        const columns = activeTab === 'tasks' ? TASK_COLUMNS : activeTab === 'labor' ? LABOR_COLUMNS : MATERIAL_COLUMNS;
        const data = sortedData;

        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            {columns.map(col => (
                                <th key={col.key} scope="col" className="px-6 py-3">
                                     <button onClick={() => requestSort(col.key as keyof ProjectItem)} className="flex items-center gap-1 group">
                                        {col.label} {getSortIcon(col.key as keyof ProjectItem)}
                                    </button>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                {columns.map(col => (
                                    <td key={col.key} className="px-6 py-4">
                                        { col.key === 'status' ? <StatusPill status={item[col.key]}/>
                                        : col.key === 'received' ? (item[col.key] ? <CheckCircleIcon className="text-green-500"/> : <ClockIcon className="text-gray-400"/>)
                                        : col.key === 'cost' || col.key === 'totalCost' ? `₱${item[col.key].toLocaleString()}`
                                        : item[col.key] }
                                    </td>
                                ))}
                                <td className="px-6 py-4 flex justify-end gap-2">
                                    <button className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon /></button>
                                    <button className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div className="flex border-b border-gray-200">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.label}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
                 <div className="w-full sm:w-auto">
                    <ProjectToolbar role={role} onAdd={() => {}} itemNoun={activeTab.slice(0, -1)} />
                </div>
            </div>
            
            {renderTable()}
        </div>
    );
};

export default VincenteHouseModule;
