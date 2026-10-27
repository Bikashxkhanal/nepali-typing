import traditional from './traditional'; import romanized from './romanized'; import preeti from './preeti'; import inscript from './inscript'; import macos from './macos';
import {practiceSentences} from '../sentences';
export const layouts=[traditional,romanized,preeti,inscript,macos];
// Extra Unicode outputs used by the seeded Intermediate sentence pool.
// These occupy number-row positions unused by the starter maps so all layouts
// can type the same practice corpus, including retroflex letters and punctuation.
for (const layout of layouts) {
  layout.mapping.Digit1 ??= {normal:'ड',shift:'ढ'};
  layout.mapping.Digit2 ??= {normal:'ठ',shift:'ट'};
  layout.mapping.Digit3 ??= {normal:'‍',shift:'‍'};
  layout.mapping.Digit4 ??= {normal:',',shift:','};
  layout.mapping.Digit5 ??= {normal:'ष',shift:'ष'};
  layout.mapping.Digit6 ??= {normal:'ञ',shift:'ञ'};
  layout.mapping.Digit7 ??= {normal:'ज',shift:'ज'};
  layout.mapping.Digit8 ??= {normal:'क',shift:'क'};
  layout.mapping.Digit9 ??= {normal:'्',shift:'्'};
  const corpusChars=[...new Set(practiceSentences.flatMap(sentence=>[...sentence.text].filter(char=>char!==' ')))];
  const available=['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','Digit0','Minus','Equal','BracketLeft','BracketRight','Backslash','Semicolon','Quote','Comma','Period','Slash','Backquote',...'QWERTYUIOPASDFGHJKLZXCVBNM'.split('').map(char=>`Key${char}`)];
  for(const char of corpusChars){
    if(Object.values(layout.mapping).some(key=>key.normal===char||key.shift===char||key.altGr===char))continue;
    const shiftSlot=available.find(code=>layout.mapping[code]&&layout.mapping[code].shift===layout.mapping[code].normal);
    if(shiftSlot){layout.mapping[shiftSlot]={...layout.mapping[shiftSlot],shift:char};continue}
    const free=available.find(code=>!layout.mapping[code]);
    if(free)layout.mapping[free]={normal:char,shift:char};
  }
}
export const getLayout=(id:string)=>layouts.find(l=>l.id===id)??traditional;
export * from './types';
