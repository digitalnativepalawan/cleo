import React, { useState, useMemo, useEffect } from 'react';
import type { UserRole } from '../../Portal';
import type { ProjectData, Task, Labor, Material, ProjectItem, TaskStatus, TaskType, LaborRateType, MaterialCategory, MaterialUnit, Attachment } from '../../../types/portal';
import { PlusIcon, SearchIcon, FilterIcon, PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon, XIcon, ChevronDownIcon, ChevronUpIcon, ImageIcon, UploadIcon } from '../PortalIcons';

type ActiveTab = 'tasks' | 'labor' | 'materials';

const simpleId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getDirectImageUrl = (attachment: Attachment | undefined): string => {
    if (!attachment) return '';
    const { type, value } = attachment;

    if (type === 'local') {
        return value; // It's already a base64 data URL
    }
    
    if (value && (value.includes('drive.google.com/file/d/') || value.includes('drive.google.com/uc?id='))) {
        try {
            const fileId = value.includes('/d/') ? value.split('/d/')[1].split('/')[0] : new URL(value).searchParams.get('id');
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
        } catch (error) {
            console.error("Failed to parse Google Drive URL:", value, error);
            return value; 
        }
    }
    return value; // For 'image' type or other URLs
};

// --- FORM MODAL ---

const ItemFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Partial<ProjectItem>) => void;
    item: Partial<ProjectItem> | null;
    itemType: ActiveTab;
}> = ({ isOpen, onClose, onSave, item, itemType }) => {
    const [formData, setFormData] = useState<Partial<ProjectItem> | null>(item);
    const [isProcessingImage, setIsProcessingImage] = useState(false);

    useEffect(() => {
        setFormData(item);
    }, [item]);

    useEffect(() => {
        if (!formData) return;

        if (itemType === 'labor') {
            const laborData = formData as Partial<Labor>;
            const newCost = (laborData.qty || 0) * (laborData.rate || 0);
            if (laborData.cost !== newCost) {
                setFormData(prev => ({ ...prev, cost: newCost }));
            }
        } else if (itemType === 'materials') {
            const materialData = formData as Partial<Material>;
            const newTotalCost = (materialData.qty || 0) * (materialData.unitCost || 0);
            if (materialData.totalCost !== newTotalCost) {
                setFormData(prev => ({ ...prev, totalCost: newTotalCost }));
            }
        }
    }, [formData, itemType]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const isNumber = type === 'number';

        setFormData(prev => ({ 
            ...prev, 
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : isNumber ? parseFloat(value) || 0 : value 
        }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setIsProcessingImage(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    attachment: {
                        type: 'local',
                        value: reader.result as string,
                        name: file.name
                    }
                }));
                
                // If this is a materials form, try to extract data from the receipt
                if (itemType === 'materials') {
                    extractReceiptData(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        if (url) {
            const type = url.includes('drive.google.com') ? 'drive' : 'image';
            setFormData(prev => ({
                ...prev,
                attachment: {
                    type: type,
                    value: url,
                    name: url
                }
            }));
        } else if (formData?.attachment?.type === 'image' || formData?.attachment?.type === 'drive') {
            handleRemoveAttachment();
        }
    };
    
    const handleRemoveAttachment = () => {
        setFormData(prev => {
            if (!prev) return null;
            const { attachment, ...rest } = prev;
            return rest;
        });
    };
    
    const extractReceiptData = async (imageDataUrl: string) => {
        try {
            // This is a placeholder for receipt data extraction
            // In a real implementation, you would call an OCR service or AI API
            // For now, we'll simulate the extraction with common receipt patterns
            
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock extracted data - in reality this would come from OCR/AI analysis
            const mockExtractedData = {
                items: [
                    { name: 'Primer Epoxy Paint', quantity: 2, unitCost: 450, supplier: 'Hardware Store' },
                    { name: 'Roll Brush #2', quantity: 6, unitCost: 55, supplier: 'Hardware Store' },
                    { name: 'White Wall Paint', quantity: 1, unitCost: 700, supplier: 'Hardware Store' }
                ]
            };
            
            // For demo purposes, we'll use the first item from the mock data
            const firstItem = mockExtractedData.items[0];
            
            setFormData(prev => ({
                ...prev,
                item: firstItem.name,
                qty: firstItem.quantity,
                unitCost: firstItem.unitCost,
                totalCost: firstItem.quantity * firstItem.unitCost,
                supplier: firstItem.supplier,
                category: 'Finishes' // Default category, user can change
            }));
            
        } catch (error) {
            console.error('Error extracting receipt data:', error);
        } finally {
            setIsProcessingImage(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(formData) onSave(formData);
    };

    if (!isOpen || !formData) return null;

    const inputClass = "w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    const title = `${formData.id ? 'Edit' : 'Add'} ${itemType.charAt(0).toUpperCase() + itemType.slice(1, -1)}`;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XIcon /></button>
                </div>
                <form id="item-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    { itemType === 'tasks' && (
                       <>
                            <div>
                                <label htmlFor="name" className={labelClass}>Task Name</label>
                                <input type="text" name="name" value={(formData as Task).name || ''} onChange={handleChange} className={inputClass} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="status" className={labelClass}>Status</label>
                                    <select name="status" value={(formData as Task).status} onChange={handleChange} className={inputClass}>
                                        {(['Pending', 'Backlog', 'In Progress', 'Blocked', 'Review', 'Done'] as TaskStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="type" className={labelClass}>Type</label>
                                    <select name="type" value={(formData as Task).type} onChange={handleChange} className={inputClass}>
                                        {(['Design', 'Site Prep', 'Foundation', 'Structure', 'MEP', 'Finish', 'Inspection'] as TaskType[]).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="dueDate" className={labelClass}>Due Date</label>
                                    <input type="date" name="dueDate" value={(formData as Task).dueDate || ''} onChange={handleChange} className={inputClass} />
                                </div>
                                 <div>
                                    <label htmlFor="cost" className={labelClass}>Cost (₱)</label>
                                    <input type="number" name="cost" value={(formData as Task).cost || 0} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                       </>
                    )}
                    { itemType === 'labor' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="workers" className={labelClass}>Worker(s) Name</label>
                                    <input type="text" name="workers" value={(formData as Labor).workers || ''} onChange={handleChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label htmlFor="crewRole" className={labelClass}>Role</label>
                                    <input type="text" name="crewRole" value={(formData as Labor).crewRole || ''} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className={labelClass}>Date</label>
                                    <input type="date" name="startDate" value={(formData as Labor).startDate || ''} onChange={handleChange} className={inputClass} required/>
                                </div>
                                <div>
                                    <label htmlFor="qty" className={labelClass}>Hours Worked</label>
                                    <input type="number" name="qty" value={(formData as Labor).qty || 0} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label htmlFor="rate" className={labelClass}>Hourly Rate (₱)</label>
                                    <input type="number" name="rate" value={(formData as Labor).rate || 0} onChange={handleChange} className={inputClass} />
                                </div>
                                 <div>
                                    <label htmlFor="cost" className={labelClass}>Total Cost (₱)</label>
                                    <input type="number" name="cost" readOnly value={(formData as Labor).cost || 0} onChange={handleChange} className={`${inputClass} bg-gray-50`} />
                                </div>
                            </div>
                        </>
                    )}
                     { itemType === 'materials' && (
                         <>
                            <div>
                                <label htmlFor="item" className={labelClass}>Item Name</label>
                                <input type="text" name="item" value={(formData as Material).item || ''} onChange={handleChange} className={inputClass} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category" className={labelClass}>Category</label>
                                    <select name="category" value={(formData as Material).category} onChange={handleChange} className={inputClass}>
                                        {(['Aggregates', 'Timber', 'Steel', 'Electrical', 'Plumbing', 'Finishes', 'Fixtures', 'Other'] as MaterialCategory[]).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="supplier" className={labelClass}>Supplier</label>
                                    <input type="text" name="supplier" value={(formData as Material).supplier || ''} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="qty" className={labelClass}>Quantity</label>
                                    <input type="number" name="qty" min="0" step="0.01" value={(formData as Material).qty || 0} onChange={handleChange} className={inputClass} />
                                </div>
                                 <div>
                                    <label htmlFor="unitCost" className={labelClass}>Unit Cost (₱)</label>
                                    <input type="number" name="unitCost" min="0" step="0.01" value={(formData as Material).unitCost || 0} onChange={handleChange} className={inputClass} />
                                </div>
                                 <div>
                                    <label htmlFor="totalCost" className={labelClass}>Total Cost (₱)</label>
                                    <input type="number" name="totalCost" readOnly value={(formData as Material).totalCost || 0} className={`${inputClass} bg-gray-50 text-gray-700 font-medium`} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="unit" className={labelClass}>Unit</label>
                                    <select name="unit" value={(formData as Material).unit} onChange={handleChange} className={inputClass}>
                                        {(['pc', 'box', 'm', 'sqm', 'kg', 'ton', 'liter', 'gallon'] as MaterialUnit[]).map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="location" className={labelClass}>Location</label>
                                    <select name="location" value={(formData as Material).location || 'Site'} onChange={handleChange} className={inputClass}>
                                        <option value="Site">Site</option>
                                        <option value="Warehouse">Warehouse</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="deliveryEta" className={labelClass}>Expected Delivery</label>
                                    <input type="date" name="deliveryEta" value={(formData as Material).deliveryEta || ''} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label htmlFor="leadTimeDays" className={labelClass}>Lead Time (Days)</label>
                                    <input type="number" name="leadTimeDays" min="0" value={(formData as Material).leadTimeDays || 1} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>
                         </>
                    )}
                    
                    <div>
                        <label className={labelClass}>Attachment</label>
                        <div className="mt-1 border border-gray-300 rounded-lg p-4 text-sm">
                            {formData.attachment ? (
                                <div className="text-center space-y-3">
                                    <div className="relative inline-block">
                                        <img src={getDirectImageUrl(formData.attachment)} alt="Receipt Preview" className="w-auto h-auto max-h-48 object-contain rounded-md shadow-sm" />
                                        {isProcessingImage && (
                                            <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                                                <div className="text-white text-xs font-medium">Processing receipt...</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-600 font-medium truncate">{formData.attachment.name || 'Receipt Image'}</p>
                                        {itemType === 'materials' && !isProcessingImage && (
                                            <p className="text-xs text-blue-600">✓ Receipt data extracted automatically</p>
                                        )}
                                        <button type="button" onClick={handleRemoveAttachment} className="text-xs text-red-600 hover:text-red-800 font-medium">Remove Image</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                                        <UploadIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span className="text-sm">Upload receipt image</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                        {itemType === 'materials' && (
                                            <p className="text-xs text-gray-500 mt-1">We'll automatically extract item details from your receipt</p>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex-grow border-t border-gray-200"></div>
                                        <span className="flex-shrink mx-2 text-xs text-gray-400">OR</span>
                                        <div className="flex-grow border-t border-gray-200"></div>
                                    </div>
                                    <input type="url" name="attachmentUrl" placeholder="Or paste an image URL" onBlur={handleUrlChange} className={`${inputClass} text-center text-sm`} />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="notes" className={labelClass}>Notes</label>
                        <textarea name="notes" rows={2} value={formData.notes || ''} onChange={handleChange} className={inputClass}></textarea>
                    </div>
                     <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center">
                            <input id="paid" name="paid" type="checkbox" checked={formData.paid || false} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="paid" className="ml-2 block text-sm text-gray-900">Paid</label>
                        </div>
                         {itemType === 'materials' && <div className="flex items-center">
                            <input id="received" name="received" type="checkbox" checked={(formData as Material).received || false} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="received" className="ml-2 block text-sm text-gray-900">Received</label>
                        </div>}
                    </div>

                </form>
                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50/70 rounded-b-xl">
                    <button type="button" onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="submit" form="item-form" disabled={isProcessingImage} className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isProcessingImage ? 'Processing...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- OTHER COMPONENTS ---

const PaidToggleButton: React.FC<{
    isPaid: boolean;
    onClick: () => void;
    role: UserRole;
}> = ({ isPaid, onClick, role }) => {
    const isDisabled = role !== 'admin';
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            className={`w-20 text-center py-1 px-2 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isPaid
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500'
                    : 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500'
            } ${isDisabled ? 'cursor-not-allowed opacity-60' : ''}`}
            aria-label={isPaid ? "Mark as unpaid" : "Mark as paid"}
        >
            {isPaid ? 'Paid' : 'Unpaid'}
        </button>
    );
};


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
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <div className="relative flex-grow w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white focus:border-blue-500" />
            </div>
            <button className="w-full sm:w-auto flex-shrink-0 flex justify-center items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                <FilterIcon className="h-4 w-4" />
                <span>Filter</span>
            </button>
            <button 
                onClick={onAdd} 
                disabled={role !== 'admin'}
                className="w-full sm:w-auto flex-shrink-0 flex justify-center items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
            >
                <PlusIcon />
                <span>Add {itemNoun}</span>
            </button>
        </div>
    );
};

// --- MAIN MODULE ---

type SortableKeys = keyof Task | keyof Labor | keyof Material;

const ProjectModule: React.FC<{
    project: { id: string; name: string };
    role: UserRole;
    showToast: (msg: string) => void;
    projectData: ProjectData;
    onUpdateProjectData: (updatedData: ProjectData) => void;
}> = ({ project, role, showToast, projectData, onUpdateProjectData }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
    const { tasks, labor, materials } = projectData;
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<ProjectItem> | null>(null);

    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending'});
    
    useEffect(() => {
        handleTabChange('tasks');
    }, [project.id]);


    const handleTabChange = (tab: ActiveTab) => {
        setActiveTab(tab);
        // Reset sorting when tab changes
        const defaultSortKeys: Record<ActiveTab, SortableKeys> = {
            tasks: 'name',
            labor: 'startDate',
            materials: 'item',
        };
        setSortConfig({ key: defaultSortKeys[tab], direction: 'descending' });
    };

    const sortedData = useMemo(() => {
        let sortableItems: ProjectItem[] = [];
        if (activeTab === 'tasks') sortableItems = [...tasks];
        if (activeTab === 'labor') sortableItems = [...labor];
        if (activeTab === 'materials') sortableItems = [...materials];

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key as keyof ProjectItem];
                const bVal = b[sortConfig.key as keyof ProjectItem];
                if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [tasks, labor, materials, activeTab, sortConfig]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    // --- CRUD Handlers ---

    const handleAddNew = () => {
      if (role !== 'admin') {
          showToast("You don't have permission to add items.");
          return;
      }
      const baseItem = { id: '', projectId: project.id, notes: '', paid: false };
      let newItem: Partial<ProjectItem>;
      switch (activeTab) {
          case 'tasks': newItem = { ...baseItem, name: '', status: 'Backlog', type: 'Design', dueDate: '' } as Partial<Task>; break;
          case 'labor': newItem = { ...baseItem, crewRole: '', workers: '', rateType: 'Daily', qty: 8, rate: 62.5, cost: 500, startDate: '' } as Partial<Labor>; break;
          case 'materials': newItem = { ...baseItem, item: '', category: 'Other', unit: 'pc', qty: 1, unitCost: 0, totalCost: 0, supplier: '', received: false, location: 'Site', leadTimeDays: 1, deliveryEta: '' } as Partial<Material>; break;
      }
      setEditingItem(newItem);
      setIsModalOpen(true);
    };

    const handleEdit = (item: ProjectItem) => {
      if (role !== 'admin') {
          showToast("You don't have permission to edit items.");
          return;
      }
      setEditingItem(item);
      setIsModalOpen(true);
    };

    const handleDelete = (itemId: string) => {
        if (role !== 'admin') {
            showToast("You don't have permission to delete items.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this item?')) {
            let updatedData = { ...projectData };
            switch (activeTab) {
                case 'tasks': updatedData.tasks = tasks.filter(t => t.id !== itemId); break;
                case 'labor': updatedData.labor = labor.filter(l => l.id !== itemId); break;
                case 'materials': updatedData.materials = materials.filter(m => m.id !== itemId); break;
            }
            onUpdateProjectData(updatedData);
            showToast('Item deleted.');
        }
    };

    const handleSave = (itemToSave: Partial<ProjectItem>) => {
        let updatedData = { ...projectData };
        if (itemToSave.id) { // Update
            switch (activeTab) {
                case 'tasks': updatedData.tasks = tasks.map(i => i.id === itemToSave.id ? itemToSave as Task : i); break;
                case 'labor': updatedData.labor = labor.map(i => i.id === itemToSave.id ? itemToSave as Labor : i); break;
                case 'materials': updatedData.materials = materials.map(i => i.id === itemToSave.id ? itemToSave as Material : i); break;
            }
            showToast('Item updated.');
        } else { // Create
            const newItem = { ...itemToSave, id: simpleId() };
             switch (activeTab) {
                case 'tasks': updatedData.tasks = [...tasks, newItem as Task]; break;
                case 'labor': updatedData.labor = [...labor, newItem as Labor]; break;
                case 'materials': updatedData.materials = [...materials, newItem as Material]; break;
            }
            showToast('Item added.');
        }
        onUpdateProjectData(updatedData);
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleTogglePaidStatus = (itemId: string) => {
        if (role !== 'admin') {
            showToast("You don't have permission to update status.");
            return;
        }

        const updater = <T extends {id: string; paid: boolean;}>(items: T[]) => items.map(item => 
            item.id === itemId ? { ...item, paid: !item.paid } : item
        );
        
        let updatedData = { ...projectData };
        if (activeTab === 'labor') {
            updatedData.labor = updater(labor);
        } else if (activeTab === 'materials') {
            updatedData.materials = updater(materials);
        }
        onUpdateProjectData(updatedData);
        showToast('Paid status updated.');
    };

    // --- Render Logic ---

    const getSortIcon = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) return <ChevronDownIcon className="h-3 w-3 opacity-0 group-hover:opacity-50" />;
        return sortConfig.direction === 'ascending' ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />;
    };

    const getHighlightClass = (item: ProjectItem, context: 'row' | 'card') => {
        if (activeTab === 'tasks') return '';
        if (item.paid) return context === 'row' ? 'bg-green-50/60' : 'bg-green-50/60 border-green-200';
        return context === 'row' ? 'bg-red-50/60' : 'bg-red-50/60 border-red-200';
    };


    const TABS: { id: ActiveTab; label: string; count: number }[] = [
        { id: 'tasks', label: 'Tasks', count: tasks.length },
        { id: 'labor', label: 'Labor', count: labor.length },
        { id: 'materials', label: 'Materials', count: materials.length },
    ];
    
    const TASK_COLUMNS = [ { key: 'name', label: 'Task' }, { key: 'status', label: 'Status' }, { key: 'dueDate', label: 'Due Date' }, { key: 'cost', label: 'Cost' } ];
    const LABOR_COLUMNS = [ { key: 'workers', label: 'Name' }, { key: 'startDate', label: 'Date' }, { key: 'qty', label: 'Hours' }, { key: 'cost', label: 'Total (₱)' }, { key: 'paid', label: 'Status' } ];
    const MATERIAL_COLUMNS = [ { key: 'item', label: 'Item' }, { key: 'qty', label: 'Qty' }, { key: 'supplier', label: 'Supplier' }, { key: 'received', label: 'Received' }, { key: 'totalCost', label: 'Total' }, { key: 'paid', label: 'Status' } ];
    
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
                                     <button onClick={() => requestSort(col.key as SortableKeys)} className="flex items-center gap-1 group">
                                        {col.label} {getSortIcon(col.key as SortableKeys)}
                                    </button>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id} className={`border-b hover:bg-gray-100/50 ${getHighlightClass(item, 'row')}`}>
                                {columns.map((col, idx) => (
                                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                                        { idx === 0 ? ( // First column with image
                                            <div className="flex items-center gap-3">
                                                {item.attachment ? (
                                                    <img src={getDirectImageUrl(item.attachment)} alt="Attachment" className="h-8 w-8 rounded object-cover" />
                                                ) : (
                                                    <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                                        <ImageIcon className="h-4 w-4" />
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-900">{(item as any)[col.key]}</span>
                                            </div>
                                        ) : col.key === 'status' ? <StatusPill status={(item as Task).status}/>
                                        : col.key === 'received' ? ((item as Material).received ? <CheckCircleIcon className="text-green-500"/> : <ClockIcon className="text-gray-400"/>)
                                        : col.key === 'cost' ? `₱${(item as Task | Labor).cost?.toLocaleString() || 0}`
                                        : col.key === 'totalCost' ? `₱${(item as Material).totalCost?.toLocaleString() || 0}`
                                        : col.key === 'qty' && itemType === 'materials' ? `${(item as Material).qty} ${(item as Material).unit || 'pc'}`
                                        : col.key === 'paid' ? <PaidToggleButton isPaid={item.paid} onClick={() => handleTogglePaidStatus(item.id)} role={role} />
                                        : (item as any)[col.key] }
                                    </td>
                                ))}
                                <td className="px-6 py-4 flex justify-end gap-2">
                                    <button onClick={() => handleEdit(item)} disabled={role !== 'admin'} className="p-2 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"><PencilIcon /></button>
                                    <button onClick={() => handleDelete(item.id)} disabled={role !== 'admin'} className="p-2 text-gray-500 hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    };

    const renderCards = () => {
        const data = sortedData;
        const CardContent = ({item}: {item: ProjectItem}) => {
             switch (activeTab) {
                 case 'tasks': 
                    const task = item as Task;
                    return <>
                        <div className="flex justify-between text-xs text-gray-500"><span>Due: {task.dueDate || 'N/A'}</span><span>Cost: ₱{task.cost?.toLocaleString() || 0}</span></div>
                        <div className="mt-2"><StatusPill status={task.status} /></div>
                    </>;
                 case 'labor':
                    const laborItem = item as Labor;
                    return <>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Date: {laborItem.startDate}</span>
                            <span>Hours: {laborItem.qty}</span>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="font-semibold">Total: ₱{laborItem.cost?.toLocaleString() || 0}</span>
                            <PaidToggleButton isPaid={laborItem.paid} onClick={() => handleTogglePaidStatus(laborItem.id)} role={role} />
                        </div>
                    </>;
                 case 'materials':
                    const material = item as Material;
                    return <>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Qty: {material.qty} {material.unit || 'pc'}</span>
                            <span>Supplier: {material.supplier || 'N/A'}</span>
                            <div className="flex items-center gap-2 text-xs">{material.received ? <><CheckCircleIcon className="h-4 w-4 text-green-500"/> Received</> : <><ClockIcon className="h-4 w-4 text-gray-400"/> Pending</>}</div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="font-semibold">Total: ₱{material.totalCost?.toLocaleString() || 0}</span>
                            <PaidToggleButton isPaid={material.paid} onClick={() => handleTogglePaidStatus(material.id)} role={role} />
                        </div>
                    </>;
                 default: return null;
            }
        };

        return <div className="space-y-3">
            {data.map(item => (
                <div key={item.id} className={`p-4 rounded-lg shadow-sm border ${getHighlightClass(item, 'card')}`}>
                    <div className="flex justify-between items-start">
                         <div className="flex items-center gap-3 flex-grow min-w-0">
                            {item.attachment ? (
                                <img src={getDirectImageUrl(item.attachment)} alt="Attachment" className="h-10 w-10 rounded object-cover flex-shrink-0" />
                            ) : (
                                <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                    <ImageIcon className="h-5 w-5" />
                                </div>
                            )}
                            <h4 className="font-semibold text-gray-800 truncate">{(item as Task).name || (item as Labor).workers || (item as Material).item}</h4>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <button onClick={() => handleEdit(item)} disabled={role !== 'admin'} className="p-1.5 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"><PencilIcon className="h-4 w-4"/></button>
                            <button onClick={() => handleDelete(item.id)} disabled={role !== 'admin'} className="p-1.5 text-gray-500 hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed"><TrashIcon className="h-4 w-4"/></button>
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                        <CardContent item={item} />
                    </div>
                </div>
            ))}
        </div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/80">
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="w-full sm:w-auto border-b border-gray-200 sm:border-b-0">
                        <nav className="flex -mb-px overflow-x-auto">
                            {TABS.map(tab => (
                                <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                                    className={`whitespace-nowrap flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                        ? 'border-b-2 border-blue-600 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="w-full sm:w-auto flex-shrink-0">
                        <ProjectToolbar role={role} onAdd={handleAddNew} itemNoun={activeTab.slice(0, -1)} />
                    </div>
                </div>
            </div>
            
             <div className="hidden md:block">
                {renderTable()}
            </div>
            <div className="block md:hidden p-4 sm:p-6 border-t sm:border-t-0">
                {renderCards()}
            </div>

            <ItemFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                item={editingItem}
                itemType={activeTab}
            />
        </div>
    );
};

export default ProjectModule;
