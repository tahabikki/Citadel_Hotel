import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qciprvblelonmvdwkxam.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_sVNkbMvzDZaPer4eq2exXg_X5PYCZve';

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'hotel-media';

export const storage = {
  async upload(file: File, path: string): Promise<string> {
    const fileName = path 
      ? `${path}/${Date.now()}-${file.name}` 
      : `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },

  async delete(path: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Delete failed:', error);
      return false;
    }

    return true;
  },

  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
};

export default storage;