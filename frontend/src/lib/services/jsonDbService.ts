import { readFile, writeFile, access } from 'fs/promises';
import path from 'path';

// Data directory - resolve the path from project root
const DATA_DIR = path.resolve(process.cwd(), '../backend/data');

const locks = new Map<string, Promise<void>>();

export interface JsonDBService<T extends { id: string | number }> {
  getAll(): Promise<T[]>;
  getById(id: string | number): Promise<T | undefined>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string | number, updates: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
  search(filter: Partial<T>): Promise<T[]>;
}

export function createJsonDBService<T extends { id: string | number }>(
  entityName: string
): JsonDBService<T> {
  const filePath = path.join(DATA_DIR, entityName, `${entityName}.json`);

  async function ensureFile(): Promise<void> {
    try {
      await access(filePath);
    } catch {
      const dir = path.dirname(filePath);
      const { mkdir } = await import('fs/promises');
      await mkdir(dir, { recursive: true });
      await writeFile(filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  async function acquireLock(): Promise<() => void> {
    while (locks.has(entityName)) {
      await locks.get(entityName);
    }
    let resolveLock: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      resolveLock = resolve;
    });
    locks.set(entityName, lockPromise);
    return () => {
      // resolve + remove lock so future calls don't spin forever
      resolveLock?.();
      locks.delete(entityName);
    };
  }

  async function readData(): Promise<T[]> {
    await ensureFile();
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  }

  async function writeData(data: T[]): Promise<void> {
    const tempPath = filePath + '.tmp';
    await writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    const { rename } = await import('fs/promises');
    await rename(tempPath, filePath);
  }

  return {
    async getAll(): Promise<T[]> {
      const release = await acquireLock();
      try {
        return await readData();
      } finally {
        release();
      }
    },

    async getById(id: string | number): Promise<T | undefined> {
      const items = await this.getAll();
      return items.find(item => item.id === id);
    },

    async create(item: Omit<T, 'id'>): Promise<T> {
      const release = await acquireLock();
      try {
        const items = await readData();
        const newId = generateId(items);
        const newItem = { ...item, id: newId } as T;
        items.push(newItem);
        await writeData(items);
        return newItem;
      } finally {
        release();
      }
    },

    async update(id: string | number, updates: Partial<T>): Promise<T> {
      const release = await acquireLock();
      try {
        const items = await readData();
        const index = items.findIndex(item => item.id === id);
        if (index === -1) throw new Error(`Entity with id ${id} not found`);
        items[index] = { ...items[index], ...updates } as T;
        await writeData(items);
        return items[index];
      } finally {
        release();
      }
    },

    async delete(id: string | number): Promise<boolean> {
      const release = await acquireLock();
      try {
        const items = await readData();
        const initialLength = items.length;
        const filtered = items.filter(item => item.id !== id);
        if (filtered.length === initialLength) return false;
        await writeData(filtered);
        return true;
      } finally {
        release();
      }
    },

    async search(filter: Partial<T>): Promise<T[]> {
      const items = await this.getAll();
      return items.filter(item => {
        return Object.entries(filter).every(([key, value]) => {
          return item[key as keyof T] === value;
        });
      });
    }
  };

  function generateId(items: T[]): string | number {
    if (items.length === 0) return '1';
    const lastItem = items[items.length - 1];
    const lastId = lastItem.id;
    if (typeof lastId === 'number') return Number(lastId) + 1;
    const match = String(lastId).match(/(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10) + 1;
      const prefix = String(lastId).substring(0, match.index);
      return prefix + String(num).padStart(match[1].length, '0');
    }
    return String(items.length + 1);
  }
}
