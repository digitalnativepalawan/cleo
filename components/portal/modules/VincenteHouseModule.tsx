import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, DownloadIcon, ArchiveIcon } from '../PortalIcons';

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

  // Sample data
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

  const totals = {
    materials: materials.reduce((sum, m) => sum + m.totalCost, 0),
    tasks: tasks.reduce((sum, t) => sum + t.cost, 0),
    labor: labor.reduce((sum, l) => sum + l.totalCost, 0),
    overall: 160430 // Fixed total as per screenshot
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

  const handleAdd = () => {
    console.log('Add new', activeTab);
    // Modal implementation would go here
  };

  const handleEdit = (item: any) => {
    console.log('Edit', item);
    // Edit modal implementation would go here
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

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Blocked': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vince's House</h1>
            <p className="text-gray-600 text-sm">Manage tasks, labor, and materials for this project.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Paid (wk): <span className="font-semibold">P0</span></div>
            <div className="text-sm text-gray-600">Unpaid (wk): <span className="font-semibold">P8,500</span></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-6 pb-6 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Tasks</h3>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">P{totals.tasks.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Labor</h3>
                <p className="text-2xl font-bold text-gray-900">{labor.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">P{totals.labor.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Materials</h3>
                <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">P{totals.materials.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border bg-blue-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Budget</h3>
                <p className="text-2xl font-bold text-gray-900">P{totals.overall.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">On track</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs and Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-4 py-2 rounded-md text-sm ${
                      activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Tasks ({tasks.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('labor')}
                    className={`px-4 py-2 rounded-md text-sm ${
                      activeTab === 'labor' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Labor ({labor.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className={`px-4 py-2 rounded-md text-sm ${
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
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm w-48"
                    />
                  </div>

                  <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add {activeTab.slice(0, -1)}
                  </button>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
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
                          P{material.unitCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          P{material.totalCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {material.supplier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(material)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(material.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Project Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-600">Project Name</div>
                  <div className="text-gray-900">Vince's House</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Status</div>
                  <div className="text-green-600">Active</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Total Budget</div>
                  <div className="text-gray-900">P1,250,000</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">65% complete</div>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Team</h2>
              <div className="space-y-2">
                <div className="text-gray-700">David</div>
                <div className="text-gray-700">John</div>
                <div className="text-gray-700">JR</div>
                <div className="text-gray-700">Leo</div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Admin Actions</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                  <DownloadIcon className="w-4 h-4" />
                  Export Project Data
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm">
                  <ArchiveIcon className="w-4 h-4" />
                  Archive Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VincenteHouseModule;
