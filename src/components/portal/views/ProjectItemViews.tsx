import React, { useState, useEffect } from 'react';
import type { UserRole } from '../../../../components/Portal.tsx';
import type { Task, Labor, Material, Attachment, TaskStatus, SortableKeys, SortConfig } from '../../../types/portal.ts';
import { PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon, ImageIcon, ChevronDownIcon, ChevronUpIcon } from '../../../../components/portal/PortalIcons.tsx';
import { getAttachment } from '../../../lib/indexedDB.ts';

// --- HELPER & UI COMPONENTS ---

const AttachmentImage: React.FC<{ attachment?: Attachment; className?: string }> = ({ attachment, className = "h-8 w-8" }) => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchImage = async () => {
            if (!attachment) {
                if (isMounted) {
                    setImageUrl('');
                    setIsLoading(false);
                }
                return;
            }

            let url = '';
            if (attachment.type === 'indexeddb') {
                const b64 = await getAttachment(attachment.value);
                if (b64) url = b64;
            } else if (attachment.type === 'local') {
                url = attachment.value;
            } else if (attachment.type === 'image' || attachment.type === 'drive') {
                if (attachment.value && (attachment.value.includes('drive.google.com/file/d/') || attachment.value.includes('drive.google.com/uc?id='))) {
                    try {
                        const fileId = attachment.value.includes('/d/') ? attachment.value.split('/d/')[1].split('/')[0] : new URL(attachment.value).searchParams.get('id');
                        url = `https://drive.google.com/uc?export=view&id=${fileId}`;
                    } catch (error) {
                        url = attachment.value;
                    }
                } else {
                    url = attachment.value;
                }
            }
            if (isMounted) {
                setImageUrl(url);
                setIsLoading(false);
            }
        };

        fetchImage();

        return () => { isMounted = false; };
    }, [attachment]);

    if (isLoading || !imageUrl) {
        return (
            <div className={`${className} rounded bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0`}>
                <ImageIcon className="h-4 w-4" />
            </div>
        );
    }
    return <img src={imageUrl} alt={attachment?.name || "Attachment"} className={`${className} rounded object-cover`} />;
};

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


// --- COMMON TYPES & HELPERS ---

interface ViewProps<T> {
    items: T[];
    role: UserRole;
    sortConfig: SortConfig | null;
    requestSort: (key: SortableKeys) => void;
    handleEdit: (item: T) => void;
    requestDeleteItem: (id: string) => void;
    confirmDeleteId: string | null;
    confirmDeleteItem: () => void;
    cancelDelete: () => void;
    handleTogglePaidStatus?: (id: string) => void;
}

const getSortIcon = (key: SortableKeys, sortConfig: SortConfig | null) => {
    if (!sortConfig || sortConfig.key !== key) return <ChevronDownIcon className="h-3 w-3 opacity-0 group-hover:opacity-50" />;
    return sortConfig.direction === 'ascending' ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />;
};

const getHighlightClass = (paid: boolean, context: 'row' | 'card') => {
    if (paid) return context === 'row' ? 'bg-green-50/60' : 'bg-green-50/60 border-green-200';
    return context === 'row' ? 'bg-red-50/60' : 'bg-red-50/60 border-red-200';
};

const ActionButtons: React.FC<{
    item: { id: string },
    confirmDeleteId: string | null,
    cancelDelete: () => void,
    confirmDeleteItem: () => void,
    handleEdit: (item: any) => void,
    requestDeleteItem: (id: string) => void,
    role: UserRole
}> = ({ item, confirmDeleteId, cancelDelete, confirmDeleteItem, handleEdit, requestDeleteItem, role }) => (
    <td className="px-6 py-4 flex justify-end items-center gap-2">
        {confirmDeleteId === item.id ? (
            <div className="flex items-center gap-2">
                <span className="text-xs text-red-700 font-semibold">Delete?</span>
                <button onClick={cancelDelete} className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                <button onClick={confirmDeleteItem} className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Confirm</button>
            </div>
        ) : (
            <>
                <button onClick={() => handleEdit(item)} disabled={role !== 'admin'} className="p-2 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"><PencilIcon /></button>
                <button onClick={() => requestDeleteItem(item.id)} disabled={role !== 'admin'} className="p-2 text-gray-500 hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed"><TrashIcon /></button>
            </>
        )}
    </td>
);


// --- TAB CONTENT VIEWS ---

export const TasksView: React.FC<ViewProps<Task>> = (props) => {
    const { items, role, sortConfig, requestSort, handleEdit, requestDeleteItem, confirmDeleteId, confirmDeleteItem, cancelDelete } = props;
    const COLUMNS = [ { key: 'name', label: 'Task' }, { key: 'status', label: 'Status' }, { key: 'dueDate', label: 'Due Date' }, { key: 'cost', label: 'Cost' } ];

    return (
        <>
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-medium">
                        <tr>
                            {COLUMNS.map(col => (
                                <th key={col.key} scope="col" className="px-6 py-3">
                                     <button onClick={() => requestSort(col.key as SortableKeys)} className="flex items-center gap-1 group">
                                        {col.label} {getSortIcon(col.key as SortableKeys, sortConfig)}
                                    </button>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                             <tr key={item.id} className={`border-b transition-colors duration-200 ${confirmDeleteId === item.id ? 'bg-red-100' : 'hover:bg-gray-100/50'}`}>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="font-medium text-gray-900">{item.name}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><StatusPill status={item.status}/></td>
                                <td className="px-6 py-4 whitespace-nowrap tabular-nums">{item.dueDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap tabular-nums">₱{item.cost?.toLocaleString() || 0}</td>
                                <ActionButtons {...{item, confirmDeleteId, cancelDelete, confirmDeleteItem, handleEdit, requestDeleteItem, role}} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="block md:hidden p-4 sm:p-6 border-t sm:border-t-0 space-y-3">
                 {items.map(item => (
                    <div key={item.id} className={`p-4 rounded-lg shadow-sm border ${confirmDeleteId === item.id ? 'bg-red-100 border-red-300' : 'bg-white'}`}>
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-800 truncate pr-2">{item.name}</h4>
                            <div className="flex items-center gap-1 flex-shrink-0 -mr-1.5 -mt-1.5">
                                <button onClick={() => handleEdit(item)} disabled={role !== 'admin'} className="p-1.5 text-gray-500 hover:text-blue-600 disabled:text-gray-300"><PencilIcon className="h-4 w-4"/></button>
                                <button onClick={() => requestDeleteItem(item.id)} disabled={role !== 'admin'} className="p-1.5 text-gray-500 hover:text-red-600 disabled:text-gray-300"><TrashIcon className="h-4 w-4"/></button>
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                             <div className="flex justify-between text-xs text-gray-500 tabular-nums"><span>Due: {item.dueDate || 'N/A'}</span><span>Cost: ₱{item.cost?.toLocaleString() || 0}</span></div>
                             <div className="mt-2"><StatusPill status={item.status} /></div>
                        </div>
                         {confirmDeleteId === item.id && (
                             <div className="flex items-center gap-2 pt-3 mt-3 border-t">
                                <span className="text-xs text-red-700 font-semibold">Delete?</span>
                                <button onClick={cancelDelete} className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 ml-auto">Cancel</button>
                                <button onClick={confirmDeleteItem} className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Confirm</button>
                            </div>
                        )}
                    </div>
                 ))}
            </div>
        </>
    );
};

export const LaborView: React.FC<ViewProps<Labor>> = (props) => {
    const { items, role, sortConfig, requestSort, handleEdit, requestDeleteItem, confirmDeleteId, confirmDeleteItem, cancelDelete, handleTogglePaidStatus } = props;
    const COLUMNS = [ { key: 'workers', label: 'Name' }, { key: 'startDate', label: 'Date' }, { key: 'qty', label: 'Hours' }, { key: 'cost', label: 'Total (₱)' }, { key: 'paid', label: 'Status' } ];

    return (
         <>
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-medium">
                        <tr>
                            {COLUMNS.map(col => (
                                <th key={col.key} scope="col" className="px-6 py-3">
                                     <button onClick={() => requestSort(col.key as SortableKeys)} className="flex items-center gap-1 group">
                                        {col.label} {getSortIcon(col.key as SortableKeys, sortConfig)}
                                    </button>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                             <tr key={item.id} className={`border-b transition-colors duration-200 ${confirmDeleteId === item.id ? 'bg-red-100' : `hover:bg-gray-100/50 ${getHighlightClass(item.paid, 'row')}`}`}>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium text-gray-900">{item.workers}</div><div className="text-gray-500 text-xs">{item.crewRole}</div></td>
                                <td className="px-6 py-4 whitespace-nowrap tabular-nums">{item.startDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap tabular-nums">{item.qty}</td>
                                <td className="px-6 py-4 whitespace-nowrap tabular-nums">₱{item.cost?.toLocaleString() || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><PaidToggleButton isPaid={item.paid} onClick={() => handleTogglePaidStatus!(item.id)} role={role} /></td>
                                <ActionButtons {...{item, confirmDeleteId, cancelDelete, confirmDeleteItem, handleEdit, requestDeleteItem, role}} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="block md:hidden p-4 sm:p-6 border-t sm:border-t-0 space-y-3">
                 {items.map(item => (
                    <div key={item.id} className={`p-4 rounded-lg shadow-sm border ${confirmDeleteId === item.id ? 'bg-red-100 border-red-300' : getHighlightClass(item.paid, 'card')}`}>
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-800 truncate pr-2">{item.workers}</h4>
                            <div className="flex items-center gap-1 flex-shrink-0 -mr-1.5 -mt-1.5">
                                <button onClick={() => handleEdit(item)} disabled={role !== 'admin'} className="p-1.5 text-gray-500 hover:text-blue-600 disabled:text-gray-300"><PencilIcon className="h-4 w-4"/></button>
                                <button onClick={() => requestDeleteItem(item.id)} disabled={role !== 'admin'} className="p-1.5 text-gray-500 hover:text-red-600 disabled:text-gray-300"><TrashIcon className="h-4 w-4"/></button>
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                             <div className="flex justify-between items-center text-xs text-gray-500 tabular-nums"><span>Date: {item.startDate}</span><span>Hours: {item.qty}</span></div>
                             <div className="mt-3 flex justify-between items-center"><span className="font-semibold tabular-nums">Total: ₱{item.cost?.toLocaleString() || 0}</span><PaidToggleButton isPaid={item.paid} onClick={() => handleTogglePaidStatus!(item.id)} role={role} /></div>
                        </div>
                         {confirmDeleteId === item.id && (
                             <div className="flex items-center gap-2 pt-3 mt-3 border-t">
                                <span className="text-xs text-red-700 font-semibold">Delete?</span>
                                <button onClick={cancelDelete} className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 ml-auto">Cancel</button>
                                <button onClick={confirmDeleteItem} className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Confirm</button>
                            </div>
                        )}
                    </div>
                 ))}
            </div>
        </>
    );
};

export const MaterialsView: React.FC<ViewProps<Material>> = (props) => {
    const { items, role, sortConfig, requestSort, handleEdit, requestDeleteItem, confirmDeleteId, confirmDeleteItem, cancelDelete, handleTogglePaidStatus } = props;
    const COLUMNS = [ { key: 'item', label: 'Item' }, { key: 'supplier', label: 'Supplier' }, { key: 'received', label: 'Received' }, { key: 'totalCost', label: 'Total' }, { key: 'paid', label: 'Status' } ];

    return (
         <>
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 font-medium">
                        <tr>
                            {COLUMNS.map(col => (
                                <th key={col.key} scope="col" className="px-6 py-3">
                                     <button onClick={() => requestSort(col.key as SortableKeys)} className="flex items-center gap-1 group">
                                        {col.label} {getSortIcon(col.key as SortableKeys, sortConfig)}
                                    </button>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                             <tr key={item.id} className={`border-b transition-colors duration-200 ${confirmDeleteId === item.id ? 'bg-red-100' : `hover:bg-gray-100/50 ${getHighlightClass(item.paid, 'row')}`}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <AttachmentImage attachment={item.attachment} />
                                        <span className="font-medium text-gray-900">{item.item}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.supplier}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.received ? <CheckCircleIcon className="text-green-500"/> : <ClockIcon className="text-gray-400"/>}</td>
                                <td className="px-6 py-4 whitespace-nowrap tabular-nums">₱{item.totalCost?.toLocaleString() || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><PaidToggleButton isPaid={item.paid} onClick={() => handleTogglePaidStatus!(item.id)} role={role} /></td>
                                <ActionButtons {...{item, confirmDeleteId, cancelDelete, confirmDeleteItem, handleEdit, requestDeleteItem, role}} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="block md:hidden p-4 sm:p-6 border-t sm:border-t-0 space-y-3">
                 {items.map(item => (
                    <div key={item.id} className={`p-4 rounded-lg shadow-sm border ${confirmDeleteId === item.id ? 'bg-red-100 border-red-300' : getHighlightClass(item.paid, 'card')}`}>
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3 flex-grow min-w-0">
                                <AttachmentImage attachment={item.attachment} className="h-10 w-10" />
                                <h4 className="font-semibold text-gray-800 truncate">{item.item}</h4>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2 -mr-1.5 -mt-1.5">
                                <button onClick={() => handleEdit(item)} disabled={role !== 'admin'} className="p-1.5 text-gray-500 hover:text-blue-600 disabled:text-gray-300"><PencilIcon className="h-4 w-4"/></button>
                                <button onClick={() => requestDeleteItem(item.id)} disabled={role !== 'admin'} className="p-1.5 text-gray-500 hover:text-red-600 disabled:text-gray-300"><TrashIcon className="h-4 w-4"/></button>
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                             <div className="flex justify-between text-xs text-gray-500"><span>Supplier: {item.supplier || 'N/A'}</span><div className="flex items-center gap-2 text-xs">{item.received ? <><CheckCircleIcon className="h-4 w-4 text-green-500"/> Received</> : <><ClockIcon className="h-4 w-4 text-gray-400"/> Pending</>}</div></div>
                             <div className="mt-3 flex justify-between items-center"><span className="font-semibold tabular-nums">Total: ₱{item.totalCost?.toLocaleString() || 0}</span><PaidToggleButton isPaid={item.paid} onClick={() => handleTogglePaidStatus!(item.id)} role={role} /></div>
                        </div>
                        {confirmDeleteId === item.id && (
                             <div className="flex items-center gap-2 pt-3 mt-3 border-t">
                                <span className="text-xs text-red-700 font-semibold">Delete?</span>
                                <button onClick={cancelDelete} className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 ml-auto">Cancel</button>
                                <button onClick={confirmDeleteItem} className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Confirm</button>
                            </div>
                        )}
                    </div>
                 ))}
            </div>
        </>
    );
};