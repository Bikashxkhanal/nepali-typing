'use client';
import dynamic from 'next/dynamic';
const WidgetFallback=()=> <div className="typing-widget-skeleton" aria-label="Preparing typing practice"><span>Preparing your typing area…</span><div className="skeleton-lines"/></div>;
const TypingPractice=dynamic(()=>import('./TypingPractice').then(module=>module.TypingPractice),{ssr:false,loading:WidgetFallback});
const IntermediatePractice=dynamic(()=>import('./IntermediatePractice').then(module=>module.IntermediatePractice),{ssr:false,loading:WidgetFallback});
const LessonPlayer=dynamic(()=>import('./LessonPlayer').then(module=>module.LessonPlayer),{ssr:false,loading:WidgetFallback});
const LessonProgress=dynamic(()=>import('./LessonProgress').then(module=>module.LessonProgress),{ssr:false,loading:()=> <div className="lesson-skeleton" aria-label="Loading lesson progress"/>});
export function LazyTypingPractice({level}:{level:1|2|3}){return <TypingPractice level={level}/>}
export function LazyIntermediatePractice(){return <IntermediatePractice/>}
export function LazyLessonPlayer({lessonId}:{lessonId:string}){return <LessonPlayer lessonId={lessonId}/>}
export function LazyLessonProgress(){return <LessonProgress/>}
