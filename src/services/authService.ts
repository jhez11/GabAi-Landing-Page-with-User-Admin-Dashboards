import { supabase } from '../lib/supabaseClient';
export const authService = {
  async signUp(email: string, password: string, data?: any) {
    const {
      data: user,
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data
      }
    });
    if (error) throw error;
    return user;
  },
  async signIn(email: string, password: string) {
    const {
      data: user,
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return user;
  },
  async signOut() {
    const {
      error
    } = await supabase.auth.signOut();
    if (error) throw error;
  },
  async getUser() {
    const {
      data: {
        user
      },
      error
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
  async getSession() {
    const {
      data: {
        session
      },
      error
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
};