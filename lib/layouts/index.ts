import traditional from './traditional'; import romanized from './romanized'; import preeti from './preeti'; import inscript from './inscript'; import macos from './macos';
export const layouts=[traditional,romanized,preeti,inscript,macos];
// Extra Unicode outputs used by the seeded Intermediate sentence pool.
// These occupy number-row positions unused by the starter maps so all layouts
// can type the same practice corpus, including retroflex letters and punctuation.
for (const layout of layouts) {
  layout.mapping.Digit1 ??= {normal:'ड',shift:'ढ'};
  layout.mapping.Digit2 ??= {normal:'ठ',shift:'ट'};
  layout.mapping.Digit3 ??= {normal:'‍',shift:'‍'};
  layout.mapping.Digit4 ??= {normal:',',shift:','};
}
export const getLayout=(id:string)=>layouts.find(l=>l.id===id)??traditional;
export * from './types';
