import {buildMetadata} from '@/lib/seo';import {getSeoPage} from '@/lib/seo-pages';import {SeoLanding} from '@/components/SeoLanding';
export function generateMetadata(){const p=getSeoPage('lok-sewa-typing-practice')!;return buildMetadata({title:p.title,description:p.description,path:'/lok-sewa-typing-practice'})}export default function Page(){return <SeoLanding slug="lok-sewa-typing-practice"/>}
