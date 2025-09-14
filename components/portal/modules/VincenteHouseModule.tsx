import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from '../PortalIcons';

interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier: string;
}

interface Task {
  id: string;
  name: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
  assignedTo: string;
  dueDate: string;
  cost: number;
}

interface Labor {
  id: string;
  role: string;
  workers: number;
  rate: number;
  hours: number;
  totalCost: number;
  supplier: string;
}

const VincenteHouseModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'tasks' | 'labor'>('materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Sample data - in real app, this would come from API
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: 'Primer Epoxy Paint set', category: 'Finishes', quantity: 2, unit: 'pc', unitCost: 450, totalCost: 900, supplier: 'Local Hardware' },
    { id: '2', name: 'Roll Brush #2', category: 'Finishes', quantity: 6, unit: 'pc', unitCost: 55, totalCost: 330, supplier: 'Local Hardware' },
    { id: '3', name: 'White Wall Paint', category: 'Finishes', quantity: 1, unit: 'pc', unitCost: 700, totalCost: 700, supplier: 'Local Hardware' }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Foundation Work', status: 'In Progress', assignedTo: 'David', dueDate: '2024-12-15', cost: 15000 },
    { id: '2', name: 'Electrical Wiring', status: 'Pending', assignedTo: 'John', dueDate: '2024-12-20', cost: 8000 },
    { id: '3', name: 'Plumbing Installation', status: 'Completed', assignedTo: 'JR', dueDate: '2024-12-10', cost: 12000 }
  ]);

  const [labor, setLabor] = useState<Labor[]>([
    { id: '1', role: 'Carpenter', workers: 3, rate: 500, hours: 40, totalCost: 60000, supplier: 'Local Crew' },
    { id: '2', role: 'Electrician', workers: 2, rate: 600, hours: 30, totalCost: 36000, supplier: 'Tech Electric' },
    { id: '3', role: 'Plumber', workers: 2, rate: 550, hours: 25, totalCost: 27500, supplier: 'WaterWorks' }
  ]);

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'materials') {
        setMaterials(materials.filter(m => m.id !== id));
      } else if (activeTab === 'tasks') {
        setTasks(tasks.filter(t => t.id !== id));
      } else if (activeTab === 'labor') {
        setLabor(labor.filter(l => l.id !== id));
      }
    }
  };

  const handleSave = (data: any) => {
    if (activeTab === 'materials') {
      if (editingItem) {
        setMaterials(materials.map(m => m.id === editingItem.id ? { ...data, id: editingItem.id } : m));
      } else {
        setMaterials([...materials, { ...data, id: Date.now().toString() }]);
      }
    }
    // Similar logic for tasks and labor
    setIsModalOpen(false);
  };

  const filteredData = {
    materials: materials.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    tasks: tasks.filter(t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.status.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    labor: labor.filter(l =>
      l.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const totals = {
    materials: materials.reduce((sum, m) => sum + m.totalCost, 0),
    tasks: tasks.reduce((sum, t) => sum + t.cost, 0),
    labor: labor.reduce((sum, l) => sum + l.totalCost, 0),
    overall: materials.reduce((sum, m) => sum + m.totalCost, 0) +
             tasks.reduce((sum, t) => sum + t.cost, 0) +
             labor.reduce((sum, l) => sum + l.totalCost, 0)
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vince's House</h1>
        <p className="text-gray-600">Manage tasks, labor, and materials for this project.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Tasks</h3>
          <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
          <p className="text-sm text-gray-500">₱{totals.tasks.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Labor</h3>
          <p className="text-2xl font-bold text-gray-900">{labor.length}</p>
          <p className="text-sm text-gray-500">₱{totals.labor.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Materials</h3>
          <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
          <p className="text-sm text-gray-500">₱{totals.materials.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border bg-blue-50">
          <h3 className="text-sm font-medium text-gray-600">Total Budget</h3>
          <p className="text-2xl font-bold text-gray-900">₱{totals.overall.toLocaleString()}</p>
          <p className="text-sm text-green-600">On track</p>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('labor')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'labor' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Labor ({labor.length})
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'materials' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Materials ({materials.length})
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Add {activeTab.slice(0, -1)}
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {activeTab === 'materials' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.materials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {material.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.quantity} {material.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₱{material.unitCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₱{material.totalCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Similar tables for tasks and labor would go here */}

        {filteredData[activeTab].length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No {activeTab} found. Click "Add" to create your first one.
          </div>
        )}
      </div>

      {/* Project Overview & Team Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Project Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-4 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Project Name</span>
              <p className="text-gray-900">Vince's House</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Status</span>
              <p className="text-green-600">Active</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Total Budget</span>
              <p className="text-gray-900">₱1,250,000</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">45% complete</p>
            </div>
          </div>
        </div>

        {/* Team and Admin Actions */}
        <div className="space-y-6">
          {/* Team */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Team</h2>
            <ul className="space-y-2">
              <li className="text-gray-700">David</li>
              <li className="text-gray-700">John</li>
              <li className="text-gray-700">JR</li>
              <li className="text-gray-700">Leo</li>
            </ul>
          </div>

          {/* Admin Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Admin Actions</h2>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Export Project Data
              </button>
              <button className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                Archive Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit would go here */}
    </div>
  );
};

export default VincenteHouseModule;
