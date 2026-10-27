import { connectDB } from '../lib/db';
import { models } from '../models';

async function setupDatabase() {
  await connectDB();

  for (const Model of models) {
    try {
      await Model.createCollection();
    } catch (error) {
      const mongoError = error as { code?: number; codeName?: string };
      if (mongoError.code !== 48 && mongoError.codeName !== 'NamespaceExists') throw error;
    }
    await Model.syncIndexes();
  }

  console.info(`✔ MongoDB ready: ${models.length} collections, indexes synced`);
  await (await import('mongoose')).default.disconnect();
}

setupDatabase().catch(async (error: unknown) => {
  console.error('MongoDB setup failed:', error);
  await (await import('mongoose')).default.disconnect();
  process.exitCode = 1;
});
