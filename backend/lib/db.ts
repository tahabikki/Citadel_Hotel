import * as jsonDB from './json-db';
import * as realDB from './real-db';

type DbAdapter = {
	read<T>(collection: string): Promise<T[]>;
	write<T>(collection: string, payload: T[]): Promise<void>;
};

const locks = new Map<string, Promise<void>>();

function getAdapter(): DbAdapter {
	return process.env.DB === 'real' ? realDB : jsonDB;
}

function generateId<T extends { id: string | number }>(items: T[]): string | number {
	if (items.length === 0) {
		return '1';
	}

	const lastItem = items[items.length - 1];
	const lastId = lastItem.id;

	if (typeof lastId === 'number') {
		return lastId + 1;
	}

	const match = String(lastId).match(/(\d+)$/);

	if (match) {
		const numericPart = parseInt(match[1], 10) + 1;
		const prefix = String(lastId).substring(0, match.index);
		return prefix + String(numericPart).padStart(match[1].length, '0');
	}

	return String(items.length + 1);
}

async function acquireLock(collection: string): Promise<() => void> {
	while (locks.has(collection)) {
		await locks.get(collection);
	}

	let releaseLock!: () => void;
	const lockPromise = new Promise<void>((resolve) => {
		releaseLock = resolve;
	});

	locks.set(collection, lockPromise);

	return () => {
		releaseLock();
		locks.delete(collection);
	};
}

export function createCollection<T extends { id: string | number }>(collection: string) {
	const adapter = getAdapter();

	return {
		async getAll(): Promise<T[]> {
			return adapter.read<T>(collection);
		},

		async getById(id: string | number): Promise<T | undefined> {
			const items = await adapter.read<T>(collection);
			return items.find((item) => item.id === id);
		},

		async create(item: Omit<T, 'id'>): Promise<T> {
			const release = await acquireLock(collection);

			try {
				const items = await adapter.read<T>(collection);
				const newItem = { ...item, id: generateId(items) } as T;
				items.push(newItem);
				await adapter.write(collection, items);
				return newItem;
			} finally {
				release();
			}
		},

		async update(id: string | number, updates: Partial<T>): Promise<T> {
			const release = await acquireLock(collection);

			try {
				const items = await adapter.read<T>(collection);
				const index = items.findIndex((item) => item.id === id);

				if (index === -1) {
					throw new Error(`Entity with id ${id} not found`);
				}

				items[index] = { ...items[index], ...updates } as T;
				await adapter.write(collection, items);
				return items[index];
			} finally {
				release();
			}
		},

		async delete(id: string | number): Promise<boolean> {
			const release = await acquireLock(collection);

			try {
				const items = await adapter.read<T>(collection);
				const filtered = items.filter((item) => item.id !== id);

				if (filtered.length === items.length) {
					return false;
				}

				await adapter.write(collection, filtered);
				return true;
			} finally {
				release();
			}
		},

		async search(filter: Partial<T>): Promise<T[]> {
			const items = await adapter.read<T>(collection);

			return items.filter((item) =>
				Object.entries(filter).every(([key, value]) => item[key as keyof T] === value)
			);
		}
	};
}

export const db = {
	createCollection
};
