import { MongoClient, type Db } from 'mongodb';
import { env } from '$env/dynamic/private';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  if (!env.MONGODB_URL) throw new Error('MONGODB_URL env var not set');
  client = new MongoClient(env.MONGODB_URL);
  await client.connect();
  db = client.db(env.MONGODB_DB);
  return db;
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
