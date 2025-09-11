import type { Task, Labor, Material } from '../types/portal';

const simpleId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const MOCK_PROJECT_ID = 'project-vincente';

export const mockTasks: Task[] = [
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'install hardiflex then paint white', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 0, notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'install metal furring after paint', type: 'Structure', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 1, notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'cover ceiling gaps', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 2, notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'run wire in ground', type: 'MEP', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 3, notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'paint hardiflex', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 4, notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'paint walls', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 5, notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'paint metal furrings', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 6, notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'trim coco trees', type: 'Site Prep', status: 'Done', owner: '', startDate: '', dueDate: '2025-09-01', estHours: 0, cost: 0, tags: [], order: 7, notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'fix leak in roof', type: 'Structure', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-30', estHours: 0, cost: 0, tags: [], order: 8, notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'clear clean front property', type: 'Site Prep', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-30', estHours: 0, cost: 0, tags: [], order: 9, notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'door sealant', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-29', estHours: 0, cost: 0, tags: [], order: 10, notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'door sealant', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-29', estHours: 0, cost: 0, tags: [], order: 11, notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'paint/sand metal', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-28', estHours: 0, cost: 0, tags: [], order: 12, notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'clean metal ceiling', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-28', estHours: 0, cost: 0, tags: [], order: 13, notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'door padding', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-26', estHours: 0, cost: 0, tags: [], order: 14, notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'door padding', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-26', estHours: 0, cost: 0, tags: [], order: 15, notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'window seal', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-25', estHours: 0, cost: 0, tags: [], order: 16, notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, name: 'window seal', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-25', estHours: 0, cost: 0, tags: [], order: 17, notes: '', paid: true },
];

export const mockLabor: Labor[] = [
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-25', endDate: '2025-08-25', notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-25', endDate: '2025-08-25', notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-26', endDate: '2025-08-26', notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-26', endDate: '2025-08-26', notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-28', endDate: '2025-08-28', notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-28', endDate: '2025-08-28', notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-29', endDate: '2025-08-29', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-29', endDate: '2025-08-29', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-30', endDate: '2025-08-30', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-30', endDate: '2025-08-30', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 4, cost: 250, supplier: 'Local', startDate: '2025-09-01', endDate: '2025-09-01', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 0, cost: 0, supplier: 'Local', startDate: '2025-09-01', endDate: '2025-09-01', notes: '', paid: true },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-02', endDate: '2025-09-02', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-02', endDate: '2025-09-02', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-03', endDate: '2025-09-03', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-03', endDate: '2025-09-03', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-04', endDate: '2025-09-04', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-04', endDate: '2025-09-04', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-05', endDate: '2025-09-05', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-05', endDate: '2025-09-05', notes: '', paid: false },
];

export const mockMaterials: Material[] = [
    { id: simpleId(), projectId: MOCK_PROJECT_ID, item: 'Primer Epoxy Paint set', category: 'Finishes', unit: 'pc', qty: 2, unitCost: 450, totalCost: 900, supplier: 'Local Hardware', leadTimeDays: 1, deliveryEta: '2025-09-01', received: false, location: 'Site', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, item: 'Roll Brush #2', category: 'Finishes', unit: 'pc', qty: 6, unitCost: 55, totalCost: 330, supplier: 'Local Hardware', leadTimeDays: 1, deliveryEta: '2025-09-01', received: false, location: 'Site', notes: '', paid: false },
    { id: simpleId(), projectId: MOCK_PROJECT_ID, item: 'White Wall Paint', category: 'Finishes', unit: 'pc', qty: 1, unitCost: 700, totalCost: 700, supplier: 'Local Hardware', leadTimeDays: 1, deliveryEta: '2025-09-01', received: false, location: 'Site', notes: '', paid: false },
];


export const INITIAL_PROJECTS = [
    { id: 'project-vincente', name: 'Vincente House' },
    { id: 'project-elnido', name: 'El Nido' },
    { id: 'project-farm', name: 'Lumambong Farm' },
    { id: 'project-properties', name: 'Properties' },
    { id: 'project-sec', name: 'SEC Checklist' },
    { id: 'project-bir', name: 'BIR Checklist' },
    { id: 'project-blog', name: 'Blog Management' },
];
