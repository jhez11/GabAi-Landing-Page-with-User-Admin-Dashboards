import { supabase } from '../lib/supabaseClient';
import { MapLocation } from '../contexts/DataContext';
export const mapService = {
  async getAll() {
    const {
      data,
      error
    } = await supabase.from('map_locations').select('*');
    if (error) throw error;
    return data as MapLocation[];
  },
  async getById(id: number) {
    const {
      data,
      error
    } = await supabase.from('map_locations').select('*').eq('id', id).single();
    if (error) throw error;
    return data as MapLocation;
  },
  async create(location: Omit<MapLocation, 'id'>) {
    const {
      data,
      error
    } = await supabase.from('map_locations').insert([location]).select().single();
    if (error) throw error;
    return data as MapLocation;
  },
  async update(id: number, updates: Partial<MapLocation>) {
    const {
      data,
      error
    } = await supabase.from('map_locations').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as MapLocation;
  },
  async delete(id: number) {
    const {
      error
    } = await supabase.from('map_locations').delete().eq('id', id);
    if (error) throw error;
  }
};