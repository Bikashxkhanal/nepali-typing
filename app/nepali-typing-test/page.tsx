import {buildMetadata} from '@/lib/seo';import {getSeoPage} from '@/lib/seo-pages';import {SeoLanding} from '@/components/SeoLanding';
export function generateMetadata(){const p=getSeoPage('nepali-typing-test')!;return buildMetadata({title:p.title,description:p.description,path:'/nepali-typing-test'})}export default function Page(){return <SeoLanding slug="nepali-typing-test"/>}
