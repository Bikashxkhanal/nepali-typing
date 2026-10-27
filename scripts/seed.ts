import mongoose from 'mongoose';
import { connectDB } from '../lib/db';
import Content from '../models/Content';
import Lesson from '../models/Lesson';
import { lessonGroups } from '../lib/lessons';

async function seed() {
  await connectDB();
  const base = [
    'नेपाल', 'भाषा', 'शिक्षा', 'विद्यालय', 'परिवार', 'साथी', 'समय', 'अभ्यास', 'ज्ञान', 'किताब',
    'कलम', 'घर', 'सडक', 'पहाड', 'नदी', 'काठमाडौँ', 'सुन्दर', 'स्वास्थ्य', 'परिश्रम', 'सफलता',
    'देश', 'संस्कृति', 'समाचार', 'कम्प्युटर', 'प्रविधि', 'खेल', 'कृषि', 'यात्रा', 'संगीत', 'समाज',
  ];
  const words = Array.from({ length: 300 }, (_, i) => ({
    type: 'word', seedKey: `starter-word-${i + 1}`, text: base[i % base.length], difficulty: 1 + Math.floor(i / 100), tags: ['daily'],
  }));
  const sentences = Array.from({ length: 100 }, (_, i) => ({
    type: 'sentence', seedKey: `starter-sentence-${i + 1}`, text: `${base[i % base.length]} हाम्रो जीवनको महत्वपूर्ण हिस्सा हो।`,
    difficulty: 1 + Math.floor(i / 35), tags: ['daily', 'practice'],
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
