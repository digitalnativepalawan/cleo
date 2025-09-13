export type ProjectStatus = 'Active' | 'Planned' | 'On Hold' | 'Completed';
export type PropertyTenure = 'Titled' | 'Tax Dec' | 'Leasehold';
export type ChecklistStatus = 'Pending' | 'In Progress' | 'Submitted' | 'Approved' | 'Rejected';
export type Attachment = { type: 'image' | 'drive' | 'local'; value: string; name?: string; };

export type TaskStatus = 'Pending' | 'Backlog' | 'In Progress' | 'Blocked' | 'Review' | 'Done';
export type TaskType = 'Design' | 'Site Prep' | 'Foundation' | 'Structure' | 'MEP' | 'Finish' | 'Inspection';
export type LaborRateType = 'Daily' | 'Hourly' | 'Contract';
export type MaterialCategory = 'Aggregates' | 'Timber' | 'Steel' | 'Electrical' | 'Plumbing' | 'Finishes' | 'Fixtures' | 'Other';
export type MaterialUnit = 'pc' | 'box' | 'm' | 'sqm' | 'kg' | 'ton';

interface BaseItem {
    id: string;
    projectId: string;
    attachment?: Attachment;
    notes: string;
    paid: boolean;
}

export interface Task extends BaseItem {
    name: string;
    type: TaskType;
    status: TaskStatus;
    owner: string;
    startDate: string;
    dueDate: string;
    estHours: number;
    actualHours?: number;
    cost: number;
    tags: string[];
    order: number;
}

export interface Labor extends BaseItem {
    crewRole: string;
    workers: string;
    rateType: LaborRateType;
    rate: number;
    qty: number;
    cost: number; // Calculated
    supplier: string;
    startDate: string;
    endDate: string;
}

export interface Material extends BaseItem {
    item: string;
    category: MaterialCategory;
    unit: MaterialUnit;
    qty: number;
    unitCost: number;
    totalCost: number; // Calculated
    supplier: string;
    leadTimeDays: number;
    deliveryEta: string;
    received: boolean;
    location: 'Site' | 'Warehouse';
}

export type ProjectItem = Task | Labor | Material;

// Fix: Moved ProjectData interface here to be exported and used across the application.
export interface ProjectData {
  tasks: Task[];
  labor: Labor[];
  materials: Material[];
}
