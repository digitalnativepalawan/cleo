import React, { useState, useRef } from 'react';
import type { Attachment } from './ProjectManagement';
import { PlusIcon, UploadIcon, DownloadIcon, PencilIcon, TrashIcon, ImageIcon, DriveIcon } from './portal/PortalIcons';

// --- CSV UTILS ---
function exportToCsv<T extends { id: string }>(filename: string, data: T[]) {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).filter(key => key !== 'attachment');
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                let value = (row as any)[header];
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                 if (header === 'attachment' && value) {
                    return (value as Attachment).type === 'drive' ? (value as Attachment).value : 'image_attached';
                }
                return value;
            }).join(',')
        )
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// FIX: Update 'columns' to accept a readonly array, as it's only used for reading.
function parseCsv<T>(csvText: string, columns: readonly ColumnDef<T>[]): Partial<T>[] {
    const [headerLine, ...lines] = csvText.trim().split('\n');
    const headers = headerLine.split(',').map(h => h.trim());
    
    return lines.map(line => {
        const values = line.split(',');
        const obj: Partial<T> = {};
        headers.forEach((header, index) => {
            const column = columns.find(c => c.key === header);
            if(column) {
                let value: any = values[index].trim();
                if (column.type === 'number' || column.type === 'currency') value = Number(value) || 0;
                if (column.type === 'boolean') value = value.toLowerCase() === 'true';
                (obj as any)[header] = value;
            }
        });
        return obj;
    });
}

// --- TYPE DEFINITIONS ---
interface ColumnDef<T> {
    key: keyof T;
    label: string;
    type: 'text' | 'number' | 'currency' | 'boolean';
}

interface CrudSectionProps<T extends { id: string }> {
    title: string;
    data: T[];
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    // FIX: Allow readonly arrays for column definitions to support `as const`.
    columns: readonly ColumnDef<T>[];
    itemNoun: { singular: string; plural: string; };
    initialItemState: Omit<T, 'id'>;
}

// --- HELPER COMPONENTS ---
const Modal: React.FC<{ children: React.ReactNode, onClose: () => void }> = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

// --- MAIN COMPONENT ---
export function CrudSection<T extends { id: string; attachment?: Attachment }>({ title, data, setData, columns, itemNoun, initialItemState }: CrudSectionProps<T>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<T> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddNew = () => {
        // FIX: Cast initialItemState to Partial<T> to satisfy setCurrentItem's type.
        // Omit<T, 'id'> is structurally compatible with Partial<T>, but TypeScript needs a hint with generics.
        setCurrentItem({ ...initialItemState } as Partial<T>);
        setIsModalOpen(true);
    };

    const handleEdit = (item: T) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(`Are you sure you want to delete this ${itemNoun.singular.toLowerCase()}?`)) {
            setData(data.filter(item => item.id !== id));
        }
    };

    const handleSave = (itemToSave: Partial<T>) => {
        if ((itemToSave as T).id) {
            setData(data.map(item => item.id === (itemToSave as T).id ? itemToSave as T : item));
        } else {
            setData([...data, { ...itemToSave, id: `item-${Date.now()}` } as T]);
        }
        setIsModalOpen(false);
        setCurrentItem(null);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const newItems = parseCsv<T>(event.target?.result as string, columns);
            const itemsToSet = newItems.map(item => ({...initialItemState, ...item, id: `imported-${Date.now()}-${Math.random()}` } as T));
            setData(prev => [...prev, ...itemsToSet]);
        };
        reader.readAsText(file);
    };
    
    const renderCell = (item: T, column: ColumnDef<T>) => {
        const value = item[column.key];
        switch (column.type) {
            case 'boolean':
                return (
                    <input type="checkbox" checked={!!value} readOnly className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                );
            case 'currency':
                return `₱${Number(value).toLocaleString()}`;
            default:
                return String(value);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <div className="flex items-center gap-2">
                    <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
                        <UploadIcon /><span>Import</span>
                    </button>
                    <button onClick={() => exportToCsv(title.toLowerCase().replace(' ', '_'), data)} className="flex items-center gap-2 text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
                        <DownloadIcon /><span>Export</span>
                    </button>
                    <button onClick={handleAddNew} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
                        <PlusIcon /><span>Add {itemNoun.singular}</span>
                    </button>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            {columns.map(col => <th key={String(col.key)} scope="col" className="px-4 py-3">{col.label}</th>)}
                            <th scope="col" className="px-4 py-3">Attachment</th>
                            <th scope="col" className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                {columns.map(col => <td key={String(col.key)} className="px-4 py-3">{renderCell(item, col)}</td>)}
                                <td className="px-4 py-3">
                                    {item.attachment?.type === 'image' && <img src={item.attachment.value} alt="attachment" className="h-10 w-10 object-cover rounded" />}
                                    {item.attachment?.type === 'drive' && <a href={item.attachment.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1"><DriveIcon /> Link</a>}
                                </td>
                                <td className="px-4 py-3 flex justify-end gap-2">
                                    <button onClick={() => handleEdit(item)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {/* Mobile/Tablet Cards */}
            <div className="lg:hidden space-y-3">
                {data.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        {columns.map(col => (
                            <div key={String(col.key)} className="flex justify-between items-center py-1">
                                <span className="text-xs font-medium text-gray-500">{col.label}</span>
                                <span className="text-sm text-gray-800 text-right">{renderCell(item, col)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center py-1">
                             <span className="text-xs font-medium text-gray-500">Attachment</span>
                             <div>
                                {item.attachment?.type === 'image' && <img src={item.attachment.value} alt="attachment" className="h-10 w-10 object-cover rounded" />}
                                {item.attachment?.type === 'drive' && <a href={item.attachment.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"><DriveIcon /> Link</a>}
                             </div>
                        </div>
                        <div className="flex justify-end gap-2 border-t mt-2 pt-2">
                            <button onClick={() => handleEdit(item)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon /></button>
                        </div>
                    </div>
                ))}
            </div>


            {isModalOpen && currentItem && (
                <ItemFormModal
                    item={currentItem}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    columns={columns}
                    itemNoun={itemNoun.singular}
                />
            )}
        </div>
    );
}

// --- Item Form Modal Component ---
function ItemFormModal<T extends { id?: string; attachment?: Attachment }>({ item, onClose, onSave, columns, itemNoun }: {
    item: Partial<T>;
    onClose: () => void;
    onSave: (item: Partial<T>) => void;
    // FIX: Allow readonly arrays for column definitions to support `as const`.
    columns: readonly ColumnDef<T>[];
    itemNoun: string;
}) {
    const [formData, setFormData] = useState(item);
    
    const handleChange = (key: keyof T, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleAttachmentChange = (type: 'image' | 'drive', value: string, name?: string) => {
        setFormData(prev => ({...prev, attachment: { type, value, name }}));
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleAttachmentChange('image', reader.result as string, file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal onClose={onClose}>
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{item.id ? 'Edit' : 'Add'} {itemNoun}</h3>
                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
                    {columns.map(col => (
                        <div key={String(col.key)}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{col.label}</label>
                            {col.type === 'boolean' ? (
                                <input type="checkbox" checked={!!(formData as any)[col.key]} onChange={e => handleChange(col.key, e.target.checked)} />
                            ) : (
                                <input
                                    type={col.type === 'text' ? 'text' : 'number'}
                                    step={col.type === 'currency' ? '0.01' : '1'}
                                    value={(formData as any)[col.key] || ''}
                                    onChange={e => handleChange(col.key, col.type === 'text' ? e.target.value : parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    required
                                />
                            )}
                        </div>
                    ))}
                    {/* Attachment Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attachment (Optional)</label>
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                            {formData.attachment ? (
                                <div>
                                    {formData.attachment.type === 'image' && (
                                        <div className="flex items-center gap-3">
                                            <img src={formData.attachment.value} alt={formData.attachment.name || 'Image preview'} className="h-16 w-16 rounded-md object-cover border" />
                                            <div className="text-sm">
                                                <p className="font-semibold text-gray-800 break-all">{formData.attachment.name || 'Image Attachment'}</p>
                                                <p className="text-xs text-gray-500">Image file</p>
                                            </div>
                                        </div>
                                    )}
                                    {formData.attachment.type === 'drive' && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                                                <DriveIcon className="h-8 w-8 text-gray-500"/>
                                            </div>
                                            <div className="text-sm overflow-hidden">
                                                <p className="font-semibold text-gray-800">Google Drive Link</p>
                                                <a href={formData.attachment.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">{formData.attachment.value}</a>
                                            </div>
                                        </div>
                                    )}
                                    <button type="button" onClick={() => setFormData(p => ({...p, attachment: undefined}))} className="mt-3 w-full text-center text-xs text-red-600 hover:text-red-800 font-semibold py-1 rounded-md bg-red-50 hover:bg-red-100 transition-colors">
                                        Remove Attachment
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="text-gray-500 flex-shrink-0"/>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleFileSelect} 
                                            className="text-sm text-gray-600 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer w-full"
                                        />
                                    </div>
                                     <div className="relative flex items-center">
                                        <div className="flex-grow border-t border-gray-200"></div>
                                        <span className="flex-shrink mx-2 text-xs text-gray-400">OR</span>
                                        <div className="flex-grow border-t border-gray-200"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DriveIcon className="text-gray-500 flex-shrink-0"/>
                                        <input 
                                            type="url" 
                                            placeholder="Paste Google Drive link" 
                                            onChange={e => handleAttachmentChange('drive', e.target.value)} 
                                            className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Save</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}