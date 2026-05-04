// Placeholder adapter for real database provider (Prisma, Postgres, etc.)
// Keep exported signatures aligned with json-db.ts so services remain unchanged.

export async function read<T>(_collection: string): Promise<T[]> {
  throw new Error('real-db read is not implemented yet');
}

export async function write<T>(_collection: string, _payload: T[]): Promise<void> {
  throw new Error('real-db write is not implemented yet');
}
