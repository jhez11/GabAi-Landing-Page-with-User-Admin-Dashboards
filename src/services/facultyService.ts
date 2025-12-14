import { supabase } from '../lib/supabaseClient';
import { Faculty } from '../contexts/DataContext';
export const facultyService = {
  async getAll() {
    const {
      data,
      error
    } = await supabase.from('faculty').select('*');
    if (error) throw error;
    return data as Faculty[];
  },
  async getById(id: number) {
    const {
      data,
      error
    } = await supabase.from('faculty').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Faculty;
  },
  async create(faculty: Omit<Faculty, 'id'>) {
    const {
      data,
      error
    } = await supabase.from('faculty').insert([faculty]).select().single();
    if (error) throw error;
    return data as Faculty;
  },
  async update(id: number, updates: Partial<Faculty>) {
    const {
      data,
      error
    } = await supabase.from('faculty').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Faculty;
  },
  async delete(id: number) {
    const {
      error
    } = await supabase.from('faculty').delete().eq('id', id);
    if (error) throw error;
  }
};