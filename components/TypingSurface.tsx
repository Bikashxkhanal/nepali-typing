'use client';
import {useEffect,useRef,useState} from 'react';
import type React from 'react';
import {GraphemeText} from './GraphemeText';
import type {ExpectedKey,TypingState} from '@/lib/typing-engine';
export function TypingSurface({target,expected,state,onKeyDown,onKeyUp,label}:{target:string;expected:ExpectedKey[];state:TypingState;onKeyDown:(e:React.KeyboardEvent<HTMLDivElement>)=>void;onKeyUp:()=>void;label:string}){
 const ref=useRef<HTMLDivElement>(null);const [focused,setFocused]=useState(false);
 useEffect(()=>{const frame=requestAnimationFrame(()=>ref.current?.focus());return()=>cancelAnimationFrame(frame)},[target]);
 useEffect(()=>{const blur=()=>{setFocused(false);onKeyUp()};window.addEventListener('blur',blur);return()=>window.removeEventListener('blur',blur)},[onKeyUp]);
 return <div className="typing-surface-wrap"><div ref={ref} tabIndex={0} role="textbox" aria-label={label} aria-live="off" aria-multiline="true" className={`typing-card typing-surface ${focused?'is-focused':'is-blurred'}`} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onClick={()=>ref.current?.focus()} onPaste={e=>e.preventDefault()} onDrop={e=>e.preventDefault()}><GraphemeText target={target} expected={expected} state={state}/>{!focused&&<div className="typing-focus-overlay" onClick={e=>{e.stopPropagation();ref.current?.focus()}}>Click here or press any key to continue typing</div>}</div></div>
}
