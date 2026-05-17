import { supabaseAdmin } from '@/lib/supabase-admin';

export interface CrudService<T extends { id: string | number }> {
  getAll(): Promise<T[]>;
  getById(id: string | number): Promise<T | undefined>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string | number, updates: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
  search(filter: Partial<T>): Promise<T[]>;
}

export function createPrismaCrudService<T extends { id: string | number }>(
  tableName: string
): CrudService<T> {
  return {
    async getAll() {
      const { data, error } = await supabaseAdmin.from(tableName).select('*');
      if (error) throw error;
      return (data || []) as T[];
    },

    async getById(id) {
      const { data: record, error } = await supabaseAdmin
        .from(tableName)
        .select('*')
        .eq('id', String(id))
        .maybeSingle();
      if (error) throw error;
      return (record || undefined) as T | undefined;
    },

    async create(item) {
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .insert(item as any)
        .select('*')
        .single();
      if (error) throw error;
      return data as T;
    },

    async update(id, updates) {
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .update(updates as any)
        .eq('id', String(id))
        .select('*')
        .single();
      if (error) throw error;
      return data as T;
    },

    async delete(id) {
      const { error } = await supabaseAdmin.from(tableName).delete().eq('id', String(id));
      if (error) throw error;
      return true;
    },

    async search(filter) {
      let query = supabaseAdmin.from(tableName).select('*');
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value as any);
      });
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as T[];
    },
  };
}
