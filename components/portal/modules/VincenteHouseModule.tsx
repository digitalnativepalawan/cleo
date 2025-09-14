import React, { useState, useEffect, useMemo } from 'react';
import type { UserRole } from '../../Portal';
import type { Task, Labor, Material, ProjectData, TaskStatus, TaskType, LaborRateType, MaterialCategory, MaterialUnit, Attachment } from '../../../types/portal';
import {
  PlusIcon, PencilIcon, TrashIcon, SearchIcon, FilterIcon, CalendarIcon,
  DotsVerticalIcon, ChevronDownIcon, XIcon, UploadIcon, ImageIcon, DriveIcon
} from '../PortalIcons';
import {
  taskOperations,
  laborOperations,
  materialOperations,
  uploadFile
} from '../../../src/lib/supabase-helpers';

const simpleId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const ErrorMessage = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
    <p className="text-red-600 mb-2">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Retry
      </button>
    )}
  </div>
);

// Status Pills
const StatusPill = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    'Pending': 'bg-gray-100 text-gray-800',
    'Backlog': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Blocked': 'bg-red-100 text-red-800',
    'Review': 'bg-purple-100 text-purple-800',
    'Done': 'bg-green-100 text-green-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

// Task Modal Component
const TaskModal = ({ 
  task, 
  onClose, 
  onSave, 
  isLoading 
}: { 
  task: Partial<Task>; 
  onClose: () => void; 
  onSave: (task: Partial<Task>) => Promise<void>;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState(task);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{task.id ? 'Edit' : 'Create'} Task</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" disabled={isLoading}>
            <XIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={formData.name || ''} 
              onChange={handleChange} 
              className={inputClass} 
              required 
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" id="type" value={formData.type || ''} onChange={handleChange} className={inputClass} disabled={isLoading}>
                <option value="">Select type</option>
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
              <select name="status" id="status" value={formData.status || ''} onChange={handleChange} className={inputClass} disabled={isLoading}>
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
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
              <input 
                type="text" 
                name="owner" 
                id="owner" 
                value={formData.owner || ''} 
                onChange={handleChange} 
                className={inputClass} 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input 
                type="date" 
                name="dueDate" 
                id="dueDate" 
                value={formData.dueDate || ''} 
                onChange={handleChange} 
                className={inputClass} 
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="estHours" className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
              <input 
                type="number" 
                name="estHours" 
                id="estHours" 
                value={formData.estHours || ''} 
                onChange={handleChange} 
                className={inputClass} 
                min="0" 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">Cost (₱)</label>
              <input 
                type="number" 
                name="cost" 
                id="cost" 
                value={formData.cost || ''} 
                onChange={handleChange} 
                className={inputClass} 
                min="0" 
                step="0.01" 
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              id="notes" 
              rows={3} 
              value={formData.notes || ''} 
              onChange={handleChange} 
              className={inputClass} 
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="paid" 
              id="paid" 
              checked={formData.paid || false} 
              onChange={handleChange} 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              disabled={isLoading}
            />
            <label htmlFor="paid" className="ml-2 block text-sm text-gray-900">Paid</label>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors" 
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Labor Modal Component
const LaborModal = ({ 
  labor, 
  onClose, 
  onSave, 
  isLoading 
}: { 
  labor: Partial<Labor>; 
  onClose: () => void; 
  onSave: (labor: Partial<Labor>) => Promise<void>;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState(labor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Auto-calculate cost when rate or qty changes
      if (name === 'rate' || name === 'qty') {
        const rate = name === 'rate' ? parseFloat(value) || 0 : prev.rate || 0;
        const qty = name === 'qty' ? parseFloat(value) || 0 : prev.qty || 0;
        updated.cost = rate * qty;
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{labor.id ? 'Edit' : 'Create'} Labor Entry</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" disabled={isLoading}>
            <XIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="crewRole" className="block text-sm font-medium text-gray-700 mb-1">Crew Role</label>
              <input 
                type="text" 
                name="crewRole" 
                id="crewRole" 
                value={formData.crewRole || ''} 
                onChange={handleChange} 
                className={inputClass} 
                required 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="workers" className="block text-sm font-medium text-gray-700 mb-1">Workers</label>
              <input 
                type="text" 
                name="workers" 
                id="workers" 
                value={formData.workers || ''} 
                onChange={handleChange} 
                className={inputClass} 
                required 
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="rateType" className="block text-sm font-medium text-gray-700 mb-1">Rate Type</label>
              <select name="rateType" id="rateType" value={formData.rateType || ''} onChange={handleChange} className={inputClass} disabled={isLoading}>
                <option value="Daily">Daily</option>
                <option value="Hourly">Hourly</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">Rate (₱)</label>
              <input 
                type="number" 
                name="rate" 
                id="rate" 
                value={formData.rate || ''} 
                onChange={handleChange} 
                className={inputClass} 
                min="0" 
                step="0.01" 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input 
                type="number" 
                name="qty" 
                id="qty" 
                value={formData.qty || ''} 
                onChange={handleChange} 
                className={inputClass} 
                min="0" 
                step="0.01" 
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input 
                type="date" 
                name="startDate" 
                id="startDate" 
                value={formData.startDate || ''} 
                onChange={handleChange} 
                className={inputClass} 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input 
                type="date" 
                name="endDate" 
                id="endDate" 
                value={formData.endDate || ''} 
                onChange={handleChange} 
                className={inputClass} 
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <input 
              type="text" 
              name="supplier" 
              id="supplier" 
              value={formData.supplier || ''} 
              onChange={handleChange} 
              className={inputClass} 
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost: ₱{(formData.cost || 0).toLocaleString()}</label>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              id="notes" 
              rows={3} 
              value={formData.notes || ''} 
              onChange={handleChange} 
              className={inputClass} 
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="paid" 
              id="paid" 
              checked={formData.paid || false} 
              onChange={handleChange} 
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              disabled={isLoading}
            />
            <label htmlFor="paid" className="ml-2 block text-sm text-gray-900">Paid</label>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors" 
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Labor'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Material Modal Component
const MaterialModal = ({ 
  material, 
  onClose, 
  onSave, 
  isLoading 
}: { 
  material: Partial<Material>; 
  onClose: () => void; 
  onSave: (material: Partial<Material>) => Promise<void>;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState(material);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Auto-calculate total cost when qty or unitCost changes
      if (name === 'qty' || name === 'unitCost') {
        const qty = name === 'qty' ? parseFloat(value) || 0 : prev.qty || 0;
        const unitCost = name === 'unitCost' ? parseFloat(value) || 0 : prev.unitCost || 0;
        updated.totalCost = qty * unitCost;
      }
      
      return updated;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const { url } = await uploadFile(file, 'materials');
      setFormData(prev => ({ 
        ...prev, 
        attachment: { type: 'image', value: url, name: file.name }
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{material.id ? 'Edit' : 'Create'} Material Entry</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" disabled={isLoading}>
            <XIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input 
              type="text" 
              name="item" 
              id="item" 
              value={formData.item || ''} 
              onChange={handleChange} 
              className={inputClass} 
              required 
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input 
                  type="url" 
                  name="imageUrl" 
                  placeholder="https://example.com/image.jpg" 
                  value={(formData as any).imageUrl || ''} 
                  onChange={handleChange} 
                  className={inputClass} 
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Paste a direct image link, or use file upload on the right.</p>
              </div>
              <div className="flex-shrink-0">
                <label className="flex items-center justify-center w-32 h-10 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 disabled:opacity-50">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    disabled={isLoading || uploading}
                  />
                  <UploadIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm">{uploading ? 'Uploading...' : 'Choose File'}</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {uploading ? 'Uploading to Supabase...' : 'Upload to Supabase Storage'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" id="category" value={formData.category || ''} onChange={handleChange} className={inputClass} disabled={isLoading}>
                <option value="">Select category</option>
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
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select name="unit" id="unit" value={formData.unit || ''} onChange={handleChange} className={inputClass} disabled={isLoading}>
                <option value="">Select unit</option>
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input 
                type="number" 
                name="qty" 
                id="qty" 
                value={formData.qty || ''} 
                onChange={handleChange} 
                className={inputClass} 
                min="0" 
                step="0.01" 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="unitCost" className="block text-sm font-medium text-gray-700 mb-1">Unit Cost (₱)</label>
              <input 
                type="number" 
                name="unitCost" 
                id="unitCost" 
                value={formData.unitCost || ''} 
                onChange={handleChange} 
                className={inputClass} 
                min="0" 
                step="0.01" 
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                ₱{(formData.totalCost || 0).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <input 
                type="text" 
                name="supplier" 
                id="supplier" 
                value={formData.supplier || ''} 
                onChange={handleChange} 
                className={inputClass} 
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="deliveryEta" className="block text-sm font-medium text-gray-700 mb-1">Delivery ETA</label>
              <input 
                type="date" 
                name="deliveryEta" 
                id="deliveryEta" 
                value={formData.deliveryEta || ''} 
                onChange={handleChange} 
                className={inputClass} 
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select name="location" id="location" value={formData.location || 'Site'} onChange={handleChange} className={inputClass} disabled={isLoading}>
                <option value="Site">Site</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>
            <div>
              <label htmlFor="leadTimeDays" className="block text-sm font-medium text-gray-700 mb-1">Lead Time (Days)</label>
              <input 
                type="number" 
                name="leadTimeDays" 
                id="leadTimeDays" 
                value={formData.leadTimeDays || ''} 
                onChange={handleChange} 
                className={inputClass} 
                min="0" 
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              name="notes" 
              id="notes" 
              rows={3} 
              value={formData.notes || ''} 
              onChange={handleChange} 
              className={inputClass} 
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                name="received" 
                id="received" 
                checked={formData.received || false} 
                onChange={handleChange} 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                disabled={isLoading}
              />
              <label htmlFor="received" className="ml-2 block text-sm text-gray-900">Received</label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                name="paid" 
                id="paid" 
                checked={formData.paid || false} 
                onChange={handleChange} 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                disabled={isLoading}
              />
              <label htmlFor="paid" className="ml-2 block text-sm text-gray-900">Paid</label>
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-lg">
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors" 
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50" 
            disabled={isLoading || uploading}
          >
            {isLoading ? 'Saving...' : 'Save Material'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const VincenteHouseModule: React.FC<{
  project: { id: string; name: string };
  role: UserRole;
  showToast: (msg: string) => void;
  projectData: ProjectData;
  onUpdateProjectData: (data: ProjectData) => void;
}> = ({ project, role, showToast, projectData, onUpdateProjectData }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'labor' | 'materials'>('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isLaborModalOpen, setIsLaborModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh data from Supabase
  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const [tasks, labor, materials] = await Promise.all([
        taskOperations.getByProject(project.id),
        laborOperations.getByProject(project.id),
        materialOperations.getByProject(project.id)
      ]);
      
      onUpdateProjectData({ tasks, labor, materials });
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data from database');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (!projectData.tasks.length && !projectData.labor.length && !projectData.materials.length) {
      refreshData();
    }
  }, [project.id]);

  // Task operations
  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      setIsLoading(true);
      
      const taskToSave = {
        ...taskData,
        projectId: project.id,
        order: taskData.order || projectData.tasks.length
      };

      let savedTask: Task;
      if (taskData.id) {
        savedTask = await taskOperations.update(taskData.id, taskToSave);
      } else {
        savedTask = await taskOperations.create(taskToSave);
      }

      // Update local state
      const updatedTasks = taskData.id 
        ? projectData.tasks.map(t => t.id === taskData.id ? savedTask : t)
        : [...projectData.tasks, savedTask];
      
      onUpdateProjectData({
        ...projectData,
        tasks: updatedTasks
      });

      setIsTaskModalOpen(false);
      setEditingItem(null);
      showToast(taskData.id ? 'Task updated successfully' : 'Task created successfully');
    } catch (err) {
      console.error('Error saving task:', err);
      showToast('Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setIsLoading(true);
      await taskOperations.delete(taskId);
      
      const updatedTasks = projectData.tasks.filter(t => t.id !== taskId);
      onUpdateProjectData({
        ...projectData,
        tasks: updatedTasks
      });
      
      showToast('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      showToast('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  // Labor operations
  const handleSaveLabor = async (laborData: Partial<Labor>) => {
    try {
      setIsLoading(true);
      
      const laborToSave = {
        ...laborData,
        projectId: project.id
      };

      let savedLabor: Labor;
      if (laborData.id) {
        savedLabor = await laborOperations.update(laborData.id, laborToSave);
      } else {
        savedLabor = await laborOperations.create(laborToSave);
      }

      // Update local state
      const updatedLabor = laborData.id 
        ? projectData.labor.map(l => l.id === laborData.id ? savedLabor : l)
        : [...projectData.labor, savedLabor];
      
      onUpdateProjectData({
        ...projectData,
        labor: updatedLabor
      });

      setIsLaborModalOpen(false);
      setEditingItem(null);
      showToast(laborData.id ? 'Labor entry updated successfully' : 'Labor entry created successfully');
    } catch (err) {
      console.error('Error saving labor:', err);
      showToast('Failed to save labor entry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLabor = async (laborId: string) => {
    if (!window.confirm('Are you sure you want to delete this labor entry?')) return;
    
    try {
      setIsLoading(true);
      await laborOperations.delete(laborId);
      
      const updatedLabor = projectData.labor.filter(l => l.id !== laborId);
      onUpdateProjectData({
        ...projectData,
        labor: updatedLabor
      });
      
      showToast('Labor entry deleted successfully');
    } catch (err) {
      console.error('Error deleting labor:', err);
      showToast('Failed to delete labor entry');
    } finally {
      setIsLoading(false);
    }
  };

  // Material operations
  const handleSaveMaterial = async (materialData: Partial<Material>) => {
    try {
      setIsLoading(true);
      
      const materialToSave = {
        ...materialData,
        projectId: project.id
      };

      let savedMaterial: Material;
      if (materialData.id) {
        savedMaterial = await materialOperations.update(materialData.id, materialToSave);
      } else {
        savedMaterial = await materialOperations.create(materialToSave);
      }

      // Update local state
      const updatedMaterials = materialData.id 
        ? projectData.materials.map(m => m.id === materialData.id ? savedMaterial : m)
        : [...projectData.materials, savedMaterial];
      
      onUpdateProjectData({
        ...projectData,
        materials: updatedMaterials
      });

      setIsMaterialModalOpen(false);
      setEditingItem(null);
      showToast(materialData.id ? 'Material updated successfully' : 'Material created successfully');
    } catch (err) {
      console.error('Error saving material:', err);
      showToast('Failed to save material');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    
    try {
      setIsLoading(true);
      await materialOperations.delete(materialId);
      
      const updatedMaterials = projectData.materials.filter(m => m.id !== materialId);
      onUpdateProjectData({
        ...projectData,
        materials: updatedMaterials
      });
      
      showToast('Material deleted successfully');
    } catch (err) {
      console.error('Error deleting material:', err);
      showToast('Failed to delete material');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data based on search and status
  const filteredTasks = useMemo(() => {
    return projectData.tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.owner.toLowerCase().includes(searchTerm.toLowerCase());
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

  if (error) {
    return <ErrorMessage message={error} onRetry={refreshData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{project.name}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage tasks, labor, and materials for this project.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={refreshData}
            disabled={isRefreshing}
            className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'tasks', label: 'Tasks', count: projectData.tasks.length },
            { key: 'labor', label: 'Labor', count: projectData.labor.length },
            { key: 'materials', label: 'Materials', count: projectData.materials.length }
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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <option value="Backlog">Backlog</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
        )}

        {role === 'admin' && (
          <button
            onClick={() => {
              setEditingItem(null);
              if (activeTab === 'tasks') setIsTaskModalOpen(true);
              else if (activeTab === 'labor') setIsLaborModalOpen(true);
              else if (activeTab === 'materials') setIsMaterialModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon />
            Add {activeTab.slice(0, -1)}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {isRefreshing && <LoadingSpinner />}
        
        {!isRefreshing && (
          <>
            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Task</th>
                      <th scope="col" className="px-6 py-3">Type</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Owner</th>
                      <th scope="col" className="px-6 py-3">Due Date</th>
                      <th scope="col" className="px-6 py-3">Cost</th>
                      <th scope="col" className="px-6 py-3">Paid</th>
                      {role === 'admin' && <th scope="col" className="px-6 py-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.length > 0 ? filteredTasks.map(task => (
                      <tr key={task.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{task.name}</td>
                        <td className="px-6 py-4">{task.type}</td>
                        <td className="px-6 py-4"><StatusPill status={task.status} /></td>
                        <td className="px-6 py-4">{task.owner}</td>
                        <td className="px-6 py-4">{task.dueDate}</td>
                        <td className="px-6 py-4">₱{task.cost.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {task.paid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        {role === 'admin' && (
                          <td className="px-6 py-4 flex justify-end gap-2">
                            <button 
                              onClick={() => { setEditingItem(task); setIsTaskModalOpen(true); }}
                              className="p-2 text-gray-500 hover:text-blue-600"
                              disabled={isLoading}
                            >
                              <PencilIcon />
                            </button>
                            <button 
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-gray-500 hover:text-red-600"
                              disabled={isLoading}
                            >
                              <TrashIcon />
                            </button>
                          </td>
                        )}
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={role === 'admin' ? 8 : 7} className="text-center py-10 text-gray-500">
                          No tasks found. {role === 'admin' && 'Click "Add task" to get started.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Labor Tab */}
            {activeTab === 'labor' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Role</th>
                      <th scope="col" className="px-6 py-3">Workers</th>
                      <th scope="col" className="px-6 py-3">Rate Type</th>
                      <th scope="col" className="px-6 py-3">Rate</th>
                      <th scope="col" className="px-6 py-3">Qty</th>
                      <th scope="col" className="px-6 py-3">Total Cost</th>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Paid</th>
                      {role === 'admin' && <th scope="col" className="px-6 py-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLabor.length > 0 ? filteredLabor.map(labor => (
                      <tr key={labor.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{labor.crewRole}</td>
                        <td className="px-6 py-4">{labor.workers}</td>
                        <td className="px-6 py-4">{labor.rateType}</td>
                        <td className="px-6 py-4">₱{labor.rate.toLocaleString()}</td>
                        <td className="px-6 py-4">{labor.qty}</td>
                        <td className="px-6 py-4">₱{labor.cost.toLocaleString()}</td>
                        <td className="px-6 py-4">{labor.startDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${labor.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {labor.paid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        {role === 'admin' && (
                          <td className="px-6 py-4 flex justify-end gap-2">
                            <button 
                              onClick={() => { setEditingItem(labor); setIsLaborModalOpen(true); }}
                              className="p-2 text-gray-500 hover:text-blue-600"
                              disabled={isLoading}
                            >
                              <PencilIcon />
                            </button>
                            <button 
                              onClick={() => handleDeleteLabor(labor.id)}
                              className="p-2 text-gray-500 hover:text-red-600"
                              disabled={isLoading}
                            >
                              <TrashIcon />
                            </button>
                          </td>
                        )}
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={role === 'admin' ? 9 : 8} className="text-center py-10 text-gray-500">
                          No labor entries found. {role === 'admin' && 'Click "Add labor" to get started.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Image</th>
                      <th scope="col" className="px-6 py-3">Item</th>
                      <th scope="col" className="px-6 py-3">Category</th>
                      <th scope="col" className="px-6 py-3">Qty</th>
                      <th scope="col" className="px-6 py-3">Unit Cost</th>
                      <th scope="col" className="px-6 py-3">Total Cost</th>
                      <th scope="col" className="px-6 py-3">Supplier</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      {role === 'admin' && <th scope="col" className="px-6 py-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.length > 0 ? filteredMaterials.map(material => (
                      <tr key={material.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {material.attachment?.value ? (
                            <img 
                              src={material.attachment.value} 
                              alt={material.item}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{material.item}</td>
                        <td className="px-6 py-4">{material.category}</td>
                        <td className="px-6 py-4">{material.qty} {material.unit}</td>
                        <td className="px-6 py-4">₱{material.unitCost.toLocaleString()}</td>
                        <td className="px-6 py-4">₱{material.totalCost.toLocaleString()}</td>
                        <td className="px-6 py-4">{material.supplier}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${material.received ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {material.received ? 'Received' : 'Pending'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${material.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {material.paid ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                        </td>
                        {role === 'admin' && (
                          <td className="px-6 py-4 flex justify-end gap-2">
                            <button 
                              onClick={() => { setEditingItem(material); setIsMaterialModalOpen(true); }}
                              className="p-2 text-gray-500 hover:text-blue-600"
                              disabled={isLoading}
                            >
                              <PencilIcon />
                            </button>
                            <button 
                              onClick={() => handleDeleteMaterial(material.id)}
                              className="p-2 text-gray-500 hover:text-red-600"
                              disabled={isLoading}
                            >
                              <TrashIcon />
                            </button>
                          </td>
                        )}
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={role === 'admin' ? 9 : 8} className="text-center py-10 text-gray-500">
                          No materials found. {role === 'admin' && 'Click "Add material" to get started.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {isTaskModalOpen && (
        <TaskModal
          task={editingItem || { projectId: project.id }}
          onClose={() => { setIsTaskModalOpen(false); setEditingItem(null); }}
          onSave={handleSaveTask}
          isLoading={isLoading}
        />
      )}

      {isLaborModalOpen && (
        <LaborModal
          labor={editingItem || { projectId: project.id }}
          onClose={() => { setIsLaborModalOpen(false); setEditingItem(null); }}
          onSave={handleSaveLabor}
          isLoading={isLoading}
        />
      )}

      {isMaterialModalOpen && (
        <MaterialModal
          material={editingItem || { projectId: project.id }}
          onClose={() => { setIsMaterialModalOpen(false); setEditingItem(null); }}
          onSave={handleSaveMaterial}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default VincenteHouseModule;