import type {KeyboardLayout} from './layouts/types';

export type ExpectedKey={code:string|null;output:string;graphemeIndex:number};
export type Keystroke={output:string;correct:boolean;code:string};
export type TypingState={attempts:Record<number,Keystroke>;cursor:number;totalKeystrokes:number;correctKeystrokes:number;errors:number;corrected:number;errorByGrapheme:Record<number,number>;pressedKey:string;flashCorrect:boolean|null;blocked:boolean};
export type TypingAction={type:'PRESS';code:string;output:string;expected:ExpectedKey;stopOnError:boolean}|{type:'BACKSPACE';word?:boolean;expected:ExpectedKey[]}|{type:'CLEAR_FLASH'}|{type:'RESET'};
export const initialTypingState:TypingState={attempts:{},cursor:0,totalKeystrokes:0,correctKeystrokes:0,errors:0,corrected:0,errorByGrapheme:{},pressedKey:'',flashCorrect:null,blocked:false};

export function getExpectedKeystrokes(text:string,layout:KeyboardLayout):ExpectedKey[]{
 const clusters=typeof Intl!=='undefined'&&'Segmenter' in Intl?[...new Intl.Segmenter('ne',{granularity:'grapheme'}).segment(text)].map(x=>x.segment):Array.from(text.normalize('NFC'));
 const entries=Object.entries(layout.mapping);const result:ExpectedKey[]=[];
 const find=(value:string)=>{for(const [code,key] of entries){if(key.normal===value)return {code,output:value};if(key.shift===value)return {code,output:value};if(key.altGr===value)return {code,output:value}}return null};
 clusters.forEach((cluster,graphemeIndex)=>{
  // Break common conjuncts and matras into their actual Unicode key sequence.
  // If the selected map exposes a whole grapheme as a single key, use it only
  // when the code points cannot be entered separately.
  const parts=Array.from(cluster.normalize('NFC'));const split=parts.map(find);
  if(split.length>1&&split.every(Boolean)){for(const key of split)result.push({...key!,graphemeIndex});return}
  const whole=find(cluster);if(whole){result.push({...whole,graphemeIndex});return}
  for(let i=0;i<parts.length;i++){const part=find(parts[i]);result.push({code:part?.code??null,output:parts[i],graphemeIndex})}
 });
 return result;
}
export function typingReducer(state:TypingState,action:TypingAction):TypingState{
 if(action.type==='CLEAR_FLASH')return {...state,pressedKey:'',flashCorrect:null};
 if(action.type==='RESET')return initialTypingState;
 if(action.type==='PRESS'){
  if(state.blocked)return {...state,pressedKey:action.code,flashCorrect:false};
  const correct=action.output===action.expected.output;const attempts={...state.attempts,[state.cursor]:{output:action.output,correct,code:action.code}};
  const errorByGrapheme=correct?state.errorByGrapheme:{...state.errorByGrapheme,[action.expected.graphemeIndex]:(state.errorByGrapheme[action.expected.graphemeIndex]||0)+1};
  return {...state,attempts,cursor:state.cursor+(correct||!action.stopOnError?1:0),totalKeystrokes:state.totalKeystrokes+1,correctKeystrokes:state.correctKeystrokes+(correct?1:0),errors:state.errors+(correct?0:1),errorByGrapheme,pressedKey:action.code,flashCorrect:correct,blocked:!correct&&action.stopOnError};
 }
 if(state.blocked){const attempts={...state.attempts};const blocked=attempts[state.cursor];if(!blocked)return {...state,blocked:false};delete attempts[state.cursor];return {...state,attempts,corrected:state.corrected+1,blocked:false,pressedKey:'',flashCorrect:null}}
 const prior=state.cursor-1;if(prior<0)return state;
 let cursor=prior,attempts={...state.attempts};let corrected=state.corrected;
 if(attempts[prior]){if(!attempts[prior].correct)corrected++;delete attempts[prior]}
 if(action.word){while(cursor>0&&action.expected[cursor-1]?.output!==' '){if(attempts[cursor-1]){if(!attempts[cursor-1].correct)corrected++;delete attempts[cursor-1]}cursor--}if(cursor>0&&action.expected[cursor-1]?.output===' '){if(attempts[cursor-1]){if(!attempts[cursor-1].correct)corrected++;delete attempts[cursor-1]}cursor--}}
 return {...state,attempts,cursor,corrected,blocked:false,pressedKey:'',flashCorrect:null};
}
