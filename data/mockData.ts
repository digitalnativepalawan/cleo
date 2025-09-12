import type { Task, Labor, Material, Attachment } from '../types/portal';

const simpleId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export interface ProjectData {
  tasks: Task[];
  labor: Labor[];
  materials: Material[];
}

const vincenteTasks: Task[] = [
    { id: simpleId(), projectId: 'project-vincente', name: 'install hardiflex then paint white', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 0, notes: '', paid: false },
    { id: simpleId(), projectId: 'project-vincente', name: 'install metal furring after paint', type: 'Structure', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 1, notes: '', paid: false },
    { id: simpleId(), projectId: 'project-vincente', name: 'cover ceiling gaps', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 2, notes: '', paid: false },
    { id: simpleId(), projectId: 'project-vincente', name: 'run wire in ground', type: 'MEP', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 3, notes: '', paid: false },
    { id: simpleId(), projectId: 'project-vincente', name: 'paint hardiflex', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 4, notes: '', paid: false },
    { id: simpleId(), projectId: 'project-vincente', name: 'paint walls', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 5, notes: '', paid: false },
    { id: simpleId(), projectId: 'project-vincente', name: 'paint metal furrings', type: 'Finish', status: 'In Progress', owner: '', startDate: '', dueDate: '2025-09-02', estHours: 0, cost: 0, tags: [], order: 6, notes: '', paid: false },
    { id: simpleId(), projectId: 'project-vincente', name: 'trim coco trees', type: 'Site Prep', status: 'Done', owner: '', startDate: '', dueDate: '2025-09-01', estHours: 0, cost: 0, tags: [], order: 7, notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', name: 'fix leak in roof', type: 'Structure', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-30', estHours: 0, cost: 0, tags: [], order: 8, notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', name: 'clear clean front property', type: 'Site Prep', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-30', estHours: 0, cost: 0, tags: [], order: 9, notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', name: 'door sealant', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-29', estHours: 0, cost: 0, tags: [], order: 10, notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', name: 'door sealant', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-29', estHours: 0, cost: 0, tags: [], order: 11, notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', name: 'paint/sand metal', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-28', estHours: 0, cost: 0, tags: [], order: 12, notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', name: 'clean metal ceiling', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-28', estHours: 0, cost: 0, tags: [], order: 13, notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', name: 'door padding', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-26', estHours: 0, cost: 0, tags: [], order: 14, notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', name: 'door padding', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-26', estHours: 0, cost: 0, tags: [], order: 15, notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', name: 'window seal', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-25', estHours: 0, cost: 0, tags: [], order: 16, notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', name: 'window seal', type: 'Finish', status: 'Done', owner: '', startDate: '', dueDate: '2025-08-25', estHours: 0, cost: 0, tags: [], order: 17, notes: '', paid: true },
];

const vincenteLabor: Labor[] = [
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-25', endDate: '2025-08-25', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-25', endDate: '2025-08-25', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-26', endDate: '2025-08-26', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-26', endDate: '2025-08-26', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-28', endDate: '2025-08-28', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-28', endDate: '2025-08-28', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-29', endDate: '2025-08-29', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-29', endDate: '2025-08-29', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-30', endDate: '2025-08-30', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-08-30', endDate: '2025-08-30', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 4, cost: 250, supplier: 'Local', startDate: '2025-09-01', endDate: '2025-09-01', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 0, cost: 0, supplier: 'Local', startDate: '2025-09-01', endDate: '2025-09-01', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-02', endDate: '2025-09-02', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-02', endDate: '2025-09-02', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-03', endDate: '2025-09-03', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-03', endDate: '2025-09-03', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-04', endDate: '2025-09-04', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-04', endDate: '2025-09-04', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'JR', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-05', endDate: '2025-09-05', notes: '', paid: true },
    { id: simpleId(), projectId: 'project-vincente', crewRole: 'General Laborer', workers: 'Leo', rateType: 'Hourly', rate: 62.5, qty: 8, cost: 500, supplier: 'Local', startDate: '2025-09-05', endDate: '2025-09-05', notes: '', paid: true },
];

const vincenteMaterials: Material[] = [
    { id: simpleId(), projectId: 'project-vincente', item: 'Primer Epoxy Paint set', category: 'Finishes', unit: 'pc', qty: 2, unitCost: 450, totalCost: 900, supplier: 'Local Hardware', leadTimeDays: 1, deliveryEta: '2025-09-01', received: false, location: 'Site', notes: '', paid: false },
    { id: simpleId(), projectId: 'project-vincente', item: 'Roll Brush #2', category: 'Finishes', unit: 'pc', qty: 6, unitCost: 55, totalCost: 330, supplier: 'Local Hardware', leadTimeDays: 1, deliveryEta: '2025-09-01', received: false, location: 'Site', notes: '', paid: false },
    { id: simpleId(), projectId: 'project-vincente', item: 'White Wall Paint', category: 'Finishes', unit: 'pc', qty: 1, unitCost: 700, totalCost: 700, supplier: 'Local Hardware', leadTimeDays: 1, deliveryEta: '2025-09-01', received: false, location: 'Site', notes: '', paid: false },
];

const ALL_PROJECTS_DATA: Record<string, ProjectData> = {
    'project-vincente': {
        tasks: vincenteTasks,
        labor: vincenteLabor,
        materials: vincenteMaterials,
    },
    'project-elnido': {
        tasks: [
            { id: simpleId(), projectId: 'project-elnido', name: 'Survey Land Plot A', type: 'Site Prep', status: 'Done', owner: 'David', startDate: '2025-01-10', dueDate: '2025-01-15', estHours: 40, cost: 50000, tags: ['survey', 'legal'], order: 1, notes: '', paid: true },
            { id: simpleId(), projectId: 'project-elnido', name: 'Architectural Design Draft', type: 'Design', status: 'In Progress', owner: 'John', startDate: '2025-01-16', dueDate: '2025-02-28', estHours: 120, cost: 250000, tags: ['design'], order: 2, notes: '', paid: false },
        ],
        labor: [],
        materials: [
             { id: simpleId(), projectId: 'project-elnido', item: 'Rebar #10', category: 'Steel', unit: 'ton', qty: 5, unitCost: 50000, totalCost: 250000, supplier: 'Manila Steel', leadTimeDays: 14, deliveryEta: '2025-03-15', received: false, location: 'Warehouse', notes: '', paid: false },
        ]
    },
    'project-farm': {
        tasks: [
            { id: simpleId(), projectId: 'project-farm', name: 'Install Irrigation System', type: 'MEP', status: 'Backlog', owner: 'Leo', startDate: '2025-04-01', dueDate: '2025-04-15', estHours: 80, cost: 150000, tags: ['water', 'farming'], order: 1, notes: 'Phase 1: Main lines', paid: false },
        ],
        labor: [
            { id: simpleId(), projectId: 'project-farm', crewRole: 'Farm Hand', workers: 'Farm Team', rateType: 'Daily', rate: 500, qty: 10, cost: 5000, supplier: 'Local Coop', startDate: '2025-03-20', endDate: '2025-03-20', notes: 'Clearing land', paid: true },
        ],
        materials: []
    },
     'project-properties': { tasks: [], labor: [], materials: [] },
     'project-sec': { tasks: [], labor: [], materials: [] },
     'project-bir': { tasks: [], labor: [], materials: [] },
};

export const getProjectData = (projectId: string): ProjectData => {
    return ALL_PROJECTS_DATA[projectId] || { tasks: [], labor: [], materials: [] };
};

export const INITIAL_PROJECTS = [
    { id: 'project-vincente', name: "Vince's House" },
    { id: 'project-elnido', name: 'El Nido' },
    { id: 'project-farm', name: 'Lumambong Farm' },
    { id: 'project-properties', name: 'Properties' },
    { id: 'project-sec', name: 'SEC Checklist' },
    { id: 'project-bir', name: 'BIR Checklist' },
    { id: 'project-blog', name: 'Blog Management' },
];