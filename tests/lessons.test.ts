import {describe,it,expect} from 'vitest';
import {LESSON_PASS_ACCURACY,lessonIsUnlocked,lessonPool,passesLesson,shuffleLessonSession} from '../lib/lessons';

describe('lesson progression',()=>{
 it('shuffles two sessions for the same lesson',()=>{const pool=lessonPool('vowels','traditional');const a=shuffleLessonSession(pool,[],20,()=>0.23);const b=shuffleLessonSession(pool,a.map(x=>x.id),20,()=>0.71);expect(a.map(x=>x.id)).not.toEqual(b.map(x=>x.id));});
 it('requires at least 85 percent accuracy',()=>{expect(LESSON_PASS_ACCURACY).toBe(85);expect(passesLesson(84.99)).toBe(false);expect(passesLesson(85)).toBe(true)});
 it('unlocks lessons in order',()=>{expect(lessonIsUnlocked(0,[])).toBe(true);expect(lessonIsUnlocked(1,[])).toBe(false);expect(lessonIsUnlocked(1,['vowels'])).toBe(true)});
});
