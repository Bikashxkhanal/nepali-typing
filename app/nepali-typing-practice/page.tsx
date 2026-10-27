import {buildMetadata} from '@/lib/seo';import {getSeoPage} from '@/lib/seo-pages';import {SeoLanding} from '@/components/SeoLanding';
export function generateMetadata(){const p=getSeoPage('nepali-typing-practice')!;return buildMetadata({title:p.title,description:p.description,path:'/nepali-typing-practice'})}export default function Page(){return <SeoLanding slug="nepali-typing-practice"/>}
