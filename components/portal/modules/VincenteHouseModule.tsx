import React, { useState, useMemo } from 'react';
import type { UserRole } from '../../Portal';
import type { Task, Labor, Material, ProjectData, TaskStatus, TaskType, LaborRateType, MaterialCategory, MaterialUnit } from '../../../types/portal';
import {
    PlusIcon, PencilIcon, TrashIcon, XIcon, SearchIcon, FilterIcon,
    CalendarIcon, DotsVerticalIcon, CheckCircleIcon, ClockIcon, BanIcon,
    TableIcon, ViewGridIcon, UploadIcon, ImageIcon, DriveIcon
} from '../PortalIcons';

// Status color mappings
const taskStatusColors: Record<TaskStatus, string> = {
    'Pending': 'bg-gray-100 text-gray-800',
    'Backlog': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Blocked': 'bg-red-100 text-red-800',
    'Review': 'bg-purple-100 text-purple-800',
    'Done': 'bg-green-100 text-green-800',
};

const taskTypeColors: Record<TaskType, string> = {
    'Design': 'bg-pink-100 text-pink-800',
    'Site Prep': 'bg-orange-100 text-orange-800',
    'Foundation': 'bg-gray-100 text-gray-800',
    'Structure': 'bg-blue-100 text-blue-800',
    'MEP': 'bg-yellow-100 text-yellow-800',
    'Finish': 'bg-green-100 text-green-800',
    'Inspection': 'bg-purple-100 text-purple-800',
};

// Utility functions
const simpleId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const StatusPill: React.FC<{ status: string; colorMap: Record<string, string> }> = ({ status, colorMap }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
    </span>
);

// Task Modal Component
const TaskModal: React.FC<{
    task: Partial<Task>;
    onClose: () => void;
    onSave: (task: Partial<Task>) => void;
    role: UserRole;
}> = ({ task, onClose, onSave, role }) => {
    const [formData, setFormData] = useState(task);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{task.id ? 'Edit' : 'Add'} Task</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                        <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select name="type" id="type" value={formData.type || 'Design'} onChange={handleChange} className={inputClass}>
                                <option value="Design">Design</option>
                                <option value="Site Prep">Site Prep</option>
                                <option value="Foundation">Foundation</option>
                                <option value="Structure">Structure</option>
                                <option value="MEP">MEP</option>
                                <option value="Finish">Finish</option>
                                <option value="Inspection">Inspection</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select name="status" id="status" value={formData.status || 'Pending'} onChange={handleChange} className={inputClass}>
                                <option value="Pending">Pending</option>
                                <option value="Backlog">Backlog</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Blocked">Blocked</option>
                                <option value="Review">Review</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input type="date" name="startDate" id="startDate" value={formData.startDate || ''} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input type="date" name="dueDate" id="dueDate" value={formData.dueDate || ''} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                            <input type="text" name="owner" id="owner" value={formData.owner || ''} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="estHours" className="block text-sm font-medium text-gray-700 mb-1">Est. Hours</label>
                            <input type="number" name="estHours" id="estHours" value={formData.estHours || 0} onChange={handleChange} className={inputClass} min="0" step="0.5" />
                        </div>
                        <div>
                            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">Cost (₱)</label>
                            <input type="number" name="cost" id="cost" value={formData.cost || 0} onChange={handleChange} className={inputClass} min="0" step="0.01" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea name="notes" id="notes" rows={3} value={formData.notes || ''} onChange={handleChange} className={inputClass}></textarea>
                    </div>
                </form>
                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="submit" onClick={handleSubmit} disabled={role !== 'admin'} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">Save Task</button>
                </div>
            </div>
        </div>
    );
};

// Labor Modal Component
const LaborModal: React.FC<{
    labor: Partial<Labor>;
    onClose: () => void;
    onSave: (labor: Partial<Labor>) => void;
    role: UserRole;
}> = ({ labor, onClose, onSave, role }) => {
    const [formData, setFormData] = useState(labor);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseFloat(value) || 0 : value;
        
        setFormData(prev => {
            const updated = { ...prev, [name]: newValue };
            // Auto-calculate cost when rate or qty changes
            if (name === 'rate' || name === 'qty') {
                updated.cost = (updated.rate || 0) * (updated.qty || 0);
            }
            return updated;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{labor.id ? 'Edit' : 'Add'} Labor</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="crewRole" className="block text-sm font-medium text-gray-700 mb-1">Crew Role</label>
                            <input type="text" name="crewRole" id="crewRole" value={formData.crewRole || ''} onChange={handleChange} className={inputClass} required />
                        </div>
                        <div>
                            <label htmlFor="workers" className="block text-sm font-medium text-gray-700 mb-1">Workers</label>
                            <input type="text" name="workers" id="workers" value={formData.workers || ''} onChange={handleChange} className={inputClass} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="rateType" className="block text-sm font-medium text-gray-700 mb-1">Rate Type</label>
                            <select name="rateType" id="rateType" value={formData.rateType || 'Hourly'} onChange={handleChange} className={inputClass}>
                                <option value="Daily">Daily</option>
                                <option value="Hourly">Hourly</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">Rate (₱)</label>
                            <input type="number" name="rate" id="rate" value={formData.rate || 0} onChange={handleChange} className={inputClass} min="0" step="0.01" />
                        </div>
                        <div>
                            <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input type="number" name="qty" id="qty" value={formData.qty || 0} onChange={handleChange} className={inputClass} min="0" step="0.5" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input type="date" name="startDate" id="startDate" value={formData.startDate || ''} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input type="date" name="endDate" id="endDate" value={formData.endDate || ''} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                        <input type="text" name="supplier" id="supplier" value={formData.supplier || ''} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-sm font-medium text-gray-700">Total Cost: ₱{((formData.rate || 0) * (formData.qty || 0)).toLocaleString()}</span>
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea name="notes" id="notes" rows={3} value={formData.notes || ''} onChange={handleChange} className={inputClass}></textarea>
                    </div>
                </form>
                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="submit" onClick={handleSubmit} disabled={role !== 'admin'} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">Save Labor</button>
                </div>
            </div>
        </div>
    );
};

// Material Modal Component
const MaterialModal: React.FC<{
    material: Partial<Material>;
    onClose: () => void;
    onSave: (material: Partial<Material>) => void;
    role: UserRole;
}> = ({ material, onClose, onSave, role }) => {
    const [formData, setFormData] = useState(material);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseFloat(value) || 0 : value;
        
        setFormData(prev => {
            const updated = { ...prev, [name]: newValue };
            // Auto-calculate total cost when qty or unit cost changes
            if (name === 'qty' || name === 'unitCost') {
                updated.totalCost = (updated.qty || 0) * (updated.unitCost || 0);
            }
            return updated;
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create a URL for the uploaded file
        const fileUrl = URL.createObjectURL(file);
        
        setFormData(prev => ({
            ...prev,
            attachment: { type: 'local', value: fileUrl, name: file.name }
        }));

        // Mock receipt data extraction
        if (file.type.startsWith('image/')) {
            setIsProcessing(true);
            
            // Simulate processing delay
            setTimeout(() => {
                // Mock extracted data from receipt
                const extractedData = {
                    item: 'Primer Epoxy Paint set',
                    qty: 2,
                    unitCost: 450,
                    totalCost: 900,
                    supplier: 'Local Hardware',
                    category: 'Finishes' as MaterialCategory,
                };

                setFormData(prev => ({
                    ...prev,
                    ...extractedData
                }));
                
                setIsProcessing(false);
            }, 2000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{material.id ? 'Edit' : 'Add'} Material</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                        <input type="text" name="item" id="item" value={formData.item || ''} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select name="category" id="category" value={formData.category || 'Other'} onChange={handleChange} className={inputClass}>
                                <option value="Aggregates">Aggregates</option>
                                <option value="Timber">Timber</option>
                                <option value="Steel">Steel</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Finishes">Finishes</option>
                                <option value="Fixtures">Fixtures</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                            <input type="text" name="supplier" id="supplier" value={formData.supplier || ''} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input type="number" name="qty" id="qty" value={formData.qty || 0} onChange={handleChange} className={inputClass} min="0" step="0.01" />
                        </div>
                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                            <select name="unit" id="unit" value={formData.unit || 'pc'} onChange={handleChange} className={inputClass}>
                                <option value="pc">pc</option>
                                <option value="box">box</option>
                                <option value="m">m</option>
                                <option value="sqm">sqm</option>
                                <option value="kg">kg</option>
                                <option value="ton">ton</option>
                                <option value="liter">liter</option>
                                <option value="gallon">gallon</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="unitCost" className="block text-sm font-medium text-gray-700 mb-1">Unit Cost (₱)</label>
                            <input type="number" name="unitCost" id="unitCost" value={formData.unitCost || 0} onChange={handleChange} className={inputClass} min="0" step="0.01" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="leadTimeDays" className="block text-sm font-medium text-gray-700 mb-1">Lead Time (Days)</label>
                            <input type="number" name="leadTimeDays" id="leadTimeDays" value={formData.leadTimeDays || 0} onChange={handleChange} className={inputClass} min="0" />
                        </div>
                        <div>
                            <label htmlFor="deliveryEta" className="block text-sm font-medium text-gray-700 mb-1">Delivery ETA</label>
                            <input type="date" name="deliveryEta" id="deliveryEta" value={formData.deliveryEta || ''} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <select name="location" id="location" value={formData.location || 'Site'} onChange={handleChange} className={inputClass}>
                            <option value="Site">Site</option>
                            <option value="Warehouse">Warehouse</option>
                        </select>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <span className="text-sm font-medium text-gray-700">Total Cost: ₱{((formData.qty || 0) * (formData.unitCost || 0)).toLocaleString()}</span>
                    </div>
                    
                    {/* Attachment Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="material-attachment"
                            />
                            <label
                                htmlFor="material-attachment"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> receipt or image
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                </div>
                            </label>
                            
                            {/* Processing Overlay */}
                            {isProcessing && (
                                <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center rounded-lg">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                        <p className="text-sm text-blue-600 font-medium">Extracting data from receipt...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Preview uploaded image */}
                        {formData.attachment && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">{formData.attachment.name || 'Uploaded image'}</span>
                                    {formData.attachment.value && (
                                        <img 
                                            src={formData.attachment.value} 
                                            alt="Receipt preview" 
                                            className="w-16 h-16 object-cover rounded border"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea name="notes" id="notes" rows={3} value={formData.notes || ''} onChange={handleChange} className={inputClass}></textarea>
                    </div>
                </form>
                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
                    <button type="button" onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                    <button 
                        type="submit" 
                        onClick={handleSubmit} 
                        disabled={role !== 'admin' || isProcessing} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Processing...' : 'Save Material'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Project Module Component
const ProjectModule: React.FC<{
    project: { id: string; name: string };
    role: UserRole;
    showToast: (msg: string) => void;
    projectData: ProjectData;
    onUpdateProjectData: (data: ProjectData) => void;
}> = ({ project, role, showToast, projectData, onUpdateProjectData }) => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'labor' | 'materials'>('tasks');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // Modal states
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Filtered data
    const filteredTasks = useMemo(() => {
        return projectData.tasks.filter(task => {
            const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = !statusFilter || task.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projectData.tasks, searchTerm, statusFilter]);

    const filteredLabor = useMemo(() => {
        return projectData.labor.filter(labor => {
            const matchesSearch = labor.crewRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                labor.workers.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [projectData.labor, searchTerm]);

    const filteredMaterials = useMemo(() => {
        return projectData.materials.filter(material => {
            const matchesSearch = material.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                material.supplier.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [projectData.materials, searchTerm]);

    // CRUD operations
    const handleAddTask = () => {
        if (role !== 'admin') return;
        setEditingItem({ projectId: project.id });
        setIsTaskModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        if (role !== 'admin') return;
        setEditingItem(task);
        setIsTaskModalOpen(true);
    };

    const handleDeleteTask = (id: string) => {
        if (role !== 'admin') return;
        if (window.confirm('Are you sure you want to delete this task?')) {
            const updatedData = {
                ...projectData,
                tasks: projectData.tasks.filter(t => t.id !== id)
            };
            onUpdateProjectData(updatedData);
            showToast('Task deleted successfully.');
        }
    };

    const handleSaveTask = (taskData: Partial<Task>) => {
        const updatedTasks = taskData.id
            ? projectData.tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t)
            : [...projectData.tasks, { ...taskData, id: simpleId(), projectId: project.id } as Task];
        
        onUpdateProjectData({ ...projectData, tasks: updatedTasks });
        setIsTaskModalOpen(false);
        showToast(taskData.id ? 'Task updated successfully.' : 'Task created successfully.');
    };

    // Similar handlers for Labor and Materials
    const handleAddLabor = () => {
        if (role !== 'admin') return;
        setEditingItem({ projectId: project.id });
        setIsLaborModalOpen(true);
    };

    const handleEditLabor = (labor: Labor) => {
        if (role !== 'admin') return;
        setEditingItem(labor);
        setIsLaborModalOpen(true);
    };

    const handleDeleteLabor = (id: string) => {
        if (role !== 'admin') return;
        if (window.confirm('Are you sure you want to delete this labor entry?')) {
            const updatedData = {
                ...projectData,
                labor: projectData.labor.filter(l => l.id !== id)
            };
            onUpdateProjectData(updatedData);
            showToast('Labor entry deleted successfully.');
        }
    };

    const handleSaveLabor = (laborData: Partial<Labor>) => {
        const updatedLabor = laborData.id
            ? projectData.labor.map(l => l.id === laborData.id ? { ...l, ...laborData } : l)
            : [...projectData.labor, { ...laborData, id: simpleId(), projectId: project.id } as Labor];
        
        onUpdateProjectData({ ...projectData, labor: updatedLabor });
        setIsLaborModalOpen(false);
        showToast(laborData.id ? 'Labor entry updated successfully.' : 'Labor entry created successfully.');
    };

    const handleAddMaterial = () => {
        if (role !== 'admin') return;
        setEditingItem({ projectId: project.id });
        setIsMaterialModalOpen(true);
    };

    const handleEditMaterial = (material: Material) => {
        if (role !== 'admin') return;
        setEditingItem(material);
        setIsMaterialModalOpen(true);
    };

    const handleDeleteMaterial = (id: string) => {
        if (role !== 'admin') return;
        if (window.confirm('Are you sure you want to delete this material?')) {
            const updatedData = {
                ...projectData,
                materials: projectData.materials.filter(m => m.id !== id)
            };
            onUpdateProjectData(updatedData);
            showToast('Material deleted successfully.');
        }
    };

    const handleSaveMaterial = (materialData: Partial<Material>) => {
        const updatedMaterials = materialData.id
            ? projectData.materials.map(m => m.id === materialData.id ? { ...m, ...materialData } : m)
            : [...projectData.materials, { ...materialData, id: simpleId(), projectId: project.id } as Material];
        
        onUpdateProjectData({ ...projectData, materials: updatedMaterials });
        setIsMaterialModalOpen(false);
        showToast(materialData.id ? 'Material updated successfully.' : 'Material created successfully.');
    };

    const renderTasksTable = () => (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Task</th>
                        <th scope="col" className="px-6 py-3">Type</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Due Date</th>
                        <th scope="col" className="px-6 py-3">Cost</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map(task => (
                        <tr key={task.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{task.name}</td>
                            <td className="px-6 py-4">
                                <StatusPill status={task.type} colorMap={taskTypeColors} />
                            </td>
                            <td className="px-6 py-4">
                                <StatusPill status={task.status} colorMap={taskStatusColors} />
                            </td>
                            <td className="px-6 py-4">{task.dueDate}</td>
                            <td className="px-6 py-4">₱{task.cost.toLocaleString()}</td>
                            <td className="px-6 py-4 flex justify-end gap-2">
                                {role === 'admin' ? (
                                    <>
                                        <button onClick={() => handleEditTask(task)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon /></button>
                                        <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                                    </>
                                ) : <span className="text-xs text-gray-400 italic">Read-only</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderLaborTable = () => (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Workers</th>
                        <th scope="col" className="px-6 py-3">Rate</th>
                        <th scope="col" className="px-6 py-3">Qty</th>
                        <th scope="col" className="px-6 py-3">Cost</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLabor.map(labor => (
                        <tr key={labor.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{labor.crewRole}</td>
                            <td className="px-6 py-4">{labor.workers}</td>
                            <td className="px-6 py-4">₱{labor.rate.toLocaleString()}/{labor.rateType.toLowerCase()}</td>
                            <td className="px-6 py-4">{labor.qty}</td>
                            <td className="px-6 py-4">₱{labor.cost.toLocaleString()}</td>
                            <td className="px-6 py-4">{labor.startDate}</td>
                            <td className="px-6 py-4 flex justify-end gap-2">
                                {role === 'admin' ? (
                                    <>
                                        <button onClick={() => handleEditLabor(labor)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon /></button>
                                        <button onClick={() => handleDeleteLabor(labor.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                                    </>
                                ) : <span className="text-xs text-gray-400 italic">Read-only</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderMaterialsTable = () => (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Item</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Quantity</th>
                        <th scope="col" className="px-6 py-3">Unit Cost</th>
                        <th scope="col" className="px-6 py-3">Total Cost</th>
                        <th scope="col" className="px-6 py-3">Supplier</th>
                        <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMaterials.map(material => (
                        <tr key={material.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{material.item}</td>
                            <td className="px-6 py-4">{material.category}</td>
                            <td className="px-6 py-4">{material.qty} {material.unit}</td>
                            <td className="px-6 py-4">₱{material.unitCost.toLocaleString()}</td>
                            <td className="px-6 py-4">₱{material.totalCost.toLocaleString()}</td>
                            <td className="px-6 py-4">{material.supplier}</td>
                            <td className="px-6 py-4 flex justify-end gap-2">
                                {role === 'admin' ? (
                                    <>
                                        <button onClick={() => handleEditMaterial(material)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon /></button>
                                        <button onClick={() => handleDeleteMaterial(material.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                                    </>
                                ) : <span className="text-xs text-gray-400 italic">Read-only</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const getActiveData = () => {
        switch (activeTab) {
            case 'tasks': return filteredTasks;
            case 'labor': return filteredLabor;
            case 'materials': return filteredMaterials;
            default: return [];
        }
    };

    const handleAddNew = () => {
        switch (activeTab) {
            case 'tasks': handleAddTask(); break;
            case 'labor': handleAddLabor(); break;
            case 'materials': handleAddMaterial(); break;
        }
    };

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { key: 'tasks', label: 'Tasks', count: projectData.tasks.length },
                        { key: 'labor', label: 'Labor', count: projectData.labor.length },
                        { key: 'materials', label: 'Materials', count: projectData.materials.length },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                activeTab === tab.key
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </nav>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    {activeTab === 'tasks' && (
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex border border-gray-300 rounded-md">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                        >
                            <TableIcon />
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`p-2 ${viewMode === 'cards' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                        >
                            <ViewGridIcon />
                        </button>
                    </div>
                    <button
                        onClick={handleAddNew}
                        disabled={role !== 'admin'}
                        className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <PlusIcon />
                        Add {activeTab.slice(0, -1)}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {getActiveData().length > 0 ? (
                    viewMode === 'table' ? (
                        activeTab === 'tasks' ? renderTasksTable() :
                        activeTab === 'labor' ? renderLaborTable() :
                        renderMaterialsTable()
                    ) : (
                        <div className="p-6">
                            <p className="text-gray-500 text-center">Card view coming soon...</p>
                        </div>
                    )
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        No {activeTab} found. Click "Add {activeTab.slice(0, -1)}" to get started.
                    </div>
                )}
            </div>

            {/* Modals */}
            {isTaskModalOpen && (
                <TaskModal
                    task={editingItem || {}}
                    onClose={() => setIsTaskModalOpen(false)}
                    onSave={handleSaveTask}
                    role={role}
                />
            )}
            {isLaborModalOpen && (
                <LaborModal
                    labor={editingItem || {}}
                    onClose={() => setIsLaborModalOpen(false)}
                    onSave={handleSaveLabor}
                    role={role}
                />
            )}
            {isMaterialModalOpen && (
                <MaterialModal
                    material={editingItem || {}}
                    onClose={() => setIsMaterialModalOpen(false)}
                    onSave={handleSaveMaterial}
                    role={role}
                />
            )}
        </div>
    );
};

export default ProjectModule;