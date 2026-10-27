import mongoose from 'mongoose';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  listenersRegistered?: boolean;
};

declare global {
  // Reuse the same connection across Next.js hot reloads and serverless invocations.
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined;
}

const cache = (globalThis.__mongoose ??= { conn: null, promise: null });

function registerConnectionListeners() {
  if (cache.listenersRegistered) return;
  cache.listenersRegistered = true;
  mongoose.connection.on('connected', () => console.info('[db] connected'));
  mongoose.connection.on('disconnected', () => console.warn('[db] disconnected'));
  mongoose.connection.on('error', (error) => console.error('[db] connection error:', error.message));

  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) return;
  const shutdown = async () => {
    await mongoose.disconnect();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is required. Add your MongoDB Atlas connection string to .env.local.');
  }

  registerConnectionListeners();
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 60_000,
        serverSelectionTimeoutMS: 10_000,
        socketTimeoutMS: 45_000,
        bufferCommands: false,
        retryWrites: true,
        autoIndex: process.env.NODE_ENV !== 'production',
      })
      .catch((error: unknown) => {
        cache.promise = null;
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
