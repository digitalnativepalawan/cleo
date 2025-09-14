import React, { useState } from 'react';

interface MaterialItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier: string;
}

const VincenteHouseModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const materials: MaterialItem[] = [
    {
      id: '1',
      name: 'Primer Epoxy Paint set',
      category: 'Finishes',
      quantity: 2,
      unit: 'pc',
      unitCost: 450,
      totalCost: 900,
      supplier: 'Local Hardware'
    },
    {
      id: '2',
      name: 'Roll Brush #2',
      category: 'Finishes',
      quantity: 6,
      unit: 'pc',
      unitCost: 55,
      totalCost: 330,
      supplier: 'Local Hardware'
    },
    {
      id: '3',
      name: 'White Wall Paint',
      category: 'Finishes',
      quantity: 1,
      unit: 'pc',
      unitCost: 700,
      totalCost: 700,
      supplier: 'Local Hardware'
    }
  ];

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vince's House</h1>
        <p className="text-gray-600">
          Manage tasks, labor, and materials for this project.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Tasks</h3>
          <p className="text-2xl font-bold text-gray-900">18</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Labor</h3>
          <p className="text-2xl font-bold text-gray-900">37</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-600">Materials</h3>
          <p className="text-2xl font-bold text-gray-900">3</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 w-full"
          />
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMaterials.map((material) => (
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
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMaterials.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            No materials found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default VincenteHouseModule;
