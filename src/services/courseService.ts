import { supabase } from '../lib/supabaseClient';
import { Course } from '../contexts/DataContext';
export const courseService = {
  async getAll() {
    const {
      data,
      error
    } = await supabase.from('courses').select('*');
    if (error) throw error;
    return data as Course[];
  },
  async getById(id: number) {
    const {
      data,
      error
    } = await supabase.from('courses').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Course;
  },
  async create(course: Omit<Course, 'id'>) {
    const {
      data,
      error
    } = await supabase.from('courses').insert([course]).select().single();
    if (error) throw error;
    return data as Course;
  },
  async update(id: number, updates: Partial<Course>) {
    const {
      data,
      error
    } = await supabase.from('courses').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Course;
  },
  async delete(id: number) {
    const {
      error
    } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw error;
  }
};