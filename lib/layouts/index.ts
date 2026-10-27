import traditional from './traditional'; import romanized from './romanized'; import preeti from './preeti'; import inscript from './inscript'; import macos from './macos';
export const layouts=[traditional,romanized,preeti,inscript,macos];
export const getLayout=(id:string)=>layouts.find(l=>l.id===id)??traditional;
export * from './types';
