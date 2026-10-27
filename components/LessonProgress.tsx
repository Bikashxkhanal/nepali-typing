'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {lessonGroups} from '@/lib/lessons';

type Saved = Record<string,{completed?:boolean;stars?:number;accuracy?:number;drillsDone?:number}>;
export function LessonProgress(){
 const [saved,setSaved]=useState<Saved>({}); const [loaded,setLoaded]=useState(false); const [streak,setStreak]=useState(0);
 useEffect(()=>{try{const value=JSON.parse(localStorage.getItem('nt-lessons')||'{}');setSaved(Array.isArray(value)?Object.fromEntries(value.map((i:number)=>[lessonGroups[i]?.id,{completed:true,stars:3}])):value);setStreak(Number(localStorage.getItem('nt-streak')||0))}catch{setSaved({})}setLoaded(true)},[]);
 const done=lessonGroups.filter(x=>saved[x.id]?.completed).length;
 return <><div className="progress-summary"><strong>{done} / {lessonGroups.length} lessons</strong><span>{Math.round(done/lessonGroups.length*100)}% complete</span><span>🔥 {streak} day streak</span></div><div className="lesson-sections">{loaded?lessonGroups.map((x,i)=>{const s=saved[x.id],unlocked=i===0||!!saved[lessonGroups[i-1].id]?.completed,status=s?.completed?'completed':s?.drillsDone?'in-progress':unlocked?'unlocked':'locked';return <article className={`lesson-card lesson-${status}`} key={x.id}><div className="lesson-glyph">{x.letters[0]}</div><div className="lesson-card-meta"><h3>{x.title}</h3><p>{x.letters.join('　')}</p><span className="lesson-badge">{status==='locked'?'🔒 Locked':status==='completed'?'Completed':status==='in-progress'?'In progress':'Ready'}</span></div><div className="lesson-stars">{'★'.repeat(s?.stars||0)}{'☆'.repeat(3-(s?.stars||0))}</div>{unlocked?<Link className="button" href={`/learn/${x.id}`}>{status==='completed'?'Review':status==='in-progress'?'Continue':'Start Learning'}</Link>:<button className="button subtle" disabled>Locked</button>}</article>}):lessonGroups.map(x=><div key={x.id} className="lesson-skeleton"/> )}</div></>
}
