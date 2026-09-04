import { MongoClient, Db, Collection, Document } from "mongodb";
import dns from "dns";

if (typeof window === "undefined") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (_) {}
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

/**
 * Reusable helper to get the cached MongoClient connection promise lazily,
 * preventing connection attempts during build-time module evaluation.
 */
export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (_) {}

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
        delete globalWithMongo._mongoClientPromise;
        throw err;
      });
    }
    return globalWithMongo._mongoClientPromise;
  }

  // Defer connection creation in production/build-time until explicitly requested
  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect().catch((err) => {
      clientPromise = undefined as any;
      throw err;
    });
  }
  return clientPromise;
}

/**
 * Reusable helper to get the database instance
 */
export async function getDb(dbName = process.env.MONGODB_DB_NAME || "PersonalPortfolio"): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}

/**
 * Reusable typed collection helper to access collections consistently
 */
export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

/**
 * Prepares database indexing support for the references collection.
 * This is ready for future recommendations workflows and will not run automatically.
 */
export async function initDatabase(): Promise<void> {
  console.log("Preparing/asserting database indexes...");
  const references = await getCollection("references");

  // status (ascending)
  await references.createIndex({ status: 1 });
  // createdAt (descending)
  await references.createIndex({ createdAt: -1 });
  // approved (ascending, backwards compatibility)
  await references.createIndex({ approved: 1 });

  console.log("MongoDB indexes verified/created successfully.");
}
