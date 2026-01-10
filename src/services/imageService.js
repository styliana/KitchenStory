import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';

export async function compressImage(file) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
}

export async function uploadImageToSupabase(file) {
  if (!file || !supabase) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('recipe-images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('recipe-images').getPublicUrl(filePath);
  return data.publicUrl;
}