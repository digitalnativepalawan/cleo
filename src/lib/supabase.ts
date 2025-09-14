import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  TASKS: 'tasks',
  LABOR: 'labor', 
  MATERIALS: 'materials',
  DAILY_ROLLUPS: 'daily_rollups'
} as const;

// Storage bucket name for file uploads
export const STORAGE_BUCKET = 'project-files';