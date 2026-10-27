'use client';
import {useCallback,useEffect,useMemo,useReducer,useRef} from 'react';
import type React from 'react';
import {getLayout} from '@/lib/layouts';
import {ExpectedKey,initialTypingState,getExpectedKeystrokes,typingReducer,TypingState} from '@/lib/typing-engine';

export function useTypingEngine({target,layoutId,stopOnError=false,onComplete}:{target:string;layoutId:string;stopOnError?:boolean;onComplete?:(state:TypingState)=>void}){
 const [state,dispatch]=useReducer(typingReducer,initialTypingState);const timeout=useRef<ReturnType<typeof setTimeout>|null>(null);const callback=useRef(onComplete);const completed=useRef(false);callback.current=onComplete;
 const expected=useMemo(()=>getExpectedKeystrokes(target,getLayout(layoutId)),[target,layoutId]);
 useEffect(()=>{completed.current=false;dispatch({type:'RESET'});return()=>{if(timeout.current)clearTimeout(timeout.current)}},[target,layoutId]);
 useEffect(()=>{if(expected.length&&state.cursor>=expected.length&&!completed.current){completed.current=true;callback.current?.(state)}},[state.cursor,expected.length,state]);
 const flash=useCallback(()=>{if(timeout.current)clearTimeout(timeout.current);timeout.current=setTimeout(()=>dispatch({type:'CLEAR_FLASH'}),200)},[]);
 const onKeyDown=useCallback((e:React.KeyboardEvent<HTMLDivElement>)=>{
  const key=e.key;const altGr=e.getModifierState('AltGraph')||(e.altKey&&e.ctrlKey);
  if(['Shift','Control','Alt','Meta','CapsLock','Tab'].includes(key)||key.startsWith('F')&&/^F\d+$/.test(key))return;
  if((e.metaKey||e.ctrlKey)&&!altGr&&key.toLowerCase()!=='backspace')return;
  if(key==='Backspace'){
   e.preventDefault();dispatch({type:'BACKSPACE',word:e.ctrlKey||e.altKey||e.metaKey,expected});return;
  }
  if(key==='Enter'||key==='Escape'||key==='Dead'||key==='Process')return;
  const mapping=getLayout(layoutId).mapping[e.code];let output=key===' '?mapping?.normal??' ':mapping?.[altGr?'altGr':e.shiftKey?'shift':'normal'];
  if(!output&&key.length===1)output='\uFFFD';
  if(!output)return;
  e.preventDefault();const current:ExpectedKey=expected[state.cursor]??{code:null,output:'',graphemeIndex:-1};
  dispatch({type:'PRESS',code:e.code,output,expected:current,stopOnError});flash();
 },[expected,layoutId,state.cursor,stopOnError,flash]);
 // Keep the visual flash alive for its short 200 ms window; keyup cannot leave
 // it stuck because every new press replaces this timer and blur also expires it.
 const onKeyUp=useCallback(()=>{},[]);
 const reset=useCallback(()=>dispatch({type:'RESET'}),[]);
 return {state,expected,onKeyDown,onKeyUp,reset,expectedKey:expected[state.cursor],complete:expected.length>0&&state.cursor>=expected.length,accuracy:state.totalKeystrokes?Math.round(state.correctKeystrokes/state.totalKeystrokes*100):100};
}
