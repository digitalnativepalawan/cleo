import { supabase, TABLES, STORAGE_BUCKET } from './supabase';
import type { Task, Labor, Material, ProjectData } from '../types/portal';

// Type mappings for database columns (snake_case to camelCase)
const mapTaskFromDb = (dbTask: any): Task => ({
  id: dbTask.id,
  projectId: dbTask.project_id,
  name: dbTask.task_name,
  type: dbTask.type,
  status: dbTask.status,
  owner: dbTask.owner,
  startDate: dbTask.start_date || '',
  dueDate: dbTask.due_date || '',
  estHours: dbTask.est_hours || 0,
  actualHours: dbTask.actual_hours,
  cost: dbTask.cost || 0,
  tags: dbTask.tags || [],
  order: dbTask.order || 0,
  notes: dbTask.notes || '',
  paid: dbTask.paid || false,
  attachment: dbTask.attachment
});

const mapTaskToDb = (task: Partial<Task>) => ({
  project_id: task.projectId,
  task_name: task.name,
  type: task.type,
  status: task.status,
  owner: task.owner,
  start_date: task.startDate || null,
  due_date: task.dueDate || null,
  est_hours: task.estHours || 0,
  actual_hours: task.actualHours,
  cost: task.cost || 0,
  tags: task.tags || [],
  order: task.order || 0,
  notes: task.notes || '',
  paid: task.paid || false,
  attachment: task.attachment
});

const mapLaborFromDb = (dbLabor: any): Labor => ({
  id: dbLabor.id,
  projectId: dbLabor.project_id,
  crewRole: dbLabor.crew_role,
  workers: dbLabor.workers,
  rateType: dbLabor.rate_type,
  rate: dbLabor.rate || 0,
  qty: dbLabor.qty || 0,
  cost: dbLabor.cost || 0,
  supplier: dbLabor.supplier || '',
  startDate: dbLabor.start_date || '',
  endDate: dbLabor.end_date || '',
  notes: dbLabor.notes || '',
  paid: dbLabor.paid || false,
  attachment: dbLabor.attachment
});

const mapLaborToDb = (labor: Partial<Labor>) => ({
  project_id: labor.projectId,
  crew_role: labor.crewRole,
  workers: labor.workers,
  rate_type: labor.rateType,
  rate: labor.rate || 0,
  qty: labor.qty || 0,
  cost: labor.cost || 0,
  supplier: labor.supplier || '',
  start_date: labor.startDate || null,
  end_date: labor.endDate || null,
  notes: labor.notes || '',
  paid: labor.paid || false,
  attachment: labor.attachment
});

const mapMaterialFromDb = (dbMaterial: any): Material => ({
  id: dbMaterial.id,
  projectId: dbMaterial.project_id,
  item: dbMaterial.item_name,
  category: dbMaterial.category,
  unit: dbMaterial.unit,
  qty: dbMaterial.quantity || 0,
  unitCost: dbMaterial.unit_cost || 0,
  totalCost: dbMaterial.total_cost || 0,
  supplier: dbMaterial.supplier || '',
  leadTimeDays: dbMaterial.lead_time_days || 0,
  deliveryEta: dbMaterial.delivery_eta || '',
  received: dbMaterial.received || false,
  location: dbMaterial.location || 'Site',
  notes: dbMaterial.notes || '',
  paid: dbMaterial.paid || false,
  attachment: dbMaterial.attachment
});

const mapMaterialToDb = (material: Partial<Material>) => ({
  project_id: material.projectId,
  item_name: material.item,
  image_url: (material as any).imageUrl || '',
  category: material.category,
  unit: material.unit,
  quantity: material.qty || 0,
  unit_cost: material.unitCost || 0,
  total_cost: material.totalCost || 0,
  supplier: material.supplier || '',
  lead_time_days: material.leadTimeDays || 0,
  delivery_eta: material.deliveryEta || null,
  received: material.received || false,
  location: material.location || 'Site',
  notes: material.notes || '',
  paid: material.paid || false,
  attachment: material.attachment
});

// CRUD Operations for Tasks
export const taskOperations = {
  async getByProject(projectId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .select('*')
      .eq('project_id', projectId)
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data?.map(mapTaskFromDb) || [];
  },

  async create(task: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .insert(mapTaskToDb(task))
      .select()
      .single();
    
    if (error) throw error;
    return mapTaskFromDb(data);
  },

  async update(id: string, task: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from(TABLES.TASKS)
      .update(mapTaskToDb(task))
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapTaskFromDb(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.TASKS)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// CRUD Operations for Labor
export const laborOperations = {
  async getByProject(projectId: string): Promise<Labor[]> {
    const { data, error } = await supabase
      .from(TABLES.LABOR)
      .select('*')
      .eq('project_id', projectId)
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    return data?.map(mapLaborFromDb) || [];
  },

  async create(labor: Partial<Labor>): Promise<Labor> {
    const { data, error } = await supabase
      .from(TABLES.LABOR)
      .insert(mapLaborToDb(labor))
      .select()
      .single();
    
    if (error) throw error;
    return mapLaborFromDb(data);
  },

  async update(id: string, labor: Partial<Labor>): Promise<Labor> {
    const { data, error } = await supabase
      .from(TABLES.LABOR)
      .update(mapLaborToDb(labor))
      .select()
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapLaborFromDb(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.LABOR)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// CRUD Operations for Materials
export const materialOperations = {
  async getByProject(projectId: string): Promise<Material[]> {
    const { data, error } = await supabase
      .from(TABLES.MATERIALS)
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data?.map(mapMaterialFromDb) || [];
  },

  async create(material: Partial<Material>): Promise<Material> {
    const { data, error } = await supabase
      .from(TABLES.MATERIALS)
      .insert(mapMaterialToDb(material))
      .select()
      .single();
    
    if (error) throw error;
    return mapMaterialFromDb(data);
  },

  async update(id: string, material: Partial<Material>): Promise<Material> {
    const { data, error } = await supabase
      .from(TABLES.MATERIALS)
      .update(mapMaterialToDb(material))
      .select()
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return mapMaterialFromDb(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLES.MATERIALS)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Get all project data
export const getProjectData = async (projectId: string): Promise<ProjectData> => {
  const [tasks, labor, materials] = await Promise.all([
    taskOperations.getByProject(projectId),
    laborOperations.getByProject(projectId),
    materialOperations.getByProject(projectId)
  ]);

  return { tasks, labor, materials };
};

// File upload to Supabase Storage
export const uploadFile = async (file: File, folder: string = 'materials'): Promise<{ url: string; path: string }> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return { url: publicUrl, path: filePath };
};