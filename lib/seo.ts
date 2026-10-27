import type {Metadata} from 'next';

export const siteUrl=()=>process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';
export const seoAlternates:Record<string,string>={
  '/':'/ne','/nepali-typing-test':'/ne/nepali-typing-test','/nepali-typing-practice':'/ne/nepali-typing-practice',
  '/preeti-typing':'/ne/preeti-typing','/unicode-nepali-typing':'/ne/unicode-nepali-typing',
  '/inscript-nepali-typing':'/ne/inscript-nepali-typing','/romanized-nepali-typing':'/ne/romanized-nepali-typing',
  '/lok-sewa-typing-practice':'/ne/lok-sewa-typing-practice','/learn':'/ne/learn','/blog':'/ne/blog',
  '/preeti-to-unicode':'/ne/preeti-to-unicode','/about':'/ne/about','/contact':'/ne/contact',
};
function searchDescription(input:string){let value=input.trim();if(value.length<140)value+=' Start free practice today and build your Nepali typing skills.';if(value.length<140)value+=' Try a lesson today.';if(value.length>160)value=value.slice(0,157).replace(/\s+\S*$/,'');return value}
function compactTitle(input:string,max:number){const words=input.trim().split(/\s+/);let out='';for(const word of words){const next=out?`${out} ${word}`:word;if(next.length>max)break;out=next}while(/\b(?:and|or|for|of|with|in|to|the|a|an|vs|at|by)$/i.test(out))out=out.replace(/\s+\S+$/,'');return out||input.slice(0,max)}
export function buildMetadata({title,description,path,ogImage='/opengraph-image',locale='en_US',noindex=false}: {title:string;description:string;path:string;ogImage?:string;locale?:string;noindex?:boolean}):Metadata{
  const base=new URL(siteUrl());
  const enPath=path.startsWith('/ne/')?path.slice(3):path==='/ne'?'/':path;
  const nePath=seoAlternates[enPath];
  const parsedPath=new URL(path,base);const noindexQuery=[...parsedPath.searchParams.keys()].some(key=>['q','query','search','filter','difficulty','layout'].includes(key.toLowerCase()));
  parsedPath.search='';parsedPath.hash='';const canonical=parsedPath.toString();
  const languages=nePath?{en:new URL(enPath,base).toString(),ne:new URL(nePath,base).toString(),'x-default':new URL(enPath,base).toString()}:undefined;
  const suffix=' | NepaliTyping',maxPrefix=60-suffix.length;const displayTitle=title.length+suffix.length<=60?title:compactTitle(title,maxPrefix);const metaDescription=searchDescription(description);
  return {metadataBase:base,title:displayTitle,description:metaDescription,alternates:{canonical,languages},openGraph:{title:`${displayTitle}${suffix}`,description:metaDescription,url:canonical,siteName:'NepaliTyping',type:'website',locale,images:[{url:ogImage,width:1200,height:630,alt:'NepaliTyping learning and practice tools'}]},twitter:{card:'summary_large_image',title:`${displayTitle}${suffix}`,description:metaDescription,images:[ogImage]},robots:noindex||noindexQuery?{index:false,follow:false}:{index:true,follow:true}};
}

