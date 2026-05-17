import { isSupabaseConfigured } from '@/lib/supabase-admin';

export interface CrudService<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  create(item: any): Promise<T>;
  update(id: string, updates: any): Promise<T>;
  delete(id: string): Promise<boolean>;
  search(filter: any): Promise<T[]>;
}

export function createPrismaCrudService<T>(tableName: string): CrudService<T> {
  return {
    async getAll() {
      if (!isSupabaseConfigured()) return [];
      const { supabaseAdmin } = await import('@/lib/supabase-admin');
      const { data } = await supabaseAdmin!.from(tableName).select('*');
      return (data || []) as T[];
    },

    async getById(id: string) {
      if (!isSupabaseConfigured()) return undefined;
      const { supabaseAdmin } = await import('@/lib/supabase-admin');
      const { data } = await supabaseAdmin!.from(tableName).select('*').eq('id', id).maybeSingle();
      return data as T | undefined;
    },

    async create(item: any) {
      const { supabaseAdmin } = await import('@/lib/supabase-admin');
      const { data } = await supabaseAdmin!.from(tableName).insert(item).select().single();
      return data as T;
    },

    async update(id: string, updates: any) {
      const { supabaseAdmin } = await import('@/lib/supabase-admin');
      const { data } = await supabaseAdmin!.from(tableName).update(updates).eq('id', id).select().single();
      return data as T;
    },

    async delete(id: string) {
      const { supabaseAdmin } = await import('@/lib/supabase-admin');
      const { error } = await supabaseAdmin!.from(tableName).delete().eq('id', id);
      return !error;
    },

    async search(filter: any) {
      if (!isSupabaseConfigured()) return [];
      const { supabaseAdmin } = await import('@/lib/supabase-admin');
      let query = supabaseAdmin!.from(tableName).select('*');
      Object.entries(filter).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });
      const { data } = await query;
      return (data || []) as T[];
    },
  };
}