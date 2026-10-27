import mongoose from 'mongoose';
import { connectDB } from '../lib/db';
import Content from '../models/Content';
import Lesson from '../models/Lesson';
import { lessonGroups } from '../lib/lessons';
import { practiceSentences } from '../lib/sentences';
import { layouts } from '../lib/layouts';

async function seed() {
  if (!process.env.MONGODB_URI) {
    const fs = await import('node:fs/promises');
    const envFile = await fs.readFile('.env.local', 'utf8').catch(() => '');
    const entry = envFile.split(/\r?\n/).find((line) => /^\s*MONGODB_URI\s*=/.test(line));
    if (entry) {
      const value = entry.slice(entry.indexOf('=') + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
      if (value) process.env.MONGODB_URI = value;
    }
  }
  try {
    await connectDB();
  } catch (error) {
    // Level 2 ships with a checked-in local sentence pool, so a missing or
    // unavailable MongoDB should not prevent local development.
    const fs = await import('node:fs/promises');
    await fs.writeFile('lib/sentences-fallback.json', JSON.stringify(practiceSentences, null, 2));
    console.warn('MongoDB is unavailable; wrote the local sentence fallback to lib/sentences-fallback.json.');
    console.warn(error instanceof Error ? error.message : error);
    return;
  }
  const base = [
    'नेपाल', 'भाषा', 'शिक्षा', 'विद्यालय', 'परिवार', 'साथी', 'समय', 'अभ्यास', 'ज्ञान', 'किताब',
    'कलम', 'घर', 'सडक', 'पहाड', 'नदी', 'काठमाडौँ', 'सुन्दर', 'स्वास्थ्य', 'परिश्रम', 'सफलता',
    'देश', 'संस्कृति', 'समाचार', 'कम्प्युटर', 'प्रविधि', 'खेल', 'कृषि', 'यात्रा', 'संगीत', 'समाज',
  ];
  const words = Array.from({ length: 300 }, (_, i) => ({
    type: 'word', seedKey: `starter-word-${i + 1}`, text: base[i % base.length], difficulty: 1 + Math.floor(i / 100), tags: ['daily'],
  }));
  const typeable = new Set(layouts.flatMap(layout => Object.values(layout.mapping).flatMap(key => [key.normal,key.shift,key.altGr]).filter((x):x is string=>!!x).flatMap(value => [...value])));
  const invalid = practiceSentences.filter(sentence => [...sentence.text].some(char => char !== ' ' && !typeable.has(char)));
  if (invalid.length) throw new Error(`Sentence seed contains characters unavailable on configured layouts: ${invalid.map(x=>x.id).join(', ')}`);
  const sentences = practiceSentences.map((sentence) => ({
    type: 'sentence', seedKey: `nepali-sentence-${sentence.id}`, text: sentence.text,
    difficulty: sentence.difficulty === 'easy' ? 1 : sentence.difficulty === 'medium' ? 2 : 3, tags: [sentence.category, 'practice'],
  }));
  const paragraphs = Array.from({ length: 30 }, (_, i) => ({
    type: 'paragraph',
    seedKey: `starter-paragraph-${i + 1}`,
    text: `${base[i % base.length]} हाम्रो समाजको महत्वपूर्ण हिस्सा हो। यसको विकासका लागि निरन्तर अभ्यास र सहकार्य आवश्यक हुन्छ।`,
    difficulty: 2 + Math.floor(i / 10), tags: ['story'],
  }));

  const content = [...words, ...sentences, ...paragraphs];
  await Content.bulkWrite(content.map((item) => ({
    updateOne: { filter: { seedKey: item.seedKey }, update: { $set: item }, upsert: true },
  })), { ordered: false });
  await Lesson.bulkWrite(lessonGroups.map((lesson, order) => ({
    updateOne: {
      filter: { lessonId: lesson.id },
      update: { $set: { title: lesson.title, letters: lesson.letters, order } },
      upsert: true,
    },
  })), { ordered: false });

  console.info(`Seeded ${content.length} content records and ${lessonGroups.length} lessons (idempotent upserts).`);
  await mongoose.disconnect();
}

seed().catch(async (error: unknown) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
