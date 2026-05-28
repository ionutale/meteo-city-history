import { MongoClient, type Db } from 'mongodb';

const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB = process.env.MONGODB_DB || 'meteo_prd';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  if (!MONGODB_URL) throw new Error('MONGODB_URL env var not set');
  client = new MongoClient(MONGODB_URL);
  await client.connect();
  db = client.db(MONGODB_DB);
  return db;
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
