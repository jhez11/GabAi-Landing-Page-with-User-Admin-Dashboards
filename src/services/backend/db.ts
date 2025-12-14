import { supabase } from '../../lib/supabaseClient';
import type { Course, Department, Faculty, Scholarship, MapLocation, ChatMessage } from '../../contexts/DataContext';
import type { User } from '../../contexts/AuthContext'; // Assuming User type is exported or similar structure

// User / Auth Data
export const getUser = async (id: string) => {
  const {
    data,
    error
  } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};
export const createUser = async (user: Partial<User>) => {
  const {
    data,
    error
  } = await supabase.from('users').insert(user).select().single();
  if (error) throw error;
  return data;
};
export const updateUser = async (id: string, updates: Partial<User>) => {
  const {
    data,
    error
  } = await supabase.from('users').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

// Courses
export const getCourses = async () => {
  const {
    data,
    error
  } = await supabase.from('courses').select('*');
  if (error) throw error;
  return data as Course[];
};
export const saveCourse = async (course: Omit<Course, 'id'>) => {
  const {
    data,
    error
  } = await supabase.from('courses').insert(course).select().single();
  if (error) throw error;
  return data as Course;
};
export const updateCourse = async (id: number, updates: Partial<Course>) => {
  const {
    data,
    error
  } = await supabase.from('courses').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Course;
};
export const deleteCourse = async (id: number) => {
  const {
    error
  } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
};

// Departments
export const getDepartments = async () => {
  const {
    data,
    error
  } = await supabase.from('departments').select('*');
  if (error) throw error;
  return data as Department[];
};
export const saveDepartment = async (dept: Omit<Department, 'id'>) => {
  const {
    data,
    error
  } = await supabase.from('departments').insert(dept).select().single();
  if (error) throw error;
  return data as Department;
};
export const updateDepartment = async (id: number, updates: Partial<Department>) => {
  const {
    data,
    error
  } = await supabase.from('departments').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Department;
};
export const deleteDepartment = async (id: number) => {
  const {
    error
  } = await supabase.from('departments').delete().eq('id', id);
  if (error) throw error;
};

// Faculty
export const getFaculty = async () => {
  const {
    data,
    error
  } = await supabase.from('faculty').select('*');
  if (error) throw error;
  return data as Faculty[];
};
export const saveFaculty = async (faculty: Omit<Faculty, 'id'>) => {
  const {
    data,
    error
  } = await supabase.from('faculty').insert(faculty).select().single();
  if (error) throw error;
  return data as Faculty;
};
export const updateFaculty = async (id: number, updates: Partial<Faculty>) => {
  const {
    data,
    error
  } = await supabase.from('faculty').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Faculty;
};
export const deleteFaculty = async (id: number) => {
  const {
    error
  } = await supabase.from('faculty').delete().eq('id', id);
  if (error) throw error;
};

// Scholarships
export const getScholarships = async () => {
  const {
    data,
    error
  } = await supabase.from('scholarships').select('*');
  if (error) throw error;
  return data as Scholarship[];
};
export const saveScholarship = async (scholarship: Omit<Scholarship, 'id'>) => {
  const {
    data,
    error
  } = await supabase.from('scholarships').insert(scholarship).select().single();
  if (error) throw error;
  return data as Scholarship;
};
export const updateScholarship = async (id: number, updates: Partial<Scholarship>) => {
  const {
    data,
    error
  } = await supabase.from('scholarships').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Scholarship;
};
export const deleteScholarship = async (id: number) => {
  const {
    error
  } = await supabase.from('scholarships').delete().eq('id', id);
  if (error) throw error;
};

// Map Locations
export const getMapLocations = async () => {
  const {
    data,
    error
  } = await supabase.from('map_locations').select('*');
  if (error) throw error;
  return data as MapLocation[];
};
export const saveMapLocation = async (location: Omit<MapLocation, 'id'>) => {
  const {
    data,
    error
  } = await supabase.from('map_locations').insert(location).select().single();
  if (error) throw error;
  return data as MapLocation;
};
export const updateMapLocation = async (id: number, updates: Partial<MapLocation>) => {
  const {
    data,
    error
  } = await supabase.from('map_locations').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as MapLocation;
};
export const deleteMapLocation = async (id: number) => {
  const {
    error
  } = await supabase.from('map_locations').delete().eq('id', id);
  if (error) throw error;
};

// Chat History
export const getChatHistory = async (userId: string) => {
  const {
    data,
    error
  } = await supabase.from('chat_history').select('*').eq('userId', userId).single();
  if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
  return data as ChatMessage | null;
};
export const saveChatMessage = async (chatData: ChatMessage) => {
  const {
    data,
    error
  } = await supabase.from('chat_history').upsert(chatData).select().single();
  if (error) throw error;
  return data as ChatMessage;
};