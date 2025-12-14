import { supabase } from '../lib/supabaseClient';
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
}
export const userService = {
  async getProfile(userId: string) {
    const {
      data,
      error
    } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data as UserProfile;
  },
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const {
      data,
      error
    } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
    if (error) throw error;
    return data as UserProfile;
  },
  async getAllProfiles() {
    const {
      data,
      error
    } = await supabase.from('profiles').select('*');
    if (error) throw error;
    return data as UserProfile[];
  }
};