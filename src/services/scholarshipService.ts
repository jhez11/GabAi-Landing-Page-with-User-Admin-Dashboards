import { supabase } from '../lib/supabaseClient';
import { Scholarship } from '../contexts/DataContext';
export const scholarshipService = {
  async getAll() {
    const {
      data,
      error
    } = await supabase.from('scholarships').select('*');
    if (error) throw error;
    return data as Scholarship[];
  },
  async getById(id: number) {
    const {
      data,
      error
    } = await supabase.from('scholarships').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Scholarship;
  },
  async create(scholarship: Omit<Scholarship, 'id'>) {
    const {
      data,
      error
    } = await supabase.from('scholarships').insert([scholarship]).select().single();
    if (error) throw error;
    return data as Scholarship;
  },
  async update(id: number, updates: Partial<Scholarship>) {
    const {
      data,
      error
    } = await supabase.from('scholarships').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Scholarship;
  },
  async delete(id: number) {
    const {
      error
    } = await supabase.from('scholarships').delete().eq('id', id);
    if (error) throw error;
  }
};