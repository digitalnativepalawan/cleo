import React, { useState, useMemo, useEffect } from 'react';
import type { UserRole } from '../../Portal.tsx';
import type {
  ProjectData,
  Task,
  Labor,
  Material,
  ProjectItem,
  TaskStatus,
  TaskType,
  Attachment
} from '../../../src/types/portal.ts';
import { PlusIcon, SearchIcon, FilterIcon, XIcon } from '../PortalIcons.tsx';
import { TasksView, LaborView, MaterialsView } from '../../../src/components/portal/views/ProjectItemViews.tsx';
import { saveAttachment, deleteAttachment } from '../../../src/lib/indexedDB.ts';

type ActiveTab = 'tasks' | 'labor' | 'materials';

const simpleId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/* -------------------------------------------------------
   ITEM FORM MODAL (Manual entry only + Google Drive link)
-------------------------------------------------------- */

const ItemFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ProjectItem>) => void;
  onSaveMultiple: (items: Partial<ProjectItem>[]) => Promise<void>;
  item: Partial<ProjectItem> | null;
  itemType: ActiveTab;
}> = ({ isOpen, onClose, onSave, onSaveMultiple: _unused, item, itemType }) => {
  const [formData, setFormData] = useState<Partial<ProjectItem> | null>(item);

  // New: optional Google Drive receipt link for Materials
  const [receiptLink, setReceiptLink] = useState<string>('');

  useEffect(() => {
    setFormData(item);
    setReceiptLink(''); // reset link when opening/closing or switching item
  }, [item, isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // Persist receipt link (if provided) into Notes to avoid changing TS models
    if (itemType === 'materials' && receiptLink.trim()) {
      const existingNotes = (formData as Material).notes || '';
      const linkLine = `Receipt: ${receiptLink.trim()}`;
      const combined = existingNotes ? `${existingNotes}\n${linkLine}` : linkLine;
      formData.notes = combined;
    }

    onSave(formData);
  };

  if (!isOpen || !formData) return null;

  const inputClass =
    'w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const title = `${formData.id ? 'Edit' : 'Add'} ${itemType.charAt(0).toUpperCase() + itemType.slice(1, -1)}`;

  // Simple URL hinting (no hard validation to keep UX smooth)
  const isLikelyDriveUrl = (url: string) =>
    /https?:\/\/(drive|docs)\.google\.com\/.+/i.test(url) || /https?:\/\/drive\.google\.com\/file\/d\//i.test(url);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-h-[90vh] flex flex-col max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <XIcon />
          </button>
        </div>

        <form id="item-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {itemType === 'materials' && (
            <div className="space-y-2">
              <label htmlFor="receiptLink" className={labelClass}>
                Receipt Link (Google Drive URL)
              </label>
              <input
                id="receiptLink"
                type="url"
                inputMode="url"
                placeholder="https://drive.google.com/..."
                className={inputClass}
                value={receiptLink}
                onChange={e => setReceiptLink(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Paste a shared Google Drive link to the photo/PDF of the receipt. This link will be stored in the item’s
                notes (e.g., <span className="italic">Receipt: https://drive.google.com/…</span>).
              </p>
              {receiptLink && !isLikelyDriveUrl(receiptLink) && (
                <p className="text-xs text-amber-600">Tip: it doesn’t look like a Google Drive link.</p>
              )}
              <div className="flex items-center my-3">
                <div className="flex-grow border-t border-gray-200" />
                <span className="mx-3 text-sm text-gray-400">Then fill in the item details below</span>
                <div className="flex-grow border-t border-gray-200" />
              </div>
            </div>
          )}

          {itemType === 'tasks' && (
            <>
              <div>
                <label htmlFor="name" className={labelClass}>
                  Task Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={(formData as Task).name || ''}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className={labelClass}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={(formData as Task).status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {(['Pending', 'Backlog', 'In Progress', 'Blocked', 'Review', 'Done'] as TaskStatus[]).map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className={labelClass}>
                    Type
                  </label>
                  <select name="type" value={(formData as Task).type} onChange={handleChange} className={inputClass}>
                    {(['Design', 'Site Prep', 'Foundation', 'Structure', 'MEP', 'Finish', 'Inspection'] as TaskType[]).map(
                      t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dueDate" className={labelClass}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={(formData as Task).dueDate || ''}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="cost" className={labelClass}>
                    Cost (₱)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={(formData as Task).cost || 0}
                    onChange={handleChange}
                    className={`${inputClass} tabular-nums`}
                  />
                </div>
              </div>
            </>
          )}

          {itemType === 'labor' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="workers" className={labelClass}>
                    Worker(s) Name
                  </label>
                  <input
                    type="text"
                    name="workers"
                    value={(formData as Labor).workers || ''}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="crewRole" className={labelClass}>
                    Role
                  </label>
                  <input
                    type="text"
                    name="crewRole"
                    value={(formData as Labor).crewRole || ''}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className={labelClass}>
                    Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={(formData as Labor).startDate || ''}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="qty" className={labelClass}>
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    name="qty"
                    value={(formData as Labor).qty || 0}
                    onChange={handleChange}
                    className={`${inputClass} tabular-nums`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rate" className={labelClass}>
                    Hourly Rate (₱)
                  </label>
                  <input
                    type="number"
                    name="rate"
                    value={(formData as Labor).rate || 0}
                    onChange={handleChange}
                    className={`${inputClass} tabular-nums`}
                  />
                </div>
                <div>
                  <label htmlFor="cost" className={labelClass}>
                    Total Cost (₱)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    readOnly
                    value={(formData as Labor).cost || 0}
                    onChange={handleChange}
                    className={`${inputClass} bg-gray-50 tabular-nums`}
                  />
                </div>
              </div>
            </>
          )}

          {itemType === 'materials' && (
            <>
              <div>
                <label htmlFor="item" className={labelClass}>
                  Item Name
                </label>
                <input
                  type="text"
                  name="item"
                  value={(formData as Material).item || ''}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className={labelClass}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={(formData as Material).category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {(['Aggregates', 'Timber', 'Steel', 'Electrical', 'Plumbing', 'Finishes', 'Fixtures', 'Other'] as const).map(
                      c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="supplier" className={labelClass}>
                    Supplier
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={(formData as Material).supplier || ''}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="qty" className={labelClass}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="qty"
                    value={(formData as Material).qty || 0}
                    onChange={handleChange}
                    className={`${inputClass} tabular-nums`}
                  />
                </div>
                <div>
                  <label htmlFor="unitCost" className={labelClass}>
                    Unit Cost (₱)
                  </label>
                  <input
                    type="number"
                    name="unitCost"
                    value={(formData as Material).unitCost || 0}
                    onChange={handleChange}
                    className={`${inputClass} tabular-nums`}
                  />
                </div>
                <div>
                  <label htmlFor="totalCost" className={labelClass}>
                    Total Cost (₱)
                  </label>
                  <input
                    type="number"
                    name="totalCost"
                    readOnly
                    value={(formData as Material).totalCost || 0}
                    onChange={handleChange}
                    className={`${inputClass} bg-gray-50 tabular-nums`}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="notes" className={labelClass}>
              Notes
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes || ''}
              onChange={handleChange}
              className={inputClass}
            ></textarea>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center">
              <input
                id="paid"
                name="paid"
                type="checkbox"
                checked={formData.paid || false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="paid" className="ml-2 block text-sm text-gray-900">
                Paid
              </label>
            </div>
            {itemType === 'materials' && (
              <div className="flex items-center">
                <input
                  id="received"
                  name="received"
                  type="checkbox"
                  checked={(formData as Material).received || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="received" className="ml-2 block text-sm text-gray-900">
                  Received
                </label>
              </div>
            )}
          </div>
        </form>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50/70 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 text-base font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="item-form"
            className="bg-blue-600 text-white px-4 py-2 text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------
   MAIN MODULE
----------------- */

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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>({
    key: 'name',
    direction: 'ascending'
  });

  useEffect(() => {
    handleTabChange('tasks');
  }, [project.id]);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    // Reset sorting when tab changes
    const defaultSortKeys: Record<ActiveTab, SortableKeys> = {
      tasks: 'name',
      labor: 'startDate',
      materials: 'item'
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
      case 'tasks':
        newItem = { ...baseItem, name: '', status: 'Backlog', type: 'Design', dueDate: '' } as Partial<Task>;
        break;
      case 'labor':
        newItem = { ...baseItem, crewRole: '', workers: '', rateType: 'Daily', qty: 8, rate: 62.5, cost: 500, startDate: '' } as Partial<Labor>;
        break;
      case 'materials':
        newItem = { ...baseItem, item: '', category: 'Other', unit: 'pc', qty: 1, unitCost: 0, totalCost: 0, supplier: '' } as Partial<Material>;
        break;
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

  const requestDeleteItem = (itemId: string) => {
    if (role !== 'admin') {
      showToast("You don't have permission to delete items.");
      return;
    }
    setConfirmDeleteId(itemId);
  };

  const confirmDeleteItem = () => {
    if (!confirmDeleteId) return;
    const itemId = confirmDeleteId;

    const itemToDelete = [...tasks, ...labor, ...materials].find(i => i.id === itemId);
    if (itemToDelete?.attachment?.type === 'indexeddb') {
      deleteAttachment(itemToDelete.attachment.value).catch(err => console.error('Failed to delete attachment from DB', err));
    }

    let updatedData = { ...projectData };
    switch (activeTab) {
      case 'tasks':
        updatedData.tasks = tasks.filter(t => t.id !== itemId);
        break;
      case 'labor':
        updatedData.labor = labor.filter(l => l.id !== itemId);
        break;
      case 'materials':
        updatedData.materials = materials.filter(m => m.id !== itemId);
        break;
    }
    onUpdateProjectData(updatedData);
    showToast('Item deleted.');
    setConfirmDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleSave = (itemToSave: Partial<ProjectItem>) => {
    let updatedData = { ...projectData };
    if (itemToSave.id) {
      // Update
      switch (activeTab) {
        case 'tasks':
          updatedData.tasks = tasks.map(i => (i.id === itemToSave.id ? (itemToSave as Task) : i));
          break;
        case 'labor':
          updatedData.labor = labor.map(i => (i.id === itemToSave.id ? (itemToSave as Labor) : i));
          break;
        case 'materials':
          updatedData.materials = materials.map(i => (i.id === itemToSave.id ? (itemToSave as Material) : i));
          break;
      }
      showToast('Item updated.');
    } else {
      // Create
      const newItem = { ...itemToSave, id: simpleId() };
      switch (activeTab) {
        case 'tasks':
          updatedData.tasks = [...tasks, newItem as Task];
          break;
        case 'labor':
          updatedData.labor = [...labor, newItem as Labor];
          break;
        case 'materials':
          updatedData.materials = [...materials, newItem as Material];
          break;
      }
      showToast('Item added.');
    }
    onUpdateProjectData(updatedData);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveMultiple = async (itemsToSave: Partial<ProjectItem>[]) => {
    const newItems = await Promise.all(
      itemsToSave.map(async item => {
        const newItemId = simpleId();
        let newAttachment: Attachment | undefined = undefined;
        const materialItem = item as Partial<Material>;

        if (materialItem.attachment?.type === 'local' && materialItem.attachment.value) {
          const attachmentKey = `attachment-${newItemId}`;
          try {
            await saveAttachment(attachmentKey, materialItem.attachment.value);
            newAttachment = {
              type: 'indexeddb',
              value: attachmentKey,
              name: materialItem.attachment.name
            };
          } catch (err) {
            console.error('Failed to save attachment to IndexedDB', err);
          }
        } else {
          newAttachment = materialItem.attachment;
        }

        return {
          ...item,
          id: newItemId,
          projectId: project.id,
          attachment: newAttachment
        };
      })
    );

    let updatedData = { ...projectData };
    switch (activeTab) {
      case 'materials':
        updatedData.materials = [...materials, ...(newItems as Material[])];
        break;
    }

    onUpdateProjectData(updatedData);
    showToast(`${itemsToSave.length} items added successfully.`);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleTogglePaidStatus = (itemId: string) => {
    if (role !== 'admin') {
      showToast("You don't have permission to update status.");
      return;
    }

    const updater = <T extends { id: string; paid: boolean }>(items: T[]) =>
      items.map(item => (item.id === itemId ? { ...item, paid: !item.paid } : item));

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
  const TABS: { id: ActiveTab; label: string; count: number }[] = [
    { id: 'tasks', label: 'Tasks', count: tasks.length },
    { id: 'labor', label: 'Labor', count: labor.length },
    { id: 'materials', label: 'Materials', count: materials.length }
  ];

  const renderActiveTabContent = () => {
    const commonProps = {
      role,
      sortConfig,
      requestSort,
      handleEdit,
      requestDeleteItem,
      confirmDeleteId,
      confirmDeleteItem,
      cancelDelete
    };

    switch (activeTab) {
      case 'tasks':
        return <TasksView items={sortedData as Task[]} {...commonProps} />;
      case 'labor':
        return <LaborView items={sortedData as Labor[]} {...commonProps} handleTogglePaidStatus={handleTogglePaidStatus} />;
      case 'materials':
        return (
          <MaterialsView items={sortedData as Material[]} {...commonProps} handleTogglePaidStatus={handleTogglePaidStatus} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto border-b border-gray-200 sm:border-b-0">
            <nav className="flex -mb-px overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`whitespace-nowrap flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
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

      {renderActiveTabContent()}

      <ItemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onSaveMultiple={handleSaveMultiple}
        item={editingItem}
        itemType={activeTab}
      />
    </div>
  );
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
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-3 py-2 text-base border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white focus:border-blue-500"
        />
      </div>
      <button className="w-full sm:w-auto flex-shrink-0 flex justify-center items-center gap-1.5 px-4 py-2 text-base border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
        <FilterIcon className="h-4 w-4" />
        <span>Filter</span>
      </button>
      <button
        onClick={onAdd}
        disabled={role !== 'admin'}
        className="w-full sm:w-auto flex-shrink-0 flex justify-center items-center gap-1.5 px-4 py-2 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <PlusIcon />
        <span>Add {itemNoun}</span>
      </button>
    </div>
  );
};

export default ProjectModule;
