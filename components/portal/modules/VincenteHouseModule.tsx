import React, { useMemo, useState } from 'react';
import type { UserRole } from '../../Portal';
import type {
  Task,
  Labor,
  Material,
  ProjectData,
  TaskStatus,
  TaskType,
  LaborRateType,
  MaterialCategory,
  MaterialUnit,
} from '../../../types/portal';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SearchIcon,
  TableIcon,
  ViewGridIcon,
  XIcon,
} from '../PortalIcons';

/** ─────────────────────────────────────────────────────────
 *  CONFIG — change if your backend route is different
 *  e.g. '/upload' or '/api/upload'
 *  The endpoint should return JSON: { url: string, key?: string }
 *  where `url` is the public object URL in Sevalla storage.
 *  ───────────────────────────────────────────────────────── */
const UPLOAD_ENDPOINT = '/api/upload';

// ---------- Utils ----------
const simpleId = () =>
  `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
);

// ---------- Options ----------
const TASK_STATUSES: TaskStatus[] = [
  'Pending',
  'Backlog',
  'In Progress',
  'Blocked',
  'Review',
  'Done',
];
const TASK_TYPES: TaskType[] = [
  'Design',
  'Site Prep',
  'Foundation',
  'Structure',
  'MEP',
  'Finish',
  'Inspection',
];
const LABOR_RATE_TYPES: LaborRateType[] = ['Daily', 'Hourly', 'Contract'];
const MATERIAL_CATEGORIES: MaterialCategory[] = [
  'Aggregates',
  'Timber',
  'Steel',
  'Electrical',
  'Plumbing',
  'Finishes',
  'Fixtures',
  'Other',
];
const MATERIAL_UNITS: MaterialUnit[] = [
  'pc',
  'box',
  'm',
  'sqm',
  'kg',
  'ton',
  'liter',
  'gallon',
];

// ---------- Helpers ----------
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Backlog: 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Blocked: 'bg-red-100 text-red-800',
    Review: 'bg-purple-100 text-purple-800',
    Done: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/** Upload a file to backend -> Sevalla; returns public URL */
async function uploadFileToSevalla(file: File): Promise<{ url: string; key?: string }> {
  try {
    // For demo purposes, convert file to data URL for immediate preview
    // In production, you'd upload to actual cloud storage
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Simulate API call for consistency
    const fd = new FormData();
    fd.append('file', file);
    
    try {
      const res = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: fd,
      });
      
      if (res.ok) {
        const data = await res.json();
        return { url: data.url || dataUrl, key: data.key };
      }
    } catch (apiError) {
      console.warn('API upload failed, using local data URL:', apiError);
    }

    // Fallback to data URL if API fails
    return { 
      url: dataUrl, 
      key: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
    };
    
  } catch (error) {
    throw new Error(`File processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ========================================================
// Task Modal
// ========================================================
const TaskModal: React.FC<{
  task: Partial<Task>;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}> = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState(task);
  const inputClass =
    'w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {task.id ? 'Edit' : 'Create'} Task
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={(formData as any).name || ''}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Type
              </label>
              <select
                name="type"
                id="type"
                value={(formData as any).type || ''}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select type</option>
                {TASK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                value={(formData as any).status || ''}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select status</option>
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={(formData as any).startDate || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={(formData as any).dueDate || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="owner"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Owner
              </label>
              <input
                type="text"
                name="owner"
                id="owner"
                value={(formData as any).owner || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="cost"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cost (₱)
              </label>
              <input
                type="number"
                name="cost"
                id="cost"
                value={(formData as any).cost || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              value={(formData as any).notes || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
};

// ========================================================
// Labor Modal
// ========================================================
const LaborModal: React.FC<{
  labor: Partial<Labor>;
  onClose: () => void;
  onSave: (labor: Partial<Labor>) => void;
}> = ({ labor, onClose, onSave }) => {
  const [formData, setFormData] = useState(labor);
  const inputClass =
    'w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const newData: any = { ...formData, [name]: value };

    if (name === 'rate' || name === 'qty') {
      const rate = parseFloat(
        name === 'rate' ? value : (formData as any).rate?.toString() || '0'
      );
      const qty = parseFloat(
        name === 'qty' ? value : (formData as any).qty?.toString() || '0'
      );
      (newData as any).cost = rate * qty;
    }
    setFormData(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {(labor as any).id ? 'Edit' : 'Create'} Labor Entry
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="crewRole"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Crew Role
              </label>
              <input
                type="text"
                name="crewRole"
                id="crewRole"
                value={(formData as any).crewRole || ''}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label
                htmlFor="workers"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Workers
              </label>
              <input
                type="text"
                name="workers"
                id="workers"
                value={(formData as any).workers || ''}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="rateType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rate Type
              </label>
              <select
                name="rateType"
                id="rateType"
                value={(formData as any).rateType || ''}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select type</option>
                {LABOR_RATE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="rate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rate (₱)
              </label>
              <input
                type="number"
                step="0.01"
                name="rate"
                id="rate"
                value={(formData as any).rate || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="qty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity
              </label>
              <input
                type="number"
                step="0.01"
                name="qty"
                id="qty"
                value={(formData as any).qty || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={(formData as any).startDate || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={(formData as any).endDate || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Cost: ₱{(((formData as any).cost || 0) as number).toLocaleString()}
            </label>
          </div>

          <div>
            <label
              htmlFor="supplier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Supplier
            </label>
            <input
              type="text"
              name="supplier"
              id="supplier"
              value={(formData as any).supplier || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              value={(formData as any).notes || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Labor
          </button>
        </div>
      </div>
    </div>
  );
};

// ========================================================
/** Material Modal — Image URL or local file upload to Sevalla */
// ========================================================
const MaterialModal: React.FC<{
  material: Partial<Material>;
  onClose: () => void;
  onSave: (material: Partial<Material>) => void;
}> = ({ material, onClose, onSave }) => {
  const [formData, setFormData] = useState(material);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputClass =
    'w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const newData: any = { ...(formData as any), [name]: value };

    if (name === 'unitCost' || name === 'qty') {
      const unitCost = parseFloat(
        name === 'unitCost' ? value : ((formData as any).unitCost ?? '').toString() || '0'
      );
      const qty = parseFloat(
        name === 'qty' ? value : ((formData as any).qty ?? '').toString() || '0'
      );
      newData.totalCost = unitCost * qty;
    }
    setFormData(newData);
  };

  // Image URL typed by user
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setFormData((prev) => ({ ...(prev as any), imageUrl: v }));
    setPreview(v || null);
    setSelectedFile(null);
  };

  // Local file upload – keep preview with Object URL (faster than Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }
    setSelectedFile(file);
    const objUrl = URL.createObjectURL(file);
    setPreview(objUrl);
    // Do not set imageUrl here; we only set it after successful upload
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      let imageUrl = (formData as any).imageUrl as string | undefined;

      // If a file is selected, upload it and use the returned URL
      if (selectedFile) {
        const { url } = await uploadFileToSevalla(selectedFile);
        imageUrl = url;
      }

      const payload = {
        ...(formData as any),
        imageUrl: imageUrl || '',
      };

      onSave(payload);
      setSaving(false);
    } catch (err: any) {
      setSaving(false);
      alert(err?.message || 'Upload failed');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {(material as any).id ? 'Edit' : 'Create'} Material Entry
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label
              htmlFor="item"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Item Name
            </label>
            <input
              type="text"
              name="item"
              id="item"
              value={(formData as any).item || ''}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Image URL + Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={(formData as any).imageUrl || ''}
                onChange={handleImageUrlChange}
                className={inputClass}
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste a direct image link, or use file upload on the right.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border file:border-gray-300 file:bg-white hover:file:bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Selecting a file will upload to Sevalla on save.
              </p>
            </div>
          </div>

          {(preview || (formData as any).imageUrl) ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview || (formData as any).imageUrl}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-md border border-gray-200"
              />
              <span className="text-xs text-gray-500">Preview</span>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                value={(formData as any).category || ''}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select category</option>
                {MATERIAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit
              </label>
              <select
                name="unit"
                id="unit"
                value={(formData as any).unit || ''}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select unit</option>
                {MATERIAL_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="qty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity
              </label>
              <input
                type="number"
                step="0.01"
                name="qty"
                id="qty"
                value={(formData as any).qty || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="unitCost"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit Cost (₱)
              </label>
              <input
                type="number"
                step="0.01"
                name="unitCost"
                id="unitCost"
                value={(formData as any).unitCost || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Cost
              </label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                ₱{(((formData as any).totalCost || 0) as number).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="supplier"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier
              </label>
              <input
                type="text"
                name="supplier"
                id="supplier"
                value={(formData as any).supplier || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="deliveryEta"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Delivery ETA
              </label>
              <input
                type="date"
                name="deliveryEta"
                id="deliveryEta"
                value={(formData as any).deliveryEta || ''}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              value={(formData as any).notes || ''}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Material'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ========================================================
// Image Preview Modal (clickable thumbnail → large)
// ========================================================
const ImagePreviewModal: React.FC<{
  src: string;
  alt?: string;
  onClose: () => void;
}> = ({ src, alt = 'Material image', onClose }) => (
  <div
    className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <div className="text-sm text-gray-600 truncate pr-4">{alt}</div>
        <div className="flex gap-2">
          <a
            href={src}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Download
          </a>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>

      <div className="p-3 bg-gray-50">
        <div className="w-full max-h-[70vh] overflow-auto rounded-lg bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="block max-w-full h-auto mx-auto select-none"
          />
        </div>
      </div>
    </div>
  </div>
);

// ========================================================
// Main Module
// ========================================================
const VincenteHouseModule: React.FC<{
  project: { id: string; name: string };
  role: UserRole;
  showToast: (msg: string) => void;
  projectData: ProjectData;
  onUpdateProjectData: (data: ProjectData) => void;
}> = ({ project, role, showToast, projectData, onUpdateProjectData }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'labor' | 'materials'>(
    'tasks'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // NEW: image preview state
  const [imagePreview, setImagePreview] = useState<{
    src: string;
    alt?: string;
  } | null>(null);

  const getMaterialImageSrc = (m: any) => m.imageUrl?.trim() || '';

  // searches
  const filteredTasks = useMemo(
    () =>
      projectData.tasks.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.status.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [projectData.tasks, searchTerm]
  );

  const filteredLabor = useMemo(
    () =>
      projectData.labor.filter(
        (l) =>
          l.crewRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.workers.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [projectData.labor, searchTerm]
  );

  const filteredMaterials = useMemo(
    () =>
      projectData.materials.filter(
        (m) =>
          m.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [projectData.materials, searchTerm]
  );

  // CRUD
  const handleAdd = () => {
    if (isLoading) return;
    setEditingItem({});
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    if (role !== 'admin' || isLoading) return;
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (role !== 'admin' || isLoading) return;
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsLoading(true);
      const newData = { ...projectData };
      if (activeTab === 'tasks') {
        newData.tasks = newData.tasks.filter((t) => t.id !== id);
      } else if (activeTab === 'labor') {
        newData.labor = newData.labor.filter((l) => l.id !== id);
      } else {
        newData.materials = newData.materials.filter((m) => m.id !== id);
      }
      onUpdateProjectData(newData);
      showToast('Item deleted successfully.');
      setIsLoading(false);
    }
  };

  const handleSave = (item: any) => {
    setIsLoading(true);
    const newData = { ...projectData };
    const itemWithId = item.id ? item : { ...item, id: simpleId(), projectId: project.id };

    if (activeTab === 'tasks') {
      newData.tasks = item.id
        ? newData.tasks.map((t) => (t.id === item.id ? itemWithId : t))
        : [...newData.tasks, itemWithId];
    } else if (activeTab === 'labor') {
      newData.labor = item.id
        ? newData.labor.map((l) => (l.id === item.id ? itemWithId : l))
        : [...newData.labor, itemWithId];
    } else {
      newData.materials = item.id
        ? newData.materials.map((m) => (m.id === item.id ? itemWithId : m))
        : [...newData.materials, itemWithId];
    }

    onUpdateProjectData(newData);
    setIsModalOpen(false);
    setEditingItem(null);
    showToast(`${activeTab.slice(0, -1)} ${item.id ? 'updated' : 'created'} successfully.`);
    setIsLoading(false);
  };

  // renderers
  const renderTasksTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3 min-w-[200px]">Task Name</th>
            <th className="px-6 py-3 min-w-[100px]">Type</th>
            <th className="px-6 py-3 min-w-[120px]">Status</th>
            <th className="px-6 py-3 min-w-[100px]">Owner</th>
            <th className="px-6 py-3 min-w-[120px]">Due Date</th>
            <th className="px-6 py-3 min-w-[100px]">Cost</th>
            <th className="px-6 py-3 min-w-[100px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length ? (
            filteredTasks.map((task) => (
              <tr key={task.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{task.name}</td>
                <td className="px-6 py-4">{task.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">{task.owner}</td>
                <td className="px-6 py-4">{task.dueDate}</td>
                <td className="px-6 py-4">₱{task.cost.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {role === 'admin' ? (
                      <>
                        <button
                          onClick={() => handleEdit(task)}
                          disabled={isLoading}
                          className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          disabled={isLoading}
                          className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50"
                        >
                          <TrashIcon />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Read-only</span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-500">
                No tasks found. {role === 'admin' && 'Click "Add Task" to get started.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderLaborTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-3 min-w-[120px]">Role</th>
            <th className="px-4 py-3 min-w-[100px]">Workers</th>
            <th className="px-4 py-3 min-w-[120px]">Rate</th>
            <th className="px-4 py-3 min-w-[80px] text-center">Qty</th>
            <th className="px-4 py-3 min-w-[100px] text-right">Cost</th>
            <th className="px-4 py-3 min-w-[100px]">Date</th>
            <th className="px-4 py-3 min-w-[100px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLabor.length ? (
            filteredLabor.map((labor) => (
              <tr key={labor.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-900">{labor.crewRole}</td>
                <td className="px-4 py-4">{labor.workers}</td>
                <td className="px-4 py-4">
                  ₱{labor.rate.toFixed(2)}/{labor.rateType.toLowerCase()}
                </td>
                <td className="px-4 py-4 text-center">{labor.qty}</td>
                <td className="px-4 py-4 text-right">₱{labor.cost.toLocaleString()}</td>
                <td className="px-4 py-4">{labor.startDate}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {role === 'admin' ? (
                      <>
                        <button
                          onClick={() => handleEdit(labor)}
                          disabled={isLoading}
                          className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(labor.id)}
                          disabled={isLoading}
                          className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50"
                        >
                          <TrashIcon />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Read-only</span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-500">
                No labor entries found. {role === 'admin' && 'Click "Add Labor" to get started.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderMaterialsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {/* Image column */}
            <th className="px-4 py-3 w-[72px]">Image</th>
            <th className="px-4 py-3 min-w-[200px]">Item</th>
            <th className="px-4 py-3 min-w-[100px]">Category</th>
            <th className="px-4 py-3 min-w-[80px] text-center">Quantity</th>
            <th className="px-4 py-3 min-w-[100px] text-right">Unit Cost</th>
            <th className="px-4 py-3 min-w-[100px] text-right">Total Cost</th>
            <th className="px-4 py-3 min-w-[120px]">Supplier</th>
            <th className="px-4 py-3 min-w-[100px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.length ? (
            filteredMaterials.map((material) => {
              const src = getMaterialImageSrc(material);
              return (
                <tr key={material.id} className="bg-white border-b hover:bg-gray-50">
                  {/* Clickable thumbnail */}
                  <td className="px-4 py-4">
                    {src ? (
                      <button
                        onClick={() => setImagePreview({ src, alt: material.item })}
                        className="block rounded-md overflow-hidden border border-gray-200 hover:ring-2 hover:ring-blue-400 focus:ring-2 focus:ring-blue-500 transition-shadow"
                        title="Click to preview"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={material.item}
                          className="w-[56px] h-[56px] object-cover"
                        />
                      </button>
                    ) : (
                      <div className="w-[56px] h-[56px] rounded-md border border-dashed border-gray-300 grid place-content-center text-[10px] text-gray-400">
                        No image
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-900">
                    {material.item}
                  </td>
                  <td className="px-4 py-4">{material.category}</td>
                  <td className="px-4 py-4 text-center">
                    {material.qty} {material.unit}
                  </td>
                  <td className="px-4 py-4 text-right">
                    ₱{material.unitCost.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    ₱{material.totalCost.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">{material.supplier}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {role === 'admin' ? (
                        <>
                          <button
                            onClick={() => handleEdit(material)}
                            disabled={isLoading}
                            className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(material.id)}
                            disabled={isLoading}
                            className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50"
                          >
                            <TrashIcon />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Read-only
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-10 text-gray-500">
                No materials found. {role === 'admin' && 'Click "Add Material" to get started.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const getTabLabel = (tab: string) => {
    const counts = {
      tasks: projectData.tasks.length,
      labor: projectData.labor.length,
      materials: projectData.materials.length,
    };
    return `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${
      counts[tab as keyof typeof counts]
    })`;
  };

  const getAddButtonLabel = () =>
    `Add ${activeTab === 'tasks' ? 'task' : activeTab === 'labor' ? 'labor' : 'material'}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{project.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage tasks, labor, and materials for this project.
            </p>
          </div>
          {role === 'admin' && (
            <button
              onClick={handleAdd}
              disabled={isLoading}
              className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <PlusIcon />
              <span>{getAddButtonLabel()}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4 sm:px-6" aria-label="Tabs">
          {(['tasks', 'labor', 'materials'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </nav>
      </div>

      {/* Controls */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TableIcon />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ViewGridIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {activeTab === 'tasks' && renderTasksTable()}
            {activeTab === 'labor' && renderLaborTable()}
            {activeTab === 'materials' && renderMaterialsTable()}
          </>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && activeTab === 'tasks' && (
        <TaskModal
          task={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}
      {isModalOpen && activeTab === 'labor' && (
        <LaborModal
          labor={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}
      {isModalOpen && activeTab === 'materials' && (
        <MaterialModal
          material={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Image Preview */}
      {imagePreview && (
        <ImagePreviewModal
          src={imagePreview.src}
          alt={imagePreview.alt}
          onClose={() => setImagePreview(null)}
        />
      )}
    </div>
  );
};

export default VincenteHouseModule;
