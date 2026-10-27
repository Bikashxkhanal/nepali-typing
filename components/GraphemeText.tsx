'use client';
import {memo,useEffect,useRef} from 'react';
import type {TypingState,ExpectedKey} from '@/lib/typing-engine';
const GraphemeSpan=memo(function GraphemeSpan({text,className,index,partial}:{text:string;className:string;index:number;partial:boolean}){const ref=useRef<HTMLSpanElement>(null);useEffect(()=>{if(className==='current-char')ref.current?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'})},[className]);return <span ref={ref} data-index={index} data-partial={partial||undefined} className={`${className} ${text===' '?'typing-space':''}`}>{text}</span>});
export function GraphemeText({target,expected,state}:{target:string;expected:ExpectedKey[];state:TypingState}){
 const clusters=typeof Intl!=='undefined'&&'Segmenter' in Intl?[...new Intl.Segmenter('ne',{granularity:'grapheme'}).segment(target)].map(x=>x.segment):Array.from(target.normalize('NFC'));
 const slotsByGrapheme=Array.from({length:clusters.length},()=>[] as number[]);expected.forEach((item,slot)=>{if(item.graphemeIndex>=0&&slotsByGrapheme[item.graphemeIndex])slotsByGrapheme[item.graphemeIndex].push(slot)});
 return <div className="target-text target-large grapheme-target">{clusters.map((text,index)=>{const slots=slotsByGrapheme[index];let wrong=false,filled=slots.length>0,partial=false;for(const slot of slots){const attempt=state.attempts[slot];if(attempt&&!attempt.correct)wrong=true;if(!attempt?.correct)filled=false;if(attempt?.correct)partial=true}const current=!filled&&!wrong&&slots.includes(state.cursor);const status=wrong?'typed-wrong':filled?'typed-correct':current?'current-char':'pending-char';return <GraphemeSpan key={index} index={index} text={text} className={status} partial={!!(current&&partial)}/>})}</div>
}
