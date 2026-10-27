import Link from 'next/link';
import {SiteHeader} from './SiteHeader';
import {LazyTypingPractice,LazyIntermediatePractice} from './LazyTypingWidgets';
import {Breadcrumbs,FaqSection,RelatedLinks} from './SeoContent';
import {JsonLd} from './JsonLd';
import {getSeoPage,seoPageExtras} from '@/lib/seo-pages';

const related=[
 {href:'/nepali-typing-test',label:'Nepali typing speed test'},
 {href:'/nepali-typing-practice',label:'Nepali typing practice'},
 {href:'/preeti-typing',label:'Preeti typing practice'},
 {href:'/unicode-nepali-typing',label:'Unicode Nepali typing'},
 {href:'/inscript-nepali-typing',label:'Inscript keyboard practice'},
 {href:'/romanized-nepali-typing',label:'Romanized Nepali typing'},
 {href:'/lok-sewa-typing-practice',label:'Lok Sewa typing preparation'},
 {href:'/learn',label:'Guided Nepali typing lessons'},
 {href:'/blog',label:'Nepali typing guides'},
];
export function SeoLanding({slug}:{slug:string}){const page=getSeoPage(slug);if(!page)return null;return <><SiteHeader/><main className="container-marketing seo-page"><Breadcrumbs items={[{name:'Home',href:'/'},{name:page.h1}]}/><header className="seo-hero"><p className="eyebrow">{page.eyebrow}</p><h1>{page.h1}</h1><p className="seo-lead">{page.lead}</p><div className="hero-actions"><Link className="button" href="#typing-tool">Start free practice</Link><Link className="button secondary" href="/learn">Explore beginner lessons</Link></div><p className="seo-updated">Last updated: <time dateTime={page.updated}>{page.updated}</time></p></header><section className="seo-copy" aria-label={`${page.h1} guide`}>{page.paragraphs.map((p,i)=><p key={i}>{p}</p>)}<p>{seoPageExtras[slug]}</p></section><section id="typing-tool" className="seo-tool"><h2>Practice now</h2>{page.tool==='practice'?<LazyIntermediatePractice/>:page.tool==='learn'?<p>Start with <Link href="/learn">the beginner lesson course</Link>, then continue into sentence practice.</p>:<LazyTypingPractice level={page.tool==='test'||page.tool==='preeti'?3:2}/>}</section><FaqSection faqs={page.faq}/><RelatedLinks links={related}/><JsonLd data={{'@context':'https://schema.org','@type':'WebApplication',name:`${page.h1} | NepaliTyping`,applicationCategory:'EducationalApplication',operatingSystem:'Any',isAccessibleForFree:true,inLanguage:['en','ne'],description:page.description,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}}}/></main></>}
