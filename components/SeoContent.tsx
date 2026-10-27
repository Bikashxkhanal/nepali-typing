import Link from 'next/link';
import {JsonLd} from './JsonLd';
import {siteUrl} from '@/lib/seo';

export type Faq={q:string;a:string};
export function Breadcrumbs({items}:{items:{name:string;href?:string}[]}){const nodes=items.map((item,index)=><span key={item.name}>{index>0&&<span aria-hidden="true"> / </span>}{item.href?<Link href={item.href}>{item.name}</Link>:<span aria-current="page">{item.name}</span>}</span>);return <><nav aria-label="Breadcrumb" className="seo-breadcrumb">{nodes}</nav><JsonLd data={{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:item.href?new URL(item.href,siteUrl()).toString():undefined}))}}/></>}
export function FaqSection({faqs}:{faqs:Faq[]}){return <section className="seo-faq"><h2>Frequently asked questions</h2>{faqs.map(({q,a})=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}<JsonLd data={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(({q,a})=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}}/></section>}
export function RelatedLinks({links}:{links:{href:string;label:string}[]}){return <nav aria-label="Related typing resources" className="related-links"><h2>Explore related resources</h2><ul>{links.map(link=><li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></nav>}
