export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { connectDB } = await import('./lib/db');
  const { models } = await import('./models');
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
}
