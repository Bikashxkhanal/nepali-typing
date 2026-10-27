export const lessonGroups=[
 {id:'vowels',title:'Vowels',letters:'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं अः'.split(' ')},
 ...[['क ख ग घ ङ','कवर्ग'],['च छ ज झ ञ','चवर्ग'],['ट ठ ड ढ ण','टवर्ग'],['त थ द ध न','तवर्ग'],['प फ ब भ म','पवर्ग'],['य र ल व','अन्तःस्थ'],['श ष स ह','ऊष्म'],['क्ष त्र ज्ञ','संयुक्ताक्षर']].map(([letters,title],i)=>({id:`group-${i+1}`,title,letters:letters.split(' ')})),
 {id:'matras',title:'Matras & signs',letters:'ा ि ी ु ू े ै ो ौ ं ः ्'.split(' ')},
 {id:'numbers',title:'Numbers',letters:'० १ २ ३ ४ ५ ६ ७ ८ ९'.split(' ')}
];
export const drills=['नेपाल हाम्रो सुन्दर देश हो।','म नेपाली भाषा सिक्दै छु।','ज्ञान र अभ्यासले गति बढ्छ।','आजको अभ्यास भोलिको सफलता हो।'];
