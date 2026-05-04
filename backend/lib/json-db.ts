import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ROOT_DATA_DIR = path.resolve(process.cwd(), 'data');

export async function read<T>(collection: string): Promise<T[]> {
  const filePath = path.join(ROOT_DATA_DIR, `${collection}.json`);
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export async function write<T>(collection: string, payload: T[]): Promise<void> {
  const filePath = path.join(ROOT_DATA_DIR, `${collection}.json`);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');
}
