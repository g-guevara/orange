// lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

// Make MongoDB URI optional for build time
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'idealink';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Only initialize MongoDB connection if URI is properly configured
if (process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
} else {
  // Create a mock promise for build time
  clientPromise = Promise.reject(new Error('MongoDB URI not configured'));
}

export async function getDatabase(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB URI not configured. Please set MONGODB_URI environment variable.');
  }
  
  const client = await clientPromise;
  return client.db(dbName);
}

export { clientPromise };