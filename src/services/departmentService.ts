import { supabase } from '../lib/supabaseClient';
import { Department } from '../contexts/DataContext';
export const departmentService = {
  async getAll() {
    const {
      data,
      error
    } = await supabase.from('departments').select('*');
    if (error) throw error;
    return data as Department[];
  },
  async getById(id: number) {
    const {
      data,
      error
    } = await supabase.from('departments').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Department;
  },
  async create(department: Omit<Department, 'id'>) {
    const {
      data,
      error
    } = await supabase.from('departments').insert([department]).select().single();
    if (error) throw error;
    return data as Department;
  },
  async update(id: number, updates: Partial<Department>) {
    const {
      data,
      error
    } = await supabase.from('departments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Department;
  },
  async delete(id: number) {
    const {
      error
    } = await supabase.from('departments').delete().eq('id', id);
    if (error) throw error;
  }
};