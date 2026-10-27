'use client';
import {useEffect,useRef,useState} from 'react';
import type React from 'react';
import {GraphemeText} from './GraphemeText';
import type {ExpectedKey,TypingState} from '@/lib/typing-engine';
import {getLayout} from '@/lib/layouts';
export function TypingSurface({target,layoutId,expected,state,onKeyDown,onKeyUp,onRestart,label}:{target:string;layoutId:string;expected:ExpectedKey[];state:TypingState;onKeyDown:(e:React.KeyboardEvent<HTMLDivElement>)=>void;onKeyUp:()=>void;onRestart:()=>void;label:string}){
 const ref=useRef<HTMLDivElement>(null);const tabTimer=useRef<ReturnType<typeof setTimeout>|null>(null);const [focused,setFocused]=useState(false),[paused,setPaused]=useState(false);
 useEffect(()=>{const frame=requestAnimationFrame(()=>ref.current?.focus());return()=>cancelAnimationFrame(frame)},[target]);
 useEffect(()=>{const blur=()=>{setFocused(false);onKeyUp()};window.addEventListener('blur',blur);return()=>{window.removeEventListener('blur',blur);if(tabTimer.current)clearTimeout(tabTimer.current)}},[onKeyUp]);
 function handleKeyDown(event:React.KeyboardEvent<HTMLDivElement>){if(event.key==='Tab'){event.preventDefault();if(tabTimer.current)clearTimeout(tabTimer.current);tabTimer.current=setTimeout(()=>{tabTimer.current=null},700);return}if(event.key==='Enter'&&tabTimer.current){event.preventDefault();clearTimeout(tabTimer.current);tabTimer.current=null;onRestart();return}if(event.key==='Escape'){event.preventDefault();setPaused(value=>!value);return}if(paused){if(!['Shift','Control','Alt','Meta'].includes(event.key)){event.preventDefault();setPaused(false);ref.current?.focus()}return}onKeyDown(event)}
 return <div className="typing-surface-wrap"><div ref={ref} tabIndex={0} role="textbox" aria-label={label} aria-live="off" aria-multiline="true" className={`typing-card typing-surface ${focused&&!paused?'is-focused':'is-blurred'}`} onKeyDown={handleKeyDown} onKeyUp={onKeyUp} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onClick={()=>ref.current?.focus()} onPaste={e=>e.preventDefault()} onDrop={e=>e.preventDefault()}><GraphemeText target={target} expected={expected} state={state}/>{(!focused||paused)&&<div className="typing-focus-overlay" onClick={e=>{e.stopPropagation();setPaused(false);ref.current?.focus()}}>{paused?'Paused · press any key or click to continue':'Click here or press any key to continue typing'}</div>}</div><div className="typing-footer-hints"><span>Tab + Enter to restart</span><span>Esc to pause</span><span>{getLayout(layoutId).name}</span></div></div>
}
