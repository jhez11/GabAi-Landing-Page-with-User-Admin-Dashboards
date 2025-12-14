import { supabase } from '../../lib/supabaseClient';
export const uploadFile = async (file: File, bucket: string = 'uploads', path?: string) => {
  const filePath = path || `${Date.now()}_${file.name}`;
  const {
    data,
    error
  } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error) throw error;
  return {
    path: data.path,
    fullPath: data.fullPath
  };
};
export const getFileUrl = (bucket: string, path: string) => {
  const {
    data
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
export const deleteFile = async (bucket: string, path: string) => {
  const {
    error
  } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
};
export const listFiles = async (bucket: string, path: string = '') => {
  const {
    data,
    error
  } = await supabase.storage.from(bucket).list(path);
  if (error) throw error;
  return data;
};