export const lessonGroups=[
 {id:'vowels',title:'Vowels',letters:'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं अः'.split(' ')},
 ...[['क ख ग घ ङ','कवर्ग'],['च छ ज झ ञ','चवर्ग'],['ट ठ ड ढ ण','टवर्ग'],['त थ द ध न','तवर्ग'],['प फ ब भ म','पवर्ग'],['य र ल व','अन्तःस्थ'],['श ष स ह','ऊष्म'],['क्ष त्र ज्ञ','संयुक्ताक्षर']].map(([letters,title],i)=>({id:`group-${i+1}`,title,letters:letters.split(' ')})),
 {id:'matras',title:'Matras & signs',letters:'ा ि ी ु ू े ै ो ौ ं ः ्'.split(' ')},
 {id:'numbers',title:'Numbers',letters:'० १ २ ३ ४ ५ ६ ७ ८ ९'.split(' ')}
];
export const drills=['नेपाल हाम्रो सुन्दर देश हो।','म नेपाली भाषा सिक्दै छु।','ज्ञान र अभ्यासले गति बढ्छ।','आजको अभ्यास भोलिको सफलता हो।'];

export const LESSON_PASS_ACCURACY = 85;
export const passesLesson = (accuracy:number) => accuracy >= LESSON_PASS_ACCURACY;
export function lessonIsUnlocked(index:number, completedIds:string[]) { return index===0 || completedIds.includes(lessonGroups[index-1]?.id); }
export type LessonItem = { id: string; text: string; kind: 'character'|'repeat'|'combination'|'word' };
export function lessonPool(lessonId: string, layoutId: string): LessonItem[] {
  // Draw only outputs available on the selected physical layout. Every item is an
  // individual key output or a sequence assembled from those outputs.
  const layout = requireLayout(layoutId);
  const chars = [...new Set(Object.values(layout.mapping).flatMap((x) => [x.normal, x.shift, x.altGr]).filter((x): x is string => !!x && x !== ' '))];
  const words = ['नेपाल','भाषा','किताब','घर','ज्ञान','कलम','समय','सफलता','अभ्यास','साथी'];
  const prefix = lessonId.replace(/[^a-z0-9-]/gi, '');
  const items: LessonItem[] = [];
  chars.forEach((text, i) => items.push({id:`${prefix}-c-${i}`,text,kind:'character'}));
  chars.forEach((text, i) => items.push({id:`${prefix}-r-${i}`,text:text.repeat(3),kind:'repeat'}));
  chars.forEach((a, i) => chars.slice(i+1).forEach((b,j) => items.push({id:`${prefix}-x-${i}-${j}`,text:a+b,kind:'combination'})));
  words.filter(w => [...w].every(ch => chars.some(c => c === ch))).forEach((text,i)=>items.push({id:`${prefix}-w-${i}`,text,kind:'word'}));
  return items;
}
function requireLayout(id:string) {
  // Static import is avoided here so the lesson data remains reusable by tests.
  return layoutRegistry[id] ?? layoutRegistry.traditional;
}
import traditional from './layouts/traditional';
import romanized from './layouts/romanized';
import preeti from './layouts/preeti';
import inscript from './layouts/inscript';
import macos from './layouts/macos';
const layoutRegistry: Record<string, typeof traditional> = {traditional,romanized,preeti,inscript,macos};
export function shuffleLessonSession(pool: LessonItem[], previousIds: string[] = [], count = 24, random = Math.random): LessonItem[] {
  const excluded = new Set(previousIds);
  let eligible = pool.filter(item => !excluded.has(item.id));
  if (eligible.length < count) eligible = pool;
  const shuffled = [...eligible];
  for (let i=shuffled.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]; }
  return shuffled.slice(0,count);
}
